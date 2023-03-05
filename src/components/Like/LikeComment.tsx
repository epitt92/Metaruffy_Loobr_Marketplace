import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useAudio from '../../hooks/useAudio';
import { commentLike } from '../../redux/user/actions';
import { homeService } from '../../services/home.service';
import Popups from '../popup/poups';

interface IProps {
    comment?: any;
    key?: number;

    setConfirmed?: any;
}
export const LikeComment = ({ comment, setConfirmed, key }: IProps) => {
    const [like, setLiked] = useState<boolean>(false);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [count, setCount] = useState<number>(0);
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const [playing, likeAudio] = useAudio('/LOOBR_CLICKING_HEART_BUTTON.mp3');

    useEffect(() => {
        if (user && user?.userId) {
            if (comment?.likes && comment?.likes?.includes(user?.userId)) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
        if (comment?.likes) {
            setCount(comment.likes.length);
        }
    }, [user, comment, key]);

    const likeComment = async () => {
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
            await dispatch(commentLike({ user: user?.userId, comment: comment._id }, setConfirmed));
            // setConfirmed && setConfirmed(true);
        } else {
            setPopup(true);
            setState(1);
        }
    };
    const checkblocked = (otherUser: any) => {
        return otherUser?.blockedBy?.includes(user?.userId) || otherUser?.blockedUser?.includes(user?.userId);
    };
    return (
        <div key={comment?._id}>
            <div>
                <li className="flex items-center ">
                    {like ? (
                        <div className="Atcardhoverholde-bg">
                            <svg
                                onClick={() => !checkblocked(comment.user) && likeComment()}
                                className={` Atcardhoverholde ${checkblocked(comment.user) ? '' : 'cursor-pointer'}`}
                                width="20"
                                height="20"
                                viewBox="0 0 22 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.62 18.71C11.28 18.83 10.72 18.83 10.38 18.71C7.48 17.72 1 13.59 1 6.59C1 3.5 3.49 1 6.56 1C8.38 1 9.99 1.88 11 3.24C12.01 1.88 13.63 1 15.44 1C18.51 1 21 3.5 21 6.59C21 13.59 14.52 17.72 11.62 18.71Z"
                                    fill="#D43300"
                                    stroke="red"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="Atcardhoverholde-bg">
                            <svg
                                onClick={() => !checkblocked(comment.user) && likeComment()}
                                className={` Atcardhoverholde ${checkblocked(comment.user) ? '' : 'cursor-pointer'}`}
                                width="20"
                                height="20"
                                viewBox="0 0 22 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.31 1.5C3.65771 1.5 1.5 3.6607 1.5 6.34C1.5 9.59052 3.00068 12.1949 4.88923 14.1299C6.78683 16.0742 9.02995 17.292 10.3723 17.7502L10.3796 17.7527L10.3796 17.7528C10.4444 17.7756 10.5786 17.8 10.75 17.8C10.9214 17.8 11.0556 17.7756 11.1204 17.7528L11.1277 17.7502L11.1277 17.7502C12.4701 17.292 14.7132 16.0742 16.6108 14.1299C18.4993 12.1949 20 9.59052 20 6.34C20 3.6607 17.8423 1.5 15.19 1.5C13.6278 1.5 12.227 2.25911 11.3521 3.43716C11.2106 3.62768 10.9873 3.74 10.75 3.74C10.5127 3.74 10.2894 3.62768 10.1479 3.43716C9.27255 2.2585 7.88147 1.5 6.31 1.5ZM0 6.34C0 2.8393 2.82229 0 6.31 0C8.04674 0 9.61456 0.705987 10.7503 1.84472C11.8885 0.705639 13.4622 0 15.19 0C18.6777 0 21.5 2.8393 21.5 6.34C21.5 10.0895 19.7607 13.0501 17.6842 15.1776C15.6183 17.2943 13.1735 18.6361 11.6157 19.1686C11.3414 19.2647 11.0273 19.3 10.75 19.3C10.4727 19.3 10.1586 19.2647 9.88434 19.1686C8.32655 18.6361 5.88169 17.2943 3.81577 15.1776C1.73932 13.0501 0 10.0895 0 6.34Z"
                                    fill="#A1A1A5"
                                />
                            </svg>
                        </div>
                    )}
                    <p className="text-white font-Proxima-SemiBold text-[14px] ml-[0.625rem]">
                        {comment?.likes ? count : 0}
                    </p>
                </li>
            </div>

            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};
