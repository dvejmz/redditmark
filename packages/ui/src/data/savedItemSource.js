export default function (request, authToken, endpoint) {
    async function getSavedItems(afterIndex = '') {
        try {
            const response = await request.get(
                `${endpoint}`,
                {
                    'Authorization': `Bearer ${authToken}`,
                },
                {
                    idx: afterIndex,
                }
            );
            return response.body;
        } catch (e) {
            return null;
        }
    }

    return {
        getSavedItems,
    };
};
