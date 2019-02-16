import snoowrap from 'snoowrap';

export default (accessToken) => {
    const reddit = new snoowrap({
        userAgent: 'redditmark 0.1.0 (dev)',
        accessToken,
    });
    reddit.config({ requestDelay: 100 });

    async function getSavedItems() {
        const savedContent = await reddit.getMe().getSavedContent({ limit: 50 });
        return savedContent;
    }

    return {
        getSavedItems,
    };
};
