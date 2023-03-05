import axios from 'axios';
import { toast } from 'react-toastify';
import { Action, Dispatch } from '../../types';
import {
    CREATE_NFT,
    CREATE_NFT_LOADING,
    GET_MARKETE_PLACE,
    GET_MARKETE_PLACE_LOADING,
    LIST_NFT_ON_MARKETE,
    LIST_NFT_ON_MARKETE_LOADING,
    TOP_NFTS,
    LOADING,
    GET_NFT_BY_ID,
    GET_NFT_BY_ID_LOADING,
    UPDATE_NFT_BY_ID,
    UPDATE_NFT_BY_ID_LOADING,
    GET_LISTINGS,
    GET_LISTINGS_LOADING,
    PLACE_BID_LOADING,
    BUY_NFT_LOADING,
    GET_ACTIVE_BIDDINGS,
    GET_ACTIVE_BIDDINGS_LOADING,
    CLAIM_NFT_LOADING,
    UNLIST_NFT_LOADING,
    GET_LISTING_BY_LISTING_ID,
    GET_LISTING_BY_LISTING_ID_LOADING,
    GET_NFT_BY_TOKEN_ID,
    GET_NFT_BY_TOKEN_ID_LOADING,
    GET_BIDS_BY_LISTING_ID,
    GET_BIDS_BY_LISTING_ID_LOADING,
    GET_OWNER_BY_WALLET_ADDRESS,
    GET_OWNER_BY_WALLET_ADDRESS_LOADING,
    GET_AUCTION_NFT,
    GET_AUCTION_NFT_LOADING,
    GET_TOP_NFT,
    GET_TOP_NFT_LOADING,
    CREATE_REPORT,
    CREATE_REPORT_LOADING,
    GET_LISTINGS_LOCAL,
    GET_LISTINGS_LOADING_LOCAL,
    GET_USDT_USD_PRICE,
    GET_USDT_USD_PRICE_LOADING,
    GET_NFT_HISTORY,
    GET_NFT_HISTORY_LOADING,
    GET_NFT_CREATOR,
    GET_NFT_CREATOR_LOADING,
    GET_ROYALTY_INFO,
    GET_ROYALTY_INFO_LOADING,
    SET_ROYALTIES,
    SET_ROYALTIES_LOADING,
    INSERT_BID,
    GET_LOOBR_USD_PRICE,
    GET_LOOBR_USD_PRICE_LOADING,
    GET_BNB_PRICE,
    GET_BNB_PRICE_LOADING,
    SEND_GIFT,
    SEND_GIFT_LOADING,
    GET_ETH_PRICE,
    GET_ETH_PRICE_LOADING,
    GET_CURRENCY_RATE,
    GET_CURRENCY_RATE_LOADING,
    GET_MATIC_PRICE,
    GET_MATIC_PRICE_LOADING,
    GET_AVAX_PRICE,
    GET_AVAX_PRICE_LOADING
} from './actionTypes';
import Router from 'next/router';
import { ethers, Signer } from 'ethers';
import marketeNFTJson from '../../contractsData/Marketplace.json';
import ethMarketJSON from '../../contractsData/ETHMarketplace.json';
// import marketeAddress from "../../contractsData/Marketplace-address.json";
// import NftAddress from "../../contractsData/NFT-address.json";
import NFT from '../../contractsData/NFT.json';
// import TokenAddress from "../../contractsData/Token-address.json";
import Token from '../../contractsData/Token.json';
import { NFT_TYPES } from '../../constants/enums';
import { GET_NFT } from '../user/actionTypes';
// import { NFTContract } from "../../core";
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

export const createNftHandler = (data: Object) => async (dispatch: Dispatch) => {
    dispatch(createNftLoading(true));

    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/nft/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: CREATE_NFT
            });

            toast.success('NFT created successfully');
            Router.push('/profile');
        })
        .catch((err) => {
            dispatch({
                type: CREATE_NFT
            });

            toast.error(err.response.data.message);
        });
};

export const createNftLoading = (payload: boolean): Action => {
    return { type: CREATE_NFT_LOADING, payload: payload };
};

