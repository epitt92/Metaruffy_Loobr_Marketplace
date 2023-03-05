import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { METAMASK_POPUP, TRANSFORMATION_NAMES } from '../../constants/enums';
import Button from '../Button/Button';
import ImageComponent from '../Image/ImageComponent';
import Verified from '../verified';
import UserItem from '../landmap/UserItem';
import { AiFillYoutube, AiOutlineCloseCircle } from 'react-icons/ai';
import { Follow } from '../Follow/follow';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Popups from '../../components/popup/poups';
import { useWeb3React } from '@web3-react/core';
import useMetaMask from '../../hooks/useMetaMask';
import SkeltonKingdom from '../skelton/KingdomSkelton';
const defaultLogo = '/assets/images/landmap/Kingdom_placeholder.gif';

const KingdomComponent = (props: any) => {
    const { library, isInstalled, isActive, account, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();
    const router = useRouter();
    const dispatch = useDispatch();

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const user = useSelector((state: any) => state.auth.user);

    const openModal = useMemo(() => popup, [popup]);
    const modalState = useMemo(() => state, [state]);
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
    const handleUpdate = (st: number) => {
        setState(st);
        props.getIslandsData();
    };

    return (
        <>
            {props.loading ? (
                <div className="z-10 absolute top-0 h-full bg-white text-center  px-3 sm:w-[32rem] w-full pb-8 ">
                    <SkeltonKingdom />
                </div>
            ) : (
                <div className="z-10 relative sm:absolute top-0 h-full bg-black text-center  px-3 sm:w-[32rem] w-full pb-24 ">
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
                    <h2 className="text-white font-Proxima-Regular text-sm pt-5">Kingdom:</h2>
                    <p className="text-3xl text-white">{props.island.name || 'Unnamed Kingdom'}</p>
                    <div className="flex justify-center items-center mt-2">
                        <figure className="w-[250px] h-[250px] relative ">
                            <Image
                                alt="kingdom-logo"
                                src={props.island.logo ? props.island.logo : defaultLogo}
                                width={220}
                                height={220}
                                className="w-full h-full object-cover"
                            />
                        </figure>
                    </div>
                    <p className="min-h-[120px] text-white mt-2 p-2">
                        {props.island.description || 'Provide an intriguing description of your metaverse story.'}
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
                            setState(98);
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
                        Do you own this Kingdom? To update its information (such as name, description, and image),
                        please create a LooBr account and connect your wallet. Make sure the appropriate wallet is
                        linked before pressing this button.
                    </p>
                    {props.topOwners &&
                        props.topOwners.map((item: any, i: number) => (
                            <div
                                key={i}
                                className={`${!i ? 'border-2 border-dashed' : ''} border-themecolor mb-2 w-full`}>
                                <UserItem item={item} num={i + 1} />

                                {!i ? (
                                    <div className="my-3">
                                        <h2 className="text-white font-Proxima-Regular text-sm">
                                            Owned by: {props.owner} <i className="icon-copy"></i>
                                        </h2>
                                        {/* <p className="text-xl text-white"></p> */}
                                        <div className="flex justify-between items-center">
                                            {props?.user?.info?.youtube && (
                                                <a
                                                    target="_blank"
                                                    href={`https://www.youtube.com/${props?.user?.info?.youtube}`}>
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
                                                <a
                                                    target="_blank"
                                                    href={`https://twitter.com/${props?.user?.info?.twitter}`}>
                                                    <i className="icon-twitter text-2xl text-themecolor"></i>
                                                </a>
                                            )}
                                            {props?.user?.info?.facebook && (
                                                <a
                                                    target="_blank"
                                                    href={`https://facebook.com/${props?.user?.info?.facebook}`}>
                                                    <i className="icon-facebook text-2xl  text-themecolor"></i>
                                                </a>
                                            )}
                                            {props?.user?.info?.linkdin && (
                                                <a
                                                    target="_blank"
                                                    href={`https://linkedin.com/in/${props?.user?.info?.linkdin}`}>
                                                    <i className="icon-linkdin text-2xl text-themecolor"></i>
                                                </a>
                                            )}
                                            {props?.user?.info?.telegram && (
                                                <a
                                                    target="_blank"
                                                    href={`https://telegram.com/${props?.user?.info?.telegram}`}>
                                                    <i className="icon-telegram text-2xl text-themecolor"></i>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))}
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
                            data={{ ...props.island, isOwner: account && account.toUpperCase() === props.addr }}
                            state={state}
                            setstate={handleUpdate}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default KingdomComponent;
