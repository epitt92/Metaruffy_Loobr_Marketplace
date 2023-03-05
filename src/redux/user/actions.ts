import axios from 'axios';
import { toast } from 'react-toastify';
import { Action, Dispatch } from '../../types';
import { GET_USER } from '../auth/actionTypes';
import {
    GET_NFT,
    GET_NFT_LOADING,
    LOADING,
    GET_FEED,
    CREATE_FEED,
    LOADING_CREATE_FEED,
    LOADING_POST_COMMENT,
    POST_COMMENT,
    CREATE_WALLET,
    CREATE_WALLET_LOADING,
    GET_TOP_USERS,
    GET_TOP_USERS_LOADING,
    POST_LIKE,
    GET_ALL_USERS,
    GET_ALL_USERS_LOADING,
    GET_USER_BY_ID,
    GET_USER_BY_ID_LOADING,
    POST_DELETE,
    POST_DELETE_LOADING,
    COMMENT_DELETE,
    COMMENT_DELETE_LOADING,
    GET_LOOBR_SCORE,
    GET_LOOBR_SCORE_LOADING,
    GET_RECENTLY_REGISTERED_USERS,
    GET_RECENTLY_REGISTERED_USERS_LOADING,
    GET_USER_STATS,
    GET_USER_STATS_LOADING,
    CHANGE_2FA_STATUS,
    CHANGE_2FA_STATUS_LOADING,
    SELECT_POLL,
    SELECT_POLL_LOADING
} from './actionTypes';

export const getNft: any = (address: string) => async (dispatch: Dispatch) => {
    dispatch(getNftLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL2}/nfts/${address}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            // console.log(res.data);

            dispatch({
                type: GET_NFT,
                payload: res.data.nfts
            });

            // toast.success("NFT created successfully");
            // Router.push('/profile')
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT,
                payload: null
            });

            // toast.error(err.response.data.message);
        });
};

export const getMYOwnNft: any = (filters: object, address: string) => async (dispatch: Dispatch) => {
    dispatch(getNftLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/user-tokens/${address}`, {
            params: filters,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            // console.log(res.data);

            dispatch({
                type: GET_NFT,
                payload: res.data.data
            });

            // toast.success("NFT created successfully");
            // Router.push('/profile')
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT,
                payload: null
            });

            // toast.error(err.response.data.message);
        });
};
export const getNftLoading = (): Action => {
    return { type: GET_NFT_LOADING };
};

export const getFeeds: any =
    (filters: any, id: string = '', loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        if (loading) dispatch(Loading());

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/feed/getAllFeeds`, {
                params: filters
            })
            .then((res) => {
                dispatch({
                    type: GET_FEED,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_FEED
                });
            });
    };

export const createFeed: any =
    (data: any, setState: Function, setConfirmed: Function) => async (dispatch: Dispatch) => {
        dispatch(LoadingCreate());
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/feed/create`, data, config)
            .then((res) => {
                dispatch({
                    type: CREATE_FEED,
                    payload: res.data.data
                });
                // dispatch(getFeeds());

                setConfirmed && setConfirmed(true);

                setState();
                // toast.success("Feed created successfully");
                // Router.push('/profile')
            })
            .catch((err) => {
                dispatch({
                    type: CREATE_FEED
                });
                console.log(err);
                setState();
                toast.error(err?.response?.data?.message);
            });
    };
export const pollSelection: any = (data: any, setConfirm: Function) => async (dispatch: Dispatch) => {
    dispatch(LoadinPollSecltion());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/feed/selectpoll`, data)
        .then((res) => {
            dispatch({
                type: SELECT_POLL,
                payload: res.data.data
            });
            setConfirm && setConfirm(true);
        })
        .catch((err) => {
            dispatch({
                type: SELECT_POLL
            });
            console.log(err);
            toast.error(err?.response?.data?.message);
        });
};
export const LoadinPollSecltion = (): Action => {
    return { type: SELECT_POLL_LOADING };
};

