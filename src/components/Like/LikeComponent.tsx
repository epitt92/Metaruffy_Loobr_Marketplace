import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useAudio from '../../hooks/useAudio';
import Feed from '../../pages/feed/[id]';
import { postLike } from '../../redux/user/actions';
import { homeService } from '../../services/home.service';
import Popups from '../popup/poups';

interface IProps {
    feed?: any;
    nft?: any;
    className?: string;
    showCount?: boolean;
    setConfirmed?: Function;
    feeduser?: any;
    like?: any;
    size: any;
}
export const LikeComponent = ({ nft, className, showCount, feed, setConfirmed, feeduser, size }: IProps) => {
    const [like, setLiked] = useState<boolean>(false);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [count, setCount] = useState<number>(0);
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const [playing, likeAudio] = useAudio('/LOOBR_CLICKING_HEART_BUTTON.mp3');
    useEffect(() => {
        if (user && user?.userId) {
            if (nft?.nft?.like && nft?.nft?.like?.includes(user?.userId)) {
                setLiked(true);
            } else if (feed?.likes && feed?.likes?.includes(user?.userId)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
        if (nft?.nft?.like) {
            setCount(nft?.nft?.like.length);
        } else if (feed?.likes) {
            setCount(feed.likes.length);
        }
    }, [user, feed, nft]);

    const likenft = async () => {
        try {
            if (user && user?.userId) {
                if (!like) {
                    user?.settings?.alerts?.like && likeAudio();
                    setCount((prev: any) => prev + 1);
                } else {
                    if (count !== 0) {
                        setCount((prev: any) => prev - 1);
                    }
                }
                setLiked(!like);
                await homeService.likeMarketPlace(nft?.nft?._id);
                setConfirmed && setConfirmed(true);
            } else {
                setPopup(true);
                setState(1);
            }
        } catch (error) {
            // console.log(error);
        }
    };
    const likeFeed = async () => {
        if (user && user?.userId) {
            if (!like) {
                user?.settings?.alerts?.like && likeAudio();
                setCount(count + 1);
            } else {
                if (count !== 0) {
                    setCount(count - 1);
                }
            }
            setLiked(!like);
            await dispatch(postLike({ user: user?.userId, feed: feed._id }));
            setConfirmed && setConfirmed(true);
        } else {
            setPopup(true);
            setState(1);
        }
    };
    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };
    return (
        <div>
            {nft ? (
                <div className={`flex items-center ${size ? 'Atcardhoverholde-bg2' : ''} `}>
                    <div
                        className={className || ' '}
                        onClick={() => {
                            if (checkblocked(feeduser, user?.userId)) {
                            } else {
                                likenft();
                            }
                        }}>
                        {like ? (
                            <div className={` ${size ? '' : 'Atcardhoverholde-bg  '}  `}>
                                <svg
                                    className={` Atcardhoverholde  ${
                                        size ? 'h-[16px] w-[16px]' : 'h-[1.25rem] w-[1.25rem]'
                                    }  ${checkblocked(feeduser, user?.userId) ? '' : 'cursor-pointer '}`}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.5161 4.68874C19.2058 3.9669 18.7584 3.31277 18.1988 2.76298C17.6389 2.21154 16.9787 1.77332 16.2542 1.47215C15.5029 1.15862 14.6971 0.998135 13.8835 1.00002C12.7422 1.00002 11.6286 1.314 10.6609 1.90708C10.4294 2.04895 10.2095 2.20478 10.0011 2.37457C9.79279 2.20478 9.57286 2.04895 9.34135 1.90708C8.37364 1.314 7.26009 1.00002 6.11876 1.00002C5.2969 1.00002 4.50052 1.15817 3.74811 1.47215C3.02118 1.77451 2.36601 2.20943 1.80345 2.76298C1.24319 3.31215 0.795642 3.96643 0.486167 4.68874C0.164371 5.43998 0 6.23773 0 7.05874C0 7.83323 0.157426 8.64028 0.469961 9.46129C0.731565 10.1474 1.10661 10.8591 1.58583 11.5778C2.34518 12.7151 3.38928 13.9013 4.68572 15.1037C6.83412 17.0969 8.96167 18.4738 9.05196 18.5296L9.60064 18.8831C9.84372 19.039 10.1563 19.039 10.3993 18.8831L10.948 18.5296C11.0383 18.4715 13.1635 17.0969 15.3143 15.1037C16.6107 13.9013 17.6548 12.7151 18.4141 11.5778C18.8934 10.8591 19.2707 10.1474 19.53 9.46129C19.8425 8.64028 20 7.83323 20 7.05874C20.0023 6.23773 19.8379 5.43998 19.5161 4.68874V4.68874Z"
                                        fill="#D60000"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <div className={` ${size ? '' : 'Atcardhoverholde-bg'}  `}>
                                <svg
                                    className={`   ${
                                        size ? 'h-[16px] w-[16px]' : 'h-[1.25rem] w-[1.25rem]'
                                    } Atcardhoverholde  ${
                                        checkblocked(feeduser, user?.userId) ? '' : 'cursor-pointer'
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.5161 4.68874C19.2058 3.9669 18.7584 3.31277 18.1988 2.76298C17.6389 2.21154 16.9787 1.77332 16.2542 1.47215C15.5029 1.15862 14.6971 0.998135 13.8835 1.00002C12.7422 1.00002 11.6286 1.314 10.6609 1.90708C10.4294 2.04895 10.2095 2.20478 10.0011 2.37457C9.79279 2.20478 9.57286 2.04895 9.34135 1.90708C8.37364 1.314 7.26009 1.00002 6.11876 1.00002C5.2969 1.00002 4.50052 1.15817 3.74811 1.47215C3.02118 1.77451 2.36601 2.20943 1.80345 2.76298C1.24319 3.31215 0.795642 3.96643 0.486167 4.68874C0.164371 5.43998 0 6.23773 0 7.05874C0 7.83323 0.157426 8.64028 0.469961 9.46129C0.731565 10.1474 1.10661 10.8591 1.58583 11.5778C2.34518 12.7151 3.38928 13.9013 4.68572 15.1037C6.83412 17.0969 8.96167 18.4738 9.05196 18.5296L9.60064 18.8831C9.84372 19.039 10.1563 19.039 10.3993 18.8831L10.948 18.5296C11.0383 18.4715 13.1635 17.0969 15.3143 15.1037C16.6107 13.9013 17.6548 12.7151 18.4141 11.5778C18.8934 10.8591 19.2707 10.1474 19.53 9.46129C19.8425 8.64028 20 7.83323 20 7.05874C20.0023 6.23773 19.8379 5.43998 19.5161 4.68874V4.68874ZM10.0011 17.0434C10.0011 17.0434 1.75946 11.7383 1.75946 7.05874C1.75946 4.68874 3.71107 2.76763 6.11876 2.76763C7.81108 2.76763 9.27884 3.71656 10.0011 5.10274C10.7235 3.71656 12.1912 2.76763 13.8835 2.76763C16.2912 2.76763 18.2428 4.68874 18.2428 7.05874C18.2428 11.7383 10.0011 17.0434 10.0011 17.0434Z"
                                        fill="#A1A1A5"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    {showCount && (
                        <p className={`text-white  text-count font-Proxima-SemiBold text-[12px] ${size ? 'hov' : 'ml-[2px]'}  `}>
                            {count}
                        </p>
                    )}
                </div>
            ) : (
                <div>
                    <li className={`flex  items-center ${size ? 'Atcardhoverholde-bg2' : ''} `}>
                        {like ? (
                            <div className={` ${size ? '' : 'Atcardhoverholde-bg'}  `}>
                                <svg
                                    onClick={() => {
                                        if (checkblocked(feeduser, user?.userId)) {
                                        } else {
                                            likeFeed();
                                        }
                                    }}
                                    className={`Atcardhoverholde ${
                                        size ? 'h-[16px] w-[16px]' : 'h-[1.25rem] w-[1.25rem]'
                                    } ${checkblocked(feeduser, user?.userId) ? '' : 'cursor-pointer'}`}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.5161 4.68874C19.2058 3.9669 18.7584 3.31277 18.1988 2.76298C17.6389 2.21154 16.9787 1.77332 16.2542 1.47215C15.5029 1.15862 14.6971 0.998135 13.8835 1.00002C12.7422 1.00002 11.6286 1.314 10.6609 1.90708C10.4294 2.04895 10.2095 2.20478 10.0011 2.37457C9.79279 2.20478 9.57286 2.04895 9.34135 1.90708C8.37364 1.314 7.26009 1.00002 6.11876 1.00002C5.2969 1.00002 4.50052 1.15817 3.74811 1.47215C3.02118 1.77451 2.36601 2.20943 1.80345 2.76298C1.24319 3.31215 0.795642 3.96643 0.486167 4.68874C0.164371 5.43998 0 6.23773 0 7.05874C0 7.83323 0.157426 8.64028 0.469961 9.46129C0.731565 10.1474 1.10661 10.8591 1.58583 11.5778C2.34518 12.7151 3.38928 13.9013 4.68572 15.1037C6.83412 17.0969 8.96167 18.4738 9.05196 18.5296L9.60064 18.8831C9.84372 19.039 10.1563 19.039 10.3993 18.8831L10.948 18.5296C11.0383 18.4715 13.1635 17.0969 15.3143 15.1037C16.6107 13.9013 17.6548 12.7151 18.4141 11.5778C18.8934 10.8591 19.2707 10.1474 19.53 9.46129C19.8425 8.64028 20 7.83323 20 7.05874C20.0023 6.23773 19.8379 5.43998 19.5161 4.68874V4.68874Z"
                                        fill="#D60000"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <div className={` ${size ? '' : 'Atcardhoverholde-bg'}  `}>
                                <svg
                                    onClick={() => {
                                        if (checkblocked(feeduser, user?.userId)) {
                                        } else {
                                            likeFeed();
                                        }
                                    }}
                                    className={` Atcardhoverholde ${
                                        size ? 'h-[16px] w-[16px]' : 'h-[1.25rem] w-[1.25rem]'
                                    } ${checkblocked(feeduser, user?.userId) ? '' : 'cursor-pointer'}`}
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.5161 4.68874C19.2058 3.9669 18.7584 3.31277 18.1988 2.76298C17.6389 2.21154 16.9787 1.77332 16.2542 1.47215C15.5029 1.15862 14.6971 0.998135 13.8835 1.00002C12.7422 1.00002 11.6286 1.314 10.6609 1.90708C10.4294 2.04895 10.2095 2.20478 10.0011 2.37457C9.79279 2.20478 9.57286 2.04895 9.34135 1.90708C8.37364 1.314 7.26009 1.00002 6.11876 1.00002C5.2969 1.00002 4.50052 1.15817 3.74811 1.47215C3.02118 1.77451 2.36601 2.20943 1.80345 2.76298C1.24319 3.31215 0.795642 3.96643 0.486167 4.68874C0.164371 5.43998 0 6.23773 0 7.05874C0 7.83323 0.157426 8.64028 0.469961 9.46129C0.731565 10.1474 1.10661 10.8591 1.58583 11.5778C2.34518 12.7151 3.38928 13.9013 4.68572 15.1037C6.83412 17.0969 8.96167 18.4738 9.05196 18.5296L9.60064 18.8831C9.84372 19.039 10.1563 19.039 10.3993 18.8831L10.948 18.5296C11.0383 18.4715 13.1635 17.0969 15.3143 15.1037C16.6107 13.9013 17.6548 12.7151 18.4141 11.5778C18.8934 10.8591 19.2707 10.1474 19.53 9.46129C19.8425 8.64028 20 7.83323 20 7.05874C20.0023 6.23773 19.8379 5.43998 19.5161 4.68874V4.68874ZM10.0011 17.0434C10.0011 17.0434 1.75946 11.7383 1.75946 7.05874C1.75946 4.68874 3.71107 2.76763 6.11876 2.76763C7.81108 2.76763 9.27884 3.71656 10.0011 5.10274C10.7235 3.71656 12.1912 2.76763 13.8835 2.76763C16.2912 2.76763 18.2428 4.68874 18.2428 7.05874C18.2428 11.7383 10.0011 17.0434 10.0011 17.0434Z"
                                        fill="#A1A1A5"
                                    />
                                </svg>
                            </div>
                        )}
                        <p className={` text-count text-white font-Proxima-SemiBold text-[12px] ${size ? '' : 'ml-[2px]'}  `}>
                            {count}
                        </p>
                    </li>
                </div>
            )}
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};
