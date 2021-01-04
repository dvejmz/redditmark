const mapSavedItem = require('./savedItemMapper');

module.exports = (reddit) => {
    function isValidSavedItem(item) {
        return item.title && item.title.length
            && item.url && item.url.length;
    }

    async function getSavedItems(afterIndex) {
        let savedListing = [];
        try {
            const result = await reddit.getSavedItems({ limit: 100, after: afterIndex });
            savedListing = result.items
                .map(mapSavedItem)
                .filter(isValidSavedItem);
            return {
                data: savedListing,
                next: result.next,
            };
        } catch (e) {
            throw new Error('Failed to retrieve saved items: ', e.message);
        }
    }

    return {
        getSavedItems,
    };
};