export const listNftOnMarketePlace: any =
    (signer: Signer, setstate: Function, data: any) => async (dispatch: Dispatch) => {
        dispatch(listNftOnMarketePlaceLoading(true));
        try {
            console.log(data, 'data');

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/token`, data);

            // const price = ethers.utils.parseUnits(nftPrice, "ether");
            /* then list the item for sale on the marketplace */
            const contract = new ethers.Contract(data?.marketAddress, marketeNFTJson.abi, signer);
            const nft = new ethers.Contract(data?.contractAddress, NFT.abi, signer);
            if (data?.contractType == '1155') {
                const approve = await nft.setApprovalForAll(data?.marketAddress, true);
                // console.log(approve);

                const test = await approve.wait();
                // console.log(test, 'test');

                // const isApproved = await nft.isApprovedForAll(data?.owner, data?.marketAddress);
                // if (!isApproved) {
                //     const approve = await nft.setApprovalForAll(data?.marketAddress, true);
                //     approve.wait();
                // }
            } else {
                const approved = await nft.getApproved(data.tokenId);
                const isApproved = approved == data?.marketAddress;
                if (!isApproved) {
                    const approve = await nft.approve(data?.marketAddress, data.tokenId);
                    await approve.wait();
                }
            }

            const listingPrice = ethers.utils.parseUnits(
                data.price.toString(),
                (data?.currency === 'USDT' && data?.chain == 'ETH') ||
                    (data?.currency === 'USDT' && data?.chain == 'AVAX') ||
                    (data?.currency === 'USDT' && data?.chain == 'MATIC')
                    ? 'mwei'
                    : 'ether'
            );

            const transaction = await contract.addListing(
                data?.contractAddress,
                data.tokenId,
                1,
                data.type === NFT_TYPES.fixedPrice ? 0 : 1, //sell mode 0 for fixed and 1 for auction
                listingPrice,
                data.startTime,
                data.duration
            );
            let tx = await transaction.wait();
            // console.log("here is the transction", tx);
            // const listingId = tx.events[2].args[0];

            setstate(25);
            // dispatch(removeMarketeListing(data.tokenId));
            dispatch(removeToken(data.tokenId));
            dispatch(listNftOnMarketePlaceLoading(false));
        } catch (error: any) {
            console.log('error while creating sale: ', error);
            toast.error(error?.reason || error?.data?.message || error?.message);
            dispatch(listNftOnMarketePlaceLoading(false));
        }
    };

export const listNftOnMarketePlaceLoading = (payload: boolean): Action => {
    return { type: LIST_NFT_ON_MARKETE_LOADING, payload: payload };
};

export const setRoyalties: any =
    (
        signer: Signer,
        tokenId: number,
        receiver: string,
        royalty: number,
        setApplied: Function,
        contractAddress: string
    ) =>
    async (dispatch: Dispatch) => {
        dispatch(setRoyaltiesLoading(true));
        try {
            const contract = new ethers.Contract(contractAddress, NFT.abi, signer);

            const transaction = await contract.setRoyalty(tokenId, receiver, royalty);
            let tx = await transaction.wait();
            setApplied(true);
            // console.log(tx, transaction);

            // dispatch({
            //     type: SET_ROYALTIES,
            //     payload: tx,
            // });
            dispatch(setRoyaltiesLoading(false));
        } catch (error: any) {
            toast.error(error?.reason || error?.data?.message || error?.message);
            dispatch(setRoyaltiesLoading(false));
        }
    };

export const setRoyaltiesLoading = (payload: boolean): Action => {
    return { type: SET_ROYALTIES_LOADING, payload };
};

export const removeToken: any = (tokenId: string) => async (dispatch: Dispatch, getState: Function) => {
    const { AllNFT } = getState().user;
    const tokens = AllNFT && AllNFT?.tokens.filter((item: any) => item.tokenId !== tokenId);

    dispatch({
        type: GET_NFT,
        payload: { ...AllNFT, tokens: tokens }
    });
};
export const removeMarketeListing: any = (tokenId: string) => async (dispatch: Dispatch, getState: Function) => {
    const { AllNFT } = getState().user;
    const remainingListings = AllNFT && AllNFT.filter((item: any) => item.tokenId !== tokenId);

    dispatch({
        type: GET_NFT,
        payload: remainingListings
    });
};

export const removeListing: any = (listingId: string) => async (dispatch: Dispatch, getState: Function) => {
    const { listings } = getState().nft;
    const remainingListings = listings && listings.filter((item: any) => item.listingId !== listingId);
    dispatch({
        type: GET_LISTINGS,
        payload: remainingListings
    });
};

export const removeFromMarkete: any = (listingId: string) => async (dispatch: Dispatch, getState: Function) => {
    const { marketplace } = getState().nft;
    const listings = { ...marketplace };
    const remainingListings = marketplace && marketplace?.listings?.filter((item: any) => item.listingId !== listingId);

    listings.listings = remainingListings;
    dispatch({
        type: GET_MARKETE_PLACE,
        payload: listings
    });
};

export const buyNFT =
    (
        signer: Signer | any,
        listingId: Number,
        price: string,
        setTxHash: any,
        setState: any,
        play: Function,
        owner: String,
        marketAddress: string,
        tokenAddress: string,
        native: Boolean
    ) =>
    async (dispatch: Dispatch, getState: any) => {
        dispatch(buyNFTLoading(true));

        try {
            const { user } = getState().auth;
            const priceWithFee = ((2.1 / 100) * Number(price) + Number(price)).toFixed(9);

            if (native) {
                const contract = new ethers.Contract(marketAddress, ethMarketJSON.abi, signer);
                const nftPrice = ethers.utils.parseUnits(priceWithFee.toString(), 'ether');
                const transaction = await contract.buyNow(listingId, { value: nftPrice });
                const tx = await transaction.wait();

                dispatch(buyNFTLoading(false));
                dispatch(removeFromMarkete(listingId));
                setTxHash(tx.transactionHash);
                setState(15);
                user?.settings?.alerts?.buy && play();
                return;
            }
            const token = new ethers.Contract(tokenAddress, Token.abi, signer);
            const approvedAmmount = await token.allowance(owner, marketAddress);
            const allowance = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
            if (approvedAmmount.toString() !== allowance) {
                const apr = await token.approve(marketAddress /* spender */, allowance);
                await apr.wait();
            }
            const contract = new ethers.Contract(marketAddress, marketeNFTJson.abi, signer);
            const buyPrice = ethers.utils.parseUnits(priceWithFee.toString(), 'ether');
            const transaction = await contract.buyNow(listingId);
            const tx = await transaction.wait();

            dispatch(buyNFTLoading(false));
            dispatch(removeFromMarkete(listingId));
            setTxHash(tx.transactionHash);
            setState(15);
            user?.settings?.alerts?.buy && play();
        } catch (error: any) {
            toast.error(error?.reason || error?.data?.message || error?.message);
            dispatch(buyNFTLoading(false));
            setState();
        }
    };

export const buyNFTLoading = (payload: boolean): Action => {
    return { type: BUY_NFT_LOADING, payload: payload };
};

export const unlistNft: any =
    (signer, listingId: number, setState: any, setHash: any, owner: string) => async (dispatch: Dispatch) => {
        try {
            dispatch(unlistNftLoading(true));
            /* then list the item for sale on the marketplace */
            const contract = new ethers.Contract(owner, marketeNFTJson.abi, signer);
            const transaction = await contract.removeListing(listingId);

            let tx = await transaction.wait();
            let hash = tx.transactionHash;

            dispatch(removeListing(listingId));
            dispatch(removeFromMarkete(listingId));
            dispatch(unlistNftLoading(false));
            setHash(hash);
            setState();
        } catch (error: any) {
            toast.error(error?.reason || error?.data?.message || error?.message);
            setHash('');
            setState();
            dispatch(unlistNftLoading(false));
        }
    };

export const unlistNftLoading = (payload: boolean): Action => {
    return { type: UNLIST_NFT_LOADING, payload: payload };
};

export const claimNft: any =
    (
        signer: any,
        biddingId: Number,
        price: number,
        owner: string,
        marketAddress: string,
        tokenAddress: string,
        native: Boolean
    ) =>
    async (dispatch: Dispatch, getState: Function) => {
        dispatch(claimNftLoading(true));
        try {
            const fee = (2.1 / 100) * Number(price);
            const claimAmount = ethers.utils.parseUnits(fee.toFixed(4));

            if (native || native == undefined) {
                const contract = new ethers.Contract(marketAddress, ethMarketJSON.abi, signer);
                const transaction = await contract.claimNft(biddingId, { value: claimAmount });
                let tx = await transaction.wait();
            } else {
                const token = new ethers.Contract(tokenAddress, Token.abi, signer);
                const approvedAmmount = await token.allowance(owner, marketAddress);
                const allowance = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
                if (approvedAmmount.toString() !== allowance) {
                    const apr = await token.approve(marketAddress /* spender */, allowance);
                    await apr.wait();
                }
                const contract = new ethers.Contract(marketAddress, marketeNFTJson.abi, signer);
                const transaction = await contract.claimNft(biddingId);
                let tx = await transaction.wait();
            }

            const { activeBiddings } = getState().nft;
            const remainingClaimItems =
                activeBiddings && activeBiddings.filter((item: any) => item.biddingId !== biddingId);
            dispatch({
                type: GET_ACTIVE_BIDDINGS,
                payload: remainingClaimItems
            });

            dispatch(claimNftLoading(false));
        } catch (error: any) {
            console.log('error while creating sale: ', error);
            toast.error(error?.reason || error?.data?.message || error?.message);
            dispatch(claimNftLoading(false));
        }
    };

export const claimNftLoading = (payload: boolean): Action => {
    return { type: CLAIM_NFT_LOADING, payload: payload };
};

export const placeBid =
    (
        signer: Signer,
        listingId: Number,
        price: String,
        bidder: String,
        setHash: Function,
        setState: Function,
        marketAddress: string,
        tokenAddress: string,
        native: Boolean
    ): ThunkAction<void, any, unknown, AnyAction> =>
    async (dispatch: Dispatch, getState: any) => {
        dispatch(placeBidLoading(true));
        try {
            // const price = ethers.utils.parseUnits(nftPrice, "ether");
            /* then list the item for sale on the marketplace */
            const bidPrice = ethers.utils.parseEther(price.toString());

            if (native) {
                const contract = new ethers.Contract(marketAddress, ethMarketJSON.abi, signer);
                // const nftPrice = ethers.utils.parseUnits(priceWithFee.toString(), 'ether');
                const transaction = await contract.placeBid(listingId, { value: bidPrice });
                let tx = await transaction.wait();
                const { user } = getState().auth;
                dispatch(insertBid(user, listingId, Number(price)));
                dispatch(placeBidLoading(false));
                setHash(Number(price).toLocaleString());
                setState(18);
                return;
            }
            const token = new ethers.Contract(tokenAddress, Token.abi, signer);
            const approvedAmmount = await token.allowance(bidder, marketAddress);
            const allowance = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
            if (approvedAmmount.toString() !== allowance) {
                const apr = await token.approve(process.env.NEXT_PUBLIC_MARKET_ADDRESS /* spender */, allowance);
                await apr.wait();
            }
            const contract = new ethers.Contract(marketAddress, marketeNFTJson.abi, signer);
            const transaction = await contract.placeBid(listingId, bidPrice);
            let tx = await transaction.wait();
            const { user } = getState().auth;
            dispatch(insertBid(user, listingId, Number(price)));
            dispatch(placeBidLoading(false));
            setHash(Number(price).toLocaleString());
            setState(18);
        } catch (error: any) {
            toast.error(error?.reason || error?.data?.message || error?.message);

            setHash('');
            setState();
            dispatch(placeBidLoading(false));
        }
    };

export const placeBidLoading = (payload: boolean): Action => {
    return { type: PLACE_BID_LOADING, payload: payload };
};

export const insertBid: any = (bidder: string, listingId: string, price: string): Action => {
    const payload = [
        {
            bidder: bidder,
            contract: 'listing',
            contractAddress: '0x9908b3dBe04BbEd073B0Ee022a82146FE870939e',
            isActive: true,
            listingId: listingId,
            price: price
        }
    ];
    return { type: INSERT_BID, payload: payload };
};

export const getTopNfts = (data: Object) => async (dispatch: Dispatch) => {
    dispatch(loading());

    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/nft/topNfts`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch({
                type: TOP_NFTS
            });
        })
        .catch((err) => {
            dispatch({
                type: TOP_NFTS
            });

            toast.error(err.response.data.message);
        });
};
export const loading = (): Action => {
    return { type: LOADING };
};

