import React, { useState, useEffect } from 'react';
import { List } from 'immutable';
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
        padding: '10px 10px 0 20px',
    },
    searchfield: {
        padding: '5px',
    },
    toggleGroup: {
        width: '167px',
    },
};

function Saved(props) {
    const { cookies, location, createReddit, classes, authEndpoint } = props;
    const [errorMessage, setErrorMessage] = useState(null);
    const [token, setToken] = useState('');
    const [activeView, setActiveView] = useState('all');
    const [allItems, setAllItems] = useState([]);
    const [itemsBySubreddit, setItemsBySubreddit] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { savedItems } = useMappedState(mapState);
    const dispatch = useDispatch();
    const searcher = new Fuse(savedItems, {
        keys: ['title'],
    });

    async function requestToken(code) {
        const { body, status } = await props.request.post(
            authEndpoint,
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
                if (activeView === 'all') {
                    setAllItems(savedItems);
                } else {
                    setItemsBySubreddit(savedItems);
                }
                return;
            }

            const matches = searcher.search(searchTerm);
            if (activeView === 'all') {
                setAllItems(matches);
            } else {
                setItemsBySubreddit(matches);
            }
        }
    }

    useEffect(() => { getAccessToken() }, []);
    useEffect(() => { fetchSavedItems() }, [token]);
    useEffect(() => {
        setAllItems(List(savedItems));
        setItemsBySubreddit(List(savedItems));
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
                            <Grid item>
                                <ToggleButtonGroup className={classes.toggleGroup} value={activeView} exclusive onChange={handleViewChange}>
                                    <ToggleButton value="all">All</ToggleButton>
                                    <ToggleButton value="subreddit">By Subreddit</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid item>
                                <TextField autoFocus value={searchTerm} placeholder="Search..." onChange={handleSearchInputChange} onKeyDown={handleSearchInputKeyPress} className={classes.searchfield} margin="dense" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {activeView === 'all'
                    ? <SavedList items={allItems} />
                    : <SubredditSavedList items={itemsBySubreddit} />
                }
            </Paper>
        </div>
    );
}

export default withStyles(styles)(Saved);
