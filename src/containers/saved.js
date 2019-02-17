import React, { useState, useEffect } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';
import queryString from 'query-string';
import SavedList from '../components/SavedList';
import Error from '../components/Error';

const mapState = (state) => ({
    savedItems: state.savedItems,
});

function Saved(props) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [token, setToken] = useState('');
    const { cookies, location, createReddit } = props;
    const { savedItems } = useMappedState(mapState);
    const dispatch = useDispatch();

    async function requestToken(code) {
        const { body, status } = await props.request.post(
            'https://24gfqm09w5.execute-api.eu-west-1.amazonaws.com/test/token',
            { code },
        );
        
        if (status !== 200 || !body) {
            setErrorMessage('Failed to authenticate with reddit');
            return;
        }

        const responseStatus = body.status;
        if (responseStatus !== 200) {
            setErrorMessage('Failed to authenticate with reddit');
            return;
        }

        const response = body.body;
        const newToken = (response.token && response.token.length) ? response.token : '';
        cookies.set('access_token', newToken, { path: '/', maxAge: 3600 });
        setToken(newToken);
        setErrorMessage(null);
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
            dispatch({ type: 'ADD_SAVED_ITEMS', items: parsedSaveItems });
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
        errorMessage ?
            <Error message={errorMessage} />
        :
            <SavedList items={savedItems} />
    );
}

export default Saved;
