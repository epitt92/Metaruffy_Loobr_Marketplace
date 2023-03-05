import axios from 'axios';
import { toast } from 'react-toastify';
import { Action, Dispatch } from '../../types';
import { GET_USER } from '../auth/actionTypes';
import {
    GET_TOPISLANDOWNERS,
    GET_TOPLANDOWNERS,
    GET_ISLANDS,
    GET_LANDS,
    GET_TOPONEISLANDOWNERS,
    GET_ALL_LISTINGS,
    GET_MY_LANDS,
    GET_ISLAND_OWNERS,
    LOADING
} from './actionTypes';

const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

export const getTopLandowners: any = () => async (dispatch: Dispatch) => {
    let landOnwersRes = await axios.get(`${BACKEND_URL}/api/top/global`);
    dispatch({
        type: GET_TOPLANDOWNERS,
        payload: landOnwersRes.data
    });
};

export const getTopIslandowners: any = () => async (dispatch: Dispatch) => {
    let islandOwnersRes = await axios.get(`${BACKEND_URL}/api/islandOwnersInfo/5`);
    dispatch({
        type: GET_TOPISLANDOWNERS,
        payload: islandOwnersRes.data
    });
};

export const getTopOneIslandowners: any = () => async (dispatch: Dispatch) => {
    let islandOwnersRes = await axios.get(`${BACKEND_URL}/api/islandOwnersInfo/1`);
    dispatch({
        type: GET_TOPONEISLANDOWNERS,
        payload: islandOwnersRes.data
    });
};

export const getLands: any = () => async (dispatch: Dispatch) => {
    let plotsRes = await axios.get(`${BACKEND_URL}/api/nfts`);
    dispatch({
        type: GET_LANDS,
        payload: plotsRes.data
    });
};

export const getIslands: any = () => async (dispatch: Dispatch) => {
    let islandsRes = await axios.get(`${BACKEND_URL}/api/islands`);
    dispatch({
        type: GET_ISLANDS,
        payload: islandsRes.data
    });
};

export const getNftListing: any = () => async (dispatch: Dispatch) => {
    let listings = await axios.get(`${BACKEND_URL}/api/nfts/listings`);
    dispatch({
        type: GET_ALL_LISTINGS,
        payload: listings.data
    });
};

export const getMylands: any = (account: string) => async (dispatch: Dispatch) => {
    let mylands = await axios.get(`${BACKEND_URL}/api/nfts/${account.toUpperCase()}`);
    dispatch({
        type: GET_MY_LANDS,
        payload: mylands.data
    });
};

export const getIslandOwners: any = () => async (dispatch: Dispatch) => {
    let mylands = await axios.get(`${BACKEND_URL}/api/islandOwners`);
    dispatch({
        type: GET_ISLAND_OWNERS,
        payload: mylands.data
    });
};
