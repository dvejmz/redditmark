const base = require('node-app-base')('redditmark-api');
const SavedItemRepository = require('./data/savedItemRepository');

const { config, logger } = base;
config.set({
});

const createReddit = require('./reddit');

exports.handler = async (event, context) => {
    const authorisationHeader = event.headers.authorization;
    if (!authorisationHeader) {
        return {
            headers: { 'Content-Type': 'application/json' },
            statusCode: 400,
            errorMessage: 'No auth token was provided with request',
        };
    }

    const token = authorisationHeader.slice(authorisationHeader.indexOf(' ') + 1);
    const reddit = createReddit(token);
    const savedItemRepository = SavedItemRepository(reddit);
    let savedItems = null;
    try {
        savedItems = await savedItemRepository.getSavedItems();
    } catch (e) {
        logger.error('app', { error: e.message });
        throw new Error("Unhandled error");
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedItems.map(s => s.toObject())),
    };
};
