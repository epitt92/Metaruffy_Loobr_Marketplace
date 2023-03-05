import React, { useEffect, useState } from 'react';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import Drodpdown from '../Dropdown/Dropdown';
import { Follow } from '../Follow/follow';
import ImageComponent from '../Image/ImageComponent';
import Input from '../input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { pollSelection } from '../../redux/user/actions';
import Verified from '../verified';
import moment from 'moment';
import { LikeComponent } from '../Like/LikeComponent';
import Poups from '../popup/poups';
import Comments from '../CommentsWithReply/comments';
interface Iprops {
    feedData: any;
    followers?: any;
    setConfirm?: Function;
    setFollowers?: Function;
    page?: any;
    setConfirmed?: Function;
    key: any;
    confirmed?: any;
    setRepost: Function;
    searchValue: any;
    otherUser: any;
}
const PollComponents = ({
    feedData,
    setConfirm,
    followers,
    setFollowers,
    page,
    setConfirmed,
    key,
    confirmed,
    setRepost,
    searchValue,
    otherUser
}: Iprops) => {
    const [popup, setPopup] = useState(false);
    const [close, setClose] = useState('');
    const [state, setState] = useState(-1);
    const [data, setData] = useState<any>();
    const [type, setType] = useState<string>('');
    const router = useRouter();
    const dispatch = useDispatch();
    const [feed, setFeed] = useState<any>(feedData?.feed);
    const user = useSelector((state: any) => state.auth.user);
    const [toatalVotes, setTotalvotes] = useState<Number>(0);
    const [blocked, setBlocked] = useState<Boolean>(false);
    const selectpollloading = useSelector((state: any) => state.user.selectpollloading);
    const votePoll = (optionId: any) => {
        // console.log(new Date(feed?.poll?.expirayDate) < new Date());
        if (selectpollloading || new Date(feed?.poll?.expirayDate) < new Date() || blocked) {
            return;
        }
        if (user && user?.userId) {
            let data = {
                option: optionId,
                poll: feed?.poll
            };
            dispatch(pollSelection(data));
        }
    };
    useEffect(() => {
        if (feedData?.feed) {
            setFeed(feedData?.feed);
        }
        if (feedData?.feed?.poll) {
            let t = 0;
            for (const q of feedData?.feed?.poll?.options) {
                t = t + q?.vote?.length;
            }
            setTotalvotes(t);
        }
        if (user && user?.userId && feedData?.feed?.user?._id != user?.userId) {
            console.log('testing something');
            if (
                feedData?.feed?.user?.blockedBy?.includes(user?.userId) ||
                feedData?.feed?.user?.blockedUser?.includes(user?.userId)
            ) {
                setBlocked(true);
            } else {
                setBlocked(false);
            }
        }
    }, [feedData?.feed, feedData]);

    var date1 = new Date();
    var date2 = new Date(feed?.poll?.expirayDate);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var Difference_In_Hours = Difference_In_Time / (1000 * 3600);
    const calculatepercentage = (option: any) => {
        return (option?.vote?.length / Number(toatalVotes)) * 100
            ? ((option?.vote?.length / Number(toatalVotes)) * 100).toFixed(1)
            : 0;
    };

    const PollIcon =
        'flex items-center justify-center w-10 h-10 text-xl rounded-full transition duration-300 cursor-pointer';

    return (
        <div className="" key={key}>
            <div className="w-full   border-[#2B2B35] rounded-3xl border-2 mb-4 hover:bg-[#1c1c27]   ">
                <div className="flex flex-row items-center justify-between w-full p-5 cursor-pointer">
                    <div
                        className="flex items-center gap-2"
                        onClick={(e: any) => {
                            e.stopPropagation();
                            router.push(
                                // feed?.user?._id == user?.userId ? `/profile/me` :
                                `/profile/${feed?.user?.userName}`
                            );
                        }}>
                        <figure className="flex items-center justify-center flex-shrink-0 rounded-full w-14 h-14 UerProfileImage ">
                            {feed?.user?.avatar ? (
                                <ImageComponent
                                    className="rounded-full "
                                    src={feed?.user?.avatar}
                                    alt=""
                                    height={56}
                                    width={56}
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
                                <div className={`flex items-center`}>
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
                                                        {feed?.user?.firstName} {feed?.user?.lastName}
                                                    </h2>
                                                    {feed?.user?.isVerfied && <Verified />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[#727279]     text-[14px] ml-3     whitespace-nowrap  font-Proxima-Regular">
                                        {moment(feed?.createdAt)?.fromNow()}
                                    </span>
                                </div>

                                <p className="text-[14px]        max-w-[170px] lg:max-w-auto   truncate">
                                    @{feed?.user?.userName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {!blocked && user && user?.userId && (
                        <div className="flex items-center justify-end mt-12 -ml-6 sm:mt-0 xs:mt-0 sm:ml-0 xs:ml-0 xs4:-ml-2 ">
                            <span className="xs:hidden ">
                                <Follow
                                    userModule={true}
                                    otherUser={feed?.user}
                                    followers={followers}
                                    setFollowers={setFollowers}
                                    setConfirm={setConfirm}
                                />
                            </span>

                            <Drodpdown
                                id={feed?._id}
                                postUserId={feed?.user?._id}
                                feed={false}
                                page={page}
                                setConfirmed={setConfirmed}
                            />
                        </div>
                    )}
                </div>
                <div className="w-full text-white  pb-0 border-2 border-x-0 border-b-0 border-[#2B2B35]"></div>
                <div className="p-6">
                    <div
                        className=" rounded-[12px] p-6 "
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/feed/${feed?._id}`);
                        }}>
                        <h4 className="text-lg text-white cursor-pointer">{feed?.poll?.question}</h4>
                        {feed?.poll?.options?.map((option: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className={`mt-6 relative ${
                                        selectpollloading ||
                                        option?.vote?.includes(user?.userId) ||
                                        new Date(feed?.poll?.expirayDate) < new Date() ||
                                        blocked ||
                                        !user
                                            ? ''
                                            : 'cursor-pointer'
                                    } `}
                                    onClick={(e: any) => {
                                        e.stopPropagation();
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
                                            option?.vote?.includes(user?.userId) ? '!border-themecolor' : ''
                                        }`}>
                                        {option?.option}
                                    </div>
                                    <span className="absolute text-base text-white -translate-y-1/2 right-3 top-1/2">
                                        {calculatepercentage(option)} %
                                    </span>
                                </div>
                            );
                        })}
                        <p className={`mt-6  `}>
                            <span
                                className={`${user && user?.userId ? ' hover:text-themecolor cursor-pointer' : ''} `}
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
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6 w-full ">
                            <div className="flex items-center gap-3">
                                <LikeComponent feed={feed} feeduser={feed?.user} />
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className={`${PollIcon} icon-message hover:bg-[#f1c94a33] hover:text-[#f1c94a] `}
                                    onClick={() => {
                                        if (blocked) {
                                        } else {
                                            setType('feed');
                                            setData(feed);
                                            setPopup(true);
                                            setState(26);
                                        }
                                    }}></div>
                                <strong className="text-white whitespace-nowrap">{feedData?.commentLength}</strong>
                            </div>
                            <div
                                className={`${blocked ? '' : 'cursor-pointer'} flex items-center`}
                                onClick={() => {
                                    if (blocked) {
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
                                <span className="pl-[2px] text-white text-base font-Proxima-SemiBold">Repost</span>
                            </div>
                            <div
                                className="flex items-center gap-3 !ml-auto cursor-pointer"
                                onClick={() => {
                                    if (blocked) {
                                    } else {
                                        setData(`${process.env.NEXT_PUBLIC_URL}/feed/${feed._id}`);
                                        setPopup(true);
                                        setState(31);
                                    }
                                }}>
                                <div
                                    className={`${PollIcon} icon-share hover:bg-[#00ba7c1a] hover:text-[#02885b] `}></div>
                                <strong className="text-white whitespace-nowrap">Share</strong>
                            </div>
                        </div>
                    </div>
                </div>
                {feed?.comments?.length > 0 && !blocked && (
                    <div
                        className={`pb-6  ${
                            feed?.comments?.length > 0 ? ' border-2 border-x-0 border-b-0  border-[#2B2B35]' : ''
                        }`}>
                        {!searchValue && feed?.comments?.length > 0 && (
                            <Comments
                                comments={feed?.comments}
                                setConfirmed={setConfirmed}
                                confirmed={confirmed}
                                otherUser={otherUser}
                            />
                        )}
                    </div>
                )}
            </div>
            {state && (
                <Poups
                    setConfirmed={setConfirmed}
                    confirmed={confirmed}
                    show={popup}
                    hide={setPopup}
                    setPopup={setPopup}
                    state={state}
                    close={close}
                    setstate={setState}
                    data={data}
                    type={type}
                    page={page}
                    setData={setData}
                />
            )}
        </div>
    );
};

export default PollComponents;
