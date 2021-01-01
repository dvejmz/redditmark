import React, { useState, useEffect } from 'react';
import { List } from 'immutable';
import Fuse from 'fuse.js';
import { saveAs } from 'file-saver';
import { useDispatch, useMappedState } from 'redux-react-hook';
import queryString from 'query-string';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Save } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import SavedItemRepository from '../data/savedItemRepository';
import SubredditSavedList from '../components/SubredditSavedList';
import SavedList from '../components/SavedList';
import Error from '../components/Error';

const ACTIVE_VIEW_ALL = 'all';
const ACTIVE_VIEW_SUBREDDIT = 'subreddit';

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
        fontSize: 'smaller',
    },
};

function Saved(props) {
    const {
        cookies,
        location,
        classes,
        fetchToken,
        createReddit,
        createRequest,
        toCsv,
        apiEndpoint,
    } = props;
    const [errorMessage, setErrorMessage] = useState(null);
    const [token, setToken] = useState('');
    const [activeView, setActiveView] = useState(ACTIVE_VIEW_ALL);
    const [allItems, setAllItems] = useState([]);
    const [itemsBySubreddit, setItemsBySubreddit] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { savedItems } = useMappedState(mapState);
    const dispatch = useDispatch();
    const searcher = new Fuse(savedItems, {
        keys: ['title'],
    });
    const request = createRequest({
        'Content-Type': 'application/json',
        'Origin': apiEndpoint,
    });

    async function fetchSavedItems() {
        if (!token || !token.length) {
            return;
        }

        const savedItemRepository = SavedItemRepository(createReddit(request, token, apiEndpoint));
        const items = await savedItemRepository.getSavedItems();
        if (!items || !items.length) {
            return;
        }

        dispatch({ type: 'ADD_SAVED_ITEMS', items });
    }

    async function getAccessToken() {
        const accessTokenCookie = cookies.get('access_token');

        let newToken = '';
        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const code = qsParams.code;
            newToken = await fetchToken(code);

            if (!newToken) {
                setErrorMessage('Failed to autenticate with reddit');
                return;
            }
            setErrorMessage(null);
            cookies.set('access_token', newToken, { path: '/', maxAge: 3600 });
        } else {
            newToken = accessTokenCookie;
        }

        setToken(newToken);
    }

    function handleViewChange(event, view) {
        setActiveView(view);
    }

    function handleSearchInputChange(event) {
        setSearchTerm(event.target.value);
    }

    function setDisplayedItems(items) {
        if (activeView === ACTIVE_VIEW_ALL) {
            setAllItems(items);
        } else {
            setItemsBySubreddit(items);
        }
    }

    function handleSearchInputKeyPress(event) {
        if (event.keyCode === 13) {
            if (!searchTerm.length) {
                setDisplayedItems(savedItems);
                return;
            }

            const matches = searcher.search(searchTerm);
            setDisplayedItems(matches);
        }
    }

    function handleExportButtonClick(event) {
        const savedItemsBlob = new Blob(
            [toCsv(savedItems, 'title,url,subreddit')],
            { type: 'text/csv;charset=utf-8'},
        );
        saveAs(savedItemsBlob, 'reddit-saved-posts.csv');
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
        return <p>Loading your saved items. This might take a while the first time around...</p>;
    }

    return (
        <div id="saved" className={classes.root}>
            <Paper>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid className={classes.headingbar} container justify="space-between" alignItems="center">
                            <Grid xs={6} md={3} container alignItems="center">
                                <Grid item xs={11} md={10}>
                                    <ToggleButtonGroup className={classes.toggleGroup} value={activeView} exclusive onChange={handleViewChange}>
                                        <ToggleButton value={ACTIVE_VIEW_ALL}>All</ToggleButton>
                                        <ToggleButton value={ACTIVE_VIEW_SUBREDDIT}>By Subreddit</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={1} md={2}>
                                    <Tooltip title="Export to CSV">
                                        <IconButton onClick={handleExportButtonClick}>
                                            <Save />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <TextField autoFocus value={searchTerm} placeholder="Search..." onChange={handleSearchInputChange} onKeyDown={handleSearchInputKeyPress} className={classes.searchfield} margin="dense" />
                        </Grid>
                    </Grid>
                </Grid>
                {activeView === ACTIVE_VIEW_ALL
                    ? <SavedList items={allItems} />
                    : <SubredditSavedList items={itemsBySubreddit} />
                }
            </Paper>
        </div>
    );
}

export default withStyles(styles)(Saved);
