import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';

export default ({ leftComponents, rightComponents }) => (
    <AppBar position="sticky">
        <Toolbar>
            <Button color="inherit" component={Link} to="/saved">Saved</Button>
            <Button color="inherit" component={Link} to="/comments">Comments</Button>
            {leftComponents}
            <Box flexGrow={1} />
            {rightComponents}
        </Toolbar>
    </AppBar>
);
