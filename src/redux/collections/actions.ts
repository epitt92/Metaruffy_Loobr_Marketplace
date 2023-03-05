import axios from 'axios';
import { toast } from 'react-toastify';
import { Action, Dispatch } from '../../types';
import {
    CREATE_COLLECTIONS,
    CREATE_COLLECTIONS_LOADING,
    DELETE_COLLECTIONS,
    DELETE_COLLECTIONS_LOADING,
    EDIT_COLLECTIONS,
    EDIT_COLLECTIONS_LOADING,
    GET_ALL_COLLECTIONS,
    GET_ALL_COLLECTIONS_LOADING,
    GET_COLLECTION_BY_ID,
    GET_COLLECTION_BY_ID_LOADING,
    GET_COLLECTION_LISTINGS,
    GET_COLLECTION_LISTINGS_LOADING,
    GET_NFT_BY_COLLECTION,
    GET_NFT_BY_COLLECTION_LOADING,
    GET_OTHER_LISTINGS,
    GET_OTHER_LISTINGS_LOADING,
    GET_COLLECTION_STATS,
    GET_COLLECTION_STATS_LOADING
} from './actionTypes';

export const getAllCollections: any = (params: any) => async (dispatch: Dispatch, getState: any) => {
    dispatch(getAllCollectionsLoading());
    const { collections } = getState().collections;
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
            params: params
        })
        .then(async (res) => {
            if (res.data.data.page > 1) {
                const data = { ...collections };
                data.collections = [...collections?.collections, ...res.data.data.collections];
                dispatch({
                    type: GET_ALL_COLLECTIONS,
                    payload: data
                });
            } else {
                dispatch({
                    type: GET_ALL_COLLECTIONS,
                    payload: res.data.data
                });
            }
        })
        .catch((err) => {
            dispatch({
                type: GET_ALL_COLLECTIONS,
                payload: null
            });
        });
};

export const getAllCollectionsLoading = (): Action => {
    return { type: GET_ALL_COLLECTIONS_LOADING };
};

export const createCollection: any = (data: any, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(createCollectionLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/collections/create`, data)
        .then(async (res) => {
            dispatch({
                type: CREATE_COLLECTIONS,
                payload: res.data.data
            });
            setState();
            toast.success('Operation completed successfully');
        })
        .catch((err) => {
            dispatch({
                type: CREATE_COLLECTIONS,
                payload: null
            });
            toast.error(err.response.data.message);
        });
};

export const createCollectionLoading = (): Action => {
    return { type: CREATE_COLLECTIONS_LOADING };
};

export const editCollection: any = (id: string, data: any, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(editCollectionLoading());
    axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/collections/${id}`, data)
        .then(async (res) => {
            dispatch({
                type: EDIT_COLLECTIONS,
                payload: res.data.data
            });
            dispatch(getCollectionById(id));
            setState();
            toast.success('Collection updated');
        })
        .catch((err) => {
            dispatch({
                type: EDIT_COLLECTIONS,
                payload: null
            });
            toast.error(err.response.data.message);
        });
};

export const editCollectionLoading = (): Action => {
    return { type: EDIT_COLLECTIONS_LOADING };
};

export const editExtCollection: any =
    (id: string, data: any, setState: Function, fetchCollection: Function) => async (dispatch: Dispatch) => {
        dispatch(editExtCollectionLoading());
        axios
            .put(`${process.env.NEXT_PUBLIC_API_URL}/collections/external/${id}`, data)
            .then(async (res) => {
                dispatch({
                    type: EDIT_COLLECTIONS,
                    payload: res.data.data
                });
                // dispatch(getCollectionById(id));
                fetchCollection && fetchCollection(res?.data?.data?.address);
                setState();
                toast.success('Collection updated');
            })
            .catch((err) => {
                dispatch({
                    type: EDIT_COLLECTIONS,
                    payload: null
                });
                toast.error(err.response.data.message);
            });
    };

export const editExtCollectionLoading = (): Action => {
    return { type: EDIT_COLLECTIONS_LOADING };
};

export const deleteCollection: any = (id: string, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(deleteCollectionLoading());
    axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/collections/${id}`)
        .then(async (res) => {
            dispatch({
                type: DELETE_COLLECTIONS,
                payload: id
            });
            setState();
        })
        .catch((err) => {
            dispatch({
                type: DELETE_COLLECTIONS,
                payload: null
            });
        });
};

export const deleteCollectionLoading = (): Action => {
    return { type: DELETE_COLLECTIONS_LOADING };
};

export const getCollectionById: any = (id: string) => async (dispatch: Dispatch) => {
    dispatch(getCollectionByIdLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/${id}`)
        .then(async (res) => {
            dispatch({
                type: GET_COLLECTION_BY_ID,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_COLLECTION_BY_ID,
                payload: null
            });
        });
};

export const getCollectionByAddress: any = (address: string) => async (dispatch: Dispatch) => {
    dispatch(getCollectionByIdLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/external/${address}`)
        .then(async (res) => {
            dispatch({
                type: GET_COLLECTION_BY_ID,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_COLLECTION_BY_ID,
                payload: null
            });
        });
};

export const getCollectionByIdLoading = (): Action => {
    return { type: GET_COLLECTION_BY_ID_LOADING };
};

export const getNft: any = (filters: any) => async (dispatch: Dispatch) => {
    dispatch(getNftLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/nfts`, {
            params: filters
        })
        .then(async (res) => {
            dispatch({
                type: GET_NFT_BY_COLLECTION,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT_BY_COLLECTION,
                payload: null
            });
        });
};

export const getNftLoading = (): Action => {
    return { type: GET_NFT_BY_COLLECTION_LOADING };
};

export const getListings: any = (filters: any) => async (dispatch: Dispatch) => {
    dispatch(getListingsLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/listings`, {
            params: filters
        })
        .then(async (res) => {
            dispatch({
                type: GET_COLLECTION_LISTINGS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_COLLECTION_LISTINGS,
                payload: null
            });
        });
};

export const getListingsLoading = (): Action => {
    return { type: GET_COLLECTION_LISTINGS_LOADING };
};

export const getOtherListings: any = (collectionId: string, listingId: string) => async (dispatch: Dispatch) => {
    dispatch(getOtherListingsLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/other/${collectionId}`, {
            params: { listingId }
        })
        .then(async (res) => {
            dispatch({
                type: GET_OTHER_LISTINGS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_OTHER_LISTINGS,
                payload: null
            });
        });
};

export const getOtherListingsLoading = (): Action => {
    return { type: GET_OTHER_LISTINGS_LOADING };
};

export const getCollectionStats: any = (id: string) => async (dispatch: Dispatch) => {
    dispatch(getCollectionStatsLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/stats/${id}`)
        .then(async (res) => {
            dispatch({
                type: GET_COLLECTION_STATS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_COLLECTION_STATS,
                payload: null
            });
        });
};

export const getCollectionStatsLoading = (): Action => {
    return { type: GET_COLLECTION_STATS_LOADING };
};
