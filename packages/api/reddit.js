const snoowrap = require('snoowrap');

module.exports = (accessToken) => {
    // 7s per 100 items = 21s avg. response time
    // Fetch breaks as it exceeds APIGW 29s timeout if too many saved items are fetched.
    const MAX_ITEM_COUNT = 300;

    const reddit = new snoowrap({
        userAgent: 'web:redditmark.apps.sgfault.com:0.2.1 (dev)',
        accessToken,
    });

    const getSavedItems = async ({ limit = MAX_ITEM_COUNT, after = '' } = {}) => {
        const savedItems = await reddit
            .getMe()
            .getSavedContent({ limit, after });
        if (!savedItems.length) {
            return { items: [], next: '' };
        }
        const lastItemId = savedItems.slice(-1)[0].name;
        return { items: savedItems, next: lastItemId };
    };

    const getComments = async ({ limit = MAX_ITEM_COUNT, after = '' } = {}) => {
        const comments = await reddit
            .getMe()
            .getComments({ limit, after });
        console.log(comments);
        if (!comments.length) {
            return { items: [], next: '' };
        }
        //const lastItemId = comments.slice(-1)[0].name;
        return { items: comments, next: '' };
        //return { items: comments, next: lastItemId };
    };

    return {
        getComments,
        getSavedItems,
    };
};
