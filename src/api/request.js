export default (headers = {}) => {
    async function fetchAndJson(uri, config) {
	let response = null;
	try {
	    response = await fetch(uri, config);
	} catch (e) {
	    throw e;
	}

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
                headers: new Headers(headers),
            });
        },
    };
};

