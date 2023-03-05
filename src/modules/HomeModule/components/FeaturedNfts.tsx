import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import ImageComponent from '../../../components/Image/ImageComponent';
import Loader from '../../../components/loader/Loader';
import PriceComponent from '../../../components/maincard/components/PriceComponent';
// import FeedPrice from '../../../components/PriceFeedNft/feedprice';
import FeedPrice from '../../../components/PriceFeedNft/feedprice';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import { homeService } from '../../../services/home.service';

const FeaturedNfts = () => {
    const router = useRouter();
    const [featuredList, setfeaturedList] = useState<any>(null);
    const [loadingState, setLoadingState] = useState<boolean>(false);

    useEffect(() => {
        const fetchListing = async () => {
            setLoadingState(true);
            try {
                const params = {
                    pageSize: 5,
                    featured: true,
                    isActive: true
                };
                const res = await homeService.featureListing(params);
                setfeaturedList(res.data?.data?.listings);
            } catch (error) {
                // console.log('error', error);
            }
            setLoadingState(false);
        };
        fetchListing();
    }, []);

    const dimentions = [
        {
            width: 520,
            height: 360,
            className:
                'w-[100%] md:w-[25%] sm:w-[100%] h-96 sm:h-[560px] 2xl:h-[520px] xl:h-[420px] md:h-[250px] sm:mt-[0] rounded-xl overflow-hidden md:hover:scale-150 hover:z-10 ease-in-out duration-300'
        },
        {
            width: 600,
            height: 460,
            className:
                'w-[100%]  md:w-[30%] sm:w-[100%] mt-6 sm:mt-0 h-96 sm:h-[600px] 2xl:h-[600px] xl:h-[520px] lg:h-[400px] md:h-[320px] sm:mt-[15px] ml-[0] 2xl:ml-[-170px] xl:ml-[-170px] rounded-xl overflow-hidden z-[2] ease-in-out duration-300 md:hover:scale-125 hover:z-[11]'
        },
        {
            width: 680,
            height: 520,
            className:
                'w-[100%] lg:w-[34%] sm:w-[100%]  md:w-[33%] mt-6 sm:mt-0 h-96 sm:h-[600px] 2xl:h-[680px] xl:h-[580px] lg:h-[450px] md:h-[350px] ml-[0] sm:mt-[15px] 2xl:ml-[-90px] xl:ml-[-90px] relative z-10 rounded-xl overflow-hidden ease-in-out duration-300 md:hover:scale-110'
        },
        {
            width: 600,
            height: 460,
            className:
                'w-[100%] md:w-[30%] sm:w-[100%] mt-6 sm:mt-0 h-96 sm:h-[600px] 2xl:h-[600px] xl:h-[500px] md:h-[320px] ml-[0] 2xl:ml-[-100px] xl:ml-[-100px] rounded-xl overflow-hidden relative z-[5]  sm:mt-[15px] ease-in-out duration-300 md:hover:scale-125 hover:z-[11]'
        },
        {
            width: 520,
            height: 360,
            className:
                'w-[100%] md:w-[25%] sm:w-[100%] h-96 mt-6 sm:mt-0  sm:h-[560px] 2xl:h-[520px] xl:h-[420px] md:h-[250px] ml-[0] 2xl:ml-[-165px] xl:ml-[-165px] rounded-xl overflow-hidden m-[0] sm:mt-[15px] ease-in-out duration-300 md:hover:scale-150 hover:z-10'
        }
    ];

    return (
        <div className="overflow-hidden">
            {!isEmpty(featuredList) && (
                <div className="container relative bg-[#14141F] mb-[6rem]  ">
                    <h2 className="text-[#FFFFFF] text-5xl mb-12">Featured NFTs</h2>

                    {loadingState ? (
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                    ) : (
                        featuredList?.length > 0 && (
                            <div className="items-center featuredNfts 2xl:flex xl:flex lg:flex md:flex sm:block ">
                                {featuredList?.length > 0 &&
                                    featuredList?.map((item: any, index: number) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`${dimentions[index].className} cursor-pointer Atfeaturenfthover relative`}>
                                                <div
                                                    className="Atfeaturehover"
                                                    onClick={() => router.push(`/listings/${item?.listingId}`)}>
                                                    <Link legacyBehavior href="/feed">
                                                        <a className="flex items-center absolute top-[30px] left-[30px]">
                                                            <figure className="w-[48px] h-[48px] relative rounded-full overflow-hidden mr-3">
                                                                {item?.ownerDetails?.avatar ? (
                                                                    <ImageComponent
                                                                        className=" rounded-full "
                                                                        src={item?.ownerDetails?.avatar}
                                                                        alt=""
                                                                        objectFit={'cover'}
                                                                        layout={'fill'}
                                                                        // height={48}
                                                                        // width={48}
                                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        {
                                                                            <p className="w-full h-full    bg-themecolor flex items-center justify-center rounded-full text-black1 text-xl">
                                                                                {item?.ownerDetails?.firstName
                                                                                    .charAt(0)
                                                                                    .toUpperCase()}
                                                                            </p>
                                                                        }
                                                                    </>
                                                                )}
                                                            </figure>
                                                            <h4 className="text-white text-2xl ">
                                                                @{item?.ownerDetails?.userName}
                                                            </h4>
                                                        </a>
                                                    </Link>
                                                    <div className="w-full absolute bottom-[25px] left-0 px-[30px]">
                                                        <h3 className="w-full truncate text-white text-[2rem] font-Proxima-Bold mb-3">
                                                            {item.nft?.name}
                                                        </h3>
                                                        <div className="flex text-left Atprice">
                                                            <FeedPrice listing={item} />
                                                            {/* <PriceComponent amount={item?.price} price={item?.price} /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <ImageComponent
                                                    src={item?.nft?.image}
                                                    // height={dimentions[index].height}
                                                    // width={dimentions[index].width}
                                                    objectFit="cover"
                                                    layout={'fill'}
                                                    alt=""
                                                    blurEffect
                                                    quality={20}
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default FeaturedNfts;
