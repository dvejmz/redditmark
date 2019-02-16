import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

function Saved(props) {
    const [token, setToken] = useState('');
    const [savedItems, setSavedItems] = useState([]);
    const { cookies, location, createReddit } = props;

    async function requestToken(code) {
        const { body, status } = await props.request.post('http://localhost:3001/token', { code });
        const response = (status === 200 && body) ? body.token : '';

        if (!response.length) {
            return;
        }

        cookies.set('access_token', response, { path: '/' });
        setToken(response);
    }

    function isValidSavedItem(item) {
        return item.title && item.title.length
            && item.url && item.url.length;
    }

    function mapSavedItem(item) {
        return {
            title: item.title,
            url: item.url,
        };
    }

    async function fetchSavedItems() {
        if (!token.length) {
            return;
        }

        const reddit = createReddit(token);
        let savedListing = [];
        try {
            savedListing = await reddit.getSavedItems();
            const parsedSaveItems = savedListing
                .map(mapSavedItem)
                .filter(isValidSavedItem);
            setSavedItems(parsedSaveItems);
        } catch (e) {
            return;
        }
    }

    async function getAccessToken() {
        const accessTokenCookie = cookies.get('access_token');

        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const code = qsParams.code;
            requestToken(code);
        } else {
            setToken(accessTokenCookie);
        }
    }

    useEffect(() => { getAccessToken() }, []);
    useEffect(() => { fetchSavedItems() }, [token]);

    return (
        <div id="saved" className="saved">
            <h1>My Saved Posts</h1>
            <ul>
                {savedItems.map((item, idx) => (
                    <li key={idx}><a href={item.url}>{item.title}</a></li>
                ))}
            </ul>
        </div>
    );
}

export default Saved;
