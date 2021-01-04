import React from 'react';
import { Redirect } from 'react-router-dom';

import { isMobileViewport } from '../helper/window';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import loginIcon from '../assets/img/bookmark-alt-flat.svg';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({});

const LoginLogo = ({ width }) => (<img src={loginIcon} width={width} alt="Login" />);

function Home(props) {
    const { cookies, authRedirectUrl, redditClientId } = props;
    const accessToken = cookies.get('access_token') || '';
    const oauthLink = `https://www.reddit.com/api/v1/authorize${isMobileViewport() ? '.compact' : ''}?client_id=${redditClientId}&response_type=code&state=ok&redirect_uri=${authRedirectUrl}&duration=temporary&scope=history,identity`;

    return (
        <div>
            {accessToken.length > 0 &&
            <Redirect to='/saved' />}
            <main>
                <Container maxWidth="sm">
                    <Box mt={6} textAlign="center">
                        <a href={oauthLink}>
                            <Paper>
                                <Box pt={2}>
                                    <Box mb={1}>
                                        <LoginLogo width={'30%'} />
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary">
                                        Log in to view your reddit saved items
                                    </Button>
                                </Box>
                            </Paper>
                        </a>
                    </Box>
                </Container>
            </main>
        </div>
    );
}

export default withStyles(styles)(Home);
