import {
    GET_ALL_COLLECTIONS,
    GET_ALL_COLLECTIONS_LOADING,
    CREATE_COLLECTIONS,
    CREATE_COLLECTIONS_LOADING,
    DELETE_COLLECTIONS,
    DELETE_COLLECTIONS_LOADING,
    GET_NFT_BY_COLLECTION,
    GET_NFT_BY_COLLECTION_LOADING,
    GET_COLLECTION_BY_ID,
    GET_COLLECTION_BY_ID_LOADING,
    GET_COLLECTION_LISTINGS,
    GET_COLLECTION_LISTINGS_LOADING,
    GET_OTHER_LISTINGS,
    GET_OTHER_LISTINGS_LOADING,
    EDIT_COLLECTIONS,
    EDIT_COLLECTIONS_LOADING,
    GET_COLLECTION_STATS,
    GET_COLLECTION_STATS_LOADING
} from './actionTypes';
import { Action } from '../../types';

const initialState = {
    collections: [],
    collectionsLoading: false,
    nfts: [],
    nftsLoading: false,
    listings: [],
    listingsLoading: false,
    collection: null,
    collectionLoading: false,
    createCollectionsLoading: false,
    deleteLoading: false,
    otherListings: null,
    otherListingsLoading: false,
    stats: null,
    statsLoading: false,
    editCollectionsLoading: false
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case GET_ALL_COLLECTIONS: {
            return {
                ...state,
                collections: action.payload,
                collectionsLoading: false
            };
        }
        case GET_ALL_COLLECTIONS_LOADING: {
            return { ...state, collectionsLoading: true };
        }
        case CREATE_COLLECTIONS: {
            return {
                ...state,
                collections: action.payload
                    ? { ...state.collections, collections: [action.payload, ...state.collections?.collections] }
                    : state.collections,
                createCollectionsLoading: false
            };
        }
        case CREATE_COLLECTIONS_LOADING: {
            return { ...state, createCollectionsLoading: true };
        }

        case EDIT_COLLECTIONS: {
            return { ...state, editCollectionsLoading: false };
        }
        case EDIT_COLLECTIONS_LOADING: {
            return { ...state, editCollectionsLoading: true };
        }

        case DELETE_COLLECTIONS: {
            const arr = action.payload
                ? state.collections.filter((item: any) => item._id !== action.payload)
                : state.collections;
            return {
                ...state,
                collections: arr,
                deleteLoading: false
            };
        }
        case DELETE_COLLECTIONS_LOADING: {
            return { ...state, deleteLoading: true };
        }
        case GET_NFT_BY_COLLECTION: {
            return {
                ...state,
                nfts: action.payload,
                nftsLoading: false
            };
        }
        case GET_NFT_BY_COLLECTION_LOADING: {
            return { ...state, nftsLoading: true };
        }
        case GET_COLLECTION_BY_ID: {
            return {
                ...state,
                collection: action.payload,
                collectionLoading: false
            };
        }
        case GET_COLLECTION_BY_ID_LOADING: {
            return { ...state, collectionLoading: true };
        }
        case GET_COLLECTION_LISTINGS: {
            return {
                ...state,
                listings: action.payload,
                listingsLoading: false
            };
        }
        case GET_COLLECTION_LISTINGS_LOADING: {
            return { ...state, listingsLoading: true };
        }
        case GET_OTHER_LISTINGS: {
            return {
                ...state,
                otherListings: action.payload,
                otherListingsLoading: false
            };
        }
        case GET_OTHER_LISTINGS_LOADING: {
            return { ...state, otherListingsLoading: true };
        }
        case GET_COLLECTION_STATS: {
            return {
                ...state,
                stats: action.payload,
                statsLoading: false
            };
        }
        case GET_COLLECTION_STATS_LOADING: {
            return { ...state, statsLoading: true };
        }

        default:
            return state;
    }
};

export default reducer;
