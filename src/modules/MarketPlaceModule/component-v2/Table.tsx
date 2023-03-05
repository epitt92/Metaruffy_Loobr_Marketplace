import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import VerifiedIcon from '../../../components-v2/VerifiedIcon';
import BlurImage from '../../../components/blurimage/BlurImage';
import Button from '../../../components/Button/Button';
import EthIcon from '../../../components/icons/EthIcon';
import blockchains from '../../../contractsData/blockchains';
import { _io } from '../../../services-v2/socket.service';
import { formatNumber } from '../../../utils/functions';

const Table = () => {
    const Explore = [
        {
            item: 'Årets nyförvärv',
            rarity: 'Ovanlig',
            editions: '625',
            farmon1: '10 % rabatt',
            farmon2: 'Rabatthäfte',
            utility: 'Prime'
        }
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [newCollections, setNewCollections] = useState(null);
    const [mixedCollections, setMixedCollections] = useState(null);

    const listenSocket = () => {
        // log socket connection
        _io.on('initialize', (data: any) => {
            setNewCollections(data.newCollections);
            setMixedCollections(data.mixedCollections);
            console.log('initialize', data);
            setIsLoading(false);
        });
        _io.on('ethchanged', (data: any) => {
            const temp: any = newCollections;
            temp[0] = data;
            setNewCollections(temp);
        });

        // log _io connection
        _io.on('bnbchanged', (data: any) => {
            const temp: any = newCollections;
            temp[1] = data;
            setNewCollections(temp);
        });
        // log _io connection
        _io.on('maticchanged', (data: any) => {
            const temp: any = newCollections;
            temp[2] = data;
            setNewCollections(temp);
        });
        // log _io connection
        _io.on('avaxchanged', (data: any) => {
            const temp: any = newCollections;
            temp[3] = data;
            setNewCollections(temp);
        });
    };

    useEffect(() => {
        // update chat on new message dispatched
        setIsLoading(true);
        listenSocket();
        // getTrending();
        // socket disconnet onUnmount if exists
        if (_io) return () => _io.disconnect();
    }, []);
    return (
        <div className="flex  flex-col">
            <div className="overflow-x-auto">
                <div className="align-middle inline-block min-w-full">
                    <div className="overflow-hidden  ">
                        <table className="min-w-full border-separate border-spacing-x-4    ">
                            <thead className="bg-[#2B2B35] ">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left   tracking-wider">
                                        NAME
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left   tracking-wider">
                                        FLOOR PRICE
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider">
                                        TOP BID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider">
                                        1D CHANGE
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider">
                                        7D CHANGE
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider whitespace-nowrap">
                                        1D VOLUME
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider whitespace-nowrap">
                                        7D VOLUME
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider whitespace-nowrap">
                                        OWNERS
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-4  text-[10px] font-Proxima-Bold text-white  rounded-md text-left tracking-wider whitespace-nowrap">
                                        ITEMS
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#2B2B35] divide-y divide-gray-200">
                                {mixedCollections &&
                                    mixedCollections?.map((item: any, i: Number) => (
                                        <tr key={'pro' + i} className="">
                                            <td className=" px-4 py-1 whitespace-nowrap ">
                                                <div className="flex items-center gap-1 flex-shrink-0  ">
                                                    <span className=" icon-new Atpricehoverholder relative cursor-pointer">
                                                        {blockchains.map(
                                                            (blockchain: any) =>
                                                                blockchain.symbol === item?.chain && blockchain.tagname
                                                        )}

                                                        <span className="Atpricehover ">{item?.chain}</span>
                                                    </span>
                                                    <EthIcon className="hidden h-6 w-6 flex-shrink-0" />

                                                    <BlurImage
                                                        src={
                                                            item?.logo_url
                                                                ? item.logo_url
                                                                : '/assets/images/trenddefault.png'
                                                        }
                                                        figClassName="flex-shrink-0 rounded-full   relative overflow-hidden h-11 w-11"
                                                        className="rounded-full"
                                                        layout="fill"
                                                        objectFit="cover"
                                                    />
                                                    <div className="ml-1">
                                                        <div className="flex gap-1.5 items-center icon-star">
                                                            <h5 className=" text-[12px] truncate text-white font-Proxima-Bold capitalize">
                                                                {item?.contract_name}
                                                            </h5>
                                                            <svg
                                                                width="12"
                                                                height="12"
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
                                                        </div>
                                                        <h5 className=" text-[10px]  truncate   text-[#4C4C53] capitalize">
                                                            {item?.contract_address || '--'}
                                                        </h5>
                                                    </div>
                                                    <div className="flex gap-1 ml-3">
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <svg
                                                                    width="12"
                                                                    height="10"
                                                                    viewBox="0 0 12 10"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M0 0V8.54188H4.09409L5.55222 10L7.01034 8.54188H11.1044V0H0ZM0.854188 0.854188H10.2503V7.68769H6.65666L5.55222 8.79213L4.44778 7.68769H0.854188V0.854188ZM2.56256 2.13547V2.98966H8.54188V2.13547H2.56256ZM2.56256 3.84384V4.69803H8.54188V3.84384H2.56256ZM2.56256 5.55222V6.40641H6.8335V5.55222H2.56256Z"
                                                                        fill="#727279"
                                                                    />
                                                                </svg>
                                                                <p className="font-Proxima-Bold text-[10px] text-white">
                                                                    6,123
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 17 10"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M2.77778 0L0 2.77778H2.22222V10H11.6667L10.5556 8.88889H3.33333V2.77778H5.55556L2.77778 0ZM5 0L6.11111 1.11111H13.3333V7.22222H11.1111L13.8889 10L16.6667 7.22222H14.4444V0H5Z"
                                                                        fill="#88898A"
                                                                    />
                                                                </svg>

                                                                <p className="font-Proxima-Bold text-[10px] text-white">
                                                                    6,123
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <svg
                                                                    width="11"
                                                                    height="10"
                                                                    viewBox="0 0 11 10"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M9.29901 4.5439L5.31372 9.29901L1.32843 4.52429C0.851856 3.86207 0.664215 3.41472 0.664215 2.80232C0.664215 1.6602 1.47954 0.632333 2.65686 0.622701C3.62528 0.614731 4.72323 1.60374 5.31372 2.34932C5.8886 1.62997 7.00215 0.622701 7.97058 0.622701C9.11668 0.622701 9.96322 1.6602 9.96322 2.80232C9.96322 3.41472 9.81477 3.89529 9.29901 4.5439ZM7.97058 0C6.86366 0 6.02609 0.649602 5.31372 1.32843C4.63522 0.608089 3.76377 0 2.65686 0C1.09795 0 0 1.34038 0 2.80232C0 3.58642 0.321148 4.15101 0.67285 4.68171L4.80194 9.63211C5.26523 10.1226 5.35291 10.1226 5.8162 9.63211L9.95459 4.68171C10.3684 4.15101 10.6274 3.58642 10.6274 2.80232C10.6274 1.34038 9.52949 0 7.97058 0Z"
                                                                        fill="#727279"
                                                                    />
                                                                </svg>

                                                                <p className="font-Proxima-Bold text-[10px] text-white">
                                                                    6,123
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 12 12"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M1 7.44443C1 7.13326 1 6.97771 1.06055 6.85888C1.11382 6.75432 1.19881 6.66938 1.30334 6.6161C1.42218 6.55554 1.57775 6.55554 1.88889 6.55554H2.33333C2.64447 6.55554 2.80004 6.55554 2.91888 6.6161C3.02342 6.66938 3.10841 6.75432 3.16167 6.85888C3.22222 6.97771 3.22222 7.13326 3.22222 7.44443V10.1111C3.22222 10.4223 3.22222 10.5778 3.16167 10.6967C3.10841 10.8012 3.02342 10.8862 2.91888 10.9394C2.80004 11 2.64447 11 2.33333 11H1.88889C1.57775 11 1.42218 11 1.30334 10.9394C1.19881 10.8862 1.11382 10.8012 1.06055 10.6967C1 10.5778 1 10.4223 1 10.1111V7.44443Z"
                                                                        stroke="#727279"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M4.88892 1.88889C4.88892 1.57775 4.88892 1.42218 4.94947 1.30334C5.00275 1.19881 5.08769 1.11382 5.19225 1.06055C5.31108 1 5.46664 1 5.77781 1H6.22225C6.53342 1 6.68897 1 6.80781 1.06055C6.91236 1.11382 6.9973 1.19881 7.05058 1.30334C7.11114 1.42218 7.11114 1.57775 7.11114 1.88889V10.1111C7.11114 10.4223 7.11114 10.5778 7.05058 10.6967C6.9973 10.8012 6.91236 10.8862 6.80781 10.9394C6.68897 11 6.53342 11 6.22225 11H5.77781C5.46664 11 5.31108 11 5.19225 10.9394C5.08769 10.8862 5.00275 10.8012 4.94947 10.6967C4.88892 10.5778 4.88892 10.4223 4.88892 10.1111V1.88889Z"
                                                                        stroke="#727279"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                    <path
                                                                        d="M8.77759 5.22226C8.77759 4.9111 8.77759 4.75555 8.83814 4.63671C8.89142 4.53218 8.97637 4.44719 9.08092 4.39392C9.19975 4.33337 9.35531 4.33337 9.66648 4.33337H10.1109C10.4221 4.33337 10.5776 4.33337 10.6965 4.39392C10.801 4.44719 10.886 4.53218 10.9393 4.63671C10.9998 4.75555 10.9998 4.9111 10.9998 5.22226V10.1112C10.9998 10.4223 10.9998 10.5779 10.9393 10.6967C10.886 10.8013 10.801 10.8862 10.6965 10.9395C10.5776 11 10.4221 11 10.1109 11H9.66648C9.35531 11 9.19975 11 9.08092 10.9395C8.97637 10.8862 8.89142 10.8013 8.83814 10.6967C8.77759 10.5779 8.77759 10.4223 8.77759 10.1112V5.22226Z"
                                                                        stroke="#727279"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>

                                                                <p className="font-Proxima-Bold text-[10px] text-white">
                                                                    6,123
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" flex ml-2 gap-2 ">
                                                        <Button className="text-[12px] font-Proxima-Bold py-3 px-4">
                                                            Follow
                                                        </Button>
                                                        <Button className="text-[12px] font-Proxima-Bold py-3 px-4">
                                                            View
                                                        </Button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold text-white  ">
                                                {item?.floor_price
                                                    ? `${formatNumber(item?.floor_price.toFixed(2), 3)} ${item?.chain}`
                                                    : '-'}{' '}
                                            </td>
                                            <td className=" px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold text-white ">
                                                -
                                            </td>
                                            <td
                                                className={`${
                                                    item?.volume_change_1d < 0 ? 'text-red-500 ' : 'text-green-500'
                                                } px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold  `}>
                                                {item?.volume_change_1d}%
                                            </td>
                                            <td
                                                className={`${
                                                    item?.volume_change_7d < 0 ? 'text-red-500 ' : 'text-green-500'
                                                } px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold  `}>
                                                {item?.volume_change_7d}%
                                            </td>
                                            <td
                                                className={`${
                                                    item?.volume_1d < 0 ? 'text-red-500 ' : 'text-white'
                                                } px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold  `}>
                                                {formatNumber(Math.floor(item?.volume_1d), 3) || '--'} {item?.chain}
                                            </td>
                                            <td
                                                className={`${
                                                    item?.volume_7d < 0 ? 'text-red-500 ' : 'text-white'
                                                } px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold  `}>
                                                {formatNumber(Math.floor(item?.volume_7d), 3) || '--'} {item?.chain}
                                            </td>
                                            <td className=" px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold text-white  ">
                                                {formatNumber(item?.owners_total, 3) || '--'}
                                            </td>
                                            <td className=" px-4 py-3.5 whitespace-nowrap text-[10px] font-Proxima-Bold text-white  ">
                                                {formatNumber(item?.items_total, 3) || '--'}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
