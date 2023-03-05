// @flow
import { combineReducers } from 'redux';
import auth from './auth/reducer';
import nft from './nft/reducer';
import user from './user/reducer';
import chat from './messages/reducer';
import collections from './collections/reducer';
import comments from './comments/reducer';
import admin from './admindata/reducer';
import dao from './dao/reducer';
import landmap from './landmap/reducer';
// import wallet from './wallet/reducer';

export default function createRootReducer(): any {
    return combineReducers({
        auth,
        nft,
        user,
        chat,
        collections,
        comments,
        admin,
        dao,
        landmap
        // wallet,
    });
}
