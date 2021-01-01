const fetch = require('node-fetch');
const btoa = require('btoa');

module.exports = () => {
    async function fetchAndJson(uri, config) {
        const response = await fetch(uri, config);
        const { status } = response;

        let body;
        try {
            body = await response.json();
        } catch (err) {
            return {
                status,
                message: 'invalid json response from server',
            };
        }

        return { body, status };
    }

    return {
        postWithBasicAuth(uri, body, username, password, headers = {}) {
            return fetchAndJson(uri, {
                method: 'POST',
                credentials: 'same-origin',
                body,
                headers: { authorization: `Basic ${btoa([username, password].join(':'))}`, ...headers },
            });
        },
    };
};