export const getMarketPlace: any =
    (filters: Object, loadMore: Boolean, setLoadMore: Function) => async (dispatch: Dispatch, getState: Function) => {
        dispatch(getMarketPlaceLoading());
        const { marketplace } = getState().nft;

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/live`, {
                params: filters
            })
            .then(async (res) => {
                if (loadMore) {
                    const listings = { ...marketplace };
                    listings.listings = [...marketplace?.listings, ...res.data.data.listings];
                    dispatch({
                        type: GET_MARKETE_PLACE,
                        payload: listings
                    });
                    setLoadMore(false);
                } else {
                    dispatch({
                        type: GET_MARKETE_PLACE,
                        payload: res.data.data
                    });
                }
            })
            .catch((err) => {
                dispatch({
                    type: GET_MARKETE_PLACE,
                    payload: null
                });
            });
    };

export const getMarketPlaceLoading = (): Action => {
    return { type: GET_MARKETE_PLACE_LOADING };
};

export const getBidsBylistingId: any = (listingId: string) => async (dispatch: Dispatch) => {
    dispatch(getBidsBylistingIdLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/bids/${listingId}`)
        .then(async (res) => {
            dispatch({
                type: GET_BIDS_BY_LISTING_ID,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_BIDS_BY_LISTING_ID,
                payload: null
            });
        });
};

