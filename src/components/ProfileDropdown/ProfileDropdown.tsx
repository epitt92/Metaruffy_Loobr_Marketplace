import { Fragment, useMemo } from 'react';
import { Menu, Switch, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Button from '../Button/Button';
import Popups from '../popup/poups';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/actions';
import useMetaMask from '../../hooks/useMetaMask';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import router from 'next/router';
import { persistor } from '../../redux/store';
import { METAMASK_POPUP, TRANSFORMATION_NAMES } from '../../constants/enums';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { getMarketDetailsByChainId } from '../../utils/functions';
import { _io } from '../../services/socket.service';
import { CLEAR_CHAT } from '../../redux/messages/actionTypes';
import ImageComponent from '../Image/ImageComponent';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function Profiledropdown() {
    const { chainId }: any = useWeb3React();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [btns, showbtn] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { connect, disconnect, isActive, account, balance, USDTBalance, LoobrBalance, mrBalance }: any =
        useMetaMask();
    const user = useSelector((state: any) => state.auth.user);
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);
    const usdtPrice = useSelector((state: any) => state.nft.usdtPrice);
    const bnbPrice = useSelector((state: any) => state.nft.bnbPrice);
    const ethPrice = useSelector((state: any) => state.nft.ethPrice);
    const currencyRate = useSelector((state: any) => state.nft.currencyRate);
    const ss = useSelector((state: any) => state.nft);

    const dispatch = useDispatch();

    const handleLogout = () => {
        _io.emit('LOGOUT_USER', { user: user?.userId });
        // dispatch(CLEAR_CHAT);
        dispatch({
            type: CLEAR_CHAT
        });
        dispatch(logout());
    };
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const results = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/delete-account-request`);
            toast.success('Your request has been recieved.');
            setDeleteLoading(false);
            setState(-1);
        } catch (error) {
            setDeleteLoading(false);
            toast.error('Something went wrong.');
        }
    };

    const chainInfo: any = useMemo(() => getMarketDetailsByChainId(chainId), [chainId]);

    const initData = {
        flow: METAMASK_POPUP.profile,
        heading: 'Delete Account',
        onDelete: handleDelete,
        loading: deleteLoading
    };
    const [data, setData] = useState(initData);

    return (
        <div className="flex ">
            <Menu as="div" className="relative inline-block text-left ">
                <div className="flex items-center">
                    <Menu.Button className="border-gray-600 ">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <figure className="relative flex items-center justify-center rounded-full h-14 w-14 sm:w-14 sm:h-14 UerProfileImage">
                                    {user?.avatar ? (
                                        <ImageComponent
                                            className="rounded-full "
                                            src={user?.avatar}
                                            alt=""
                                            height={56}
                                            width={56}
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        />
                                    ) : (
                                        <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                    {user && user.isVerfied && (
                                        <span className="absolute flex justify-end md:ml-4">
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
                                                        <stop offset="0.484375" stopColor="#ECDB88" />
                                                        <stop offset="0.994792" stopColor="#AA601B" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </span>
                                    )}
                                </figure>
                            </div>
                        </div>
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="z-50 absolute top-[71px] w-[260px] right-0 rounded-[12px] shadow-[0px 0px 50px rgba(0, 0, 0, 0.15)] px-4 py-5 bg-[#23232e] divide-y divide-gray-100 focus:outline-none">
                        <div className="!border-0">
                            <Menu.Item>
                                {/* <Link legacyBehavior href="/profile/me"> */}
                                <div className="flex items-center justify-between mb-5">
                                    <div
                                        className=""
                                        onClick={() => {
                                            router.push(`/profile/${user?.userName}`);
                                        }}>
                                        <a className="flex items-center cursor-pointer">
                                            <figure className="w-[40px] h-[40px] rounded-full UerProfileImage flex items-center justify-center">
                                                {user?.avatar ? (
                                                    <ImageComponent
                                                        className="rounded-full "
                                                        src={user?.avatar}
                                                        alt=""
                                                        height={40}
                                                        width={40}
                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                    />
                                                ) : (
                                                    <p className="flex items-center justify-center w-full h-full text-lg rounded-full bg-themecolor text-black1">
                                                        {user?.firstName?.charAt(0).toUpperCase()}
                                                    </p>
                                                )}
                                            </figure>
                                            <h3 className="text-white text-lg pl-4 pr-3.5">
                                                @{user?.userName}
                                                <span className="block text-[#727279] font-Proxima-Regular text-sm">
                                                    View Profile
                                                </span>
                                            </h3>
                                        </a>
                                    </div>
                                </div>
                                {/* </Link> */}
                            </Menu.Item>
                            {!isActive ? (
                                <div className="mb-[20px]">
                                    {/* <span className="block text-base text-gray6 mb-[15px]">Profile</span> */}
                                    <button
                                        type="button"
                                        className="w-full text-center  bg-[rgba(241,201,74,.2)] text-themecolor block rounded-full h-[40px] tracking-wider font-Proxima-Bold"
                                        onClick={() => {
                                            setPopup(true);
                                            setState(7);
                                        }}>
                                        Connect Wallet
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-[20px]">
                                    <div className="flex justify-between mb-[20px]">
                                        <span className="text-base text-themecolor font-Proxima-Regular">
                                            My Wallet
                                        </span>
                                        <CopyToClipboard
                                            text={account}
                                            onCopy={() => toast.success('Address successfully copied')}>
                                            <button
                                                className="flex items-center text-base font-Proxima-Regular text-gray7"
                                                type="button">
                                                <span className="pr-[8px]">
                                                    {account.slice(0, 4) +
                                                        '...' +
                                                        account.slice(account.length - 4, account.length)}
                                                </span>

                                                <svg
                                                    width="12"
                                                    height="14"
                                                    viewBox="0 0 12 14"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9 3H9.75C10.9926 3 12 4.00736 12 5.25V11.25C12 12.4926 10.9926 13.5 9.75 13.5H5.25C4.00736 13.5 3 12.4926 3 11.25V10.5H2.25C1.00736 10.5 0 9.49264 0 8.25V2.25C0 1.00736 1.00736 0 2.25 0H6.75C7.99264 0 9 1.00736 9 2.25V3ZM6.75 1.5H2.25C1.83579 1.5 1.5 1.83579 1.5 2.25V8.25C1.5 8.66421 1.83579 9 2.25 9H3V5.25C3 4.00736 4.00736 3 5.25 3H7.5V2.25C7.5 1.83579 7.16421 1.5 6.75 1.5ZM5.25 4.5H9.75C10.1642 4.5 10.5 4.83579 10.5 5.25V11.25C10.5 11.6642 10.1642 12 9.75 12H5.25C4.83579 12 4.5 11.6642 4.5 11.25V5.25C4.5 4.83579 4.83579 4.5 5.25 4.5Z"
                                                        fill="#818182"
                                                    />
                                                </svg>
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                    <div className="border-1 border border-[#2B2B35] rounded-2xl  w-full  pt-[10px] pb-[10px] pl-[15px] pr-[10px]">
                                        <div className="flex  justify-between items-center mb-[16px]">
                                            <span className="block text-sm text-white ">Total Balance</span>
                                            <i
                                                onClick={() => {
                                                    setState(86);
                                                    setPopup(true);
                                                }}
                                                className=" !text-white text-sm  p-2 rounded-full  cursor-pointer bg-gray-700">
                                                {/* <button className="" type="button"> */}
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M0.25 11C0.25 5.08579 5.08579 0.25 11 0.25C16.9142 0.25 21.75 5.08579 21.75 11C21.75 16.9142 16.9142 21.75 11 21.75C5.08579 21.75 0.25 16.9142 0.25 11ZM11 1.75C5.91421 1.75 1.75 5.91421 1.75 11C1.75 16.0858 5.91421 20.25 11 20.25C16.0858 20.25 20.25 16.0858 20.25 11C20.25 5.91421 16.0858 1.75 11 1.75ZM11 6.25C11.4142 6.25 11.75 6.58579 11.75 7V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H11.75V15C11.75 15.4142 11.4142 15.75 11 15.75C10.5858 15.75 10.25 15.4142 10.25 15V11.75H7C6.58579 11.75 6.25 11.4142 6.25 11C6.25 10.5858 6.58579 10.25 7 10.25H10.25V7C10.25 6.58579 10.5858 6.25 11 6.25Z"
                                                        fill="#F1C94A"
                                                    />
                                                </svg>
                                                {/* </button> */}
                                            </i>
                                            {/* <Link legacyBehavior href="https://app.uniswap.org/#/swap">
                                                <a target="_blank bd">
                                                    <button className="" type="button">
                                                        <svg
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 22 22"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M0.25 11C0.25 5.08579 5.08579 0.25 11 0.25C16.9142 0.25 21.75 5.08579 21.75 11C21.75 16.9142 16.9142 21.75 11 21.75C5.08579 21.75 0.25 16.9142 0.25 11ZM11 1.75C5.91421 1.75 1.75 5.91421 1.75 11C1.75 16.0858 5.91421 20.25 11 20.25C16.0858 20.25 20.25 16.0858 20.25 11C20.25 5.91421 16.0858 1.75 11 1.75ZM11 6.25C11.4142 6.25 11.75 6.58579 11.75 7V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H11.75V15C11.75 15.4142 11.4142 15.75 11 15.75C10.5858 15.75 10.25 15.4142 10.25 15V11.75H7C6.58579 11.75 6.25 11.4142 6.25 11C6.25 10.5858 6.58579 10.25 7 10.25H10.25V7C10.25 6.58579 10.5858 6.25 11 6.25Z"
                                                                fill="#F1C94A"
                                                            />
                                                        </svg>
                                                    </button>
                                                </a>
                                            </Link> */}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-white font-Proxima-Bold text-xl flex  !w-[200px] justify-between ">
                                                    <div className="flex gap-2">
                                                        <i className="flex-shrink-0 inline-block align-top ">
                                                            {chainInfo && (
                                                                <Image
                                                                    src={chainInfo?.nativePath}
                                                                    width={25}
                                                                    height={25}
                                                                    alt="logo"
                                                                />
                                                            )}
                                                        </i>
                                                        <h5 className="text-white font-Proxima-Bold">
                                                            {chainInfo && chainInfo?.nativeCurrency}
                                                        </h5>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[#a1a1a5] font-Proxima-Regular flex justify-end whitespace-nowrap text-sm braek pt-[2px] ">
                                                            ( $
                                                            {Number(
                                                                Number(currencyRate * balance).toFixed(2)
                                                            ).toLocaleString()}{' '}
                                                            )
                                                        </h3>
                                                        <div className="flex items-center justify-end ">
                                                            {Number(Number(balance).toFixed(2)).toLocaleString()}{' '}
                                                        </div>
                                                        {/* {chainInfo && chainInfo?.nativeCurrency} */}
                                                    </div>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-5 ">
                                            <div>
                                                <h3 className="text-white font-Proxima-Bold text-xl flex w-[200px] justify-between">
                                                    <div className="flex gap-2">
                                                        <i className="flex-shrink-0 inline-block align-top ">
                                                            <Image
                                                                src={'/assets/images/logos/usdt.png'}
                                                                width={25}
                                                                height={25}
                                                                alt="logo"
                                                            />
                                                        </i>
                                                        <h5 className="text-white font-Proxima-Bold">USDT</h5>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[#a1a1a5] flex justify-end font-Proxima-Regular text-sm  pt-[2px]">
                                                            ( $
                                                            {Number(
                                                                Number(usdtPrice * USDTBalance).toFixed(2)
                                                            ).toLocaleString()}{' '}
                                                            )
                                                        </h3>
                                                        <div className="flex justify-end ">
                                                            {Number(USDTBalance).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </h3>
                                            </div>
                                            {/* <button className="" type="button">
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M0.25 11C0.25 5.08579 5.08579 0.25 11 0.25C16.9142 0.25 21.75 5.08579 21.75 11C21.75 16.9142 16.9142 21.75 11 21.75C5.08579 21.75 0.25 16.9142 0.25 11ZM11 1.75C5.91421 1.75 1.75 5.91421 1.75 11C1.75 16.0858 5.91421 20.25 11 20.25C16.0858 20.25 20.25 16.0858 20.25 11C20.25 5.91421 16.0858 1.75 11 1.75ZM11 6.25C11.4142 6.25 11.75 6.58579 11.75 7V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H11.75V15C11.75 15.4142 11.4142 15.75 11 15.75C10.5858 15.75 10.25 15.4142 10.25 15V11.75H7C6.58579 11.75 6.25 11.4142 6.25 11C6.25 10.5858 6.58579 10.25 7 10.25H10.25V7C10.25 6.58579 10.5858 6.25 11 6.25Z"
                                                        fill="#F1C94A"
                                                    />
                                                </svg>
                                            </button> */}
                                        </div>
                                        <div className="flex items-center justify-between mt-5 ">
                                            <div>
                                                <h3 className="text-white font-Proxima-Bold text-xl flex w-[200px] justify-between">
                                                    <div className="flex gap-2 ">
                                                        <i className="flex-shrink-0 inline-block align-top ">
                                                            <Image
                                                                src={'/assets/images/logos/mr-logo.png'}
                                                                width={25}
                                                                height={25}
                                                                alt="logo"
                                                            />
                                                        </i>
                                                        <h5 className="text-white font-Proxima-Bold">MR</h5>
                                                        <i
                                                            onClick={() => {
                                                                setState(85);
                                                                setPopup(true);
                                                            }}>
                                                            {/* <button className="" type="button"> */}
                                                            <svg
                                                                className="cursor-pointer mt-[.8px]"
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 22 22"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M0.25 11C0.25 5.08579 5.08579 0.25 11 0.25C16.9142 0.25 21.75 5.08579 21.75 11C21.75 16.9142 16.9142 21.75 11 21.75C5.08579 21.75 0.25 16.9142 0.25 11ZM11 1.75C5.91421 1.75 1.75 5.91421 1.75 11C1.75 16.0858 5.91421 20.25 11 20.25C16.0858 20.25 20.25 16.0858 20.25 11C20.25 5.91421 16.0858 1.75 11 1.75ZM11 6.25C11.4142 6.25 11.75 6.58579 11.75 7V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H11.75V15C11.75 15.4142 11.4142 15.75 11 15.75C10.5858 15.75 10.25 15.4142 10.25 15V11.75H7C6.58579 11.75 6.25 11.4142 6.25 11C6.25 10.5858 6.58579 10.25 7 10.25H10.25V7C10.25 6.58579 10.5858 6.25 11 6.25Z"
                                                                    fill="#F1C94A"
                                                                />
                                                            </svg>
                                                            {/* </button> */}
                                                        </i>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[#a1a1a5] flex justify-end font-Proxima-Regular text-sm  pt-[2px]">
                                                            ( $
                                                            {Number(
                                                                Number(0.00000824 * mrBalance).toFixed(2)
                                                            ).toLocaleString()}{' '}
                                                            )
                                                        </h3>
                                                        <div className="flex justify-end ">
                                                            {Number(mrBalance).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </h3>
                                            </div>
                                            {/* <button className="" type="button">
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M0.25 11C0.25 5.08579 5.08579 0.25 11 0.25C16.9142 0.25 21.75 5.08579 21.75 11C21.75 16.9142 16.9142 21.75 11 21.75C5.08579 21.75 0.25 16.9142 0.25 11ZM11 1.75C5.91421 1.75 1.75 5.91421 1.75 11C1.75 16.0858 5.91421 20.25 11 20.25C16.0858 20.25 20.25 16.0858 20.25 11C20.25 5.91421 16.0858 1.75 11 1.75ZM11 6.25C11.4142 6.25 11.75 6.58579 11.75 7V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H11.75V15C11.75 15.4142 11.4142 15.75 11 15.75C10.5858 15.75 10.25 15.4142 10.25 15V11.75H7C6.58579 11.75 6.25 11.4142 6.25 11C6.25 10.5858 6.58579 10.25 7 10.25H10.25V7C10.25 6.58579 10.5858 6.25 11 6.25Z"
                                                        fill="#F1C94A"
                                                    />
                                                </svg>
                                            </button> */}
                                        </div>

                                        <Link legacyBehavior href="/">
                                            <a>
                                                <button
                                                    className="w-full text-center border border-gray6 rounded-full text-gray6 text-sm leading-7 mt-[20px]"
                                                    onClick={disconnect}>
                                                    <h6 className="text-sm leading-7">Disconnect</h6>
                                                </button>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <Menu.Item>
                                {({ active }) => (
                                    <Link legacyBehavior href="javascript:void(0)">
                                        <a>
                                            <div
                                                className="flex items-center gap-3 cursor-pointer"
                                                onClick={() => {
                                                    if (user?.referral) {
                                                        router.push('affiliate');
                                                    } else {
                                                        setState(94);
                                                        setPopup(true);
                                                    }
                                                }}>
                                                <i className="icon-affiliate !text-themecolor text-2xl  flex-shrink-0 cursor-pointer"></i>
                                                <h6 className="text-white text-basic font-Proxima-Bold ">Affiliate</h6>
                                            </div>
                                        </a>
                                    </Link>
                                )}
                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <Link legacyBehavior href="/">
                                        <a>
                                            <div
                                                className="flex items-center w-1/2 gap-3 mt-4"
                                                onClick={() => {
                                                    setState(53);
                                                    setPopup(true);
                                                }}>
                                                <i className="icon-settings !text-themecolor text-2xl  flex-shrink-0 cursor-pointer"></i>
                                                <h6 className="text-white text-basic font-Proxima-Bold">Settings</h6>
                                            </div>
                                        </a>
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <Link legacyBehavior href="/">
                                        <a>
                                            <button
                                                className={classNames(
                                                    active ? ' !text-white' : '!text-white',
                                                    'text-base  flex w-full items-center border-0 mt-4 '
                                                )}>
                                                <div
                                                    className="flex items-center w-1/2 gap-3 "
                                                    onClick={() => {
                                                        handleLogout();
                                                    }}>
                                                    <i className="icon-logout !text-themecolor ml-1 text-xl flex flex-shrink-0 cursor-pointer"></i>
                                                    <h6 className=" text-basic font-Proxima-Bold">Logout</h6>
                                                </div>
                                            </button>
                                        </a>
                                    </Link>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={data}
                    setData={setData}
                    setPopup={undefined}
                />
            )}
        </div>
    );
}
