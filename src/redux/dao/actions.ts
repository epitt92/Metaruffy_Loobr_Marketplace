import axios from 'axios';
import { ethers, Signer } from 'ethers';
import { toast } from 'react-toastify';
import { daoAbi } from '../../contractsData/abis';
import { Action, Dispatch } from '../../types';
import {
    CREATE_PETITION_LOADING,
    GET_ALL_PETITIONS,
    GET_ALL_PETITIONS_LOADING,
    GET_PETITION_BY_ID,
    GET_PETITION_BY_ID_LOADING,
    SUBMIT_VOTE_LOADING
} from './actionTypes';

export const createPetition =
    (signer: Signer, uri: any, setState: Function) => async (dispatch: Dispatch, getState: any) => {
        dispatch(createPetitionLoading(true));

        try {
            // @ts-ignore
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_DAO_ADDRESS, daoAbi, signer);
            const transaction = await contract.submitProposal(uri);
            const tx = await transaction.wait();

            setState(-1);
            dispatch(createPetitionLoading(false));
            // @ts-ignore
            dispatch(getAllPetition());
        } catch (error: any) {
            console.log('Create Petition:', error);
            dispatch(createPetitionLoading(false));
            toast.error(error?.reason || error?.data?.message || error?.message);
        }
    };

export const createPetitionLoading = (payload: boolean): Action => {
    return { type: CREATE_PETITION_LOADING, payload: payload };
};

export const getAllPetition =
    (params: any, loadMore: boolean, setLoadMore: Function) => async (dispatch: Dispatch, getState: any) => {
        dispatch(getAllPetitionLoading());

        try {
            axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/dao/proposals`, { params })
                .then((res) => {
                    const { petitions } = getState().dao;

                    if (loadMore) {
                        dispatch({
                            type: GET_ALL_PETITIONS,
                            payload: {
                                ...petitions,
                                next: res?.data?.data?.next,
                                proposals: [...petitions?.proposals, ...res?.data?.data?.proposals]
                            }
                        });
                        setLoadMore(false);
                    } else
                        dispatch({
                            type: GET_ALL_PETITIONS,
                            payload: res.data.data
                        });
                })
                .catch((err) => {
                    dispatch({
                        type: GET_ALL_PETITIONS,
                        payload: null
                    });
                });
            // // @ts-ignore
            // const contract = new ethers.Contract(process.env.NEXT_PUBLIC_DAO_ADDRESS, daoAbi, signer);
            // const count = await contract.proposalCount();
            // const arr = new Array(Number(count)).fill(null);
            // const petitions = arr.map((item, i) => contract.proposals(i));
            // const results = await Promise.all(petitions);

            // const links: any = [];
            // results.forEach((item, i) => {
            //     // if (item?.details) {
            //     links.push(axios.get(item?.details));
            //     // }
            // });

            // let details: any[] = await Promise.all(links);

            // details = details.map((item: any, i: number) => ({
            //     ...item?.data,
            //     yesVotes: Number(Object.values(results[i])[7]),
            //     noVotes: Number(Object.values(results[i])[8])
            // }));
            // details?.pop();
        } catch (error: any) {
            console.log(error);

            dispatch({
                type: GET_ALL_PETITIONS,
                payload: null
            });
            toast.error(error?.reason || error?.data?.message || error?.message);
        }
    };

export const getAllPetitionLoading = (): Action => ({
    type: GET_ALL_PETITIONS_LOADING
});

export const submitVote =
    (signer: Signer, perposalId: number, uintVote: number, toggle: Function) =>
    async (dispatch: Dispatch, getState: any) => {
        dispatch(submitVoteLoading());

        try {
            // @ts-ignore
            const contract = new ethers.Contract(process.env.NEXT_PUBLIC_DAO_ADDRESS, daoAbi, signer);
            const transaction = await contract.submitVote(perposalId, uintVote);
            toggle && toggle(uintVote);

            // const tx = await transaction.wait();
        } catch (error: any) {
            toast.error(error?.reason || error?.data?.message || error?.message);
            submitVoteLoading();
        }
    };

export const submitVoteLoading = (): Action => ({
    type: SUBMIT_VOTE_LOADING
});

export const getPetitionById = (id: number) => async (dispatch: Dispatch, getState: any) => {
    dispatch(getPetitionByIdLoading());

    try {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/dao/proposals/${id}`)
            .then((res) => {
                dispatch({
                    type: GET_PETITION_BY_ID,
                    payload: res.data.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_PETITION_BY_ID,
                    payload: null
                });
            });
        // // @ts-ignore
        // const contract = new ethers.Contract(process.env.NEXT_PUBLIC_DAO_ADDRESS, daoAbi, signer);
        // const transaction = await contract.proposals(id);
        // if (transaction?.details) {
        //     const details: any = await axios.get(transaction?.details);
        //     const data = {
        //         ...details?.data,
        //         yesVotes: Number(Object.values(transaction)[7]),
        //         noVotes: Number(Object.values(transaction)[8])
        //     };

        //     dispatch({
        //         type: GET_PETITION_BY_ID,
        //         payload: data
        //     });
        // } else {
        //     dispatch({
        //         type: GET_PETITION_BY_ID,
        //         payload: null
        //     });
        // }
    } catch (error: any) {
        console.log(error);

        toast.error(error?.reason || error?.data?.message || error?.message);
    }
};

export const getPetitionByIdLoading = (): Action => ({
    type: GET_PETITION_BY_ID_LOADING
});
