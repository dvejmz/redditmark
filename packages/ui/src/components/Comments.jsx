import React, { useState } from 'react';
import {
   useQuery,
    useInfiniteQuery,
 } from 'react-query';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuBar from './MenuBar';
import { withStyles } from '@material-ui/core/styles';
import ItemList from '../components/ItemList';
import ItemListBySubreddit from '../components/ItemListBySubreddit';
import BaseCss from '../styles/base';
import { ACTIVE_VIEW_ALL, ACTIVE_VIEW_SUBREDDIT } from '../constants';
import Error from '../components/Error';

const styles = () => ({
    ...BaseCss,
})

const WhiteCheckbox = withStyles({
  root: {
    color: 'white',
    '&$checked': {
      color: 'white',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const Comments = ({
    classes,
    getAccessToken,
    fetchComments
}) => {
    const {
        isError: isTokenError,
        error: tokenError,
        data: token
    } = useQuery('token', getAccessToken);
    const [showOnlyNsfwComments, setShowOnlyNsfwComments] = useState(false);
    const [activeView, setActiveView] = useState(ACTIVE_VIEW_ALL);
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
        'comments',
        ({ pageParam = '' }) => fetchComments({ pageParam }),
        {
            enabled: !!token,
            staletime: Infinity,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            getNextPageParam: lastPage => lastPage.next,
        });

    const shouldFetchNextPage = hasNextPage && !isFetchingNextPage;
    if (shouldFetchNextPage) {
        fetchNextPage();
    }

    const allComments = data.pages.reduce((acc, p, _) => { return [...acc, ...p.items]; }, []).map(mapToListItem);
    const visibleComments = showOnlyNsfwComments ? allComments.filter(c => c.isNsfw) : allComments;

    if (isTokenError) {
        return (<Error message={tokenError.message} />);
    } else if (isError) {
        return (<Error message={error.message} />);
    }

    const isFirstLoad = isIdle || isLoading;
    const handleNsfwCheckboxChange = (event) => {
        setShowOnlyNsfwComments(event.target.checked);
    }

    return (
        <div id="comments" className={classes.root}>
            <Paper>
                    {isFirstLoad
                        ? (
                            <Box p={2}>
                                <Typography>Loading...</Typography>
                            </Box>
                        )
                        : (
                            <div>
                                <MenuBar
                                    rightComponents={
                                        <FormControlLabel
                                        control={<WhiteCheckbox
                                            checked={showOnlyNsfwComments}
                                            onChange={handleNsfwCheckboxChange}
                                        />}
                                            label="NSFW Only"
                                        />
                                    }
                                />
                                <Box p={2}>
                                    <Tabs
                                        value={activeView}
                                        onChange={(_, view) => setActiveView(view)}
                                        centered
                                    >
                                        <Tab value={ACTIVE_VIEW_ALL} label="All" />
                                        <Tab value={ACTIVE_VIEW_SUBREDDIT} label="By Subreddit" />
                                    </Tabs>
                                {activeView === ACTIVE_VIEW_ALL
                                    ? <ItemList
                                        items={visibleComments}
                                        emptyListMessage={"You have no reddit comments."}
                                    />
                                    : <ItemListBySubreddit items={visibleComments} />
                                }
                                </Box>
                            </div>
                        )
                    }
            </Paper>
        </div>
    );
}

const mapToListItem = ({ body, url, subreddit, isNsfw }) => ({ title: body, url, subreddit, isNsfw });

export default withStyles(styles)(Comments);
