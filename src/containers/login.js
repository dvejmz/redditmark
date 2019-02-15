import React, { useState, useEffect } from 'react';
import { Switch, Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import createRequest from '../api/request';
import queryString from 'query-string';

function Login(props) {
    const [token, setToken] = useState('[NO TOKEN]');
    const request = createRequest(fetch);

    async function fetchToken(code) {
        console.log('called fetchtoken')
        const { body, status } = await request.post('http://localhost:3001/token', { code });
        const response = body ? body.token : '[NO TOKEN]';
        setToken(response);
    }

    useEffect(() => {
        const qsParams = queryString.parse(props.location.search);
        const code = qsParams.code;

        fetchToken(code);

        // get bearer token from backend and store as cookie
    }, []);

    return (
        <div>
            <p>{token}</p>
        </div>
    );
    //return <Redirect to='/saved' />;
}

export default Login;
