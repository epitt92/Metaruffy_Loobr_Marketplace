import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlurImage from '../../components/blurimage/BlurImage';
import { Follow } from './Follow';
import Verified from '../../components/header/GlobalSearch/components/VerifiedIcon';

import TrendsTableCalculator from './TrendsTableCalculator';
import { getUser } from '../../redux/auth/actions';
import { useQuery } from 'react-query';
import { collectionService } from '../../services/collectios.service';
import TableLoader from '../../components/tableloader/TableLoader';
import { formatNumber } from '../../utils/functions';

import BscIcon2 from './icon/BscIcontrend';
import EthIcon2 from './icon/EthIconTrend';
import Avalanche2 from './icon/AvalancheIcontrend';
import MeticIcon2 from './icon/Meticicontrend';
import { useRouter } from 'next/router';

const TrendingTable = ({ page, selectedBlockchain }: any) => {
    const router = useRouter();
    const [star, setStar] = useState(false);

    console.log(selectedBlockchain, 'block');

    const user = useSelector((state: any) => state.auth.user);
    // const [loading, setLoading] = useState<boolean>(false);

    const { data, isLoading } = useQuery(
        ['feature-collection', selectedBlockchain?.symbol, page],
        () => collectionService.getTrendingCollections({ chain: selectedBlockchain?.symbol, page: page, pageSize: 50 }),
        {
            // enabled: Boolean(user?.userId),
            refetchOnMount: false,
            staleTime: 1000 * 60 * 60
        }
    );

    // let res = await collectionService.getTrendingCollections(query);
    return (
        <div className="flex flex-col ">
            <div className="overflow-x-auto overflow-y-hidden">
                <div className="inline-block min-w-full align-middle">
                    <div className="relative rounded-2xl border border-[#2B2B35]">
                        <table className="min-w-full  divide-y divide-[#2B2B35]">
                            <thead className="">
                                <tr>
                                    <th scope="col" className="AtOrderTableHead w-[20%]">
                                        Collection
                                    </th>
                                    {/* <th scope="col" className="AtOrderTableHead">
                                        Market Cap
                                    </th> */}
                                    <th scope="col" className="AtOrderTableHead w-[13%] ">
                                        <span className="flex justify-end"> Volume</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead   flex justify-end">
                                        <span className="flex justify-end  w-[13%]"> Floor Price</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead  w-[13%]">
                                        <span className="flex justify-end"> Vol. 24h%</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead  w-[13%]">
                                        <span className="flex justify-end"> Vol. 7d%</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead  w-[13%]">
                                        <span className="flex justify-end"> Holders</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead  w-[13%]">
                                        <span className="flex justify-end"> Supply</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2B2B35]">
                                {isLoading && <TableLoader />}
                                {data?.data?.data?.map((item: any) => (
                                    <tr
                                        key={item?.contract_name}
                                        className="hover:bg-[#262632] icon-star cursor-pointer"
                                        onClick={() => {
                                            router.push(
                                                `/collections/address/${item?.contract_address}?chain=${selectedBlockchain?.symbol}`
                                            );
                                        }}>
                                        <td className="cursor-pointer AtOrderTableItems    ">
                                            <div className="flex items-center gap-6  ">
                                                <Link
                                                    legacyBehavior
                                                    href={`/collections/address/${item?.contract_address}?chain=${selectedBlockchain?.symbol}`}>
                                                    <a className="flex items-center gap-6 ">
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

                                                        <div className="  flex items-center  gap-2">
                                                            <h6 className="text-white   max-w-[13rem]   truncate  cursor-pointer">
                                                                <span className=" truncate   border-b border-transparent hover:border-white ">
                                                                    {item?.contract_name}
                                                                </span>
                                                                {/* <span className=" ml-1.5">
                                                                    <i
                                                                        onClick={() => setStar(!star)}
                                                                        className={` hidden ${
                                                                            star
                                                                                ? 'text-themecolor icon-start'
                                                                                : ' icon-ion_star text-white'
                                                                        }   text-lg`}></i>
                                                                </span> */}
                                                            </h6>
                                                            {/* <h2 className="flex-shrink-0">
                                                                {item?.collectionVerified && <Verified size={true} />}
                                                            </h2> */}
                                                        </div>
                                                    </a>
                                                </Link>
                                            </div>
                                        </td>
                                        {/* <td className="AtOrderTableItems">{item?.contract_name}</td> */}
                                        {/* <td className="AtOrderTableItems ">
                                            <span className="flex gap-2 items-center ">
                                                {Number(Number(item?.market_cap).toFixed(2)).toLocaleString()}
                                                <span className=" icon-new Atpricehoverholder relative cursor-pointer">
                                                    {selectedBlockchain?.tagname}
                                                    <span className="Atpricehover ">
                                                        {selectedBlockchain?.symbol == 'BSC'
                                                            ? 'BNB'
                                                            : selectedBlockchain?.symbol}
                                                    </span>
                                                </span>
                                            </span>
                                        </td> */}
                                        <td className="flex justify-end  text-right AtOrderTableItems   ">
                                            <span className="flex gap-2 items-center  ">
                                                {Number(Number(item?.volume_total).toFixed(2)).toLocaleString()}
                                                <span className=" icon-new Atpricehoverholder relative cursor-pointer">
                                                    {selectedBlockchain?.tagname}

                                                    <span className="Atpricehover ">
                                                        {selectedBlockchain?.symbol == 'BSC'
                                                            ? 'BNB'
                                                            : selectedBlockchain?.symbol}
                                                    </span>
                                                </span>
                                            </span>
                                        </td>
                                        <td className="AtOrderTableItems    ">
                                            <span className="flex justify-end  text-right  ">
                                                <span className="flex gap-2 items-center ">
                                                    {item?.floor_price ? formatNumber(item?.floor_price, 3) : '--'}{' '}
                                                    <span className=" icon-new Atpricehoverholder relative cursor-pointer">
                                                        {selectedBlockchain?.tagname}
                                                        <span className="Atpricehover ">
                                                            {selectedBlockchain?.symbol == 'BSC'
                                                                ? 'BNB'
                                                                : selectedBlockchain?.symbol}
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                        </td>
                                        <td
                                            className={`${
                                                item?.volume_change_1d?.includes('-')
                                                    ? 'AtOrderTableItems3 '
                                                    : 'AtOrderTableItems2'
                                            } flex items-center gap-1 mt-2`}>
                                            <span className="flex justify-end w-full   text-right  ">
                                                <span className="flex gap-1 items-center">
                                                    {item?.volume_change_1d?.includes('-') ? (
                                                        <svg
                                                            className="rotate-180"
                                                            width="17"
                                                            height="16"
                                                            viewBox="0 0 17 16"
                                                            fill="none">
                                                            <path
                                                                d="M7.92984 5.80417C8.32617 5.3718 9.00781 5.3718 9.40415 5.80417L12.6309 9.32427C13.2189 9.96568 12.7639 11 11.8938 11H5.44023C4.57012 11 4.11512 9.96568 4.70307 9.32428L7.92984 5.80417Z"
                                                                fill="#ea3943"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                            <path
                                                                d="M7.92984 5.80417C8.32617 5.3718 9.00781 5.3718 9.40415 5.80417L12.6309 9.32427C13.2189 9.96568 12.7639 11 11.8938 11H5.44023C4.57012 11 4.11512 9.96568 4.70307 9.32428L7.92984 5.80417Z"
                                                                fill="#17BF63"></path>
                                                        </svg>
                                                    )}
                                                </span>

                                                {item?.volume_change_1d}
                                            </span>
                                        </td>

                                        <td
                                            className={`${
                                                item?.average_price_change_7d?.includes('-')
                                                    ? 'AtOrderTableItems3'
                                                    : 'AtOrderTableItems2'
                                            }`}>
                                            <span className="flex justify-end w-full  text-right  ">
                                                <span className="flex gap-1 items-center">
                                                    {item?.average_price_change_7d?.includes('-') ? (
                                                        <svg
                                                            className="rotate-180"
                                                            width="17"
                                                            height="16"
                                                            viewBox="0 0 17 16"
                                                            fill="none">
                                                            <path
                                                                d="M7.92984 5.80417C8.32617 5.3718 9.00781 5.3718 9.40415 5.80417L12.6309 9.32427C13.2189 9.96568 12.7639 11 11.8938 11H5.44023C4.57012 11 4.11512 9.96568 4.70307 9.32428L7.92984 5.80417Z"
                                                                fill="#ea3943"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                            <path
                                                                d="M7.92984 5.80417C8.32617 5.3718 9.00781 5.3718 9.40415 5.80417L12.6309 9.32427C13.2189 9.96568 12.7639 11 11.8938 11H5.44023C4.57012 11 4.11512 9.96568 4.70307 9.32428L7.92984 5.80417Z"
                                                                fill="#17BF63"></path>
                                                        </svg>
                                                    )}
                                                    {item?.average_price_change_7d}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="AtOrderTableItems">
                                            <span className="flex justify-end w-full  text-right  ">
                                                {formatNumber(item?.owners_total, 3) || '--'}
                                            </span>
                                        </td>
                                        <td className="AtOrderTableItems">
                                            <span className="flex justify-end w-full  text-right  ">
                                                {formatNumber(item?.items_total, 3) || '--'}
                                            </span>
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

export default TrendingTable;
