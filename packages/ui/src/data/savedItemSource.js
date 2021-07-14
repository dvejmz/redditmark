export default function (request) {
    async function getSavedItems(afterIndex = '') {
        try {
            const response = await request.get(
                `/saved`,
                afterIndex,
            );
            return response;
        } catch (e) {
            console.error('Failed to fetch saved items', e);
            return null;
        }
    }

    return {
        getSavedItems,
    };
};
