import React, { useEffect, useState } from 'react';
// import { CollectionData } from "./CollectionData";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper';
import Label from '../../components/label/Label';
import Popups from '../../components/popup/poups';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCollections } from '../../redux/collections/actions';
import Image from 'next/image';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';

type Props = {
    onSelect: Function;
    activeIndex: Number;
};

const Collections = ({ onSelect, activeIndex }: Props) => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.auth.user);
    const collections = useSelector((state: any) => state.collections.collections);

    const loading = useSelector((state: any) => state.collections.collectionsLoading);
    const deleteLoading = useSelector((state: any) => state.collections.deleteLoading);

    useEffect(() => {
        const filters = {
            userId: user?.userId,
            page: page,
            pageSize: 20
        };
        user && dispatch(getAllCollections(filters));
    }, [user?.userId]);

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    return (
        <div>
            <Label htmlFor="id_title" className="mt-8 mb-6">
                Choose Collection
            </Label>
            <div className="grid grid-cols-6 gap-5  xs:grid-cols-1">
                <button
                    className="bg-[#2B2B35]  h-[120px] flex items-center justify-center p-2 flex-col rounded-[12px]"
                    type="button"
                    onClick={() => {
                        setPopup(true);
                        setState(21);
                    }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20 0C16.0444 0 12.1776 1.17298 8.8886 3.37061C5.59962 5.56823 3.03617 8.69181 1.52242 12.3463C0.00866568 16.0009 -0.387401 20.0222 0.384303 23.9018C1.15601 27.7814 3.06082 31.3451 5.85787 34.1421C8.65492 36.9392 12.2186 38.844 16.0982 39.6157C19.9778 40.3874 23.9992 39.9913 27.6537 38.4776C31.3082 36.9638 34.4318 34.4004 36.6294 31.1114C38.827 27.8224 40 23.9556 40 20C40 17.3736 39.4827 14.7728 38.4776 12.3463C37.4725 9.91982 35.9993 7.71503 34.1421 5.85786C32.285 4.00069 30.0802 2.5275 27.6537 1.52241C25.2272 0.517315 22.6264 0 20 0ZM20 36C16.8355 36 13.7421 35.0616 11.1109 33.3035C8.4797 31.5454 6.42894 29.0465 5.21794 26.1229C4.00693 23.1993 3.69008 19.9822 4.30744 16.8786C4.92481 13.7749 6.44866 10.9239 8.6863 8.68629C10.9239 6.44865 13.7749 4.9248 16.8786 4.30744C19.9823 3.69007 23.1993 4.00693 26.1229 5.21793C29.0466 6.42893 31.5454 8.47969 33.3035 11.1109C35.0616 13.7421 36 16.8355 36 20C36 24.2435 34.3143 28.3131 31.3137 31.3137C28.3131 34.3143 24.2435 36 20 36ZM28 18H22V12C22 11.4696 21.7893 10.9609 21.4142 10.5858C21.0391 10.2107 20.5304 10 20 10C19.4696 10 18.9609 10.2107 18.5858 10.5858C18.2107 10.9609 18 11.4696 18 12V18H12C11.4696 18 10.9609 18.2107 10.5858 18.5858C10.2107 18.9609 10 19.4696 10 20C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22H18V28C18 28.5304 18.2107 29.0391 18.5858 29.4142C18.9609 29.7893 19.4696 30 20 30C20.5304 30 21.0391 29.7893 21.4142 29.4142C21.7893 29.0391 22 28.5304 22 28V22H28C28.5304 22 29.0391 21.7893 29.4142 21.4142C29.7893 21.0391 30 20.5304 30 20C30 19.4696 29.7893 18.9609 29.4142 18.5858C29.0391 18.2107 28.5304 18 28 18Z"
                            fill="#F1C94A"
                        />
                    </svg>
                    <span className="block mt-[12px] text-white font-Proxima-SemiBold text-base">Create</span>
                </button>
                <div className="col-span-5 xs:mt-12">
                    <div className="mySwiper Atcollectionslider">
                        <Swiper
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            // onSwiper={(swiper) => console.log(swiper)}
                            // onSlideChange={() => console.log("slide change")}
                            spaceBetween={10}
                            slidesPerView={4}
                            style={{ position: 'unset' }}
                            // loop={true}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 20
                                },
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 20
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20
                                },
                                1280: {
                                    slidesPerView: 3,
                                    spaceBetween: 20
                                },

                                1536: {
                                    slidesPerView: 5,
                                    spaceBetween: 20
                                }
                            }}>
                            {collections &&
                                collections?.collections?.map((item: any, index: number) => (
                                    <SwiperSlide className="" key={index}>
                                        <div
                                            className="Atroyaitybox-choose-collection   "
                                            onClick={() => onSelect(index)}>
                                            <input type="radio" name="select-royality" id={`Atroyality${index}`} />
                                            <label
                                                htmlFor={`Atroyality${index}`}
                                                className={`border-2 border-gray4  h-[120px] p-2      rounded-[12px] text-center ${
                                                    activeIndex == index ? 'border-yellow-500' : null
                                                }`}>
                                                <figure
                                                    className={`leading-none rounded-full collection-picture overflow-hidden grayscale-[30%] ${
                                                        activeIndex == index ? 'grayscale-0' : 'grayscale-[30%]'
                                                    } `}>
                                                    <ImageComponent
                                                        className="rounded-full"
                                                        src={item.logoPicture}
                                                        alt=""
                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                        height={40}
                                                        width={40}
                                                    />
                                                </figure>
                                                <span
                                                    className={`w-[100px] truncate capitalize block mt-[12px] collection-name   font-Proxima-SemiBold text-base ${
                                                        activeIndex == index ? 'text-white' : 'text-[#595961]'
                                                    }`}>
                                                    {item.name}
                                                </span>
                                            </label>
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                </div>
            </div>
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};

export default Collections;
