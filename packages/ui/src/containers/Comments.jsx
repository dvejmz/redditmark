import React from 'react';

import Comments from '../components/Comments';
import CommentReadSource from '../data/commentReadSource';
import CommentRepository from '../data/commentReadRepository';

const apiBase = process.env.REACT_APP_API_BASE_URL;

const CommentsPage = ({
    location,
    createReddit,
    request,
    apiEndpoint,
    getAccessToken,
}) => {
    const fetchComments = async ({ token }) => {
        if (!token || !token.length) {
            throw new Error('Invalid token');
        }

        const redditClient = CommentReadSource(request, token, `${apiBase}/comments`);
        const commentRepository = CommentRepository(redditClient);
        const { data } = await commentRepository.getComments();
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
