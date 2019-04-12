import { combineReducers } from 'redux';
import firebaseAuthReducer from './firebaseAuthReducer';

const reducer = combineReducers({
    firebaseAuthReducer,
});

export default reducer;