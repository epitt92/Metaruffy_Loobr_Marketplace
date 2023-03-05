/* eslint-disable @next/next/inline-script-id */
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Popups from '../../components/popup/poups';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../hooks/useMetaMask';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Followtabs from './TabsPanel';
import { getLoobrScore, getUserStats } from '../../redux/user/actions';
import { getUser, hideWallet, updateUser } from '../../redux/auth/actions';
import Link from 'next/link';
import { isEmpty } from 'validate.js';
import Loader from '../../components/loader/Loader';
import moment from 'moment';
import { METAMASK_POPUP, TRANSFORMATION_NAMES } from '../../constants/enums';
import { generateFileUrl, uploadFile } from '../../services/upload.service';
import dynamic from 'next/dynamic';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import Volumetraded from '../../components/volumetrade/Volumetraded';
import ImageComponent from '../../components/Image/ImageComponent';
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), {
    ssr: false
});
import withAuth from '../../components/Hoc/withAuth';
import { useRouter } from 'next/router';

const ProfileModule = () => {
    const { account, isActive, isLoading }: any = useMetaMask();

    const router = useRouter();

    const [popup, setPopup] = useState(false);
    const [showbtn, setShowbtn] = useState(true);
    const [state, setState] = useState(-1);
    const [data, setData] = useState<any>({});
    const [confirm, setConfirmed] = useState(false);
    const [viewWalletAdd, setViewWalletAdd] = useState(false);
    const [file, setFile] = useState();
    const [fileAvatar, setFileAvatar] = useState<any>(null);
    const [type, setType] = useState<any>();
    const user = useSelector((state: any) => state.auth.user);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const loading = useSelector((state: any) => state.auth.getLoading);
    const stats = useSelector((state: any) => state.user.stats);
    const statsLoading = useSelector((state: any) => state.user.statsLoading);
    const [loadinUpload, setLoadingUpload] = useState<boolean>(false);
    const [src, setSrc] = useState<any>('');
    const [loadinUpload1, setLoadingUpload1] = useState<boolean>(false);
    const [src1, setSrc1] = useState<any>('');
    const [fileName, setFileName] = useState<string>('');
    const dispatch = useDispatch();

    const loobrScore = useSelector((state: any) => state.user.loobrScore);
    const scoreLoading = useSelector((state: any) => state.user.scoreLoading);

    const apply = () => {
        try {
            const veriff = window?.Veriff({
                host: 'https://stationapi.veriff.com',
                apiKey: '9caf329d-67d1-4f36-9303-07454efae8d9',
                parentId: 'veriff-root',
                onSession: function (err: Error, response: any) {
                    if (err) {
                        // console.log(err);
                    }
                    if (response) {
                        window.open(response.verification.url);
                    }
                }
            });

            veriff.setParams({
                person: {
                    givenName: user?.firstName,
                    lastName: user?.lastName
                }
            });
            veriff.mount({
                formLabel: {
                    vendorData: 'E-Mail'
                }
            });

            document?.getElementById('veriff-vendor-data')?.setAttribute('value', user?.email);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log(isLoading, isActive);

        if (router?.query?.username === user?.userName && !isLoading && !isActive) {
            setPopup(true);
            setState(7);
        } else {
            setPopup(false);
        }
    }, [isActive, isLoading, router.pathname]);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (user && user.userId && confirm) {
            dispatch(getUser(false));
            setConfirmed(false);
        }
    }, [confirm, dispatch /* user */]);

    useEffect(() => {
        user?.userId && dispatch(getUserStats(user?.userId));
        user?.userId && dispatch(getLoobrScore(user?.userId));
        if (!isEmpty(user?.wallets)) {
            setViewWalletAdd(user?.hideWallet);
        }
    }, [user]);

    const handleSlicedAddress = () => {
        return account?.slice(0, 8) + '...' + account?.slice(account?.length - 4, account?.length);
    };

    const callS3 = (file: any) => {
        setState(-1);
        setPopup(false);
        const image = dataURLtoFile(file, fileName);
        if (type == 1920 / 350) {
            updateCover(image);
        } else {
            updateAvatar(image);
        }
    };
    function dataURLtoFile(dataurl: string, filename: string) {
        var arr: any = dataurl.split(','),
            mime = arr[0]?.match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    const updateCover = async (file: any) => {
        try {
            setLoadingUpload1(true);
            let name = `${new Date().valueOf()}.${file.name.split('.')[1]}`;
            let type = file.type;
            const formdata = new FormData();
            formdata.append('file', file);
            formdata.append('upload_preset', process.env.NEXT_PUBLIC_YOUR_UNSIGNED_UPLOAD_PRESET!);

            const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
                method: 'POST',
                body: formdata
            });
            const data: any = await res?.json();
            const url = data?.secure_url;

            setSrc1(url);
            setLoadingUpload1(false);
            setFile(file);
            dispatch(updateUser({ coverImage: url }));

            // let url = await generateFileUrl({ name, mime: type });
            // let newUrl = await uploadFile(url, file);
            // newUrl && setSrc1(newUrl);
            // setLoadingUpload1(false);
            // newUrl && setFile(file);
            // newUrl && dispatch(updateUser({ coverImage: newUrl }));
        } catch (err) {
            console.log(err);
            setLoadingUpload1(false);
        }
    };

    const updateAvatar = async (file: any) => {
        try {
            setLoadingUpload(true);
            let name = `${new Date().valueOf()}.${file.name.split('.')[1]}`;
            let type = file.type;
            var formdata = new FormData();
            formdata.append('file', file);
            formdata.append('upload_preset', process.env.NEXT_PUBLIC_YOUR_UNSIGNED_UPLOAD_PRESET!);

            const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
                method: 'POST',
                body: formdata
            });
            const data: any = await res?.json();
            const url = data?.secure_url;

            url && setSrc(url);
            setLoadingUpload(false);
            url && setFileAvatar(file);
            url && dispatch(updateUser({ avatar: url }));
        } catch (err) {}
    };

    const handleHideWallet = () => {
        !isEmpty(user?.wallets) && dispatch(hideWallet(user?.wallets[0]._id));
        setViewWalletAdd(!viewWalletAdd);
    };
    if (!isAuthenticated) {
        router.push('/');
    }

    return (
        <>
            {loading ? (
                <div className="min-h-[900px] flex align-items-center">
                    <Loader />
                </div>
            ) : (
                user && (
                    <div>
                        <div className="mb-8 relative    AtthemeImage AtchangeBannerhover  bg-[#22222b] ">
                            {loadinUpload1 ? (
                                <>
                                    <div className="ChooseFullImage relative bg-[#22222b]  rounded-xl  h-[350px]  overflow-hidden mb-4">
                                        <div className=" text-center ">
                                            <figure className="mt-12">
                                                <div className="loadingio-spinner-rolling-jz7efhw30v bg-[#22222b]">
                                                    <div className="ldio-fcd0x3izul5 bg-[#22222b]">
                                                        <div></div>
                                                    </div>
                                                </div>
                                            </figure>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="Atreplacebanner">
                                    <h3 className="text-white font-Proxima-SemiBold text-3xl mb-1">Replace Banner</h3>
                                    <h4 className="text-white text-sm font-Proxima-Regular">
                                        Dimension 1920px x 350px
                                    </h4>
                                    <div className=" rounded-full mt-4">
                                        <input
                                            type="file"
                                            name="change-cover"
                                            accept="image/png,image/jpeg"
                                            id="AtchangeBanner"
                                            onClick={(event: any) => {
                                                event.target.value = null;
                                            }}
                                            onChange={(e: any) => {
                                                // console.log(e);
                                                // updateCover(e.target.files[0]);
                                                setFileName(e.target.files[0].name);
                                                setState(52);
                                                setPopup(true);
                                                setData({ url: URL.createObjectURL(e.target.files[0]) });
                                                setType(1920 / 350);
                                            }}
                                        />
                                        <label
                                            className="inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 relative  rounded-full cursor-pointer bg-transparent border border-white text-white"
                                            htmlFor="AtchangeBanner">
                                            Change Banner
                                        </label>
                                    </div>
                                </div>
                            )}

                            {!loadinUpload1 && (
                                <>
                                    {' '}
                                    {file ? (
                                        <figure className="h-[350px] w-full">
                                            <ImageComponent
                                                src={src1}
                                                objectFit="cover"
                                                layout="fill"
                                                alt=""
                                                quality={50}
                                            />
                                        </figure>
                                    ) : (
                                        <>
                                            {user?.coverImage ? (
                                                <figure className="h-[350px]  w-full">
                                                    <ImageComponent
                                                        src={user.coverImage}
                                                        objectFit="cover"
                                                        layout="fill"
                                                        alt=""
                                                        quality={50}
                                                    />
                                                </figure>
                                            ) : (
                                                <svg
                                                    className="w-full"
                                                    width="1920"
                                                    height="350"
                                                    viewBox="0 0 1920 350"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="1920" height="350" fill="#1F1F2D" />
                                                    <g clipPath="url(#clip0_1817_4151)">
                                                        <path
                                                            d="M912.016 153.75C912.016 157.132 910.672 160.375 908.281 162.766C905.89 165.157 902.647 166.5 899.266 166.5C895.884 166.5 892.641 165.157 890.25 162.766C887.859 160.375 886.516 157.132 886.516 153.75C886.516 150.368 887.859 147.125 890.25 144.734C892.641 142.343 895.884 141 899.266 141C902.647 141 905.89 142.343 908.281 144.734C910.672 147.125 912.016 150.368 912.016 153.75V153.75Z"
                                                            fill="#41415A"
                                                        />
                                                        <path
                                                            d="M878.016 115.5C873.507 115.5 869.183 117.291 865.995 120.479C862.807 123.667 861.016 127.991 861.016 132.5V217.5C861.016 222.009 862.807 226.333 865.995 229.521C869.183 232.709 873.507 234.5 878.016 234.5H980.016C984.524 234.5 988.848 232.709 992.036 229.521C995.225 226.333 997.016 222.009 997.016 217.5V132.5C997.016 127.991 995.225 123.667 992.036 120.479C988.848 117.291 984.524 115.5 980.016 115.5H878.016V115.5ZM980.016 124C982.27 124 984.432 124.896 986.026 126.49C987.62 128.084 988.516 130.246 988.516 132.5V187.75L956.411 171.2C955.614 170.801 954.712 170.663 953.831 170.805C952.951 170.946 952.138 171.361 951.507 171.991L919.972 203.526L897.362 188.464C896.545 187.921 895.566 187.676 894.59 187.772C893.614 187.868 892.701 188.299 892.007 188.991L869.516 209V132.5C869.516 130.246 870.411 128.084 872.005 126.49C873.599 124.896 875.761 124 878.016 124H980.016Z"
                                                            fill="#41415A"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1817_4151">
                                                            <rect
                                                                width="136"
                                                                height="136"
                                                                fill="white"
                                                                transform="translate(861 107)"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="container ">
                            <div className="flex lg:flex-row flex-col gap-10 relative  pb-28">
                                <div className="xl:-mt-52 sm:-mt-28 -mt-36 z-10 ">
                                    <div className="lg:w-[23.75rem] w-full self-start sm:justify-center border lg:mx-0 xs:mx-auto border-[#2B2B35] xs:border-0 bg-[#14141F] xs:bg-transparent px-33 py-[1.5rem] rounded-3xl text-center">
                                        <figure className="mb-[15px] mx-auto AtchatUserprofile w-[140px] h-[140px] relative border-[10px] border-[#2B2B35] rounded-full">
                                            {loadinUpload ? (
                                                <div className="ChooseFullImage relative rounded-xl  overflow-hidden pb-8">
                                                    <div className=" text-center ">
                                                        <figure className="mt-6  ">
                                                            <div className="loadingio-spinner-rolling-jz7efhw30v">
                                                                <div className="ldio-fcd0x3izul5">
                                                                    <div></div>
                                                                </div>
                                                            </div>
                                                        </figure>
                                                    </div>
                                                </div>
                                            ) : fileAvatar ? (
                                                <Image
                                                    src={src}
                                                    layout="fill"
                                                    objectFit="contain"
                                                    alt=""
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <>
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
                                                        />
                                                    ) : (
                                                        <p className="w-full h-full bg-themecolor text-6xl contain flex items-center justify-center rounded-full text-black1">
                                                            {user?.firstName.charAt(0).toUpperCase()}
                                                        </p>
                                                    )}
                                                </>
                                            )}

                                            <div className="absolute top-0 right-[-1px]">
                                                <label className="absolute bg-themecolor rounded-full p-2 -right-2 cursor-pointer top-0">
                                                    <input
                                                        type="file"
                                                        accept="image/png,image/jpeg"
                                                        onClick={(event: any) => {
                                                            event.target.value = null;
                                                        }}
                                                        className="w-0 absolute  "
                                                        onChange={(e: any) => {
                                                            // console.log(e);
                                                            try {
                                                                e.preventDefault();

                                                                setFileName(e.target.files[0].name);
                                                                setState(52);
                                                                setPopup(true);
                                                                setData({
                                                                    url: URL.createObjectURL(e.target.files[0])
                                                                });

                                                                setType(1);
                                                                // updateAvatar(e?.target?.files[0]);
                                                                // setAvatar(true);
                                                                // setValues({ ...values, avatar: e.target.files[0] });
                                                            } catch (err) {
                                                                // console.log(err);
                                                            }
                                                        }}
                                                    />
                                                    <div>
                                                        <svg
                                                            width="15"
                                                            height="15"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.52438 1.75682C10.5724 0.729498 12.2723 0.729498 13.3203 1.75682L14.4083 2.82333C15.4563 3.85065 15.4563 5.51692 14.4083 6.54424L6.23047 14.5605C5.76285 15.0189 5.12886 15.2761 4.46711 15.2761H1.11801C0.806889 15.2761 0.556875 15.0248 0.564629 14.72L0.648874 11.4074C0.665623 10.7813 0.92697 10.1844 1.3787 9.74159L9.52438 1.75682ZM8.89124 3.9107L2.16154 10.509C1.91044 10.7551 1.76492 11.0875 1.75562 11.4351L1.68532 14.1905L4.46711 14.1909C4.79444 14.1909 5.10922 14.0779 5.35767 13.8739L5.44763 13.7931L12.2107 7.16375L8.89124 3.9107ZM12.5374 2.52419C11.9218 1.92068 10.9229 1.92068 10.3072 2.52419L9.67466 3.14326L12.9933 6.3963L13.6254 5.77687C14.2069 5.20688 14.2392 4.30185 13.7224 3.69464L13.6254 3.5907L12.5374 2.52419Z"
                                                                fill="black"
                                                            />
                                                        </svg>
                                                    </div>
                                                </label>
                                            </div>
                                        </figure>
                                        <div className="flex text-center   justify-center items-center mb-5 ">
                                            <div className="">
                                                <h2 className="text-[#FFFFFF] text-center flex items-center text-[1.75rem] braek pl-5">
                                                    {user?.firstName} {user?.lastName}
                                                    {user && user.isVerfied && (
                                                        <span className="flex ml-2 items-center justify-center rounded-lg relative Atpricehoverholder hover:border-themecolo">
                                                            <span className="Atpricehover font-Proxima-Regular whitespace-nowrap">
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
                                                <h2 className="text-[#737373] text-center text-[18px] braek pl-5 font-Proxima-Regular -mt-2">
                                                    @{user?.userName}
                                                </h2>
                                                {user?.country && (
                                                    <h2 className="text-white   text-center text-[18px] braek pl-5 font-Proxima-Regular -mt-1">
                                                        {user?.country?.name} {user?.country?.flag}
                                                    </h2>
                                                )}
                                            </div>
                                        </div>
                                        {account && (
                                            <div className="relative flex items-center  justify-center mb-[1.1rem] pl-5 pr-5 -mt-2 ">
                                                <span className="text-[#FFFFFF] text-sm border-2 min-w-[196px] border-[#2B2B35] px-6 py-[6px] rounded-lg flex items-center gap-x-4">
                                                    <div className="min-w-[105px]">
                                                        {viewWalletAdd ? (
                                                            <i className="not-italic">
                                                                &#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;
                                                            </i>
                                                        ) : (
                                                            <i className="not-italic">{handleSlicedAddress() || ''}</i>
                                                        )}
                                                    </div>
                                                    <button className="" type="button" onClick={handleHideWallet}>
                                                        {!viewWalletAdd ? (
                                                            <svg
                                                                width="20"
                                                                height="17"
                                                                viewBox="0 0 20 17"
                                                                fill="none"
                                                                className="cursor-pointer"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M10.003 0.000488281C14.139 0.00348828 17.853 2.90249 19.939 7.75649C20.021 7.94549 20.021 8.15949 19.939 8.34849C17.854 13.2035 14.139 16.1025 10.003 16.1055H9.99699C5.86099 16.1025 2.14699 13.2035 0.0609941 8.34849C-0.0200059 8.15949 -0.0200059 7.94549 0.0609941 7.75649C2.14699 2.90249 5.86199 0.00348828 9.99699 0.000488281H10.003ZM9.99999 1.50049C6.56399 1.50149 3.42999 3.94449 1.56999 8.05249C3.42999 12.1615 6.56299 14.6045 9.99999 14.6055C13.437 14.6045 16.57 12.1615 18.43 8.05249C16.57 3.94449 13.437 1.50149 9.99999 1.50049ZM9.99969 4.14129C12.1567 4.14129 13.9117 5.89629 13.9117 8.05329C13.9117 10.2093 12.1567 11.9633 9.99969 11.9633C7.84269 11.9633 6.08869 10.2093 6.08869 8.05329C6.08869 5.89629 7.84269 4.14129 9.99969 4.14129ZM9.99969 5.64129C8.66969 5.64129 7.58869 6.72329 7.58869 8.05329C7.58869 9.38229 8.66969 10.4633 9.99969 10.4633C11.3297 10.4633 12.4117 9.38229 12.4117 8.05329C12.4117 6.72329 11.3297 5.64129 9.99969 5.64129Z"
                                                                    fill="#F1C94A"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                width="20"
                                                                height="17"
                                                                viewBox="0 0 22 22"
                                                                fill="none"
                                                                className="cursor-pointer"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M21.2804 0.469672C21.5733 0.762567 21.5733 1.23744 21.2804 1.53033L1.28033 21.5304C0.98744 21.8233 0.512567 21.8233 0.219672 21.5304C-0.0732223 21.2375 -0.0732243 20.7626 0.219668 20.4697L3.59007 17.0993C2.63583 16.2323 1.76266 15.1886 1.00731 14.003C0.462133 13.1486 0.214844 12.054 0.214844 11.005C0.214844 9.95594 0.462142 8.86136 1.00734 8.00695C3.39826 4.24858 6.90186 1.97998 10.7498 1.97998C12.8835 1.97998 14.9329 2.68491 16.7307 3.95861L20.2197 0.469668C20.5126 0.176776 20.9875 0.176778 21.2804 0.469672ZM15.6525 5.03686C14.1376 4.01888 12.4627 3.47998 10.7498 3.47998C7.53799 3.47998 4.46174 5.37118 2.27266 8.81252L2.27204 8.81351C1.91745 9.36902 1.71484 10.1642 1.71484 11.005C1.71484 11.8457 1.91745 12.6409 2.27204 13.1965C2.97564 14.3008 3.7833 15.2574 4.6521 16.0372L7.20494 13.4844C6.71039 12.7816 6.41992 11.9266 6.41992 11C6.41992 8.60583 8.35571 6.67004 10.7499 6.67004C11.6765 6.67004 12.5315 6.96051 13.2342 7.45506L15.6525 5.03686ZM12.149 8.54033C11.7364 8.30397 11.2603 8.17004 10.7499 8.17004C9.18414 8.17004 7.91992 9.43426 7.91992 11C7.91992 11.5104 8.05385 11.9865 8.29021 12.3991L12.149 8.54033ZM18.3299 6.34564C18.6526 6.08603 19.1247 6.13722 19.3843 6.45998C19.7682 6.93725 20.1453 7.45011 20.4932 7.99819C21.0378 8.85243 21.2849 9.94649 21.2849 10.9951C21.2849 12.0439 21.0377 13.1383 20.4927 13.9926C18.1018 17.7513 14.5981 20.0201 10.7499 20.0201C9.41339 20.0201 8.10475 19.7374 6.87888 19.2213C6.49713 19.0605 6.31796 18.6208 6.4787 18.239C6.63943 17.8573 7.07921 17.6781 7.46096 17.8388C8.5151 18.2827 9.62646 18.5201 10.7499 18.5201C13.9618 18.5201 17.038 16.6289 19.2271 13.1875L19.2277 13.1865C19.5823 12.631 19.7849 11.8358 19.7849 10.9951C19.7849 10.1543 19.5823 9.3591 19.2277 8.80358L19.2267 8.80192C18.9145 8.31 18.5716 7.84285 18.2155 7.40012C17.9559 7.07736 18.0071 6.60526 18.3299 6.34564ZM14.3959 10.9624C14.8033 11.0375 15.0726 11.4286 14.9975 11.836C14.6811 13.5518 13.2918 14.9411 11.5759 15.2575C11.1686 15.3326 10.7775 15.0633 10.7024 14.656C10.6273 14.2486 10.8966 13.8575 11.3039 13.7824C12.4081 13.5788 13.3188 12.6681 13.5224 11.5639C13.5975 11.1566 13.9886 10.8873 14.3959 10.9624Z"
                                                                    fill="#F1C94A"
                                                                />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </span>
                                                <CopyToClipboard
                                                    text={account}
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
                                        <div className="mb-[1rem]  pl-5 pr-5 ">
                                            <p className="text-white braek">
                                                {'Since '}
                                                {moment(user?.createdAt, 'YYYY/MM/DD').format('MMMM YYYY')}{' '}
                                            </p>
                                        </div>
                                        <div className="mb-[1rem]  pl-5 pr-5">
                                            <p className="text-white braek">{user && user.bio ? user.bio : ''}</p>
                                        </div>

                                        <div className="relative mb-8 pl-5 pr-5 flex items-center justify-center">
                                            <Button
                                                className="rounded-[6.25rem] px-12 py-4 gold mr-3"
                                                onClick={() => {
                                                    setPopup(true);
                                                    setState(37);
                                                }}>
                                                Edit Profile
                                            </Button>
                                            <div
                                                className="w-[3.375rem] h-[3.188rem] cursor-pointer border key border-[#a1a1a1] hover:bg-[#1F1F2C] rounded-full flex justify-center items-center"
                                                onClick={() => {
                                                    setPopup(true);
                                                    setState(32);
                                                }}>
                                                <svg
                                                    className="key2"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M19.0008 6.39999C19.0008 6.77129 18.8533 7.12739 18.5907 7.38994C18.3282 7.65249 17.9721 7.79999 17.6008 7.79999C17.2295 7.79999 16.8734 7.65249 16.6108 7.38994C16.3483 7.12739 16.2008 6.77129 16.2008 6.39999C16.2008 6.02868 16.3483 5.67259 16.6108 5.41004C16.8734 5.14749 17.2295 4.99999 17.6008 4.99999C17.9721 4.99999 18.3282 5.14749 18.5907 5.41004C18.8533 5.67259 19.0008 6.02868 19.0008 6.39999ZM15.5008 0.799988C11.1944 0.799988 7.80078 4.19359 7.80078 8.49999C7.80078 9.05579 7.85678 9.61439 7.97158 10.145C8.05278 10.523 7.96038 10.8506 7.77278 11.0382L1.41678 17.3942C1.22139 17.5893 1.0664 17.8211 0.960702 18.0762C0.855 18.3314 0.800656 18.6048 0.800781 18.881V21.1C0.800781 21.6569 1.02203 22.1911 1.41586 22.5849C1.80968 22.9787 2.34383 23.2 2.90078 23.2H5.70078C6.25774 23.2 6.79188 22.9787 7.18571 22.5849C7.57953 22.1911 7.80078 21.6569 7.80078 21.1V20.4H9.20078C9.57208 20.4 9.92818 20.2525 10.1907 19.9899C10.4533 19.7274 10.6008 19.3713 10.6008 19V17.6H12.0008C12.3721 17.6 12.7282 17.4525 12.9907 17.1899C13.2533 16.9274 13.4008 16.5713 13.4008 16.2V15.948C14.091 16.1356 14.8106 16.2 15.5008 16.2C19.8072 16.2 23.2008 12.8064 23.2008 8.49999C23.2008 4.19359 19.8072 0.799988 15.5008 0.799988ZM9.20078 8.49999C9.20078 4.96639 11.9672 2.19999 15.5008 2.19999C19.0344 2.19999 21.8008 4.96639 21.8008 8.49999C21.8008 12.0336 19.0344 14.8 15.5008 14.8C14.5768 14.8 13.7186 14.667 13.0144 14.3142C12.9077 14.2607 12.789 14.2354 12.6698 14.2407C12.5505 14.246 12.4346 14.2817 12.333 14.3444C12.2315 14.4071 12.1476 14.4947 12.0895 14.599C12.0313 14.7032 12.0008 14.8206 12.0008 14.94V16.2H10.6008C10.2295 16.2 9.87338 16.3475 9.61083 16.61C9.34828 16.8726 9.20078 17.2287 9.20078 17.6V19H7.80078C7.42948 19 7.07338 19.1475 6.81083 19.41C6.54828 19.6726 6.40078 20.0287 6.40078 20.4V21.1C6.40078 21.2856 6.32703 21.4637 6.19576 21.595C6.06448 21.7262 5.88643 21.8 5.70078 21.8H2.90078C2.71513 21.8 2.53708 21.7262 2.40581 21.595C2.27453 21.4637 2.20078 21.2856 2.20078 21.1V18.8796C2.20082 18.6943 2.27432 18.5166 2.40518 18.3854L8.76258 12.028C9.36738 11.4232 9.49338 10.5664 9.33938 9.84959C9.24599 9.40582 9.19953 8.95347 9.20078 8.49999Z"
                                                        fill="#a1a1a1"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex ">
                                            <div className=" border-r-2 border-[#2B2B35] w-[33.33%]">
                                                <span className="text-sm text-[#727279] mb-2 ">Likes</span>
                                                <p className="text-[#FFFFFF] text-lg">{stats?.totalLikes || 0}</p>
                                            </div>
                                            <div
                                                className="border-r-2 border-[#2B2B35] w-[33.33%] cursor-pointer"
                                                onClick={() => {
                                                    user && user.userId && setData({ ...data, id: user.userId });
                                                    setType('followers');
                                                    setPopup(true);
                                                    setState(23);
                                                }}>
                                                <span className="text-sm text-[#727279] mb-2 ">Followers</span>
                                                <p className="text-[#FFFFFF] text-lg">{user?.followers?.length || 0}</p>
                                            </div>
                                            <div
                                                className=" w-[33.33%] cursor-pointer"
                                                onClick={() => {
                                                    user && user.userId && setData({ ...data, id: user.userId });
                                                    setType('following');
                                                    setPopup(true);
                                                    setState(23);
                                                }}>
                                                <span className="text-sm text-[#727279] mb-2 cursor-pointer">
                                                    {/* Following */}
                                                    Following
                                                </span>
                                                <p className="text-[#FFFFFF] text-lg cursor-pointer">
                                                    {user?.following?.length || 0}
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
                                            <div className=" w-[33.33%]">
                                                <span className="text-sm text-[#727279] mb-2">Loobr Score</span>
                                                <p className="text-[#FFFFFF] text-lg">
                                                    {Number(loobrScore).toFixed() || 0}
                                                    {/* {Number(
                                                        Number(stats?.totalVolume || 0).toFixed(2)
                                                    ).toLocaleString() || 0}{' '} */}

                                                    {/* <i className="inline-block align-top ml-1 not-italic ">
                                                        <Image
                                                            src={'/assets/images/loobricon.svg'}
                                                            width="25"
                                                            height="25"
                                                        />
                                                    </i> */}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-8  ">
                                            <div className="mt-9 border-t pt-4 border-[#2b2b35] flex gap-3 mx-6 justify-center">
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.discord
                                                            ? `https://discord.com/${user?.discord}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.discord && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.discord
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                </Link>
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.facebook
                                                            ? `https://facebook.com/${user?.facebook}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.facebook && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.facebook
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                                fill={`${
                                                                    user && user.facebook ? '#F1C94A' : '#737373'
                                                                }`}
                                                            />
                                                            <path
                                                                d="M20.5833 8.20832C20.5833 8.08676 20.535 7.97018 20.4491 7.88423C20.3631 7.79828 20.2466 7.74999 20.125 7.74999H17.8333C16.6794 7.6925 15.5495 8.0941 14.6907 8.86702C13.8319 9.63994 13.314 10.7214 13.25 11.875V14.35H10.9583C10.8368 14.35 10.7202 14.3983 10.6342 14.4842C10.5483 14.5702 10.5 14.6868 10.5 14.8083V17.1917C10.5 17.3132 10.5483 17.4298 10.6342 17.5157C10.7202 17.6017 10.8368 17.65 10.9583 17.65H13.25V23.7917C13.25 23.9132 13.2983 24.0298 13.3842 24.1157C13.4702 24.2017 13.5868 24.25 13.7083 24.25H16.4583C16.5799 24.25 16.6965 24.2017 16.7824 24.1157C16.8684 24.0298 16.9167 23.9132 16.9167 23.7917V17.65H19.3183C19.4203 17.6515 19.5198 17.6189 19.6011 17.5575C19.6825 17.496 19.741 17.4093 19.7675 17.3108L20.4275 14.9275C20.4457 14.8598 20.4482 14.7888 20.4347 14.7199C20.4211 14.6511 20.392 14.5863 20.3495 14.5305C20.307 14.4748 20.2523 14.4295 20.1895 14.3982C20.1267 14.3669 20.0576 14.3504 19.9875 14.35H16.9167V11.875C16.9395 11.6481 17.046 11.4378 17.2155 11.2853C17.385 11.1327 17.6053 11.0488 17.8333 11.05H20.125C20.2466 11.05 20.3631 11.0017 20.4491 10.9157C20.535 10.8298 20.5833 10.7132 20.5833 10.5917V8.20832Z"
                                                                fill="#14141F"
                                                            />
                                                        </svg>
                                                    </a>
                                                </Link>
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.twitter
                                                            ? `https://twitter.com/${user?.twitter}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.twitter && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.twitter
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                </Link>
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.reddit
                                                            ? `https://www.reddit.com/${user?.reddit}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.reddit && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.reddit
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                </Link>
                                                <Link legacyBehavior href={user && user?.web ? user.web : ''}>
                                                    <a target={user && user?.web && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.web ? 'cursor-pointer' : 'cursor-default'
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
                                                </Link>
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.tiktok
                                                            ? `https://www.tiktok.com/${user?.tiktok}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.tiktok && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.tiktok
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                </Link>
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.instagram
                                                            ? `https://www.instagram.com/${user?.instagram}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.instagram && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.instagram
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                                fill={`${
                                                                    user && user.instagram ? '#F1C94A' : '#737373'
                                                                }`}
                                                            />
                                                            <path
                                                                d="M16 7C13.5576 7 13.2505 7.01125 12.2909 7.054C11.3313 7.099 10.6776 7.24975 10.105 7.4725C9.50436 7.69842 8.9603 8.0528 8.51088 8.51088C8.05309 8.96053 7.69875 9.50452 7.4725 10.105C7.24975 10.6765 7.09788 11.3312 7.054 12.2875C7.01125 13.2494 7 13.5554 7 16.0011C7 18.4446 7.01125 18.7506 7.054 19.7103C7.099 20.6688 7.24975 21.3224 7.4725 21.895C7.70312 22.4867 8.01025 22.9885 8.51088 23.4891C9.01038 23.9897 9.51213 24.298 10.1039 24.5275C10.6776 24.7502 11.3301 24.9021 12.2886 24.946C13.2494 24.9887 13.5554 25 16 25C18.4446 25 18.7495 24.9887 19.7103 24.946C20.6676 24.901 21.3235 24.7502 21.8961 24.5275C22.4964 24.3015 23.04 23.9471 23.4891 23.4891C23.9897 22.9885 24.2969 22.4867 24.5275 21.895C24.7491 21.3224 24.901 20.6688 24.946 19.7103C24.9887 18.7506 25 18.4446 25 16C25 13.5554 24.9887 13.2494 24.946 12.2886C24.901 11.3313 24.7491 10.6765 24.5275 10.105C24.3013 9.5045 23.9469 8.96051 23.4891 8.51088C23.0398 8.05264 22.4957 7.69823 21.895 7.4725C21.3212 7.24975 20.6665 7.09788 19.7091 7.054C18.7484 7.01125 18.4435 7 15.9978 7H16.0011H16ZM15.1934 8.62225H16.0011C18.4041 8.62225 18.6887 8.63013 19.6371 8.674C20.5146 8.71338 20.9916 8.86075 21.3089 8.98338C21.7285 9.1465 22.0289 9.34225 22.3439 9.65725C22.6589 9.97225 22.8535 10.2715 23.0166 10.6923C23.1404 11.0084 23.2866 11.4854 23.326 12.3629C23.3699 13.3113 23.3789 13.5959 23.3789 15.9978C23.3789 18.3996 23.3699 18.6854 23.326 19.6337C23.2866 20.5112 23.1393 20.9871 23.0166 21.3044C22.8723 21.6952 22.642 22.0485 22.3427 22.3382C22.0277 22.6532 21.7285 22.8479 21.3078 23.011C20.9928 23.1348 20.5157 23.281 19.6371 23.3215C18.6887 23.3643 18.4041 23.3744 16.0011 23.3744C13.5981 23.3744 13.3124 23.3643 12.364 23.3215C11.4865 23.281 11.0106 23.1348 10.6934 23.011C10.3024 22.8669 9.94877 22.637 9.65837 22.3382C9.35884 22.048 9.12819 21.6944 8.98338 21.3032C8.86075 20.9871 8.71338 20.5101 8.674 19.6326C8.63125 18.6843 8.62225 18.3996 8.62225 15.9955C8.62225 13.5925 8.63125 13.309 8.674 12.3606C8.7145 11.4831 8.86075 11.0061 8.9845 10.6889C9.14763 10.2693 9.34337 9.96887 9.65837 9.65387C9.97337 9.33887 10.2726 9.14425 10.6934 8.98113C11.0106 8.85738 11.4865 8.71113 12.364 8.67063C13.1943 8.63238 13.516 8.62113 15.1934 8.62V8.62225V8.62225ZM20.8049 10.1162C20.663 10.1162 20.5226 10.1442 20.3916 10.1985C20.2605 10.2527 20.1415 10.3323 20.0412 10.4326C19.9409 10.5329 19.8614 10.6519 19.8071 10.783C19.7528 10.914 19.7249 11.0544 19.7249 11.1963C19.7249 11.3381 19.7528 11.4785 19.8071 11.6095C19.8614 11.7406 19.9409 11.8596 20.0412 11.9599C20.1415 12.0602 20.2605 12.1398 20.3916 12.194C20.5226 12.2483 20.663 12.2763 20.8049 12.2763C21.0913 12.2763 21.366 12.1625 21.5686 11.9599C21.7711 11.7574 21.8849 11.4827 21.8849 11.1963C21.8849 10.9098 21.7711 10.6351 21.5686 10.4326C21.366 10.23 21.0913 10.1162 20.8049 10.1162V10.1162ZM16.0011 11.3785C15.3881 11.3689 14.7793 11.4814 14.2101 11.7094C13.6409 11.9374 13.1228 12.2763 12.6859 12.7065C12.249 13.1366 11.902 13.6494 11.6652 14.2149C11.4284 14.7804 11.3064 15.3874 11.3064 16.0006C11.3064 16.6137 11.4284 17.2207 11.6652 17.7862C11.902 18.3517 12.249 18.8645 12.6859 19.2946C13.1228 19.7248 13.6409 20.0637 14.2101 20.2917C14.7793 20.5197 15.3881 20.6322 16.0011 20.6226C17.2145 20.6037 18.3717 20.1084 19.2231 19.2437C20.0745 18.3789 20.5516 17.2141 20.5516 16.0006C20.5516 14.7871 20.0745 13.6222 19.2231 12.7575C18.3717 11.8927 17.2145 11.3974 16.0011 11.3785V11.3785ZM16.0011 12.9996C16.7969 12.9996 17.56 13.3157 18.1227 13.8784C18.6854 14.4411 19.0015 15.2043 19.0015 16C19.0015 16.7957 18.6854 17.5589 18.1227 18.1216C17.56 18.6843 16.7969 19.0004 16.0011 19.0004C15.2054 19.0004 14.4422 18.6843 13.8795 18.1216C13.3169 17.5589 13.0008 16.7957 13.0008 16C13.0008 15.2043 13.3169 14.4411 13.8795 13.8784C14.4422 13.3157 15.2054 12.9996 16.0011 12.9996V12.9996Z"
                                                                fill="#14141F"
                                                            />
                                                        </svg>
                                                    </a>
                                                </Link>
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        user && user?.youtube
                                                            ? `https://www.youtube.com/${user?.youtube}`
                                                            : ''
                                                    }>
                                                    <a target={user && user.youtube && '_blank'}>
                                                        <svg
                                                            className={`${
                                                                user && user.youtube
                                                                    ? 'cursor-pointer'
                                                                    : 'cursor-default'
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
                                                </Link>
                                            </div>
                                        </div>
                                        <div id="veriff-root" className="mt-4 AtverifyMeform   w-full pl-5 pr-5"></div>

                                        {showbtn &&
                                            user?.verifyStatus != 'Submitted' &&
                                            user?.verifyStatus != 'Passed' &&
                                            !user.isVerfied && (
                                                <>
                                                    <Button
                                                        disabled={
                                                            user?.verifyStatus == 'Passed' ||
                                                            user?.verifyStatus == 'Submitted'
                                                        }
                                                        className="gold rounded-full"
                                                        onClick={() => {
                                                            apply();
                                                            setShowbtn(false);
                                                        }}>
                                                        Verify Me
                                                    </Button>
                                                </>
                                            )}
                                        <div className="flex items-center justify-center   gap-3">
                                            {/* {user && user.verifyStatus == 'Started' && (
                                                <span className="w-[10px] h-[10px] rounded-full bg-yellow-400"></span>
                                            )} */}
                                            {user && user?.verifyStatus == 'Submitted' && !user?.isVerfied && (
                                                <>
                                                    <span className="w-[10px] h-[10px] rounded-full bg-blue-900"></span>
                                                    <p className="text-white ">Your Application is in review.</p>
                                                </>
                                            )}
                                            {/* {user && user.verifyStatus == 'Passed' && (
                                                <span className="w-[10px] h-[10px] rounded-full bg-green-900"></span>
                                            )} */}
                                            {user && user?.verifyStatus == 'Failed' && !user?.isVerfied && (
                                                <>
                                                    <span className="w-[10px] h-[10px] rounded-full bg-red-900"></span>
                                                    <p className="text-white braek">
                                                        Verification failed please try again
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        {user && user?.verifyStatus == 'Submitted' && (
                                            <div className="mt-[10px] pl-5 pr-5 "></div>
                                        )}
                                    </div>
                                    <Volumetraded />

                                    <div className="lg:w-[23.75rem]  flex w-full self-start px-10 justify-between items-center border lg:mx-0 xs:mx-auto mt-5 z-10 border-[#2B2B35] bg-[#14141F] px-33 py-[1.5rem] rounded-3xl text-center">
                                        <p className="text-white text-md">
                                            Loobr Score: {Number(loobrScore).toFixed() || 0}
                                        </p>
                                        <div className="-mt-[20px]">
                                            <ReactSpeedometer
                                                maxSegmentLabels={0}
                                                segments={6}
                                                value={loobrScore}
                                                maxValue={10000}
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
                                        </div>
                                    </div>
                                </div>

                                <div className=" w-full mb-[7.5rem]">
                                    <Followtabs />
                                </div>
                            </div>
                            {/* {user && user.userId && <DirectChat />} */}
                        </div>
                    </div>
                )
            )}
            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={{ ...data, flow: METAMASK_POPUP.profile }}
                    setPopup={undefined}
                    setConfirmed={setConfirmed}
                    type={type}
                    setImage={callS3}
                />
            )}
        </>
    );
};

export default withAuth(ProfileModule);
