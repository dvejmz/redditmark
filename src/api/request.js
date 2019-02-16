const headers = new Headers({ 'Content-Type': 'application/json', 'Origin': 'http://localhost:3000' });

export default () => {
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
        get(uri) {
            return fetchAndJson(uri, {
                method: 'GET',
                credentials: 'same-origin',
            });
        },
        post(uri, body) {
            return fetchAndJson(uri, {
                method: 'POST',
                credentials: 'same-origin',
                body: JSON.stringify(body),
                headers,
            });
        },
    };
};

