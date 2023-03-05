import Link from 'next/link';
import Image from 'next/image';
import Popups from '../popup/poups';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import { Disclosure } from '@headlessui/react';
import useMetaMask from '../../hooks/useMetaMask';
import React, { useEffect, useState } from 'react';
import { _io } from '../../services/socket.service';
import { useDispatch, useSelector } from 'react-redux';
import { METAMASK_POPUP } from '../../constants/enums';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { GetAdminData } from '../../redux/admindata/actions';
import { NotificationAction } from '../../services/rxjs.service';
import Profiledropdown from '../ProfileDropdown/ProfileDropdown';
import { USER_NOTIFICATIONS } from '../../constants/socketEvents';
import NotificationDropwon from './NotificanDropdown/NotificationDropwon';
// import Marquee from 'react-fast-marquee';
import { GlobalSearch } from './GlobalSearch';
import OutSideClick from 'react-outside-click-handler';
import { homeService } from '../../services/home.service';

const navigation = [
    { name: 'Marketplace', href: '/pages-v2/marketplace-v2', current: false },
    { name: 'Social Feed', href: '/feeds', current: false },
    { name: 'Trends', href: '/trends', current: false },
    { name: 'Mint Area', href: '/mintarea', current: false },
    { name: 'Interactive Map', href: '/landmap', current: false }

    // { name: 'Collections', href: '/external-collection', current: false }
];

