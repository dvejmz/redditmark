import mapComment from './commentMapper';

export default (commentReadSource) => {
    async function getComments() {
        try {
            const response = await commentReadSource.fetchComments();
            const { data } = response;
            if (!data) {
                return {
                    data: [],
                };
            }
            return {
                data: data.map(mapComment),
            };
        } catch (e) {
            console.error("Failed to fetch comments:", e);
            throw new Error('Failed to fetch comments');
        }
    }

    return {
        getComments,
    };
}
