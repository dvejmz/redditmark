import React, { useReducer, useState } from 'react';
import Fuse from 'fuse.js';
import { saveAs } from 'file-saver';
import {
   useQuery,
   useInfiniteQuery,
 } from 'react-query';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Save } from '@material-ui/icons';
import { fade, withStyles } from '@material-ui/core/styles';

import SavedList from '../components/SavedList';
import toCsv from '../helper/csv';
import SubredditSavedList from '../components/SubredditSavedList';
import Error from '../components/Error';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
    },
    searchfield: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.70),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 1.0),
        },
    },
    toggleGroup: {
        backgroundColor: 'white',
        fontSize: 'smaller',
    },
});

const Saved = ({
    classes,
    getAccessToken,
    fetchSavedItems,
}) => {
    const [activeView, setActiveView] = useState(ACTIVE_VIEW_ALL);
    const {
        isError: isTokenError,
        error: tokenError,
        data: token,
    } = useQuery('token', getAccessToken);
    const {
        isLoading,
        isIdle,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        error,
        data = { pages: [] },
    } = useInfiniteQuery(
            'savedItems',
            ({ pageParam = '' }) => fetchSavedItems({ token, pageParam }),
            {
                enabled: !!token,
                staleTime: Infinity,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                getNextPageParam: lastPage => lastPage.next,
            }
        );

    const shouldFetchNextPage = hasNextPage && !isFetchingNextPage;
    if (shouldFetchNextPage) {
        fetchNextPage();
    }
    const allItems = data.pages.reduce((acc, p, _) => { return [...acc, ...p.items]; }, []);
    const searcher = new Fuse(allItems, {
        keys: ['title'],
    });

    const searchReducer = (state, action) => {
        switch (action.type) {
            case UPDATE_QUERY:
                return {
                    ...state,
                    query: action.query,
                    searchActive: true,
                };
            case PERFORM_SEARCH: {
                const { query } = state;

                if (query === '') {
                    return initialSearchState;
                }

                const searchResult = searcher.search(query).map(r => r.item);
                return {
                    ...state,
                    query,
                    searchResult,
                    searchActive: true,
                };
            };
            default:
                return state;
        }
    };

    let onQueryChangeTimeout = null;
    const onQueryChange = (value) => {
        if (onQueryChangeTimeout) {
            clearTimeout(onQueryChangeTimeout);
        }

        searchDispatch({ type: UPDATE_QUERY, query: value });
        onQueryChangeTimeout = setTimeout(() => {
            searchDispatch({ type: PERFORM_SEARCH });
        }, 100);
    }

    const [searchState, searchDispatch] = useReducer(
        searchReducer,
        initialSearchState
    )

    const { query, searchResult, searchActive } = searchState;
    const displayedItems = searchActive ? searchResult : allItems;

    const onExportButtonClick = () => {
        const savedItemsBlob = new Blob(
            [toCsv(allItems, 'title,url,subreddit')],
            { type: 'text/csv;charset=utf-8'},
        );
        saveAs(savedItemsBlob, 'reddit-saved-posts.csv');
    };

    if (isTokenError) {
        return (<Error message={tokenError.message} />);
    } else if (isError) {
        return (<Error message={error.message} />);
    }

    const isFirstLoad = isIdle || isLoading;

    return (
        <div id="saved" className={classes.root}>
            <Paper>
                    {isFirstLoad
                        ? (
                            <Box p={2}>
                                <Typography>Loading...</Typography>
                            </Box>
                        )
                        : (
                            <div>
                                <AppBar position="sticky">
                                    <Toolbar>
                                        <ToggleButtonGroup className={classes.toggleGroup} value={activeView} exclusive onChange={(_, view) => setActiveView(view)}>
                                            <ToggleButton value={ACTIVE_VIEW_ALL}>All</ToggleButton>
                                            <ToggleButton value={ACTIVE_VIEW_SUBREDDIT}>Subreddit</ToggleButton>
                                        </ToggleButtonGroup>
                                        <Box ml={1}>
                                            <Tooltip title="Export to CSV">
                                                <IconButton color="inherit" onClick={onExportButtonClick}>
                                                    <Save />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Box flexGrow={1} />
                                        <TextField
                                            autoFocus
                                            value={query}
                                            variant="outlined"
                                            placeholder="Search..."
                                            onChange={({ target: { value } }) => onQueryChange(value)}
                                            className={classes.searchfield}
                                            margin="dense"
                                        />
                                    </Toolbar>
                                </AppBar>
                                <Box p={2}>
                                    {activeView === ACTIVE_VIEW_ALL
                                        ? <SavedList items={displayedItems} />
                                        : <SubredditSavedList items={displayedItems} />
                                    }
                                </Box>
                            </div>
                        )
                    }
            </Paper>
        </div>
    );
};

const UPDATE_QUERY = 'UPDATE_QUERY';
const PERFORM_SEARCH = 'PERFORM_SEARCH';

const ACTIVE_VIEW_ALL = 'all';
const ACTIVE_VIEW_SUBREDDIT = 'subreddit';

const initialSearchState = {
  query: '',
  searchActive: false,
  searchResult: []
};

export default withStyles(styles)(Saved);
