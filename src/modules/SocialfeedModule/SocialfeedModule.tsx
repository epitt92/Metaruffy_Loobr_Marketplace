import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Button from '../../components/Button/Button';
// import SocialfeedOnlyModule from "../SocialfeedOnlyModule.tsx/SocialfeedOnlyModule";
import Link from 'next/link';
import TopUsersCard from '../../components/popup/TopUserscard';
import MainCard from '../../components/maincard/MainCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper';
import SocialfeedOnlyModule from '../SocialFeedsOnlyModule/SocialfeedOnlyModule';
import Popups from '../../components/popup/poups';
import { getAllUsers, getRecentlyRegistered, getTopUsers } from '../../redux/user/actions';
import { getTopNft, getAuctionNft } from '../../redux/nft/actions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/loader/Loader';
import Notfound from '../../components/notfound/notfound';
import useMetaMask from '../../hooks/useMetaMask';
import { userService } from '../../services/user.service';
import Input from '../../components/input/Input';
import Image from 'next/image';
import { _io } from '../../services/socket.service';
import { FEED_COMMENT_LIKE_CREATED } from '../../constants/socketEvents';
import { isEmpty } from 'validate.js';
import Verified from '../../components/verified';
interface Iprops {
    tag: any;
    allowPost: boolean;
}
const SocialfeedModule = ({ tag, allowPost }: Iprops) => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [tags, setTags] = useState<Array<string>>([]);
    const [tagLoading, setTagLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    // const users = useSelector((state: any) => state.user.topUsers);
    // const loading = useSelector((state: any) => state.user.topUsersLoading);
    const users = useSelector((state: any) => state.user.recentUsers);
    const loading = useSelector((state: any) => state.user.recentUsersLoading);
    const toploading = useSelector((state: any) => state.nft.topNftLoading);
    const auctionedloading = useSelector((state: any) => state.nft.auctionedNftLoading);
    const allUsers = useSelector((state: any) => state.user.allUsers);
    const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
    const [searchedusers, setUsers] = useState<Array<any>>([]);
    const { account }: any = useMetaMask();
    const topNft = useSelector((state: any) => state.nft.topNft);
    const auctionedNft = useSelector((state: any) => state.nft.auctionedNft);
    const authUser = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        // const filters = {
        //   pageSize: 15,
        // };
        // dispatch(getTopUsers(filters));
        dispatch(getRecentlyRegistered());
    }, []);
    const movetoTop = () => {
        window.scrollTo(0, 0);
    };
    useEffect(() => {
        dispatch(getTopNft({ pageSize: 5, type: ['0'], isActive: true }));
        dispatch(getAuctionNft({ pageSize: 5, type: ['1'], isActive: true, expired: true }));
        const fileters = {
            pageSize: 5
        };
        // dispatch(getTopUsers(fileters));
        getTags();
    }, []);
    const getTags = async () => {
        setTagLoading(true);
        const res = await userService.getTophashTags();
        setTags(res.data.data);
        setTagLoading(false);
    };
    useEffect(() => {
        listenSocket();
    }, []);
    useEffect(() => {
        if (confirmed) {
            liveTags();
            setConfirmed(false);
        }
    }, [confirmed]);

    const listenSocket = async () => {
        _io.on(`${FEED_COMMENT_LIKE_CREATED}`, (newdata: any) => {
            if (newdata.user) {
                setConfirmed(true);
            }
        });
    };
    const liveTags = async () => {
        const res = await userService.getTophashTags();
        setTags(res.data.data);
    };
    useEffect(() => {
        const fileters = {
            search,
            pageSize: 10,
            page: page
        };
        dispatch(getAllUsers(fileters));
    }, [page, search]);
    useEffect(() => {
        if (isLoadMoreClicked) {
            allUsers?.users && setUsers([...users, ...allUsers?.users]);
        } else {
            allUsers?.users && setUsers(allUsers?.users);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allUsers]);
    return (
        <div className="container xl:pt-16 pt-[3rem] pb-28 ">
            <Head>
                <title>LooBr | Social Feeds</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
            social features and release your limitless imagination.
             Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <div className="flex items-start justify-between  gap-x-10 w-full   flex-col xl:flex-row">
                    {/* <div className="w-full xl:w-[25%] static xl:sticky overflow-auto at-sidebarwrapper scrolHide  top-48 xl:block hidden xl:h-[120vh]"> */}
                    <div className="w-full xl:w-[25%]  xl:sticky  top-40    xl:block hidden">
                        <div className="overflow-auto scrolHide  max-h-screen at-sidebarwrapper">
                            <div className="hidden lg:block">
                                <div className="mb-7">
                                    <div className="flex items-center  justify-between   w-full pb-4">
                                        <h3 className="text-2xl !text-white">Top Users</h3>
                                        {/* <Link legacyBehavior href="/alluserspage">
                                            <a>
                                            <Button className="  xs:mt-4 border px-8 !text-white border-[#5A5A62] bg-transparent rounded-full">
                                                View All
                                                </Button>
                                            </a>
                                        </Link> */}
                                    </div>
                                    <div className="lg:flex flex-col gap-y-2.5 min-h-[440px]     max-h-[440px] scrolHide  relative">
                                        {loading ? (
                                            <div className=" absolute top-0 w-full h-full">
                                                <Loader />
                                            </div>
                                        ) : (
                                            users?.map((item: any, i: number) => (
                                                <TopUsersCard {...item} key={i} item={item} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!isEmpty(auctionedNft) && (
                                <div className=" hidden xl:block ">
                                    <div className="  w-full">
                                        <h3 className="text-2xl   text-white">Top Live Auction</h3>
                                    </div>
                                    <div className="mySwiper -mt-12 lg:mb-0 mb-4 ">
                                        <Swiper
                                            navigation={true}
                                            modules={[Pagination, Navigation]}
                                            className="testimonialslider pb-5"
                                            // onSwiper={(swiper) => console.log(swiper)}
                                            // onSlideChange={() => console.log('slide change')}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            loop={true}
                                            breakpoints={{
                                                320: {
                                                    slidesPerView: 1
                                                },
                                                640: {
                                                    slidesPerView: 1
                                                },
                                                768: {
                                                    slidesPerView: 1
                                                },
                                                1280: {
                                                    slidesPerView: 1
                                                },

                                                1536: {
                                                    slidesPerView: 1
                                                }
                                            }}>
                                            {auctionedNft?.length > 0 &&
                                                auctionedNft?.map((item: any, i: number) => (
                                                    <SwiperSlide className="AtShadownone" key={i}>
                                                        <div className="Atsocialcard -mt-4" key={i}>
                                                            <MainCard
                                                                key={i}
                                                                where="listing"
                                                                listing={item}
                                                                nft={item?.nft}
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                        </Swiper>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full xl:w-[50%] xl:mb-0 mb-10 xl:order-1 order-2 ">
                        <SocialfeedOnlyModule tag={tag} allowPost={allowPost} id="" />
                    </div>
                    <div className="w-full xl:w-[25%] top-40 xl:sticky  xl:order-2 order-1">
                        <div className="max-h-screen overflow-y-auto scrolHide at-sidebarwrapper">
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-2xl text-white">Top Hashtags</h3>
                            </div>
                            <div className=" ">
                                {tagLoading && (
                                    <div className="  mt-2 mb-2  ">
                                        <Loader />
                                    </div>
                                )}
                                {!tagLoading && tags?.length < 1 && <Notfound />}

                                {!tagLoading && tags?.length > 0 && (
                                    <div className="bg-[#2b2b35]   p-4 mb-10 rounded-lg ">
                                        {tags?.map((item: any, i: number) => {
                                            return (
                                                <div key={i}>
                                                    <a
                                                        className=" border-b-2   border-transparent hover:border-[#F1C94A]"
                                                        href={`/search?id=${item}`}>
                                                        #{item}
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {!isEmpty(topNft) && (
                                <div className="   ">
                                    <div className="xl:flex items-center justify-between mt-4 hidden">
                                        <h3 className="text-2xl text-white">Top NFTs</h3>
                                    </div>
                                    <div className="mySwiper -mt-12 hidden xl:block border border-transparent">
                                        <Swiper
                                            navigation={true}
                                            modules={[Pagination, Navigation]}
                                            className="testimonialslider  AtShadownone "
                                            // onSwiper={(swiper) => console.log(swiper)}
                                            // onSlideChange={() => console.log('slide change')}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            loop={true}
                                            breakpoints={{
                                                320: {
                                                    slidesPerView: 1
                                                },
                                                640: {
                                                    slidesPerView: 1
                                                },
                                                768: {
                                                    slidesPerView: 1
                                                },
                                                1280: {
                                                    slidesPerView: 1
                                                },

                                                1536: {
                                                    slidesPerView: 1
                                                }
                                            }}>
                                            {topNft?.length > 0 &&
                                                topNft?.map((item: any, i: number) => (
                                                    <SwiperSlide className="" key={i}>
                                                        <div className="Atsocialcard -mt-4" key={i}>
                                                            <MainCard
                                                                key={i}
                                                                where="listing"
                                                                listing={item}
                                                                nft={item?.nft}
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                        </Swiper>
                                    </div>{' '}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {state && (
                    <Popups
                        show={popup}
                        hide={setPopup}
                        state={state}
                        setstate={setState}
                        data=""
                        setPopup={undefined}
                    />
                )}
            </div>
            <button
                className="fixed bottom-[110px] sm:hidden right-10 z-[999] Atscrolltotop w-[60px] h-[60px] flex items-center justify-center rounded-full bg-themecolor"
                type="button"
                onClick={() => {
                    movetoTop();
                }}>
                <img className="w-[20px]" src="/assets/images/icons/scroll-top.png" alt="" />
            </button>
        </div>
    );
};

export default SocialfeedModule;
