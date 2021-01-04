const SavedItem = require('./savedItem');

module.exports = (data) => (
    new SavedItem(
        data.title,
        data.url,
        data.subreddit.display_name
    )
);
