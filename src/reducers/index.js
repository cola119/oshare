import { combineReducers } from 'redux';
import firebaseAuthReducer from './firebaseAuthReducer';
import firebaseDbReducer from './firebaseDbReducer';

const reducer = combineReducers({
    firebaseAuthReducer,
    firebaseDbReducer,
});

export default reducer;