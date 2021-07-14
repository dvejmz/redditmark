const mapComment = require('./commentMapper');

module.exports = (reddit) => {
    function isValidComment(item) {
        return item.body?.length
            && item.subreddit?.length;
    }

    async function getComments(afterIndex) {
        let comments = [];
        try {
            const result = await reddit.getComments({ limit: 100, after: afterIndex });
            comments = result.items
                .map(mapComment)
                .filter(isValidComment);
            return {
                data: comments,
                next: result.next,
            };
        } catch (e) {
            throw new Error('Failed to retrieve user comments: ', e.message);
        }
    }

    return {
        getComments,
    };
};
