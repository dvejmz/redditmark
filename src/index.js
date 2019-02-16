import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createReddit from './api/reddit';

ReactDOM.render(
    <App createReddit={createReddit} />,
    document.getElementById('root'),
);
