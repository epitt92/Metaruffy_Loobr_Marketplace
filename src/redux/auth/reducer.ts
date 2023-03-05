import {
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_LOADING,
    LOGIN,
    LOGIN_LOADING,
    SET_CURRENT_USER,
    SIGN_UP_USER,
    SIGN_UP_USER_LOADING,
    CHANGE_AUTH_STATUS,
    LOGOUT,
    ONLINE_USERS,
    UPDATE,
    UPDATE_LOADING,
    SETUSER,
    RESEND_VERIFICATION_EMAIL,
    RESEND_VERIFICATION_EMAIL_LOADING,
    GET_USER,
    GET_USER_LOADING,
    SET_FOLLOWING,
    AFFILIATE
} from './actionTypes';
import { Action } from '../../types';

const initialState = {
    isAuthenticated: false,
    loginLoading: false,
    signupLoading: false,
    forgotPasswordLoading: false,
    user: null,
    onlineUser: [],
    updateLoading: false,
    resendEmailLoading: false,
    getLoading: false
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case SET_CURRENT_USER: {
            return { ...state, user: action.payload };
        }
        case CHANGE_AUTH_STATUS: {
            return { ...state, isAuthenticated: action.payload };
        }
        case LOGIN: {
            return {
                ...state,
                user: action.payload,
                loginLoading: false
            };
        }
        case AFFILIATE: {
            return {
                ...state,
                user: action.payload
            };
        }
        case LOGIN_LOADING: {
            return { ...state, loginLoading: action.payload };
        }
        case SIGN_UP_USER: {
            return { ...state, signupLoading: false };
        }
        case SIGN_UP_USER_LOADING: {
            return { ...state, signupLoading: true };
        }
        case FORGOT_PASSWORD: {
            return { ...state, forgotPasswordLoading: false };
        }
        case FORGOT_PASSWORD_LOADING: {
            return { ...state, forgotPasswordLoading: true };
        }
        case LOGOUT: {
            return { ...state, isAuthenticated: false, user: null };
        }
        case ONLINE_USERS: {
            return { ...state, onlineUser: action.payload };
        }
        case UPDATE_LOADING: {
            return { ...state, updateLoading: true };
        }
        case UPDATE: {
            return { ...state, updateLoading: false, user: action.payload };
        }
        case SETUSER: {
            return { ...state, user: action.payload };
        }
        case RESEND_VERIFICATION_EMAIL: {
            return { ...state, resendEmailLoading: false };
        }
        case RESEND_VERIFICATION_EMAIL_LOADING: {
            return { ...state, resendEmailLoading: true };
        }
        case GET_USER_LOADING: {
            return { ...state, getLoading: true };
        }
        case GET_USER: {
            return { ...state, getLoading: false, user: action.payload };
        }
        case SET_FOLLOWING: {
            return { ...state, user: { ...state.user, following: action.payload } };
        }
        default:
            return state;
    }
};

export default reducer;
