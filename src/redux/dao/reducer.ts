import {
    CREATE_PETITION,
    CREATE_PETITION_LOADING,
    GET_ALL_PETITIONS,
    GET_ALL_PETITIONS_LOADING,
    GET_PETITION_BY_ID,
    GET_PETITION_BY_ID_LOADING
} from './actionTypes';
import { Action } from '../../types';

const initialState = {
    petition: null,
    petitionLoading: false,
    petitions: null,
    petitionsLoading: false,
    createPetitionLaoding: false
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case CREATE_PETITION_LOADING: {
            return { ...state, createPetitionLaoding: action.payload };
        }
        case GET_ALL_PETITIONS: {
            return { ...state, petitions: action.payload, petitionsLoading: false };
        }
        case GET_ALL_PETITIONS_LOADING: {
            return { ...state, petitionsLoading: true };
        }
        case GET_PETITION_BY_ID: {
            return { ...state, petition: action.payload, petitionLoading: false };
        }
        case GET_PETITION_BY_ID_LOADING: {
            return { ...state, petitionLoading: true };
        }
        default:
            return state;
    }
};

export default reducer;
