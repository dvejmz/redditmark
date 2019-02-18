import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useDispatch, useMappedState } from 'redux-react-hook';
import queryString from 'query-string';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import SubredditSavedList from '../components/SubredditSavedList';
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
    headingbar: {
        padding: '10px',
    },
    searchfield: {
        padding: '5px',
    }
};

function Saved(props) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [token, setToken] = useState('');
    const [activeView, setActiveView] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedItems, setDisplayedItems] = useState([]);
    const { cookies, location, createReddit, classes } = props;
    const { savedItems } = useMappedState(mapState);
    const dispatch = useDispatch();
    const fuse = new Fuse(savedItems, {
        keys: ['title'],
    });

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

    function handleViewChange(event, view) {
        setActiveView(view);
    }

    function handleSearchInputChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleSearchInputKeyPress(event) {
        if (event.keyCode === 13) {
            if (!searchTerm.length) {
                setDisplayedItems(savedItems);
                return;
            }

            const matches = fuse.search(searchTerm);
            setDisplayedItems(matches);
        }
    }

    useEffect(() => { getAccessToken() }, []);
    useEffect(() => { fetchSavedItems() }, [token]);
    useEffect(() => {
        setDisplayedItems(savedItems);
    }, [savedItems]);

    if (errorMessage) {
        return <Error message={errorMessage} />;
    }

    if (!savedItems.length) {
        return <p>Loading your saved items. This might take a while...</p>;
    }

    return (
        <div id="saved" className={classes.root}>
            <Paper>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid className={classes.headingbar} container justify="space-between" alignItems="center">
                            <Grid item xs={4}>
                                <Typography component="h4" variant="h4" className={classes.heading}>My Saved Items</Typography>
                            </Grid>
                            <Grid item>
                                <ToggleButtonGroup value={activeView} exclusive onChange={handleViewChange}>
                                    <ToggleButton value="all">All</ToggleButton>
                                    <ToggleButton value="subreddit">By Subreddit</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid item>
                                <TextField autoFocus value={searchTerm} placeholder="Search" onChange={handleSearchInputChange} onKeyDown={handleSearchInputKeyPress} className={classes.searchfield} margin="dense" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {activeView === 'all'
                    ? <SavedList items={displayedItems} />
                    : <SubredditSavedList items={displayedItems} />
                }
            </Paper>
        </div>
    );
}

export default withStyles(styles)(Saved);
