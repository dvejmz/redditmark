import queryString from 'query-string';
import { MAX_SESSION_COOKIE_AGE } from './constants';

export default (request, authEndpoint, cookies) => {
    async function getAccessToken(location) {
        const accessTokenCookie = cookies.get('access_token');

        let accessToken = '';
        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const { code, state } = qsParams;
            accessToken = await fetchToken(code);

            if (!accessToken || !state || !state.length) {
                throw new Error('Failed to autenticate with reddit. Try again by revisiting the home page.');
            }

            const sentState = cookies.get('authorisation_state_nonce');
            if (sentState !== state) {
                throw new Error('Failed to authenticate with reddit: OAuth state nonce mismatch');
            }

            cookies.set('access_token', accessToken, { path: '/', maxAge: MAX_SESSION_COOKIE_AGE });
        } else {
            accessToken = accessTokenCookie;
        }

        return accessToken;
    }

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
        getAccessToken,
    };
};
