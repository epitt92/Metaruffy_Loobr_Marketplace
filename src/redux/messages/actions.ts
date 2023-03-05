import axios from 'axios';
import { toast } from 'react-toastify';
import { Action, Dispatch } from '../../types';
import {
    CREATE_ROOM,
    SEND_MESSAGE,
    ALL_ROOMS,
    LOADING_MESSAGE,
    CONNECT,
    SEEN_MESSAGE,
    GET_USERS,
    GET_USERS_LOADING,
    REMOVE_USER,
    REMOVE_USER_LOADING,
    CONNECT_ADMIN,
    DELETE_ROOM,
    ADD_USER,
    ADD_USER_LOADING,
    REMOVE_CONNECTION
} from './actionTypes';
import Router from 'next/router';

export const createRoom: any = (data: any) => async (dispatch: Dispatch) => {
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/message/room/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: CREATE_ROOM
            });
            dispatch(getAllRooms(false));
        })
        .catch((err) => {
            dispatch({
                type: CREATE_ROOM
            });
            // console.log(err);
            toast.error(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        });
};
export const sendMessage: any =
    (data: any, setConfirm: Function, setSentMessage: Function) => async (dispatch: Dispatch) => {
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/message/add-message`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                dispatch({
                    type: SEND_MESSAGE
                    // payload: res.data.data,
                });
                // console.log(res.data.data);
                setSentMessage(res.data.data);
                setConfirm(true);

                dispatch(getAllRooms(false));
            })
            .catch((err) => {
                // console.log(err);
                toast.error(err?.response?.data?.message);
                // toast.error(err.response.data.message);
            });
    };
export const getAllRooms: any =
    (loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(Loading());
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/message/rooms`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                dispatch({
                    type: ALL_ROOMS,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                // dispatch({
                //     type: ALL_ROOMS,

                // });
                // console.log(err);
                toast.error(err?.response?.data?.message);
            });
    };
export const seenMessage: any = (data: any) => async (dispatch: Dispatch) => {
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/message/message/seen?roomId=${data.roomId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: SEEN_MESSAGE
                // payload: res.data.data
            });
            dispatch(getAllRooms(false));
        })
        .catch((err) => {
            dispatch({
                type: SEEN_MESSAGE
            });
            // console.log(err);
            toast.error(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        });
};
export const connectRoom: any = (data: any) => async (dispatch: Dispatch) => {
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/message/room/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: CONNECT,
                payload: res.data.data
            });
        })
        .catch((err) => {
            // dispatch({
            //     type: CONNECT,
            // });
            toast.error(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        });
};
export const connectRoomSupport: any = () => async (dispatch: Dispatch) => {
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/message/room/create-admin`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: CONNECT_ADMIN,
                payload: res.data.data
            });
            // if (data?.values) {
            //   dispatch(getAllRooms(data.get("userId"), false));
            // } else {
            //   dispatch(getAllRooms(data.userId, false));
            // }
        })
        .catch((err) => {
            // dispatch({
            //     type: CONNECT,
            // });
            toast.error(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        });
};
export const removeRoom: any = (data: any, setData: Function) => async (dispatch: Dispatch) => {
    dispatch(removeUserLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/message/room/remove`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch(getAllRooms(false));
            res?.data?.data && setData(res?.data?.data);
            // dispatch(getAllRooms(false));
            dispatch({
                type: REMOVE_USER
            });
        })
        .catch((err) => {
            dispatch({
                type: REMOVE_USER
            });
            toast.error(err?.response?.data?.message);
        });
};
export const removeConnection: any = () => async (dispatch: Dispatch) => {
    dispatch({
        type: REMOVE_CONNECTION
    });
};
export const addToRoom: any = (data: any, setData: Function) => async (dispatch: Dispatch) => {
    dispatch(addUserLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/message/room/add`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch(getAllRooms(false));
            res?.data?.data && setData(res?.data?.data);
            // dispatch(getAllRooms(false));
            dispatch({
                type: ADD_USER
            });
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message);
        });
};

export const removeUserLoading = (): Action => {
    return { type: REMOVE_USER_LOADING };
};
export const addUserLoading = (): Action => {
    return { type: ADD_USER_LOADING };
};
export const Loading = (): Action => {
    return { type: LOADING_MESSAGE };
};

export const getUsers: any = (filters: any) => async (dispatch: Dispatch) => {
    dispatch(getUsersLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/message/allUsers`, {
            params: filters
        })
        .then((res) => {
            dispatch({
                type: GET_USERS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_USERS,
                payload: null
            });
        });
};

export const getUsersLoading = (): Action => {
    return { type: GET_USERS_LOADING };
};

export const deleteRoom: any = (data: any, setConfirmed: Function) => async (dispatch: Dispatch) => {
    axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/message/room/${data.roomId}/${data.userId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: DELETE_ROOM,
                payload: res?.data?.data?._id
            });
            // dispatch(getAllRooms(false));
            // console.log('testoing', res.data.data);
            setConfirmed(true);
            if (res.data.data.type == 'PRIVATE') {
                toast.success('Chat deleted sucessfully ');
            } else {
                toast.success('Group deleted sucessfully ');
            }
        })
        .catch((err) => {
            // console.log(err);
            toast.error(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        });
};
export const deleteMessage: any =
    (data: any, setConfirmed: Function, setPopup: Function) => async (dispatch: Dispatch) => {
        axios
            .delete(`${process.env.NEXT_PUBLIC_API_URL}/message/message/${data.messageId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                // dispatch({
                //     type: DELETE_MESSAGE,
                //     payload: res?.data?.data?._id
                // });
                // dispatch(getAllRooms(false));
                // console.log('testoing', res.data.data);
                setConfirmed(false);
                setPopup(true);
            })
            .catch((err) => {
                // console.log(err);
                setConfirmed(false);
                setPopup(true);
                toast.error(err?.response?.data?.message);
                // toast.error(err.response.data.message);
            });
    };
export const editMessage: any = (data: any, setConfirmed: Function) => async (dispatch: Dispatch) => {
    axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/message/message/${data.messageId}`, data)
        .then((res) => {
            // dispatch({
            //     type: DELETE_MESSAGE,
            //     payload: res?.data?.data?._id
            // });
            // dispatch(getAllRooms(false));
            // console.log('testoing', res.data.data);
            setConfirmed(true);
        })
        .catch((err) => {
            // console.log(err);
            toast.error(err?.response?.data?.message);
            // toast.error(err.response.data.message);
        });
};
