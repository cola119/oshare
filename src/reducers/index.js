import { combineReducers } from 'redux';
import firebaseAuthReducer from './src/firebaseAuthReducer';
import firebaseDbReducer from './src/firebaseDbReducer';
import createUIReducer from './src/createUIReducer';

const reducer = combineReducers({
    firebaseAuthReducer,
    firebaseDbReducer,
    createUIReducer,
});

export default reducer;