module.exports = (request, authEndpoint, cookies) => {
    async function fetchToken(code) {
        const { body, status } = await request.post(
            authEndpoint,
            { code },
        );
        
        if (status !== 200 || !body) {
            return 'Failed to authenticate with reddit';
        }

        const responseStatus = body.status;
        if (responseStatus !== 200) {
            return 'Failed to authenticate with reddit';
        }

        const response = body.body;
        const newToken = (response.token && response.token.length) ? response.token : '';
        return newToken;
    }

    return {
        fetchToken,
    };
};
