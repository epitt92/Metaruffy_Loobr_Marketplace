import {
    GET_NFT,
    LOADING,
    GET_FEED,
    CREATE_FEED,
    LOADING_CREATE_FEED,
    LOADING_POST_COMMENT,
    POST_COMMENT,
    GET_NFT_LOADING,
    CREATE_WALLET_LOADING,
    CREATE_WALLET,
    GET_TOP_USERS,
    GET_TOP_USERS_LOADING,
    POST_LIKE,
    GET_ALL_USERS_LOADING,
    GET_ALL_USERS,
    GET_USER_BY_ID,
    GET_USER_BY_ID_LOADING,
    POST_DELETE,
    POST_DELETE_LOADING,
    GET_LOOBR_SCORE,
    GET_LOOBR_SCORE_LOADING,
    GET_RECENTLY_REGISTERED_USERS,
    GET_RECENTLY_REGISTERED_USERS_LOADING,
    GET_USER_STATS,
    GET_USER_STATS_LOADING,
    CHANGE_2FA_STATUS,
    CHANGE_2FA_STATUS_LOADING,
    CLEAR_USER_DATA,
    SELECT_POLL_LOADING,
    SELECT_POLL,
    COMMENT_DELETE,
    COMMENT_DELETE_LOADING
} from './actionTypes';
import { Action } from '../../types';
import { SEND_GIFT } from '../nft/actionTypes';

const initialState = {
    AllNFT: null,
    allNFTLoading: false,
    loading: false,
    AllFeeds: null,
    loadingcreatefeed: false,
    loadingcomment: false,
    createWalletLoading: false,
    topUsers: null,
    topUsersLoading: false,
    allUsers: null,
    allUsersLoading: false,
    user: null,
    userLoading: false,
    postdelteloading: false,
    loobrScore: 0,
    scoreLoading: false,
    recentUsers: null,
    recentUsersLoading: false,
    stats: null,
    statsLoading: false,
    twoFaStatusLoading: false,
    selectpollloading: false,
    commentdelteloading: false
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case GET_NFT: {
            return { ...state, AllNFT: action.payload, allNFTLoading: false };
        }
        case GET_NFT_LOADING: {
            return { ...state, allNFTLoading: true };
        }
        case LOADING: {
            return { ...state, loading: true };
        }
        case GET_FEED: {
            return { ...state, loading: false, AllFeeds: action.payload };
        }
        case CREATE_FEED: {
            return {
                ...state,
                AllFeeds: {
                    metadata: state?.AllFeeds?.metadata,
                    feeds: [
                        action.payload.active && { feed: action.payload, commentLength: 0 },
                        ...state?.AllFeeds?.feeds
                    ]
                },
                loadingcreatefeed: false
            };
        }
        case LOADING_CREATE_FEED: {
            return { ...state, loadingcreatefeed: true };
        }
        case LOADING_POST_COMMENT: {
            return { ...state, loadingcomment: true };
        }
        case POST_COMMENT: {
            return {
                ...state,
                loadingcomment: false
            };
        }
        case CREATE_WALLET: {
            return {
                ...state,
                createWallet: false
            };
        }
        case CREATE_WALLET_LOADING: {
            return { ...state, createWallet: true };
        }
        case GET_TOP_USERS: {
            return {
                ...state,
                topUsers: action.payload,
                topUsersLoading: false
            };
        }
        case GET_TOP_USERS_LOADING: {
            return { ...state, topUsersLoading: true };
        }
        case POST_LIKE: {
            return { ...state };
        }
        case GET_ALL_USERS: {
            return {
                ...state,
                allUsers: action.payload,
                allUsersLoading: false
            };
        }
        case GET_ALL_USERS_LOADING: {
            return { ...state, allUsersLoading: true };
        }
        case GET_USER_BY_ID: {
            return {
                ...state,
                user: action.payload,
                userLoading: false
            };
        }
        case GET_USER_BY_ID_LOADING: {
            return { ...state, userLoading: true };
        }
        case POST_DELETE: {
            return {
                ...state,
                AllFeeds: {
                    metadata: state?.AllFeeds?.metadata,
                    feeds: state?.AllFeeds?.feeds.filter((obj: any) => obj?.feed?._id != action?.payload)
                },

                postdelteloading: false
            };
        }
        case POST_DELETE_LOADING: {
            return { ...state, postdelteloading: true };
        }
        case COMMENT_DELETE: {
            return {
                ...state,
                commentdelteloading: false
            };
        }
        case COMMENT_DELETE_LOADING: {
            return { ...state, commentdelteloading: true };
        }
        case GET_LOOBR_SCORE: {
            return {
                ...state,
                loobrScore: action.payload,
                scoreLoading: false
            };
        }
        case GET_LOOBR_SCORE_LOADING: {
            return { ...state, scoreLoading: true };
        }
        case GET_RECENTLY_REGISTERED_USERS: {
            return {
                ...state,
                recentUsers: action.payload,
                recentUsersLoading: false
            };
        }
        case GET_RECENTLY_REGISTERED_USERS_LOADING: {
            return { ...state, recentUsersLoading: true };
        }
        case GET_RECENTLY_REGISTERED_USERS: {
            return {
                ...state,
                recentUsers: action.payload,
                recentUsersLoading: false
            };
        }
        case GET_RECENTLY_REGISTERED_USERS_LOADING: {
            return { ...state, recentUsersLoading: true };
        }
        case GET_USER_STATS: {
            return {
                ...state,
                stats: action.payload,
                statsLoading: false
            };
        }
        case GET_USER_STATS_LOADING: {
            return { ...state, statsLoading: true };
        }
        case CHANGE_2FA_STATUS: {
            return { ...state, twoFaStatusLoading: false };
        }
        case CHANGE_2FA_STATUS_LOADING: {
            return { ...state, twoFaStatusLoading: true };
        }
        case SEND_GIFT: {
            if (action.payload && state.AllNFT) {
                return {
                    ...state,
                    AllNFT: {
                        ...state.AllNFT,
                        tokens: state.AllNFT?.tokens?.filter((item: any) => item.tokenId !== action.payload)
                    }
                };
            } else {
                return state;
            }
        }
        case CLEAR_USER_DATA: {
            return {
                ...state,
                user: null
            };
        }
        case SELECT_POLL_LOADING: {
            return {
                ...state,
                selectpollloading: true
            };
        }
        case SELECT_POLL: {
            return {
                ...state,
                AllFeeds: {
                    metadata: state?.AllFeeds?.metadata,
                    feeds: state?.AllFeeds?.feeds.map((obj: any) => {
                        if (obj?.feed?._id == action?.payload?._id) {
                            return { commentLength: obj?.commentLength, feed: action?.payload };
                        } else {
                            return obj;
                        }
                    })
                },
                selectpollloading: false
            };
        }
        default:
            return state;
    }
};

export default reducer;
