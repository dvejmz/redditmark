import React, { useState } from 'react';

import {
   useQuery,
 } from 'react-query';

import Error from '../components/Error';

const Saved = ({ getAccessToken }) => {
    const { isLoading, isError, error, data: token } = useQuery('token', getAccessToken);

    if (isError) {
        return <Error message={error.message} />;
    }

    return (
        <div>
            {isLoading ?
                'Loading...'
                : <pre>{token}</pre>}
        </div>
    );
};

export default Saved;
