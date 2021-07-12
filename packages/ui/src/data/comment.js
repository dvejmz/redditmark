class Comment {
    constructor(title, url, subreddit) {
        this._body = title;
        this._url = url;
        this._subreddit = subreddit;
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
}

export default Comment;
