const base = require('node-app-base')('redditmark-auth');
const { config, logger } = base;

config.set({
    API_CLIENT_ID: {
        type: 'string',
        required: true,
    },
    API_CLIENT_SECRET: {
        type: 'string',
        required: true,
    },
    CLIENT_URL: {
        type: 'string',
        required: true,
    },
    DEBUG_ENABLED: {
        type: 'boolean',
        default: false,
    }
});

const App = require('./src/app')({
    logger,
    apiClientId: config.get('API_CLIENT_ID'),
    apiClientSecret: config.get('API_CLIENT_SECRET'),
    clientUrl: config.get('CLIENT_URL'),
    debugEnabled: config.get('DEBUG_ENABLED'),
});

exports.handler = async (event) => {
    const debugEnabled = config.get('DEBUG_ENABLED');

    if (debugEnabled) {
        logger.info('apigateway.event', { event });
    }

    const { code } = JSON.parse(event.body);
    logger.info('code', { code, eventBody: event.body });
    const res = await App.handleAuth(code);
    return {
        headers: { 'Content-Type': 'application/json' },
        ...res,
    };
};
