import mapSavedItem from './savedItemMapper';

export default (savedItemSource) => {
    async function getSavedItems() {
        let savedListing = [];
        try {
            savedListing = await savedItemSource.getSavedItems();
            if (!savedListing) {
                return [];
            }
            return savedListing
                .map(mapSavedItem);
        } catch (e) {
            return [];
        }
    }

    return {
        getSavedItems,
    };
}
