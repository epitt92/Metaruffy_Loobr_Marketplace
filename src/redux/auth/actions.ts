import axios from 'axios';
import { toast } from 'react-toastify';
import jwt from 'jsonwebtoken';
import { persistor } from '../store';

import { setAuthToken } from '../../utils';

import {
    LOGOUT,
    LOGIN_LOADING,
    LOGIN,
    SIGN_UP_USER,
    SIGN_UP_USER_LOADING,
    SET_CURRENT_USER,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_LOADING,
    CHANGE_AUTH_STATUS,
    ONLINE_USERS,
    UPDATE_LOADING,
    UPDATE,
    SETUSER,
    VERIFY_EMAIL_ADDRESS,
    VERIFY_EMAIL_ADDRESS_LOADING,
    RESEND_VERIFICATION_EMAIL,
    RESEND_VERIFICATION_EMAIL_LOADING,
    GET_USER,
    GET_USER_LOADING,
    AFFILIATE
} from './actionTypes';

import { Action, Dispatch } from '../../types';

// SIGN UP USER
export const registerUser: any = (data: Object, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(registerLoading());

    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: SIGN_UP_USER
            });
            setState(1);

            toast.success(res.data.message);
        })
        .catch((err) => {
            dispatch({
                type: SIGN_UP_USER
            });
            toast.error(err.response.data.message);
        });
};

export const registerLoading = (): Action => {
    return { type: SIGN_UP_USER_LOADING };
};

// LOGIN USER
export const loginUser: any = (data: Object, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(loginLoading(true));
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
        .then((res) => {
            localStorage.setItem('token', res.data.data.access_token);
            setAuthToken(res.data.data.access_token);
            console.log(res.data);

            if (res?.data?.data?.twoFa) {
                dispatch(loginLoading(false));
                setState(59);
                return;
            }
            dispatch({
                type: LOGIN,
                payload: res.data.data.user
            });
            dispatch({
                type: CHANGE_AUTH_STATUS,
                payload: true
            });

            setState();
            toast.success('Login successful');
        })
        .catch((err) => {
            dispatch({
                type: LOGIN,
                payload: null
            });
            if (err?.response?.data?.message === 'Your email is not verified. Kindly verify it before login.') {
                setState(36);
            } else toast.error(err?.response?.data?.message);
        });
};

//affiliate
export const affiliateUser: any = (setConfirmed: Function) => async (dispatch: Dispatch) => {
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/referral/create`)
        .then((res) => {
            localStorage.setItem('token', res.data.data.access_token);
            setAuthToken(res.data.data.access_token);

            dispatch({
                type: AFFILIATE,
                payload: res.data.data.user
            });
            setConfirmed && setConfirmed(true);
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message);
        });
};

export const twoFALogin: any = (data: object, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(loginLoading(true));
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify/2fa`, data)
        .then(async (res) => {
            localStorage.setItem('token', res.data.data.access_token);
            setAuthToken(res.data.data.access_token);
            dispatch({
                type: LOGIN,
                payload: res.data.data.user
            });
            dispatch({
                type: CHANGE_AUTH_STATUS,
                payload: true
            });

            setState();
            toast.success('Login successful');
        })
        .catch((err) => {
            dispatch(loginLoading(false));
            if (err?.response?.data?.message === 'Unauthorized') {
                setState(1);
            }
            toast.error(err?.response?.data?.message);
        });
};

export const loginLoading = (payload: boolean): Action => {
    return { type: LOGIN_LOADING, payload };
};

// Forgot Password actions
export const handleForgotPassword: any = (data: Object, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(forgotPasswordLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/sendPasswordResetEmail`, data)
        .then((res) => {
            setState(3);
            dispatch({
                type: FORGOT_PASSWORD
            });
            // toast.success("Login successfully");
        })
        .catch((err) => {
            dispatch({
                type: FORGOT_PASSWORD
            });
            toast.error(err.response.data.message);
        });
};

export const forgotPasswordLoading = (): Action => {
    return { type: FORGOT_PASSWORD_LOADING };
};

// Forgot Password actions
export const handleResetPassword: any = (data: Object, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(handleResetPasswordLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetPassword`, data)
        .then((res) => {
            setState(5);
            dispatch({
                type: FORGOT_PASSWORD
            });
            // toast.success("Login successfully");
        })
        .catch((err) => {
            dispatch({
                type: FORGOT_PASSWORD
            });
            toast.error(err.response.data.message);
        });
};

export const handleResetPasswordLoading = (): Action => {
    return { type: FORGOT_PASSWORD_LOADING };
};

