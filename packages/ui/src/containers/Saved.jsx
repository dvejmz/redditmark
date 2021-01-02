import React from 'react';
import queryString from 'query-string';

import SavedComponent from '../components/Saved';

const Saved = (props) => {
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
        <SavedComponent
            location={location}
            getAccessToken={getAccessToken}
        />
    )
};

export default Saved;
