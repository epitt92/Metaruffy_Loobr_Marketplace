import Link from 'next/link';
import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import nft from '../../core/contracts/nft';
import { formatNumber, NftContentType } from '../../utils/functions';

import ImageComponent from '../../components/Image/ImageComponent';
import { LikeComponent } from '../../components/Like/LikeComponent';
import Blockchains from '../maincard/components/Blockchains';
import Cardchains from '../../components/maincard/components/Cardchains ';
import CommentCount from '../../components/maincard/components/CommentCount';
import Verified from '../../components/verified';
import VideoComponent from '../../components/video/videoComponent';

const CollectionCardComponent = ({ data, size }: any) => {
    const [star, setStar] = useState(false);
    const getCloudinaryImage = (url: string, size: Number) => {
        console.log(url);
        return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/w_${size}/${url}`;
    };
    // ui views
    const renderContentView = (nft: any, dimentions?: any) => {
        const type = data?.logo_url ? data?.logo_url.split(/[#?]/)[0].split('.').pop().trim() : 'png';
        console.log(type, data?.logo_url);
        switch (type) {
            case 'mp4':
                return (
                    <VideoComponent

                        src={data?.logo_url}
                        className="rounded-full w-full h-full object-cover border-2 h-[50px] border-white "
                        figClassName=" flex-shrink-0 mx-auto w-[50px]  h-[50px] relative overflow-hidden  border-2 border-white  rounded-full "
                        ParentClass="parent-class"
                    />
                );
            case 'gif':
                return (
                    <VideoComponent
                        src={getCloudinaryImage(data?.logo_url, 50)}
                        fileType={'gif'}
                        className="rounded-full w-full h-full object-cover border-2 border-white "
                        figClassName=" flex-shrink-0 mx-auto w-[50px]  h-[50px] relative overflow-hidden  border-2 border-white  rounded-full "
                        ParentClass="parent-class"
                    />
                );
            case 'glb':
                return (
                    <ImageComponent
                        className="rounded-full w-full h-full object-cover border-2 border-white "
                        alt=""
                        figClassName=" flex-shrink-0 mx-auto w-[50px]  h-[50px] relative overflow-hidden  border-2 border-white  rounded-full "
                        src={data?.logo_url || '/assets/images/loobr-collection-default.png'}
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
                        figClassName=" flex-shrink-0 mx-auto w-[50px]  h-[50px] relative overflow-hidden  border-2 border-white  rounded-full "
                        src={data?.logo_url || '/assets/images/loobr-collection-default.png'}
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
                <div className="bg-[#2B2B35] rounded-md p-4 border border-[#5C5C63]">
                    <div className=" relative ">
                        <Blockchains blockchain={data?.chain} />
                        <div className="absolute top-0 v2-center">{renderContentView(data?.logo_url)}</div>
                        <div className="mt-2.5">
                            <img src={data?.banner_url} className="w-full h-[120px] rounded-md" alt="" />

                        </div>
                    </div>
                    <div className="flex justify-between gap-2 items-center mt-2">
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
                            <p className="font-Proxima-Bold text-[10px]">6,123</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg
                                width="17"
                                height="10"
                                viewBox="0 0 17 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.77778 0L0 2.77778H2.22222V10H11.6667L10.5556 8.88889H3.33333V2.77778H5.55556L2.77778 0ZM5 0L6.11111 1.11111H13.3333V7.22222H11.1111L13.8889 10L16.6667 7.22222H14.4444V0H5Z"
                                    fill="#88898A"
                                />
                            </svg>

                            <p className="font-Proxima-Bold text-[10px]">6,123</p>
                        </div>
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

                            <p className="font-Proxima-Bold text-[10px]">6,123</p>
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

                            <p className="font-Proxima-Bold text-[10px]">6,123</p>
                        </div>
                    </div>
                    <div className="mt-1">
                        <div className="flex gap-1.5 items-center icon-star">
                            <h5 className=" text-[12px] truncate text-white font-Proxima-Bold capitalize">
                                {data?.contract_name || '--'}
                            </h5>
                            <span> {data?.isVerfied && <Verified />}</span>
                        </div>
                        <h5 className=" text-[10px]  truncate   text-[#4C4C53] capitalize">
                            {data?.contract_address || '--'}
                        </h5>
                        <hr className="border-[#4C4C53]" />
                        <div>
                            <div className="sm:grid grid-cols-2 gap-2 mt-2">
                                <div className="bg-[#2B2B35] rounded-lg border border-[#4C4C53] py-1  flex justify-center items-center flex-col">
                                    <p className="text-[12px] font-Proxima-Bold text-white ">Volume</p>
                                    <p className=" text-themecolor text-[10px]">
                                        {data?.volume_1d ? formatNumber(data?.volume_1d, 0) : '--'}
                                    </p>
                                </div>
                                <div className="bg-[#2B2B35] rounded-lg border border-[#4C4C53] py-1  flex justify-center items-center flex-col">
                                    <p className="text-[12px] font-Proxima-Bold text-white ">Volume</p>
                                    <p className=" text-themecolor text-[10px]">
                                        {data?.owners_total ? formatNumber(data?.owners_total, 0) : 0}
                                    </p>
                                </div>
                                <div className="bg-[#2B2B35] rounded-lg border border-[#4C4C53] py-1  flex justify-center items-center flex-col">
                                    <p className="text-[12px] font-Proxima-Bold text-white ">Volume</p>
                                    <p className=" text-themecolor text-[10px]">
                                        {data?.items_total ? formatNumber(data?.items_total, 0) : '--'}
                                    </p>
                                </div>
                                <div className="bg-[#2B2B35] rounded-lg border border-[#4C4C53] py-1  flex justify-center items-center flex-col">
                                    <p className="text-[12px] font-Proxima-Bold text-white ">Volume</p>
                                    <p className=" text-themecolor text-[10px]">
                                        {data?.floor_price ? formatNumber(data?.floor_price, 3) : '--'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr className="border-[#4C4C53] my-2" />
                        <div className="grid grid-cols-2 gap-2 mx-auto">
                            <Button className="text-[12px] font-Proxima-Bold py-2">Follow</Button>
                            <Button className="text-[12px] font-Proxima-Bold py-2">View</Button>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export default CollectionCardComponent;