export const Header = () => {
    const router = useRouter();
    const chat = useSelector((state: any) => state.chat);

    const [popup, setPopup] = useState(false);
    const [change, setChange] = useState(false);
    const [explore, setExplore] = useState(false);

    const [state, setState] = useState(-1);
    const user = useSelector((state: any) => state.auth.user);
    const { isInstalled, isActive }: any = useMetaMask();
    const dispatch = useDispatch();
    // const user = useSelector((state: any) => state.auth.user);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        dispatch(GetAdminData());
    }, []);

    useEffect(() => {
        if (user?.userId) {
            _io.on(`${USER_NOTIFICATIONS}:${user?.userId}`, (payload: any) => {
                NotificationAction.triggerAction(payload);
                // toast.warning('You have new notifications')
            });
        }
    }, [user?.userId]);

    const handleCreate = () => {
        setChange(false);

        if (!isAuthenticated) {
            setPopup(true);
            setState(1);
        } else if (isActive) {
            router.push('/choosenft');
        } else if (!isInstalled && window.innerWidth > 480) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
        } else if (!isActive) {
            setPopup(true);
            setState(7);
        }
    };

    useEffect(() => {
        if (router.query?.stageRedirect) {
            if (!isAuthenticated) {
                setPopup(true);
                setState(1);
            } else {
                stageRedirect();
            }
        }
        return () => {};
    }, [isAuthenticated, router?.query]);

    const stageRedirect = async () => {
        if (!isAuthenticated) return;
        const res = await homeService.stageLogin();
        const data = res.data.data;
        router.push(
            `${process.env.NEXT_PUBLIC_STAGE_FRONTEND}/?accessToken=${data?.accessToken}&refreshToken=${
                data?.refreshToken
            }${router?.query?.stageRedirect && `&next=${router?.query?.stageRedirect}`}`
        );
    };

    return (
        <>
            <header
                className={`!z-50 bg-[#14141F]   dark:bg-white border border-t-0  sticky top-0 border-r-0 border-l-0 border-b-[#43434C] ${
                    router.pathname === '/landmap' ? 'zoomfull' : ''
                }`}>
                {router.pathname === '/messagechatview' ? (
                    ''
                ) : (
                    <Disclosure as="div" className="container   !min-h-0">
                        {({ open }) => (
                            <>
                                <div className="flex  items-center py-[14px]  w-full relative   pl-0 justify-between gap-3">
                                    <div className=" flex gap-3 sm:gap-0 sm:items-center 2xl:gap-x-28 xl:gap-x-16 sm:gap-x-10 gap-x-3">
                                        <strong className="Atlogo w-[100px]  h-[50px]    sm:w-[150px] sm:h-[75px]">
                                            <Link legacyBehavior href="/">
                                                <a className="">
                                                    <figure className="relative">
                                                        <Image
                                                            src="/assets/images/loobr.svg"
                                                            layout="fill"
                                                            objectFit="contain"
                                                            alt=""
                                                        />
                                                    </figure>
                                                </a>
                                            </Link>
                                        </strong>
                                        {!showSearch && (
                                            <nav className="flex items-center justify-between ">
                                                <Disclosure.Button className="hidden p-2 ml-1 text-black rounded-lg xl:hidden lg:block bg-themecolor hover:bg-none ">
                                                    <span className="sr-only">Open main menu</span>
                                                    {open ? (
                                                        <XIcon className="block w-5 h-5 " aria-hidden="true" />
                                                    ) : (
                                                        <MenuIcon className="block w-5 h-5 " aria-hidden="true" />
                                                    )}
                                                </Disclosure.Button>
                                                <ul
                                                    className={`hidden xl:flex md:items-center  md:space-x-12 list-none`}>
                                                    {navigation.map((item, i) => (
                                                        <span key={i}>
                                                            <li className="relative " key={i}>
                                                                <Link legacyBehavior href={item?.href}>
                                                                    <a
                                                                        key={item?.name}
                                                                        className={`text-base border-b-[3px] relative hover:!text-white ${
                                                                            router.pathname == item?.href
                                                                                ? '  ! border-themecolor  py-8 xl:pb-[40.6px]  after:border-b-2 !text-white'
                                                                                : 'text-gray6 !border-none'
                                                                        } `}>
                                                                        {item?.name}
                                                                    </a>
                                                                </Link>
                                                                {/* {item.comming && (
                                                                    <span className="absolute top-[110%] left-0 bg-red-500  text-white whitespace-nowrap px-1 rounded-sm text-sm">
                                                                        {item.comming}
                                                                    </span>
                                                                )} */}
                                                            </li>
                                                        </span>
                                                    ))}
                                                    {isAuthenticated && (
                                                        <li onClick={stageRedirect} className="relative cursor-pointer">
                                                            <a className="text-base border-b-[3px] relative hover:!text-white text-gray6 !border-none ">
                                                                Stage
                                                            </a>
                                                        </li>
                                                    )}
                                                </ul>
                                                <Disclosure.Panel className="xl:hidden w-[40%] overflow-hidden absolute left-0 top-[68px] sm:top-[93px] z-20 bg-black2   shadow-lg">
                                                    <ul className="pb-3 space-y-1 ">
                                                        {navigation.map((item, i) => (
                                                            <span key={i}>
                                                                <li className="border-b border-white last:border-0">
                                                                    <Disclosure.Button
                                                                        key={item?.name}
                                                                        as="a"
                                                                        href={item?.href}
                                                                        className="!text-white text-xl block px-5 py-3 ">
                                                                        {item?.name}
                                                                    </Disclosure.Button>
                                                                    {/* {item.comming && (
                                                                        <span className="px-1 py-1 mb-4 ml-5 text-sm text-white bg-red-500 rounded-sm whitespace-nowrap">
                                                                            {item.comming}
                                                                        </span>
                                                                    )} */}
                                                                </li>
                                                            </span>
                                                        ))}
                                                        {isAuthenticated && (
                                                            <li onClick={stageRedirect} className="mt-4 cursor-pointer">
                                                                <a className="border-b  border-white last:border-0 !text-white text-xl block px-5 py-3">
                                                                    Stage
                                                                </a>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </Disclosure.Panel>
                                            </nav>
                                        )}
                                    </div>
                                    <div
                                        className={`${
                                            isAuthenticated ? 'gap-4' : 'gap-2 sm:gap-4'
                                        } flex justify-center  items-center sm:w-auto`}>
                                        {!isAuthenticated ? (
                                            <>
                                                <GlobalSearch showSearch={showSearch} setShowSearch={setShowSearch} />

                                                <Button
                                                    className="bg-transparent border h-10 sm:h-12 border-gray4 rounded-full hover:bg-[#43434a]  !text-sm whitespace-nowrap !text-white  py-3.5 px-4 sm:px-7  md:px-11 xl:px-6"
                                                    onClick={handleCreate}>
                                                    Create NFT
                                                </Button>

                                                <Link legacyBehavior href="/">
                                                    <a>
                                                        <Button
                                                            className="h-10 sm:h-12  py-3.5  px-4 sm:px-7 !text-sm rounded-full md:px-11 xl:px-6 gold"
                                                            onClick={() => {
                                                                setPopup(true);
                                                                setState(1);
                                                                // setState(96);
                                                            }}>
                                                            Register/Login
                                                        </Button>
                                                    </a>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <GlobalSearch showSearch={showSearch} setShowSearch={setShowSearch} />
                                                <NotificationDropwon />
                                                <Button
                                                    onClick={handleCreate}
                                                    className=" bg-transparent lg:block hidden  hover:bg-[#43434a]  !text-white border border-[#5A5A62] rounded-full h-10 sm:h-12 md:px-11 xl:px-6">
                                                    Create NFT
                                                </Button>
                                                <Profiledropdown />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </Disclosure>
                )}
                <div
                    className={`${
                        change === false ? ' bottom-0 ' : 'bottom-[130px]   '
                    } fixed left-[50%] flex gap-4 duration-700 -translate-x-[50%] lg:hidden block `}>
                    <OutSideClick
                        onOutsideClick={() => {
                            setChange(false);
                        }}>
                        <p></p>
                    </OutSideClick>
                    <div
                        className="h-[41px] w-[140px] bg-themecolor rounded-[24px] flex gap-2 justify-center items-center "
                        onClick={handleCreate}>
                        <i onClick={handleCreate} className="icon-add  text-2xl text-[#14141F]   cursor-pointer"></i>
                        <p className="text-[#14141F] font-Proxima-SemiBold text-base" onClick={handleCreate}>
                            Create NFT
                        </p>
                    </div>

                    <Link legacyBehavior href="/feeds">
                        <a>
                            <div
                                onClick={() => {
                                    setChange(false);
                                }}
                                className="h-[41px] w-[140px]   bg-themecolor rounded-[24px] flex gap-2  items-center justify-center ">
                                <i
                                    // onClick={handleCreate}
                                    className="icon-create  text-lg text-[#14141F] cursor-pointer"></i>
                                <p
                                    className="text-[#14141F] font-Proxima-SemiBold text-base" /*  onClick={handleCreate} */
                                >
                                    Create Post
                                </p>
                            </div>
                        </a>
                    </Link>
                </div>

                <div
                    className={`${
                        explore === false ? ' bottom-0 ' : 'bottom-[130px]   '
                    } fixed left-[22%]  flex flex-col gap-4 duration-700 -translate-x-[22%] lg:hidden block  `}>
                    <OutSideClick
                        onOutsideClick={() => {
                            setExplore(false);
                        }}>
                        <p></p>
                    </OutSideClick>
                    <Link legacyBehavior href="/marketplace">
                        <a>
                            <div className="h-[41px] w-[140px] bg-themecolor rounded-[24px] flex  gap-2 justify-center items-center ">
                                <i className="icon-browse text-3xl text-[#14141F] cursor-pointer"></i>
                                <p className="text-[#14141F] font-Proxima-SemiBold text-base">Browse</p>
                            </div>
                        </a>
                    </Link>

                    <Link legacyBehavior href="/trends">
                        <a>
                            <div className="h-[41px] w-[140px]   bg-themecolor rounded-[24px] flex gap-2  items-center justify-center ">
                                <i className="icon-trends text-4xl text-[#14141F] cursor-pointer"></i>
                                <p
                                    className="text-[#14141F] font-Proxima-SemiBold text-base" /*  onClick={handleCreate} */
                                >
                                    Trends
                                </p>
                            </div>
                        </a>
                    </Link>
                </div>

                <ul className="fixed bottom-0 bg-[#2C2C3E]  lg:hidden block w-full flex  xs:pb-2  justify-around h-[100px] items-center">
                    <Disclosure>
                        {({ open }) => (
                            <nav className="flex items-center justify-between ">
                                <Disclosure.Button
                                    className="lg:hidden block  xs:-mt-[0.07px]  "
                                    onClick={() => {
                                        setChange(false);
                                    }}>
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon
                                            className="block  p-1  ml-1 !h-[30px] text-[#5A6171] rounded-full bg-themecolor"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <MenuIcon
                                            className="block !h-[30px] ml-1   text-[#5A6171]  "
                                            aria-hidden="true"
                                        />
                                    )}
                                    {open ? (
                                        <p
                                            className={`font-Proxima-SemiBold mt-3 text-themecolor text-[14.4px] xs:text-[12px]   `}>
                                            Menu
                                        </p>
                                    ) : (
                                        <p
                                            className={`font-Proxima-SemiBold mt-3 text-[14.4px] xs:text-[12px] !text-[#5A6171]   `}>
                                            Menu
                                        </p>
                                    )}
                                </Disclosure.Button>

                                <Disclosure.Panel className="">
                                    <Disclosure.Button className="w-full  sm:top-28 top-[5.50rem] left-0 fixed sm:h-[calc(100%-189px)] h-[calc(100%-170px)]"></Disclosure.Button>
                                    <div
                                        className={` lg:hidden w-[60%]  sm:h-[calc(100%-189px)] h-[calc(100%-170px)]  overflow-hidden fixed  left-0 sm:top-28 top-[5.50rem]  bg-[#1E1E2C]   block shadow-lg`}>
                                        <ul className="px-6 py-10 space-y-1 ">
                                            {navigation.map((item, i) => (
                                                <span key={i}>
                                                    <li className="border-b border-white last:border-0">
                                                        <Disclosure.Button
                                                            key={item?.name}
                                                            as="a"
                                                            href={item?.href}
                                                            className="!text-white text-[24px] xs:text-xl block px-5 py-3 font-Proxima-SemiBold ">
                                                            {item?.name}
                                                        </Disclosure.Button>
                                                        {/* {item.comming && (
                                                        <span className="px-1 py-1 mb-4 ml-5 text-sm text-white bg-red-500 rounded-sm whitespace-nowrap">
                                                            {item.comming}
                                                        </span>
                                                    )} */}
                                                    </li>
                                                </span>
                                            ))}
                                            {isAuthenticated && (
                                                <li
                                                    onClick={stageRedirect}
                                                    className="mt-4 border-b border-white cursor-pointer last:border-0">
                                                    <a className="!text-white text-[24px] xs:text-xl block px-5 py-3 font-Proxima-SemiBold ">
                                                        Stage
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </Disclosure.Panel>
                            </nav>
                        )}
                    </Disclosure>

                    <li className="mt-3 xs:mt-[1.8px] ">
                        {/* <Link legacyBehavior href="/marketplace"> */}
                        <a className="flex flex-col items-center ">
                            <i
                                onClick={() => {
                                    setExplore(!explore);
                                    setChange(false);
                                }}
                                className={`
                                    ${
                                        explore ? '!text-themecolor' : '!text-[#5A6171]'
                                    }  icon-nft  !text-4xl  cursor-pointer`}></i>
                            <p
                                className={`
                                  ${explore ? '!text-themecolor' : '!text-[#5A6171]'} 
                                
                                font-Proxima-SemiBold  mt-3 xs:text-[12px]   `}>
                                Explore
                            </p>
                        </a>
                        {/* </Link> */}
                    </li>

                    <li className="relative flex items-center justify-center w-20 h-20 mt-1 rounded-full bg-themecolor xs:h-16 xs:w-16 xs:-mt-2">
                        <i
                            onClick={() => {
                                setChange(!change);
                                setExplore(false);
                            }}
                            className={`${
                                change == false ? 'icon-plus-bold  ' : 'icon-cancel-bold'
                            } !text-[20px] relative text-[#43434C]  cursor-pointer  p-4 xs:p-3 border border-[#000000] rounded-full`}></i>
                    </li>
                    <li className="mt-3 xs:mt-0 ">
                        <Link
                            legacyBehavior
                            href={{
                                pathname: '/feeds',
                                query: { bottom: true } // the data
                            }}
                            //   href="/feeds"
                        >
                            <a className="flex flex-col items-center">
                                <i
                                    onClick={() => {
                                        setChange(false);
                                    }}
                                    className={` ${
                                        router.pathname === '/feeds' ? '!text-themecolor' : '!text-[#5A6171]'
                                    } icon-feed !text-4xl cursor-pointer text-[#5A6171] `}></i>
                                <p
                                    className={`
                                ${router.pathname === '/feeds' ? '!text-themecolor' : '!text-[#5A6171]'}
                                
                                font-Proxima-SemiBold mt-3 xs:text-[12px]   `}>
                                    Feed
                                </p>
                            </a>
                        </Link>
                    </li>

                    <li className="mt-3 xs:mt-0">
                        <a
                            className="flex flex-col items-center"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    setPopup(true);
                                    setState(1);
                                } else {
                                    router.push('/mobileviewchat');
                                }

                                setChange(false);
                            }}>
                            <i
                                className={`icon-message-1 !text-[30px]  relative cursor-pointer ${
                                    router.pathname === '/mobileviewchat' ? '!text-themecolor' : '!text-[#5A6171]'
                                } `}>
                                {chat?.rooms?.unread > 0 && (
                                    <i className="not-italic w-[25px] h-[25px] rounded-full bg-red-600 text-white absolute  right-[-8px]  top-[-6px] font-Proxima-SemiBold text-base flex items-center justify-center z-[2]">
                                        {chat?.rooms?.unread}
                                    </i>
                                )}
                            </i>

                            <p
                                className={`
                             ${router.pathname === '/mobileviewchat' ? '!text-themecolor' : '!text-[#5A6171]'}
                            font-Proxima-SemiBold mt-3  xs:text-[12px]  `}>
                                Messages
                            </p>
                        </a>
                    </li>
                </ul>
                {state && (
                    <Popups
                        show={popup}
                        hide={setPopup}
                        state={state}
                        setstate={setState}
                        data={{ flow: METAMASK_POPUP.create }}
                        setPopup={undefined}
                    />
                )}
            </header>
        </>
    );
};
