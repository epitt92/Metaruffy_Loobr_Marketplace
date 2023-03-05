import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { isEmpty } from 'validate.js';
import { useRouter } from 'next/router';
import Popups from '../../components/popup/poups';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MainCard from '../../components/maincard/MainCard';
import Notfound from '../../components/notfound/notfound';
import useMetaMask from '../../hooks/useMetaMask';
import { homeService } from '../../services/home.service';
import Countdown from 'react-countdown';
import { LikeComponent } from '../../components/Like/LikeComponent';
import ToggleDisclosure from '../MarketPlaceModule/component/ToggleDisclosure';
import Comments from './components/Comments';
import dynamic from 'next/dynamic';
import CommentCount from '../../components/maincard/components/CommentCount';
import { FEED_COMMENT_LIKE_CREATED } from '../../constants/socketEvents';
import { _io } from '../../services/socket.service';
import useAudio from '../../hooks/useAudio';
import { getCollectionByAddress, getOtherListings } from '../../redux/collections/actions';
import Blockchains from '../../components/maincard/components/Blockchains';
import Head from 'next/head';
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), {
    ssr: false
});
import {
    buyNFT,
    getBidsBylistingId,
    getListingByListingId,
    getNftHistory,
    getNftListing,
    getRoyaltyInfo,
    removeFromMarkete,
    unlistNft
} from '../../redux/nft/actions';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import {
    fetchImage,
    getMarketDetailsByAddress,
    getMarketDetailsByAddressAndCurrency,
    getMarketDetailsByNFTAddress,
    isVideoMp4,
    NftContentType
} from '../../utils/functions';
import ProofAuth from './components/ProofAuth';
import Verified from '../../components/header/GlobalSearch/components/VerifiedIcon';
import blockchains from '../../contractsData/blockchains';
import Webgl from '../../components/Webgl';
import detailContentView from '../NftDetailModule/detailContentView';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';