export const getBidsBylistingIdLoading = (): Action => {
    return { type: GET_BIDS_BY_LISTING_ID_LOADING };
};

export const getNftById = (address: string) => async (dispatch: Dispatch) => {
    dispatch(getNftByIdLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL2}/nfts/${address}`)
        .then((res) => {
            dispatch({
                type: GET_NFT_BY_ID,
                payload: res.data.nfts
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT_BY_ID,
                payload: null
            });
        });
};

export const getNftByIdLoading = (): Action => {
    return { type: GET_NFT_BY_ID_LOADING };
};

export const getNftByTokenId: any = (tokenId: string, filters: any) => async (dispatch: Dispatch) => {
    dispatch(getNftByTokenIdLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/nft/${tokenId}`, { params: filters })
        .then((res) => {
            dispatch({
                type: GET_NFT_BY_TOKEN_ID,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT_BY_TOKEN_ID,
                payload: null
            });
        });
};

export const getNftByTokenIdLoading = (): Action => {
    return { type: GET_NFT_BY_TOKEN_ID_LOADING };
};

export const updateNftById = (id: string, data: any) => async (dispatch: Dispatch) => {
    dispatch(updateNftByIdLoading());

    axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/nft/${id}`, data)
        .then((res) => {
            dispatch({
                type: UPDATE_NFT_BY_ID,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: UPDATE_NFT_BY_ID,
                payload: null
            });
        });
};

export const updateNftByIdLoading = (): Action => {
    return { type: UPDATE_NFT_BY_ID_LOADING };
};

export const getNftListing: any = (filters: Object) => async (dispatch: Dispatch) => {
    dispatch(getNftListingLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/User`, {
            params: filters
        })
        .then(async (res) => {
            dispatch({
                type: GET_LISTINGS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_LISTINGS,
                payload: null
            });

            // toast.error(err.response.data.message);
        });
};

