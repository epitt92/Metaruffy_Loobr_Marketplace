import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Popups from '../../components/popup/poups';
import Tabs from './TabsPanel';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';
import { connectRoom } from '../../redux/messages/actions';
import { Follow } from '../../components/Follow/follow';
import { userService } from '../../services/user.service';
import { getLoobrScore, getUserByUserName, getUserStats } from '../../redux/user/actions';
import { getUser } from '../../redux/auth/actions';
import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Volumetraded from '../../components/volumetrade/Volumetraded';
import { CLEAR_USER_DATA } from '../../redux/user/actionTypes';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import Loader from '../../components/loader/Loader';
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), {
    ssr: false
});

const UserProfileModule = () => {
    const router = useRouter();
    const { username } = router.query;

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [followers, setFollowers] = useState<Number>();
    const [chatToggle, setChatToggle] = useState(false);
    const [reciever, setReciever] = useState<string>('');
    const [data, setData] = useState<any>();
    const [other, setOther] = useState<boolean>(true);
    const [confirm, setConfirm] = useState<Boolean>(false);
    const [type, setType] = useState<string>('');
    const [loadingBlock, setLoadingBlock] = useState<boolean>(false);
    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }
    // const user = useSelector((state: any) => state.user.user);
    const authUser = useSelector((state: any) => state.auth.user);
    const user = useSelector((state: any) => state.user.user);
    const userLoading = useSelector((state: any) => state.user.userLoading);
    const onlineUsers = useSelector((state: any) => state.auth.onlineUser);
    const stats = useSelector((state: any) => state.user.stats);
    const statsLoading = useSelector((state: any) => state.user.statsLoading);

    const loobrScore = useSelector((state: any) => state.user.loobrScore);
    const scoreLoading = useSelector((state: any) => state.user.scoreLoading);

    const dispatch = useDispatch();
    useEffect(() => {
        username && dispatch(getUserByUserName(username));
        // authUser && authUser.userId && dispatch(getUser());
    }, [dispatch, username]);

    useEffect(() => {
        if (username && authUser && username == authUser?.userName) {
            // router.push('/profile/me');
        }
    }, [dispatch, username]);

    useEffect(() => {
        if (user) {
            dispatch(getUserStats(user?._id));
            dispatch(getLoobrScore(user?._id));
        }
        if (user && user?.followers) {
            setFollowers(user?.followers?.length);
        } else {
            setFollowers(0);
        }
    }, [user]);
    useEffect(() => {
        return () => {
            dispatch({
                type: CLEAR_USER_DATA
            });
        };
    }, []);

    const conectRoom = (id: any) => {
        if (authUser && authUser.userId) {
            if (
                (user?.settings.messagePrivacy == 'FOLLOW' &&
                    (user?.followers?.includes(authUser?.userId) || user?.following?.includes(authUser?.userId))) ||
                user?.settings.messagePrivacy == 'EVERYONE'
            ) {
                dispatch(
                    connectRoom({
                        recievedBy: id,
                        type: 'PRIVATE'
                    })
                );
                setReciever(id);
                setChatToggle(true);
            }
        } else {
            setPopup(true);
            setState(1);
        }
    };

    const handleSlicedAddress = (address: string) => {
        return address?.slice(0, 8) + '...' + address?.slice(address?.length - 4, address?.length);
    };
    const BlockUser = async () => {
        setLoadingBlock(true);
        await userService.blockUser(user._id);

        setConfirm(true);
        // id && dispatch(getUserById(id));
        // authUser && authUser.userId && dispatch(getUser());
    };
    useEffect(() => {
        if (confirm) {
            setConfirm(false);
            username && dispatch(getUserByUserName(username));
            // id && dispatch(getUserById(id));
            authUser && authUser.userId && dispatch(getUser());
            setTimeout(() => {
                setLoadingBlock(false);
            }, 5000);
        }
    }, [confirm]);
    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };
    const checkmessageAllowed = () => {
        if (
            user?.settings?.messagePrivacy == 'FOLLOW' &&
            (user?.followers?.includes(authUser?.userId) || user?.following?.includes(authUser?.userId))
        ) {
            return true;
        } else if (user?.settings?.messagePrivacy == 'EVERYONE') {
            return true;
        } else {
            return false;
        }
    };
    return (
        <>
            <Head>
                <title>LooBr | Profile</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="mb-8 AtthemeImage">
                <figure className="h-[350px] w-full relative">
                    <ImageComponent
                        src={user?.coverImage}
                        defaultPlaceholder={'/assets/images/collectionimages/cover.jpg'}
                        objectFit="cover"
                        layout="fill"
                        quality={50}
                        alt=""
                    />
                </figure>
            </div>
            <div className="container pb-[150px] ">
                <div className="flex lg:flex-row flex-col gap-10 ">
                    <div className="xl:-mt-52 sm:-mt-28 -mt-36 z-10">
                        <div className="lg:w-[23.75rem]     border  border-[#2B2B35] bg-[#14141F] xs:bg-transparent xs:border-none px-33 pb-[20px] pt-[1.081rem] rounded-3xl text-center">
                            <div className="">
                                {authUser &&
                                    authUser?.userId &&
                                    user?.blockedBy?.includes(authUser?.userId) &&
                                    username == user?.userName && (
                                        <div className="flex items-center justify-center xs:hidden block px-8 gap-x-3 pb-[30px] ">
                                            <button type="button" className="flex items-center justify-center gap-x-2">
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 22 22"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                                                        stroke="#E00707"
                                                        strokeWidth="2"
                                                    />
                                                    <path d="M4 18L18 4" stroke="#E00707" strokeWidth="2" />
                                                </svg>
                                                <span className="text-[#e00707] text-base font-Proxima-Regular">
                                                    User Blocked
                                                </span>
                                            </button>
                                            <button
                                                disabled={loadingBlock}
                                                type="button"
                                                className="text-white underline text-base font-Proxima-Regular"
                                                onClick={BlockUser}>
                                                Unblock
                                            </button>
                                        </div>
                                    )}

                                <figure className="mx-auto  w-[140px] h-[140px] relative  AtthemeImage border-[10px] border-[#2B2B35] rounded-full">
                                    {userLoading ? (
                                        <div className="flex justify-center  h-full ">
                                            <div className=" w-[70px] h-[70px]  -mt-2">
                                                <Loader />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {!checkblocked(user, authUser?.userId) && authUser && authUser.userId && (
                                                <i
                                                    className={`w-[25px] rounded-full h-[25px] block absolute border-2 border-white left-[10px] bottom-0 z-10 ${
                                                        onlineUsers.includes(user?._id)
                                                            ? 'bg-[#0e750e]'
                                                            : 'bg-[#646465]'
                                                    }`}></i>
                                            )}
                                            {user?.avatar ? (
                                                <ImageComponent
                                                    src={user.avatar}
                                                    transformation={TRANSFORMATION_NAMES.fit_150x150}
                                                    layout="fill"
                                                    objectFit="contain"
                                                    alt=""
                                                    className="rounded-full"
                                                    isUserProfile
                                                    user={user}
                                                    size={7}
                                                />
                                            ) : (
                                                <p className="w-full h-full bg-themecolor text-6xl contain flex items-center justify-center rounded-full text-black1">
                                                    {user?.firstName.charAt(0).toUpperCase()}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </figure>
                                <div className="mt-3 flex text-center  justify-center items-center   ">
                                    <div>
                                        <h2 className="text-[#FFFFFF] text-center  text-[1.75rem] braek pr-5 pl-5 flex items-center ">
                                            {user?.firstName} {user?.lastName}
                                            {user && user.isVerfied && (
                                                <span className="flex ml-2 items-center justify-center rounded-lg relative Atpricehoverholder hover:border-themecolo">
                                                    <span className="Atpricehover  font-Proxima-Regular whitespace-nowrap">
                                                        verified
                                                    </span>
                                                    <svg
                                                        width="25"
                                                        height="25"
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
                                        </h2>
                                        <h2 className="text-[#737373]    text-center text-[18px] break pr-5 pl-5 font-Proxima-Regular -mt-2">
                                            @{user?.userName}
                                        </h2>
                                        {user?.country && (
                                            <h2 className="text-white     text-center text-[18px] break pr-5 pl-5 font-Proxima-Regular -mt-1">
                                                {user?.country?.name} {user?.country?.flag}
                                            </h2>
                                        )}
                                    </div>
                                </div>
                                {!user?.hideWallet && user?.wallets[0]?.address && (
                                    <div className="relative flex items-center  justify-center mb-[1.875rem] pl-5 pr-5">
                                        <span className="text-[#FFFFFF]  text-sm border-2 border-[#2B2B35] px-6 py-[6px] rounded-lg">
                                            {(user && handleSlicedAddress(user?.wallets[0]?.address)) || ''}
                                        </span>
                                        <CopyToClipboard
                                            text={user?.wallets[0]?.address}
                                            onCopy={() => toast.success('Address successfully copied')}>
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="cursor-pointer ml-3 copy">
                                                <path
                                                    d="M15 11.6916V15.7199C15 19.0768 13.6 20.4196 10.1 20.4196H5.9C2.4 20.4196 1 19.0768 1 15.7199V11.6916C1 8.33461 2.4 6.99183 5.9 6.99183H10.1M15 11.6916C15 8.33461 13.6 6.99183 10.1 6.99183M15 11.6916V14.6648H16.1C19.6 14.6648 21 13.3221 21 9.96512V5.93679C21 2.57984 19.6 1.23706 16.1 1.23706H11.9C8.4 1.23706 7 2.57984 7 5.93679V6.99183H10.1"
                                                    stroke="#A1A1A5"
                                                />
                                            </svg>
                                        </CopyToClipboard>
                                    </div>
                                )}

                                {!checkblocked(user, authUser?.userId) && (
                                    <div className="relative  items-center flex justify-center gap-3 mb-8">
                                        {user && user._id && (
                                            <Follow
                                                userModule={true}
                                                otherUser={user && user}
                                                followers={followers}
                                                setFollowers={setFollowers}
                                                setConfirm={setConfirm}
                                            />
                                        )}

                                        {authUser && authUser.userId && user && user._id && checkmessageAllowed() && (
                                            <Button
                                                className="w-[3.375rem] h-[3.188rem] cursor-pointer bg-transparent !p-0 !border !border-[#a1a1a1] hover:bg-[#1F1F2C] key rounded-full lg:flex justify-center items-center  "
                                                onClick={() => {
                                                    let dimentions = getWindowSize();
                                                    if (dimentions.innerWidth < 1024) {
                                                        router.push('/mobileviewchat');
                                                    }
                                                    conectRoom(user && user._id);
                                                }}>
                                                <svg
                                                    className="key2"
                                                    width="26"
                                                    height="26"
                                                    viewBox="0 0 26 26"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M1.63334 12.5307C1.61235 14.7563 2.04772 16.6128 2.98006 18.3482C3.0195 18.4159 3.04347 18.4915 3.05025 18.5696C3.05704 18.6477 3.04648 18.7263 3.01933 18.7998C2.56207 20.2686 2.11068 21.7386 1.66516 23.2096C1.49995 23.7513 1.77891 24.2537 2.3199 24.3411C2.51166 24.3609 2.7053 24.3315 2.88256 24.2557C4.17263 23.7493 5.45909 23.2336 6.74194 22.7086C6.80907 22.6769 6.88338 22.6636 6.95734 22.6699C7.0313 22.6762 7.10227 22.7019 7.16308 22.7445C11.512 25.3174 16.8609 24.817 20.6147 21.4438C22.8355 19.4478 24.0902 16.9331 24.3387 13.9505C24.7449 9.00782 22.0494 4.43074 17.4568 2.53965C13.2115 0.792772 9.2099 1.41095 5.66266 4.33324C3.02678 6.49991 1.77011 9.39512 1.63334 12.5307ZM3.6998 22.1778C4.02954 21.0802 4.32678 20.0328 4.66329 18.9995C4.80954 18.552 4.7574 18.187 4.52787 17.774C3.19537 15.3832 2.88662 12.8523 3.64766 10.2239C5.22527 4.77334 10.969 1.82803 16.3497 3.68256C21.4719 5.44907 24.208 11.2124 22.3365 16.2946C20.1272 22.2963 13.0246 24.6539 7.66954 21.1533C7.2897 20.9055 6.94574 20.8649 6.52933 21.0409C5.61256 21.4282 4.68292 21.7851 3.6998 22.1778Z"
                                                        fill="#A1A1A5"
                                                    />
                                                    <path
                                                        d="M17.0664 13.0074C17.0687 13.3285 17.1661 13.6417 17.3462 13.9075C17.5264 14.1733 17.7812 14.3798 18.0786 14.5009C18.376 14.622 18.7026 14.6522 19.0172 14.5879C19.3318 14.5235 19.6203 14.3673 19.8462 14.1391C20.0721 13.911 20.2253 13.621 20.2866 13.3058C20.3478 12.9905 20.3143 12.6643 20.1902 12.3681C20.0662 12.0719 19.8572 11.8191 19.5896 11.6416C19.322 11.4642 19.0078 11.3699 18.6867 11.3709C18.4727 11.3715 18.261 11.4143 18.0636 11.497C17.8663 11.5797 17.6872 11.7005 17.5366 11.8525C17.3861 12.0046 17.2671 12.1849 17.1864 12.3831C17.1057 12.5812 17.0649 12.7934 17.0664 13.0074Z"
                                                        fill="#A1A1A5"
                                                    />
                                                    <path
                                                        d="M13.0129 14.6203C13.3339 14.6178 13.647 14.5202 13.9126 14.3399C14.1783 14.1596 14.3845 13.9046 14.5054 13.6072C14.6263 13.3098 14.6564 12.9832 14.5918 12.6687C14.5273 12.3542 14.3711 12.0659 14.1428 11.8401C13.9146 11.6143 13.6246 11.4612 13.3094 11.4001C12.9942 11.339 12.668 11.3726 12.3719 11.4966C12.0758 11.6207 11.8231 11.8298 11.6457 12.0973C11.4683 12.3649 11.3741 12.679 11.375 13.0001C11.3756 13.2141 11.4185 13.426 11.5013 13.6234C11.584 13.8209 11.705 14 11.8572 14.1506C12.0094 14.3012 12.1898 14.4202 12.3882 14.5008C12.5865 14.5814 12.7988 14.622 13.0129 14.6203Z"
                                                        fill="#A1A1A5"
                                                    />
                                                    <path
                                                        d="M7.3246 11.3709C7.00342 11.3685 6.68874 11.4613 6.42029 11.6377C6.15185 11.814 5.94168 12.066 5.81634 12.3617C5.691 12.6574 5.65611 12.9837 5.71607 13.2992C5.77603 13.6147 5.92815 13.9054 6.15322 14.1346C6.37829 14.3637 6.66622 14.521 6.98064 14.5866C7.29506 14.6522 7.62186 14.6231 7.91978 14.5031C8.21769 14.3831 8.47336 14.1775 8.65448 13.9122C8.8356 13.647 8.93406 13.334 8.93741 13.0128C8.93964 12.799 8.89966 12.5869 8.81976 12.3886C8.73986 12.1903 8.62161 12.0097 8.47178 11.8571C8.32196 11.7046 8.1435 11.5831 7.94664 11.4997C7.74978 11.4163 7.5384 11.3725 7.3246 11.3709Z"
                                                        fill="#A1A1A5"
                                                    />
                                                </svg>
                                            </Button>
                                        )}
                                    </div>
                                )}
                                <div className="mb-[1rem] pl-5 -mt-2 pr-5">
                                    <p className="text-white  braek">
                                        {'Since '}
                                        {moment(user?.createdAt, 'YYYY/MM/DD').format('MMMM YYYY')}{' '}
                                    </p>

                                    <div className="hidden xs:block xs: mt-4 ">
                                        {authUser &&
                                            authUser?.userId &&
                                            user?.blockedBy?.includes(authUser?.userId) &&
                                            username == user?.userName && (
                                                <div className="flex items-center justify-center px-8 gap-x-3 pb-[30px] ">
                                                    <button
                                                        type="button"
                                                        className="flex items-center justify-center gap-x-2">
                                                        <svg
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 22 22"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                                                                stroke="#E00707"
                                                                strokeWidth="2"
                                                            />
                                                            <path d="M4 18L18 4" stroke="#E00707" strokeWidth="2" />
                                                        </svg>
                                                        <span className="text-[#e00707] text-base font-Proxima-Regular">
                                                            User Blocked
                                                        </span>
                                                    </button>
                                                    <button
                                                        disabled={loadingBlock}
                                                        type="button"
                                                        className="text-white underline text-base font-Proxima-Regular"
                                                        onClick={BlockUser}>
                                                        Unblock
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="px-8 pb-4">
                                    <div className="mt-4 pt-4 flex gap-3 mx-6 justify-center">
                                        <a
                                            href={user && user.discord ? `https://discord.com/${user?.discord}` : '#'}
                                            target={user && user.discord && '_blank'}>
                                            <svg
                                                className={`${
                                                    user && user.discord ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.discord ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M22.6625 9.88571C21.4433 9.31738 20.1233 8.90488 18.7483 8.66655C18.7363 8.66616 18.7243 8.66842 18.7132 8.67317C18.7021 8.67793 18.6922 8.68505 18.6842 8.69405C18.5192 8.99655 18.3266 9.39071 18.1983 9.69321C16.7399 9.47321 15.2567 9.47321 13.7983 9.69321C13.67 9.38155 13.4775 8.99655 13.3033 8.69405C13.2942 8.67571 13.2666 8.66655 13.2391 8.66655C11.8642 8.90488 10.5533 9.31738 9.32498 9.88571C9.31582 9.88571 9.30665 9.89488 9.29748 9.90405C6.80415 13.6349 6.11665 17.2649 6.45582 20.8582C6.45582 20.8765 6.46498 20.8949 6.48332 20.904C8.13332 22.114 9.71915 22.8474 11.2867 23.3332C11.3142 23.3424 11.3417 23.3332 11.3508 23.3149C11.7175 22.8107 12.0475 22.279 12.3317 21.7199C12.35 21.6832 12.3317 21.6465 12.295 21.6374C11.7725 21.4357 11.2775 21.1974 10.7917 20.9224C10.755 20.904 10.755 20.849 10.7825 20.8215C10.8833 20.7482 10.9842 20.6657 11.085 20.5924C11.1033 20.574 11.1308 20.574 11.1492 20.5832C14.3025 22.0224 17.7033 22.0224 20.82 20.5832C20.8383 20.574 20.8658 20.574 20.8841 20.5924C20.985 20.6749 21.0858 20.7482 21.1866 20.8307C21.2233 20.8582 21.2233 20.9132 21.1775 20.9315C20.7008 21.2157 20.1967 21.4449 19.6742 21.6465C19.6375 21.6557 19.6283 21.7015 19.6375 21.729C19.9308 22.2882 20.2608 22.8199 20.6183 23.324C20.6458 23.3332 20.6733 23.3424 20.7008 23.3332C22.2775 22.8474 23.8633 22.114 25.5133 20.904C25.5316 20.8949 25.5408 20.8765 25.5408 20.8582C25.9441 16.7057 24.8716 13.1032 22.6991 9.90405C22.69 9.89488 22.6808 9.88571 22.6625 9.88571V9.88571ZM12.8083 18.6674C11.8642 18.6674 11.0758 17.7965 11.0758 16.724C11.0758 15.6515 11.8458 14.7807 12.8083 14.7807C13.78 14.7807 14.55 15.6607 14.5408 16.724C14.5408 17.7965 13.7708 18.6674 12.8083 18.6674ZM19.1975 18.6674C18.2533 18.6674 17.465 17.7965 17.465 16.724C17.465 15.6515 18.235 14.7807 19.1975 14.7807C20.1691 14.7807 20.9391 15.6607 20.93 16.724C20.93 17.7965 20.1691 18.6674 19.1975 18.6674Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            href={
                                                user && user.facebook ? `https://facebook.com/${user?.facebook}` : '#'
                                            }
                                            target={user && user.facebook && '_blank'}>
                                            <svg
                                                className={`${
                                                    user && user.facebook ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.facebook ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M20.5833 8.20832C20.5833 8.08676 20.535 7.97018 20.4491 7.88423C20.3631 7.79828 20.2466 7.74999 20.125 7.74999H17.8333C16.6794 7.6925 15.5495 8.0941 14.6907 8.86702C13.8319 9.63994 13.314 10.7214 13.25 11.875V14.35H10.9583C10.8368 14.35 10.7202 14.3983 10.6342 14.4842C10.5483 14.5702 10.5 14.6868 10.5 14.8083V17.1917C10.5 17.3132 10.5483 17.4298 10.6342 17.5157C10.7202 17.6017 10.8368 17.65 10.9583 17.65H13.25V23.7917C13.25 23.9132 13.2983 24.0298 13.3842 24.1157C13.4702 24.2017 13.5868 24.25 13.7083 24.25H16.4583C16.5799 24.25 16.6965 24.2017 16.7824 24.1157C16.8684 24.0298 16.9167 23.9132 16.9167 23.7917V17.65H19.3183C19.4203 17.6515 19.5198 17.6189 19.6011 17.5575C19.6825 17.496 19.741 17.4093 19.7675 17.3108L20.4275 14.9275C20.4457 14.8598 20.4482 14.7888 20.4347 14.7199C20.4211 14.6511 20.392 14.5863 20.3495 14.5305C20.307 14.4748 20.2523 14.4295 20.1895 14.3982C20.1267 14.3669 20.0576 14.3504 19.9875 14.35H16.9167V11.875C16.9395 11.6481 17.046 11.4378 17.2155 11.2853C17.385 11.1327 17.6053 11.0488 17.8333 11.05H20.125C20.2466 11.05 20.3631 11.0017 20.4491 10.9157C20.535 10.8298 20.5833 10.7132 20.5833 10.5917V8.20832Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            href={user && user.twitter ? `https://twitter.com/${user?.twitter}` : '#'}
                                            target={user && user.twitter && '_blank'}>
                                            <svg
                                                className={`${
                                                    user && user.twitter ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.twitter ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M26.6732 9.52561C25.9078 9.86478 25.0855 10.0939 24.2211 10.1975C25.113 9.66384 25.7803 8.82387 26.0985 7.83436C25.2605 8.3321 24.3434 8.68246 23.387 8.8702C22.7438 8.18349 21.8919 7.72833 20.9636 7.57538C20.0352 7.42243 19.0824 7.58026 18.2529 8.02434C17.4235 8.46843 16.7638 9.17394 16.3764 10.0313C15.989 10.8887 15.8955 11.8501 16.1105 12.766C14.4125 12.6808 12.7515 12.2395 11.2351 11.4707C9.71874 10.7019 8.38098 9.62293 7.30862 8.3037C6.94196 8.9362 6.73113 9.66953 6.73113 10.4505C6.73072 11.1536 6.90385 11.8459 7.23518 12.466C7.56651 13.0862 8.04577 13.6149 8.63046 14.0054C7.95238 13.9838 7.28926 13.8006 6.69629 13.4709V13.5259C6.69622 14.512 7.03732 15.4678 7.66171 16.231C8.2861 16.9943 9.15532 17.518 10.1219 17.7133C9.49284 17.8835 8.83335 17.9086 8.19321 17.7866C8.46591 18.6351 8.99712 19.3771 9.71246 19.9086C10.4278 20.4402 11.2915 20.7348 12.1825 20.7511C10.6699 21.9386 8.80177 22.5827 6.87871 22.5799C6.53806 22.58 6.19769 22.5601 5.85938 22.5203C7.81139 23.7754 10.0837 24.4414 12.4044 24.4389C20.2602 24.4389 24.5548 17.9324 24.5548 12.2894C24.5548 12.106 24.5502 11.9209 24.542 11.7375C25.3773 11.1334 26.0984 10.3854 26.6714 9.52836L26.6732 9.52561V9.52561Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            href={user && user.reddit ? `https://www.reddit.com/${user?.reddit}` : '#'}
                                            target={user && user.reddit && '_blank'}>
                                            <svg
                                                className={`${
                                                    user && user.reddit ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.reddit ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M24.7994 16.11C24.7994 15.01 23.9194 14.13 22.8194 14.24C22.3794 14.24 21.8294 14.46 21.4994 14.79C19.9594 13.8 18.1994 13.14 16.3294 13.14L17.2094 8.96L20.0694 9.62C20.0694 10.39 20.7294 10.94 21.4994 10.94C22.2694 10.94 22.8194 10.28 22.8194 9.51C22.8194 8.74 22.1594 8.19 21.3894 8.19C20.8394 8.19 20.3994 8.52 20.1794 8.96L17.0994 8.19H16.8794C16.7694 8.19 16.7694 8.3 16.7694 8.41L15.6694 13.14C13.7994 13.14 12.0394 13.69 10.4994 14.79C9.72937 14.02 8.51937 14.02 7.74937 14.79C6.97938 15.56 6.97938 16.77 7.74937 17.54C7.85937 17.65 8.07937 17.87 8.29937 17.87V18.42C8.29937 21.39 11.7094 23.81 15.9994 23.81C20.2894 23.81 23.6994 21.39 23.6994 18.42V17.87C24.3594 17.54 24.7994 16.88 24.7994 16.11V16.11ZM11.5994 17.54C11.5994 16.77 12.2594 16.22 12.9194 16.22C13.6894 16.22 14.2394 16.88 14.2394 17.54C14.2394 18.2 13.5794 18.86 12.9194 18.86C12.1494 18.86 11.5994 18.31 11.5994 17.54ZM19.2994 21.17C18.3094 21.83 17.2094 22.27 15.9994 22.16C14.7894 22.16 13.6894 21.83 12.6994 21.17C12.5894 21.06 12.5894 20.84 12.6994 20.62C12.8094 20.51 13.0294 20.51 13.1394 20.62C13.9094 21.17 14.8994 21.5 15.8894 21.39C16.8794 21.5 17.8694 21.17 18.6394 20.62C18.7494 20.51 18.9694 20.51 19.1894 20.62C19.4094 20.73 19.4094 20.95 19.2994 21.17ZM18.9694 18.86C18.1994 18.86 17.6494 18.2 17.6494 17.54C17.6494 16.88 18.3094 16.22 18.9694 16.22C19.7394 16.22 20.2894 16.88 20.2894 17.54C20.3994 18.31 19.7394 18.86 18.9694 18.86Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            href={user && user?.web ? user.web : '#'}
                                            target={user && user?.web && '_blank'}>
                                            <svg
                                                className={`${user && user.web ? 'cursor-pointer' : 'cursor-default'}`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.web ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M12.4129 18.4836C12.1905 16.8336 12.1905 15.1612 12.4129 13.5112H19.578C19.8014 15.1612 19.8014 16.8337 19.578 18.4836H12.4129Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M19.3576 12.2359H12.6289C12.9716 10.7827 13.4159 9.39054 14.3622 8.2145C14.6103 7.89415 14.9216 7.62823 15.2768 7.43325C15.7779 7.16815 16.2742 7.18325 16.7648 7.46033C17.2414 7.72908 17.5956 8.12544 17.9003 8.56867C18.5914 9.57492 18.9867 10.7041 19.2768 11.8796C19.3049 11.9942 19.3315 12.1083 19.3576 12.2359Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M12.6328 19.7588H19.3635C19.0411 21.1473 18.6245 22.4854 17.749 23.6213C17.488 23.9523 17.1795 24.2428 16.8333 24.4833C16.276 24.8739 15.6833 24.8307 15.1146 24.4635C14.6917 24.1906 14.3656 23.8213 14.0854 23.4093C13.3318 22.3051 12.9307 21.0619 12.6328 19.7588Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M20.8438 18.4824C21.049 16.8299 21.049 15.1584 20.8438 13.5059H25.0505C25.1281 13.9053 25.226 14.309 25.2839 14.7178C25.4553 15.9326 25.3827 17.1694 25.0703 18.3559C25.0422 18.4647 25.0005 18.5012 24.888 18.5012C23.58 18.4977 22.2722 18.4967 20.9646 18.498C20.924 18.4953 20.8837 18.4901 20.8438 18.4824Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M11.1497 13.5125C10.9447 15.1687 10.9462 16.8441 11.1544 18.5H10.9602C9.69141 18.5 8.42266 18.5 7.15391 18.5C7.01746 18.5 6.95235 18.4729 6.91485 18.3245C6.52055 16.7923 6.52324 15.185 6.92266 13.6541C6.94714 13.5583 6.96485 13.4922 7.09141 13.4927C8.41902 13.4974 9.74766 13.4958 11.0737 13.4968C11.0994 13.5003 11.1248 13.5055 11.1497 13.5125V13.5125Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M24.5812 12.2397H20.6542C20.2135 10.2709 19.6052 8.3777 18.125 6.90374C18.7698 6.85166 20.8979 7.88812 21.9641 8.77874C23.0933 9.71354 23.9894 10.8985 24.5812 12.2397V12.2397Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M11.3435 12.2395H7.41797C7.92719 11.0716 8.67187 10.0212 9.60547 9.15413C10.8253 8.01768 12.2471 7.25934 13.9169 6.85986C12.3961 8.37028 11.7857 10.2635 11.3435 12.2395Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M20.6544 19.7563H24.5805C24.0274 21.022 23.1994 22.1486 22.1565 23.0543C20.9852 24.0761 19.6414 24.7647 18.082 25.1345C19.6003 23.6267 20.2117 21.7355 20.6544 19.7563Z"
                                                    fill="#14141F"
                                                />
                                                <path
                                                    d="M11.3445 19.7563C11.7862 21.7355 12.3971 23.6241 13.9164 25.1329C12.4895 24.8044 11.1589 24.1473 10.0307 23.2139C8.90253 22.2805 8.00786 21.0965 7.41797 19.7563H11.3445Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            href={user && user.tiktok ? `https://www.tiktok.com/${user?.tiktok}` : '#'}
                                            target={user && user.tiktok && '_blank'}>
                                            <svg
                                                className={`${
                                                    user && user.tiktok ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.tiktok ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M16.3977 7.01519C17.3792 7 18.3552 7.009 19.33 7C19.389 8.14806 19.8019 9.3175 20.6423 10.1292C21.481 10.9611 22.6673 11.3419 23.8215 11.4707V14.4908C22.7399 14.4554 21.6531 14.2304 20.6715 13.7646C20.244 13.5711 19.8458 13.3219 19.456 13.0671C19.4509 15.2586 19.465 17.4473 19.4419 19.6298C19.3834 20.6783 19.0375 21.7218 18.4277 22.5858C17.4467 24.0241 15.744 24.9617 13.9952 24.991C12.9225 25.0523 11.851 24.7598 10.9369 24.2209C9.42211 23.3277 8.35617 21.6925 8.20092 19.9375C8.18136 19.5658 8.17836 19.1934 8.19192 18.8215C8.32692 17.3944 9.03286 16.0293 10.1286 15.1006C11.3706 14.0189 13.1104 13.5036 14.7394 13.8085C14.7546 14.9194 14.7102 16.0293 14.7102 17.1402C13.966 16.8994 13.0964 16.9669 12.4461 17.4186C11.9704 17.732 11.6109 18.1931 11.4229 18.7309C11.2677 19.1112 11.3121 19.5336 11.3211 19.9375C11.4994 21.1682 12.6829 22.2027 13.9463 22.0907C14.7839 22.0817 15.5865 21.5958 16.023 20.8842C16.1642 20.635 16.3223 20.3802 16.3307 20.0871C16.4044 18.7456 16.3752 17.4096 16.3842 16.0681C16.3904 13.0446 16.3752 10.0296 16.3982 7.01575L16.3977 7.01519Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            href={
                                                user && user.instagram
                                                    ? `https://www.instagram.com/${user?.instagram}`
                                                    : '#'
                                            }
                                            target={user && user.instagram && '_blank'}>
                                            <svg
                                                className={`${
                                                    user && user.instagram ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="16"
                                                    fill={`${user && user.instagram ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M16 7C13.5576 7 13.2505 7.01125 12.2909 7.054C11.3313 7.099 10.6776 7.24975 10.105 7.4725C9.50436 7.69842 8.9603 8.0528 8.51088 8.51088C8.05309 8.96053 7.69875 9.50452 7.4725 10.105C7.24975 10.6765 7.09788 11.3312 7.054 12.2875C7.01125 13.2494 7 13.5554 7 16.0011C7 18.4446 7.01125 18.7506 7.054 19.7103C7.099 20.6688 7.24975 21.3224 7.4725 21.895C7.70312 22.4867 8.01025 22.9885 8.51088 23.4891C9.01038 23.9897 9.51213 24.298 10.1039 24.5275C10.6776 24.7502 11.3301 24.9021 12.2886 24.946C13.2494 24.9887 13.5554 25 16 25C18.4446 25 18.7495 24.9887 19.7103 24.946C20.6676 24.901 21.3235 24.7502 21.8961 24.5275C22.4964 24.3015 23.04 23.9471 23.4891 23.4891C23.9897 22.9885 24.2969 22.4867 24.5275 21.895C24.7491 21.3224 24.901 20.6688 24.946 19.7103C24.9887 18.7506 25 18.4446 25 16C25 13.5554 24.9887 13.2494 24.946 12.2886C24.901 11.3313 24.7491 10.6765 24.5275 10.105C24.3013 9.5045 23.9469 8.96051 23.4891 8.51088C23.0398 8.05264 22.4957 7.69823 21.895 7.4725C21.3212 7.24975 20.6665 7.09788 19.7091 7.054C18.7484 7.01125 18.4435 7 15.9978 7H16.0011H16ZM15.1934 8.62225H16.0011C18.4041 8.62225 18.6887 8.63013 19.6371 8.674C20.5146 8.71338 20.9916 8.86075 21.3089 8.98338C21.7285 9.1465 22.0289 9.34225 22.3439 9.65725C22.6589 9.97225 22.8535 10.2715 23.0166 10.6923C23.1404 11.0084 23.2866 11.4854 23.326 12.3629C23.3699 13.3113 23.3789 13.5959 23.3789 15.9978C23.3789 18.3996 23.3699 18.6854 23.326 19.6337C23.2866 20.5112 23.1393 20.9871 23.0166 21.3044C22.8723 21.6952 22.642 22.0485 22.3427 22.3382C22.0277 22.6532 21.7285 22.8479 21.3078 23.011C20.9928 23.1348 20.5157 23.281 19.6371 23.3215C18.6887 23.3643 18.4041 23.3744 16.0011 23.3744C13.5981 23.3744 13.3124 23.3643 12.364 23.3215C11.4865 23.281 11.0106 23.1348 10.6934 23.011C10.3024 22.8669 9.94877 22.637 9.65837 22.3382C9.35884 22.048 9.12819 21.6944 8.98338 21.3032C8.86075 20.9871 8.71338 20.5101 8.674 19.6326C8.63125 18.6843 8.62225 18.3996 8.62225 15.9955C8.62225 13.5925 8.63125 13.309 8.674 12.3606C8.7145 11.4831 8.86075 11.0061 8.9845 10.6889C9.14763 10.2693 9.34337 9.96887 9.65837 9.65387C9.97337 9.33887 10.2726 9.14425 10.6934 8.98113C11.0106 8.85738 11.4865 8.71113 12.364 8.67063C13.1943 8.63238 13.516 8.62113 15.1934 8.62V8.62225V8.62225ZM20.8049 10.1162C20.663 10.1162 20.5226 10.1442 20.3916 10.1985C20.2605 10.2527 20.1415 10.3323 20.0412 10.4326C19.9409 10.5329 19.8614 10.6519 19.8071 10.783C19.7528 10.914 19.7249 11.0544 19.7249 11.1963C19.7249 11.3381 19.7528 11.4785 19.8071 11.6095C19.8614 11.7406 19.9409 11.8596 20.0412 11.9599C20.1415 12.0602 20.2605 12.1398 20.3916 12.194C20.5226 12.2483 20.663 12.2763 20.8049 12.2763C21.0913 12.2763 21.366 12.1625 21.5686 11.9599C21.7711 11.7574 21.8849 11.4827 21.8849 11.1963C21.8849 10.9098 21.7711 10.6351 21.5686 10.4326C21.366 10.23 21.0913 10.1162 20.8049 10.1162V10.1162ZM16.0011 11.3785C15.3881 11.3689 14.7793 11.4814 14.2101 11.7094C13.6409 11.9374 13.1228 12.2763 12.6859 12.7065C12.249 13.1366 11.902 13.6494 11.6652 14.2149C11.4284 14.7804 11.3064 15.3874 11.3064 16.0006C11.3064 16.6137 11.4284 17.2207 11.6652 17.7862C11.902 18.3517 12.249 18.8645 12.6859 19.2946C13.1228 19.7248 13.6409 20.0637 14.2101 20.2917C14.7793 20.5197 15.3881 20.6322 16.0011 20.6226C17.2145 20.6037 18.3717 20.1084 19.2231 19.2437C20.0745 18.3789 20.5516 17.2141 20.5516 16.0006C20.5516 14.7871 20.0745 13.6222 19.2231 12.7575C18.3717 11.8927 17.2145 11.3974 16.0011 11.3785V11.3785ZM16.0011 12.9996C16.7969 12.9996 17.56 13.3157 18.1227 13.8784C18.6854 14.4411 19.0015 15.2043 19.0015 16C19.0015 16.7957 18.6854 17.5589 18.1227 18.1216C17.56 18.6843 16.7969 19.0004 16.0011 19.0004C15.2054 19.0004 14.4422 18.6843 13.8795 18.1216C13.3169 17.5589 13.0008 16.7957 13.0008 16C13.0008 15.2043 13.3169 14.4411 13.8795 13.8784C14.4422 13.3157 15.2054 12.9996 16.0011 12.9996V12.9996Z"
                                                    fill="#14141F"
                                                />
                                            </svg>
                                        </a>

                                        <a
                                            target={user && user.youtube && '_blank'}
                                            href={
                                                user && user.youtube ? `https://www.youtube.com/${user?.youtube}` : '#'
                                            }>
                                            <svg
                                                className={`${
                                                    user && user.youtube ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                                width="25"
                                                height="25"
                                                viewBox="0 0 32 32"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                                                    fill={`${user && user.youtube ? '#F1C94A' : '#737373'}`}
                                                />
                                                <path
                                                    d="M24.6255 11.8801C24.5235 11.5165 24.325 11.1873 24.051 10.9276C23.7692 10.6598 23.4238 10.4683 23.0475 10.3711C21.639 9.99981 15.996 9.99981 15.996 9.99981C13.6435 9.97305 11.2915 10.0908 8.95346 10.3523C8.57711 10.4567 8.23239 10.6525 7.94996 10.9223C7.67246 11.1893 7.47146 11.5186 7.36646 11.8793C7.11423 13.2381 6.99168 14.6178 7.00046 15.9998C6.99146 17.3806 7.11371 18.7598 7.36646 20.1203C7.46921 20.4796 7.66946 20.8073 7.94771 21.0721C8.22596 21.3368 8.57246 21.5281 8.95346 21.6293C10.3807 21.9998 15.996 21.9998 15.996 21.9998C18.3515 22.0266 20.7064 21.9089 23.0475 21.6473C23.4238 21.5501 23.7692 21.3586 24.051 21.0908C24.3249 20.8311 24.5232 20.5019 24.6247 20.1383C24.8835 18.78 25.0094 17.3998 25.0005 16.0171C25.0199 14.6285 24.8942 13.2417 24.6255 11.8793V11.8801ZM14.202 18.5678V13.4326L18.897 16.0006L14.202 18.5678Z"
                                                    fill="black"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                                <div className="mb-[1rem] pl-5 pr-5">
                                    <p className="text-white braek">{user && user.bio ? user.bio : ''}</p>
                                </div>
                            </div>
                            <div className="">
                                <div className="flex">
                                    <div className=" border-r-2 border-[#2B2B35] w-[33.33%]">
                                        <span className="text-sm text-[#727279] mb-2 ">Likes</span>
                                        <p className="text-[#FFFFFF] text-lg">{stats?.totalLikes || 0}</p>
                                    </div>
                                    <div
                                        className="border-r-2 border-[#2B2B35] w-[33.33%] cursor-pointer"
                                        onClick={() => {
                                            if (authUser && authUser.userId) {
                                                setData({ id: user?._id });

                                                setType('followers');
                                                setPopup(true);
                                                setState(23);

                                                setOther(true);
                                            } else {
                                                setPopup(true);
                                                setState(1);
                                            }
                                        }}>
                                        <span className="text-sm text-[#727279] cursor-pointer mb-2">Followers</span>
                                        <p className="text-[#FFFFFF] text-lg cursor-pointer">{followers}</p>
                                    </div>
                                    <div
                                        className=" w-[33.33%] cursor-pointer"
                                        onClick={() => {
                                            if (authUser && authUser.userId) {
                                                setType('following');
                                                setData({ id: user?._id });

                                                setPopup(true);
                                                setState(23);

                                                setOther(true);
                                            } else {
                                                setPopup(true);
                                                setState(1);
                                            }
                                        }}>
                                        <span className="text-sm text-[#727279] mb-2 cursor-pointer">Following</span>
                                        <p className="text-[#FFFFFF] text-lg cursor-pointer">
                                            {user?.following ? user?.following.length : 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex pt-5 ">
                                    <div className=" border-r-2 border-[#2B2B35] w-[33.33%]">
                                        <span className="text-sm text-[#727279] mb-2 ">Minted</span>
                                        <p className="text-[#FFFFFF] text-lg">{stats?.totalMinted || 0}</p>
                                    </div>
                                    <div className="border-r-2 border-[#2B2B35] w-[33.33%]">
                                        <span className="text-sm text-[#727279] mb-2">Sold NFTs</span>
                                        <p className="text-[#FFFFFF] text-lg">{stats?.sold || 0}</p>
                                    </div>
                                    <div className=" w-[33.33%] ">
                                        <span className="text-sm text-[#727279] mb-2">Loobr Score</span>
                                        <p className="text-[#FFFFFF] text-lg  ">
                                            <span className=" inline-block max-w-[60%]  truncate ">
                                                {Number(loobrScore).toFixed() || 0}
                                                {/* {Number(Number(stats?.totalVolume || 0).toFixed(2)).toLocaleString() ||
                                                    0} */}
                                            </span>
                                            {/* <i className="inline-block align-top ml-2 not-italic">
                                                <Image src={'/assets/images/loobricon.svg'} width="25" height="25" />
                                            </i> */}
                                        </p>
                                    </div>
                                </div>

                                {authUser &&
                                    authUser?.userId &&
                                    !user?.blockedBy?.includes(authUser?.userId) &&
                                    username == user?.userName && (
                                        <div className="flex items-center justify-center mt-[30px] ">
                                            {authUser && authUser.userId && (
                                                <div className="flex justify-between gap-24 items-center ">
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-x-3"
                                                        onClick={() => {
                                                            setData(user?._id);
                                                            setPopup(true);
                                                            setState(62);
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
                                                        <span className="text-base">Report User</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-x-3"
                                                        onClick={() => {
                                                            setData(user?._id);
                                                            setPopup(true);
                                                            setState(46);
                                                        }}>
                                                        <svg
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 22 22"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                                                                stroke="#727279"
                                                                strokeWidth="2"
                                                            />
                                                            <path d="M4 18L18 4" stroke="#727279" strokeWidth="2" />
                                                        </svg>
                                                        <span className="text-base">Block User</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                        <Volumetraded />

                        <div className="lg:w-[23.75rem]  flex w-full self-start px-10 justify-between items-center border lg:mx-0 xs:mx-auto mt-5 z-10 border-[#2B2B35] bg-[#14141F] px-33 py-[1.5rem] rounded-3xl text-center">
                            <p className="text-white text-md">Loobr Score: {Number(loobrScore).toFixed() || 0}</p>
                            <div className="-mt-[20px]">
                                <ReactSpeedometer
                                    maxSegmentLabels={0}
                                    segments={6}
                                    value={loobrScore}
                                    maxValue={10000}
                                    segmentColors={['#D72626', '#F26D24', '#F7B11E', '#FED137', '#FDEB48', '#99C817']}
                                    width={120}
                                    height={65}
                                    ringWidth={10}
                                    needleHeightRatio={0.6}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="  w-full mb-[7.5rem]">
                        <Tabs setConfirmed={setConfirm} confirm={confirm} />
                    </div>
                </div>
            </div>
            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={data}
                    setPopup={undefined}
                    otherUser={other}
                    setConfirmed={setConfirm}
                    type={type}
                />
            )}
        </>
    );
};

export default UserProfileModule;
