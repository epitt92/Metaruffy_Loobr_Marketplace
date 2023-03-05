import { combineReducers } from 'redux';
import auth from './auth/reducer';
import wallet from './wallet/reducer';
import landmap from './landmap/reducer';

export default function createRootReducer() {
    return combineReducers({
        auth,
        wallet,
        landmap
    });
}
