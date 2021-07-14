export default function (request) {
    async function fetchComments(afterIndex = '') {
        try {
            const response = await request.get(
                `/comments`,
                afterIndex,
            );
            return response;
        } catch (e) {
            console.error('Failed to fetch comments', e);
            return null;
        }
    }

    return {
        fetchComments,
    };
};
