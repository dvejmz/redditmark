const snoowrap = require('snoowrap');

module.exports = (accessToken) => {
    const reddit = new snoowrap({
        userAgent: 'web:redditmark.apps.sgfault.com:0.2.1 (dev)',
        accessToken,
    });

    async function getSavedItems() {
        // TODO: introduce pagination/stream
        // Fetch breaks as it exceed APIGW 29s timeout if too many saved items are fetched.
        return await reddit
            .getMe()
            .getSavedContent({ limit: 300 })
    }

    return {
        getSavedItems,
    };
};
