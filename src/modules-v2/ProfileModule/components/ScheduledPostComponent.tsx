import React, { useEffect, useState } from 'react';
import Drodpdown from '../../../components/Dropdown/Dropdown';
import ImageComponent from '../../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import { feedService } from '../../../services/feed.service';
import ScheduleDrodpdown from './SchedulePostDropdown';
import { isEmpty } from 'validate.js';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import Loader from '../../../components/loader/Loader';
import VideoComponent from '../../../components/video/videoComponent';
import detailContentView from '../../NftDetailModule/detailContentView';
import moment from 'moment';
import FeedTextLength from '../../../components/TextLength/FeedTextLength';
const ScheduledPostComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [schdulePost, setSchdulePost] = useState<any>();
    const [confirm, setConfirm] = useState<boolean>(false);
    const [id, setId] = useState<any>(null);
    useEffect(() => {
        getSchduleFeeds();
    }, []);
    const getSchduleFeeds = async () => {
        try {
            let result = await feedService.getAllschduleFeed();
            setSchdulePost(result?.data?.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (confirm) {
            let data = schdulePost.filter((feed: any) => feed?._id != id);
            setSchdulePost(data);
            setId(null);
            setConfirm(false);
        }
    }, [confirm]);

    return (
        <>
            {!isEmpty(schdulePost) ? (
                <div className="">
                    {schdulePost?.map((item: any, i: number) => (
                        <div
                            className="w-full   border-[#2B2B35] rounded-3xl border-2 mb-4 hover:bg-[#1c1c27]  cursor-pointer"
                            key={item?._id}>
                            <div className="p-5">
                                <div className="flex  items-center gap-2 ">
                                    <img className="flex-shrink-0" src="/assets/images/calendar2.png" />
                                    <h5 className="text-white  font-Proxima-SemiBold">Schedule post</h5>
                                </div>
                                <p className="text-white mt-3 ml-1">
                                    {new Date(item?.schduleTime)?.toString()}
                                    {/* {moment(item?.schduleTime).format('YYYY-MM-DDTHH:mm:ss')}{' '} */}
                                </p>
                            </div>
                            <div className="w-full text-white p-5 pb-0 border-2 border-x-0 border-b-0 border-[#2B2B35]"></div>

                            <div className="w-full  flex flex-row justify-between  items-center p-5">
                                <div className="flex items-center gap-2">
                                    <figure className="w-14 h-14 rounded-full UerProfileImage flex-shrink-0  flex items-center justify-center ">
                                        {item?.user?.avatar ? (
                                            <ImageComponent
                                                className="rounded-full "
                                                src={item?.user?.avatar}
                                                alt=""
                                                height={56}
                                                width={56}
                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                            />
                                        ) : (
                                            <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                {item?.user?.firstName?.charAt(0).toUpperCase()}
                                            </p>
                                        )}
                                    </figure>
                                    <p className="text-white">
                                        {item?.user?.firstName} {item?.user?.lastName}
                                    </p>
                                </div>

                                <div className="flex justify-end     sm:mt-0  mt-12 xs:mt-0 sm:ml-0 -ml-6 xs:ml-0 xs4:-ml-2  xs4:justify-center items-center ">
                                    <ScheduleDrodpdown id={item?._id} setConfirmed={setConfirm} setId={setId} />
                                </div>
                            </div>
                            <p className="pl-4 pb-4">
                                <FeedTextLength item={item} />
                            </p>
                            {item?.type == 'video' && (
                                // <figure className="h-[470px]   w-full relative">
                                <VideoComponent
                                    src={item?.video}
                                    ChildClass={'h-[470px]'}
                                    ParentClass={'h-[470px] rounded-b-[24px]'}
                                />
                                // </figure>
                            )}
                            {item?.type == 'image' && (
                                <figure className="h-[470px]   w-full relative">
                                    <ImageComponent
                                        figClassName=" !rounded-b-[24px] "
                                        className="!rounded-b-[24px] "
                                        src={item?.image}
                                        objectFit="contain"
                                        layout="fill"
                                        alt=""
                                        quality={50}
                                    />
                                </figure>
                            )}
                            {item?.type == 'nft' && (
                                <figure>
                                    {detailContentView(item?.nft?.nft, {
                                        height: 375,
                                        width: 375,
                                        objectFit: 'cover',
                                        feed: true
                                    })}
                                </figure>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                !loading && (
                    <div>
                        <Notfounditem desc="" buttonText={'Go to Social feed'} buttonLink="/feeds" />
                    </div>
                )
            )}
            {loading && (
                <div className="flex justify-center mt-12">
                    <Loader />
                </div>
            )}

            {/*        
        <div className="w-full   border-[#2B2B35] rounded-3xl border-2 mb-4 hover:bg-[#1c1c27]  cursor-pointer">
            <div className="p-5">
                <div className="flex  items-center gap-2 ">
                    <img className="flex-shrink-0" src="/assets/images/calendar2.png" />
                    <h5 className="text-white  font-Proxima-SemiBold">Schedule post</h5>
                </div>
                <p className="text-white mt-3 ml-1">25- Nov - 2022 - 2:00 PM </p>
            </div>
            <div className="w-full text-white p-5 pb-0 border-2 border-x-0 border-b-0 border-[#2B2B35]"></div>

            <div className="w-full  flex flex-row justify-between  items-center p-5">
                <div className="flex items-center gap-2">
                    <figure className="w-14 h-14 rounded-full UerProfileImage flex-shrink-0  flex items-center justify-center ">
                        <ImageComponent
                            className="rounded-full flex-shrink-0 "
                            src="/assets/images/avr1.png"
                            alt=""
                            height={56}
                            width={56}
                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                        />
                    </figure>
                    <p className="text-white">Adeleke Peter</p>
                </div>

                <div className="flex justify-end     sm:mt-0  mt-12 xs:mt-0 sm:ml-0 -ml-6 xs:ml-0 xs4:-ml-2  xs4:justify-center items-center ">
                    <ScheduleDrodpdown />
                </div>

               
            </div>
            <figure className="h-[470px]   w-full relative">
                <ImageComponent
                    figClassName=" !rounded-b-[24px] "
                    className="!rounded-b-[24px] "
                    src="/assets/images/3.png"
                    objectFit="cover"
                    layout="fill"
                    alt=""
                    quality={50}
                />
            </figure>
        </div> */}
        </>
    );
};

export default ScheduledPostComponent;
