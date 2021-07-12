import React from 'react';
import {
   useQuery,
 } from 'react-query';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import LoopIcon from '@material-ui/icons/Loop';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuBar from './MenuBar';
import { fade, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
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
        isSuccess,
        isFirstLoad,
        data = {items: []}
    } = useQuery('comments', fetchComments);
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
                                <ItemList items={data.items} />
                                    }
                                </Box>
                            </div>
                        )
                    }
            </Paper>
        </div>
    );
}

export default withStyles(styles)(Comments);
