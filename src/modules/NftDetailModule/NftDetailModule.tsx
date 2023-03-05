import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Button from '../../components/Button/Button';
import Link from 'next/link';
import Popups from '../../components/popup/poups';
import { useRouter, withRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { buyNFT, getNftByTokenId, getUserByWalletAddress, unlistNft } from '../../redux/nft/actions';
import { isEmpty, isObject } from 'validate.js';
import Notfound from '../../components/notfound/notfound';
import useMetaMask from '../../hooks/useMetaMask';
import Blockchains from '../../components/maincard/components/Blockchains';
import Webgl from '../../components/Webgl';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import {
    fetchImage,
    getMarketDetailsByAddress,
    getMarketDetailsByAddressAndCurrency,
    getMarketDetailsByNFTAddress,
    NftContentType,
    slicedAddress
} from '../../utils/functions';
// import blockchains from '../../contractsData/blockchains';
import useAudio from '../../hooks/useAudio';
import { METAMASK_POPUP } from '../../constants/enums';
import contracts from '../../contractsData/contracts-details';
import detailContentView from './detailContentView';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import ImageComponent from '../../components/Image/ImageComponent';
import { isArray } from 'lodash';
import ToggleDisclosure from '../MarketPlaceModule/component/ToggleDisclosure';
import { marketPlaceService } from '../../services/marketplace.service';
import moment from 'moment';
import { offerService } from '../../services/offers.service';
import blockchains from '../../contractsData/blockchains';
import ProofAuth from '../NftListingDetailModule/components/ProofAuth';
import Comments from '../NftListingDetailModule/components/Comments';
import { LikeComponent } from '../../components/Like/LikeComponent';
import CommentCount from '../../components/maincard/components/CommentCount';
import { homeService } from '../../services/home.service';

const NftDetailModule = ({ data }: any) => {
    const { switchNetwork, library }: any = useMetaMask();
    const [star, setStar] = useState(false);

    const { chainId } = useWeb3React();
    const router = useRouter();
    const { tokenId, contract, chain } = router.query;
    const [playing, play] = useAudio('/LOOBR_PURCHASE_NFT_SUCCESSFUL.mp3');

    const { isInstalled, isActive, account }: any = useMetaMask();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [txHash, setTxHash] = useState('');
    const [like, setLike] = useState(false);
    const [preview, setPreview] = useState('');
    const [popupData, setpopupData] = useState<any>(null);
    const [offer, setOffer] = useState('');
    const [btonText, setBtonText] = useState<string>('');
    const [history, setHistory] = useState<any[]>([]);
    const [offers, setOffers] = useState<any>(null);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    // const [data, setData] = useState<any>('');

    const dispatch = useDispatch();

    // const data: any = useSelector((state: any) => state.nft.nft);
    const loading = useSelector((state: any) => state.nft.nftLoading);
    const placeBidLoading = useSelector((state: any) => state.nft.placeBidLoading);

    const nft = data?.nft;
    const collection = nft?.collection || nft?.collectionId;
    // const collection = nft?.collection;

    const listing = data?.listing;
    const blockchain = useMemo(
        () => contracts.find((item) => item.chain == nft?.chain && item?.nftAddress === nft?.contractAddress),
        [listing, nft]
    );
    const blockchain1 = useMemo(() => contracts.find((item) => item.chain == nft?.chain), [listing, nft]);
    console.log(blockchain, 'blockchain');

    const [action, setAction] = useState(listing?.sellMode === '1' ? 'bid' : 'buy');

    const owner = useSelector((state: any) => state.nft.owner);
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        tokenId && dispatch(getNftByTokenId(tokenId, { contract, chain }));
        tokenId && fetchTokenHistory(tokenId, { contract, chain });
    }, [tokenId]);

    useEffect(() => {
        if (nft) {
            try {
                const isLiked = nft?.like?.filter((el: any) => el.toString() === user.userId).length > 0;
                setLike(isLiked);
                dispatch(getUserByWalletAddress(nft?.owner));
                nft?.preview && setPreview(nft?.preview);
                nft && user && fetchOffers(nft);
                console.log({ nft });
                // nft?._id && homeService.viewMarketPlace(nft?._id);
            } catch (error) {
                // console.log(error);
            }
        }
    }, [nft]);

    const fetchOffers = async (nft: any) => {
        try {
            const res = await offerService.getAllOffersByNFTId(nft?.tokenId, {
                chain: nft?.chain,
                contract: nft?.contractAddress
            });
            setOffers(res?.data?.data);
        } catch (error) {
            console.log(error);
            setOffers(null);
        }
    };

    const fetchTokenHistory = async (tokenId: any, params: any) => {
        try {
            const res = await marketPlaceService.getTokenHistory(tokenId, params);
            let arr = !isEmpty(res.data?.data) ? res.data?.data?.filter((item: any) => item?.value !== '0') : [];
            if (isEmpty(arr)) {
                arr = res.data?.data?.slice(0, 2);
            }
            console.log(arr);

            setHistory(arr);
        } catch (error) {
            setHistory([]);
            console.log(error);
        }
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
                blockchain?.tokenAddress || '',
                blockchain?.native == undefined ? true : blockchain?.native
            )
        );
    };

    const handleBidding = () => {
        setAction('bid');
        setPopup(true);
        setState(13);
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
        const contracts = getMarketDetailsByNFTAddress(contractAddress);
        const chain = contracts ? contracts?.chainId : undefined;

        if (!contracts) {
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

    const handleSubmit = async () => {
        if (!checkMetamask()) {
            return;
        }
        const chain = blockchains.find((item) => item?.symbol == nft?.chain);
        console.log(chain, 'chain');

        const status = await switchNetwork(chain?.chainId);
        // const status = await switchNetwork(nft?.chainId);

        if (!status) {
            return;
        }
        setPopup(true);
        setState(24);
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

    const handleButtonClick = async (btn: string) => {
        setBtonText(btn);

        if (!checkMetamask()) {
            return;
        }

        const chain = blockchains.find((item) => item?.symbol == nft?.chain);
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
        } else if (btn === 'Make Offer') {
            setPopup(true);
            setState(88);
        } else {
            setPopup(true);
            setState(7);
        }
    };

    const handleDisabled = (btn: string, owner: string) => {
        if (
            (btn === 'Buy Now' && owner === '0xfAa65EC7A612A980A968Aeb10dDFd0739d9E38B9') ||
            (btn === 'Place a bid' && owner === '0xfAa65EC7A612A980A968Aeb10dDFd0739d9E38B9') ||
            btn == 'Not For Sale'
        ) {
            return true;
        } else {
            return false;
        }
    };

    const marketplace = contracts?.filter((item) => item?.chain === nft?.chain).map((item) => item?.marketAddress);
    const buttonText = useMemo(
        () =>
            nft && listing && account
                ? listing?.sender === account
                    ? 'Unlist'
                    : listing?.sellMode === '1'
                    ? 'Place a bid'
                    : 'Buy Now'
                : nft?.owner && marketplace.includes(nft?.owner)
                ? 'Buy Now'
                : account && nft?.owner?.toUpperCase() == account?.toUpperCase()
                ? 'List on Marketplace'
                : nft && !listing
                ? account && nft?.owner?.toUpperCase() == account?.toUpperCase()
                    ? 'List on Marketplace'
                    : 'Make Offer'
                : 'Buy Now',
        [account, listing, nft]
    );

    return (
        <div className="container pb-[7.5rem] pt-[7.5rem] min-h-[1050px]   ">
            {loading ? (
                <div className="flex justify-center">
                    <figure className="mt-12">
                        <div className="loadingio-spinner-rolling-jz7efhw30v">
                            <div className="ldio-fcd0x3izul5">
                                <div></div>
                            </div>
                        </div>
                    </figure>
                </div>
            ) : isEmpty(nft) ? (
                <Notfound />
            ) : (
                <div className="">
                    {/* {console.log(nft, 'nft')} */}
                    <div className="lg:flex lg:gap-20  xl:gap-[7.313rem] mb-[7.5rem]  ">
                        <div className="order-2 w-full lg:order-1 ">
                            <figure className="order-2 table w-full  mx-auto overflow-hidden rounded-xl lg:order-1">
                                {detailContentView(nft, {
                                    layout: 'fill',
                                    figClassName: ` w-full h-[48.813rem] relative vimeo-video-container `
                                })}
                            </figure>
                            <div className="items-center justify-between block mt-4 md:flex  xl:flex">
                                <ProofAuth
                                    transactionHash={nft?.transactionHash}
                                    image={nft?.image}
                                    chain={nft?.chain}
                                    marketAddress={nft?.contractAddress}
                                />
                                <div className={`flex justify-end  gap-5 xl:gap-3 2xl:gap-5 md:mt-0 lg:mt-6 xl:mt-0`}>
                                    <div className="">
                                        <LikeComponent
                                            nft={{ nft: nft }}
                                            className="flex items-center "
                                            showCount={true}
                                            // feeduser={listing?.owner}
                                            size={undefined}
                                        />
                                    </div>
                                    <CommentCount
                                        nft={nft}
                                        disabled={true}
                                        showLoginPopup={user ? false : true}
                                        size={undefined}
                                    />

                                    <div
                                        className={`cursor-pointer flex items-center`}
                                        onClick={() => {
                                            const url = new URL(`${process.env.NEXT_PUBLIC_URL}/nft/${nft.tokenId}`);
                                            const params = new URLSearchParams(url.search);
                                            params.append('contract', nft?.contractAddress);
                                            params.append('chain', nft?.chain);
                                            url.search = params.toString();

                                            setpopupData(url.href);
                                            setPopup(true);
                                            setState(31);
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

                                        <p className=" text-white font-Proxima-SemiBold text-[14px] ml-1  ">Share</p>
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
                                            {nft?.views?.length > 0 ? nft?.views?.length + 1 : 1} Views
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* {user?.userId && ( */}
                            <div className="mt-6">
                                <Comments nft={nft} /* setConfirm={setConfirmed} */ />
                            </div>
                            {/* )} */}
                        </div>
                        <div className="flex order-1  mb-6 sm:justify-between lg:order-2 lg:mt-0">
                            <div className="w-full ">
                                <div className="flex items-center justify-between ">
                                    {owner ? (
                                        // eslint-disable-next-line @next/next/link-passhref
                                        <Link legacyBehavior href={`/profile/${owner?.user?.userName}`}>
                                            <a>
                                                <div className="flex items-center gap-3 ">
                                                    <figure className="  h-[56px] w-[56px] relative overflow-hidden">
                                                        {owner && owner?.user?.avatar ? (
                                                            <ImageComponent
                                                                className="rounded-full "
                                                                src={owner?.user?.avatar}
                                                                defaultPlaceholder={
                                                                    '/assets/images/collectionimages/placeholder.png'
                                                                }
                                                                alt=""
                                                                // height={56}
                                                                // width={56}
                                                                objectFit="cover"
                                                                layout="fill"
                                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                            />
                                                        ) : (
                                                            <>
                                                                {owner && (
                                                                    <p className="w-[56px] h-[56px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                        {owner?.user?.firstName.charAt(0).toUpperCase()}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </figure>
                                                    <div className="truncate">
                                                        <div className=" flex gap-1.5 items-center ">
                                                            <h3 className="text-[#FFFFFF] border-b border-transparent hover:border-white   text-sm max-w-[7.5rem]  truncate ">
                                                                @{owner && owner?.user?.userName}{' '}
                                                            </h3>
                                                            {owner?.user?.isVerfied && (
                                                                <svg
                                                                    className="flex-shrink-0"
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
                                                        <p className="#A1A1A5">Owner</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 ">
                                            <figure className="flex-shrink-0">
                                                <p className="w-[32px] h-[32px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-base font-Proxima-SemiBold"></p>
                                            </figure>
                                            <div>
                                                <div className="flex ">
                                                    <h3 className="text-[#FFFFFF] flex gap-1.5 text-base ">
                                                        {slicedAddress(nft?.owner)}
                                                    </h3>
                                                </div>
                                                <p className="#A1A1A5">Owner</p>
                                            </div>
                                        </div>
                                    )}
                                    {nft?.owner == account && (
                                        <div className="flex gap-3 ">
                                            <button
                                                className="w-[40px] h-[40px] rounded-[6px] bg-[#494958] flex items-center justify-center"
                                                type="button"
                                                onClick={() => {
                                                    setPopup(true);
                                                    setState(63);
                                                }}>
                                                <svg
                                                    width="20"
                                                    height="28"
                                                    viewBox="0 0 20 28"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M10 0C4.15104 5.53984 0 12.0805 0 16.4336C0 23.2422 4.11458 28 10 28C15.8854 28 20 23.2422 20 16.4336C20 12.0641 15.8229 5.51797 10 0ZM10 24.5C7.05729 24.5 5 22.3672 5 19.3156C5 18.5773 5.23958 15.9523 10 10.5C14.7604 15.9523 15 18.5773 15 19.3156C15 22.3672 12.9427 24.5 10 24.5Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="w-[40px] h-[40px] rounded-[6px] bg-[#494958] flex items-center justify-center"
                                                type="button"
                                                onClick={() => {
                                                    setPopup(true);
                                                    setState(61);
                                                }}>
                                                <svg
                                                    width="28"
                                                    height="24"
                                                    viewBox="0 0 28 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M2.33398 17.8327H25.6673M5.83398 2.66602L2.33398 6.16602L5.83398 9.66602V2.66602ZM22.1673 14.3327L25.6673 17.8327L22.1673 21.3327V14.3327ZM2.33398 6.16602H25.6673H2.33398Z"
                                                        stroke="white"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <h2 className="my-6 text-[#FFFFFF] ">{nft?.name}</h2>
                                <div className="Atdetaillogos ">
                                    <Blockchains blockchain={nft?.chain} />
                                </div>

                                <div className="mb-8 space-x-4 ">
                                    {nft?.categories?.map((item: any, key: number) => (
                                        <Button
                                            key={key}
                                            className="py-[6px] px-3  mt-6 bg-[#2B2B35] !text-[#FFFFFF]  text-sm">
                                            {item}
                                        </Button>
                                    ))}
                                </div>
                                <p className="lg:w-[44.875rem] text-base leading-6  text-lightgray  font-Circular-Book mb-10">
                                    Token ID: {tokenId}
                                </p>
                                <p className="lg:w-[44.875rem] text-base leading-6  text-lightgray  font-Circular-Book mb-10">
                                    {nft?.description}
                                </p>

                                {/* Collection Section Start */}

                                {collection && collection?.address && (
                                    <div className="my-5 ">
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
                                                    <figure className="flex-shrink-0 h-[40px] w-[40px] relative overflow-hidden">
                                                        {collection?.logoPicture ? (
                                                            <ImageComponent
                                                                className="rounded-full"
                                                                src={collection?.logoPicture}
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
                                                                    {collection?.name?.charAt(0).toUpperCase()}
                                                                </p>
                                                            </>
                                                        )}
                                                    </figure>
                                                    <div className="w-full truncate cursor-pointer">
                                                        <h3 className="text-[#FFFFFF]  braek  text-sm flex gap-2 items-center ">
                                                            {collection?.name}
                                                        </h3>
                                                        {/* <span className=" ">
                                                        <i
                                                    onClick={() => setStar(!star)}
                                                    className={` hidden ${
                                                        star ? 'text-themecolor icon-start' : ' icon-ion_star text-white'
                                                    }   text-lg`}></i>
                                                                </span> */}
                                                        {/* <p className="#A1A1A5 text-xs">Owner</p> */}
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                )}

                                {/* Collection Section End */}

                                <div className="grid grid-cols-3 mt-0 gap-x-7 gap-y-7">
                                    {isArray(nft?.attributes)
                                        ? (isArray(nft?.attributes[0]) ? nft?.attributes[0] : nft?.attributes).map(
                                              (property: any, i: number) => {
                                                  const data: any =
                                                      Object.values(property)?.length > 0
                                                          ? Object.values(property)
                                                          : null;
                                                  return (
                                                      <div
                                                          key={i}
                                                          className="border border-1 border-themecolor flex items-center justify-center relative flex-col rounded-[16px] p-2.5  min-h-[100px] mb-5">
                                                          <span className="block text-themecolor uppercase text-center braek  font-Proxima-SemiBold text-base">
                                                              {data && typeof data[0] !== 'object' ? data[0] : null}
                                                          </span>
                                                          <h3 className="text-white text-lg font-Proxima-Regular braek text-center">
                                                              {data && typeof data[1] !== 'object' ? data[1] : null}
                                                          </h3>
                                                          <p className=" text-[#c7c7c7] text-sm mt-1 font-Proxima-Regular braek text-center">
                                                              {data && typeof data[2] !== 'object' && data[2]
                                                                  ? `${data[2]} have this trait`
                                                                  : null}
                                                          </p>
                                                      </div>
                                                  );
                                              }
                                          )
                                        : [nft?.attributes]?.map((property: any, i: number) => {
                                              const data: any =
                                                  Object.values(property)?.length > 0 ? Object.values(property) : null;
                                              return (
                                                  <div
                                                      key={i}
                                                      className="border border-1 border-themecolor flex items-center justify-center relative flex-col rounded-[16px] min-h-[100px] mb-5">
                                                      <span className="block text-themecolor uppercase braek px-[10px] font-Proxima-SemiBold text-base">
                                                          {data && typeof data[0] !== 'object' ? data[0] : null}
                                                      </span>
                                                      <h3 className="text-white text-lg font-Proxima-Regular braek px-[10px]">
                                                          {data && typeof data[1] !== 'object' ? data[1] : null}
                                                      </h3>
                                                      <h2 className=" text-themecolor text-lg font-Proxima-Regular braek px-[10px]">
                                                          {data && typeof data[2] !== 'object' && data[2]
                                                              ? `$${data[2]} have this trait`
                                                              : null}
                                                      </h2>
                                                  </div>
                                              );
                                          })}
                                </div>

                                <div className="mt-4">
                                    <ToggleDisclosure
                                        heading="Offers"
                                        historyicon
                                        charityDetail="p-5  border border-[#7D7D8E]"
                                        close={false}>
                                        {!isEmpty(offers?.offers) ? (
                                            offers?.offers?.map((item: any, i: number) => (
                                                <div className="flex items-center mb-3 " key={i}>
                                                    <Link legacyBehavior href={`/profile/${item?.sender?.userName}`}>
                                                        <a>
                                                            <div className="flex items-center gap-2 ">
                                                                <figure className="flex-shrink-0  h-[40px] w-[40px] relative overflow-hidden">
                                                                    {item?.sender?.avatar ? (
                                                                        <ImageComponent
                                                                            className="rounded-full"
                                                                            src={item?.sender?.avatar}
                                                                            alt=""
                                                                            objectFit="cover"
                                                                            layout="fill"
                                                                            transformation={
                                                                                TRANSFORMATION_NAMES.fit_50x50
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <p className="w-[3.5rem] h-[3.5rem] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                                {item?.sender?.firstName
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
                                                        <h3 className=" text-[#A1A1A5] flex items-center text-base braek">
                                                            {Number(Number(item.amount).toFixed(4)).toLocaleString()}{' '}
                                                            <i className=" leading-[0]  mx-2 ">
                                                                USDT
                                                                {/* {item?.nft?.currency || item?.chain} */}
                                                            </i>{' '}
                                                            <span className=" mr-1  text-white "> By </span> @
                                                            {item.sender?.userName}
                                                            {item?.sender?.isVerfied && (
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
                                                            {moment(item.updatedAt).fromNow()}
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
                                                <span className="text-base block mt-[14px]">No Offer yet.</span>
                                            </div>
                                        )}
                                    </ToggleDisclosure>
                                </div>

                                <div className="mt-4 ">
                                    <ToggleDisclosure
                                        heading="History"
                                        historyicon
                                        charityDetail="p-5  border border-[#7D7D8E]"
                                        close={false}>
                                        {!isEmpty(history) ? (
                                            history.map((item: any, i: number) => (
                                                <div className="flex items-center mb-3 " key={i}>
                                                    <Link
                                                        legacyBehavior
                                                        href={
                                                            item?.user?.userName
                                                                ? `/profile/${item?.user?.userName}`
                                                                : 'javascript:void(0)'
                                                        }>
                                                        <a>
                                                            <div className="flex items-center gap-2 ">
                                                                <figure className="flex-shrink-0">
                                                                    <p className="w-[24px] h-[24px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-base font-Proxima-SemiBold"></p>
                                                                </figure>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                    <div className="flex flex-col w-full pt-2 pl-4 ">
                                                        <h3 className="  text-[#A1A1A5] flex items-center   text-base braek">
                                                            {item?.fromAddress ==
                                                            '0x0000000000000000000000000000000000000000' ? (
                                                                <>
                                                                    {slicedAddress(item?.fromAddress)}{' '}
                                                                    <span className=" text-[#FFFFFF] xs4:text-xs ml-1 mr-1">
                                                                        {' '}
                                                                        Minted to
                                                                    </span>
                                                                    {slicedAddress(item?.toAddress)}{' '}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="xs:max-w-[5rem] truncate xs4:text-sm xs4:max-w-[4rem]   ">
                                                                        {slicedAddress(item?.fromAddress)}
                                                                    </span>
                                                                    <span className="  text-white xs4:text-xs   mr-1 ml-1">
                                                                        {' '}
                                                                        Transfered to{' '}
                                                                    </span>
                                                                    <span className="xs:max-w-[5rem] xs4:text-sm  xs4:max-w-[4rem]  truncate">
                                                                        {slicedAddress(item?.toAddress)}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </h3>

                                                        <span className="block text-sm text-[#A1A1A5] ">
                                                            {moment(item?.blockTimestamp).fromNow()}
                                                        </span>
                                                    </div>
                                                    {console.log(item)}
                                                    {Number(item?.value) > 0 && (
                                                        <>
                                                            <h5 className="   xs:w-[8rem] truncate w-[15rem] flex xs:truncate justify-end xs3:text-sm  text-white">
                                                                {Number(
                                                                    Number(Number(item?.value) / 10 ** 36).toFixed(3)
                                                                ).toLocaleString()}{' '}
                                                                ETH
                                                            </h5>
                                                            <Link
                                                                legacyBehavior
                                                                href={`${blockchain1?.blockExplorer}/tx/${item?.transactionHash}`}>
                                                                <a
                                                                    className="flex items-center gap-4 text-white text-xl font-Proxima-Regular pl-[20px] pr-[10px] pt-[14px] pb-[14px]"
                                                                    target="__blank"
                                                                    href={`${blockchain1?.blockExplorer}/tx/${item?.transactionHash}`}>
                                                                    <span className=" cursor-pointer ml-1.5">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M13 3L16.293 6.293L9.29297 13.293L10.707 14.707L17.707 7.707L21 11V3H13Z"
                                                                                fill="#B8B8BC"
                                                                            />
                                                                            <path
                                                                                d="M19 19H5V5H12L10 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21H19C20.103 21 21 20.103 21 19V14L19 12V19Z"
                                                                                fill="#B8B8BC"
                                                                            />
                                                                        </svg>
                                                                    </span>
                                                                </a>
                                                            </Link>
                                                        </>
                                                    )}
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

                                <div>
                                    <Button
                                        className="text-base font-Circular-Medium mt-8 sm:min-w-[21.75rem] min-w-full border-none !text-black bg-[#F1C94A] border ml-3 xs:!ml-0 rounded-[3.125rem] gold"
                                        onClick={() => handleButtonClick(buttonText)}
                                        disabled={handleDisabled(buttonText, listing?.nft?.owner)}>
                                        {
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-[1.4rem] -mt-2 mr-1 h-[1.4rem]">
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
                                        }
                                        {buttonText}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={
                        state == 31
                            ? popupData
                            : {
                                  ...data,
                                  hash: txHash,
                                  collectionId: collection?._id,
                                  tokenId: listing?.tokenId,
                                  ...listing,
                                  ...nft,
                                  loading: placeBidLoading,
                                  listingId: listing?.listingId,
                                  setTxHash: setTxHash,
                                  switchNetwork: handleOnSwitchNetwork,
                                  // contractAddress: listing?.nft?.contractAddress,
                                  chainId,
                                  flow: METAMASK_POPUP.buy,
                                  setOffer,
                                  offer,
                                  setOffers,
                                  offers
                              }
                    }
                />
            )}
        </div>
    );
};

export default withRouter(NftDetailModule);
