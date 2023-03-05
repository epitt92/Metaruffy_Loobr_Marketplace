import { Action } from "../../types";
import { EMPTY_MULTIPLE_NFTS_DRAFTS, SAVE_MULTIPLE_NFTS_DRAFTS } from "./types";


const initialState = {
    nftFiles: '',
    files: '',
    fActiveIndex: 0,
    cActiveIndex: 0
};

const reducer = (state: any = initialState, { payload, type }: Action) => {
    switch (type) {
        case SAVE_MULTIPLE_NFTS_DRAFTS: {
            return {
                ...state,
                nftFiles: payload.nfts,
                files: payload.files,
                fActiveIndex: payload.fActiveIndex,
                cActiveIndex: payload.cActiveIndex,
            };
        }
        case EMPTY_MULTIPLE_NFTS_DRAFTS: {
            return {
                ...state,
                nftFiles: '',
                files: '',
                fActiveIndex: 0,
                cActiveIndex: 0,
            };
        }


        default:
            return state;
    }
}

export default reducer;