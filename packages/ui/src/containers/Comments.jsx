import React from 'react';

import Comments from '../components/Comments';
//import CommentsItemRepository from '../data/savedItemRepository';

const CommentsPage = ({
    location,
    getAccessToken,
}) => {
    const fetchComments = async () => {
        return {
            items: [
                { url: 'example.com', subreddit: 'testsubreddit', title: 'comment one' },
                { url: 'example.com', subreddit: 'testsubreddit', title: 'comment two' },
                { url: 'example.com', subreddit: 'testsubreddit', title: 'comment three' },
            ]
        }
    };

    return (
        <Comments
            getAccessToken={() => getAccessToken(location)}
            fetchComments={fetchComments}
        />
    );
};

export default CommentsPage;
