import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import * as bcrypt from 'bcryptjs';

import { isMobileViewport } from '../helper/window';
import { MAX_SESSION_COOKIE_AGE } from '../constants';
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
    const [redditApiAuthorisationUrl, setRedditApiAuthorisationUrl] = useState('#'); // Default to current page
    useEffect(() => {
        (async () => {
            if (!accessToken.length) {
                const state = await generateOAuthStateNonce();
                cookies.set('authorisation_state_nonce', state, { path: '/', maxAge: MAX_SESSION_COOKIE_AGE });
                setRedditApiAuthorisationUrl(`https://www.reddit.com/api/v1/authorize${isMobileViewport() ? '.compact' : ''}?client_id=${redditClientId}&response_type=code&state=${state}&redirect_uri=${authRedirectUrl}&duration=temporary&scope=history,identity`);
            }
        })();
    }, [setRedditApiAuthorisationUrl, accessToken]);

    return (
        <div>
            {accessToken.length > 0 &&
                <Redirect to='/saved' />
            }
            <main>
                <Container maxWidth="sm">
                    <Box mt={6} textAlign="center">
                        <a href={redditApiAuthorisationUrl}>
                            <Paper>
                                <Box pt={2}>
                                    <Box mb={1}>
                                        <LoginLogo width={'30%'} />
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary">
                                        Sign in to reddit
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

const generateOAuthStateNonce = async () => {
    // About 10 hashes/s w/ 2GHz CPU, as per https://www.npmjs.com/package/bcrypt#a-note-on-rounds
    const saltRounds = 10;
    const currentEpochMs = new Date().getTime().toString();

    return bcrypt.hash(currentEpochMs, saltRounds);
}

export default withStyles(styles)(Home);

