import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

function Saved(props) {
    const [token, setToken] = useState('');

    useEffect(() => {
        const qsParams = queryString.parse(props.location.search);
        setToken(qsParams.code);
    });

    return (
        <div id="saved" className="saved">
        </div>
    );
}

export default Saved;
