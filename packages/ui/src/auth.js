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

        const newToken = (body.token && body.token.length) ? body.token : '';
        return newToken;
    }

    return {
        fetchToken,
    };
};
