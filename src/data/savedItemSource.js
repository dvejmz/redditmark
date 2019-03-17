const md5 = require('md5');

export default function (request, authToken) {
    async function getSavedItems() {
        const tokenHash = md5(authToken);
        let body = null;
        let status = null;
        try {
            const response = await request.get(
                `http://localhost:3002/saved?uid=${tokenHash}`,
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
