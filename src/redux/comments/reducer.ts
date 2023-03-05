import { GET_COMMENTS, GET_COMMENTS_LOADING } from "./actionTypes";
import { Action } from "../../types";

const initialState = {
    comments: null,
    commentsLoading: false,
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case GET_COMMENTS: {
            return {
                ...state,
                comments: action.payload,
                commentsLoading: false,
            };
        }
        case GET_COMMENTS_LOADING: {
            return { ...state, commentsLoading: true };
        }

        default:
            return state;
    }
};

export default reducer;
