import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Login from './containers/Login';
import Saved from './containers/Saved';
import Comments from './containers/Comments';
import Auth from './auth';

function App(props) {
    const {
        cookies,
        authEndpoint,
        apiEndpoint,
        authRedirectUrl,
        redditClientId,
        request,
        createReddit,
    } = props;

    const auth = Auth(request, authEndpoint, cookies);

    const notFoundComponent = () => (
        <p>Error</p>
    );

    return (
        <Router>
            <Switch>
                <Route
                    exact path='/'
                    render={routeProps => (
                        <Login
                            {...routeProps}
                            cookies={cookies}
                            authRedirectUrl={authRedirectUrl}
                            redditClientId={redditClientId}
                        />
                    )}
                />
                <Route
                    exact path='/saved'
                    render={(routeProps) => (
                        <Saved
                            {...routeProps}
                            getAccessToken={auth.getAccessToken}
                            createReddit={createReddit}
                            request={request}
                            apiEndpoint={apiEndpoint}
                        />
                    )}
                />
                <Route
                    exact path='/comments'
                    render={() => (
                        <Comments />
                    )}
                />
                <Route component={notFoundComponent} />
            </Switch>
        </Router>
    );
}

export default withCookies(App);
