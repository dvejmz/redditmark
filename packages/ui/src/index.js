import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { CookiesProvider } from 'react-cookie';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import 'typeface-roboto';
import theme from './theme';
import App from './App';
import SavedItemSource from './data/savedItemSource';
import createRequest from './api/request';
const apiBase = 'https://4fjf8rnq0j.execute-api.eu-west-2.amazonaws.com'
const apiEndpoint = `${apiBase}/saved`;
const authEndpoint = `${apiBase}/token`;
const authRedirectUrl = "https://redditmark.apps.sgfault.com/saved";
//const apiEndpoint = 'http://localhost:3002/saved';
//const authEndpoint = 'http://localhost:3001/token';
//const authRedirectUrl = 'http://localhost:3000/saved';
const redditClientId = 'lc3vtl-uKhFj8A';
const request = createRequest();

const queryClient = new QueryClient();

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <CssBaseline />
                <App
                    createReddit={SavedItemSource} 
                    request={request}
                    authEndpoint={authEndpoint}
                    apiEndpoint={apiEndpoint}
                    authRedirectUrl={authRedirectUrl}
                    redditClientId={redditClientId}
                />
                <ReactQueryDevtools initialIsOpen position={'bottom-right'} />
            </QueryClientProvider>
        </CookiesProvider>
    </ThemeProvider>,
    document.getElementById('root'),
);
