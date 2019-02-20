import snoowrap from 'snoowrap';

export default (accessToken) => {
    const reddit = new snoowrap({
        userAgent: 'web:redditmark.apps.sgfault.com:0.2.0 (dev)',
        accessToken,
    });

    async function getSavedItems() {
        return await reddit
            .getMe()
            .getSavedContent()
            .fetchAll();
    }

    return {
        getSavedItems,
    };
};
