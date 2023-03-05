import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useEffect, useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import MainCard from '../../../components/maincard/MainCard';
import Notfound from '../../../components/notfound/notfound';
import { homeService } from '../../../services/home.service';
import useMetaMask from '../../../hooks/useMetaMask';
import { isEmpty } from 'validate.js';

const LiveAuctions = () => {
    const { account }: any = useMetaMask();

    const [featuredList, setfeaturedList] = useState<any>(null);
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const dispatch = useDispatch();

    const fetchListing = async () => {
        setLoadingState(true);
        try {
            const params = {
                pageSize: 10,
                type: ['1'],
                expired: true,
                isActive: true
            };
            const res = await homeService.liveAuctions(params);
            setfeaturedList(res.data?.data?.listings);
        } catch (error) {
            // console.log('error', error);
        }
        setLoadingState(false);
    };

    useEffect(() => {
        fetchListing();
    }, []);

    return (
        <div className="container py-16 relative  ">
            {/* {!isEmpty(featuredList) && !(featuredList?.length < 4) && (
                <div>
                    <h2 className="xl:text-[48px] text-white absolute  at-headingliveauction">
                        Live Auctions <i className="icon-arrow-left"></i>
                    </h2>
                    <div className="Atliveauctionslider    ">
                        <div className="mySwiper ">
                            <Swiper
                                navigation={true}
                                modules={[Pagination, Navigation]}
                                className="testimonialslider "
                                // onSwiper={(swiper) => console.log(swiper)}
                                // onSlideChange={() => console.log("slide change")}
                                spaceBetween={10}
                                slidesPerView={4}
                                // loop={true}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                        spaceBetween: 40
                                    },
                                    640: {
                                        slidesPerView: 1,
                                        spaceBetween: 30
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 30
                                    },
                                    1280: {
                                        slidesPerView: 3,
                                        spaceBetween: 20
                                    },

                                    1536: {
                                        slidesPerView: 4,
                                        spaceBetween: 30
                                    }
                                }}>
                                {loadingState && <Loader />}
                                {!loadingState && featuredList?.length < 1 && <Notfound />}
                                {!loadingState &&
                                    featuredList?.length > 0 &&
                                    featuredList?.map((item: any, i: number) => (
                                        <SwiperSlide className=" " key={i}>
                                            <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default LiveAuctions;
