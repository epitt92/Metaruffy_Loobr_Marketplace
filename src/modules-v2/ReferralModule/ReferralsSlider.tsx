import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useEffect, useState } from 'react';
import MainCard from '../../components/maincard/MainCard';
import VideoComponent from '../../components/video/videoComponent';
import Button from '../../components/Button/Button';
import Popups from '../../components/popup/poups';
import { referralService } from '../../services/referral.serveice';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ReferralsSlider = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [data, setData] = useState<any>(null);
    const [videoData, setVideoData] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [confirm, setConfirmed] = useState<boolean>(false);
    useEffect(() => {
        getReferralVideos();
    }, []);
    useEffect(() => {
        if (confirm) {
            getReferralVideos();
        }
    }, [confirm]);
    const getReferralVideos = async () => {
        try {
            !confirm && setLoading(true);
            const result = await referralService.getRefferalVideo();
            setVideoData(result?.data?.data);
            setConfirmed(false);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };
    const downlodVideo = (src: any) => {
        fetch(src).then((response: any) => {
            response.blob().then((blob: any) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                let b = src.split('/');
                let name = b[b.length - 1];
                a.download = name;
                a.click();
            });
        });
    };
    return (
        <div>
            <div>
                {loading ? (
                    <Loader />
                ) : (
                    <div className="     ">
                        <div className=" mySwiper xl:px-0 px-16  relative">
                            <Swiper
                                style={{ position: 'unset' }}
                                navigation={true}
                                modules={[Pagination, Navigation]}
                                className=" testimonialslider2 AtShadownone  "
                                spaceBetween={10}
                                slidesPerView={5}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                        spaceBetween: 40
                                    },
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 30
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 20
                                    },
                                    1025: {
                                        slidesPerView: 3,
                                        spaceBetween: 40
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                        spaceBetween: 20
                                    },

                                    1536: {
                                        slidesPerView: 5,
                                        spaceBetween: 30
                                    }
                                }}>
                                {videoData?.map((item: any, index: number) => (
                                    <SwiperSlide>
                                        <div className="relative">
                                            <div className="flex gap-1.5 items-center">
                                                <i
                                                    className={`icon-start text-themecolor text-3xl ${
                                                        item?.fb?.includes(user?.userId) ? '' : 'opacity-[0.2]'
                                                    }`}></i>
                                                <i
                                                    className={`icon-start text-themecolor text-3xl ${
                                                        item?.twitter?.includes(user?.userId) ? '' : 'opacity-[0.2]'
                                                    }`}></i>
                                                <i
                                                    className={`icon-start text-themecolor text-3xl ${
                                                        item?.whatsapp?.includes(user?.userId) ? '' : 'opacity-[0.2]'
                                                    }`}></i>
                                                <i
                                                    className={`icon-start text-themecolor text-3xl ${
                                                        item?.reddit?.includes(user?.userId) ? '' : 'opacity-[0.2]'
                                                    }`}></i>
                                                <i
                                                    className={`icon-start text-themecolor text-3xl ${
                                                        item?.telegram?.includes(user?.userId) ? '' : 'opacity-[0.2]'
                                                    }`}></i>
                                                {/* <i className="icon-start text-themecolor text-3xl opacity-[0.2]"></i>
                                                <i className="icon-start text-themecolor text-3xl"></i>
                                                <i className="icon-start text-themecolor text-3xl"></i> */}
                                            </div>
                                            <VideoComponent
                                                src={item?.src}
                                                bgremove={true}
                                                className="object-cover"
                                                figClassName="!h-[25.313rem]   mt-6"
                                            />
                                            {index == 0 && (
                                                <p className="text-black bg-themecolor px-2 py-1 rounded-[4px] absolute top-16 right-4 text-sm font-semibold">
                                                    New
                                                </p>
                                            )}
                                            <div
                                                className="bg-[#2B2B35] rounded-md h-[1.875rem] w-[1.875rem] flex justify-center items-center absolute bottom-24 cursor-pointer right-4 "
                                                onClick={() => {
                                                    downlodVideo(item?.src);
                                                }}>
                                                <svg
                                                    width="16"
                                                    height="13"
                                                    viewBox="0 0 16 13"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M13.0468 4.912C12.842 2.30706 10.6567 0.25 8 0.25C5.7275 0.25 3.77675 1.726 3.14731 3.87869C1.35181 4.50194 0.125 6.20294 0.125 8.125C0.125 10.6062 2.14381 12.625 4.625 12.625H11.9375C14.1088 12.625 15.875 10.8588 15.875 8.6875C15.875 6.91619 14.7106 5.39575 13.0468 4.912ZM10.6477 7.96019L8.39769 10.2102C8.288 10.3199 8.144 10.375 8 10.375C7.856 10.375 7.712 10.3199 7.60231 10.2102L5.35231 7.96019C5.19144 7.79931 5.14306 7.55744 5.23025 7.34706C5.31744 7.13725 5.52275 7 5.75 7H6.875V4.75C6.875 4.129 7.379 3.625 8 3.625C8.621 3.625 9.125 4.129 9.125 4.75V7H10.25C10.4773 7 10.6826 7.13725 10.7697 7.34706C10.8569 7.55744 10.8086 7.79931 10.6477 7.96019Z"
                                                        fill="#EFC74D"
                                                    />
                                                </svg>
                                            </div>
                                            <Button
                                                className="text-sm font-Proxima-Bold cursor-pointer !py-3 w-full rounded-[6.25rem] mt-7 flex gap-2 items-center"
                                                onClick={() => {
                                                    setData(item);
                                                    setPopup(true);
                                                    setState(93);
                                                }}>
                                                Share{' '}
                                                <svg
                                                    width="13"
                                                    height="15"
                                                    viewBox="0 0 13 15"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.4961 12.4999C12.4961 13.163 12.2328 13.7989 11.7639 14.2677C11.2951 14.7365 10.6592 14.9999 9.99615 14.9999C9.33311 14.9999 8.69722 14.7365 8.22838 14.2677C7.75954 13.7989 7.49615 13.163 7.49615 12.4999C7.49716 12.1901 7.55433 11.8831 7.6649 11.5937L4.78365 9.74368C4.43676 10.1001 3.99147 10.3449 3.50471 10.4468C3.01794 10.5488 2.51183 10.5032 2.05109 10.316C1.59034 10.1288 1.1959 9.80844 0.918211 9.39586C0.640518 8.98328 0.492188 8.49726 0.492188 7.99993C0.492188 7.5026 0.640518 7.01658 0.918211 6.604C1.1959 6.19142 1.59034 5.87104 2.05109 5.68383C2.51183 5.49661 3.01794 5.45107 3.50471 5.55303C3.99147 5.65498 4.43676 5.8998 4.78365 6.25618L7.6649 4.40618C7.55433 4.11678 7.49716 3.80973 7.49615 3.49993C7.49461 2.9185 7.69529 2.35462 8.06379 1.90488C8.4323 1.45514 8.94571 1.14751 9.5161 1.0347C10.0865 0.921879 10.6783 1.01089 11.1903 1.28648C11.7023 1.56207 12.1025 2.0071 12.3224 2.54534C12.5424 3.08357 12.5683 3.68153 12.3958 4.23679C12.2233 4.79206 11.8632 5.27007 11.377 5.58897C10.8908 5.90787 10.3089 6.04781 9.73086 5.98481C9.15285 5.92182 8.61472 5.65982 8.20865 5.24368L5.3274 7.09368C5.55231 7.67692 5.55231 8.32295 5.3274 8.90618L8.20865 10.7562C8.55576 10.4012 9.00072 10.1576 9.4868 10.0564C9.97289 9.95527 10.4781 10.0011 10.938 10.1882C11.3979 10.3752 11.7917 10.695 12.0692 11.1067C12.3467 11.5184 12.4953 12.0034 12.4961 12.4999Z"
                                                        fill="black"
                                                    />
                                                </svg>
                                            </Button>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                )}
            </div>
            <Popups
                show={popup}
                hide={setPopup}
                state={state}
                setstate={setState}
                setPopup={false}
                data={data}
                setConfirmed={setConfirmed}
            />
        </div>
    );
};

export default ReferralsSlider;
