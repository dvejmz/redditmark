import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Login from './containers/Login';
import Saved from './containers/Saved';
import Comments from './containers/Comments';
import Auth from './auth';

import Api from './data/api';
import SavedItemSource from './data/savedItemSource';
import SavedItemRepository from './data/savedItemRepository';

import CommentReadSource from './data/commentReadSource';
import CommentReadRepository from './data/commentReadRepository';

function App(props) {
    const {
        cookies,
        authEndpoint,
        apiBase,
        authRedirectUrl,
        redditClientId,
        request,
    } = props;

    const auth = Auth(request, authEndpoint, cookies);

    const authToken = cookies.get('access_token');
    const api = Api(request, authToken, apiBase)

    const savedItemSource = SavedItemSource(api);
    const savedItemRepository = SavedItemRepository(savedItemSource);

    const commentReadSource = CommentReadSource(api);
    const commentReadRepository = CommentReadRepository(commentReadSource);

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
                            savedItemRepository={savedItemRepository}
                        />
                    )}
                />
                <Route
                    exact path='/comments'
                    render={(routeProps) => (
                        <Comments
                            {...routeProps}
                            getAccessToken={auth.getAccessToken}
                            commentReadRepository={commentReadRepository}
                        />
                    )}
                />
                <Route component={notFoundComponent} />
            </Switch>
        </Router>
    );
}

export default withCookies(App);