const NftListingDetailModule = (props: any) => {
    const [star, setStar] = useState(false);

    const { library, isInstalled, isActive, account, switchNetwork }: any = useMetaMask();

    const { chainId } = useWeb3React();
    const [playing, play] = useAudio('/LOOBR_PURCHASE_NFT_SUCCESSFUL.mp3');
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [txHash, setTxHash] = useState('');
    const [like, setLike] = useState(false);
    const [data, setData] = useState<any>('');
    const [nft, setNft] = useState<any>();
    const [loacalLoading, setLocalLoading] = useState<boolean>(false);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [confirmedinside, setConfirmedinside] = useState<boolean>(false);
    const [viewShouldIncrease, setViewShouldIncrease] = useState<boolean>(false);
    const [btonText, setBtonText] = useState<string>('');

    console.log({ props });
    const router = useRouter();
    const { listingId } = router.query;

    const dispatch = useDispatch();
    const { listing } = props;
    // const listing = useSelector((state: any) => state.nft.listing);
    // const listing = useSelector((state: any) => state.nft.listing);
    const loading = useSelector((state: any) => state.nft.listingLoading);
    const listings = useSelector((state: any) => state.collections.otherListings);
    const listingsLoading = useSelector((state: any) => state.collections.otherListingsLoading);
    const history = useSelector((state: any) => state.nft.history);
    const placeBidLoading = useSelector((state: any) => state.nft.placeBidLoading);
    const user = useSelector((state: any) => state.auth.user);
    const bids = useSelector((state: any) => state.nft.bids);
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);
    const usdtPrice = useSelector((state: any) => state.nft.usdtPrice);
    const bnbPrice = useSelector((state: any) => state.nft.bnbPrice);
    const ethPrice = useSelector((state: any) => state.nft.ethPrice);
    const maticPrice = useSelector((state: any) => state.nft.maticPrice);
    const royalty = useSelector((state: any) => state.nft.royalty);
    const [action, setAction] = useState(listing?.sellMode === '1' ? 'bid' : 'buy');
    const blockchain = useMemo(() => getMarketDetailsByAddressAndCurrency(listing?.to, listing?.chain), [listing]);
    const collectionn = useSelector((state: any) => state.collections.collection);
    const collectionLoading = useSelector((state: any) => state.collections.collectionLoading);
    const collection = listing?.collection || collectionn?.collection || nft?.contractInfo;

    useEffect(() => {
        const signer = library?.getSigner();
        listing && library && dispatch(getRoyaltyInfo(signer, listing?.tokenId, listing?.nft?.contractAddress));
        if (!listing?.collection) {
            listing && dispatch(getCollectionByAddress(listing?.nft?.contractAddress));
        }
    }, [listing?.tokenId, library, listing, dispatch]);

    useEffect(() => {
        // listingId && dispatch(getListingByListingId(listingId, true));
        listingId && dispatch(getBidsBylistingId(listingId));
        // address && getStats(address);
    }, [listingId, dispatch]);

    useEffect(() => {
        listing && dispatch(getNftHistory(listing?.tokenId, { blockchain: listing?.chain }));
    }, [listing, dispatch]);

    useEffect(() => {
        if (listing) {
            try {
                const isLiked = listing?.like?.filter((el: any) => el.toString() === user?.userId).length > 0;
                setLike(isLiked);
                listing?.nft?.collectionId &&
                    dispatch(getOtherListings(listing?.nft?.collectionId, listing?.listingId));
                handleViews();
            } catch (error) {
                console.log(error);
            }
        }
    }, [listing?.listingId, dispatch, user?.userId]);

    useEffect(() => {
        if (listingId && confirmed) {
            setConfirmed(false);
            listingId && dispatch(getListingByListingId(listingId, false));
            // getNftwithComments(listing?.nft?._id);
        }
    }, [confirmed]);

    const handleViews = async () => {
        try {
            if (listing?.nft) {
                const res = await homeService.viewMarketPlace(listing?.nft?._id);
                if (res.data?.data?.views.length > listing?.nft?.views?.length) {
                    listing.nft.views = res.data?.data?.views;
                }
            }
        } catch (err) {
            // console.log(err);
        }
    };

    const getNftwithComments = async (id: string) => {
        setLocalLoading(true);
        try {
            const res = await homeService.getNft(id);
            setNft(res.data.data);
        } catch (error) {
            setNft(undefined);
            // console.log(error);
        }
        setLocalLoading(false);
    };

    const handleBuyNft = () => {
        if (!checkMetamask()) {
            return;
        }
        setPopup(true);
        setState(35);
        const signer = library?.getSigner();
        dispatch(
            // @ts-ignore
            buyNFT(
                signer,
                listing?.listingId,
                listing?.price,
                setTxHash,
                setState,
                play,
                account,
                listing?.to,
                blockchain?.tokenAddress,
                blockchain?.native == undefined ? true : blockchain?.native
            )
        );
    };

    const handleOnSwitchNetwork = () => {
        if (btonText === 'Buy Now') {
            // handleBuyNft();
            setState(-1);
        } else if (btonText === 'List on Marketplace') {
            setPopup(true);
            setState(24);
        } else if (btonText === 'Place a bid') {
            handleBidding();
            // setState(-1);
        } else if (btonText === 'Unlist') {
            // handleUnlist();
            setState(-1);
        } else {
            setPopup(true);
            setState(7);
        }
    };

    const handleSwitchNetwork = async (contractAddress: string) => {
        const blockchain = getMarketDetailsByNFTAddress(contractAddress);
        const chain = blockchain ? blockchain?.chainId : undefined;

        if (!blockchain) {
            toast.error('This chain does not supported.');
            return false;
        } else if (chain == chainId) {
            return true;
        } else {
            setPopup(true);
            setState(64);
            return false;
        }
    };

    const handleButtonClick = async (btn: string) => {
        setBtonText(btn);

        if (!checkMetamask()) {
            return;
        }

        const chain = blockchains.find((item) => item?.symbol == listing?.chain);
        const status = await switchNetwork(chain?.chainId);
        if (!status) {
            return;
        }
        if (btn === 'Buy Now') {
            handleBuyNft();
        } else if (btn === 'List on Marketplace') {
            setPopup(true);
            setState(24);
        } else if (btn === 'Place a bid') {
            handleBidding();
        } else if (btn === 'Unlist') {
            handleUnlist();
        } else {
            setPopup(true);
            setState(7);
        }
    };

    const handleBidding = () => {
        setAction('bid');
        setPopup(true);
        setState(13);
    };

    const handleUnlist = async () => {
        if (!checkMetamask()) {
            return;
        }
        setPopup(true);
        setState(39);
        const signer = library?.getSigner();

        let res = await dispatch(unlistNft(signer, listing?.listingId, setState, setTxHash, listing?.to));
        router.push('/marketplace');
    };

    const checkMetamask = () => {
        if (isActive) {
            return true;
        } else if (!isInstalled && window.innerWidth > 480) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
            return false;
        } else if (!isActive) {
            setPopup(true);
            setState(7);
            return false;
        }
    };

    const handleOnComplete = () => {
        dispatch(removeFromMarkete(listingId));
    };

    const isLoading = loading;

    useEffect(() => {
        listenSocket();
    }, []);

    const listenSocket = () => {
        _io.on(`${FEED_COMMENT_LIKE_CREATED}`, (newdata: any) => {
            if (user && user.userId != newdata.user) {
                if (newdata.user) {
                    setConfirmedinside(true);
                }
            }
        });
    };

    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };

    const getMaxBid = () => {
        return !isEmpty(bids) ? bids[0]?.price : listing?.price || 0;
    };

    const handleDisabled = (btn: string, owner: string) => {
        if (
            (btn === 'Buy Now' && owner === '0xfAa65EC7A612A980A968Aeb10dDFd0739d9E38B9') ||
            (btn === 'Place a bid' && owner === '0xfAa65EC7A612A980A968Aeb10dDFd0739d9E38B9')
        ) {
            return true;
        } else {
            return false;
        }
    };

    const calculateAmount = (amount: number) => {
        const fee = listing?.currency == 'LOOBR' ? 0 : 2;
        return Number(Number(amount + (fee / 100) * amount).toFixed(4));
    };

    const getPrice = (price: number) => {
        if (!price) {
            return 0;
        }
        // const currency = blockchain?.native ? blockchain.nativeCurrency : blockchain?.tokenSymbol;
        const currency = listing?.currency;
        const rate =
            currency === 'ETH'
                ? ethPrice
                : currency === 'BNB'
                ? bnbPrice
                : currency === 'USDT'
                ? usdtPrice
                : currency == 'LOOBR'
                ? loobrPrice
                : currency == 'MATIC'
                ? maticPrice
                : 0;

        return Number(Number(Number(rate) * Number(price)).toFixed(2)).toLocaleString();
    };

    const buttonText = useMemo(
        () =>
            listing
                ? listing.sender === account
                    ? 'Unlist'
                    : listing?.sellMode === '1'
                    ? 'Place a bid'
                    : 'Buy Now'
                : 'List on Marketplace',
        [account, listing]
    );

    return (
        <>
            <div className="container pb-[7.5rem] pt-16 lg:pt-[7.5rem] min-h-[800px]   ">
                {isLoading && (
                    <div className="flex justify-center">
                        <figure className="mt-12">
                            <div className="loadingio-spinner-rolling-jz7efhw30v">
                                <div className="ldio-fcd0x3izul5">
                                    <div></div>
                                </div>
                            </div>
                        </figure>
                    </div>
                )}
                {/* {!isLoading && isEmpty(listing) && <Notfound />} */}
                {!isLoading && !isEmpty(listing) && (
                    <div>
                        <div className="grid lg:grid-cols-2 lg:gap-[4rem]    items-start xl:gap-[6.43rem] mb-[7.5rem]">
                            <div className="order-2 w-full lg:order-1 ">
                                <figure className="relative mb-10 overflow-hidden lg:mb-0 Atnftdetailimag rounded-xl">
                                    {detailContentView(listing?.nft, {
                                        layout: 'fill',
                                        figClassName: `w-full h-[48.813rem] relative vimeo-video-container`
                                    })}
                                </figure>
                                <div className="items-center justify-between block mt-4 md:flex xl:flex">
                                    {/* Proof of auth */}
                                    <ProofAuth
                                        transactionHash={listing?.transactionHash}
                                        image={listing?.nft?.image}
                                        chain={listing?.chain}
                                        marketAddress={listing?.to}
                                    />
                                    <div
                                        className={`flex justify-end gap-5 xl:gap-3 2xl:gap-5 md:mt-0 lg:mt-6 xl:mt-0 ${
                                            checkblocked(listing?.owner, user?.userId) ? 'opacity-50' : ''
                                        }`}>
                                        <div className="">
                                            <LikeComponent
                                                nft={listing}
                                                className="flex items-center "
                                                showCount={true}
                                                feeduser={listing?.owner}
                                            />
                                        </div>
                                        <CommentCount
                                            showLoginPopup={user ? false : true}
                                            nft={listing?.nft}
                                            disabled={true}
                                        />
                                        <div
                                            // className="flex items-center cursor-pointer"
                                            // onClick={() => {
                                            //   setData(
                                            //     `${process.env.NEXT_PUBLIC_URL}/listings/${listingId}`
                                            //   );
                                            //   setPopup(true);
                                            //   setState(31);
                                            // }}
                                            className={`${
                                                checkblocked(listing?.owner, user?.userId)
                                                    ? 'flex items-center'
                                                    : 'cursor-pointer flex items-center'
                                            } `}
                                            onClick={() => {
                                                if (!checkblocked(listing?.owner, user?.userId)) {
                                                    setData(`${process.env.NEXT_PUBLIC_URL}/listings/${listingId}`);
                                                    setPopup(true);
                                                    setState(31);
                                                }
                                            }}>
                                            <div className="Atcardhovershare-bg">
                                                <svg
                                                    className="Atcardhovershare"
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M15.91 5.03003C17.91 6.42003 19.29 8.63003 19.57 11.18M2.44 11.23C2.7 8.68996 4.06 6.47996 6.04 5.07996M7.14001 19.7999C8.30001 20.3899 9.62002 20.7199 11.01 20.7199C12.35 20.7199 13.61 20.4199 14.74 19.8699M13.79 3.78C13.79 5.31535 12.5454 6.56 11.01 6.56C9.47469 6.56 8.23004 5.31535 8.23004 3.78C8.23004 2.24465 9.47469 1 11.01 1C12.5454 1 13.79 2.24465 13.79 3.78ZM6.56 16C6.56 17.5353 5.31535 18.78 3.78 18.78C2.24465 18.78 1 17.5353 1 16C1 14.4646 2.24465 13.22 3.78 13.22C5.31535 13.22 6.56 14.4646 6.56 16ZM20.9 16C20.9 17.5353 19.6554 18.78 18.12 18.78C16.5847 18.78 15.34 17.5353 15.34 16C15.34 14.4646 16.5847 13.22 18.12 13.22C19.6554 13.22 20.9 14.4646 20.9 16Z"
                                                        stroke="#A1A1A5"
                                                    />
                                                </svg>
                                            </div>

                                            <p className=" text-white font-Proxima-SemiBold text-[14px] ml-1  ">
                                                Share
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                width="22"
                                                height="19"
                                                viewBox="0 0 22 19"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M14.315 9.48613C14.315 11.4661 12.715 13.0661 10.735 13.0661C8.75503 13.0661 7.15503 11.4661 7.15503 9.48613C7.15503 7.50613 8.75503 5.90613 10.735 5.90613C12.715 5.90613 14.315 7.50613 14.315 9.48613Z"
                                                    stroke="#A1A1A5"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M10.735 17.7561C14.265 17.7561 17.555 15.6761 19.845 12.0761C20.745 10.6661 20.745 8.29605 19.845 6.88605C17.555 3.28605 14.265 1.20605 10.735 1.20605C7.20495 1.20605 3.91495 3.28605 1.62495 6.88605C0.724951 8.29605 0.724951 10.6661 1.62495 12.0761C3.91495 15.6761 7.20495 17.7561 10.735 17.7561Z"
                                                    stroke="#A1A1A5"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                            <p className="text-[14px] ml-3  text-white font-Proxima-SemiBold">
                                                {listing?.nft?.views ? listing?.nft?.views?.length : 1} Views
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {!checkblocked(listing?.owner, user?.userId) && (
                                    <div className="mt-6">
                                        <Comments nft={listing?.nft} setConfirm={setConfirmed} />
                                    </div>
                                )}
                            </div>

                            <div className="flex order-1 w-full mb-6 sm:justify-between lg:mt-0 lg:order-2">
                                <div className="flex flex-col w-full ">
                                    <div className="items-center justify-between block gap-2 mb-3 sm:flex">
                                        <div className="max-w-full w-full sm:w-[50%] xs:py-2 ">
                                            <h3 className="text-[2rem] text-white  max-w-full flex ">
                                                <span className="block max-w-full braek">{listing?.nft?.name}</span>
                                            </h3>
                                        </div>
                                        <div className="flex gap-6 mt-4 md:mt-0 mb-4 md:mb-0  justify-start md:justify-end items-center  lg:w-[50%]">
                                            {listing?.owner && (
                                                // eslint-disable-next-line @next/next/link-passhref
                                                <Link legacyBehavior href={`/profile/${listing?.owner.userName}`}>
                                                    <a>
                                                        <div className="flex items-center gap-2 ">
                                                            <figure className="flex-shrink-0 h-[40px] w-[40px] relative overflow-hidden">
                                                                {listing?.owner?.avatar ? (
                                                                    <ImageComponent
                                                                        className="rounded-full"
                                                                        src={listing?.owner?.avatar}
                                                                        alt=""
                                                                        objectFit="cover"
                                                                        layout="fill"
                                                                        // height={40}
                                                                        // width={40}
                                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <p className="w-[2.5rem] h-[2.5rem] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl pt-[2px]">
                                                                            {listing?.owner?.firstName
                                                                                ?.charAt(0)
                                                                                .toUpperCase()}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </figure>
                                                            <div className="truncate ">
                                                                <div className=" flex  gap-1.5 items-center ">
                                                                    <h3 className="text-[#FFFFFF] max-w-[7.5rem]  border-b border-transparent hover:border-white truncate text-sm">
                                                                        {listing?.owner?.userName}
                                                                    </h3>
                                                                    {listing?.owner?.isVerfied && (
                                                                        <svg
                                                                            className="flex-shrink-0 "
                                                                            width="20"
                                                                            height="20"
                                                                            viewBox="0 0 38 38"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M12.8779 34.3936C11.4304 31.9477 9.03069 30.2142 6.25391 29.6083V29.6083C5.85807 29.5292 5.54141 29.3244 5.30391 28.994C5.06641 28.6647 4.97405 28.3021 5.02682 27.9062V27.9062C5.30473 25.0514 4.37877 22.191 2.49349 20.0292V20.0292C2.2296 19.7389 2.09766 19.3958 2.09766 19C2.09766 18.6042 2.2296 18.2611 2.49349 17.9708V17.9708C4.37877 15.809 5.30473 12.9486 5.02682 10.0938V10.0938C4.97405 9.69792 5.06641 9.33533 5.30391 9.006C5.54141 8.67561 5.85807 8.47083 6.25391 8.39167V8.39167C9.03069 7.78582 11.4304 6.05228 12.8779 3.60642L12.9039 3.5625C13.115 3.21945 13.4053 2.99514 13.7747 2.88958C14.1442 2.78403 14.5136 2.79722 14.8831 2.92917V2.92917C17.5146 4.04251 20.4849 4.04251 23.1164 2.92917V2.92917C23.4859 2.79722 23.8553 2.78403 24.2247 2.88958C24.5942 2.99514 24.8845 3.21945 25.0956 3.5625L25.1216 3.60642C26.5691 6.05228 28.9688 7.78582 31.7456 8.39167V8.39167C32.1414 8.47083 32.4581 8.67561 32.6956 9.006C32.9331 9.33533 33.0254 9.69792 32.9727 10.0938V10.0938C32.6947 12.9486 33.6207 15.809 35.506 17.9708V17.9708C35.7699 18.2611 35.9018 18.6042 35.9018 19C35.9018 19.3958 35.7699 19.7389 35.506 20.0292V20.0292C33.6207 22.191 32.6947 25.0514 32.9727 27.9062V27.9062C33.0254 28.3021 32.9331 28.6647 32.6956 28.994C32.4581 29.3244 32.1414 29.5292 31.7456 29.6083V29.6083C28.9688 30.2142 26.5691 31.9477 25.1216 34.3936L25.0956 34.4375C24.8845 34.7806 24.5942 35.0049 24.2247 35.1104C23.8553 35.216 23.4859 35.2028 23.1164 35.0708V35.0708C20.4849 33.9575 17.5146 33.9575 14.8831 35.0708V35.0708C14.5136 35.2028 14.1442 35.216 13.7747 35.1104C13.4053 35.0049 13.115 34.7806 12.9039 34.4375L12.8779 34.3936Z"
                                                                                fill="#64C3FD"
                                                                            />
                                                                            <path
                                                                                d="M24.6684 14.3826C24.9276 14.1345 25.2725 13.9973 25.6304 14C25.9883 14.0028 26.3311 14.1452 26.5865 14.3972C26.842 14.6492 26.9901 14.9911 26.9995 15.3508C27.009 15.7105 26.8791 16.0598 26.6372 16.3251L19.2954 25.5565C19.1691 25.6933 19.0167 25.803 18.8474 25.8791C18.678 25.9553 18.4951 25.9963 18.3095 25.9998C18.124 26.0032 17.9397 25.969 17.7676 25.8992C17.5956 25.8294 17.4393 25.7255 17.3081 25.5935L12.4392 20.6985C12.3037 20.5714 12.1949 20.4183 12.1195 20.2481C12.044 20.0779 12.0035 19.8941 12.0002 19.7078C11.9969 19.5215 12.031 19.3365 12.1004 19.1637C12.1699 18.9909 12.2732 18.834 12.4042 18.7022C12.5353 18.5705 12.6914 18.4666 12.8632 18.3968C13.035 18.3271 13.2191 18.2928 13.4044 18.2961C13.5897 18.2994 13.7724 18.3401 13.9417 18.416C14.111 18.4918 14.2634 18.6011 14.3897 18.7375L18.2428 22.6095L24.6334 14.4233C24.6449 14.409 24.6572 14.3955 24.6702 14.3826H24.6684Z"
                                                                                fill="#14141F"
                                                                            />
                                                                            <defs>
                                                                                <linearGradient
                                                                                    id="paint0_linear_1971_6534"
                                                                                    x1="2.09766"
                                                                                    y1="2.81921"
                                                                                    x2="38.6017"
                                                                                    y2="6.22261"
                                                                                    gradientUnits="userSpaceOnUse">
                                                                                    <stop stopColor="#AA601B" />
                                                                                    <stop
                                                                                        offset="0.484375"
                                                                                        stopColor="#ECDB88"
                                                                                    />
                                                                                    <stop
                                                                                        offset="0.994792"
                                                                                        stopColor="#AA601B"
                                                                                    />
                                                                                </linearGradient>
                                                                            </defs>
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <p className="#A1A1A5 text-xs">Owner</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            )}
                                            {!isEmpty(listing?.creator) && (
                                                /* listing?.owner._id !== listing?.creator._id */ // eslint-disable-next-line @next/next/link-passhref
                                                <Link legacyBehavior href={`/profile/${listing?.creator.userName}`}>
                                                    <a>
                                                        <div className="flex items-center gap-2 ">
                                                            <figure className="flex-shrink-0 h-[40px] w-[40px]   relative ">
                                                                {listing?.creator?.avatar ? (
                                                                    <ImageComponent
                                                                        className="flex-shrink-0 rounded-full"
                                                                        src={listing?.creator?.avatar}
                                                                        alt=""
                                                                        objectFit="cover"
                                                                        layout="fill"
                                                                        // height={40}
                                                                        // width={40}
                                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <p className="w-[2.5rem] h-[2.5rem] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                            {listing?.creator?.firstName
                                                                                ?.charAt(0)
                                                                                .toUpperCase()}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </figure>
                                                            <div className="truncate ">
                                                                <div className="flex gap-1.5 items-center">
                                                                    <h3 className="text-[#FFFFFF] border-b border-transparent hover:border-white   text-sm max-w-[7.5rem]  truncate">
                                                                        {listing?.creator?.userName}
                                                                    </h3>
                                                                    {listing?.creator?.isVerfied && (
                                                                        <svg
                                                                            className="flex-shrink-0 "
                                                                            width="20"
                                                                            height="20"
                                                                            viewBox="0 0 38 38"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M12.8779 34.3936C11.4304 31.9477 9.03069 30.2142 6.25391 29.6083V29.6083C5.85807 29.5292 5.54141 29.3244 5.30391 28.994C5.06641 28.6647 4.97405 28.3021 5.02682 27.9062V27.9062C5.30473 25.0514 4.37877 22.191 2.49349 20.0292V20.0292C2.2296 19.7389 2.09766 19.3958 2.09766 19C2.09766 18.6042 2.2296 18.2611 2.49349 17.9708V17.9708C4.37877 15.809 5.30473 12.9486 5.02682 10.0938V10.0938C4.97405 9.69792 5.06641 9.33533 5.30391 9.006C5.54141 8.67561 5.85807 8.47083 6.25391 8.39167V8.39167C9.03069 7.78582 11.4304 6.05228 12.8779 3.60642L12.9039 3.5625C13.115 3.21945 13.4053 2.99514 13.7747 2.88958C14.1442 2.78403 14.5136 2.79722 14.8831 2.92917V2.92917C17.5146 4.04251 20.4849 4.04251 23.1164 2.92917V2.92917C23.4859 2.79722 23.8553 2.78403 24.2247 2.88958C24.5942 2.99514 24.8845 3.21945 25.0956 3.5625L25.1216 3.60642C26.5691 6.05228 28.9688 7.78582 31.7456 8.39167V8.39167C32.1414 8.47083 32.4581 8.67561 32.6956 9.006C32.9331 9.33533 33.0254 9.69792 32.9727 10.0938V10.0938C32.6947 12.9486 33.6207 15.809 35.506 17.9708V17.9708C35.7699 18.2611 35.9018 18.6042 35.9018 19C35.9018 19.3958 35.7699 19.7389 35.506 20.0292V20.0292C33.6207 22.191 32.6947 25.0514 32.9727 27.9062V27.9062C33.0254 28.3021 32.9331 28.6647 32.6956 28.994C32.4581 29.3244 32.1414 29.5292 31.7456 29.6083V29.6083C28.9688 30.2142 26.5691 31.9477 25.1216 34.3936L25.0956 34.4375C24.8845 34.7806 24.5942 35.0049 24.2247 35.1104C23.8553 35.216 23.4859 35.2028 23.1164 35.0708V35.0708C20.4849 33.9575 17.5146 33.9575 14.8831 35.0708V35.0708C14.5136 35.2028 14.1442 35.216 13.7747 35.1104C13.4053 35.0049 13.115 34.7806 12.9039 34.4375L12.8779 34.3936Z"
                                                                                fill="#64C3FD"
                                                                            />
                                                                            <path
                                                                                d="M24.6684 14.3826C24.9276 14.1345 25.2725 13.9973 25.6304 14C25.9883 14.0028 26.3311 14.1452 26.5865 14.3972C26.842 14.6492 26.9901 14.9911 26.9995 15.3508C27.009 15.7105 26.8791 16.0598 26.6372 16.3251L19.2954 25.5565C19.1691 25.6933 19.0167 25.803 18.8474 25.8791C18.678 25.9553 18.4951 25.9963 18.3095 25.9998C18.124 26.0032 17.9397 25.969 17.7676 25.8992C17.5956 25.8294 17.4393 25.7255 17.3081 25.5935L12.4392 20.6985C12.3037 20.5714 12.1949 20.4183 12.1195 20.2481C12.044 20.0779 12.0035 19.8941 12.0002 19.7078C11.9969 19.5215 12.031 19.3365 12.1004 19.1637C12.1699 18.9909 12.2732 18.834 12.4042 18.7022C12.5353 18.5705 12.6914 18.4666 12.8632 18.3968C13.035 18.3271 13.2191 18.2928 13.4044 18.2961C13.5897 18.2994 13.7724 18.3401 13.9417 18.416C14.111 18.4918 14.2634 18.6011 14.3897 18.7375L18.2428 22.6095L24.6334 14.4233C24.6449 14.409 24.6572 14.3955 24.6702 14.3826H24.6684Z"
                                                                                fill="#14141F"
                                                                            />
                                                                            <defs>
                                                                                <linearGradient
                                                                                    id="paint0_linear_1971_6534"
                                                                                    x1="2.09766"
                                                                                    y1="2.81921"
                                                                                    x2="38.6017"
                                                                                    y2="6.22261"
                                                                                    gradientUnits="userSpaceOnUse">
                                                                                    <stop stopColor="#AA601B" />
                                                                                    <stop
                                                                                        offset="0.484375"
                                                                                        stopColor="#ECDB88"
                                                                                    />
                                                                                    <stop
                                                                                        offset="0.994792"
                                                                                        stopColor="#AA601B"
                                                                                    />
                                                                                </linearGradient>
                                                                            </defs>
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <p className="#A1A1A5 text-xs">Creator</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <div className="Atdetaillogos">
                                        <Blockchains blockchain={listing?.chain} />
                                    </div>
                                    <div className="items-center justify-between block mt-6 mb-5 sm:flex">
                                        <div>
                                            <p className="text-sm">
                                                <span className="text-white font-Proxima-Bold">Creator:</span>{' '}
                                                {royalty ? Number(royalty[1]) / 10 ** 18 : 0}% Royalties
                                            </p>
                                            {listing?.sellMode === '1' ? (
                                                <span className="block text-[#A1A1A5] text-[2rem] ">
                                                    Highest Bid{' '}
                                                    <span className="font-Proxima-Bold text-[#F1C94A] text-[2rem] flex flex-col items-start flex-wrap">
                                                        <div className="flex flex-wrap items-center leading-normal break-all">
                                                            {Number(getMaxBid()).toLocaleString()}
                                                            <i className="mx-2 leading-normal ">
                                                                {listing?.currency == 'LOOBR' ? (
                                                                    <Image
                                                                        src={'/assets/images/loobricon.svg'}
                                                                        width="25"
                                                                        height="25"
                                                                    />
                                                                ) : (
                                                                    listing?.currency
                                                                )}
                                                            </i>{' '}
                                                        </div>
                                                        <span className="text-[#a1a1a5] mt-4 font-Proxima-Regular block text-base">
                                                            ${getPrice(listing?.price)}
                                                        </span>
                                                    </span>
                                                </span>
                                            ) : (
                                                <div className="flex flex-wrap items-center text-[#A1A1A5] text-[2rem]">
                                                    Price{'  '}
                                                    <span className="font-Proxima-Bold text-[#F1C94A]  ml-1 text-[2rem] braek">
                                                        {Number(calculateAmount(listing?.price)).toLocaleString() ||
                                                            0.0}
                                                    </span>
                                                    <i className=" leading-[0] font-Proxima-Bold  text-[#F1C94A]   mx-2">
                                                        {listing?.currency == 'LOOBR' ? (
                                                            <Image
                                                                src={'/assets/images/loobricon.svg'}
                                                                width="25"
                                                                height="25"
                                                            />
                                                        ) : (
                                                            listing?.currency
                                                        )}
                                                    </i>{' '}
                                                    <span className="text-[#a1a1a5]  font-Proxima-Regular  text-base">
                                                        ${getPrice(calculateAmount(listing?.price))}
                                                    </span>
                                                </div>
                                            )}
                                            {listing?.alertText && (
                                                <h3 className="flex flex-shrink-0 p-1 px-2 mt-2 bg-white rounded-md">
                                                    <svg
                                                        width="28"
                                                        height="28"
                                                        viewBox="0 0 32 32"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M14.839 5.66799L2.17899 27.598C1.66899 28.488 2.30899 29.608 3.33899 29.608H28.659C29.689 29.608 30.329 28.498 29.819 27.598L17.159 5.66799C16.639 4.77799 15.359 4.77799 14.839 5.66799V5.66799Z"
                                                            fill="#FFB02E"
                                                        />
                                                        <path
                                                            d="M14.5986 21.497C14.6 21.8683 14.7487 22.2239 15.0122 22.4855C15.1427 22.615 15.2974 22.7176 15.4675 22.7873C15.6376 22.8571 15.8198 22.8927 16.0036 22.892C16.1875 22.8913 16.3694 22.8545 16.539 22.7835C16.7086 22.7126 16.8626 22.6089 16.9921 22.4784C17.1217 22.348 17.2242 22.1932 17.294 22.0231C17.3637 21.853 17.3993 21.6709 17.3986 21.487V12.327C17.3986 11.557 16.7786 10.927 15.9986 10.927C15.2286 10.927 14.5986 11.547 14.5986 12.327V21.497ZM17.3986 25.477C17.3986 25.8483 17.2511 26.2044 16.9886 26.467C16.726 26.7295 16.3699 26.877 15.9986 26.877C15.6273 26.877 15.2712 26.7295 15.0087 26.467C14.7461 26.2044 14.5986 25.8483 14.5986 25.477C14.5986 25.1057 14.7461 24.7496 15.0087 24.4871C15.2712 24.2245 15.6273 24.077 15.9986 24.077C16.3699 24.077 16.726 24.2245 16.9886 24.4871C17.2511 24.7496 17.3986 25.1057 17.3986 25.477Z"
                                                            fill="black"
                                                        />
                                                    </svg>
                                                    <span className="mt-1 !text-xl text-red-500 font-Proxima-SemiBold braek">
                                                        {listing?.alertText}
                                                    </span>
                                                </h3>
                                            )}
                                        </div>
                                        <div className="flex justify-end ">
                                            <div>
                                                <ReactSpeedometer
                                                    maxSegmentLabels={0}
                                                    segments={6}
                                                    value={listing?.percentage}
                                                    maxValue={100}
                                                    segmentColors={[
                                                        '#D72626',
                                                        '#F26D24',
                                                        '#F7B11E',
                                                        '#FED137',
                                                        '#FDEB48',
                                                        '#99C817'
                                                    ]}
                                                    width={120}
                                                    height={65}
                                                    ringWidth={10}
                                                    needleHeightRatio={0.6}
                                                />

                                                <p className="mt-2 text-center text-white font-Proxima-SemiBold">
                                                    Loobr Score {listing?.score.toFixed()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {listing?.nft?.description && (
                                        <p className="lg:w-[44.875rem] text-base leading-6 text-lightgray  font-Circular-Book mt-2  mb-4">
                                            {listing?.nft?.description}
                                        </p>
                                    )}
                                    <div className="flex-wrap items-start justify-between block gap-3 md:flex">
                                        <div className="max-w-[80%] flex flex-wrap gap-2">
                                            {listing?.nft?.categories?.map((item: any, key: number) => (
                                                <p
                                                    className="py-[6px] px-3 bg-[#2B2B35] inline-flex items-center m-2 md:m-0 rounded-lg !text-[#FFFFFF] text-sm"
                                                    key={key}>
                                                    {item}
                                                </p>
                                            ))}
                                        </div>
                                        {listing?.owner._id !== user?.userId && (
                                            <button
                                                type="button"
                                                className="flex items-center pl-[15px] pr-[15px] text-[#89898F] pt-[7px] pb-[7px] text-base"
                                                onClick={() => {
                                                    setData(listing);
                                                    setPopup(true);
                                                    setState(38);
                                                }}>
                                                <svg
                                                    width="16"
                                                    height="20"
                                                    viewBox="0 0 16 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M15.7268 0.10625C15.8107 0.163297 15.8796 0.240462 15.9272 0.330933C15.9749 0.421403 15.9999 0.522398 16 0.625V10C16 10.1248 15.9631 10.2468 15.8943 10.3501C15.8254 10.4535 15.7276 10.5336 15.6135 10.58L15.3846 10L15.6135 10.58L15.6098 10.5813L15.6025 10.585L15.5742 10.5963C15.4123 10.6616 15.2494 10.7241 15.0855 10.7837C14.7606 10.9025 14.3089 11.0625 13.7969 11.2213C12.7926 11.5363 11.4843 11.875 10.4615 11.875C9.41908 11.875 8.55631 11.525 7.80554 11.2188L7.77108 11.2063C6.99077 10.8875 6.32615 10.625 5.53846 10.625C4.67692 10.625 3.52246 10.9125 2.53908 11.2213C2.09878 11.3606 1.66249 11.5128 1.23077 11.6775V19.375C1.23077 19.5408 1.16593 19.6997 1.05053 19.8169C0.93512 19.9342 0.778595 20 0.615385 20C0.452174 20 0.295649 19.9342 0.180242 19.8169C0.0648351 19.6997 0 19.5408 0 19.375V0.625C0 0.45924 0.0648351 0.300269 0.180242 0.183058C0.295649 0.065848 0.452174 0 0.615385 0C0.778595 0 0.93512 0.065848 1.05053 0.183058C1.16593 0.300269 1.23077 0.45924 1.23077 0.625V0.9775C1.50892 0.87875 1.84123 0.765 2.20308 0.6525C3.20738 0.34 4.51692 0 5.53846 0C6.57231 0 7.41415 0.34625 8.14892 0.64875L8.20185 0.67125C8.96738 0.985 9.63446 1.25 10.4615 1.25C11.3231 1.25 12.4775 0.9625 13.4609 0.65375C14.0213 0.476015 14.5751 0.27755 15.1212 0.05875L15.1446 0.05L15.1495 0.0475H15.1508"
                                                        fill="#89898F"
                                                    />
                                                </svg>

                                                <span className="pl-[14px]">Report</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Collection Section Start */}
                                    {collection && (
                                        <div className="mt-5">
                                            <p className="mb-2 text-lg text-white font-Proxima-SemiBold">Collection</p>

                                            <Link
                                                legacyBehavior
                                                href={
                                                    collection?.address
                                                        ? `/collections/address/${collection?.address}?chain=${collection?.chain}`
                                                        : `/collections/${collection?._id}`
                                                }>
                                                <a>
                                                    <div className="flex items-center gap-2 ">
                                                        <figure className="flex-shrink-0 overflow-hidden h-[40px]  relative w-[40px] ">
                                                            {collection?.logoPicture ? (
                                                                <ImageComponent
                                                                    className="rounded-full"
                                                                    src={collection?.logoPicture}
                                                                    alt=""
                                                                    objectFit="cover"
                                                                    layout="fill"
                                                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <p className="w-[2.5rem] h-[2.5rem] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl pt-[2px]">
                                                                        {collection?.name?.charAt(0).toUpperCase()}
                                                                    </p>
                                                                </>
                                                            )}
                                                        </figure>
                                                        <div className="w-full braek cursor-pointer">
                                                            <h3 className="text-[#FFFFFF] text-sm flex gap-2 items-center">
                                                                {collection?.name}
                                                                {/* <span className=" ">
                                                                <i
                                                    onClick={() => setStar(!star)}
                                                    className={` hidden ${
                                                        star ? 'text-themecolor icon-start' : ' icon-ion_star text-white'
                                                    }   text-lg`}></i>
                                                                </span> */}
                                                            </h3>
                                                            {/* <p className="#A1A1A5 text-xs">Owner</p> */}
                                                        </div>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    )}

                                    {/* Collection Section End */}

                                    {listing?.sellMode === '1' && (
                                        <div className="mt-8">
                                            <p className="text-lg text-white font-Proxima-SemiBold">Auction ends in</p>
                                            <Countdown
                                                onComplete={handleOnComplete}
                                                date={
                                                    new Date(listing?.startTime * 1000).getTime() +
                                                    listing.duration * 1000
                                                }
                                                renderer={({ days, hours, minutes, seconds }) => (
                                                    <div className="flex items-center gap-6 md:gap-12">
                                                        <div>
                                                            <h4 className="text-[#F1C94A] text-[2.5rem]">{days}</h4>
                                                            <p className="text-lg">Days</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[#F1C94A] text-[2.5rem]">{hours}</h4>
                                                            <p className="text-lg">Hours</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[#F1C94A] text-[2.5rem]">{minutes}</h4>
                                                            <p className="text-lg">Minutes</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[#F1C94A] text-[2.5rem]">{seconds}</h4>
                                                            <p className="text-lg">Seconds</p>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-end">
                                            <div className="flex justify-end">
                                                <Button
                                                    className="text-[22px] gold  font-Circular-Medium mt-8  min-w-full text-black1 rounded-[3.125rem] flex items-center gap-2"
                                                    onClick={() => handleButtonClick(buttonText)}
                                                    disabled={handleDisabled(buttonText, listing?.nft?.owner)}>
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 17 17"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-[1.4rem] h-[1.4rem]">
                                                        <path
                                                            d="M1.67157 2.24512C1.42219 2.24512 1.18266 2.24512 0.943601 2.24512C0.435476 2.24184 0.0567257 1.87809 0.0586007 1.39715C0.0604757 0.916211 0.439226 0.559492 0.949226 0.557617C1.4236 0.557617 1.89813 0.557617 2.37282 0.557617C2.85563 0.557617 3.19313 0.861836 3.25548 1.33715C3.32391 1.8598 3.3961 2.38152 3.46829 2.90371C3.54048 3.4259 3.61266 3.94715 3.6886 4.49746H15.6708C15.7468 4.49416 15.8229 4.49651 15.8986 4.50449C16.2375 4.55699 16.4358 4.87246 16.3477 5.2273C15.9073 6.99918 15.4658 8.77043 15.023 10.5411C14.9452 10.8532 14.8688 11.1659 14.7886 11.4786C14.6452 12.0411 14.2214 12.3753 13.6416 12.3757C10.4191 12.3757 7.19657 12.3757 3.97407 12.3757C3.36751 12.3757 2.91235 12.0036 2.82657 11.4036C2.69907 10.5129 2.59735 9.61527 2.48532 8.72043C2.3272 7.45387 2.16969 6.18715 2.01282 4.92027C1.91251 4.11809 1.81204 3.31637 1.71141 2.51512C1.70204 2.42699 1.68563 2.34355 1.67157 2.24512Z"
                                                            fill="black"
                                                        />
                                                        <path
                                                            d="M5.12391 13.4998C5.45767 13.4998 5.78393 13.5988 6.06144 13.7842C6.33895 13.9696 6.55523 14.2332 6.68296 14.5415C6.81068 14.8499 6.8441 15.1892 6.77899 15.5165C6.71388 15.8439 6.55316 16.1445 6.31716 16.3805C6.08115 16.6165 5.78047 16.7773 5.45313 16.8424C5.12578 16.9075 4.78648 16.8741 4.47813 16.7464C4.16978 16.6186 3.90623 16.4023 3.72081 16.1248C3.53538 15.8473 3.43641 15.5211 3.43641 15.1873C3.4374 14.7401 3.61551 14.3114 3.93176 13.9952C4.24802 13.6789 4.67666 13.5008 5.12391 13.4998Z"
                                                            fill="black"
                                                        />
                                                        <path
                                                            d="M11.8669 13.4998C12.2007 13.4984 12.5274 13.5961 12.8057 13.7804C13.084 13.9647 13.3014 14.2274 13.4303 14.5352C13.5593 14.8431 13.5941 15.1823 13.5303 15.51C13.4664 15.8376 13.3069 16.1389 13.0718 16.3759C12.8367 16.6128 12.5366 16.7747 12.2094 16.8411C11.8823 16.9075 11.5428 16.8753 11.234 16.7488C10.9251 16.6222 10.6607 16.4068 10.4743 16.13C10.2878 15.8531 10.1876 15.5272 10.1864 15.1934C10.1859 14.7463 10.3624 14.3173 10.6773 13.9999C10.9921 13.6826 11.4198 13.5028 11.8669 13.4998Z"
                                                            fill="black"
                                                        />
                                                    </svg>
                                                    {buttonText}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* {!isEmpty(listing?.nft?.properties) && ( */}
                                    <div className="mt-10">
                                        <ToggleDisclosure
                                            heading="Properties"
                                            propertyicon
                                            charityDetail="p-5  border border-[#7D7D8E]"
                                            close={false}>
                                            <div className="grid grid-cols-3 mt-0 gap-x-6 gap-y-7">
                                                {!isEmpty(listing?.nft?.attributes) ? (
                                                    listing?.nft?.attributes.map((property: any, i: number) => {
                                                        const propertyValues: any = Object.values(property);

                                                        return (
                                                            <div
                                                                key={i}
                                                                className="border border-1 border-themecolor flex items-center justify-center relative flex-col rounded-[16px] py-4  mb-5">
                                                                <span className="block text-themecolor xs:text-[10px] px-[10px] braek uppercase font-Proxima-SemiBold text-base">
                                                                    {propertyValues.length > 0 && propertyValues[0]}
                                                                </span>
                                                                <h3 className="text-white text-lg xs:text-xs font-Proxima-Regular braek  px-[10px]">
                                                                    {propertyValues.length > 0 && propertyValues[1]}
                                                                </h3>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center w-full col-span-full">
                                                        <svg
                                                            width="38"
                                                            height="42"
                                                            viewBox="0 0 38 42"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M21.3326 0C12.4659 0 5.46589 7 4.99922 15.6333L0.565888 21.4667C0.0992214 22.1667 0.565888 23.3333 1.49922 23.3333H4.99922V30.3333C4.99922 32.9 7.09922 35 9.66589 35H11.9992V42H28.3326V31.0333C33.9326 28.4667 37.6659 22.8667 37.6659 16.3333C37.6659 7.23333 30.4326 0 21.3326 0ZM25.9992 14L18.7659 28L20.1659 18.6667H15.4992L20.1659 7H25.9992L22.4992 14H25.9992Z"
                                                                fill="#89898F"
                                                            />
                                                        </svg>
                                                        <span className="text-base block mt-[14px]">
                                                            No Properties yet.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </ToggleDisclosure>
                                    </div>
                                    {/* )} */}
                                    {listing?.sellMode === '1' && (
                                        <div className="mt-4">
                                            <ToggleDisclosure
                                                heading="Bids"
                                                bidsicon
                                                charityDetail="p-5  border border-[#7D7D8E]"
                                                close={false}>
                                                {!isEmpty(bids) ? (
                                                    bids.map((item: any, i: number) => (
                                                        <div className="flex items-center mb-3 " key={i}>
                                                            <Link
                                                                legacyBehavior
                                                                href={`/profile/${item?.bidder?.userName}`}>
                                                                <a>
                                                                    <div className="flex items-center gap-2 ">
                                                                        <figure className="flex-shrink-0  overflow-hidden h-[40px]  relative w-[40px] ">
                                                                            {item?.bidder?.avatar ? (
                                                                                <ImageComponent
                                                                                    className="rounded-full"
                                                                                    src={item?.bidder?.avatar}
                                                                                    alt=""
                                                                                    objectFit="cover"
                                                                                    layout="fill"
                                                                                    transformation={
                                                                                        TRANSFORMATION_NAMES.fit_50x50
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    <p className="w-[40px] h-[40px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                                        {item?.bidder?.firstName
                                                                                            ?.charAt(0)
                                                                                            .toUpperCase()}
                                                                                    </p>
                                                                                </>
                                                                            )}
                                                                        </figure>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                            <div className="flex flex-col w-full pt-2 pl-4">
                                                                <h3 className="text-[#FFFFFF] flex items-center text-base ">
                                                                    {Number(
                                                                        Number(item.price).toFixed(4)
                                                                    ).toLocaleString()}{' '}
                                                                    <i className=" leading-[0]  mx-2 ">
                                                                        {item?.currency == 'LOOBR' ? (
                                                                            <Image
                                                                                src={'/assets/images/loobricon.svg'}
                                                                                width="25"
                                                                                height="25"
                                                                                alt=""
                                                                            />
                                                                        ) : (
                                                                            item?.currency
                                                                        )}
                                                                    </i>{' '}
                                                                    <span className="text-[#A1A1A5] mr-1"> By </span>@
                                                                    {item?.bidder?.userName}
                                                                    {item?.bidder?.isVerfied && (
                                                                        <span className="   ml-1.5     ">
                                                                            <svg
                                                                                width="20"
                                                                                height="20"
                                                                                viewBox="0 0 38 38"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    d="M12.8779 34.3936C11.4304 31.9477 9.03069 30.2142 6.25391 29.6083V29.6083C5.85807 29.5292 5.54141 29.3244 5.30391 28.994C5.06641 28.6647 4.97405 28.3021 5.02682 27.9062V27.9062C5.30473 25.0514 4.37877 22.191 2.49349 20.0292V20.0292C2.2296 19.7389 2.09766 19.3958 2.09766 19C2.09766 18.6042 2.2296 18.2611 2.49349 17.9708V17.9708C4.37877 15.809 5.30473 12.9486 5.02682 10.0938V10.0938C4.97405 9.69792 5.06641 9.33533 5.30391 9.006C5.54141 8.67561 5.85807 8.47083 6.25391 8.39167V8.39167C9.03069 7.78582 11.4304 6.05228 12.8779 3.60642L12.9039 3.5625C13.115 3.21945 13.4053 2.99514 13.7747 2.88958C14.1442 2.78403 14.5136 2.79722 14.8831 2.92917V2.92917C17.5146 4.04251 20.4849 4.04251 23.1164 2.92917V2.92917C23.4859 2.79722 23.8553 2.78403 24.2247 2.88958C24.5942 2.99514 24.8845 3.21945 25.0956 3.5625L25.1216 3.60642C26.5691 6.05228 28.9688 7.78582 31.7456 8.39167V8.39167C32.1414 8.47083 32.4581 8.67561 32.6956 9.006C32.9331 9.33533 33.0254 9.69792 32.9727 10.0938V10.0938C32.6947 12.9486 33.6207 15.809 35.506 17.9708V17.9708C35.7699 18.2611 35.9018 18.6042 35.9018 19C35.9018 19.3958 35.7699 19.7389 35.506 20.0292V20.0292C33.6207 22.191 32.6947 25.0514 32.9727 27.9062V27.9062C33.0254 28.3021 32.9331 28.6647 32.6956 28.994C32.4581 29.3244 32.1414 29.5292 31.7456 29.6083V29.6083C28.9688 30.2142 26.5691 31.9477 25.1216 34.3936L25.0956 34.4375C24.8845 34.7806 24.5942 35.0049 24.2247 35.1104C23.8553 35.216 23.4859 35.2028 23.1164 35.0708V35.0708C20.4849 33.9575 17.5146 33.9575 14.8831 35.0708V35.0708C14.5136 35.2028 14.1442 35.216 13.7747 35.1104C13.4053 35.0049 13.115 34.7806 12.9039 34.4375L12.8779 34.3936Z"
                                                                                    fill="#64C3FD"
                                                                                />
                                                                                <path
                                                                                    d="M24.6684 14.3826C24.9276 14.1345 25.2725 13.9973 25.6304 14C25.9883 14.0028 26.3311 14.1452 26.5865 14.3972C26.842 14.6492 26.9901 14.9911 26.9995 15.3508C27.009 15.7105 26.8791 16.0598 26.6372 16.3251L19.2954 25.5565C19.1691 25.6933 19.0167 25.803 18.8474 25.8791C18.678 25.9553 18.4951 25.9963 18.3095 25.9998C18.124 26.0032 17.9397 25.969 17.7676 25.8992C17.5956 25.8294 17.4393 25.7255 17.3081 25.5935L12.4392 20.6985C12.3037 20.5714 12.1949 20.4183 12.1195 20.2481C12.044 20.0779 12.0035 19.8941 12.0002 19.7078C11.9969 19.5215 12.031 19.3365 12.1004 19.1637C12.1699 18.9909 12.2732 18.834 12.4042 18.7022C12.5353 18.5705 12.6914 18.4666 12.8632 18.3968C13.035 18.3271 13.2191 18.2928 13.4044 18.2961C13.5897 18.2994 13.7724 18.3401 13.9417 18.416C14.111 18.4918 14.2634 18.6011 14.3897 18.7375L18.2428 22.6095L24.6334 14.4233C24.6449 14.409 24.6572 14.3955 24.6702 14.3826H24.6684Z"
                                                                                    fill="#14141F"
                                                                                />
                                                                                <defs>
                                                                                    <linearGradient
                                                                                        id="paint0_linear_1971_6534"
                                                                                        x1="2.09766"
                                                                                        y1="2.81921"
                                                                                        x2="38.6017"
                                                                                        y2="6.22261"
                                                                                        gradientUnits="userSpaceOnUse">
                                                                                        <stop stopColor="#AA601B" />
                                                                                        <stop
                                                                                            offset="0.484375"
                                                                                            stopColor="#ECDB88"
                                                                                        />
                                                                                        <stop
                                                                                            offset="0.994792"
                                                                                            stopColor="#AA601B"
                                                                                        />
                                                                                    </linearGradient>
                                                                                </defs>
                                                                            </svg>
                                                                        </span>
                                                                    )}
                                                                </h3>
                                                                <span className="block text-sm text-[#A1A1A5] ">
                                                                    {moment(item.createdAt).fromNow()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center w-full">
                                                        <svg
                                                            width="38"
                                                            height="42"
                                                            viewBox="0 0 38 42"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M21.3326 0C12.4659 0 5.46589 7 4.99922 15.6333L0.565888 21.4667C0.0992214 22.1667 0.565888 23.3333 1.49922 23.3333H4.99922V30.3333C4.99922 32.9 7.09922 35 9.66589 35H11.9992V42H28.3326V31.0333C33.9326 28.4667 37.6659 22.8667 37.6659 16.3333C37.6659 7.23333 30.4326 0 21.3326 0ZM25.9992 14L18.7659 28L20.1659 18.6667H15.4992L20.1659 7H25.9992L22.4992 14H25.9992Z"
                                                                fill="#89898F"
                                                            />
                                                        </svg>
                                                        <span className="text-base block mt-[14px]">
                                                            No active bids yet.
                                                        </span>
                                                    </div>
                                                )}
                                            </ToggleDisclosure>
                                        </div>
                                    )}
                                    <div className="mt-4">
                                        <ToggleDisclosure
                                            heading="History"
                                            historyicon
                                            charityDetail="p-5  border border-[#7D7D8E]"
                                            close={false}>
                                            {!isEmpty(history) ? (
                                                history.map((item: any, i: number) => (
                                                    <div className="flex items-center mb-3 " key={i}>
                                                        <Link legacyBehavior href={`/profile/${item?.user?.userName}`}>
                                                            <a>
                                                                <div className="flex items-center gap-2 ">
                                                                    <figure className="flex-shrink-0 relative h-[40px] w-[40px]">
                                                                        {item?.user?.avatar ? (
                                                                            <ImageComponent
                                                                                className="rounded-full"
                                                                                src={item?.user?.avatar}
                                                                                alt=""
                                                                                objectFit="cover"
                                                                                layout="fill"
                                                                                transformation={
                                                                                    TRANSFORMATION_NAMES.fit_50x50
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <p className="w-[40px] h-[40px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                                    {item?.user?.firstName
                                                                                        ?.charAt(0)
                                                                                        .toUpperCase()}
                                                                                </p>
                                                                            </>
                                                                        )}
                                                                    </figure>
                                                                </div>
                                                            </a>
                                                        </Link>
                                                        <div className="flex flex-col w-full pt-2 pl-4">
                                                            <h3 className="text-[#FFFFFF] flex items-center text-base braek">
                                                                {Number(Number(item.price).toFixed(4)).toLocaleString()}{' '}
                                                                <i className=" leading-[0]  mx-2 ">
                                                                    {item?.currency == 'LOOBR' ? (
                                                                        <Image
                                                                            src={'/assets/images/loobricon.svg'}
                                                                            width="25"
                                                                            height="25"
                                                                        />
                                                                    ) : (
                                                                        item?.currency
                                                                    )}
                                                                    {/* {blockchain?.native
                                                                        ? blockchain?.nativeCurrency
                                                                        : blockchain?.tokenSymbol} */}
                                                                </i>{' '}
                                                                <span className="text-[#A1A1A5] mr-1 "> By </span> @
                                                                {item.user?.userName}
                                                                {item.user.isVerfied && (
                                                                    <svg
                                                                        className="ml-1.5"
                                                                        width="20"
                                                                        height="20"
                                                                        viewBox="0 0 38 38"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M12.8779 34.3936C11.4304 31.9477 9.03069 30.2142 6.25391 29.6083V29.6083C5.85807 29.5292 5.54141 29.3244 5.30391 28.994C5.06641 28.6647 4.97405 28.3021 5.02682 27.9062V27.9062C5.30473 25.0514 4.37877 22.191 2.49349 20.0292V20.0292C2.2296 19.7389 2.09766 19.3958 2.09766 19C2.09766 18.6042 2.2296 18.2611 2.49349 17.9708V17.9708C4.37877 15.809 5.30473 12.9486 5.02682 10.0938V10.0938C4.97405 9.69792 5.06641 9.33533 5.30391 9.006C5.54141 8.67561 5.85807 8.47083 6.25391 8.39167V8.39167C9.03069 7.78582 11.4304 6.05228 12.8779 3.60642L12.9039 3.5625C13.115 3.21945 13.4053 2.99514 13.7747 2.88958C14.1442 2.78403 14.5136 2.79722 14.8831 2.92917V2.92917C17.5146 4.04251 20.4849 4.04251 23.1164 2.92917V2.92917C23.4859 2.79722 23.8553 2.78403 24.2247 2.88958C24.5942 2.99514 24.8845 3.21945 25.0956 3.5625L25.1216 3.60642C26.5691 6.05228 28.9688 7.78582 31.7456 8.39167V8.39167C32.1414 8.47083 32.4581 8.67561 32.6956 9.006C32.9331 9.33533 33.0254 9.69792 32.9727 10.0938V10.0938C32.6947 12.9486 33.6207 15.809 35.506 17.9708V17.9708C35.7699 18.2611 35.9018 18.6042 35.9018 19C35.9018 19.3958 35.7699 19.7389 35.506 20.0292V20.0292C33.6207 22.191 32.6947 25.0514 32.9727 27.9062V27.9062C33.0254 28.3021 32.9331 28.6647 32.6956 28.994C32.4581 29.3244 32.1414 29.5292 31.7456 29.6083V29.6083C28.9688 30.2142 26.5691 31.9477 25.1216 34.3936L25.0956 34.4375C24.8845 34.7806 24.5942 35.0049 24.2247 35.1104C23.8553 35.216 23.4859 35.2028 23.1164 35.0708V35.0708C20.4849 33.9575 17.5146 33.9575 14.8831 35.0708V35.0708C14.5136 35.2028 14.1442 35.216 13.7747 35.1104C13.4053 35.0049 13.115 34.7806 12.9039 34.4375L12.8779 34.3936Z"
                                                                            fill="#64C3FD"
                                                                        />
                                                                        <path
                                                                            d="M24.6684 14.3826C24.9276 14.1345 25.2725 13.9973 25.6304 14C25.9883 14.0028 26.3311 14.1452 26.5865 14.3972C26.842 14.6492 26.9901 14.9911 26.9995 15.3508C27.009 15.7105 26.8791 16.0598 26.6372 16.3251L19.2954 25.5565C19.1691 25.6933 19.0167 25.803 18.8474 25.8791C18.678 25.9553 18.4951 25.9963 18.3095 25.9998C18.124 26.0032 17.9397 25.969 17.7676 25.8992C17.5956 25.8294 17.4393 25.7255 17.3081 25.5935L12.4392 20.6985C12.3037 20.5714 12.1949 20.4183 12.1195 20.2481C12.044 20.0779 12.0035 19.8941 12.0002 19.7078C11.9969 19.5215 12.031 19.3365 12.1004 19.1637C12.1699 18.9909 12.2732 18.834 12.4042 18.7022C12.5353 18.5705 12.6914 18.4666 12.8632 18.3968C13.035 18.3271 13.2191 18.2928 13.4044 18.2961C13.5897 18.2994 13.7724 18.3401 13.9417 18.416C14.111 18.4918 14.2634 18.6011 14.3897 18.7375L18.2428 22.6095L24.6334 14.4233C24.6449 14.409 24.6572 14.3955 24.6702 14.3826H24.6684Z"
                                                                            fill="#14141F"
                                                                        />
                                                                        <defs>
                                                                            <linearGradient
                                                                                id="paint0_linear_1971_6534"
                                                                                x1="2.09766"
                                                                                y1="2.81921"
                                                                                x2="38.6017"
                                                                                y2="6.22261"
                                                                                gradientUnits="userSpaceOnUse">
                                                                                <stop stopColor="#AA601B" />
                                                                                <stop
                                                                                    offset="0.484375"
                                                                                    stopColor="#ECDB88"
                                                                                />
                                                                                <stop
                                                                                    offset="0.994792"
                                                                                    stopColor="#AA601B"
                                                                                />
                                                                            </linearGradient>
                                                                        </defs>
                                                                    </svg>
                                                                )}
                                                            </h3>
                                                            <span className="block text-sm text-[#A1A1A5] ">
                                                                {moment(item.createdAt).fromNow()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <svg
                                                        width="38"
                                                        height="42"
                                                        viewBox="0 0 38 42"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M21.3326 0C12.4659 0 5.46589 7 4.99922 15.6333L0.565888 21.4667C0.0992214 22.1667 0.565888 23.3333 1.49922 23.3333H4.99922V30.3333C4.99922 32.9 7.09922 35 9.66589 35H11.9992V42H28.3326V31.0333C33.9326 28.4667 37.6659 22.8667 37.6659 16.3333C37.6659 7.23333 30.4326 0 21.3326 0ZM25.9992 14L18.7659 28L20.1659 18.6667H15.4992L20.1659 7H25.9992L22.4992 14H25.9992Z"
                                                            fill="#89898F"
                                                        />
                                                    </svg>
                                                    <span className="text-base block mt-[14px]">No history yet.</span>
                                                </div>
                                            )}
                                        </ToggleDisclosure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!(listingsLoading || loading) && !isEmpty(listings) && (
                    <>
                        <h2 className="mb-8 text-[#FFFFFF]">Related NFTs</h2>
                        <div className="grid gap-8 mt-8 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                            {listings?.map((item: any, i: number) => (
                                <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                            ))}
                        </div>
                    </>
                )}
                {state && (
                    <Popups
                        setConfirmed={setConfirmed}
                        show={popup}
                        hide={setPopup}
                        state={state}
                        setstate={setState}
                        type="nft"
                        data={
                            // state == 31 || 26 || 38
                            state == 31
                                ? data
                                : {
                                      ...data,
                                      hash: txHash,
                                      tokenId: listing?.tokenId,
                                      ...listing,
                                      loading: placeBidLoading,
                                      listingId: listing?.listingId,
                                      setTxHash: setTxHash,
                                      switchNetwork: handleOnSwitchNetwork,
                                      contractAddress: listing?.nft?.contractAddress,
                                      chainId
                                  }
                        }
                    />
                )}
            </div>
        </>
    );
};

export default NftListingDetailModule;
