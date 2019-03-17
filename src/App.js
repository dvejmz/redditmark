import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Home from './containers/home';
import Saved from './containers/saved';
import Auth from './auth';

function App(props) {
    const {
        cookies,
        authEndpoint,
        authRedirectUrl,
        redditClientId,
        request,
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
                        <Home
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
                            createReddit={props.createReddit}
                            cookies={cookies}
                            fetchToken={auth.fetchToken}
                            createRequest={props.createRequest}
                        />
                    )}
                />
                <Route component={notFoundComponent} />
            </Switch>
        </Router>
    );
}

export default withCookies(App);
