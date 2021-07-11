import React from 'react';

import Saved from '../components/Saved';
import SavedItemRepository from '../data/savedItemRepository';

const SavedPage = ({
    location,
    getAccessToken,
    createReddit,
    request,
    apiEndpoint,
}) => {
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
            getAccessToken={() => getAccessToken(location)}
            fetchSavedItems={fetchSavedItems}
        />
    )
};

export default SavedPage;
