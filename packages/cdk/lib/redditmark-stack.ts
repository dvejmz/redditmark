import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deployment from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2";
import * as apigwintegrations from "@aws-cdk/aws-apigatewayv2-integrations";

export class RedditmarkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiLambda = new NodejsFunction(this, "api", {
      entry: `${__dirname}/../../api/index.js`,
      timeout: cdk.Duration.seconds(60),
    });

    const authLambda = new NodejsFunction(this, "auth", {
      entry: `${__dirname}/../../auth/index.js`,
      environment: {
        API_CLIENT_ID: "lc3vtl-uKhFj8A",
        API_CLIENT_SECRET: "tf0JsPln8VDzjZaob1PBGsbMpIA",
        CLIENT_URL: "https://redditmark.apps.sgfault.com/saved",
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    const apiGW = new HttpApi(this, "redditmark", {
      corsPreflight: {
        allowOrigins: ["https://redditmark.apps.sgfault.com"],
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

    const uiDistribution = cloudfront.Distribution.fromDistributionAttributes(this, "uiDistribution", {
      distributionId: "E1HD4MZC3HCKSK",
      domainName: "d1bqubjc1c6n2c.cloudfront.net",
    });
    const uiBucket = s3.Bucket.fromBucketName(this, "uiBucket", "redditmark.apps.sgfault.com");
    const uiDeployment = new s3deployment.BucketDeployment(this, "uiBucketDeployment", {
      sources: [ s3deployment.Source.asset(`${__dirname}/../../ui/build`) ],
      destinationBucket: uiBucket,
      distribution: uiDistribution,
      distributionPaths: ['/*'],
    });
  }
}
