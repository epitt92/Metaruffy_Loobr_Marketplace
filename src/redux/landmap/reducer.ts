import {
    GET_TOPISLANDOWNERS,
    GET_TOPLANDOWNERS,
    GET_ISLANDS,
    GET_LANDS,
    GET_TOPONEISLANDOWNERS,
    GET_ALL_LISTINGS,
    LOADING,
    GET_MY_LANDS,
    GET_ISLAND_OWNERS
} from './actionTypes';
import { Action } from '../../types';
import { SEND_GIFT } from '../nft/actionTypes';

const initialState = {
    topLandOwners: null,
    topIslandOwners: null,
    topOneIslandOwners: null,
    listings: null,
    lands: null,
    islands: null,
    mylands: null,
    islandOwners: null,
    loading: false
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case GET_TOPLANDOWNERS: {
            return { ...state, topLandOwners: action.payload };
        }
        case GET_TOPISLANDOWNERS: {
            return { ...state, topIslandOwners: action.payload };
        }
        case GET_TOPONEISLANDOWNERS: {
            return { ...state, topOneIslandOwners: action.payload };
        }
        case GET_LANDS: {
            return { ...state, lands: action.payload };
        }
        case GET_ISLANDS: {
            return { ...state, islands: action.payload };
        }
        case GET_ALL_LISTINGS: {
            return { ...state, listings: action.payload };
        }
        case GET_MY_LANDS: {
            return { ...state, mylands: action.payload };
        }
        case GET_ISLAND_OWNERS: {
            return { ...state, islandOwners: action.payload };
        }
        case LOADING: {
            return { ...state, loading: true };
        }
        default:
            return state;
    }
};

export default reducer;
