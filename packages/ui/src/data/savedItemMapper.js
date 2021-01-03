import SavedItem from './savedItem';

export default function map({ title, url, subreddit }) {
    return new SavedItem(
        title,
        url,
        subreddit,
    );
};
