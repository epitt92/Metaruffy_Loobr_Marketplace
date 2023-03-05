import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlurImage from '../../components/blurimage/BlurImage';

const ExternalCollectionTable = () => {
    return (
        <div className="flex flex-col ">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="relative overflow-hidden rounded-lg">
                        <table className="min-w-full  divide-y divide-[#2B2B35]">
                            <thead className="bg-[#1E1E29]">
                                <tr>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Collection
                                    </th>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Total NFTs
                                    </th>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Floor Price
                                    </th>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Chain
                                    </th>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Holders
                                    </th>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Likes
                                    </th>
                                    <th scope="col" className="AtCollectionTableHead">
                                        Comments
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {Array(6)
                                    .fill('')
                                    ?.map((item: any, i: number) => (
                                        <tr key={i}>
                                            <td className="cursor-pointer AtCollectionTableItems">
                                                <div className="flex items-center gap-6">
                                                    <Link legacyBehavior href="/external-collection-detail">
                                                        <a className="flex items-center gap-6 ">
                                                            <BlurImage
                                                                src={'/assets/images/placeholder2.png'}
                                                                figClassName="flex-shrink-0 relative overflow-hidden h-12 w-12"
                                                                className="rounded-lg"
                                                                layout="fill"
                                                                objectFit="cover"
                                                            />
                                                            <div className="w-[9rem]  flex items-center truncate gap-2">
                                                                <h6 className="text-white truncate cursor-pointer">
                                                                    <span className="truncate border-b border-transparent hover:border-white ">
                                                                        {/* {item?.name} */}
                                                                        Otherdeed
                                                                    </span>
                                                                </h6>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className=" AtCollectionTableItems">1</td>
                                            <td className=" AtCollectionTableItems">
                                                <i className="p-1.5 text-lg icon-etherum bg-[#627EEA] rounded-full"></i>
                                                {/* <i className="p-1.5 text-lg icon-avalanche bg-[#494958] rounded-full"></i>
                                                <i className="p-1.5 text-lg icon-blockchain bg-[#494958] rounded-full"></i>
                                                <i className="p-1.5 text-lg icon-solana bg-[#494958] rounded-full"></i>
                                                <i className="p-1.5 text-lg icon-polygon bg-[#494958] rounded-full"></i>
                                                <i className="p-1.5 text-lg icon-binance bg-[#F0B90B] rounded-full"></i> */}
                                            </td>
                                            <td className=" AtCollectionTableItems">3</td>
                                            <td className=" AtCollectionTableItems">4</td>
                                            <td className=" AtCollectionTableItems">5</td>
                                            <td className=" AtCollectionTableItems">6</td>
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

export default ExternalCollectionTable;
