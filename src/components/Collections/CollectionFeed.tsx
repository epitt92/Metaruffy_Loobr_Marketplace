import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Button from '../../components/Button/Button';
import Popups from '../../components/popup/poups';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { _io } from '../../services/socket.service';
import { FEED_COMMENT_LIKE_CREATED } from '../../constants/socketEvents';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getFeeds } from '../../redux/user/actions';
import Drodpdown from '../../components/Dropdown/Dropdown';
import { LikeComponent } from '../../components/Like/LikeComponent';
import moment from 'moment';
import FeedTextLength from '../../components/TextLength/FeedTextLength';
import { FeedPost } from '../../components/FeedPost/FeedPost';
import Link from 'next/link';
import useAudio from '../../hooks/useAudio';
import Comments from '../../components/CommentsWithReply/comments';
import { isEmpty } from 'validate.js';
import Notfounditem from '../../components/notfounditems/notfounditem';
import { Follow } from '../../components/Follow/follow';
import FeedPrice from '../../components/PriceFeedNft/feedprice';
import { fetchImage, NftContentType } from '../../utils/functions';
import ImageComponent from '../../components/Image/ImageComponent';
import { Transformation } from '@cloudinary/url-gen';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import Video from '../../modules/SocialFeedsOnlyModule/video';
import detailContentView from '../../modules/NftDetailModule/detailContentView';
interface Iprops {
    tag: any;
    allowPost: boolean;
    id?: any;
    setConfirmation?: any;
    confirmation?: any;
}
const SocialfeedOnlyModule = ({ tag, allowPost, id, setConfirmation, confirmation }: Iprops) => {
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const [close, setClose] = useState('');
    const [state, setState] = useState(-1);
    const dispatch = useDispatch();
    const [data, setData] = useState<any>();
    const userData = useSelector((state: any) => state.user);
    const user = useSelector((state: any) => state.auth.user);
    const [feeds, setFeeds] = useState<any>([]);
    const [nft, setNft] = useState<any>();
    const [type, setType] = useState<string>('');
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setIsLoadMore] = useState<boolean>(false);
    const [followers, setFollowers] = useState<any>();
    const [confirm, setConfirm] = useState<Boolean>(false);
    const [feedFile, setfeedFile] = useState<Boolean>(false);
    const [repost, setRepost] = useState<Boolean>(false);
    const [feedIndex, setFeedIndex] = useState<Array<number>>([]);

    const [searchValue, setSearchValue] = useState<string>(tag);

    const [values, setValues] = useState({
        user: user?.userId,
        text: ''
    });
    const [file, setFile] = useState<any>(null);
    // for setting feeds data
    useEffect(() => {
        if (userData?.AllFeeds != null) {
            setLoading(false);
            if (loadingMore && !confirmed) {
                setIsLoadMore(false);
                setFeeds([...feeds, ...userData?.AllFeeds?.feeds]);
            } else {
                setConfirmed(false);
                setFeeds([...userData?.AllFeeds?.feeds]);
            }
        } else {
            // console.log('For first TIme outside ', id);
            if (router.asPath == '/profile/[username]' || router.asPath == '/profile/me') {
                const fileters = {
                    pageSize: 1,
                    page: page,
                    tag: searchValue,
                    user: id
                };
                // console.log('For first TIme inside ', id);
                id && dispatch(getFeeds(fileters, '', true));
            } else {
                const fileters = {
                    pageSize: 15,
                    page: page,
                    tag: searchValue,
                    user: id
                };
                // console.log('For first TIme ID hi nhi mile ', id);
                dispatch(getFeeds(fileters, '', true));
            }
        }
        return () => {
            // dispatch({ type: 'GET_USER_BY_ID', payload: null });
            // console.log('return');
        };
    }, [userData.AllFeeds]);

    useEffect(() => {
        // console.log('It is changed because router');
        if (router.asPath == '/feeds') {
            // console.log('changed because router socialfeed ', id);
            setLoading(true);
            const fileters = {
                pageSize: 15,
                page: page
                // tag: searchValue,
            };

            dispatch(getFeeds(fileters, '', true));
        }
        if (router.asPath.includes('/profile/')) {
            if (id) {
                // console.log('changed because router profile ', id);
                setLoading(true);
                const fileters = {
                    pageSize: 15,
                    page: page,
                    tag: searchValue,
                    user: id
                };

                dispatch(getFeeds(fileters, '', true));
            }
        }
    }, [router, id]);

    useEffect(() => {
        if (router.asPath.includes('/profile/') && confirmation) {
            const fileters = {
                pageSize: 15,
                page: page,
                tag: searchValue,
                user: id
            };

            id && dispatch(getFeeds(fileters, '', true));
        }
    }, [confirmation]);

    // when a new data is loaded
    useEffect(() => {
        if (page > 1) {
            const fileters = {
                // search: searchValue,
                tag: searchValue,
                user: id,
                pageSize: 15,
                page: page
            };
            dispatch(getFeeds(fileters, '', true));
        }
    }, [page]);
    // this is for listening the new comments and feeds by other users
    useEffect(() => {
        listenSocket();
    }, [user?.userId]);
    const listenSocket = () => {
        _io.on(`${FEED_COMMENT_LIKE_CREATED}`, (newdata: any) => {
            if (user && user?.userId == newdata.user) {
                // dispatch(getFeeds(fileters, "", false));
            } else {
                if (newdata.user) {
                    setConfirmed(true);
                }
            }
        });
    };
    // this is for if a post is created or any comment is create so the new feeds can be fetched
    useEffect(() => {
        if (confirmed) {
            const fileters = {
                user: id,

                tag: searchValue,
                pageSize: 15 * page,
                page: 1
            };
            setConfirmation && setConfirmation(true);
            dispatch(getFeeds(fileters, '', false));
            // setConfirmed(false)
        }
    }, [confirmed]);

    //For repost redirection
    useEffect(() => {
        if (repost && router.asPath.includes('/profile/')) {
            router.push('/feeds');
        }
    }, [userData.AllFeeds]);
    //this is or loading more feeds
    const handleLoadMore = () => {
        setIsLoadMore(true);
        setPage(page + 1);
    };

    // This is for setting the read more and read less property of the feed
    const setFeed = (e: number) => {
        let array = feedIndex;
        if (array.includes(e)) {
            let index = array.indexOf(e);
            if (index > -1) {
                array.splice(index, 1);
                setFeedIndex([...array]);
            }
        } else {
            array.push(e);
            setFeedIndex([...array]);
        }
    };
    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };
    function urlify(text: string) {
        var urlRegex = /(https?:\/\/[^\s^\<]+)/g;

        return text.replace(urlRegex, function (url) {
            return `<a target="_blank" href=${url}>  ${url} </a>`;
        });
    }
    var go = /(https?:\/\/[^\s^\<]+)/g;
    const redirect = (link: any) => {
        if (link.includes('profile')) {
            window.open(link);
        } else {
            // if (link.includes('feed')) {
            router.push(link);
            // }
        }
    };
    return (
        <div className="  ">
            {user &&
                user?.userId &&
                allowPost &&
                (allowPost && id ? !checkblocked(userData?.user, user?.userId) : true) && (
                    <FeedPost
                        setfeedFile={setfeedFile}
                        feedFile={feedFile}
                        setFile={setFile}
                        file={file}
                        setValues={setValues}
                        values={values}
                        user={user}
                        nft={nft}
                        setNft={setNft}
                        setPopup={setPopup}
                        setState={setState}
                        data={data}
                        setData={setData}
                        userName={allowPost && id ? id : ''}
                    />
                )}

            {loading && (
                <div className=" text-center   ">
                    <figure className="mt-12">
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
                    {!allowPost && id == '' && (
                        <div className="flex mb-6 items-center ">
                            <Link legacyBehavior href="/feeds">
                                <a className="cursor-pointer">
                                    <svg
                                        width="22"
                                        height="16"
                                        viewBox="0 0 22 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M8.07 2L2 8.07L8.07 14.14M19.8999 8.07001H3.06995"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                            </Link>
                            <p className="text-2xl font-Proxima-Bold text-white pl-6">
                                #{searchValue}
                                {id}
                            </p>
                        </div>
                    )}
                    {feeds &&
                        feeds?.map((data: any, k: number) => {
                            let feed = data?.feed;

                            return feed?.type === 'video' || feed?.type === 'image' || feed?.type === 'text' ? (
                                <div className="w-full   border-[#2B2B35] rounded-3xl border-2 mb-4" key={k}>
                                    <div className="w-full flex flex-row justify-between items-center  p-5">
                                        <Link legacyBehavior
                                            href={
                                                // feed?.user?._id == user?.userId
                                                //     ? `/profile/me`
                                                //     :
                                                `/profile/${feed?.user?.userName}`
                                            }>
                                            <a className="flex gap-5 items-center ">
                                                <figure className="w-14 h-14 rounded-full relative  UerProfileImage flex items-center justify-center ">
                                                    {feed?.user?.avatar ? (
                                                        <ImageComponent
                                                            className="rounded-full "
                                                            src={feed?.user?.avatar}
                                                            alt=""
                                                            objectFit="cover"
                                                            layout="fill"
                                                            // height={56}
                                                            // width={56}
                                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                        />
                                                    ) : (
                                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                            {feed?.user?.firstName?.charAt(0).toUpperCase()}
                                                        </p>
                                                    )}
                                                </figure>
                                                <div className="flex     items-center  ">
                                                    <div className="     ">
                                                        <div
                                                            className={`flex  ${
                                                                feed?.postedOn && id !== feed?.postedOn?.userName
                                                                    ? 'xs:block'
                                                                    : ''
                                                            }      `}>
                                                            <div className="">
                                                                <div className="flex items-center xs:items-start">
                                                                    <div className="flex item-center xs:flex-col ">
                                                                        <div className=" flex items-center gap-1.5 ">
                                                                            <h2 className="text-white  text-base  leading-none mt-[2px] lg:max-w-full sm:max-w-[170px] hover:border-b border-white     truncate mr-2">
                                                                                {feed?.user?.firstName}{' '}
                                                                                {feed?.user?.lastName}
                                                                            </h2>
                                                                            {feed?.user?.isVerfied && (
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
                                                                        <div
                                                                            className={`  flex      ${
                                                                                feed?.postedOn &&
                                                                                id !== feed?.postedOn?.userName
                                                                                    ? ' xs:-ml-2   xs:-mt-0'
                                                                                    : '-mt-1.5'
                                                                            } `}>
                                                                            {feed?.postedOn &&
                                                                                id !== feed?.postedOn?.userName && (
                                                                                    <div className="flex       ">
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

                                                                                        <Link legacyBehavior
                                                                                            href={
                                                                                                // feed?.postedOn?._id ==
                                                                                                // user?.userId
                                                                                                //     ? `/profile/me`
                                                                                                //     :
                                                                                                `/profile/${feed?.postedOn?.userName}`
                                                                                            }>
                                                                                            <a>
                                                                                                {
                                                                                                    feed?.postedOn
                                                                                                        ?.firstName
                                                                                                }{' '}
                                                                                                {
                                                                                                    feed?.postedOn
                                                                                                        ?.lastName
                                                                                                }
                                                                                            </a>
                                                                                        </Link>
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[#727279]    text-[14px] ml-1.5   font-Proxima-Regular">
                                                                        {moment(feed?.createdAt).fromNow()}
                                                                    </span>
                                                                </div>

                                                                <p className="text-[14px] mt-1.5          max-w-[170px] lg:max-w-auto   truncate">
                                                                    @{feed?.user?.userName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                        {/* {user && user.userId && ( */}
                                        <div className="flex justify-end mt-4 sm:mt-0 items-center xs:-ml-2     ">
                                            {feed?.user?._id !== user?.userId ? (
                                                !checkblocked(feed?.user, user?.userId) && (
                                                    <>
                                                        <span className="xs:hidden  ">
                                                            {router.pathname === '/feeds' && (
                                                                <Follow
                                                                    userModule={true}
                                                                    otherUser={feed?.user}
                                                                    followers={followers}
                                                                    setFollowers={setFollowers}
                                                                    setConfirm={setConfirm}
                                                                />
                                                            )}
                                                        </span>
                                                        <div className="">
                                                            <Drodpdown
                                                                id={feed?._id}
                                                                postUserId={feed?.user?._id}
                                                                feed={false}
                                                                page={page}
                                                                setConfirmed={setConfirmed}
                                                                postedOn={feed?.postedOn}
                                                            />
                                                        </div>
                                                    </>
                                                )
                                            ) : (
                                                <Drodpdown
                                                    id={feed?._id}
                                                    postUserId={feed?.user?._id}
                                                    feed={false}
                                                    page={page}
                                                    setConfirmed={setConfirmed}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <span>
                                        <div
                                            className="w-full p-5 border-t-2   border-[#2B2B35] cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                redirect(`/feed/${feed?._id}`);
                                            }}>
                                            <>
                                                <FeedTextLength
                                                    item={feed}
                                                    indexes={feedIndex}
                                                    setIndexes={(e: any) => {
                                                        e.stopPropagation();
                                                        setFeed(k);
                                                    }}
                                                    val={k}
                                                />
                                            </>
                                        </div>
                                        {feed?.type == 'image' ? (
                                            <figure
                                                className=" !flex-shrink-0  bg-[#22222b] AtfeedImage cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    redirect(`/feed/${feed?._id}`);
                                                }}>
                                                {feed?.image && (
                                                    <ImageComponent
                                                        src={feed?.image}
                                                        width={800}
                                                        height={400}
                                                        blurEffect
                                                        quality={60}
                                                        className=""
                                                        objectFit={'contain'}
                                                        alt=""
                                                    />
                                                )}
                                            </figure>
                                        ) : (
                                            <>{feed?.video && <Video src={feed?.video} />}</>
                                        )}
                                        {/* Repost View Start */}
                                        {feed?.feed && (
                                            <div className="px-5 ">
                                                <div className="w-full h-auto  border-[#2B2B35] rounded-3xl border-2 overflow-hidden ">
                                                    <div className="w-full flex flex-row justify-between  items-center p-5  ">
                                                        <div>
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    redirect(
                                                                        // feed?.feed?.user?._id == user?.userId
                                                                        //     ? `/profile/me`
                                                                        //     :
                                                                        `/profile/${feed?.feed?.user?.userName}`
                                                                    );
                                                                }}
                                                                className="cursor-pointer">
                                                                <div className="flex   gap-5 items-center">
                                                                    <figure className="w-14 h-14  rounded-full UerProfileImage  flex items-center justify-center ">
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
                                                                            <p className="w-full h-full bg-themecolor  flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                                {feed?.feed?.user?.firstName
                                                                                    ?.charAt(0)
                                                                                    .toUpperCase()}
                                                                            </p>
                                                                        )}
                                                                    </figure>
                                                                    <div className="flex  ">
                                                                        <div className="flex flex-col ">
                                                                            <div className="flex items-center     ">
                                                                                <h2 className="text-white text-[16px] leading-none  lg:max-w-full max-w-[170px] hover:border-b border-white  truncate mr-2">
                                                                                    {feed?.feed?.user?.firstName}{' '}
                                                                                    {feed?.feed?.user?.lastName}
                                                                                </h2>
                                                                                {feed?.feed?.user?.isVerfied && (
                                                                                    <svg
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
                                                                            <p className="text-[14px]   max-w-[170px] lg:max-w-auto truncate">
                                                                                @{feed?.feed?.user?.userName}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {feed?.feed?.text && (
                                                        <div className="w-full text-white p-5 pt-0">
                                                            <FeedTextLength
                                                                item={feed?.feed}
                                                                indexes={feedIndex}
                                                                setIndexes={(e: any) => {
                                                                    e.stopPropagation();
                                                                    setFeed(k);
                                                                }}
                                                                val={k}
                                                            />
                                                        </div>
                                                    )}
                                                    {feed?.feed?.nft && (
                                                        <div className="w-full text-white p-5 pt-0">
                                                            <p className="text-white">
                                                                {feed?.feed?.nft?.nft?.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {feed?.feed?.type == 'image' || feed?.feed?.type == 'nft' ? (
                                                        <figure className="!flex-shrink-0 bg-[#22222b]  AtfeedImage">
                                                            <Image
                                                                src={
                                                                    feed?.feed?.type == 'image'
                                                                        ? feed?.feed?.image
                                                                        : feed?.feed?.nft?.nft?.fileType == 'glb'
                                                                        ? feed?.feed?.nft?.nft?.preview
                                                                        : feed?.feed?.nft?.nft?.image
                                                                }
                                                                // feed?.feed?.nft?.nft?.image?.replace(
                                                                //       'https://ipfs.infura.io',
                                                                //       'https://bd.infura-ipfs.io'
                                                                //   )
                                                                quality={60}
                                                                width={800}
                                                                height={400}
                                                                className=""
                                                                objectFit="contain"
                                                                alt=""
                                                            />
                                                        </figure>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {feed?.feed?.type == 'video' && (
                                                        <figure className=" !flex-shrink-0 bg-[#22222b]  AtfeedImage">
                                                            <Video src={feed?.feed?.video} />
                                                        </figure>
                                                    )}
                                                    {feed?.feed?.type == 'nft' && (
                                                        <div className="flex items-center  p-5 pb-3 justify-between px-5">
                                                            <div>
                                                                <p>Price</p>
                                                                <FeedPrice listing={feed?.feed?.nft} />
                                                            </div>
                                                            <Button
                                                                className="border border-themecolor gold !py-2.5 !px-9 rounded-[6rem] text-sm"
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/listings/${feed?.feed?.nft?.listingId}`
                                                                    );
                                                                }}>
                                                                View NFT
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* Repost View End */}
                                    </span>
                                    <div className="w-full p-5">
                                        <ul
                                            className={`w-full list-none flex  items-center  gap-x-5  ${
                                                checkblocked(feed?.user, user?.userId) ? 'opacity-50' : ''
                                            }`}>
                                            <LikeComponent feed={feed} feeduser={feed?.user} />
                                            <li
                                                className={`${
                                                    checkblocked(feed?.user, user?.userId) ? '' : 'cursor-pointer'
                                                } flex items-center`}
                                                onClick={() => {
                                                    if (checkblocked(feed?.user, user?.userId)) {
                                                    } else {
                                                        setType('feed');
                                                        setData(feed);
                                                        setPopup(true);
                                                        setState(26);
                                                    }
                                                }}>
                                                <svg
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
                                                <span className="pl-3 text-white text-base whitespace-nowrap  font-Proxima-SemiBold">
                                                    <strong className="text-white whitespace-nowrap">
                                                        {data?.commentLength}
                                                    </strong>{' '}
                                                    {/* Comments */}
                                                </span>
                                            </li>
                                            {(!feed?.postedOn || feed?.postedOn?.userName == id) && (
                                                <li
                                                    className={`${
                                                        checkblocked(feed?.user, user?.userId) ? '' : 'cursor-pointer'
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
                                                    <span className="pl-3 text-white text-base font-Proxima-SemiBold">
                                                        Repost
                                                    </span>
                                                </li>
                                            )}

                                            <li
                                                className={`${
                                                    checkblocked(feed?.user, user?.userId)
                                                        ? 'flex items-center ml-auto'
                                                        : 'cursor-pointer flex items-center ml-auto'
                                                } `}
                                                onClick={() => {
                                                    if (checkblocked(feed?.user, user?.userId)) {
                                                    } else {
                                                        setData(`${process.env.NEXT_PUBLIC_URL}/feed/${feed._id}`);
                                                        setPopup(true);
                                                        setState(31);
                                                    }
                                                }}>
                                                <svg
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
                                                <span className="pl-3">
                                                    <strong className="text-white font-Proxima-SemiBold text-base">
                                                        Share
                                                    </strong>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    {feed?.comments?.length > 0 && !checkblocked(feed?.user, user?.userId) && (
                                        <div
                                            className={`pb-6  ${
                                                feed?.comments?.length > 0
                                                    ? ' border-2 border-x-0 border-b-0  border-[#2B2B35]'
                                                    : ''
                                            }`}>
                                            {!searchValue && feed?.comments?.length > 0 && (
                                                <Comments
                                                    comments={feed?.comments}
                                                    setConfirmed={setConfirmed}
                                                    confirmed={confirmed}
                                                    otherUser={allowPost && id ? id : ''}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {feed?.type == 'nft' && (
                                        <div className="w-full  border-[#2B2B35] rounded-3xl border-2 mb-4 ">
                                            <div className="w-full flex flex-row justify-between  items-center p-5">
                                                <div>
                                                    <Link legacyBehavior
                                                        href={
                                                            // feed?.user?._id == user?.userId
                                                            //     ? `/profile/me`
                                                            //     :
                                                            `/profile/${feed?.user?.userName}`
                                                        }>
                                                        <a
                                                            className="flex   gap-5 items-center"
                                                            // href={
                                                            //   feed?.user?._id == user?.userId
                                                            //     ? `/profile/me`
                                                            //     : `/profile/${feed?.user?.userName}`
                                                            // }
                                                        >
                                                            <figure className="w-14 h-14 rounded-full relative UerProfileImage  flex items-center justify-center ">
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
                                                                    <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                        {feed?.user?.firstName?.charAt(0).toUpperCase()}
                                                                    </p>
                                                                )}
                                                            </figure>
                                                            <div className="flex      ">
                                                                <div className="flex flex-col ">
                                                                    <div className="flex items-center    ">
                                                                        <h2 className="text-white text-[16px] hover:border-b border-white  leading-none lg:max-w-full max-w-[170px]   truncate mr-2">
                                                                            {feed?.user?.firstName}{' '}
                                                                            {feed?.user?.lastName}
                                                                        </h2>
                                                                        {feed?.user?.isVerfied && (
                                                                            <svg
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
                                                                        <span className="text-[#727279] max-w-[100px] sm:max-w-[170px]   whitespace-nowrap   xs:text-xs  pt-[2px]  text-[14px] ml-2 font-Proxima-Regular">
                                                                            {moment(feed?.createdAt).fromNow()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[14px]  max-w-[170px] lg:max-w-auto truncate">
                                                                        @{feed?.user?.userName}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </div>
                                                {/* {user && user.userId && ( */}
                                                <div className="flex justify-en mt-4 sm:mt-0  items-center ">
                                                    {feed?.user?._id !== user?.userId ? (
                                                        // router.pathname === '/feeds' &&
                                                        !checkblocked(feed?.user, user?.userId) && (
                                                            <>
                                                                <span className="xs:hidden ">
                                                                    {router.pathname === '/feeds' && (
                                                                        <Follow
                                                                            userModule={true}
                                                                            otherUser={feed?.user}
                                                                            followers={followers}
                                                                            setFollowers={setFollowers}
                                                                            setConfirm={setConfirm}
                                                                        />
                                                                    )}
                                                                </span>
                                                                <Drodpdown
                                                                    id={feed?._id}
                                                                    postUserId={feed?.user?._id}
                                                                    feed={false}
                                                                    setConfirmed={setConfirmed}
                                                                    postedOn={feed?.postedOn}
                                                                />
                                                            </>
                                                        )
                                                    ) : (
                                                        <Drodpdown
                                                            id={feed?._id}
                                                            postUserId={feed?.user?._id}
                                                            feed={false}
                                                            page={page}
                                                            setConfirmed={setConfirmed}
                                                        />
                                                    )}
                                                </div>
                                                {/* )} */}
                                            </div>
                                            {/* <a href={`/feed/${feed?._id}`}> */}

                                            <figure className=" !flex-shrink-0 bg-[#22222b] AtfeedImage">
                                                {detailContentView(feed?.nft?.nft, {
                                                    height: 400,
                                                    width: 800,
                                                    objectFit: 'contain'
                                                })}
                                            </figure>
                                            {feed?.nft?.nft?.description && (
                                                <div className="w-full text-white p-5 pb-0 border-2 border-x-0 border-b-0 border-[#2B2B35]">
                                                    <p className="text-white">{feed?.nft?.nft?.description}</p>
                                                </div>
                                            )}
                                            {/* </a> */}
                                            <div className="flex items-center p-5 pb-3 justify-between px-5">
                                                <div>
                                                    <p>Price</p>
                                                    <FeedPrice listing={feed?.nft} />
                                                </div>
                                                <Button
                                                    className="border border-themecolor gold !py-2.5 !px-9 rounded-[6rem] text-sm"
                                                    onClick={() => {
                                                        router.push(`/listings/${feed?.nft?.listingId}`);
                                                    }}>
                                                    View NFT
                                                </Button>
                                            </div>
                                            <div className="w-full p-5 border-2 border-x-0 border-b-0 border-[#2B2B35]">
                                                <ul
                                                    className={`w-full list-none flex items-center     gap-x-5  xs:gap-x-2   ${
                                                        checkblocked(feed?.user, user?.userId) ? 'opacity-50' : ''
                                                    }`}>
                                                    <LikeComponent
                                                        setConfirmed={setConfirmed}
                                                        nft={feed?.nft}
                                                        feeduser={feed?.user}
                                                        className="flex items-center"
                                                        showCount={true}
                                                    />
                                                    <li
                                                        className={`${
                                                            checkblocked(feed?.user, user?.userId)
                                                                ? ''
                                                                : 'cursor-pointer'
                                                        } flex items-center `}
                                                        onClick={() => {
                                                            if (!checkblocked(feed?.user, user?.userId)) {
                                                                setType('nft');
                                                                setData(feed?.nft?.nft);
                                                                setPopup(true);
                                                                setState(26);
                                                            }
                                                        }}>
                                                        <svg
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
                                                        <span className="pl-3 text-white cursor-pointer whitespace-nowrap text-[14px]">
                                                            <strong className="text-white">
                                                                {/* {feed?.nft?.nft?.comments?.length} */}
                                                                {data?.commentLength}
                                                            </strong>{' '}
                                                            {/* Comments */}
                                                        </span>
                                                    </li>
                                                    {(!feed?.postedOn || feed?.postedOn?.userName == id) && (
                                                        <li
                                                            className={`${
                                                                checkblocked(feed?.user, user?.userId)
                                                                    ? ''
                                                                    : 'cursor-pointer'
                                                            } flex items-center`}
                                                            onClick={() => {
                                                                if (checkblocked(feed?.user, user?.userId)) {
                                                                } else if (user && user.userId) {
                                                                    setRepost(true);
                                                                    setType('feed');
                                                                    setData(feed);
                                                                    setPopup(true);
                                                                    setState(30);
                                                                } else {
                                                                    setPopup(true);
                                                                    setState(1);
                                                                }
                                                            }}>
                                                            <svg
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
                                                            <span className="pl-3 text-white text-base font-Proxima-SemiBold">
                                                                Repost
                                                            </span>
                                                        </li>
                                                    )}
                                                    <li
                                                        className={`${
                                                            checkblocked(feed?.user, user?.userId)
                                                                ? 'flex items-center'
                                                                : 'cursor-pointer flex items-center ml-auto'
                                                        } `}
                                                        onClick={() => {
                                                            if (!checkblocked(feed?.user, user?.userId)) {
                                                                setData(
                                                                    `${process.env.NEXT_PUBLIC_URL}/listings/${feed.nft.listingId}`
                                                                );
                                                                setPopup(true);
                                                                setState(31);
                                                            }
                                                        }}>
                                                        <svg
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
                                                        <span className="pl-3">
                                                            <strong className="text-white font-Proxima-SemiBold text-base">
                                                                Share
                                                            </strong>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            {feed?.nft?.nft?.comments?.length > 0 &&
                                                !checkblocked(feed?.user, user?.userId) && (
                                                    <div
                                                        className={`pb-6  ${
                                                            feed?.comments?.length > 0
                                                                ? ' border-2 border-x-0 border-b-0 border-[#2B2B35]'
                                                                : ''
                                                        }`}>
                                                        {!searchValue && feed?.nft?.nft?.comments?.length > 0 && (
                                                            <Comments
                                                                comments={feed?.nft?.nft?.comments}
                                                                setConfirmed={setConfirmed}
                                                                confirmed={confirmed}
                                                                otherUser={allowPost && id ? id : ''}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    {feeds && isEmpty(feeds) && (
                        <div>
                            <Notfounditem desc="" buttonText={'Go to Social feed'} buttonLink="/feeds" />
                        </div>
                    )}
                </div>
            )}
            {!loading && userData?.AllFeeds?.metadata?.next && (
                <div className="flex items-center">
                    <Button
                        disabled={loadingMore}
                        isLoading={loadingMore}
                        className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                        onClick={handleLoadMore}>
                        Load More
                    </Button>
                </div>
            )}

            {state && (
                <Popups
                    setConfirmed={setConfirmed}
                    confirmed={confirmed}
                    show={popup}
                    hide={setPopup}
                    setPopup={setPopup}
                    state={state}
                    close={close}
                    setstate={setState}
                    data={data}
                    setNft={setNft}
                    nft={nft}
                    type={type}
                    page={page}
                    setData={setData}
                    setImage={setfeedFile}
                    otherUser={allowPost && id ? id : ''}
                />
            )}
        </div>
    );
};

export default SocialfeedOnlyModule;
