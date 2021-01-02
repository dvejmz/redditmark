import React from 'react';
import queryString from 'query-string';

import Saved from '../components/Saved';
import SavedItemRepository from '../data/savedItemRepository';

const SavedPage = ({
    location,
    fetchToken,
    cookies,
    createReddit,
    request,
    apiEndpoint,
}) => {
    const getAccessToken = async () => {
        const accessTokenCookie = cookies.get('access_token');

        let newToken = '';
        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const code = qsParams.code;
            newToken = await fetchToken(code);

            if (!newToken) {
                throw new Error('Failed to autenticate with reddit');
            }
            cookies.set('access_token', newToken, { path: '/', maxAge: 3600 });
        } else {
            newToken = accessTokenCookie;
        }

        return newToken;
    };

    const fetchSavedItems = async (token) => {
        if (!token || !token.length) {
            throw new Error('Invalid token');
        }

        const redditClient = createReddit(request, token, apiEndpoint);
        const savedItemRepository = SavedItemRepository(redditClient);
        const items = await savedItemRepository.getSavedItems();
        if (!items || !items.length) {
            return [];
        }

        return items;
    }


    return (
        <Saved
            location={location}
            getAccessToken={getAccessToken}
            fetchSavedItems={fetchSavedItems}
        />
    )
};

export default SavedPage;
