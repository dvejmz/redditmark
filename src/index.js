import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import 'typeface-roboto';
import App from './App';
import createReddit from './api/reddit';
import createRequest from './api/request';
const request = createRequest();

ReactDOM.render(
    <CookiesProvider>
        <App
            createReddit={createReddit} 
            request={request}
        />
    </CookiesProvider>,
    document.getElementById('root'),
);
