import React from 'react';

import Saved from '../components/Saved';

const SavedPage = ({
    location,
    getAccessToken,
    savedItemRepository
}) => {
    const fetchSavedItems = async ({ pageParam = '' }) => {
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
