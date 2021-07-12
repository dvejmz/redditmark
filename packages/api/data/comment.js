module.exports = class Comment {
    constructor(body, url, subreddit) {
        this._body = body;
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

    toObject() {
        return {
            body: this._body,
            url: this._url,
            subreddit: this._subreddit,
        };
    }
};
