const mapComment = require('./commentMapper');

const MAX_COMMENT_LENGTH = 600;

module.exports = (reddit) => {
    function isValidComment(comment) {
        return comment.body?.length
            && comment.subreddit?.length;
    }

    function shouldEllipsise(text) {
        return text.length > MAX_COMMENT_LENGTH;
    }

    function truncateComment(comment) {
        return {
            ...comment,
            body: shouldEllipsise(comment.body)
                ? `${comment.body.slice(0, MAX_COMMENT_LENGTH)}...`
                : comment.body,
        };
    }

    async function getComments(afterIndex) {
        let comments = [];
        try {
            const result = await reddit.getComments({ limit: 100, after: afterIndex });
            comments = result.items
                .map(truncateComment)
                .map(mapComment)
                .filter(isValidComment);
            return {
                data: comments,
                next: result.next,
            };
        } catch (e) {
            throw new Error(`Failed to retrieve user comments:, ${e.message}`);
        }
    }

    return {
        getComments,
    };
};
