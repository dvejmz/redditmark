import React, { useState, useEffect } from 'react';
import createRequest from '../api/request';
import queryString from 'query-string';

function Saved(props) {
    const [token, setToken] = useState('[NO TOKEN]');
    const request = createRequest(fetch);

    async function fetchToken(code) {
        const { body, status } = await request.post('http://localhost:3001/token', { code });
        const response = body ? body.token : '[NO TOKEN]';
        setToken(response);
    }

    useEffect(() => {
        const qsParams = queryString.parse(props.location.search);
        const code = qsParams.code;

        fetchToken(code);

        //cookies.set('api_bearer_token', token, { path: '/' });
        // get bearer token from backend and store as cookie
    }, []);

    return (
        <div id="saved" className="saved">
            <h1>My Saved Posts</h1>
            <p>Code: {token}</p>
        </div>
    );
}

export default Saved;
