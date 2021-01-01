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
const apiBase = 'https://8cu9zz4lt6.execute-api.eu-west-2.amazonaws.com'
const apiEndpoint = `${apiBase}/saved`;
const authEndpoint = `${apiBase}/token`;
const authRedirectUrl = "https://redditmark.apps.sgfault.com/saved";
//const apiEndpoint = 'http://localhost:3002/saved';
//const authEndpoint = 'http://localhost:3001/token';
//const authRedirectUrl = 'http://localhost:3000/saved';
const redditClientId = 'lc3vtl-uKhFj8A';
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