export const getListingsByUserId: any = (filters: Object, userId: string) => async (dispatch: Dispatch) => {
    dispatch(getNftListingLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/user/${userId}`, {
            params: filters
        })
        .then(async (res) => {
            dispatch({
                type: GET_LISTINGS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_LISTINGS,
                payload: null
            });

            // toast.error(err.response.data.message);
        });
};

export const getNftListingLoading = (): Action => ({
    type: GET_LISTINGS_LOADING
});

export const getListingByListingId: any =
    (listingId: string, loading: boolean = true) =>
    async (dispatch: Dispatch) => {
        loading && dispatch(getListingByListingIdLoading());

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/${listingId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                dispatch({
                    type: GET_LISTING_BY_LISTING_ID,
                    payload: res.data.listing
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_LISTING_BY_LISTING_ID,
                    payload: null
                });

                // toast.error(err.response.data.message);
            });
    };

export const getListingByListingIdLoading = (): Action => ({
    type: GET_LISTING_BY_LISTING_ID_LOADING
});

export const getActiveBiddings: any = (address: string) => async (dispatch: Dispatch) => {
    dispatch(getActiveBiddingsLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/bidding/${address}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            dispatch({
                type: GET_ACTIVE_BIDDINGS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_ACTIVE_BIDDINGS,
                payload: null
            });

            // toast.error(err.response.data.message);
        });
};

export const getActiveBiddingsLoading = (): Action => ({
    type: GET_ACTIVE_BIDDINGS_LOADING
});

export const getUserByWalletAddress: any = (address: string) => async (dispatch: Dispatch) => {
    dispatch(getUserByWalletAddressLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/${address}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            // console.log(res.data, 'owner a', address);

            dispatch({
                type: GET_OWNER_BY_WALLET_ADDRESS,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_OWNER_BY_WALLET_ADDRESS,
                payload: null
            });
        });
};

export const getUserByWalletAddressLoading = (): Action => ({
    type: GET_OWNER_BY_WALLET_ADDRESS_LOADING
});

export const getNftCreator: any = (address: string) => async (dispatch: Dispatch) => {
    dispatch(getNftCreatorLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/${address}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            // console.log(res.data, 'owner a');
            dispatch({
                type: GET_NFT_CREATOR,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT_CREATOR,
                payload: null
            });
        });
};

export const getNftCreatorLoading = (): Action => ({
    type: GET_NFT_CREATOR_LOADING
});

export const getAuctionNft: any = (params: any) => async (dispatch: Dispatch) => {
    dispatch(getAuctionNftLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/live`, {
            params: params
        })
        .then(async (res) => {
            dispatch({
                type: GET_AUCTION_NFT,
                payload: res.data.data.listings
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_AUCTION_NFT,
                payload: null
            });
        });
};

