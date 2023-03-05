import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CollectionEdit from '../../../components/Collections/CollectionEditdropdown';
import ImageComponent from '../../../components/Image/ImageComponent';
import VideoComponent from '../../../components/video/videoComponent';
import Webgl from '../../../components/Webgl';
import useMetaMask from '../../../hooks/useMetaMask';
import { formatNumber, NftContentType } from '../../../utils/functions';
import detailContentView from '../../NftDetailModule/detailContentView';
import { CollectionContext } from '../CollectionByAddressModule';
import Avalanche from '../../../components/icons/AvalancheIcon';
import EthIcon from '../../../components/icons/EthIcon';
import PolygonIcon from '../../../components/icons/PolygonIcon';
import BscIcon from '../../../components/icons/BscIcon';

type Props = {
    collection: any;
    stats: any;
    // fetchCollection: Function;
};

const CollectionInfo = ({ collection, stats }: Props) => {
    const { account }: any = useMetaMask();
    const [star, setStar] = useState(false);

    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const { nft, setNFT, image, setImage }: any = useContext(CollectionContext);

    // ui views
    const renderContentView = (nft: any, props?: any) => {
        switch (NftContentType(nft?.image, nft)) {
            case 'mp4':
                return (
                    <VideoComponent
                        src={nft?.animation_url ? nft?.animation_url : nft.image}
                        ChildClass={props?.feed && 'h-[23.438rem]   '}
                        ParentClass={props?.feed && 'true '}
                        figClassName="!bg-[#22222b]"
                        controls={props?.feed && 'controls'}
                    />
                );
            case 'gif':
                return (
                    <VideoComponent
                        src={nft.image}
                        fileType="gif"
                        ChildClass={props?.feed && 'h-[23.438rem] '}
                        ParentClass={props?.feed && 'true '}
                        figClassName="!bg-[#22222b]"
                        controls={props?.feed && 'controls'}
                    />
                );
            case 'glb':
                return (
                    <div className="bg-[#22222b]">
                        <div
                            className={`${
                                props?.feed ? 'h-[23.438rem] w-[23.438rem]' : 'h-[48.438rem] w-full'
                            }    gradient-weblg  mx-auto   !-z-50  `}>
                            <Webgl src={nft?.image} preview={nft?.preview} />
                        </div>
                    </div>
                );
            default:
                console.log({ nftImage: nft?.image });

                return (
                    <ImageComponent
                        className="rounded-full"
                        src={nft?.image}
                        defaultPlaceholder={'/assets/images/collectionimages/logo-image.jpg'}
                        {...(props?.layout !== 'fill' && {
                            height: props?.height || 164,
                            width: props?.width || 164
                        })}
                        objectFit={props?.objectFit || 'cover'}
                        layout={props?.layout}
                        alt={nft?.name}
                        key={nft?.name}
                        fileType={nft?.fileType}
                        quality={50}
                        figClassName={props?.figClassName}
                        blurEffect
                    />
                );
        }
    };

    return (
        <>
            <div className="flex items-center justify-between xs:flex-col xs:justify-center xs:items-center">
                <div className="xs:flex xs:justify-center xs:items-center xs:flex-col">
                    <div className=" relative  w-[164px] h-[164px]">
                        <figure className="AtthemeImage relative z-[2] bg-[#14141f] w-[164px] h-[164px] overflow-hidden   rounded-full border border-white">
                            {collection?.logoPicture ? (
                                <ImageComponent
                                    // width={164}
                                    // height={164}
                                    key={collection?.name}
                                    alt={collection?.name}
                                    objectFit="cover"
                                    layout="fill"
                                    className="rounded-full"
                                    src={collection?.logoPicture}
                                    quality={50}
                                    defaultPlaceholder={'/assets/images/collectionimages/logo-image.jpg'}
                                />
                            ) : (
                                nft && Object.keys(nft).length > 0 && renderContentView(nft, {})
                            )}

                            {/* {nft && Object.keys(nft).length > 0 ? (
                                renderContentView(nft, {})
                            ) : (
                                <ImageComponent
                                    // width={164}
                                    // height={164}
                                    key={collection?.name}
                                    alt={collection?.name}
                                    objectFit="cover"
                                    layout="fill"
                                    className="rounded-full"
                                    src={collection?.logoPicture}
                                    quality={50}
                                    defaultPlaceholder={'/assets/images/collectionimages/logo-image.jpg'}
                                />
                            )} */}
                        </figure>
                        <div className="absolute top-5 right-[-20px] z-20">
                            {collection?.isVerfied && (
                                <svg
                                    width="60"
                                    height="60"
                                    viewBox="0 0 60 60"
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
                            )}
                        </div>
                    </div>
                    <h3 className="w-full mt-6 text-4xl cursor-pointer text-white break-all font-Proxima-Bold">
                        {collection?.name}
                        {/* <span className=" ml-1.5">
                            <i
                                onClick={() => setStar(!star)}
                                className={` hidden ${
                                    star ? 'text-themecolor icon-start' : ' icon-ion_star text-white'
                                }   text-2xl`}></i>
                        </span> */}
                    </h3>
                    <div className="flex gap-1 text-[#B8B8BC]  w-full  break-all">
                        Contract Address:
                        <span className="flex items-center gap-2 text-white">
                            {collection?.address?.slice(0, 8) +
                                '...' +
                                collection?.address?.slice(
                                    collection?.address?.length - 4,
                                    collection?.address?.length
                                )}
                            <CopyToClipboard
                                text={collection?.address}
                                onCopy={() => toast.success('Address successfully copied')}>
                                <svg
                                    className="cursor-pointer"
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
                            </CopyToClipboard>
                        </span>
                    </div>
                    <p className="mt-3 text-[#a1a1a5]  w-full break-words ">{collection?.headline}</p>
                </div>
                <div className="">
                    <div className="flex gap-4 xs:mt-3 ">
                        {collection?.website && (
                            <Link legacyBehavior href={collection?.website}>
                                <a target="_blank">
                                    <div className="bg-[#2B2B35] h-[2.5rem] w-[2.5rem] p-2 rounded-lg cursor-pointer relative Atpricehoverholder">
                                        <span className="Atpricehover font-Proxima-Regular ">Website</span>

                                        <i className="text-2xl icon-web"></i>
                                    </div>
                                </a>
                            </Link>
                        )}
                        {collection?.twitter && (
                            <Link
                                legacyBehavior
                                href={
                                    collection?.twitter?.includes('https')
                                        ? collection?.twitter
                                        : `https://twitter.com/${collection?.twitter}`
                                }>
                                <a target="_blank">
                                    <div className="bg-[#2B2B35] h-[2.5rem] w-[2.5rem] p-2 rounded-lg cursor-pointer relative Atpricehoverholder">
                                        <span className="Atpricehover font-Proxima-Regular ">Twitter</span>

                                        <i className="text-2xl icon-twitter"></i>
                                    </div>
                                </a>
                            </Link>
                        )}
                        {collection?.discord && (
                            <Link legacyBehavior href={`${collection?.discord}`}>
                                <a target="_blank">
                                    <div className="bg-[#2B2B35] h-[2.25rem] w-[2.25rem] p-2 rounded-lg cursor-pointer relative Atpricehoverholder">
                                        <span className="Atpricehover font-Proxima-Regular ">Discord</span>

                                        <i
                                            className={` ${
                                                collection?.discord ? 'cursor-pointer' : 'cursor-default'
                                            } icon-discord text-2xl`}></i>
                                    </div>
                                </a>
                            </Link>
                        )}
                        {collection?.instagram && (
                            <Link
                                legacyBehavior
                                href={
                                    collection?.instagram?.includes('https')
                                        ? collection?.instagram
                                        : `https://www.instagram.com/${collection?.instagram}`
                                }>
                                <a target="_blank">
                                    <div className="bg-[#2B2B35] h-[2.5rem] w-[2.5rem] p-2 rounded-lg cursor-pointer  relative Atpricehoverholder">
                                        <span className="Atpricehover font-Proxima-Regular ">Instagram</span>
                                        <i className="text-2xl icon-instagram"></i>
                                    </div>
                                </a>
                            </Link>
                        )}
                        {collection?.facebook && (
                            <Link
                                legacyBehavior
                                href={
                                    collection?.facebook.includes('https')
                                        ? collection?.facebook
                                        : `https://facebook.com/${collection?.facebook}`
                                }
                                prefetch={false}>
                                <a target="_blank">
                                    <div className="bg-[#2B2B35] h-[2.5rem] w-[2.5rem] text-center p-2 rounded-lg cursor-pointer relative Atpricehoverholder">
                                        <span className="text-center Atpricehover font-Proxima-Regular ">Facebook</span>

                                        <i className="text-2xl icon-facebook"></i>
                                    </div>
                                </a>
                            </Link>
                        )}
                        {isAuthenticated && account && account === collection?.owner && (
                            <div className="">
                                <CollectionEdit collection={collection} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Sections */}
            <div className="grid grid-cols-2 gap-4 mt-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 ">
                {/* <div className="h-[6.813rem] sm:w-[11.75rem]  w-full lg:rounded-l-[16px] flex flex-col justify-center items-center border border-[#363648]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg   text-themecolor font-Proxima-SemiBold">
                        {collection?.stats?.firstMintDate
                            ? months[new Date(collection?.stats?.firstMintDate).getMonth()] +
                              ' ' +
                              new Date(collection?.stats?.firstMintDate).getFullYear()
                            : '--'}
                    </h3>
                    <p className="mt-4 text-white sm:text-lg">First mint date</p>
                </div>

                <div className="h-[6.813rem]   sm:w-[11.75rem]  w-full  flex flex-col justify-center items-center border border-[#363648]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg  text-themecolor font-Proxima-SemiBold">
                        {collection?.stats?.lastMintDate
                            ? months[new Date(collection?.stats?.lastMintDate).getMonth()] +
                              ' ' +
                              new Date(collection?.stats?.lastMintDate).getFullYear()
                            : '--'}
                    </h3>
                    <p className="mt-4 text-white sm:text-lg">Last mint date</p>
                </div> */}
                <div className="h-[6.813rem]  bg-[#21212F] relative Atpricehoverholder  rounded-xl  w-full  flex flex-col justify-center items-center border border-[#363648]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg  truncate w-3/4  text-center  text-themecolor font-Proxima-SemiBold">
                        {collection?.totalSupply ? formatNumber(collection?.totalSupply, 2) : '--'}
                    </h3>
                    <p className="mt-2 text-white sm:text-lg">Total Items</p>
                </div>

                <div className="h-[6.813rem]  relative Atpricehoverholder   w-full  flex flex-col justify-center items-center border border-[#363648] bg-[#21212F] rounded-xl">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg flex  text-center  text-themecolor font-Proxima-SemiBold">
                        <span className="truncate ">
                            {collection?.totalVolume ? (
                                <>
                                    {formatNumber(collection?.totalVolume, 2)}
                                    <span className="ml-2 ">{collection?.priceSymbol}</span>
                                </>
                            ) : (
                                '--'
                            )}
                        </span>{' '}
                    </h3>
                    <p className="mt-2 text-white sm:text-lg">Total Volume</p>
                </div>
                <div className="h-[6.813rem]  relative Atpricehoverholder   w-full  flex flex-col justify-center items-center border border-[#363648] bg-[#21212F] rounded-xl">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg    text-center  text-themecolor font-Proxima-SemiBold">
                        <span className="w-3/4 truncate">
                            {collection?.volume24h ? (
                                <>
                                    {formatNumber(collection?.volume24h || 0, 2)}
                                    <span className="ml-2 ">{collection?.priceSymbol}</span>
                                </>
                            ) : (
                                '--'
                            )}
                        </span>
                    </h3>
                    <p className="mt-2 text-white sm:text-lg">24H Volume</p>
                </div>
                <div className="h-[6.813rem]    w-full relative Atpricehoverholder  flex flex-col justify-center items-center border border-[#363648] bg-[#21212F] rounded-xl">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg truncate w-3/4  text-center text-themecolor font-Proxima-SemiBold">
                        {collection?.floorPrice ? (
                            <>
                                {formatNumber(collection?.floorPrice, 2)}
                                <span className="ml-2 ">{collection?.priceSymbol}</span>
                            </>
                        ) : (
                            '--'
                        )}
                    </h3>
                    <p className="mt-2 text-white sm:text-lg">Floor Price</p>
                </div>
                <div className="h-[6.813rem]  relative Atpricehoverholder   w-full  flex flex-col justify-center items-center border border-[#363648] bg-[#21212F] rounded-xl">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg  truncate w-3/4 text-center   text-themecolor font-Proxima-SemiBold">
                        {collection?.owners ? formatNumber(collection?.owners, 2) : '--'}
                    </h3>
                    <p className="mt-2 text-white sm:text-lg">Holders</p>
                </div>
            </div>
            {/* Stats Sections End*/}
        </>
    );
};

export default CollectionInfo;
