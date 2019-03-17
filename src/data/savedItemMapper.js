import SavedItem from './savedItem';

export default function map(data) {
    return new SavedItem(
        data.title,
        data.url,
        data.subreddit,
    );
};
