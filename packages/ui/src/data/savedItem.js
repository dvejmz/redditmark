class SavedItem {
    constructor(title, url, subreddit) {
        this._title = title;
        this._url = url;
        this._subreddit = subreddit;
    }

    get title() {
        return this._title;
    }

    get url() {
        return this._url;
    }

    get subreddit() {
        return this._subreddit;
    }
}

export default SavedItem;
