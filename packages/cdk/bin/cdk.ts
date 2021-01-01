#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RedditmarkStack } from '../lib/redditmark-stack';

const app = new cdk.App();
new RedditmarkStack(app, 'redditmark');