export const loginByGoogle: any = (data: Object, setState: Function) => (dispatch: Dispatch) => {
    dispatch(loginLoading(true));
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, data)
        .then((res) => {
            localStorage.setItem('token', res.data.data.access_token);

            // const decode = jwt.decode(res.data.data.access_token);
            setAuthToken(res.data.data.access_token);

            dispatch({
                type: LOGIN,
                payload: res.data.data.user
            });
            dispatch({
                type: CHANGE_AUTH_STATUS,
                payload: true
            });

            setState();
            toast.success('Login successful');
        })
        .catch((err) => {
            if (err?.response?.status == 403) {
                toast.error('User is blocked please contact admin.');
            } else {
                toast.error('Internal server Error');
            }
        });
    dispatch({ type: LOGIN });
};

export const onlineUsersAction: any = (data: Object) => (dispatch: Dispatch) => {
    dispatch({
        type: ONLINE_USERS,
        payload: data
    });
};

export const loginLoadingLoading = (): Action => {
    return { type: LOGIN_LOADING };
};
export const lodingUpdate = (): Action => {
    return { type: UPDATE_LOADING };
};

export const logout: any = () => async (dispatch: Dispatch) => {
    try {
        localStorage.clear();
        delete axios.defaults.headers.common['Authorization'];
        // await persistor.purge();
        // await persistor.flush();
        // await persistor.pause();
        dispatch({ type: LOGOUT });
    } catch (error) {
        // console.log(error);
    }
};
export const updateUser: any = (data: Object, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(lodingUpdate());

    axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/auth`, data)
        .then((res) => {
            setState && setState();
            dispatch({
                type: UPDATE,
                payload: res.data.data.user
            });

            dispatch(getUser(false));
            toast.success('Updated successfully');
        })
        .catch((err) => {
            toast.error(err.response.data.message);
        });
};
export const setUser: any = (data: Object) => async (dispatch: Dispatch) => {
    dispatch({
        type: SETUSER,
        payload: data
    });
};

export const verfyEmailAddress: any = (userId: String, token: string) => (dispatch: Dispatch) => {
    dispatch(verfyEmailAddressLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyEmail/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            const decode: any = jwt.decode(token);
            setAuthToken(token);
            const data = { ...decode, isEmailVerified: true };
            dispatch({
                type: LOGIN,
                payload: data
            });
            dispatch({
                type: CHANGE_AUTH_STATUS,
                payload: true
            });
            toast.success('Email successfully verified');
            // dispatch({
            //     type: VERIFY_EMAIL_ADDRESS,
            //     payload: null,
            // });
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            // dispatch({
            //     type: VERIFY_EMAIL_ADDRESS,
            //     payload: null,
            // });
        });
};

export const verfyEmailAddressLoading: any = (data: Object) => (dispatch: Dispatch) => ({
    type: VERIFY_EMAIL_ADDRESS_LOADING
});

export const resendVerificationEmail: any = (data: any, setState: Function) => (dispatch: Dispatch) => {
    dispatch(resendVerificationEmailLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/resendVerificationEmail`, data)
        .then((res) => {
            dispatch({
                type: RESEND_VERIFICATION_EMAIL,
                payload: null
            });
            setState();
            toast.success(res.data.message);
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            dispatch({
                type: RESEND_VERIFICATION_EMAIL,
                payload: null
            });
        });
};

export const resendVerificationEmailLoading: any = (data: Object) => (dispatch: Dispatch) => ({
    type: RESEND_VERIFICATION_EMAIL_LOADING
});

export const getUser: any =
    (loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(lodingGetUser());
        const token: any = localStorage.getItem('token');
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/user/get/getuser`, config)
            .then((res) => {
                dispatch({
                    type: GET_USER,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                if (err?.response?.data?.statusCode === 401) {
                    dispatch(logout());
                }
                // dispatch({
                //     type: GET_USER,
                // });
                // toast.error(err.response.data.message);
            });
    };
export const lodingGetUser = (): Action => {
    return { type: GET_USER_LOADING };
};

export const hideWallet: any = (walletId: string) => async (dispatch: Dispatch) => {
    // dispatch(hideWalletLoading());
    axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/user/hide-wallet/${walletId}`)
        .then((res) => {
            // dispatch({
            //   type: GET_USER,
            //   payload: res.data.data,
            // });
        })
        .catch((err) => {
            // dispatch({
            //     type: GET_USER,
            // });
        });
};

// export const hideWalletLoading = (): Action => {
//   return { type: HIDE_USER_WALLET_LOADING };
// };
