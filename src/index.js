import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';
import { CookiesProvider } from 'react-cookie';
import 'typeface-roboto';
import './index.scss';
import App from './App';
import createReddit from './api/reddit';
import createRequest from './api/request';
import { makeStore } from './Store';
const authEndpoint = 'http://localhost:3001/token';
const authRedirectUrl = 'http://localhost:3000/saved';
const redditClientId = '';
const request = createRequest({
    'Content-Type': 'application/json',
    'Origin': authEndpoint,
});

const store = makeStore();

ReactDOM.render(
    <CookiesProvider>
        <StoreContext.Provider value={store}>
            <App
                createReddit={createReddit} 
                request={request}
                authEndpoint={authEndpoint}
                authRedirectUrl={authRedirectUrl}
                redditClientId={redditClientId}
            />
        </StoreContext.Provider>
    </CookiesProvider>,
    document.getElementById('root'),
);
