import React, { useState } from 'react';

import {
   useQuery,
 } from 'react-query';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
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
        error,
        data: allItems
    } = useQuery('savedItems', () => fetchSavedItems(token), { enabled: !!token });

    if (isError) {
        return (<div><Error message={error.message} /></div>);
    }

    return (
        <div id="saved" className={classes.root}>
            <Paper>
            {isIdle || isLoading ?
                'Loading...'
                : (
                    <div>
                        <SavedList items={allItems} />
                    </div>
                )
            }
            </Paper>
        </div>
    );
};

export default withStyles(styles)(Saved);