export const getAuctionNftLoading = (): Action => ({
    type: GET_AUCTION_NFT_LOADING
});

export const getTopNft: any = (params: any) => async (dispatch: Dispatch) => {
    dispatch(getTopNftLoading());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/live`, {
            params: params
        })
        .then(async (res) => {
            dispatch({
                type: GET_TOP_NFT,
                payload: res.data.data.listings
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_TOP_NFT,
                payload: null
            });
        });
};

export const getTopNftLoading = (): Action => ({
    type: GET_TOP_NFT_LOADING
});

export const reportNft: any = (data: any, setState: Function) => async (dispatch: Dispatch) => {
    dispatch(reportNftLoading());
    axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/report/create`, data)
        .then(async (res) => {
            dispatch({
                type: CREATE_REPORT,
                payload: res.data.data
            });
            setState();
        })
        .catch((err) => {
            toast.error(err.response.data.message);
            dispatch({
                type: CREATE_REPORT,
                payload: null
            });
        });
};

export const reportNftLoading = (): Action => ({
    type: CREATE_REPORT_LOADING
});

export const getNftListingLocal: any = (params: string) => async (dispatch: Dispatch) => {
    dispatch(getNftListingLoadingLocal());

    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/User`, {
            params: params,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (res) => {
            dispatch({
                type: GET_LISTINGS_LOCAL,
                payload: res.data.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_LISTINGS_LOCAL,
                payload: null
            });

            // toast.error(err.response.data.message);
        });
};

export const getNftListingLoadingLocal = (): Action => ({
    type: GET_LISTINGS_LOADING_LOCAL
});

export const getLoobrPrice: any = () => async (dispatch: Dispatch) => {
    dispatch(getLoobrPriceLoading());
    axios
        .get(
            `https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/0x2d537cc7a9aA092ca3dD1Ee542c0B73560cB14f0`
        )
        .then(async (res) => {
            dispatch({
                type: GET_LOOBR_USD_PRICE,
                payload: res.data?.market_data?.current_price.usd
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_LOOBR_USD_PRICE,
                payload: 0
            });
        });
};

export const getLoobrPriceLoading = (): Action => ({
    type: GET_LOOBR_USD_PRICE_LOADING
});

export const getUSDTPrice: any = () => async (dispatch: Dispatch) => {
    dispatch(getUSDTPriceLoading());
    axios
        .get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/0xdAC17F958D2ee523a2206206994597C13D831ec7`)
        .then(async (res) => {
            dispatch({
                type: GET_USDT_USD_PRICE,
                payload: res.data?.market_data?.current_price.usd
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_USDT_USD_PRICE,
                payload: null
            });
        });
};

export const getUSDTPriceLoading = (): Action => ({
    type: GET_USDT_USD_PRICE_LOADING
});

export const getBNBPrice: any = () => async (dispatch: Dispatch) => {
    dispatch(getBNBPriceLoading());
    axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD`)
        .then(async (res) => {
            dispatch({
                type: GET_BNB_PRICE,
                payload: res.data?.USD
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_BNB_PRICE,
                payload: 0
            });
        });
};

export const getBNBPriceLoading = (): Action => ({
    type: GET_BNB_PRICE_LOADING
});

export const getETHPrice: any = () => async (dispatch: Dispatch) => {
    dispatch(getETHPriceLoading());
    axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`)
        .then(async (res) => {
            dispatch({
                type: GET_ETH_PRICE,
                payload: res.data?.USD
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_ETH_PRICE,
                payload: 0
            });
        });
};

