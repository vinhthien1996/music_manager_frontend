import { combineReducers, createStore } from 'redux';
import { MusicReducer } from './reducers/MusicReducer';

const rootReducer = combineReducers({
    MusicReducer
})

export const store = createStore(rootReducer);
