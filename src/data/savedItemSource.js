export default function (request, authToken) {
    async function getSavedItems() {
        let body = null;
        let status = null;
        try {
            const response = await request.get(
                `http://localhost:3002/saved`,
                {
                    'Authorization': `Bearer ${authToken}`,
                },
            );
            body = response.body;
            return body;
        } catch (e) {
            return null;
        }
    }

    return {
        getSavedItems,
    };
};
