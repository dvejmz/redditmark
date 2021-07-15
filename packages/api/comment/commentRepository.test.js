const CommentRepository = require('./commentRepository');
const Comment = require('./comment');

describe('commentRepository', () => {
    let commentRepository;

    it('should map reddit API comment data', async () => {
        const commentReadSourceMock = {
            getComments: jest.fn().mockReturnValue({
                items: [
                    {
                        body: "a message",
                        permalink: '/r/samplesubreddit/32wdfd',
                        subreddit: {
                            display_name: 'samplesubreddit',
                        },
                        over_18: false,
                    },
                    {
                        body: "nsfw message",
                        permalink: '/r/samplesubreddit/ijrewr3',
                        subreddit: {
                            display_name: 'samplesubreddit',
                        },
                        over_18: true,
                    },
                ],
                next: ''
            })
        };
        commentRepository = CommentRepository(commentReadSourceMock);
        const expected = {
            data: [
                new Comment(
                    "a message",
                    'https://reddit.com/r/samplesubreddit/32wdfd',
                    'samplesubreddit',
                    false,
                ),
                new Comment(
                    "nsfw message",
                    'https://reddit.com/r/samplesubreddit/ijrewr3',
                    'samplesubreddit',
                    true,
                ),
            ],
            next: ''
        };
        const actual = await commentRepository.getComments();
        expect(actual).toEqual(expected);
    });

    it('should truncate comments that are too long', async () => {
        const longMessage = "text".repeat(200);
        const commentReadSourceMock = {
            getComments: jest.fn().mockReturnValue({
                items: [
                    {
                        body: longMessage,
                        permalink: '/r/samplesubreddit/32wdfd',
                        subreddit: {
                            display_name: 'samplesubreddit',
                        },
                        over_18: false,
                    },
                    {
                        body: "nsfw message",
                        permalink: '/r/samplesubreddit/ijrewr3',
                        subreddit: {
                            display_name: 'samplesubreddit',
                        },
                        over_18: true,
                    },
                ],
                next: ''
            })
        };
        commentRepository = CommentRepository(commentReadSourceMock);
        const expected = {
            data: [
                new Comment(
                    'texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext...',
                    'https://reddit.com/r/samplesubreddit/32wdfd',
                    'samplesubreddit',
                    false,
                ),
                new Comment(
                    "nsfw message",
                    'https://reddit.com/r/samplesubreddit/ijrewr3',
                    'samplesubreddit',
                    true,
                ),
            ],
            next: ''
        };
        const actual = await commentRepository.getComments();
        expect(actual).toEqual(expected);
    });
});
