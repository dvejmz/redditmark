import SavedItem from './savedItem';

export function isValidSavedItem(item) {
    return item.title && item.title.length
        && item.url && item.url.length;
}

export function map(data) {
    return new SavedItem(
        data.title,
        data.url,
        data.subreddit.display_name,
    );
};
