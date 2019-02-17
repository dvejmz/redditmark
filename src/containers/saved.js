import React, { useState, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import queryString from 'query-string';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import SavedList from '../components/SavedList';
import Error from '../components/Error';

const mapState = (state) => ({
    savedItems: state.savedItems,
});

const styles = {
    root: {
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
    },
    heading: {
        padding: '10px',
    },
};

function Saved(props) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [token, setToken] = useState('');
    const { cookies, location, createReddit, classes } = props;
    const { savedItems } = useMappedState(mapState);
    const dispatch = useDispatch();

    async function requestToken(code) {
        const { body, status } = await props.request.post(
            'https://24gfqm09w5.execute-api.eu-west-1.amazonaws.com/test/token',
            { code },
        );
        
        if (status !== 200 || !body) {
            setErrorMessage('Failed to authenticate with reddit');
            return;
        }

        const responseStatus = body.status;
        if (responseStatus !== 200) {
            setErrorMessage('Failed to authenticate with reddit');
            return;
        }

        const response = body.body;
        const newToken = (response.token && response.token.length) ? response.token : '';
        cookies.set('access_token', newToken, { path: '/', maxAge: 3600 });
        setToken(newToken);
        setErrorMessage(null);
    }

    function isValidSavedItem(item) {
        return item.title && item.title.length
            && item.url && item.url.length;
    }

    function mapSavedItem(item) {
        return {
            title: item.title,
            url: item.url,
            subreddit: item.subreddit.display_name,
        };
    }

    async function fetchSavedItems() {
        if (!token.length) {
            return;
        }

        const reddit = createReddit(token);
        let savedListing = [];
        try {
            savedListing = await reddit.getSavedItems();
            const parsedSaveItems = savedListing
                .map(mapSavedItem)
                .filter(isValidSavedItem);
            dispatch({ type: 'ADD_SAVED_ITEMS', items: parsedSaveItems });
        } catch (e) {
            return;
        }
    }

    async function getAccessToken() {
        const accessTokenCookie = cookies.get('access_token');

        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const code = qsParams.code;
            requestToken(code);
        } else {
            setToken(accessTokenCookie);
        }
    }

    useEffect(() => { getAccessToken() }, []);
    useEffect(() => { fetchSavedItems() }, [token]);

    if (errorMessage) {
        return <Error message={errorMessage} />;
    }

    if (!savedItems.length) {
        return <p>Loading...</p>;
    }

    return (
        <div id="saved" className={props.classes.root}>
            <Paper>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container justify="flex-start" alignItems="center">
                            <Grid item xs={4}>
                                <Typography component="h4" variant="h4" className={props.classes.heading}>My Saved Items</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Button color="primary" size="small">All</Button><Button size="small">By Subreddit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <SavedList items={savedItems} />
            </Paper>
        </div>
    );
}

export default withStyles(styles)(Saved);
