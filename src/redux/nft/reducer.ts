import {
    GET_NFT_BY_ID,
    GET_NFT_BY_ID_LOADING,
    LOADING,
    TOP_NFTS,
    LIST_NFT_ON_MARKETE,
    LIST_NFT_ON_MARKETE_LOADING,
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
    // GET_NFT_BY_WALLET_ADDRESS,
    // GET_NFT_BY_WALLET_ADDRESS_LOADING,
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
    SET_ROYALTIES_LOADING,
    INSERT_BID,
    GET_LOOBR_USD_PRICE_LOADING,
    GET_LOOBR_USD_PRICE,
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
    GET_AVAX_PRICE_LOADING,
    GET_MARKETE_PLACE_FROM_LOADING
} from './actionTypes';
import { CREATE_NFT, CREATE_NFT_LOADING, GET_MARKETE_PLACE, GET_MARKETE_PLACE_LOADING } from './actionTypes';
import { Action } from '../../types';

const initialState = {
    createNftLoading: false,
    topNfs: null,
    loading: false,
    marketplace: null,
    marketplaceLoading: false,
    nft: null,
    nftLoading: true,
    listNftLoading: false,
    listing: null,
    listingLoading: false,
    listings: null,
    listingsLoading: false,
    placeBidLoading: false,
    buyNftLoading: false,
    activeBiddings: null,
    activeBiddingdLoading: false,
    claimNftLoading: false,
    unlistNftLoading: false,
    bids: null,
    bidsLoading: false,
    owner: false,
    ownerLoading: false,
    auctionedNft: false,
    auctionedNftLoading: false,
    topNft: false,
    topNftLoading: false,
    createReport: null,
    createReportLoading: false,
    listingLoadinglocal: false,
    listinglocal: null,
    loobrPrice: 0.000049,
    loobrPriceLoading: false,
    usdtPrice: 0,
    usdtPriceLoading: false,
    currencyRate: 0,
    currencyRateLoading: false,
    bnbPrice: 0,
    bnbPriceLoading: false,
    ethPrice: 0,
    ethPriceLoading: false,
    maticPrice: 0,
    maticPriceLoading: false,
    avaxPrice: 0,
    avaxPriceLoading: false,
    history: null,
    historyLoading: false,
    creator: null,
    creatorLoading: false,
    royalty: null,
    royaltyLoading: false,
    giftLoading: false
};

