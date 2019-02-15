import React, { useState, useEffect } from 'react';
import createRequest from '../api/request';

function Saved(props) {
    const [token, setToken] = useState('');
    const request = createRequest(fetch);

    useEffect(() => {
        // fetch bearer token from cookie
        // call reddit api with bearer token
    });

    return (
        <div id="saved" className="saved">
            Saved items
        </div>
    );
}

export default Saved;
