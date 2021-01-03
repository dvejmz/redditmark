const axios = require('axios').default;

export default ({ debugEnabled = false } = {}) => {
    if (debugEnabled) {
        axios.interceptors.request.use(x => {

            const headers = {
                ...x.headers.common,
                ...x.headers[x.method],
                ...x.headers
            };

            ['common','get', 'post', 'head', 'put', 'patch', 'delete'].forEach(header => {
                delete headers[header]
            })

            const printable = `${new Date()} | Request: ${x.method.toUpperCase()} | ${x.url} | ${ JSON.stringify( x.data) } | ${JSON.stringify(headers)}`
            console.log(printable)

            return x;
        })

        axios.interceptors.response.use(x => {

            const printable = `${new Date()} | Response: ${x.status} | ${ JSON.stringify(x.data) }`
            console.log(printable)

            return x;
        })
    }

    return {
        async postWithBasicAuth(uri, form, username, password, headers = {}) {
            let response = null;

            try {
                response = await axios.post(uri, form, {
                    headers: { ...form.getHeaders(), ...headers },
                    withCredentials: true,
                    auth: {
                        username,
                        password,
                    },
                });
            } catch (err) {
                return {
                    status: 500,
                    error: err.message,
                }
            }


            const { status, data: body } = response;
             
            return {
                status,
                body
            }
        },
        async get(uri, headers = {}, params = {}) {
            try {
                const { data, status } = await axios.get(uri, { headers, params });
                return { body: data, status };
            } catch (err) {
                throw new Error(err.message);
            }
        },
        async post(uri, body, headers = {}) {
            try {
                const { data, status } = await axios.post(uri, body, {
                    headers: {
                        'content-type': 'text/plain;charset=UTF-8',
                        ...headers,
                    },
                });
                return { body: data, status };
            } catch (err) {
                throw new Error(err.message);
            }
        },
    };
};
