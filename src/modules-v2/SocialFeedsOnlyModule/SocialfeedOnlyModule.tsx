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
import Video from './video';
import FeedPrice from '../../components/PriceFeedNft/feedprice';
import { fetchImage, NftContentType } from '../../utils/functions';
import ImageComponent from '../../components/Image/ImageComponent';
import { Transformation } from '@cloudinary/url-gen';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import detailContentView from '../NftDetailModule/detailContentView';
import Verified from '../../components/verified';
import PollComponents from '../../components/poll/PollComponents';
import { poll } from 'ethers/lib/utils';
import SocialFeedSkelton from '../../components/skelton/SocialFeedSkelton';
interface Iprops {
    tag: any;
    allowPost: boolean;
    id?: any;
    setConfirmation?: any;
    confirmation?: any;
    collectionId?: any;
}
moment.updateLocale('en', {
    relativeTime: {
        future: '%s',

        past: '%s ',

        s: 'now',

        ss: '%d s',

        m: '1 m',

        mm: '%d m',

        h: '1 h',

        hh: '%dh',

        d: '1 d',

        dd: '%d d',

        M: '1 mn',

        MM: '%d mn',

        y: '1 y',

        yy: '%d y'
    }
});
const SocialfeedOnlyModule = ({ tag, allowPost, id, setConfirmation, confirmation, collectionId }: Iprops) => {
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
    console.log(collectionId);

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
                    user: id,
                    collectionId: collectionId
                };
                // console.log('For first TIme inside ', id);
                id && dispatch(getFeeds(fileters, '', true));
            } else {
                const fileters = {
                    pageSize: 15,
                    page: page,
                    tag: searchValue,
                    user: id,
                    collectionId: collectionId
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
                page: page,
                collectionId: collectionId
                // tag: searchValue,
            };

            dispatch(getFeeds(fileters, '', true));
        }
        if (router?.asPath?.includes('/profile/')) {
            if (id) {
                // console.log('changed because router profile ', id);
                setLoading(true);
                const fileters = {
                    pageSize: 15,
                    page: page,
                    tag: searchValue,
                    user: id,
                    collectionId: collectionId
                };

                dispatch(getFeeds(fileters, '', true));
            }
        }
        if (router?.asPath?.includes('/collections/')) {
            if (collectionId) {
                // console.log('changed because router profile ', id);
                setLoading(true);
                const fileters = {
                    pageSize: 15,
                    page: page,
                    tag: searchValue,
                    collectionId: collectionId
                };

                dispatch(getFeeds(fileters, '', true));
            }
        }
    }, [router, id, collectionId]);

    useEffect(() => {
        if (router?.asPath?.includes('/profile/') && confirmation) {
            const fileters = {
                pageSize: 15,
                page: page,
                tag: searchValue,
                user: id,
                collectionId: collectionId
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
                page: page,
                collectionId: collectionId
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
                page: 1,
                collectionId: collectionId
            };
            setConfirmation && setConfirmation(true);
            dispatch(getFeeds(fileters, '', false));
            // setConfirmed(false)
        }
    }, [confirmed]);

    //For repost redirection
    useEffect(() => {
        if (repost && router?.asPath?.includes('/profile/')) {
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
        if (array?.includes(e)) {
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
        if (link?.includes('profile')) {
            window.open(link);
        } else {
            // if (link.includes('feed')) {
            router.push(link);
            // }
        }
    };

    const calculatepercentage = (option: any, poll: any) => {
        let t: Number = 0;
        for (const q of poll?.options) {
            t = t + q?.vote?.length;
        }
        return (option?.vote?.length / Number(t)) * 100 ? ((option?.vote?.length / Number(t)) * 100).toFixed(1) : 0;
    };

    const totalvotes = (poll: any) => {
        let t: Number = 0;

        if (!poll || !poll?.options) {
            return t;
        }

        for (const q of poll?.options) {
            t = t + q?.vote?.length;
        }
        return t;
    };
    return (
        <div className="">
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
                        collectionId={collectionId}
                    />
                )}

            {loading &&
                Array(3)
                    .fill('')
                    .map((item, i) => (
                        <div key={i} className="flex items-center mb-6 ">
                            <SocialFeedSkelton />
                        </div>
                    ))}
            {!loading && (
                <div>
                    {!allowPost && id == '' && (
                        <div className="flex items-center mb-6 ">
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
                            <p className="pl-6 text-2xl text-white font-Proxima-Bold">
                                #{searchValue}
                                {id}
                            </p>
                        </div>
                    )}
                    {feeds &&
                        feeds?.map((data: any, k: number) => {
                            let feed = data?.feed;

                            return feed?.type == 'poll' ? (
                                <PollComponents
                                    key={feed?._id}
                                    feedData={data}
                                    setConfirm={setConfirm}
                                    followers={followers}
                                    setFollowers={setFollowers}
                                    page={page}
                                    setConfirmed={setConfirmed}
                                    confirmed={confirmed}
                                    setRepost={setRepost}
                                    searchValue={searchValue}
                                    otherUser={allowPost && id ? id : ''}
                                />
                            ) : feed?.type === 'video' || feed?.type === 'image' || feed?.type === 'text' ? (
                                <div
                                    className="w-full hover:bg-[#1c1c27]  cursor-pointer  border-[#2B2B35] rounded-3xl border-2 mb-4 "
                                    key={feed?._id}>
                                    <div
                                        className="flex flex-row items-center justify-between w-full p-5"
                                        // onClick={(e) => {
                                        //     e.stopPropagation();
                                        //     redirect(`/feed/${feed?._id}`);
                                        // }}
                                    >
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(
                                                    // feed?.user?._id == user?.userId
                                                    //     ? `/profile/me`
                                                    //     :
                                                    `/profile/${feed?.user?.userName}`
                                                );
                                            }}>
                                            <a className="flex items-center gap-5 ">
                                                <figure className="relative flex items-center justify-center rounded-full w-14 h-14 UerProfileImage ">
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
                                                <div className="flex items-center ">
                                                    <div className="">
                                                        <div
                                                            className={`flex items-center    ${
                                                                feed?.postedOn && id !== feed?.postedOn?.userName
                                                                    ? 'xs:block'
                                                                    : ''
                                                            }      `}>
                                                            <div className="">
                                                                <div
                                                                    className={`flex items-center ${
                                                                        feed?.collections?.name ? ' xs:items-start' : ''
                                                                    }  `}>
                                                                    <div className="flex item-center ">
                                                                        <div className="flex items-center ">
                                                                            <h2
                                                                                className={`text-white text-base leading-none     lg:max-w-full ${
                                                                                    feed?.collections?.name
                                                                                        ? 'xs3:max-w-[60px]  xs4:max-w-[50px]'
                                                                                        : ' max-w-[170px] '
                                                                                }   max-w-[170px] border-b border-transparent hover:border-white  truncate mr-2`}
                                                                                title={`${feed?.user?.firstName} ${feed?.user?.lastName}`}>
                                                                                {feed?.user?.firstName}{' '}
                                                                                {feed?.user?.lastName}
                                                                            </h2>
                                                                            {feed?.user?.isVerfied && <Verified />}
                                                                        </div>
                                                                        <div
                                                                            className={`  flex  items-center     ${
                                                                                feed?.postedOn &&
                                                                                id !== feed?.postedOn?.userName
                                                                                    ? ' xs:-ml-2   xs:-mt-0'
                                                                                    : '-mt-1.5'
                                                                            } `}>
                                                                            {feed?.postedOn &&
                                                                                id !== feed?.postedOn?.userName && (
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

                                                                                        <div
                                                                                            className="cursor-pointer xs:w-[8rem]  xs4:w-[6rem]  hover:border-b hover:border-themecolor  truncate"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                router.push(
                                                                                                    // feed?.postedOn
                                                                                                    //     ?._id ==
                                                                                                    //     user?.userId
                                                                                                    //     ? `/profile/me`
                                                                                                    //     :
                                                                                                    `/profile/${feed?.postedOn?.userName}`
                                                                                                );
                                                                                            }}
                                                                                            // href={
                                                                                            //     feed?.postedOn?._id ==
                                                                                            //     user?.userId
                                                                                            //         ? `/profile/me`
                                                                                            //         : `/profile/${feed?.postedOn?.userName}`
                                                                                            // }
                                                                                            title={`${feed?.postedOn?.firstName} ${feed?.postedOn?.lastName}`}>
                                                                                            {feed?.postedOn?.firstName}
                                                                                            {feed?.postedOn?.lastName}
                                                                                            {/* <a> */}

                                                                                            {/* </a> */}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                        </div>

                                                                        <div
                                                                            className={`  flex  items-center     ${
                                                                                feed?.collections
                                                                                    ? ' xs:-ml-2   xs:-mt-0'
                                                                                    : '-mt-1.5'
                                                                            } `}>
                                                                            {feed?.collections &&
                                                                                (router?.asPath?.includes('/feeds') ||
                                                                                    router?.asPath?.includes(
                                                                                        'profile'
                                                                                    )) && (
                                                                                    <div className="flex items-center ">
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
                                                                                            className="cursor-pointer flex items-center justify-center xs:justify-start xs:w-[8rem]  xs3:w-[3rem]         gap-1"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                feed?.collections
                                                                                                    ?._id &&
                                                                                                    router.push(
                                                                                                        feed
                                                                                                            ?.collections
                                                                                                            ?.isExternal
                                                                                                            ? `/collections/address/${feed?.collections?.address}?chain=${feed?.collections?.chain}`
                                                                                                            : `/collections/${feed?.collections?._id}`
                                                                                                    );
                                                                                            }}
                                                                                            // href={
                                                                                            //     feed?.postedOn?._id ==
                                                                                            //     user?.userId
                                                                                            //         ? `/profile/me`
                                                                                            //         : `/profile/${feed?.postedOn?.userName}`
                                                                                            // }
                                                                                        >
                                                                                            <span
                                                                                                className="truncate xs2:text-base hover:border-b   hover:border-themecolor max-w-[10rem]  sm:max-w-[14rem]  xs:w-full  "
                                                                                                title={`${feed?.collections?.name}`}>
                                                                                                {
                                                                                                    feed?.collections
                                                                                                        ?.name
                                                                                                }{' '}
                                                                                                collection
                                                                                            </span>
                                                                                        </div>
                                                                                        {feed?.collections
                                                                                            ?.isVerfied && <Verified />}
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[#727279]     text-[14px] ml-3     whitespace-nowrap  font-Proxima-Regular">
                                                                        {moment(feed?.createdAt).fromNow()}
                                                                    </span>
                                                                </div>

                                                                <p className="text-[14px]        max-w-[170px] lg:max-w-auto   truncate">
                                                                    @{feed?.user?.userName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        {/* {user && user.userId && ( */}
                                        <div className="flex items-center justify-end mt-12 -ml-6 sm:mt-0 xs:mt-0 sm:ml-0 xs:ml-0 xs4:-ml-2 ">
                                            {feed?.user?._id !== user?.userId ? (
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
                                                className="!flex-shrink-0  bg-[#22222b] flex justify-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPopup(true);
                                                    setData(feed?.image);
                                                    setState(83);
                                                    // redirect(`/feed/${feed?._id}`);
                                                }}>
                                                {feed?.image && (
                                                    <ImageComponent
                                                        src={feed?.image}
                                                        width={375}
                                                        height={375}
                                                        blurEffect
                                                        quality={50}
                                                        objectFit="cover"
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
                                                    <div
                                                        className="flex flex-row items-center justify-between w-full p-5 "
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            redirect(`/feed/${feed?._id}`);
                                                        }}>
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
                                                                <div className="flex items-center gap-5">
                                                                    <figure className="flex items-center justify-center rounded-full w-14 h-14 UerProfileImage ">
                                                                        {feed?.feed?.user?.avatar ? (
                                                                            <ImageComponent
                                                                                className="rounded-full"
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
                                                                        <div className="flex flex-col ">
                                                                            <div className="flex items-center ">
                                                                                <h2
                                                                                    className="text-white text-base leading-none  lg:max-w-full  max-w-[170px]  border-b border-transparent hover:border-white   truncate mr-2"
                                                                                    title={`${feed?.user?.firstName} ${feed?.user?.lastName}`}>
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
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {feed?.feed?.text && (
                                                        <div
                                                            className="w-full p-5 pt-0 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                redirect(`/feed/${feed?._id}`);
                                                            }}>
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
                                                        <div
                                                            className="w-full p-5 pt-0 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                redirect(`/feed/${feed?._id}`);
                                                            }}>
                                                            <p className="text-white">
                                                                {feed?.feed?.nft?.nft?.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {feed?.feed?.type == 'poll' && (
                                                        <div
                                                            className="w-full p-5 pt-0 text-white"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                redirect(`/feed/${feed?.feed?._id}`);
                                                            }}>
                                                            <div
                                                                className=" rounded-[12px] p-6 "
                                                                // onClick={(e) => {
                                                                //     e.stopPropagation();
                                                                //     router.push(`/feed/${feed?._id}`);
                                                                // }}
                                                            >
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
                                                                                    {calculatepercentage(
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
                                                            className="!flex-shrink-0 bg-[#22222b]  flex justify-center"
                                                            onClick={() => {
                                                                if (feed?.feed?.type == 'image') {
                                                                    setPopup(true);
                                                                    setData(feed?.feed?.image);
                                                                    setState(83);
                                                                }
                                                            }}>
                                                            <ImageComponent
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
                                                                quality={50}
                                                                width={375}
                                                                height={375}
                                                                className=""
                                                                objectFit="cover"
                                                                alt=""
                                                            />
                                                        </figure>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {feed?.feed?.type == 'video' && (
                                                        <figure className=" !flex-shrink-0 bg-[#22222b] AtfeedImage">
                                                            <Video src={feed?.feed?.video} />
                                                        </figure>
                                                    )}
                                                    {feed?.feed?.type == 'nft' && (
                                                        <div
                                                            className="flex items-center justify-between p-5 px-5 pb-3"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                redirect(`/feed/${feed?._id}`);
                                                            }}>
                                                            <div>
                                                                <p>Price</p>
                                                                <FeedPrice listing={feed?.feed?.nft} />
                                                            </div>

                                                            {feed?.feed?.nft?.isActive && (
                                                                <Button
                                                                    className="border border-themecolor gold !py-2.5 !px-9 rounded-[6rem] text-sm"
                                                                    onClick={(e: any) => {
                                                                        e.stopPropagation();
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
                                                <div className="Atcardhovercomment-bg">
                                                    <svg
                                                        className="Atcardhovercomment"
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
                                                <span className="pl-3 text-base text-white whitespace-nowrap font-Proxima-SemiBold">
                                                    <strong className="text-white whitespace-nowrap">
                                                        {data?.commentLength}
                                                    </strong>{' '}
                                                    {/* Comments */}
                                                </span>
                                            </li>
                                            {(!feed?.postedOn || feed?.postedOn?.userName == id) &&
                                                !feed?.collections &&
                                                feed?.type !== 'poll' && (
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
                                                        <span className="pl-[2px] text-white text-base font-Proxima-SemiBold">
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
                                                    <strong className="text-base text-white font-Proxima-SemiBold">
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
                                        <div
                                            className="w-full   border-[#2B2B35] rounded-3xl border-2 mb-4 hover:bg-[#1c1c27]  cursor-pointer"
                                            key={feed?._id}>
                                            <div
                                                className="flex flex-row items-center justify-between w-full p-5"
                                                // onClick={(e: any) => {
                                                //     e.stopPropagation();
                                                //     feed?.nft?.isActive &&
                                                //         router.push(`/listings/${feed?.nft?.listingId}`);
                                                // }}
                                            >
                                                {/* <divx> */}
                                                <span
                                                    className="flex gap-5 items-cente"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(
                                                            // feed?.user?._id == user?.userId
                                                            //     ? `/profile/me`
                                                            //     :
                                                            `/profile/${feed?.user?.userName}`
                                                        );
                                                    }}
                                                    // }}
                                                    // href={
                                                    //     feed?.user?._id == user?.userId
                                                    //         ? `/profile/me`
                                                    //         : `/profile/${feed?.user?.userName}`
                                                    // }
                                                >
                                                    {/* <a
                                                            className="flex items-center gap-5"
                                                            // href={
                                                            //   feed?.user?._id == user?.userId
                                                            //     ? `/profile/me`
                                                            //     : `/profile/${feed?.user?.userName}`
                                                            // }
                                                        > */}
                                                    <figure className="relative flex items-center justify-center overflow-hidden rounded-full w-14 h-14 UerProfileImage ">
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
                                                    <div className="flex ">
                                                        <div className="flex flex-col ">
                                                            <div className="flex items-center ">
                                                                <h2
                                                                    className={`text-white text-base leading-none      lg:max-w-full ${
                                                                        feed?.collections?.name
                                                                            ? 'xs3:max-w-[60px]  xs4:max-w-[50px]'
                                                                            : ' max-w-[170px] '
                                                                    }   max-w-[170px] border-b border-transparent hover:border-white  truncate mr-2`}
                                                                    title={`${feed?.user?.firstName} ${feed?.user?.lastName}`}>
                                                                    {feed?.user?.firstName} {feed?.user?.lastName}
                                                                </h2>
                                                                {feed?.user?.isVerfied && <Verified />}

                                                                {feed?.collections &&
                                                                    router?.asPath?.includes('/feeds') && (
                                                                        <div className="flex items-center gap-1 ">
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

                                                                            <a
                                                                                className="cursor-pointer flex items-center xs:w-1/2  xs3:w-[3rem]   flex-shrink-0   justify-center gap-1 "
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    feed?.collections?._id &&
                                                                                        router.push(
                                                                                            feed?.collections
                                                                                                ?.isExternal
                                                                                                ? `/collections/address/${feed?.collections?.address}?chain=${feed?.collections?.chain}`
                                                                                                : `/collections/${feed?.collections?._id}`
                                                                                        );
                                                                                }}
                                                                                // href={
                                                                                //     feed?.postedOn?._id ==
                                                                                //     user?.userId
                                                                                //         ? `/profile/me`
                                                                                //         : `/profile/${feed?.postedOn?.userName}`
                                                                                // }
                                                                            >
                                                                                <span
                                                                                    className=" truncate xs2:text-base hover:border-b hover:border-themecolor max-w-[10rem]   sm:max-w-[14rem]"
                                                                                    title={`${feed?.collections?.name} collection`}>
                                                                                    {feed?.collections?.name} collection
                                                                                </span>
                                                                            </a>
                                                                            {feed?.collections?.isVerfied && (
                                                                                <Verified />
                                                                            )}

                                                                            <span className="text-[#727279] max-w-[100px] sm:max-w-[170px]   xs:block hidden  whitespace-nowrap     pt-[2px]  text-[14px] ml-2 font-Proxima-Regular">
                                                                                {moment(feed?.createdAt).fromNow()}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                <span className="text-[#727279] max-w-[100px] sm:max-w-[170px]  xs:hidden block   whitespace-nowrap     pt-[2px]  text-[14px] ml-2 font-Proxima-Regular">
                                                                    {moment(feed?.createdAt).fromNow()}
                                                                </span>
                                                            </div>
                                                            <p className="text-[14px]  max-w-[170px ] lg:max-w-auto truncate">
                                                                @{feed?.user?.userName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* </a> */}
                                                </span>
                                                {/* </div> */}
                                                {/* {user && user.userId && ( */}
                                                <div className="flex items-center justify-end mt-12 -ml-6 sm:mt-0 xs:mt-0 sm:ml-0 xs:ml-0 xs4:-ml-2 xs4:justify-center ">
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

                                            <figure
                                                className=""
                                                onClick={(e: any) => {
                                                    e.stopPropagation();
                                                    feed?.nft?.isActive &&
                                                        router.push(`/listings/${feed?.nft?.listingId}`);
                                                }}>
                                                {detailContentView(feed?.nft?.nft, {
                                                    height: 375,
                                                    width: 375,
                                                    objectFit: 'cover',
                                                    feed: true
                                                })}
                                            </figure>
                                            {feed?.nft?.nft?.description && (
                                                <div className="w-full text-white p-5 pb-0 border-2 border-x-0 border-b-0 border-[#2B2B35]">
                                                    <p className="text-white">{feed?.nft?.nft?.description}</p>
                                                </div>
                                            )}
                                            {/* </a> */}
                                            <div
                                                className="flex items-center justify-between p-5 px-5 pb-3"
                                                onClick={(e: any) => {
                                                    e.stopPropagation();
                                                    feed?.nft?.isActive &&
                                                        router.push(`/listings/${feed?.nft?.listingId}`);
                                                }}>
                                                <div>
                                                    <p>Price</p>
                                                    <FeedPrice listing={feed?.nft} />
                                                </div>
                                                {feed?.nft?.isActive && (
                                                    <Button
                                                        className="border border-themecolor gold !py-2.5 !px-9 rounded-[6rem] text-sm"
                                                        onClick={(e: any) => {
                                                            e.stopPropagation();
                                                            router.push(`/listings/${feed?.nft?.listingId}`);
                                                        }}>
                                                        View NFT
                                                    </Button>
                                                )}
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
                                                        <div className="Atcardhovercomment-bg">
                                                            <svg
                                                                className="Atcardhovercomment"
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
                                                        <span className="pl-[2px] text-white cursor-pointer whitespace-nowrap text-[14px]">
                                                            <strong className="text-white">
                                                                {/* {feed?.nft?.nft?.comments?.length} */}
                                                                {data?.commentLength}
                                                            </strong>{' '}
                                                            {/* Comments */}
                                                        </span>
                                                    </li>
                                                    {(!feed?.postedOn || feed?.postedOn?.userName == id) &&
                                                        !feed?.collections && (
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
                                                                <span className=" pl-[2px] text-white text-base font-Proxima-SemiBold">
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
                                                            <strong className="text-base text-white font-Proxima-SemiBold">
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
                            <Notfounditem
                                desc="Create a new post and interact with your followers"
                                title="No feeds created"
                            />
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
