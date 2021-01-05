import React from 'react';
import queryString from 'query-string';

import Saved from '../components/Saved';
import SavedItemRepository from '../data/savedItemRepository';
import { MAX_SESSION_COOKIE_AGE } from '../constants';

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

        let accessToken = '';
        if (!accessTokenCookie) {
            const qsParams = queryString.parse(location.search);
            const { code, state } = qsParams;
            accessToken = await fetchToken(code);

            if (!accessToken || !state || !state.length) {
                throw new Error('Failed to autenticate with reddit. Try again by revisiting the home page.');
            }

            const sentState = cookies.get('authorisation_state_nonce');
            if (sentState !== state) {
                throw new Error('Failed to authenticate with reddit: OAuth state nonce mismatch');
            }

            cookies.set('access_token', accessToken, { path: '/', maxAge: MAX_SESSION_COOKIE_AGE });
        } else {
            accessToken = accessTokenCookie;
        }

        return accessToken;
    };

    const fetchSavedItems = async ({ token, pageParam = '' }) => {
        if (!token || !token.length) {
            throw new Error('Invalid token');
        }

        const redditClient = createReddit(request, token, apiEndpoint);
        const savedItemRepository = SavedItemRepository(redditClient);
        const { data, next } = await savedItemRepository.getSavedItems(pageParam);
        if (!data || !data.length) {
            return {
                items: [],
            };
        }

        return {
            items: data,
            next: next === '' ? undefined: next,
        };
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
