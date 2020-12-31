export default (request, authEndpoint, cookies) => {
    async function fetchToken(code) {
        let body;
        let status;

        try {
            const response = await request.post(
                authEndpoint,
                { code },
            );
            body = response.body;
            status = response.status;
        } catch (e) {
            return null;
        }

        if (status !== 200 || !body) {
            return null;
        }

        const responseStatus = body.status;
        if (responseStatus !== 200) {
            return null;
        }

        const payload = body.body;
        const newToken = (payload.token && payload.token.length) ? payload.token : '';
        return newToken;
    }

    return {
        fetchToken,
    };
};
