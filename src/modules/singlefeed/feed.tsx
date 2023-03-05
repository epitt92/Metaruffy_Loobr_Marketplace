import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '../../components/Button/Button';
import Popups from '../../components/popup/poups';
import Head from 'next/head';
import axios from 'axios';
import router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getFeeds, postComment, postLike, postReply } from '../../redux/user/actions';
import { connectRoom } from '../../redux/messages/actions';
import { toast } from 'react-toastify';
import moment from 'moment';
import DirectChat from '../../components/Chat/DirectChat';
import { LikeComponent } from '../../components/Like/LikeComponent';
import Drodpdown from '../../components/Dropdown/Dropdown';
import Input from '../../components/input/Input';
import useAudio from '../../hooks/useAudio';
import { FEED_COMMENT_LIKE_CREATED } from '../../constants/socketEvents';
import { _io } from '../../services/socket.service';
import TextLength from '../../components/TextLength/textLength';
import MentionedInput from '../../components/mentionedInput/mentionedInput';
import { LikeComment } from '../../components/Like/LikeComment';
import { EmojiPicker } from '../../components/EmojiPicker/EmojiPicker';
import Comments from '../../components/CommentsWithReply/comments';
import Link from 'next/link';
import { Follow } from '../../components/Follow/follow';
import Router from 'next/router';
import FeedPrice from '../../components/PriceFeedNft/feedprice';
import FeedTextLength from '../../components/TextLength/FeedTextLength';
import { fetchImage } from '../../utils/functions';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import Loader from '../../components/loader/Loader';
import TopUsersCard from '../../components/popup/TopUserscard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper';
import MainCard from '../../components/maincard/MainCard';
import { getAllUsers, getRecentlyRegistered, getTopUsers } from '../../redux/user/actions';
import { isEmpty } from 'validate.js';
import Notfound from '../../components/notfound/notfound';
import { getTopNft, getAuctionNft } from '../../redux/nft/actions';
import { userService } from '../../services/user.service';
import Verified from '../../components/verified';
import { feedService } from '../../services/feed.service';
import Video from '../SocialFeedsOnlyModule/video';

