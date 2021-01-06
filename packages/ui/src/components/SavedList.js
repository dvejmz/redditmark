import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const SavedList = React.memo(props => {
    const { items, inset } = props;

    return (
        <List component="nav">
            {items.length
                ? items.map((item, idx) => (
                        <ListItemLink href={item.url} target="_blank" key={idx}>
                            <ListItemText inset={inset} primary={item.title} secondary={item.subreddit} />
                        </ListItemLink>
                    ))
                : "You have no saved items. Come back when you've added some!"
            }
        </List>
    );
});

export default SavedList;
