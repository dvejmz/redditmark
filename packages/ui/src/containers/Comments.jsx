import React from 'react';

import Comments from '../components/Comments';

const CommentsPage = ({
    location,
    commentReadRepository,
    getAccessToken,
}) => {
    const fetchComments = async () => {
        const { data } = await commentReadRepository.getComments();
        if (!data || !data.length) {
            return {
                items: [],
            };
        }

        return {
            items: data,
        };
    };

    return (
        <Comments
            getAccessToken={() => getAccessToken(location)}
            fetchComments={fetchComments}
        />
    );
};

export default CommentsPage;
