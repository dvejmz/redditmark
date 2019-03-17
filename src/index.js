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
const authEndpoint = '';
const authRedirectUrl = '';
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
                authRedirectUrl={authRedirectUrl}
                redditClientId={redditClientId}
            />
        </StoreContext.Provider>
    </CookiesProvider>,
    document.getElementById('root'),
);
