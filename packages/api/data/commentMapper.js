const Comment = require('./comment');

module.exports = (data) => (
    new Comment(
        data.body,
        data.url,
        data.subreddit.display_name
    )
);
