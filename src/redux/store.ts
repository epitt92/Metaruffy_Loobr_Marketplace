import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import createRootReducer from './configReducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStor

const initialState: any = {};
// const middleware = [thunk];

const persistConfig: any = {
    key: 'root',
    storage: storage
    // timeout: null,
    // whitelist: ["auth"],
    // blacklist: [],
};

const rootReducer = createRootReducer();

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const middleware = [];
const enhancers = [];

// Thunk Middleware
middleware.push(thunk);

// Redux DevTools Configuration
// const actionCreators = {
//     ...authActions,
// };
// If Redux DevTools Extension is installed use it, otherwise use Redux compose
let composeEnhancers = compose;
if (typeof window !== 'undefined') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
// Apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(...middleware));
const enhancer: any = composeEnhancers(...enhancers);

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(rootReducer, initialState, enhancer);

let persistor = persistStore(store);
// persistor.purge();
export { store, persistor };
