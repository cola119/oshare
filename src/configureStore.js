import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducers';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["firebaseAuthReducer"]
    // whitelist: ["firebaseAuthReducer", "firebaseDbReducer"]
};

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer);

export const persistor = persistStore(store);
export default store;