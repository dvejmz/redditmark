import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
    },
    heading: {
        padding: '10px',
    },
};

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

function SavedList(props) {
    const { items } = props;

    return (
        <div id="saved" className={props.classes.root}>
            <Paper>
                <Typography component="h2" variant="h3" className={props.classes.heading}>My Saved Posts</Typography>
                <Divider />
                <List component="nav">
                    {items.map((item, idx) => (
                        <ListItemLink href={item.url} key={idx}>
                            <ListItemText primary={item.title} />
                        </ListItemLink>
                    ))}
                </List>
            </Paper>
        </div>
    );
};

export default withStyles(styles)(SavedList);
