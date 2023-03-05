/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Popups from '../popup/poups';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { buyNFT, removeFromMarkete, unlistNft } from '../../redux/nft/actions';
import useMetaMask from '../../hooks/useMetaMask';
import Countdown from 'react-countdown';
import { useRouter } from 'next/router';
import { LikeComponent } from '../Like/LikeComponent';
import CommentCount from './components/CommentCount';
import Blockchains from './components/Blockchains';
import PriceComponent from './components/PriceComponent';
import useAudio from '../../hooks/useAudio';
import { METAMASK_POPUP, TRANSFORMATION_NAMES } from '../../constants/enums';
import Nftdropdown from '../Dropdown/nftdropdown';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import {
    fetchImage,
    getMarketDetailsByAddress,
    getMarketDetailsByNFTAddress,
    NftContentType
} from '../../utils/functions';
import blockchains from '../../contractsData/blockchains';
import Webgl from '../Webgl';
import contracts from '../../contractsData/contracts-details';
import ImageComponent from '../Image/ImageComponent';
import VideoComponent from '../video/videoComponent';
import Verified from '../verified';

interface Iprops {
    listing: any;
    where: string;
    nft: any;
}
const MainCard = ({ listing, where, nft }: Iprops) => {
    const { library, isInstalled, isActive, account, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();
    const [playing, play] = useAudio('/LOOBR_PURCHASE_NFT_SUCCESSFUL.mp3');
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [txHash, setTxHash] = useState('');
    const [offer, setOffer] = useState('');
    const [btonText, setBtonText] = useState<string>('');
    const [action, setAction] = useState(listing?.sellMode === '1' ? 'bid' : 'buy');
    const user = useSelector((state: any) => state.auth.user);
    const openModal = useMemo(() => popup, [popup]);
    const modalState = useMemo(() => state, [state]);

    const [shareLink, setShareLink] = useState<string>('');
    const placeBidLoading = useSelector((state: any) => state.nft.placeBidLoading);
    const buyNftLoading = useSelector((state: any) => state.nft.buyNftLoading);
    const unlistNftLoading = useSelector((state: any) => state.nft.unlistNftLoading);
    const blockchain = useMemo(() => getMarketDetailsByAddress(listing?.to), [nft]);
    const ownerDetails = listing?.ownerDetails || nft?.ownerDetails || listing?.ownerDetail[0];

    // const switchNetwork = () => {
    //     if (btonText === 'Buy Now') {
    //         // handleBuyNft();
    //         setState(-1);
    //     } else if (btonText === 'List on Marketplace') {
    //         setPopup(true);
    //         setState(24);
    //     } else if (btonText === 'Place a bid') {
    //         handleBidding();
    //         // setState(-1);
    //     } else if (btonText === 'Unlist') {
    //         // handleUnlist();
    //         setState(-1);
    //     } else {
    //         setPopup(true);
    //         setState(7);
    //     }
    // };

    let data = { ...nft, ...listing, id: listing?._id, switchNetwork, chainId: chainId, offer, setOffer };
    // console.log("DEBUG_INFO_ONLY_MAIN_CARD_COMPONENT",data,"LISTING",listing, "LISTING","Where",where, "where",nft,account)
    if (action === 'bid') {
        data = {
            ...data,
            loading: placeBidLoading,
            hash: txHash,
            setTxHash: setTxHash,
            loaderHeading: 'Bidding',
            loaderText: 'Loading',
            successHeading: 'Transaction successful',
            flow: METAMASK_POPUP.bid
        };
    } else if (action === 'unlist') {
        data = {
            ...data,
            loading: unlistNftLoading,
            hash: txHash,
            setTxHash: setTxHash,
            loaderHeading: 'Unlisting NFT',
            loaderText: 'Loading',
            successHeading: 'Transaction successful',
            flow: METAMASK_POPUP.unlist
        };
    } else if (action === 'buy') {
        data = {
            ...data,
            loading: buyNftLoading,
            hash: txHash,
            setTxHash: setTxHash,
            loaderHeading: 'Buying NFT',
            loaderText: 'Please Wait',
            successHeading: 'Transaction successful',
            flow: METAMASK_POPUP.buy
        };
    }

    const dispatch = useDispatch();

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

    const handleSetTxHash = (value: string) => {
        setTxHash(value);

        if (router.pathname.includes('listings')) {
            router.push(`/profile/${user?.userName}`);
        }
    };

    const handleBuyNft = () => {
        setAction('buy');
        setPopup(true);
        setState(35);
        const signer = library?.getSigner();
        const blockchain = contracts.find(
            (item) => item.sellCurrency == listing?.currency && item.chain == listing?.chain
        );

        if (!blockchain) {
            toast.error('This currency does not supported');
            setPopup(false);
            return;
        }

        dispatch(
            // @ts-ignore
            buyNFT(
                signer,
                listing?.listingId,
                listing?.price,
                handleSetTxHash,
                setState,
                play,
                account,
                listing?.to,
                blockchain?.tokenAddress,
                blockchain?.native == undefined ? true : blockchain?.native
            )
        );
    };

    const handleBidding = () => {
        setAction('bid');
        setPopup(true);
        setState(13);
    };

    const handleUnlist = () => {
        setAction('unlist');
        setPopup(true);
        setState(39);
        const signer = library?.getSigner();
        dispatch(unlistNft(signer, listing?.listingId, setState, setTxHash, listing?.to));
    };

    const handleItemClick = (e: any) => {
        e.stopPropagation();
        if (!nft?.tokenId) {
            console.log('no token Id');
            return;
        }
        router.push({
            pathname: where === 'listing' ? `/listings/${listing?.listingId}` : `/nft/${nft.tokenId}`,
            ...(!listing && { query: { contract: nft?.contractAddress, chain: nft?.chain } })
        });
    };

    const handleOnComplete = () => {
        dispatch(removeFromMarkete(listing?.listingId));
    };

    // const handleSwitchNetwork = async (contractAddress: string, chainName: string) => {
    //     const contracts = getMarketDetailsByNFTAddress(contractAddress);
    //     const chain = contracts ? contracts?.chainId : undefined;

    //     if (!contracts) {
    //         // toast.error('This chain does not supported.');
    //         if (chainName) {
    //             setPopup(true);
    //             setState(64);
    //         }
    //         return false;
    //     } else if (chain == chainId) {
    //         return true;
    //     } else {
    //         setPopup(true);
    //         setState(64);
    //         return false;
    //     }
    // };

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
            btn === 'Not For Sale'
            /* ||
            (nft?.owner !== account && !listing) */
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

    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };

    // ui views
    const renderContentView = () => {
        switch (NftContentType(nft?.image, nft)) {
            case 'mp4':
                return <VideoComponent src={nft?.animation_url ? nft?.animation_url : nft?.image} />;
            case 'gif':
                return <VideoComponent src={nft?.image} fileType={'gif'} />;
            case 'glb':
                return (
                    <div className="vimeo-video-container">
                        <ImageComponent
                            src={nft?.preview}
                            key={nft?.preview}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg vimeo-video"
                            blurEffect
                            quality={50}
                        />
                    </div>
                );
            default:
                return (
                    <div className="vimeo-video-container">
                        <ImageComponent
                            src={nft?.image}
                            key={nft?.name}
                            fileType={nft?.fileType}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg vimeo-video"
                            blurEffect
                            quality={50}
                        />
                    </div>
                );
        }
    };

    // stop propogation on Click function

    const stopPropagation = (e: any) => e.stopPropagation();

    const plots = useSelector((state: any) => state.landmap.lands);
    const islands = useSelector((state: any) => state.landmap.islands);
    const topOneIslandOwners = useSelector((state: any) => state.landmap.topOneIslandOwners);

    const [selLand, setSelLand] = useState(null);
    useEffect(() => {
        if (!plots) return;
        let contractAddrs = [
            '0x81FEa6a299FbA9742ebcd6AD4dE7361f92391aBb',
            '0xf97199f79ca6677c3baa20a48320029ba9264b08',
            '0xC4ee3ff221ad2566f30F75087FB519fA740cE7Fe',
            '0x9AEfe5cD9Aaf86E6E04CB7607D795b292bc59ce3'
        ];
        let isLand = contractAddrs.findIndex((addr) => addr.toUpperCase() === nft?.contractAddress.toUpperCase());
        if (isLand !== -1) {
            Object.keys(plots).map((key, index) => {
                if (plots[key]['landID'] === parseInt(nft?.tokenId)) {
                    setSelLand(plots[key]);
                }
            });
        }
    }, [nft, plots]);
    const getAvatarURL = (url: string) => {
        return url
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/` + url
            : '/assets/images/default.png';
    };
    // main return
    return (
        <>
            {nft?.name && (
                <div className="" key={nft?._id}>
                    <div
                        onClick={handleItemClick}
                        className={`w-full bg-[#2B2B35] relative rounded-2xl  ease-in-out duration-300 cursor-pointer p-4 border-2 border-transparent hover:border-[#F1C94A] hover:shadow-[0_0_30px_0_rgba(241,207,74,0.5)]`}>
                        <div className="text-lg text-white rounded-2xl">
                            <figure
                                className="relative bg-[#c9cdd3]  AtScaleImage  rounded-2xl overflow-hidden"
                                onClick={handleItemClick}>
                                {renderContentView()}
                                {listing?.sellMode === '1' && (
                                    <div className="absolute bottom-0 flex items-center justify-center w-full gap-2 py-2 Atbackground">
                                        <figure className="relative">
                                            {/* // eslint-disable-next-line jsx-a11y/alt-text */}
                                            <Image
                                                src="/assets/images/liveauctions/img5.svg"
                                                alt=""
                                                height={20}
                                                width={20}
                                            />
                                        </figure>
                                        <div className="text-xl font-Proxima-SemiBold ">
                                            <Countdown
                                                onComplete={handleOnComplete}
                                                date={
                                                    new Date(listing?.startTime * 1000).getTime() +
                                                    listing.duration * 1000
                                                }
                                            />
                                        </div>

                                        <p className="text-xl text-white font-Proxima-SemiBold">Left</p>
                                    </div>
                                )}
                            </figure>

                            {!listing && nft?.owner && nft?.owner?.toUpperCase() == account?.toUpperCase() && (
                                <Nftdropdown tokenId={nft?.tokenId} setState={setState} setPopup={setPopup} />
                            )}
                        </div>

                        <div className="mt-[12px]">
                            <div
                                onClick={stopPropagation}
                                className={`flex gap-3 -ml-2  mb-5 ${
                                    checkblocked(ownerDetails, user?.userId) ? 'opacity-50' : ''
                                }`}>
                                {nft?._id && (
                                    <LikeComponent
                                        className=""
                                        nft={{ nft }}
                                        showCount={true}
                                        feeduser={ownerDetails}
                                        size={undefined}
                                    />
                                )}
                                {nft?._id && (
                                    <CommentCount
                                        nft={nft}
                                        disabled={checkblocked(ownerDetails, user?.userId)}
                                        size={undefined}
                                    />
                                )}
                                {listing && (
                                    <div
                                        className="flex items-center "
                                        onClick={() => {
                                            if (!checkblocked(ownerDetails, user?.userId)) {
                                                setShareLink(
                                                    `${process.env.NEXT_PUBLIC_URL}/listings/${listing?.listingId}`
                                                );
                                                setPopup(true);
                                                setState(31);
                                            }
                                        }}>
                                        <div className="Atcardhovershare-bg">
                                            <svg
                                                className="Atcardhovershare"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M15.91 5.03003C17.91 6.42003 19.29 8.63003 19.57 11.18M2.44 11.23C2.7 8.68996 4.06 6.47996 6.04 5.07996M7.14001 19.7999C8.30001 20.3899 9.62002 20.7199 11.01 20.7199C12.35 20.7199 13.61 20.4199 14.74 19.8699M13.79 3.78C13.79 5.31535 12.5454 6.56 11.01 6.56C9.47469 6.56 8.23004 5.31535 8.23004 3.78C8.23004 2.24465 9.47469 1 11.01 1C12.5454 1 13.79 2.24465 13.79 3.78ZM6.56 16C6.56 17.5353 5.31535 18.78 3.78 18.78C2.24465 18.78 1 17.5353 1 16C1 14.4646 2.24465 13.22 3.78 13.22C5.31535 13.22 6.56 14.4646 6.56 16ZM20.9 16C20.9 17.5353 19.6554 18.78 18.12 18.78C16.5847 18.78 15.34 17.5353 15.34 16C15.34 14.4646 16.5847 13.22 18.12 13.22C19.6554 13.22 20.9 14.4646 20.9 16Z"
                                                    stroke="#A1A1A5"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>

                                        <p className=" text-[#989B9F] text-sm ml-[2px]  font-Proxima-Bold">Share</p>
                                    </div>
                                )}
                            </div>
                            <div className={`w-full ${selLand ? 'h-[42px]' : 'h-[72px]'}  `}>
                                <h5 className="w-full text-2xl text-white capitalize line-clamp1 font-Proxima-Bold braek">
                                    {(nft?.name).includes(nft?.tokenId) ? nft?.name : `${nft?.name} #${nft.tokenId}`}
                                </h5>
                            </div>
                            {selLand && topOneIslandOwners && (
                                <>
                                    <p className=" text-white font-Proxima-Regular">
                                        Kingdom: {islands[selLand['island'] - 1]['name']}
                                    </p>
                                    <div className="text-white">
                                        King:{' '}
                                        <div className="flex gap-2.5 items-center">
                                            <figure className="w-[40px] h-[40px]   rounded-full UerProfileImage bg-[#272737] flex items-center justify-center relative flex-shrink-0">
                                                <i className="w-[10px] rounded-full h-[10px] block absolute border-1 bottom-0 right-[30px] border-white z-10 bg-[#646465]"></i>
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full "
                                                    src={getAvatarURL(
                                                        topOneIslandOwners[selLand['island'] - 1][0]?.user?.avatar
                                                    )}
                                                    alt=""
                                                />
                                            </figure>
                                            <div className="text-left ">
                                                <div className="flex gap-1.5 items-center pr-2">
                                                    <h5
                                                        className="hover:cursor-pointer border-b border-transparent hover:border-white text-ellipsis w-[7em] whitespace-nowrap overflow-hidden font-Proxima-Regular text-white text-lg"
                                                        onClick={() =>
                                                            router.push(
                                                                `/profile/${
                                                                    topOneIslandOwners[selLand['island'] - 1][0].user
                                                                        ?.userName
                                                                }`
                                                            )
                                                        }>
                                                        {topOneIslandOwners[selLand['island'] - 1][0]?.user?.firstName}{' '}
                                                        {topOneIslandOwners[selLand['island'] - 1][0]?.user?.lastName}
                                                    </h5>
                                                    {topOneIslandOwners[selLand['island'] - 1][0]?.user?.isVerfied && (
                                                        <Verified />
                                                    )}
                                                </div>

                                                <p className="text-base -mt-1">
                                                    {topOneIslandOwners[selLand['island'] - 1][0]?.followers} Followers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* This condition will not display this component if user is creator of this item */}
                            {/* {!(nft?.creater == account && nft?.owner == account) && listing && ( */}
                            {/* {!(nft?.creater == account && nft?.owner == account) && ( */}

                            {/* )} */}
                            <div onClick={stopPropagation}>
                                <h4 className="text-[14px] text-white font-Proxima-Regular mb-[5px] tracking-wider">
                                    Blockchain
                                </h4>
                                <Blockchains blockchain={nft?.chain} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-1 mt-3 ">
                            {ownerDetails && (
                                <div className="flex-shrink-0 w-3/5 truncate ">
                                    <h4 className="text-[14px] text-white font-Proxima-Regular mb-[5px] tracking-wider">
                                        Owned by
                                    </h4>
                                    <div
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            router.push(`/profile/${ownerDetails?.userName}`);
                                        }}>
                                        <div className="flex items-center">
                                            <figure className=" rounded-full flex-shrink-0 relative overflow-hidden  h-[24px] w-[24px] ">
                                                {ownerDetails?.avatar ? (
                                                    <ImageComponent
                                                        className="rounded-full "
                                                        src={ownerDetails?.avatar}
                                                        alt=""
                                                        // height={24}
                                                        // width={24}
                                                        objectFit="cover"
                                                        layout="fill"
                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                    />
                                                ) : (
                                                    <>
                                                        {
                                                            <p className="w-[24px] h-[24px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-base font-Proxima-SemiBold">
                                                                {ownerDetails?.firstName?.charAt(0)?.toUpperCase()}
                                                            </p>
                                                        }
                                                    </>
                                                )}
                                            </figure>
                                            <p className=" text-[14px]  flex-shrink-0   flex items-center   !truncate w-full !p-0 ml-[5px] text-white">
                                                <span className="border-b border-transparent hover:border-white ">
                                                    {' '}
                                                    @{ownerDetails?.userName}
                                                </span>
                                                {ownerDetails?.isVerfied && (
                                                    <svg
                                                        className="ml-2 "
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
                                                                <stop offset="0.484375" stopColor="#ECDB88" />
                                                                <stop offset="0.994792" stopColor="#AA601B" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {listing && (
                                <PriceComponent
                                    amount={listing?.price || 0}
                                    currency={listing?.currency}
                                    chain={listing?.chain}
                                    marketAddress={blockchain?.marketAddress}
                                    fee={listing?.sellMode == '0'}
                                    className="w-3/4 truncate"
                                    className1="min-w-[20px] max-w-[120px]  truncate"
                                    className2=" truncate"
                                    size={undefined}
                                />
                            )}
                        </div>
                        <div className="flex items-center justify-end flex-grow gap-3 mt-4 at-soldbtn">
                            <Button
                                className="bg-transparent text-themecolor !border border-themecolor rounded-[6rem] !py-1.5 text-sm background-change  items-center flex-shrink-0 !px-3 !inline-flex gap-1.5"
                                onClick={handleItemClick}>
                                <svg
                                    className="inline-block w-[0.938rem] h-[0.75rem]"
                                    width="15"
                                    height="12"
                                    viewBox="0 0 15 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.5 0C9.05122 0 10.522 0.538182 11.8024 1.53455C13.0829 2.52364 14.1732 3.97091 14.9561 5.78182C15.0146 5.92 15.0146 6.08 14.9561 6.21091C13.3902 9.83273 10.6024 12 7.5 12H7.49268C4.39756 12 1.60976 9.83273 0.0439024 6.21091C-0.0146341 6.08 -0.0146341 5.92 0.0439024 5.78182C1.60976 2.16 4.39756 0 7.49268 0H7.5ZM7.5 3.09091C5.88293 3.09091 4.57317 4.39273 4.57317 6C4.57317 7.6 5.88293 8.90182 7.5 8.90182C9.10976 8.90182 10.4195 7.6 10.4195 6C10.4195 4.39273 9.10976 3.09091 7.5 3.09091ZM7.50088 4.18022C8.50332 4.18022 9.32283 4.99476 9.32283 5.9984C9.32283 6.99476 8.50332 7.80931 7.50088 7.80931C6.49112 7.80931 5.67161 6.99476 5.67161 5.9984C5.67161 5.87476 5.68624 5.7584 5.70819 5.64204H5.74478C6.55698 5.64204 7.21551 5.00204 7.24478 4.20204C7.32527 4.18749 7.41307 4.18022 7.50088 4.18022Z"
                                        fill="#f1c94a"
                                    />
                                </svg>
                                <span className="inline-block !leading-normal text-sm mt-0.5">View NFT</span>
                            </Button>

                            <Button
                                className="bg-[#F1C94A] gold !py-1.5 text-[#14141F]  rounded-[6rem] !text-sm  items-center flex-shrink-0 gap-1.5 !px-3"
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    handleButtonClick(buttonText);
                                }}
                                disabled={handleDisabled(buttonText, nft?.owner)}>
                                {/* {buttonText !== 'Not For Sale' && (
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[1.063rem] h-[1.063rem]">
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
                        )} */}
                                <span className=" !leading-normal ">{buttonText}</span>
                            </Button>
                        </div>
                    </div>
                    {state && (
                        <Popups
                            show={openModal}
                            hide={setPopup}
                            state={modalState}
                            setstate={setState}
                            data={state == 31 ? shareLink : data}
                            type="nft"
                        />
                    )}
                </div>
            )}
        </>
    );
};
export default memo(MainCard);
