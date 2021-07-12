import Comment from './comment';

export default function map({ body, url, subreddit }) {
    return new Comment(
        body,
        url,
        subreddit,
    );
};