const SingleFeed = ({ feedpost }: any) => {
    const router = useRouter();
    const [mentionedUsers, setMentionedUsers] = useState<any>([]);
    const commentRef = useRef<any>(null);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [feed, setFeed] = useState<any>(feedpost);
    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<Array<object>>([]);
    const [likes, setLikes] = useState<Array<string>>([]);
    const [repost, setRepost] = useState<Boolean>(false);
    const [loading, setLoading] = useState<Boolean>();
    const [data, setData] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [followers, setFollowers] = useState<any>();
    const [tags, setTags] = useState<Array<string>>([]);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const [type, setType] = useState<string>('');
    const [playing, toggle] = useAudio('/LOOBR_POST_COMMENT_OR_REPLY.mp3');
    // const users = useSelector((state: any) => state.user.topUsers);
    const users = useSelector((state: any) => state.user.recentUsers);
    const loadingRecentUser = useSelector((state: any) => state.user.recentUsersLoading);
    const [tagLoading, setTagLoading] = useState<boolean>(false);
    const [emoji, setEmoji] = useState<any>(null);
    const auctionedNft = useSelector((state: any) => state.nft.auctionedNft);
    const topNft = useSelector((state: any) => state.nft.topNft);
    const [selectpollloading, setSelectpollloading] = useState<boolean>(false);
    const [toatalVotes, setTotalvotes] = useState<Number>(0);

    useEffect(() => {
        setLoading(true);
        if (feedpost) {
            // axios
            //     .get(`${process.env.NEXT_PUBLIC_API_URL}/feed/getfeed?id=${router.query.id}`, {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     })
            //     .then((res) => {
            // setFeed(feedpost);
            setComments(feedpost.comments);
            setLikes(feedpost.likes);
            // console.log(res.data)
            setLoading(false);
        }
        //         })
        //         .catch((err) => {
        //             // console.log(err);

        //             setLoading(false);
        //             toast.error(err?.response?.data?.message);
        //         });
        // }
    }, [feedpost]);
    useEffect(() => {
        if (confirmed) {
            if (repost) {
                Router.push('/feeds');
                setRepost(false);
                setConfirmed(false);
            } else {
                // console.log('check 2.0');
                // Setreplyshow(false);
                setComment('');
                // setReply("");
                setConfirmed(false);
                axios
                    .get(`${process.env.NEXT_PUBLIC_API_URL}/feed/getfeed?id=${router.query.id}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then((res) => {
                        setFeed(res.data.data);
                        setComments(res.data.data.comments);
                        setLikes(res.data.data.likes);
                        setConfirmed(false);
                    })
                    .catch((err) => {
                        setConfirmed(false);
                        toast.error(err.response.data.message);
                    });
            }
        }
    }, [confirmed]);
    useEffect(() => {
        listenSocket();
    }, []);
    const listenSocket = () => {
        // console.log("message socket called");

        _io.on(`${FEED_COMMENT_LIKE_CREATED}`, (newdata: any) => {
            if (user && user.userId != newdata.user) {
                if (newdata.user) {
                    setConfirmed(true);
                }
            }
        });
    };
    const postaComment = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (comment.trim() == '') {
            return;
        } else {
            if (user && user.userId) {
                let newText: any = comment;
                newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
                newText = newText.split('###__').join('<a target="_blank" href=/profile/');
                newText = newText.split('^^__').join('>');
                newText = newText.split('###^^^').join(' </a>');
                let text = newText.trim();
                newText = newText.trim();
                let regix = /#(\S*)/g;
                let alltags: any = [];
                if (!feed?.postedOn) {
                    text = newText.replace(regix, function (url: any) {
                        let newurl = url.split('#');
                        if (!alltags.includes(newurl[1])) {
                            alltags.push(newurl[1]);
                        }
                        return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
                    });
                }
                toggle();
                let newComment = {
                    text: text,
                    createdAt: new Date(),
                    user: user
                };
                setComments([newComment, ...comments]);
                setComment('');
                let res = await dispatch(
                    postComment(
                        {
                            // user: user.userId,
                            feed: feed._id,
                            text: text,
                            mentioned: mentionedUsers
                            // tags: alltags,
                        },
                        () => {},
                        setConfirmed
                    )
                );
            } else {
                setPopup(true);
                setState(1);
            }
        }
    };

    useEffect(() => {
        if (feed?.poll) {
            let t = 0;
            for (const q of feed?.poll?.options) {
                t = t + q?.vote?.length;
            }
            setTotalvotes(t);
        }
    }, [feed]);
    useEffect(() => {
        if (emoji) {
            let a = comment.concat(emoji);
            setEmoji(null);
            setComment(a);
        }
    }, [emoji]);
    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };
    const emojo = useMemo(() => <EmojiPicker setEmoji={setEmoji} />, []);

    useEffect(() => {
        dispatch(getTopNft({ pageSize: 5, type: ['0'], isActive: true }));
        dispatch(getAuctionNft({ pageSize: 5, type: ['1'], isActive: true, expired: true }));
        const fileters = {
            pageSize: 5
        };
        // dispatch(getTopUsers(fileters));
        dispatch(getRecentlyRegistered());
        getTags();
    }, []);
    const getTags = async () => {
        setTagLoading(true);
        const res = await userService.getTophashTags();
        setTags(res.data.data);
        setTagLoading(false);
    };
    useEffect(() => {
        if (confirmed) {
            liveTags();
            setConfirmed(false);
        }
    }, [confirmed]);
    const liveTags = async () => {
        const res = await userService.getTophashTags();
        setTags(res.data.data);
    };
    const calculatepercentage = (option: any) => {
        return (option?.vote?.length / Number(toatalVotes)) * 100
            ? ((option?.vote?.length / Number(toatalVotes)) * 100).toFixed(1)
            : 0;
    };
    const votePoll = async (optionId: any) => {
        // console.log(new Date(feed?.poll?.expirayDate) < new Date());
        if (
            selectpollloading ||
            new Date(feed?.poll?.expirayDate) < new Date() ||
            checkblocked(feed?.user, user?.userId)
        ) {
            return;
        }
        if (user && user?.userId) {
            let data = {
                option: optionId,
                poll: feed?.poll
            };
            let res = await feedService.pollSelection(data);
            setFeed(res?.data?.data);
            // dispatch(pollSelection(data));
        }
    };
    const votePollInside = async (optionId: any, poll: any) => {
        // console.log(new Date(feed?.poll?.expirayDate) < new Date());
        if (
            selectpollloading ||
            new Date(feed?.feed?.poll?.expirayDate) < new Date() ||
            checkblocked(feed?.feed?.user, user?.userId)
        ) {
            return;
        }
        if (user && user?.userId) {
            let data = {
                option: optionId,
                poll: poll
            };
            let res = await feedService.pollSelection(data);
            setFeed({ ...feed, feed: res?.data?.data });
            // dispatch(pollSelection(data));
        }
    };
    var date1 = new Date();
    var date2 = new Date(feed?.poll?.expirayDate);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var Difference_In_Hours = Difference_In_Time / (1000 * 3600);

    const calculatepercentage1 = (option: any, poll: any) => {
        let t: Number = 0;
        for (const q of poll?.options) {
            t = t + q?.vote?.length;
        }
        return (option?.vote?.length / Number(t)) * 100 ? ((option?.vote?.length / Number(t)) * 100).toFixed(1) : 0;
    };
    const totalvotes = (poll: any) => {
        let t: Number = 0;
        for (const q of poll?.options) {
            t = t + q?.vote?.length;
        }
        return t;
    };
    return (
        <div className="container xl:pt-8 pt-[3rem] pb-28 ">
            <div className="flex flex-col items-start justify-between w-full mt-6 gap-x-10 xl:flex-row">
                {/* <div className="w-full xl:w-[25%] static xl:sticky overflow-auto at-sidebarwrapper scrolHide   top-48 xl:block hidden xl:h-[120vh]"> */}
                <div className="w-full xl:w-[25%]  xl:sticky  top-40   xl:block hidden">
                    <div className="max-h-screen overflow-auto scrolHide at-sidebarwrapper">
                        <div className="hidden lg:block">
                            <div className="mb-7">
                                <div className="flex items-center justify-between w-full pb-4">
                                    <h3 className="text-2xl !text-white">Top Users</h3>
                                    {/* <Link legacyBehavior href="/alluserspage">
                                <a>
                                <Button className="  xs:mt-4 border px-8 !text-white border-[#5A5A62] bg-transparent rounded-full">
                                    View All
                                    </Button>
                                </a>
                            </Link> */}
                                </div>
                                <div className="lg:flex flex-col gap-y-2.5 min-h-[440px]    max-h-[440px] scrolHide  relative">
                                    {loadingRecentUser ? (
                                        <div className="absolute top-0 w-full h-full ">
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
                            <div className="hidden xl:block">
                                <div className="w-full ">
                                    <h3 className="text-2xl text-white">Top Live Auction</h3>
                                </div>
                                <div className="mb-4 -mt-12 mySwiper lg:mb-0 ">
                                    <Swiper
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="pb-5 testimonialslider"
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
                                                    <div className="-mt-4 Atsocialcard" key={i}>
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
                {/* <div className="w-full  xl:w-[50%] xl:mb-0 mb-10 xl:order-1 order-2 ">
            <SocialfeedOnlyModule tag={tag} allowPost={allowPost} id="" />
        </div> */}
                <div className="w-full xl:w-[50%] xl:mb-0 mb-10 xl:order-1 order-2 ">
                    <svg
                        className="mb-5 cursor-pointer"
                        onClick={() => router.back()}
                        width="24"
                        height="24"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_5666_20741)">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8V8ZM16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8V8ZM11.5 7.5C11.6326 7.5 11.7598 7.55268 11.8536 7.64645C11.9473 7.74021 12 7.86739 12 8C12 8.13261 11.9473 8.25979 11.8536 8.35355C11.7598 8.44732 11.6326 8.5 11.5 8.5H5.707L7.854 10.646C7.90049 10.6925 7.93736 10.7477 7.96252 10.8084C7.98768 10.8692 8.00063 10.9343 8.00063 11C8.00063 11.0657 7.98768 11.1308 7.96252 11.1916C7.93736 11.2523 7.90049 11.3075 7.854 11.354C7.80751 11.4005 7.75232 11.4374 7.69158 11.4625C7.63084 11.4877 7.56574 11.5006 7.5 11.5006C7.43426 11.5006 7.36916 11.4877 7.30842 11.4625C7.24768 11.4374 7.19249 11.4005 7.146 11.354L4.146 8.354C4.09944 8.30755 4.06249 8.25238 4.03729 8.19163C4.01208 8.13089 3.99911 8.06577 3.99911 8C3.99911 7.93423 4.01208 7.86911 4.03729 7.80837C4.06249 7.74762 4.09944 7.69245 4.146 7.646L7.146 4.646C7.23989 4.55211 7.36722 4.49937 7.5 4.49937C7.63278 4.49937 7.76011 4.55211 7.854 4.646C7.94789 4.73989 8.00063 4.86722 8.00063 5C8.00063 5.13278 7.94789 5.26011 7.854 5.354L5.707 7.5H11.5Z"
                                fill="#ffffff"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_5666_20741">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <div className="">
                        <div>
                            <Head>
                                <title>LooBr | Feed</title>
                                <meta
                                    name="description"
                                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                                />
                                <link rel="icon" href="/favicon.ico" />
                            </Head>
                            {loading && (
                                <div className="text-center ">
                                    <figure className="mt-12">
                                        {/* <Image src="/assets/images/loader.png" height={48} width={48} alt="" /> */}
                                        <div className="loadingio-spinner-rolling-jz7efhw30v">
                                            <div className="ldio-fcd0x3izul5">
                                                <div></div>
                                            </div>
                                        </div>
                                    </figure>
                                </div>
                            )}
                            {!loading && (
                                <div>
                                    <div className="w-full  border-[#2B2B35] hover:bg-[#1c1c27]    rounded-3xl border-2 mb-[40px] ">
                                        <div className="flex items-center justify-between w-full p-5 ">
                                            <div>
                                                {/* <a className="flex items-center" href="#"> */}
                                                {/* <Link legacyBehavior
                                                    href={
                                                        feed?.user?._id == user?.userId
                                                            ? `/profile/me`
                                                            : `/profile/${feed?.user?.userName}`
                                                    }> */}
                                                <a className="flex items-center gap-5">
                                                    <figure
                                                        className="relative flex items-center justify-center rounded-full cursor-pointer w-14 h-14 UerProfileImage"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(
                                                                // feed?.user?._id == user?.userId
                                                                //     ? `/profile/me`
                                                                //     :
                                                                `/profile/${feed?.user?.userName}`
                                                            );
                                                        }}>
                                                        {feed?.user?.avatar ? (
                                                            <ImageComponent
                                                                className="rounded-full "
                                                                src={feed?.user?.avatar}
                                                                alt=""
                                                                // height={56}
                                                                // width={56}
                                                                objectFit="cover"
                                                                layout="fill"
                                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                            />
                                                        ) : (
                                                            <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                                {feed?.user?.firstName?.charAt(0).toUpperCase()}
                                                            </p>
                                                        )}
                                                    </figure>
                                                    <div className="flex items-start ">
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(
                                                                    // feed?.user?._id == user?.userId
                                                                    //     ? `/profile/me`
                                                                    //     :
                                                                    `/profile/${feed?.user?.userName}`
                                                                );
                                                            }}>
                                                            <div className="flex items-center gap-2">
                                                                <h2
                                                                    className={`text-white text-base leading-none     lg:max-w-full ${
                                                                        feed?.collections?.name
                                                                            ? 'xs3:max-w-[60px]  xs4:max-w-[50px]'
                                                                            : ' max-w-[170px] '
                                                                    }   max-w-[170px] hover:border-b border-white  truncate mr-2`}>
                                                                    {feed?.user?.firstName} {feed?.user?.lastName}
                                                                </h2>
                                                                {feed?.user?.isVerfied && <Verified />}
                                                            </div>
                                                            <p className="text-sm max-w-[170px] mt-1  truncate ">
                                                                @{feed?.user?.userName}
                                                            </p>
                                                        </div>
                                                        {feed?.postedOn && (
                                                            <div className="flex ">
                                                                <svg
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M10.46 17.9992C10.146 17.9974 9.83587 17.9292 9.55 17.7992C9.24083 17.6629 8.97741 17.4405 8.79122 17.1586C8.60503 16.8767 8.50393 16.5471 8.5 16.2092V7.78921C8.50393 7.45136 8.60503 7.12178 8.79122 6.83983C8.97741 6.55789 9.24083 6.33549 9.55 6.19921C9.90574 6.03118 10.3015 5.96646 10.6923 6.01243C11.083 6.0584 11.453 6.21321 11.76 6.45921L16.86 10.6692C17.06 10.8284 17.2215 11.0307 17.3325 11.261C17.4435 11.4912 17.5012 11.7436 17.5012 11.9992C17.5012 12.2548 17.4435 12.5072 17.3325 12.7375C17.2215 12.9677 17.06 13.17 16.86 13.3292L11.76 17.5392C11.3924 17.8373 10.9333 17.9998 10.46 17.9992Z"
                                                                        fill="white"
                                                                    />
                                                                </svg>

                                                                {/* <Link legacyBehavior
                                                                    href={
                                                                        feed?.postedOn?._id == user?.userId
                                                                            ? `/profile/me`
                                                                            : `/profile/${feed?.postedOn?.userName}`
                                                                    }> */}
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        router.push(
                                                                            // feed?.postedOn?._id == user?.userId
                                                                            //     ? `/profile/me`
                                                                            //     :
                                                                            `/profile/${feed?.postedOn?.userName}`
                                                                        );
                                                                    }}>
                                                                    {feed?.postedOn?.firstName}{' '}
                                                                    {feed?.postedOn?.lastName}
                                                                </span>
                                                                {/* </Link> */}
                                                            </div>
                                                        )}
                                                        <div
                                                            className={`  flex       ${
                                                                feed?.collections ? ' xs:-ml-2   xs:-mt-0' : '-mt-1.5'
                                                            } `}>
                                                            {feed?.collections && (
                                                                <div className="flex items-center justify-center -mt-1 ">
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M10.46 17.9992C10.146 17.9974 9.83587 17.9292 9.55 17.7992C9.24083 17.6629 8.97741 17.4405 8.79122 17.1586C8.60503 16.8767 8.50393 16.5471 8.5 16.2092V7.78921C8.50393 7.45136 8.60503 7.12178 8.79122 6.83983C8.97741 6.55789 9.24083 6.33549 9.55 6.19921C9.90574 6.03118 10.3015 5.96646 10.6923 6.01243C11.083 6.0584 11.453 6.21321 11.76 6.45921L16.86 10.6692C17.06 10.8284 17.2215 11.0307 17.3325 11.261C17.4435 11.4912 17.5012 11.7436 17.5012 11.9992C17.5012 12.2548 17.4435 12.5072 17.3325 12.7375C17.2215 12.9677 17.06 13.17 16.86 13.3292L11.76 17.5392C11.3924 17.8373 10.9333 17.9998 10.46 17.9992Z"
                                                                            fill="white"
                                                                        />
                                                                    </svg>

                                                                    <div
                                                                        className="cursor-pointer flex items-center justify-center xs:justify-start xs:w-[8rem]  xs3:w-[5rem]          gap-1"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            feed?.collections?._id &&
                                                                                router.push(
                                                                                    feed?.collections?.isExternal
                                                                                        ? `/collections/address/${feed?.collections?.address}?chain=${feed?.collections?.chain}`
                                                                                        : `/collections/${feed?.collections?._id}`
                                                                                );
                                                                        }}>
                                                                        <span className="truncate xs2:text-base hover:border-b   hover:border-themecolor max-w-[10rem]  sm:max-w-[14rem]   ">
                                                                            {feed?.collections?.name} collection
                                                                        </span>
                                                                        {feed?.collections?.isVerfied && (
                                                                            <svg
                                                                                className="flex-shrink-0"
                                                                                width="20"
                                                                                height="20"
                                                                                viewBox="0 0 38 38"
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
                                                                                        <stop
                                                                                            offset="0.484375"
                                                                                            stopColor="#ECDB88"
                                                                                        />
                                                                                        <stop
                                                                                            offset="0.994792"
                                                                                            stopColor="#AA601B"
                                                                                        />
                                                                                    </linearGradient>
                                                                                </defs>
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <span className="text-[#727279] text-[14px]  max-w-[170px] truncate text-sm ml-2  mt-[2px] font-Proxima-Regular">
                                                            {moment(feed?.createdAt).fromNow()}
                                                        </span>
                                                    </div>
                                                </a>
                                                {/* </Link> */}
                                            </div>
                                            <div className="flex items-center justify-end mt-4 sm:mt-0 ">
                                                {feed?.user?._id != user?.userId &&
                                                !checkblocked(feed?.user, user?.userId) &&
                                                user &&
                                                user.userId ? (
                                                    <>
                                                        {/* <span className="xs:hidden">
                                                            <Follow
                                                                userModule={true}
                                                                otherUser={feed?.user}
                                                                followers={followers}
                                                                setFollowers={setFollowers}
                                                                // setConfirm={() => {}}
                                                            />
                                                        </span> */}
                                                        <Drodpdown
                                                            id={feed?._id}
                                                            postUserId={feed?.user?._id}
                                                            feed={true}
                                                            setConfirmed={setConfirmed}
                                                        />
                                                    </>
                                                ) : (
                                                    // <Button
                                                    //     className="px-4 py-2 rounded-full gold"
                                                    //     onClick={() => conectRoom(feed?.user?._id)}>
                                                    //     Message
                                                    // </Button>

                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        {/* {feed?.postedOn && (
                <div className="flex flex-row items-center justify-between w-full p-5">
                    <div className="flex">
                        <div className="flex flex-col">
                            <p className="text-[14px]  max-w-[170px] lg:max-w-auto  truncate">
                                <span className="text-white">Posted on: </span>
                                <Link legacyBehavior
                                    href={
                                        feed?.postedOn?._id == user?.userId
                                            ? `/profile/me`
                                            : `/profile/${feed?.postedOn?.userName}`
                                    }>
                                    <a>@{feed?.postedOn?.userName}</a>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            )} */}
                                        <div className="w-full p-5 border-2 border-x-0 border-b-0 border-[#2B2B35]">
                                            {feed && feed.text && (
                                                // <p
                                                //     className="pb-6 text-white  !break-all Atlinktext"
                                                //     dangerouslySetInnerHTML={{ __html: urlify(feed?.text) }}></p>
                                                <FeedTextLength item={feed} />
                                            )}
                                        </div>
                                        {feed?.type == 'poll' && (
                                            <div className=" rounded-[12px] p-6 ">
                                                <h4 className="text-lg text-white cursor-pointer">
                                                    {feed?.poll?.question}
                                                </h4>
                                                {feed?.poll?.options.map((option: any, index: number) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`mt-6 relative ${
                                                                selectpollloading ||
                                                                option?.vote?.includes(user?.userId) ||
                                                                new Date(feed?.poll?.expirayDate) < new Date() ||
                                                                checkblocked(feed?.user, user?.userId) ||
                                                                !user
                                                                    ? ''
                                                                    : 'cursor-pointer'
                                                            } `}
                                                            onClick={() => {
                                                                votePoll(option?._id);
                                                            }}>
                                                            <div
                                                                // value={option?.option}
                                                                // disabled={true}
                                                                // placeholder="It will evolve more"
                                                                // type="text"
                                                                // name="text"
                                                                // styles=" "
                                                                className={` !font-Proxima-Regular  px-4 py-6 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Circular-Book w-full outline-none rounded-xl text-white leading-[0] ${
                                                                    option?.vote?.includes(user?.userId)
                                                                        ? '!border-themecolor'
                                                                        : ''
                                                                }`}>
                                                                {option?.option}
                                                            </div>
                                                            <span className="absolute text-base text-white -translate-y-1/2 right-3 top-1/2">
                                                                {calculatepercentage(option)} %
                                                            </span>
                                                        </div>
                                                    );
                                                })}

                                                <div className={`mt-6  `}>
                                                    <p className="">
                                                        <span
                                                            className={`${
                                                                user && user?.userId
                                                                    ? ' hover:text-themecolor cursor-pointer'
                                                                    : ''
                                                            } `}
                                                            onClick={(e: any) => {
                                                                if (user && user?.userId) {
                                                                    e.stopPropagation();
                                                                    setData(feed?.poll?._id);
                                                                    setPopup(true);
                                                                    setState(95);
                                                                }
                                                            }}>
                                                            {toatalVotes} {toatalVotes > 1 ? 'votes' : 'vote'} .{' '}
                                                        </span>

                                                        {new Date() > new Date(feed?.poll?.expirayDate) ? (
                                                            <span>Poll closed</span>
                                                        ) : (
                                                            <span>
                                                                {Difference_In_Days > 0
                                                                    ? Difference_In_Days.toFixed(0) + 'd left'
                                                                    : Difference_In_Hours.toFixed(0) + 'h left'}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {feed?.image ? (
                                            <>
                                                <figure className="relative bg-[#2B2B35] overflow-hidden z-0 ">
                                                    {feed?.image && (
                                                        <div>
                                                            <div
                                                                className="!flex-shrink-0  bg-[#22222b] flex justify-center "
                                                                onClick={() => {
                                                                    setPopup(true);
                                                                    setData(feed?.image);
                                                                    setState(83);
                                                                }}>
                                                                <ImageComponent
                                                                    width={375}
                                                                    height={375}
                                                                    src={feed.image}
                                                                    alt=""
                                                                    quality={60}
                                                                />
                                                            </div>
                                                            {/* <div className="h-full BluredImage">
                                    <Image width={800} height={470} src={feed.image} />
                                </div> */}
                                                        </div>
                                                    )}
                                                </figure>
                                            </>
                                        ) : (
                                            <></>
                                        )}

                                        {feed?.video ? (
                                            <>
                                                <figure className="relative bg-[#2B2B35] overflow-hidden AtfeedImage ">
                                                    <Video src={feed.video} />
                                                </figure>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        {feed?.feed && (
                                            <div className="px-5 pb-5 -mt-3 ">
                                                <div className="w-full h-auto  border-[#2B2B35] rounded-3xl border-2 overflow-hidden">
                                                    <div className="flex flex-row items-center justify-between w-full p-5">
                                                        <div>
                                                            <Link
                                                                legacyBehavior
                                                                href={
                                                                    // feed?.feed?.user?._id == user?.userId
                                                                    //     ? `/profile/me`
                                                                    //     :
                                                                    `/profile/${feed?.feed?.user?.userName}`
                                                                }>
                                                                <a>
                                                                    <div className="flex items-center gap-5 ">
                                                                        <figure className="flex items-center justify-center rounded-full w-14 h-14 UerProfileImage ">
                                                                            {feed?.feed?.user?.avatar ? (
                                                                                <ImageComponent
                                                                                    className="rounded-full "
                                                                                    src={feed?.feed?.user?.avatar}
                                                                                    alt=""
                                                                                    height={56}
                                                                                    width={56}
                                                                                    transformation={
                                                                                        TRANSFORMATION_NAMES.fit_50x50
                                                                                    }
                                                                                />
                                                                            ) : (
                                                                                <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                                                    {feed?.feed?.user?.firstName
                                                                                        ?.charAt(0)
                                                                                        .toUpperCase()}
                                                                                </p>
                                                                            )}
                                                                        </figure>
                                                                        <div className="flex ">
                                                                            <div className="flex flex-col">
                                                                                <div className="flex items-center gap-2 ">
                                                                                    <h2
                                                                                        className={`text-white text-base leading-none     lg:max-w-full ${
                                                                                            feed?.collections?.name
                                                                                                ? 'xs3:max-w-[60px]  xs4:max-w-[50px]'
                                                                                                : ' max-w-[170px] '
                                                                                        }   max-w-[170px] hover:border-b border-white   truncate mr-2`}>
                                                                                        {feed?.feed?.user?.firstName}{' '}
                                                                                        {feed?.feed?.user?.lastName}
                                                                                    </h2>
                                                                                    {feed?.feed?.user?.isVerfied && (
                                                                                        <Verified />
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-[14px]   max-w-[170px] lg:max-w-auto truncate">
                                                                                    @{feed?.feed?.user?.userName}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    {/* <div className="w-full p-5 pt-0 text-white">
                                        <p className="text-white">this is description</p>
                                    </div> */}
                                                    {feed?.feed?.text && (
                                                        <div className="w-full p-5 pt-0 text-white">
                                                            {/* <p className="text-white">{data?.text}</p> */}
                                                            {/* <p
                                    className="inline text-white text-[16px] braek  break-words"
                                    dangerouslySetInnerHTML={{
                                        __html: urlify(feed?.feed?.text)
                                    }}
                                /> */}
                                                            <FeedTextLength item={feed?.feed} />
                                                        </div>
                                                    )}
                                                    {feed?.feed?.nft && (
                                                        <div className="w-full p-5 pt-0 text-white">
                                                            <p className="text-white">
                                                                {feed?.feed?.nft?.nft?.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {feed?.feed?.type == 'poll' && (
                                                        <div
                                                            className="w-full p-5 pt-0 text-white cursor-pointer"
                                                            // onClick={(e) => {
                                                            //     e.stopPropagation();
                                                            //     router.push(`/feed/${feed?.feed?._id}`);
                                                            // }}
                                                        >
                                                            <div className=" rounded-[12px] p-6 ">
                                                                <h4 className="text-lg text-white cursor-pointer">
                                                                    {feed?.feed?.poll?.question}
                                                                </h4>
                                                                {feed?.feed?.poll?.options?.map(
                                                                    (option: any, index: number) => {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                className={`mt-6 relative `}>
                                                                                <div
                                                                                    // value={option?.option}
                                                                                    // disabled={true}
                                                                                    // placeholder="It will evolve more"
                                                                                    // type="text"
                                                                                    // name="text"
                                                                                    // styles=" "
                                                                                    onClick={(e: any) => {
                                                                                        e.stopPropagation();
                                                                                        votePollInside(
                                                                                            option?._id,
                                                                                            feed?.feed?.poll
                                                                                        );
                                                                                    }}
                                                                                    className={` !font-Proxima-Regular  px-4 py-6 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Circular-Book w-full outline-none rounded-xl text-white leading-[0] ${
                                                                                        option?.vote?.includes(
                                                                                            user?.userId
                                                                                        )
                                                                                            ? '!border-themecolor'
                                                                                            : ''
                                                                                    }`}>
                                                                                    {option?.option}
                                                                                </div>
                                                                                <span className="absolute text-base text-white -translate-y-1/2 right-3 top-1/2">
                                                                                    {calculatepercentage1(
                                                                                        option,
                                                                                        feed?.feed?.poll
                                                                                    )}{' '}
                                                                                    %
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                            <span>
                                                                {totalvotes(feed?.feed?.poll)}{' '}
                                                                {totalvotes(feed?.feed?.poll) > 1 ? 'votes' : 'vote'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {feed?.feed?.type == 'image' || feed?.feed?.type == 'nft' ? (
                                                        <figure
                                                            className=" !flex-shrink-0 bg-[#22222b] AtfeedImage cursor-pointer"
                                                            onClick={() => {
                                                                setPopup(true);
                                                                setData(feed?.feed?.image);
                                                                setState(83);
                                                            }}>
                                                            <ImageComponent
                                                                src={feed?.feed?.type == 'image' && feed?.feed?.image}
                                                                width={800}
                                                                height={400}
                                                                quality={60}
                                                                className=""
                                                                alt=""
                                                            />
                                                        </figure>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {feed?.feed?.type == 'video' && (
                                                        <figure className=" !flex-shrink-0 bg-[#22222b] AtfeedImage">
                                                            <video
                                                                className="w-full h-[375px] bg-[#22222b] "
                                                                controls
                                                                controlsList="nodownload"
                                                                width={800}
                                                                height={400}
                                                                muted
                                                                autoPlay
                                                                src={feed?.feed?.video}
                                                            />
                                                        </figure>
                                                    )}

                                                    {feed?.feed?.type == 'nft' && (
                                                        <div className="flex items-center justify-between p-5 px-5 pb-3">
                                                            <div>
                                                                <p>Price</p>
                                                                <FeedPrice listing={feed?.feed?.nft} />
                                                                {/* <h3 className="text-[#F1C94A] text-xl mt-1">
                                        {Number(
                                            calculateAmount(feed?.feed?.nft?.price)
                                        ).toLocaleString() || '0.00'}
                                   
                                        <i className="inline-block ml-2 align-top ">
                                            <Image
                                                src={'/assets/images/loobricon.svg'}
                                                width={25}
                                                height={25}
                                                alt="logo"
                                            />
                                        </i>
                                    </h3> */}
                                                            </div>
                                                            {feed?.feed?.nft?.isActive && (
                                                                <Button
                                                                    className="border border-themecolor gold !py-2.5 !px-9 rounded-[6rem] text-sm"
                                                                    onClick={() => {
                                                                        router.push(
                                                                            `/listings/${feed?.feed?.nft?.listingId}`
                                                                        );
                                                                    }}>
                                                                    View NFT
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="w-full p-5 border-2 border-x-0 border-b-0 border-[#2B2B35] ">
                                            <ul
                                                className={`w-full list-none flex items-center gap-x-5  ${
                                                    checkblocked(feed?.user, user?.userId) ? 'opacity-50' : ''
                                                }`}>
                                                <LikeComponent feed={feed} feeduser={feed?.user} />
                                                <li className="flex items-center">
                                                    <div className="cursor-pointer Atcardhovercomment-bg">
                                                        <svg
                                                            className=" Atcardhovercomment"
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 22 22"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M6 7H16M6 12H12M7.5 18H7C3 18 1 17 1 12V7C1 3 3 1 7 1H15C19 1 21 3 21 7V12C21 16 19 18 15 18H14.5C14.19 18 13.89 18.15 13.7 18.4L12.2 20.4C11.54 21.28 10.46 21.28 9.8 20.4L8.3 18.4C8.14 18.18 7.77 18 7.5 18Z"
                                                                stroke="#A1A1A5"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="pl-3">
                                                        <strong className="text-white ">
                                                            {feed?.comments?.length}
                                                        </strong>
                                                    </span>
                                                </li>
                                                {!feed?.postedOn && !feed?.collections && feed?.type !== 'poll' && (
                                                    <li
                                                        className={`${
                                                            checkblocked(feed?.user, user?.userId)
                                                                ? ''
                                                                : 'cursor-pointer'
                                                        } flex items-center`}
                                                        onClick={() => {
                                                            if (checkblocked(feed?.user, user?.userId)) {
                                                            } else if (user && user?.userId) {
                                                                setRepost(true);
                                                                setType('feed');
                                                                if (feed?.feed) {
                                                                    setData(feed.feed);
                                                                } else {
                                                                    setData(feed);
                                                                }
                                                                setPopup(true);
                                                                setState(30);
                                                            } else {
                                                                setPopup(true);
                                                                setState(1);
                                                            }
                                                        }}>
                                                        <div className="Atcardhoverrepost-bg">
                                                            <svg
                                                                className="Atcardhoverrepost"
                                                                width="20"
                                                                height="20"
                                                                viewBox="0 0 20 20"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M18.3327 9.99996C18.3327 14.6 14.5993 18.3333 9.99935 18.3333C5.39935 18.3333 2.59102 13.7 2.59102 13.7M2.59102 13.7H6.35768M2.59102 13.7V17.8666M1.66602 9.99996C1.66602 5.39996 5.36602 1.66663 9.99935 1.66663C15.5577 1.66663 18.3327 6.29996 18.3327 6.29996M18.3327 6.29996V2.13329M18.3327 6.29996H14.6327"
                                                                    stroke="#A1A1A5"
                                                                    strokeWidth="1.5"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <span className="pl-3 text-white text-[14px] xs:text-xs  font-Proxima-SemiBold">
                                                            Repost
                                                        </span>
                                                    </li>
                                                )}
                                                <li
                                                    className={`${
                                                        checkblocked(feed?.user, user?.userId)
                                                            ? 'flex items-center '
                                                            : 'cursor-pointer flex items-center ml-auto '
                                                    } `}
                                                    onClick={() => {
                                                        if (!checkblocked(feed?.user, user?.userId)) {
                                                            setData(`${process.env.NEXT_PUBLIC_URL}/feed/${feed._id}`);
                                                            setPopup(true);
                                                            setState(31);
                                                        }
                                                    }}>
                                                    <div className="Atcardhovershare-bg">
                                                        <svg
                                                            className="Atcardhovershare"
                                                            width="22"
                                                            height="22"
                                                            viewBox="0 0 22 22"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M15.91 5.03003C17.91 6.42003 19.29 8.63003 19.57 11.18M2.44 11.23C2.7 8.68996 4.06 6.47996 6.04 5.07996M7.14001 19.7999C8.30001 20.3899 9.62002 20.7199 11.01 20.7199C12.35 20.7199 13.61 20.4199 14.74 19.8699M13.79 3.78C13.79 5.31535 12.5454 6.56 11.01 6.56C9.47469 6.56 8.23004 5.31535 8.23004 3.78C8.23004 2.24465 9.47469 1 11.01 1C12.5454 1 13.79 2.24465 13.79 3.78ZM6.56 16C6.56 17.5353 5.31535 18.78 3.78 18.78C2.24465 18.78 1 17.5353 1 16C1 14.4646 2.24465 13.22 3.78 13.22C5.31535 13.22 6.56 14.4646 6.56 16ZM20.9 16C20.9 17.5353 19.6554 18.78 18.12 18.78C16.5847 18.78 15.34 17.5353 15.34 16C15.34 14.4646 16.5847 13.22 18.12 13.22C19.6554 13.22 20.9 14.4646 20.9 16Z"
                                                                stroke="#A1A1A5"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="pl-3">
                                                        <strong className="text-white">Share</strong>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div>
                                        <ul
                                            className="list-none max-h-[355px] overflow-auto at-sidebarwrapper relative  scrollbarHide"
                                            ref={commentRef}>
                                            <>
                                                {!checkblocked(feed?.user, user?.userId) &&
                                                    comments &&
                                                    comments.length > 0 && (
                                                        <Comments
                                                            comments={comments}
                                                            setConfirmed={setConfirmed}
                                                            confirmed={confirmed}
                                                            otherUser={feed?.postedOn ? feed?.postedOn : ''}
                                                        />
                                                    )}
                                            </>
                                        </ul>
                                    </div>

                                    {user && user.userId && !checkblocked(feed?.user, user?.userId) && (
                                        <div className="relative mt-[30px]">
                                            <form onSubmit={postaComment} key="commenta">
                                                <MentionedInput
                                                    // styles={""}
                                                    autoFocuss={true}
                                                    styles="!rounded-full w-full pt-[12px] pb-[12px] pl-[20px] pr-[100px] border border-[#43434C] text-base Atmentioninput"
                                                    singleLine={true}
                                                    placeHolder={'Add comments'}
                                                    value={comment}
                                                    setMentionedUsers={setMentionedUsers}
                                                    setValues={(value: any) => setComment(value)}
                                                />

                                                <div className="flex items-center absolute right-[20px] top-1/2 -translate-y-1/2">
                                                    {emojo}
                                                </div>

                                                <button
                                                    className="text-base absolute top-[50%] translate-y-[-50%] right-[15px] z-[2] w-[40px] h-[40px] bg-themecolor flex items-center justify-center rounded-full text-themecolor"
                                                    type="button"
                                                    onClick={(e: any) => postaComment(e)}>
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M1.72415 1.05281C1.64045 1.01095 1.54668 0.993419 1.45351 1.00221C1.36034 1.01101 1.27151 1.04577 1.19711 1.10255C1.12272 1.15934 1.06576 1.23586 1.03271 1.32341C0.999658 1.41096 0.991841 1.50604 1.01015 1.59781L2.41315 6.44781C2.43931 6.5382 2.49044 6.61936 2.56067 6.68198C2.6309 6.74461 2.71737 6.78614 2.81015 6.80181L8.50015 7.75481C8.76815 7.80781 8.76815 8.19181 8.50015 8.24481L2.81015 9.19781C2.71737 9.21349 2.6309 9.25502 2.56067 9.31764C2.49044 9.38026 2.43931 9.46143 2.41315 9.55181L1.01015 14.4018C0.991841 14.4936 0.999658 14.5887 1.03271 14.6762C1.06576 14.7638 1.12272 14.8403 1.19711 14.8971C1.27151 14.9539 1.36034 14.9886 1.45351 14.9974C1.54668 15.0062 1.64045 14.9887 1.72415 14.9468L14.7241 8.44681C14.8071 8.40524 14.8768 8.34142 14.9256 8.26248C14.9743 8.18353 15.0001 8.09259 15.0001 7.99981C15.0001 7.90704 14.9743 7.81609 14.9256 7.73715C14.8768 7.65821 14.8071 7.59438 14.7241 7.55281L1.72415 1.05281Z"
                                                            fill="#14141F"
                                                        />
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                    {state && (
                                        <Popups
                                            show={popup}
                                            hide={setPopup}
                                            setPopup={setPopup}
                                            state={state}
                                            // close={close}
                                            setstate={setState}
                                            data={data}
                                            type={type}
                                            setConfirmed={setConfirmed}
                                        />
                                    )}
                                    {/* {user && user.userId && <DirectChat />} */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full xl:w-[25%] top-32 xl:sticky  xl:order-2 order-1">
                    <div className="max-h-screen overflow-y-auto scrolHide at-sidebarwrapper">
                        <div className="flex items-center justify-between pb-4">
                            <h3 className="text-2xl text-white">Top Hashtags</h3>
                        </div>
                        <div className="">
                            {tagLoading && (
                                <div className="mt-2 mb-2 ">
                                    <Loader />
                                </div>
                            )}
                            {!tagLoading && tags?.length < 1 && <Notfound />}

                            {!tagLoading && tags?.length > 0 && (
                                <div className="bg-[#2b2b35] p-4 mb-10 rounded-lg ">
                                    {tags?.map((item: any, i: number) => {
                                        return (
                                            <div key={i}>
                                                <a href={`/search?id=${item}`}>#{item}</a>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        {!isEmpty(topNft) && (
                            <div className="">
                                <div className="items-center justify-between hidden mt-4 xl:flex">
                                    <h3 className="text-2xl text-white">Top NFTs</h3>
                                </div>
                                <div className="hidden -mt-12 border border-transparent mySwiper xl:block">
                                    <Swiper
                                        navigation={true}
                                        modules={[Pagination, Navigation]}
                                        className="testimonialslider AtShadownone "
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
                                                    <div className="-mt-4 Atsocialcard" key={i}>
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
        </div>
    );
};

export default SingleFeed;
