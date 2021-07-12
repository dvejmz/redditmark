import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { CookiesProvider } from 'react-cookie';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import 'typeface-roboto';
import theme from './styles/theme';
import App from './App';
import SavedItemSource from './data/savedItemSource';
import createRequest from './api/request';
const apiBase = process.env.REACT_APP_API_BASE_URL;
const apiEndpoint = `${apiBase}/saved`;
const authEndpoint = `${apiBase}/token`;
const authRedirectUrl = process.env.REACT_APP_AUTH_CALLBACK_URL;
const redditClientId = process.env.REACT_APP_API_CLIENT_ID;
const showReactQueryDevtools = process.env.NODE_ENV === 'development';

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
                {showReactQueryDevtools &&
                    <ReactQueryDevtools initialIsOpen position={'bottom-right'} />}
            </QueryClientProvider>
        </CookiesProvider>
    </ThemeProvider>,
    document.getElementById('root'),
);
