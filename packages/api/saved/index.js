const base = require('node-app-base')('redditmark-api');
const SavedItemRepository = require('../data/savedItemRepository');

const { config, logger } = base;
config.set({
    DEBUG_ENABLED: {
        type: 'boolean',
        default: false,
    }
});

const createReddit = require('../reddit');

exports.handler = async (event) => {
    if (config.get('DEBUG_ENABLED')) {
        logger.info('apigateway.event', { event });
    }

    const authorisationHeader = event.headers.authorization;
    if (!authorisationHeader) {
        return {
            headers: { 'Content-Type': 'application/json' },
            statusCode: 403,
            errorMessage: 'No auth token was provided with request',
        };
    }

    const token = authorisationHeader.slice(authorisationHeader.indexOf(' ') + 1);
    const reddit = createReddit(token);
    const savedItemRepository = SavedItemRepository(reddit);

    const { rawQueryString } = event;
    const fetchAfterIndex = rawQueryString
        ? rawQueryString.match(/idx=(.*)/)[1]
        : '';
    let response = null;

    try {
        response = await savedItemRepository.getSavedItems(fetchAfterIndex);
    } catch (e) {
        logger.error('app', { error: e.message });
        throw new Error("Unhandled error");
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            next: response.next,
            data: response.data.map(s => s.toObject())
        }),
    };
};
