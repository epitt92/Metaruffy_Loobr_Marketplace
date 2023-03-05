import {
    CREATE_ROOM,
    ALL_ROOMS,
    SEND_MESSAGE,
    LOADING_MESSAGE,
    DELETE_ROOM,
    CONNECT,
    SEEN_MESSAGE,
    GET_USERS,
    GET_USERS_LOADING,
    REMOVE_USER_LOADING,
    REMOVE_USER,
    CONNECT_ADMIN,
    ADD_USER_LOADING,
    ADD_USER,
    REMOVE_CONNECTION,
    CLEAR_CHAT
} from './actionTypes';
import { Action } from '../../types';
import { GET_ALL_USERS } from '../user/actionTypes';

const initialState = {
    rooms: null,
    loading: false,
    allusers: null,
    usersLoading: false,
    newRoom: null,
    removeUserLoading: false,
    addUserLoading: false,
    adminRoom: null
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case ALL_ROOMS: {
            return { ...state, rooms: action.payload, loading: false };
        }
        case CREATE_ROOM: {
            return { ...state, loading: false };
        }
        case SEND_MESSAGE: {
            return { ...state, loading: false };
        }
        case LOADING_MESSAGE: {
            return { ...state, loading: true };
        }
        case CONNECT: {
            return { ...state, loading: false, newRoom: action.payload };
        }
        case SEEN_MESSAGE: {
            return { ...state, loading: false };
        }
        case DELETE_ROOM: {
            const arr = action.payload
                ? {
                      newRooms: state.rooms.newRooms.filter((item: any) => item._id !== action.payload),
                      unread: state.rooms.unread
                  }
                : state.rooms;

            return {
                ...state,
                rooms: arr
            };
        }
        case GET_USERS: {
            return { ...state, allusers: action.payload, usersLoading: false };
        }
        case GET_USERS_LOADING: {
            return { ...state, usersLoading: true };
        }
        case REMOVE_USER_LOADING: {
            return { ...state, removeUserLoading: true };
        }
        case REMOVE_USER: {
            return { ...state, removeUserLoading: false };
        }
        case ADD_USER_LOADING: {
            return { ...state, addUserLoading: true };
        }
        case ADD_USER: {
            return { ...state, addUserLoading: false };
        }
        case CONNECT_ADMIN: {
            return { ...state, adminRoom: action.payload };
        }
        case REMOVE_CONNECTION: {
            return { ...state, newRoom: null };
        }
        case CLEAR_CHAT: {
            return { ...state, rooms: null };
        }
        default:
            return state;
    }
};

export default reducer;