export const postComment: any =
    (data: Object, setState: Function, setConfirmed: Function) => async (dispatch: Dispatch) => {
        dispatch(LoadingComment());
        // setState();
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/comment/create`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                dispatch({
                    type: POST_COMMENT
                });
                // dispatch(getFeeds())
                setConfirmed(true);
                setState();
                // toast.success("Comment Posted successfully");
                // Router.push('/profile')
            })
            .catch((err) => {
                // dispatch({
                //     type: POST_COMMENT,
                // });
                setState();
                toast.error(err?.response?.data?.message);
            });
    };
export const postReply: any =
    (data: Object, setState: Function, setConfirmed: Function) => async (dispatch: Dispatch) => {
        dispatch(LoadingComment());
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/comment/reply`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                dispatch({
                    type: POST_COMMENT
                });
                setConfirmed(true);
                setState();
            })
            .catch((err) => {
                setState();
                // toast.error(err.response.data.message);
            });
    };

export const postLike: any = (data: any) => async (dispatch: Dispatch) => {
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/feed/postLike`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: POST_LIKE
            });
        })
        .catch((err) => {
            dispatch({
                type: POST_LIKE
            });
            toast.error(err.response.data.message);
        });
};
export const commentLike: any = (data: any, setConfirmed: Function) => async (dispatch: Dispatch) => {
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/comment/postLike`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            setConfirmed && setConfirmed(true);
            dispatch({
                type: POST_LIKE
            });
        })
        .catch((err) => {
            dispatch({
                type: POST_LIKE
            });
            toast.error(err?.response?.data?.message);
        });
};

export const Loading = (): Action => {
    return { type: LOADING };
};

export const LoadingCreate = (): Action => {
    return { type: LOADING_CREATE_FEED };
};

export const LoadingComment = (): Action => {
    return { type: LOADING_POST_COMMENT };
};

export const createWallet: any = (data: any) => async (dispatch: Dispatch) => {
    dispatch(createWalletLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/user/wallet`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: CREATE_WALLET,
                payload: res.data.data
            });
            // toast.success("Comment Posted successfully");
        })
        .catch((err) => {
            dispatch({
                type: CREATE_WALLET
            });

            // toast.error(err.response.data.message);
        });
};

export const createWalletLoading = (): Action => {
    return { type: CREATE_WALLET_LOADING };
};

export const getTopUsers: any =
    (filters: any, loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(getTopUsersLoading());
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/user/topUsers`, {
                params: filters
            })
            .then((res) => {
                dispatch({
                    type: GET_TOP_USERS,
                    payload: res.data.data
                });
                // toast.success("Comment Posted successfully");
            })
            .catch((err) => {
                dispatch({
                    type: GET_TOP_USERS
                });

                // toast.error(err.response.data.message);
            });
    };

export const getTopUsersLoading = (): Action => {
    return { type: GET_TOP_USERS_LOADING };
};

export const getRecentlyRegistered: any = (filters: any) => async (dispatch: Dispatch) => {
    dispatch(getRecentlyRegisteredLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/recently-registered`, {
            params: filters
        })
        .then((res) => {
            dispatch({
                type: GET_RECENTLY_REGISTERED_USERS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_RECENTLY_REGISTERED_USERS
            });
        });
};

export const getRecentlyRegisteredLoading = (): Action => {
    return { type: GET_RECENTLY_REGISTERED_USERS_LOADING };
};

export const getAllUsers: any = (filters: any) => async (dispatch: Dispatch) => {
    dispatch(getAllUsersLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/allUsers`, {
            params: filters
        })
        .then((res) => {
            dispatch({
                type: GET_ALL_USERS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_ALL_USERS,
                payload: null
            });
        });
};

export const getAllUsersLoading = (): Action => {
    return { type: GET_ALL_USERS_LOADING };
};

export const getUserById: any =
    (id: string, loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(getUserByIdLoading());

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/user/userById/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                dispatch({
                    type: GET_USER_BY_ID,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_USER_BY_ID,
                    payload: null
                });
            });
    };

export const getUserByIdLoading = (): Action => ({
    type: GET_USER_BY_ID_LOADING
});

