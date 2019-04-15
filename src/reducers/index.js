import { combineReducers } from 'redux';
import firebaseAuthReducer from './firebaseAuthReducer';
import firebaseDbReducer from './firebaseDbReducer';
import createUIReducer from './createUIReducer';

const reducer = combineReducers({
    firebaseAuthReducer,
    firebaseDbReducer,
    createUIReducer,
});

export default reducer;