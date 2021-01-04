#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RedditmarkStack } from '../lib/redditmark-stack';

const app = new cdk.App();

new RedditmarkStack(app, 'redditmark-dev', {
  stage: 'dev',
  deploySiteBucket: false,
  debugEnabled: true,
});
new RedditmarkStack(app, 'redditmark-prod', {
  stage: 'prod',
});
