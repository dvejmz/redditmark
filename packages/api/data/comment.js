module.exports = class Comment {
    constructor(body, url, subreddit, isNsfw) {
        this._body = body;
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

    toObject() {
        return {
            body: this._body,
            url: this._url,
            subreddit: this._subreddit,
            isNsfw: this._isNsfw
        };
    }
};
