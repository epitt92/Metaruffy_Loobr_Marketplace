import { EMPTY_MULTIPLE_NFTS_DRAFTS, SAVE_MULTIPLE_NFTS_DRAFTS } from "./types"



export const draftMultipleNftsAction = (payload: any) => {
    return {
        type: SAVE_MULTIPLE_NFTS_DRAFTS,
        payload
    }
}

export const clearMultipleNftsAction = () => {
    return {
        type: EMPTY_MULTIPLE_NFTS_DRAFTS,
        payload: {}
    }
}