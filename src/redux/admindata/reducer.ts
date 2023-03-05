import { Action } from "../../types";
import { GET_ADMIN_DATA, EMPTY_ADMIN_DATA } from "./types";


const initialState = {

};

const reducer = (state: any = initialState, { payload, type }: Action) => {
    switch (type) {
        case GET_ADMIN_DATA: {
            return {
                ...state,
                ...payload
            };
        }
        case EMPTY_ADMIN_DATA: {
            return {};
        }


        default:
            return state;
    }
}

export default reducer;