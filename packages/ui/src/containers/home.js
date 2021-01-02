import React from 'react';
import { Redirect } from 'react-router-dom';

import { isMobileViewport } from '../helper/window';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
});

function Home(props) {
    const { cookies, authRedirectUrl, redditClientId } = props;
    const accessToken = cookies.get('access_token') || '';
    const oauthLink = `https://www.reddit.com/api/v1/authorize${isMobileViewport() ? '.compact' : ''}?client_id=${redditClientId}&response_type=code&state=ok&redirect_uri=${authRedirectUrl}&duration=temporary&scope=history,identity`;

    return (
        <div>
        {accessToken.length > 0 &&
            <Redirect to='/saved' />}
        <main>
            <CssBaseline />
            <Paper>
                <Button
                    href={oauthLink}
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Sign in
                </Button>
            </Paper>
        </main>
    </div>
    );
}

export default withStyles(styles)(Home);