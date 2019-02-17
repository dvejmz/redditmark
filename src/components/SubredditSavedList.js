import React from 'react';
import List from '@material-ui/core/List';
import SavedList from './SavedList';
import CollapsibleList from './CollapsibleList';

function SubredditSavedList(props) {
    const { items } = props;
    const itemsBySubreddit = groupItemsBySubreddit(items);

    function groupItemsBySubreddit(items) {
        const groupedList = { misc: [] };
        items.forEach(i => {
            if (!i.subreddit.length) {
                groupedList.misc.push({ title: i.title, url: i.url });
            } else if (!groupedList.hasOwnProperty(i.subreddit)) {
                groupedList[i.subreddit] = [];
            }
            groupedList[i.subreddit].push({ title: i.title, url: i.url });
        });

        return groupedList;
    }

    return (
        <List component="nav">
            {Object.entries(itemsBySubreddit).map((kvp) => (
                <CollapsibleList component={SavedList} text={kvp[0]} children={kvp[1]} />
            ))}
        </List>
    );
}

export default SubredditSavedList;
