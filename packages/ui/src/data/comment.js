class Comment {
    constructor(title, url, subreddit, isNsfw) {
        this._body = title;
        this._url = url;
        this._subreddit = subreddit;
        this._isNsfw = isNsfw;
    }

    get body() {
        return this._body;
    }

    get url() {
        return this._url;
    }

    get subreddit() {
        return this._subreddit;
    }

    get isNsfw() {
        return this._isNsfw;
    }
}

export default Comment;
