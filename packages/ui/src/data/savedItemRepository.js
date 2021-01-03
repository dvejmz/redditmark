import mapSavedItem from './savedItemMapper';

export default (savedItemSource) => {
    async function getSavedItems(afterIndex) {
        try {
            const response = await savedItemSource.getSavedItems(afterIndex);
            const { data, next } = response;
            if (!data) {
                return {
                    data: [],
                    next: '',
                };
            }
            return {
                data: data.map(mapSavedItem),
                next,
            };
        } catch (e) {
            throw new Error('Failed to fetch saved items');
        }
    }

    return {
        getSavedItems,
    };
}
