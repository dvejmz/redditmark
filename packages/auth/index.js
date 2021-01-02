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
});

const App = require('./src/app')(
    logger,
    config.get('API_CLIENT_ID'),
    config.get('API_CLIENT_SECRET'),
    config.get('CLIENT_URL'),
);

exports.handler = async (event) => {
    const { code } = JSON.parse(event.body);
    const res = await App.handleAuth(code);
    return {
        headers: { 'Content-Type': 'application/json' },
        ...res,
    };
};
