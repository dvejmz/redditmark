export default function (request, authToken, basePath) {
    async function get(path, afterIndex = '') {
        try {
            const response = await request.get(
                `${basePath}${path}`,
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
        get,
    };
};
