import mapComment from './commentMapper';

export default (commentReadSource) => {
    async function getComments(afterIndex) {
        try {
            const response = await commentReadSource.fetchComments(afterIndex);
            const { data, next } = response;
            if (!data) {
                return {
                    data: [],
                    next: '',
                };
            }
            return {
                data: data.map(mapComment),
                next,
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