export const getUserByUserName: any =
    (address: string, loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(getUserByUserNameLoading());

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/user/userByUserName/${address}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                dispatch({
                    type: GET_USER_BY_ID,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_USER_BY_ID,
                    payload: null
                });
            });
    };

export const getUserByUserNameLoading = (): Action => ({
    type: GET_USER_BY_ID_LOADING
});

export const deletePost: any =
    (id: String, setState: Function, setConfirmed: Function, gotoSocialfeed: Function) =>
    async (dispatch: Dispatch) => {
        dispatch(LoadingDelete());
        // setState();
        const token: any = localStorage.getItem('token');
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/feed/deleteFeed?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                dispatch({
                    type: POST_DELETE,
                    payload: id
                });
                // setConfirmed && setConfirmed(true);
                // dispatch(getFeeds())
                setState();
                gotoSocialfeed && gotoSocialfeed();
                // toast.success("Post deleted successfully");
                // Router.push('/profile')
            })
            .catch((err) => {
                // console.log(err);
                setState();
                toast.error(err?.response?.data?.message);
            });
    };
export const deleteComment: any =
    (id: String, setstate: Function, setConfirmed: Function) => async (dispatch: Dispatch) => {
        dispatch(LoadingDeleteComment());
        // setState();
        const token: any = localStorage.getItem('token');
        axios
            .delete(`${process.env.NEXT_PUBLIC_API_URL}/comment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                setConfirmed && setConfirmed(true);
                setstate();
                dispatch({
                    type: COMMENT_DELETE
                    // payload: res.data.data,
                });
            })
            .catch((err) => {
                // console.log(err);
                toast.error(err?.response?.data?.message);
            });
    };
export const LoadingDeleteComment = (): Action => {
    return { type: COMMENT_DELETE_LOADING };
};
export const LoadingDelete = (): Action => {
    return { type: POST_DELETE_LOADING };
};

export const getLoobrScore: any = (userId: String) => async (dispatch: Dispatch) => {
    dispatch(getLoobrScoreLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/score/${userId}`)
        .then((res) => {
            dispatch({
                type: GET_LOOBR_SCORE,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_LOOBR_SCORE,
                payload: 0
            });
        });
};
export const getLoobrScoreLoading = (): Action => {
    return { type: GET_LOOBR_SCORE_LOADING };
};

export const getUserStats: any =
    (id: string, loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(getUserStatsLoading());

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/user/stats/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                dispatch({
                    type: GET_USER_STATS,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_USER_STATS,
                    payload: null
                });
            });
    };

export const getUserStatsLoading = (): Action => ({
    type: GET_USER_STATS_LOADING
});

export const change2FAStatus: any = (data: object, setState: Function) => async (dispatch: Dispatch, getState: any) => {
    dispatch(change2FAStatusLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/user/change-2fa-status`, data)
        .then(async (res) => {
            const { user } = getState().auth;
            dispatch({
                type: CHANGE_2FA_STATUS
                // payload: res.data.data
            });
            dispatch({
                type: GET_USER,
                payload: { ...user, settings: { ...user.settings, twoFa: !user?.settings?.twoFa } }
            });
            toast.success('2FA status changed.');
            setState(-1);
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message);
            dispatch({
                type: CHANGE_2FA_STATUS
                // payload: null
            });
        });
};

export const change2FAStatusLoading = (): Action => ({
    type: CHANGE_2FA_STATUS_LOADING
});

export const change2FARequest: any = (data: object) => async (dispatch: Dispatch) => {
    // dispatch(change2FARequestLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/user/2fa-enable-request`, data)
        .then(async (res) => {
            // dispatch({
            //     type: CHANGE_2FA_STATUS
            //     // payload: res.data.data
            // });
            toast.success('Check your email address to get the verification code.');
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message);
            // dispatch({
            //     type: CHANGE_2FA_STATUS
            //     // payload: null
            // });
        });
};

export const change2FARequestLoading = (): Action => ({
    type: CHANGE_2FA_STATUS_LOADING
});
