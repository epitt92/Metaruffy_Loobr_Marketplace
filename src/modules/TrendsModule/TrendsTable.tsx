import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import BlurImage from '../../components/blurimage/BlurImage';
import { Follow } from './Follow';
import Verified from '../../components/header/GlobalSearch/components/VerifiedIcon';

import TrendsTableCalculator from './TrendsTableCalculator';
import { getUser } from '../../redux/auth/actions';
const TrendsTable = ({ data, page, selectedBlockchain }: any) => {
    const user = useSelector((state: any) => state.auth.user);
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    return (
        <div className="flex flex-col ">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="relative rounded-2xl border border-[#2B2B35]">
                        <table className="min-w-full  divide-y divide-[#2B2B35]">
                            <thead className="">
                                <tr>
                                    <th scope="col" className="AtOrderTableHead w-[18%]">
                                        Collections
                                    </th>
                                    <th scope="col" className="AtOrderTableHead w-[18%]">
                                        Owner
                                    </th>
                                    <th scope="col" className="AtOrderTableHead w-[12.8%]">
                                        <span className="flex justify-end"> Total NFTs</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead w-[12.8%]">
                                        <span className="flex justify-end"> Holders</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead w-[12.8%]">
                                        <span className="flex justify-end"> Total Likes</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead w-[12.8%]">
                                        <span className="flex justify-end"> Total Comments</span>
                                    </th>
                                    <th scope="col" className="AtOrderTableHead w-[12.8%]">
                                        <span className="flex justify-end"> Floor Price</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2B2B35]">
                                {data?.map((item: any, i: number) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-[#262632] cursor-pointer "
                                        onClick={() => {
                                            router.push(
                                                item?.isExternal
                                                    ? `/collections/address/${item?.address}?chain=${item?.chain}`
                                                    : `/collections/${item?._id}`
                                            );
                                        }}>
                                        <td className="cursor-pointer AtOrderTableItems ">
                                            <div className="flex items-center gap-6">
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        item?.isExternal
                                                            ? `/collections/address/${item?.address}?chain=${item?.chain}`
                                                            : `/collections/${item?._id}`
                                                    }>
                                                    <a className="flex items-center gap-6 ">
                                                        <BlurImage
                                                            src={
                                                                item?.logoPicture
                                                                    ? item.logoPicture
                                                                    : '/assets/images/trenddefault.png'
                                                            }
                                                            figClassName="flex-shrink-0  rounded-full relative overflow-hidden h-11 w-11"
                                                            className="rounded-full"
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                        <div className="w-[9rem]  flex items-center truncate gap-2">
                                                            <h6 className="text-white truncate cursor-pointer">
                                                                <span className="truncate border-b border-transparent hover:border-white ">
                                                                    {item?.name}
                                                                </span>
                                                            </h6>
                                                            <h2 className="flex-shrink-0">
                                                                {item?.collectionVerified && <Verified size={true} />}
                                                            </h2>
                                                        </div>
                                                    </a>
                                                </Link>

                                                {/* <Follow
                                                    userModule={true}
                                                    // otherUser={feed?.user}
                                                    // followers={followers}
                                                    // setFollowers={setFollowers}
                                                    // setConfirm={() => {}}
                                                /> */}
                                            </div>
                                        </td>
                                        <td className=" AtOrderTableItems">
                                            {item?.userId && (
                                                <div className="flex items-center gap-6">
                                                    <Link
                                                        legacyBehavior
                                                        href={
                                                            // item.userId == user?.userId
                                                            //     ? `/profile/me`
                                                            //     :
                                                            `/profile/${item?.userName}`
                                                        }>
                                                        <a className="flex items-center gap-6 ">
                                                            {item?.avatar ? (
                                                                <BlurImage
                                                                    src={
                                                                        item?.avatar
                                                                            ? item.avatar
                                                                            : '/assets/images/placeholder2.png'
                                                                    }
                                                                    figClassName="flex-shrink-0 rounded-full h-11 w-11"
                                                                    className="rounded-full"
                                                                    layout="fill"
                                                                />
                                                            ) : (
                                                                <p className="flex items-center justify-center text-2xl rounded-full h-11 w-11 bg-themecolor contain text-black1">
                                                                    {item &&
                                                                        item?.firstName &&
                                                                        item?.firstName?.charAt(0).toUpperCase()}
                                                                    {/* {} */}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center truncate  w-[9rem]   gap-1 ">
                                                                <span className="w-full text-white truncate cursor-pointer">
                                                                    <span className="truncate border-b border-transparent  hover:border-white">
                                                                        {item?.firstName} {item?.lastName}
                                                                    </span>
                                                                </span>
                                                                <h2 className="flex-shrink-0 ml-1">
                                                                    {item?.isVerfied && <Verified size={true} />}
                                                                </h2>
                                                            </div>
                                                        </a>
                                                    </Link>

                                                    {user &&
                                                        user?.userId &&
                                                        !user?.following?.includes(item?.userId) && (
                                                            <Follow
                                                                userModule={true}
                                                                otherUser={item?.userId}
                                                                loading={loading}
                                                                setLoading={setLoading}
                                                                className="!max-w-full !px-4"
                                                            />
                                                        )}
                                                </div>
                                            )}
                                        </td>
                                        <td className=" AtOrderTableItems">
                                        <span className='flex justify-end w-full  text-right  '>

                                            <TrendsTableCalculator count={item?.totalNft || 0} percent="+14.67" />
                                            </span>

                                        </td>
                                        <td className=" AtOrderTableItems">
                                        <span className='flex justify-end w-full  text-right  '>

                                            <TrendsTableCalculator count={item?.owners || 0} percent="+2" />
                                            </span>

                                        </td>
                                        <td className=" AtOrderTableItems">
                                        <span className='flex justify-end w-full  text-right  '>

                                            <TrendsTableCalculator count={item?.likes || 0} percent="+14.67" />
                                            </span>

                                        </td>
                                        <td className=" AtOrderTableItems">
                                        <span className='flex justify-end w-full  text-right  '>

                                            <TrendsTableCalculator count={item?.comment || 0} percent="+14.67" block />
                                            </span>

                                        </td>
                                        <td className="flex items-center gap-2  AtOrderTableItems">
                                        <span className='flex justify-end w-full  text-right  '>

                                            <TrendsTableCalculator count={item?.floorPrice || 0} percent="+14.67" />
                                            {selectedBlockchain?.symbol && (
                                                <>
                                                    {selectedBlockchain?.symbol == 'BSC'
                                                        ? 'BNB'
                                                        : selectedBlockchain?.symbol}
                                                </>
                                            )}
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

export default TrendsTable;
