const md5 = require('md5');

export default function (request, authToken, endpoint) {
    async function getSavedItems() {
        const tokenHash = md5(authToken);
        let body = null;
        try {
            const response = await request.get(
                `${endpoint}?uid=${tokenHash}`,
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
