const createRequest = require('./request');
const FormData = require('form-data');

module.exports = ({
    logger,
    debugEnabled = false,
    apiClientId,
    apiClientSecret,
    clientUrl,
}) => {
    const request = createRequest(logger, debugEnabled);

    async function handleAuth(authCode) {
        if (!authCode.length) {
            return {
                statusCode: 400,
                errorMessage: 'No auth code was provided',
            };
        }

        const form = new FormData();
        form.append('grant_type', 'authorization_code');
        form.append('code', authCode);
        form.append('redirect_uri', clientUrl);

        let body = null;
        let status = null;
        try {
            const response = await request.postWithBasicAuth(
                `https://www.reddit.com/api/v1/access_token`,
                form,
                apiClientId,
                apiClientSecret
            );
            ({ body, status } = response);
        } catch (e) {
            logger.error('app.handleAuth', { message: 'Unable to fetch access token from API', error: e.toString() });
        }

        if (status !== 200 || !body || !body.access_token) {
            logger.error('app.handleAuth', { message: 'API refused to produce access token', authCode, error: body });
            throw new Error("API refused to produce access token");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                token: body.access_token,
            })
        };
    }

    return {
        handleAuth,
    };
};
