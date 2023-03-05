import React from 'react';
import { Trendingdata } from './DataTrending';
import Link from 'next/link';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';

const TrendingCard = () => {
    return (
        <>
            {Trendingdata.map((item) => (
                <>
                    <Link legacyBehavior href="/collection">
                        <a>
                            <div className="relative w-full">
                                <ImageComponent src={item.src1} height={490} width={490} quality={40} blurEffect alt="" className="rounded-xl " />
                                <div className="  absolute top-0 bg-[#00000066] leading-none px-8 pb-8 h-full w-full flex flex-col justify-end ">
                                    <div className=" flex items-center at-blur rounded-[2.5rem] h-[3.5rem] w-[12.875rem] pl-[7px] pr[14px] mb-5 relative ">
                                        <figure className="mr-[14px]">
                                            <ImageComponent
                                                className=" rounded-full"
                                                src={item.src2}
                                                width={36}
                                                height={36}
                                                alt=""
                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                            />
                                        </figure>
                                        <p className="text-base text-white">{item.owner}</p>
                                    </div>
                                    <h3 className="xl:text-40px text-white ">{item.name}</h3>
                                    <p className="text-[#E7E7E7] text-lg mt-3">{item.nft}</p>
                                </div>
                            </div>
                        </a>
                    </Link>
                </>
            ))}
        </>
    );
};

export default TrendingCard;
