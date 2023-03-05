import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { METAMASK_POPUP, TRANSFORMATION_NAMES } from '../../constants/enums';
import Button from '../Button/Button';
import ImageComponent from '../Image/ImageComponent';
import Verified from '../verified';
import { AiFillYoutube, AiOutlineCloseCircle } from 'react-icons/ai';

import { Follow } from '../Follow/follow';
import { connectRoom } from '../../redux/messages/actions';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Popups from '../../components/popup/poups';
import { useWeb3React } from '@web3-react/core';
import useMetaMask from '../../hooks/useMetaMask';
import LandmapSkelton from '../skelton/LandmapSkelton';
import Link from 'next/link';
import MainCard from '../maincard/MainCard';
const LandURI = '/assets/images/landmap/Land_placeholder.gif';
const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

const LandnameComponent = (props: any) => {
    const { library, isInstalled, isActive, account, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();
    const router = useRouter();
    const dispatch = useDispatch();

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const user = useSelector((state: any) => state.auth.user);

    const openModal = useMemo(() => popup, [popup]);
    const modalState = useMemo(() => state, [state]);
    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }
    const checkMetamask = async () => {
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
    const conectRoom = (id: any) => {
        dispatch(
            connectRoom({
                recievedBy: id,
                type: 'PRIVATE'
            })
        );
    };
    const handleUpdate = (st: number) => {
        setState(st);
        props.getLandsData();
    };
    const getAvatarURL = (url: string) => {
        return url
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/` + url
            : '/assets/images/default.png';
    };
    return (
        <>
            {props.loading ? (
                <div className="z-10 absolute top-0 right-0 h-full bg-black text-center  sm:w-[25rem] w-full ">
                    <LandmapSkelton />
                </div>
            ) : (
                <div className="z-10 relative sm:absolute top-0 right-0 h-full bg-black text-center  px-3 sm:w-[25rem] w-full pb-8 ">
                    <div className={`absolute top-4  right-4 h-9 w-9  flex justify-center items-center  rounded-full`}>
                        <button
                            type="button"
                            className={`text-2xl hover:text-gray-500 focus:outline-none`}
                            onClick={() => {
                                props.setSelBlock(null);
                                // hide(false);
                            }}>
                            <span className="sr-only">Close</span>

                            <AiOutlineCloseCircle />
                        </button>
                    </div>
                    {props.user?.isListed ? (
                        <div className="w-[90%] mx-auto zoomfull text-left">
                            <h6 className="py-10">This land is listed for Sale.</h6>
                            <MainCard where="listing" listing={props?.user} nft={props.user?.nft} />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-white font-Proxima-Regular text-sm pt-5">Land:</h2>
                            <p className="text-3xl text-white">
                                {props.land.name} #{props.land.landID}
                            </p>

                            <div className="flex justify-center items-center mt-2">
                                <figure className=" w-[250px] h-[250px] relative ">
                                    <Image
                                        src={props.land.logo ? props.land?.logo : LandURI}
                                        alt="land-logo"
                                        width={250}
                                        height={250}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>
                            </div>
                            <p className="min-h-[120px] text-white mt-2 p-2">
                                {props.land?.description || 'Briefly outline your impact in the metaverse.'}
                            </p>
                            <Button
                                className="rounded-2xl text-sm gold !w-[5rem]  h-8 !px-0 py-3 mb-2"
                                onClick={async () => {
                                    if (!user?.userId) {
                                        setPopup(true);
                                        setState(1);
                                        return;
                                    }
                                    if (!(await checkMetamask())) {
                                        return;
                                    }
                                    const chain = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET' ? 5 : 1;

                                    // if (chainId !== chain) {
                                    //     const status = await switchNetwork(chain);
                                    //     if (status) {
                                    //         setPopup(true);
                                    //         setState(98);
                                    //     }
                                    // } else {
                                    setPopup(true);
                                    setState(99);
                                    // }
                                }}>
                                <svg
                                    className="mr-2"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.90979 0.400269C9.78477 0.275288 9.61523 0.205078 9.43846 0.205078C9.26168 0.205078 9.09214 0.275288 8.96712 0.400269L8.02446 1.3436L10.8525 4.1716L11.7951 3.22894C11.9201 3.10392 11.9903 2.93438 11.9903 2.7576C11.9903 2.58083 11.9201 2.41129 11.7951 2.28627L9.90979 0.400269ZM9.90979 5.11494L7.08112 2.28627L1.14779 8.2196C1.02317 8.34454 0.953162 8.5138 0.953125 8.69027V10.5763C0.953125 10.7531 1.02336 10.9226 1.14839 11.0477C1.27341 11.1727 1.44298 11.2429 1.61979 11.2429H3.50512C3.68192 11.2429 3.85146 11.1726 3.97646 11.0476L9.90979 5.11427V5.11494Z"
                                        fill="#000000"
                                    />{' '}
                                </svg>
                                Edit
                            </Button>
                            <p className="text-sm text-center mt-2 mb-5">
                                Do you own this Kingdom? To update its information (such as name, description, and
                                image), please create a LooBr account and connect your wallet. Make sure the appropriate
                                wallet is linked before pressing this button.
                            </p>

                            <Button className="!inline-block rounded-full text-sm gold !w-[14rem] !px-0 py-1 mb-2 bg-[#757066] hover:shadow-none cursor-not-allowed">
                                <h6 className="text-black">Visit Land</h6>
                                <span>comming soon...</span>
                            </Button>
                            {props.user && props.user.info && (
                                <div className="bg-[#2b2b35]  mt-4 px-2  flex justify-between ">
                                    <div className="flex items-center gap-2.5 ">
                                        <figure className="flex items-center justify-center rounded-full w-14 h-14 UerProfileImage ">
                                            <ImageComponent
                                                className="rounded-full"
                                                width={40}
                                                height={40}
                                                src={getAvatarURL(props.user.user.avatar)}
                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                            />
                                        </figure>
                                        <div className="">
                                            <div className="flex flex-col ">
                                                <div className="flex items-center ">
                                                    <h2 className="text-white !text-lg leading-none   lg:max-w-full  max-w-[170px]  border-b border-transparent hover:border-white   truncate mr-2">
                                                        {props.user.user.firstName} {props.user.user.lastName}
                                                    </h2>
                                                    {props.user.user.isVerfied && <Verified />}
                                                </div>
                                                <p className="text-sm sm:text-base  max-w-[170px]  text-left truncate">
                                                    {props.user.info.followers.length} Followers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Follow
                                            customClass={
                                                '!rounded-2xl !min-w-[80px] !max-w-[80px] !text-sm gold !w-16  h-8 !px-0'
                                            }
                                            userModule={true}
                                            otherUser={props.user.info}
                                        />
                                        <Button
                                            className="rounded-2xl   text-sm gold !w-16  h-8 !px-0  "
                                            onClick={() => {
                                                let dimentions = getWindowSize();
                                                if (dimentions.innerWidth < 1024) {
                                                    router.push('/mobileviewchat');
                                                }
                                                conectRoom(props.user.info && props.user.info._id);
                                            }}>
                                            Chat
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-3">
                                <h2 className="text-white font-Proxima-Regular text-sm">
                                    Owned by: {props.owner} <i className="icon-copy"></i>
                                </h2>
                                {/* <p className="text-xl text-white">{props.owner}</p> */}
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                {props?.user?.info?.youtube && (
                                    <a target="_blank" href={`https://www.youtube.com/${props?.user?.info?.youtube}`}>
                                        <AiFillYoutube className="text-2xl text-themecolor" />
                                    </a>
                                )}
                                {props?.user?.info?.instagram && (
                                    <a
                                        target="_blank"
                                        href={`https://www.instagram.com/${props?.user?.info?.instagram}`}>
                                        <i className="icon-instagram text-2xl text-themecolor"></i>
                                    </a>
                                )}
                                {props?.user?.info?.twitter && (
                                    <a target="_blank" href={`https://twitter.com/${props?.user?.info?.twitter}`}>
                                        <i className="icon-twitter text-2xl text-themecolor"></i>
                                    </a>
                                )}
                                {props?.user?.info?.facebook && (
                                    <a target="_blank" href={`https://facebook.com/${props?.user?.info?.facebook}`}>
                                        <i className="icon-facebook text-2xl  text-themecolor"></i>
                                    </a>
                                )}
                                {props?.user?.info?.linkdin && (
                                    <a target="_blank" href={`https://linkedin.com/in/${props?.user?.info?.linkdin}`}>
                                        <i className="icon-linkdin text-2xl text-themecolor"></i>
                                    </a>
                                )}
                                {props?.user?.info?.telegram && (
                                    <a target="_blank" href={`https://telegram.com/${props?.user?.info?.telegram}`}>
                                        <i className="icon-telegram text-2xl text-themecolor"></i>
                                    </a>
                                )}
                            </div>
                            {state < 90 && (
                                <Popups
                                    show={openModal}
                                    hide={setPopup}
                                    state={modalState}
                                    setstate={setState}
                                    data={{ flow: METAMASK_POPUP.mint }}
                                    type="nft"
                                />
                            )}
                            {state > 90 && (
                                <Popups
                                    show={popup}
                                    hide={setPopup}
                                    data={{ ...props.land, isOwner: account && account.toUpperCase() === props.addr }}
                                    state={state}
                                    setstate={handleUpdate}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default LandnameComponent;
