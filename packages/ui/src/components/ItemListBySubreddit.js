import React from 'react';
import alphaSort from 'alpha-sort';
import List from '@material-ui/core/List';
import ItemList from './ItemList';
import CollapsibleList from './CollapsibleList';

function SubredditSavedList(props) {
    const { items } = props;
    const itemsBySubreddit = groupItemsBySubreddit(items);

    function sortItemsBySubreddit(items) {
        return items.sort((a, b) => alphaSort.asc(a.subreddit.toLowerCase(), b.subreddit.toLowerCase()));
    }

    function groupItemsBySubreddit(items) {
        const groupedList = {};
        const misc = [];
        const sortedItems = sortItemsBySubreddit(items);
        sortedItems.forEach(i => {
            const subreddit = i.subreddit;
            if (!subreddit.length) {
                misc.push({ title: i.title, url: i.url });
            } else if (!groupedList.hasOwnProperty(subreddit)) {
                groupedList[subreddit] = [];
            }
            groupedList[subreddit].push({ title: i.title, url: i.url });
        });

        if (misc.length) {
            groupedList.misc = misc;
        }
        return groupedList;
    }

    return (
        <List component="nav">
            {Object.entries(itemsBySubreddit).map((kvp) => (
                <CollapsibleList key={kvp[0]} component={ItemList} text={kvp[0]} children={kvp[1]} />
            ))}
        </List>
    );
}

export default SubredditSavedList;
