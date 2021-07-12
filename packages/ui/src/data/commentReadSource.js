export default function (request, authToken, endpoint) {
    async function fetchComments(afterIndex = '') {
        try {
            return {
                data: [
                    { body: 'comment one', url: 'example.com', subreddit: 'testsubreddit' },
                    { body: 'comment two', url: 'example.com', subreddit: 'testsubreddit' },
                    { body: 'comment three', url: 'example.com', subreddit: 'testsubreddit' },
                ]
            };
            //const response = await request.get(
            //    `${endpoint}`,
            //    {
            //        'Authorization': `Bearer ${authToken}`,
            //    },
            //    {
            //        idx: afterIndex,
            //    }
            //);
            //return response.body;
        } catch (e) {
            return null;
        }
    }

    return {
        fetchComments,
    };
};
