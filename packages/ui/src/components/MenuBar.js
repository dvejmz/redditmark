import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Link, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';

const NavButton = ({ isActive, to, label }) => (
    <Button
        variant={isActive ? "outlined" : ""}
        color="inherit"
        component={Link}
        to={to}
    >
        {label}
    </Button>
);

const isPath = (location, path) => location.pathname.match(new RegExp(path));

export default ({ leftComponents, rightComponents }) => {
    const location = useLocation();

    return (<AppBar position="sticky">
        <Toolbar>
            <NavButton
                isActive={isPath(location, 'saved')}
                to="/saved"
                label="Saved"
            />
            <NavButton
                isActive={isPath(location, 'comments')}
                to="/comments"
                label="Comments"
            />
            {leftComponents}
            <Box flexGrow={1} />
            {rightComponents}
        </Toolbar>
    </AppBar>);
};
