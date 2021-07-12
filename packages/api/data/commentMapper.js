const Comment = require('./comment');

module.exports = (data) => (
    new Comment(
        data.body,
        data.link_url,
        data.subreddit.display_name,
        data.over_18
    )
);
