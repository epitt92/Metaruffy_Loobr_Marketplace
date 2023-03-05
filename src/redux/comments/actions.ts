import axios from "axios";
import { Action, Dispatch } from "../../types";
import { GET_COMMENTS, GET_COMMENTS_LOADING } from "./actionTypes";

export const getComments: any =
    (postId: string, loading: boolean) => async (dispatch: Dispatch) => {
        loading !== false && dispatch(getCommentsLoading());
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/comment/post/${postId}`)
            .then((res) => {
                dispatch({
                    type: GET_COMMENTS,
                    payload: res.data.data,
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_COMMENTS,
                    payload: null,
                });
            });
    };

export const getCommentsLoading = () => ({
    type: GET_COMMENTS_LOADING,
});
