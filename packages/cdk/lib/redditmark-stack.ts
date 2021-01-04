import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deployment from '@aws-cdk/aws-s3-deployment';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2";
import * as apigwintegrations from "@aws-cdk/aws-apigatewayv2-integrations";

export type Stage = "dev" | "prod";

export interface RedditmarkStackProps extends cdk.StackProps {
  stage: Stage;
  deploySiteBucket?: boolean;
  debugEnabled?: boolean;
}

export class RedditmarkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: RedditmarkStackProps) {
    super(scope, id, props);
    const {
      stage,
      deploySiteBucket = true,
      debugEnabled = false,
    } = props;

    const apiClientId = ssm.StringParameter.valueForStringParameter(
        this, `/redditmark/${stage}/api-client/id`);
    const apiClientSecret = ssm.StringParameter.valueForStringParameter(
        this, `/redditmark/${stage}/api-client/secret`);
    const siteUrl = ssm.StringParameter.valueForStringParameter(
        this, `/redditmark/${stage}/site-url`);
    const apiClientCallbackUrl = `${siteUrl}/saved`;

    const apiLambda = new NodejsFunction(this, "api", {
      entry: `${__dirname}/../../api/index.js`,
      timeout: cdk.Duration.seconds(60),
      environment: {
        DEBUG_ENABLED: debugEnabled.toString(),
      },
    });

    const authLambda = new NodejsFunction(this, "auth", {
      entry: `${__dirname}/../../auth/index.js`,
      environment: {
        API_CLIENT_ID: apiClientId,
        API_CLIENT_SECRET: apiClientSecret,
        CLIENT_URL: apiClientCallbackUrl,
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    const apiGW = new HttpApi(this, `redditmark-${stage}`, {
      corsPreflight: {
        allowOrigins: [siteUrl],
        allowHeaders: ["*"],
        allowCredentials: true,
        allowMethods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.OPTIONS]
      },
    });
    apiGW.addRoutes({
      path: "/saved",
      methods: [ HttpMethod.GET ],
      integration: new apigwintegrations.LambdaProxyIntegration({
        handler: apiLambda,
      })
    });
    apiGW.addRoutes({
      path: "/token",
      methods: [ HttpMethod.POST ],
      integration: new apigwintegrations.LambdaProxyIntegration({
        handler: authLambda,
      })
    });

    if (deploySiteBucket) {
      const siteDistribution = cloudfront.Distribution.fromDistributionAttributes(this, "SiteDistribution", {
        distributionId: "E1HD4MZC3HCKSK",
        domainName: "d1bqubjc1c6n2c.cloudfront.net",
      });
      const siteBucket = s3.Bucket.fromBucketName(this, "SiteBucket", "redditmark.apps.sgfault.com");
      const siteDeployment = new s3deployment.BucketDeployment(this, "SiteBucketDeployment", {
        sources: [ s3deployment.Source.asset(`${__dirname}/../../ui/build`) ],
        destinationBucket: siteBucket,
        distribution: siteDistribution,
        distributionPaths: ['/*'],
      });
    }
  }
}
