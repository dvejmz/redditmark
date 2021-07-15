import Comment from './comment';

export default function map({ body, url, subreddit, isNsfw }) {
    return new Comment(
        body,
        url,
        subreddit,
        isNsfw
    );
};
