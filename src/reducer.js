export default function reducer(state, action) {
    switch (action.type) {
        case 'ADD_SAVED_ITEMS': {
            return {
                ...state,
                savedItems: action.items,
            };
        }
        default: {
            return state;
        }
    };
};
