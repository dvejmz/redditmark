import React from 'react';
import queryString from 'query-string';

import Saved from '../components/Saved';

const SavedPage = (props) => {
    const {
        location,
        fetchToken,
        cookies,
    } = props;

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
    }

    return (
        <Saved
            location={location}
            getAccessToken={getAccessToken}
        />
    )
};

export default SavedPage;
