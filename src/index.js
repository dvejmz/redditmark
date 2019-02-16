import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createReddit from './api/reddit';
import createRequest from './api/request';
const request = createRequest();

ReactDOM.render(
    <App
        createReddit={createReddit} 
        request={request}
    />,
    document.getElementById('root'),
);
