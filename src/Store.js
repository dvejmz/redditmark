import { createStore } from 'redux';
import reducer from './reducer';

export function makeStore() {
    return createStore(reducer, {
        savedItems: [],
    }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
};
