import Link from 'next/link';
import React, { useState } from 'react';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import nft from '../../core/contracts/nft';
import { formatNumber, NftContentType } from '../../utils/functions';
import ImageComponent from '../Image/ImageComponent';
import { LikeComponent } from '../Like/LikeComponent';
import Blockchains from '../maincard/components/Blockchains';
import Cardchains from '../maincard/components/Cardchains ';
import CommentCount from '../maincard/components/CommentCount';
import Verified from '../verified';
import VideoComponent from '../video/videoComponent';

const CollectionCardComponent = ({ data, size }: any) => {
    const [star, setStar] = useState(false);

    console.log(data.chain, 'chain');

    // ui views
    const renderContentView = (nft: any, dimentions?: any) => {
        switch (NftContentType(data?.logoPicture)) {
            case 'mp4':
                return (
                    <VideoComponent
                        src={nft?.logoPicture}
                        className="rounded-full w-full h-full object-cover border-2 h-[102px] border-white "
                        figClassName=" flex-shrink-0 mx-auto w-[102px]  h-[102px] relative overflow-hidden  border-2 border-white  rounded-full "
                        ParentClass="parent-class"
                    />
                );
            case 'gif':
                return (
                    <VideoComponent
                        src={nft?.logoPicture}
                        fileType={'gif'}
                        className="rounded-full w-full h-full object-cover border-2 border-white "
                        figClassName=" flex-shrink-0 mx-auto w-[102px]  h-[102px] relative overflow-hidden  border-2 border-white  rounded-full "
                        ParentClass="parent-class"
                    />
                );
            case 'glb':
                return (
                    <ImageComponent
                        className="rounded-full w-full h-full object-cover border-2 border-white "
                        alt=""
                        figClassName=" flex-shrink-0 mx-auto w-[102px]  h-[102px] relative overflow-hidden  border-2 border-white  rounded-full "
                        src={data?.logoPicture || '/assets/images/loobr-collection-default.png'}
                        {...(!size && { height: size?.height || 480, width: size?.width || 500 })}
                        blurEffect
                        defaultPlaceholder={'/assets/images/loobr-collection-default.png'}
                    />
                );
            default:
                return (
                    <ImageComponent
                        className="rounded-full w-full h-full object-cover border-2 border-white "
                        alt=""
                        figClassName=" flex-shrink-0 mx-auto w-[102px]  h-[102px] relative overflow-hidden  border-2 border-white  rounded-full "
                        src={data?.logoPicture || '/assets/images/loobr-collection-default.png'}
                        {...(!size && { height: size?.height || 480, width: size?.width || 500 })}
                        blurEffect
                        defaultPlaceholder={'/assets/images/loobr-collection-default.png'}
                    />
                );
        }
    };
    // var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <Link
            legacyBehavior
            href={
                data?.address
                    ? `/collections/address/${data?.address}?chain=${data?.chain}`
                    : `/collections/${data?._id}`
            }
            key={data?._id}>
            <a>
                <div className="bg-[#2B2B35] rounded-[1rem] p-4 pb-6 ">
                    <div className=" relative ">
                        <div className="mt-2.5">{renderContentView(data)}</div>
                    </div>
                    <div className="mt-6">
                        <div className="flex gap-1.5 items-center icon-star">
                            <h5 className="md:max-w-[18rem] max-w-[15rem] text-2xl   truncate   text-white font-Proxima-Bold capitalize braek">
                                {data?.name || '--'}
                            </h5>
                            <span> {data?.isVerfied && <Verified />}</span>
                            {/* <span className=" ">
                            <i
                                onClick={() => setStar(!star)}
                                className={` hidden ${
                                    star ? 'text-themecolor icon-start' : ' icon-ion_star text-white'
                                }   text-xl`}></i>
                            </span> */}
                        </div>
                        <div className={`flex gap-3  mb-5 mt-8 hidden`}>
                            {/* <LikeComponent className=" " />

                            <CommentCount nft={undefined} /> */}

                            <div className="flex items-center ">
                                <div className="Atcardhovershare-bg">
                                    <svg
                                        className="Atcardhovershare"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 22 22"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.91 5.03003C17.91 6.42003 19.29 8.63003 19.57 11.18M2.44 11.23C2.7 8.68996 4.06 6.47996 6.04 5.07996M7.14001 19.7999C8.30001 20.3899 9.62002 20.7199 11.01 20.7199C12.35 20.7199 13.61 20.4199 14.74 19.8699M13.79 3.78C13.79 5.31535 12.5454 6.56 11.01 6.56C9.47469 6.56 8.23004 5.31535 8.23004 3.78C8.23004 2.24465 9.47469 1 11.01 1C12.5454 1 13.79 2.24465 13.79 3.78ZM6.56 16C6.56 17.5353 5.31535 18.78 3.78 18.78C2.24465 18.78 1 17.5353 1 16C1 14.4646 2.24465 13.22 3.78 13.22C5.31535 13.22 6.56 14.4646 6.56 16ZM20.9 16C20.9 17.5353 19.6554 18.78 18.12 18.78C16.5847 18.78 15.34 17.5353 15.34 16C15.34 14.4646 16.5847 13.22 18.12 13.22C19.6554 13.22 20.9 14.4646 20.9 16Z"
                                            stroke="#A1A1A5"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                <p className=" text-[#989B9F] text-sm ml-[2px]  font-Proxima-Bold">Share</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[14px] text-white font-Proxima-Regular mb-[5px] tracking-wider">
                                Blockchain
                            </h4>
                            <Blockchains blockchain={data?.chain} />
                            <div className="sm:grid grid-cols-2 gap-2 mt-6">
                                <div className="bg-[#3C3C47] rounded-lg border border-[#4F4F5C] pt-2 pb-3 sm:mt-0 mt-4 flex justify-center items-center flex-col">
                                    <h6 className="text-base font-Proxima-SemiBold text-white ">Volume Traded</h6>
                                    <h6 className=" text-themecolor text-lg  mt-1 flex gap-2 items-center ">
                                        {data?.isExternal
                                            ? data?.totalVolume
                                                ? formatNumber(data?.totalVolume, 2)
                                                : data?.usdtVolume
                                                ? formatNumber(data?.usdtVolume, 2)
                                                : '--'
                                            : '--'}
                                        {(data?.isExternal
                                            ? Boolean(data?.totalVolume)
                                            : Boolean(data?.usdtVolume) && data?.usdtVolume) && (
                                            <Cardchains blockchain={data?.chain} removetootip size="sm" />
                                        )}
                                    </h6>
                                </div>
                                <div className="bg-[#3C3C47] rounded-lg border border-[#4F4F5C] pt-2 py-3  sm:mt-0 mt-4 flex justify-center items-center flex-col">
                                    <h6 className="text-base font-Proxima-SemiBold text-white ">Total Holders</h6>
                                    <h6 className=" text-themecolor text-lg mt-1 ">
                                        {data?.owners ? formatNumber(data?.owners, 0) : 0}
                                    </h6>
                                </div>
                                <div className="bg-[#3C3C47] rounded-lg border border-[#4F4F5C] pt-2 py-3 sm:mt-0 mt-4 flex justify-center items-center flex-col">
                                    <h6 className="text-base font-Proxima-SemiBold text-white ">Total Supply</h6>
                                    <h6 className=" text-themecolor text-lg mt-1 ">
                                        {data?.totalSupply ? formatNumber(data?.totalSupply, 0) : '--'}
                                    </h6>
                                </div>
                                <div className="bg-[#3C3C47] rounded-lg border border-[#4F4F5C] pt-2 py-3 sm:mt-0 mt-4 flex justify-center items-center flex-col">
                                    <h6 className="text-base font-Proxima-SemiBold text-white ">Floor Price</h6>
                                    <h6 className=" text-themecolor text-lg mt-1 flex gap-2 items-center ">
                                        {' '}
                                        {data?.floorPrice ? formatNumber(data?.floorPrice, 3) : '--'}
                                        {data?.floorPrice && (
                                            <Cardchains blockchain={data?.chain} removetootip size="sm" />
                                        )}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default CollectionCardComponent;
