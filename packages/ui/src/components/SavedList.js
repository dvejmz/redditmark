import React from 'react';
import { FixedSizeList } from 'react-window';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const SavedList = (props => {
    const { items, inset } = props;
    const numItems = items.length;

    const Row = ({ index, style }) => {
        const item = items[index];
        const getItemTitle = (item) => {
            const maxDisplayableTitleLength = 100;
            const title = item.title;
            const isLongTitle = title.length > maxDisplayableTitleLength;
            const ellipsisCharCode = 8230;
            return isLongTitle ? `${title.slice(0, maxDisplayableTitleLength)}${String.fromCharCode(ellipsisCharCode)}` : title;
        }
        return (
            <ListItemLink href={item.url} target="_blank" key={index} style={style}>
                <ListItemText inset={inset} primary={getItemTitle(item)} secondary={item.subreddit} />
            </ListItemLink>
        );
    };

    const getRowSize = (index) => {
        const item = items[index];
        return item && item.title && item.title.length > 200 ? 240: 80;
    }

    return (
        <FixedSizeList
            itemCount={numItems}
            itemSize={80}
            width={'100%'}
            height={1000}
        >
            {Row}
        </FixedSizeList>
    );
});

export default SavedList;
