import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "./configReducers";
import * as authActions from "./auth/actions";

const rootReducer = createRootReducer();

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const configureStore = () => {
    // Redux Configuration
    const middleware = [];
    const enhancers = [];

    // Thunk Middleware
    middleware.push(thunk);

    // Redux DevTools Configuration
    const actionCreators = {
        ...authActions,
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    let composeEnhancers = compose;
    if (typeof window !== "undefined") {
        composeEnhancers =
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }
    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware));
    const enhancer = composeEnhancers(...enhancers);

    // Create Store
    const store = createStore(rootReducer, enhancer);

    // if (module.hot) {
    //     module.hot.accept(
    //         "./configReducers",
    //         // eslint-disable-next-line global-require
    //         () => store.replaceReducer(require("./configReducers").default)
    //     );
    // }

    return store;
};

export default { configureStore };
