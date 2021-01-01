const base = require('node-app-base')('redditmark-api');
const awsServerlessExpress = require('aws-serverless-express');

const { config, logger } = base;
config.set({
});

const createReddit = require('./reddit');

const app = require('./app')(
    logger,
    awsServerlessExpress,
    createReddit,
);

exports.handler = (event, context) => {
    app.run(event, context);
};
