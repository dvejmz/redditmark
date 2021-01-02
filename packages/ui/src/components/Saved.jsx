import React, { useState } from 'react';

import {
   useQuery,
 } from 'react-query';

import SavedList from '../components/SavedList';
import Error from '../components/Error';

const Saved = ({
    getAccessToken,
    fetchSavedItems,
}) => {
    const tokenResult = useQuery('token', getAccessToken);
    const token = tokenResult.data;
    const { isLoading, isIdle, isError, error, data: allItems } = useQuery('savedItems', () => fetchSavedItems(token), { enabled: !!token });

    if (isError) {
        return (<div><Error message={error.message} /></div>);
    }

    return (
        <div>
            {isIdle || isLoading ?
                'Loading...'
                : (
                    <div>
                        <SavedList items={allItems} />
                    </div>
                )
            }
        </div>
    );
};

export default Saved;