const reducer = (state: any = initialState, action: Action) => {
    switch (action.type) {
        case CREATE_NFT: {
            return { ...state, createNftLoading: false };
        }
        case CREATE_NFT_LOADING: {
            return { ...state, createNftLoading: action.payload };
        }
        case LOADING: {
            return { ...state, loading: true };
        }
        case TOP_NFTS: {
            return { ...state, loading: false, TOP_NFTS: action.payload };
        }
        case GET_MARKETE_PLACE: {
            return {
                ...state,
                marketplace: action.payload,
                marketplaceLoading: false,
                marketplaceFromLoading: false
            };
        }
        case GET_MARKETE_PLACE_LOADING: {
            return { ...state, marketplaceLoading: true };
        }
        case GET_MARKETE_PLACE_FROM_LOADING: {
            return { ...state, marketplaceFromLoading: true };
        }
        case GET_NFT_BY_ID: {
            return {
                ...state,
                nft: action.payload,
                nftLoading: false
            };
        }
        case GET_NFT_BY_ID_LOADING: {
            return { ...state, nftLoading: true };
        }
        case LIST_NFT_ON_MARKETE: {
            return {
                ...state,
                listNftLoading: false
            };
        }
        case LIST_NFT_ON_MARKETE_LOADING: {
            return { ...state, listNftLoading: action.payload };
        }
        case GET_LISTINGS: {
            return { ...state, listings: action.payload, listingsLoading: false };
        }
        case GET_LISTINGS_LOADING: {
            return { ...state, listingsLoading: true };
        }
        case PLACE_BID_LOADING: {
            return { ...state, placeBidLoading: action.payload };
        }
        case BUY_NFT_LOADING: {
            return { ...state, buyNftLoading: action.payload };
        }
        case GET_ACTIVE_BIDDINGS: {
            return {
                ...state,
                activeBiddingsLoading: false,
                activeBiddings: action.payload
            };
        }
        case GET_ACTIVE_BIDDINGS_LOADING: {
            return {
                ...state,
                activeBiddingsLoading: true
            };
        }
        case CLAIM_NFT_LOADING: {
            return {
                ...state,
                claimNftLoading: action.payload
            };
        }
        case UNLIST_NFT_LOADING: {
            return {
                ...state,
                unlistNftLoading: action.payload
            };
        }
        case GET_LISTING_BY_LISTING_ID: {
            return {
                ...state,
                listing: action.payload,
                listingLoading: false
            };
        }
        case GET_LISTING_BY_LISTING_ID_LOADING: {
            return {
                ...state,
                listingLoading: true
            };
        }
        case GET_NFT_BY_TOKEN_ID: {
            return {
                ...state,
                nft: action.payload,
                nftLoading: false
            };
        }
        case GET_NFT_BY_TOKEN_ID_LOADING: {
            return {
                ...state,
                nftLoading: true
            };
        }
        case GET_BIDS_BY_LISTING_ID: {
            return {
                ...state,
                bids: action.payload,
                bidsLoading: false
            };
        }
        case GET_BIDS_BY_LISTING_ID_LOADING: {
            return {
                ...state,
                bidsLoading: true
            };
        }
        case INSERT_BID: {
            return {
                ...state,
                bids: state.bids ? [...action.payload, ...state.bids] : action.payload
            };
        }

        case GET_OWNER_BY_WALLET_ADDRESS: {
            // console.log(action.payload, 'payload');

            return {
                ...state,
                owner: action.payload,
                ownerLoading: false
            };
        }
        case GET_OWNER_BY_WALLET_ADDRESS_LOADING: {
            return {
                ...state,
                ownerLoading: true
            };
        }
        case GET_AUCTION_NFT: {
            return {
                ...state,
                auctionedNft: action.payload,
                auctionedNftLoading: false
            };
        }
        case GET_AUCTION_NFT_LOADING: {
            return {
                ...state,
                auctionedNftLoading: true
            };
        }
        case GET_TOP_NFT: {
            return {
                ...state,
                topNft: action.payload,
                topNftLoading: false
            };
        }
        case GET_TOP_NFT_LOADING: {
            return {
                ...state,
                topNftLoading: true
            };
        }
        case CREATE_REPORT: {
            return {
                ...state,
                createReportLoading: false
            };
        }
        case CREATE_REPORT_LOADING: {
            return {
                ...state,
                createReportLoading: true
            };
        }
        case GET_LISTINGS_LOCAL: {
            // console.log(action.payload);

            return {
                ...state,
                listinglocal: action.payload,
                listingLoadinglocal: false
            };
        }
        case GET_LISTINGS_LOADING_LOCAL: {
            return { ...state, listingLoadinglocal: true };
        }
        case GET_USDT_USD_PRICE: {
            return {
                ...state,
                usdtPrice: action.payload,
                usdtPriceLoading: false
            };
        }
        case GET_USDT_USD_PRICE_LOADING: {
            return {
                ...state,
                usdtPriceLoading: true
            };
        }
        case GET_LOOBR_USD_PRICE: {
            // debugger
            return {
                ...state,
                loobrPrice: action.payload,
                loobrPriceLoading: false
            };
        }
        case GET_LOOBR_USD_PRICE_LOADING: {
            return {
                ...state,
                loobrPriceLoading: true
            };
        }
        case GET_BNB_PRICE: {
            return {
                ...state,
                bnbPrice: action.payload,
                bnbPriceLoading: false
            };
        }
        case GET_BNB_PRICE_LOADING: {
            return {
                ...state,
                bnbPriceLoading: true
            };
        }
        case GET_CURRENCY_RATE: {
            return {
                ...state,
                currencyRate: action.payload,
                currencyRateLoading: false
            };
        }
        case GET_CURRENCY_RATE_LOADING: {
            return {
                ...state,
                currencyRateLoading: true
            };
        }
        case GET_ETH_PRICE: {
            return {
                ...state,
                ethPrice: action.payload,
                ethPriceLoading: false
            };
        }
        case GET_ETH_PRICE_LOADING: {
            return {
                ...state,
                ethPriceLoading: true
            };
        }
        case GET_MATIC_PRICE: {
            return {
                ...state,
                maticPrice: action.payload,
                maticPriceLoading: false
            };
        }
        case GET_MATIC_PRICE_LOADING: {
            return {
                ...state,
                maticPriceLoading: true
            };
        }
        case GET_AVAX_PRICE: {
            return {
                ...state,
                avaxPrice: action.payload,
                avaxPriceLoading: false
            };
        }
        case GET_AVAX_PRICE_LOADING: {
            return {
                ...state,
                avaxPriceLoading: true
            };
        }
        case GET_NFT_HISTORY: {
            return {
                ...state,
                history: action.payload,
                historyLoading: false
            };
        }
        case GET_NFT_HISTORY_LOADING: {
            return {
                ...state,
                historyLoading: true
            };
        }
        case GET_NFT_CREATOR: {
            return {
                ...state,
                creator: action.payload,
                creatorLoading: false
            };
        }
        case GET_NFT_CREATOR_LOADING: {
            return {
                ...state,
                creatorLoading: true
            };
        }

        case GET_ROYALTY_INFO: {
            return {
                ...state,
                royaltyLoading: false,
                royalty: action.payload
            };
        }

        case GET_ROYALTY_INFO_LOADING: {
            return {
                ...state,
                royaltyLoading: true
            };
        }

        case SET_ROYALTIES_LOADING: {
            return {
                ...state,
                royaltyLoading: action.payload
            };
        }
        case SEND_GIFT: {
            return {
                ...state,
                giftLoading: false
            };
        }
        case SEND_GIFT_LOADING: {
            return {
                ...state,
                giftLoading: true
            };
        }

        case GET_MATIC_PRICE: {
            return {
                ...state,
                maticPrice: action.payload,
                maticPriceLoading: false
            };
        }
        case GET_MATIC_PRICE_LOADING: {
            return {
                ...state,
                maticPriceLoading: true
            };
        }

        default:
            return state;
    }
};

export default reducer;
