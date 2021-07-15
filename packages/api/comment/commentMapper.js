const Comment = require('./comment');

const RedditDomain = 'https://reddit.com';

module.exports = (data) => (
    new Comment(
        data.body,
        [RedditDomain, data.permalink].join(''),
        data.subreddit.display_name,
        data.over_18
    )
);