export const getETHPriceLoading = (): Action => ({
    type: GET_ETH_PRICE_LOADING
});

export const getAvaxPrice: any = () => async (dispatch: Dispatch) => {
    dispatch(getAvaxPriceLoading());
    axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=AVAX&tsyms=USD`)
        .then(async (res) => {
            dispatch({
                type: GET_AVAX_PRICE,
                payload: res.data?.USD
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_AVAX_PRICE,
                payload: 0
            });
        });
};

export const getAvaxPriceLoading = (): Action => ({
    type: GET_AVAX_PRICE_LOADING
});

export const getCurrencyRate: any = (symbol: string) => async (dispatch: Dispatch) => {
    dispatch(getCurrencyRateLoading());
    axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`)
        .then(async (res) => {
            dispatch({
                type: GET_CURRENCY_RATE,
                payload: res.data?.USD
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_CURRENCY_RATE,
                payload: 0
            });
        });
};

export const getCurrencyRateLoading = (): Action => ({
    type: GET_CURRENCY_RATE_LOADING
});

export const getNftHistory: any = (tokenId: string, filters: any) => async (dispatch: Dispatch) => {
    dispatch(getNftHistoryLoading());
    axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/history/${tokenId}`, { params: filters })
        .then(async (res) => {
            dispatch({
                type: GET_NFT_HISTORY,
                payload: res.data?.data
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_NFT_HISTORY,
                payload: null
            });
        });
};

export const getNftHistoryLoading = (): Action => ({
    type: GET_NFT_HISTORY_LOADING
});

export const getRoyaltyInfo: any =
    (signer: Signer, tokenId: string, contractAddress: string) => async (dispatch: Dispatch) => {
        dispatch(getRoyaltyInfoLoading());
        try {
            const nft = new ethers.Contract(contractAddress, NFT.abi, signer);
            const data = await nft.royaltyInfo(tokenId, String(100000000000000000000));

            dispatch({
                type: GET_ROYALTY_INFO,
                payload: data
            });
        } catch (error) {
            // console.log(error);

            dispatch({
                type: GET_ROYALTY_INFO,
                payload: null
            });
        }
    };

export const getRoyaltyInfoLoading = (): Action => ({
    type: GET_ROYALTY_INFO_LOADING
});

export const sendGift =
    (signer: Signer, tokenId: string, from: string, to: string, setState: Function, contractAddress: string) =>
    async (dispatch: Dispatch, getState: Function) => {
        dispatch(sendGiftLoading());
        try {
            // @ts-ignore
            const contract = new ethers.Contract(contractAddress, NFT.abi, signer);
            // TODO:will be implemented in future
            // const approved = await nft.getApproved(tokenId);
            // const isApproved = approved == receiver;

            // if (!isApproved) {
            //     const approve = await nft.approve(process.env.NEXT_PUBLIC_MARKET_ADDRESS, tokenId);
            //     await approve.wait();
            // } else {
            //     toast.error('Gift already sent.');
            //     dispatch({
            //         type: SEND_GIFT,
            //         payload: null
            //     });
            //     return;
            // }
            const transaction = await contract.transferFrom(from, to, tokenId);
            await transaction.wait();
            setState();
            dispatch({
                type: SEND_GIFT,
                payload: tokenId
            });
            const { nft }: any = getState().nft;
            if (nft?.tokenId == tokenId) {
                dispatch(getNftByTokenId(tokenId));
            }
        } catch (error: any) {
            toast.error(error?.reason || error?.data?.message || error?.message);
            dispatch({
                type: SEND_GIFT,
                payload: null
            });
        }
    };

export const sendGiftLoading = (): Action => ({
    type: SEND_GIFT_LOADING
});

export const getMaticPrice: any = () => async (dispatch: Dispatch) => {
    dispatch(getMaticPriceLoading());
    axios
        .get(`https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD`)
        .then(async (res) => {
            dispatch({
                type: GET_MATIC_PRICE,
                payload: res.data?.USD
            });
        })
        .catch((err) => {
            dispatch({
                type: GET_MATIC_PRICE,
                payload: 0
            });
        });
};

export const getMaticPriceLoading = (): Action => ({
    type: GET_MATIC_PRICE_LOADING
});
