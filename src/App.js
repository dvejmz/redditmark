import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './containers/home';
import Saved from './containers/saved';

function App(props) {
    const notFoundComponent = () => (
        <p>Error</p>
    );

    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route
                    exact path='/saved'
                    render={(routeProps) => (
                        <Saved {...routeProps} createReddit={props.createReddit} />
                    )}
                />
                <Route component={notFoundComponent} />
            </Switch>
        </Router>
    );
}

export default App;
