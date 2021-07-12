import React from 'react';
import {
   useQuery,
 } from 'react-query';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuBar from './MenuBar';
import { withStyles } from '@material-ui/core/styles';
import ItemList from '../components/ItemList';
import BaseCss from '../styles/base';

const styles = theme => ({
    ...BaseCss,
})

const Comments = ({
    classes,
    getAccessToken,
    fetchComments
}) => {
    const {
        data: token
    } = useQuery('token', getAccessToken);
    const {
        isFirstLoad,
        data = {items: []}
    } = useQuery(
        'comments',
        () => fetchComments({ token }),
        {
            enabled: !!token,
            staletime: Infinity,
        });
    console.log(data)
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
                                <MenuBar />
                                <Box p={2}>
                                    <Tabs value={1} centered>
                                        <Tab value={1} label="All" />
                                        <Tab value={2} label="By Subreddit" />
                                    </Tabs>
                                {
                                    <ItemList
                                        items={data.items.map(mapToListItem)}
                                        emptyListMessage={"You have no reddit comments."}
                                    />
                                }
                                </Box>
                            </div>
                        )
                    }
            </Paper>
        </div>
    );
}

const mapToListItem = ({ body, url, subreddit }) => ({ title: body, url, subreddit });

export default withStyles(styles)(Comments);
