import React from 'react';
import ReactDOM from 'react-dom';
import { StoreContext } from 'redux-react-hook';
import { CookiesProvider } from 'react-cookie';
import 'typeface-roboto';
import './index.scss';
import App from './App';
import SavedItemSource from './data/savedItemSource';
import createRequest from './api/request';
import { makeStore } from './Store';
const apiEndpoint = 'http://localhost:3002/saved';
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
                createReddit={SavedItemSource} 
                createRequest={createRequest} 
                request={request}
                authEndpoint={authEndpoint}
                apiEndpoint={apiEndpoint}
                authRedirectUrl={authRedirectUrl}
                redditClientId={redditClientId}
            />
        </StoreContext.Provider>
    </CookiesProvider>,
    document.getElementById('root'),
);
