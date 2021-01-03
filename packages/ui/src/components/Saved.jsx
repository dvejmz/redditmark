import React, { useReducer } from 'react';
import Fuse from 'fuse.js';
import {
   useQuery,
   useInfiniteQuery,
 } from 'react-query';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Save } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import SavedList from '../components/SavedList';
import Error from '../components/Error';

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

const Saved = ({
    classes,
    getAccessToken,
    fetchSavedItems,
}) => {
    const tokenResult = useQuery('token', getAccessToken);
    const token = tokenResult.data;
    const {
        isLoading,
        isIdle,
        isError,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        error,
        data: dataPages = { pages: [] },
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
    const allItems = dataPages.pages.reduce((acc, p, _) => { return [...acc, ...p.items]; }, []);
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

    if (isError) {
        return (<Error message={error.message} />);
    }

    const isFirstLoad = isIdle || isLoading;

    return (
        <div id="saved" className={classes.root}>
            <Paper>
            {isFirstLoad
                ? (<Typography>Loading...</Typography>)
                : (
                    <div>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid className={classes.headingbar} container justify="space-between" alignItems="center">
                                    <TextField
                                        autoFocus
                                        value={query}
                                        placeholder="Search..."
                                        onChange={({ target: { value } }) => onQueryChange(value)}
                                        className={classes.searchfield}
                                        margin="dense"
                                    />
                                    {isFetching && (
                                        <Typography>
                                            Syncing list...
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <SavedList items={displayedItems} />
                    </div>
                )
            }
            </Paper>
        </div>
    );
};

const UPDATE_QUERY = 'UPDATE_QUERY';
const PERFORM_SEARCH = 'PERFORM_SEARCH';

const initialSearchState = {
  query: '',
  searchActive: false,
  searchResult: []
};

export default withStyles(styles)(Saved);
