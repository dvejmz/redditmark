const express = require('express');;
const SavedItemRepository = require('./data/savedItemRepository');

module.exports = (logger, awsServerlessExpress, createReddit) => {
    logger.info('app.init');

    const app = express();
    app.use(function(req, res, next) {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });

    app.get('/saved', async (req, res) => {
        logger.info('app.saved')
        const bearerToken = req.get('Authorization');
        if (!bearerToken) {
            return res.status(400).json({ status: 400, error: 'No auth token was provided with request' });
        }

        const token = bearerToken.slice(bearerToken.indexOf(' ') + 1);
        const reddit = createReddit(token);
        const savedItemRepository = SavedItemRepository(reddit);
        let savedItems = null;
        try {
            savedItems = await savedItemRepository.getSavedItems();
        } catch (e) {
            logger.error('app', { error: e.toString() });
            return res.status(500);
        }

        return res.json(savedItems.map(s => s.toObject()));
    });

    const server = awsServerlessExpress.createServer(app);

    function run(event, context) {
        awsServerlessExpress.proxy(server, event, context)
    }

    return {
        run,
    };
};

