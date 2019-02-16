import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

function Saved(props) {
    const [token, setToken] = useState('');
    const [savedItems, setSavedItems] = useState([]);
    const { cookies, location, createReddit } = props;

    async function fetchToken(code) {
        const { body, status } = await props.request.post('http://localhost:3001/token', { code });
        const response = (status === 200 && body) ? body.token : '';

        if (!response.length) {
            return;
        }

        cookies.set('access_token', response, { path: '/' });
        setToken(response);
    }

    async function fetchSavedItems(reddit) {
        let savedListing = [];
        try {
            savedListing = await reddit.getSavedItems();
            const parsedSaveItems = savedListing.map((i) => {
                return { title: i.title, url: i.url };
            }).filter(i => i.title && i.title.length && i.url && i.url.length);
            setSavedItems(parsedSaveItems);
        } catch (e) {
            return;
        }
    }

    useEffect(() => {
        const accessTokenCookie = cookies.get('access_token');

        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const code = qsParams.code;
            fetchToken(code);
        } else {
            setToken(accessTokenCookie);
        }
    }, []);

    useEffect(() => {
        if (!token.length) {
            return;
        }

        const reddit = createReddit(token);
        fetchSavedItems(reddit);
    }, [token])

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
