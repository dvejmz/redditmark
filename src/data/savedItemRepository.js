import mapSavedItem from './savedItemMapper';

export default (reddit) => {
    function isValidSavedItem(item) {
        return item.title && item.title.length
            && item.url && item.url.length;
    }

    async function getSavedItems() {
        let savedListing = [];
        try {
            savedListing = await reddit.getSavedItems();
            return savedListing
                .map(mapSavedItem)
                .filter(isValidSavedItem);
        } catch (e) {
            return savedListing;
        }
    }

    return {
        getSavedItems,
    };
}
