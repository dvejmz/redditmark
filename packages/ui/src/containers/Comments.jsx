import React from 'react';

import Comments from '../components/Comments';

const CommentsPage = ({
    location,
    commentReadRepository,
    getAccessToken,
}) => {
    const fetchComments = async ({ pageParam = '' }) => {
        const { data, next } = await commentReadRepository.getComments(pageParam);
        if (!data || !data.length) {
            return {
                items: [],
            };
        }

        return {
            items: data,
            next: next === '' ? undefined: next,
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
