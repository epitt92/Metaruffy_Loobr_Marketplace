import { userService } from "../../services/user.service"
import { GET_ADMIN_DATA, EMPTY_ADMIN_DATA } from "./types"



export const saveAdminDataAction = (payload: any) => {
    // console.log("payloaf:-=-=", payload)
    return {
        type: GET_ADMIN_DATA,
        payload
    }
}

export const clearAdminData = () => {
    return {
        type: EMPTY_ADMIN_DATA,
        payload: {}
    }
}


export const GetAdminData: any = () => async (dispatch: any) => {
    try {
        let res = await userService.getBannerImages()
        dispatch(saveAdminDataAction(res.data.data))
    } catch (error) {
        // console.log(error)
    }
}