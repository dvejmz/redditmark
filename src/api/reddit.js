import snoowrap from 'snoowrap';

export default (accessToken) => {
    const reddit = new snoowrap({
        userAgent: 'web:redditmark.apps.sgfault.com:0.2.0 (dev)',
        accessToken,
    });
    reddit.config({ requestDelay: 100 });

    async function getSavedItems() {
        const savedContent = await reddit.getMe().getSavedContent({ limit: 10 });
        return savedContent;
    }

    return {
        getSavedItems,
    };
};
