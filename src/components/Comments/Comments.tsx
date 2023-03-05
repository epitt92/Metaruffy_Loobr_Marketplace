import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import Image from 'next/image';

import { Commentsdata } from '../../data/Commentsdata';
import Input from '../input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { postComment, postReply } from '../../redux/user/actions';
import moment from 'moment';
import Popups from '../popup/poups';
import { isEmpty } from 'validate.js';
import NoComment from '../NoCommentFound/nocomment';
import { homeService } from '../../services/home.service';
import { toast } from 'react-toastify';
import { getComments } from '../../redux/comments/actions';
import Loader from '../loader/Loader';
import useAudio from '../../hooks/useAudio';
import { FEED_COMMENT_LIKE_CREATED } from '../../constants/socketEvents';
import { _io } from '../../services/socket.service';
import dynamic from 'next/dynamic';
import MentionedInput from '../mentionedInput/mentionedInput';
import { userService } from '../../services/user.service';
import TextLength from '../TextLength/textLength';
import { LikeComment } from '../Like/LikeComment';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import CommentReply from '../CommentsWithReply/comments';
import Button from '../Button/Button';
interface Iprops {
    feed: any;
    setPopup: any;
    setstate: Function;
    type: any;
    setConfirmed?: Function;
    page?: number;
    confirmed?: boolean;
    otherUser?: any;
}

const Comments = ({ feed, setstate, type, setConfirmed, page, confirmed, otherUser }: Iprops) => {
    const user = useSelector((state: any) => state.auth.user);
    const loading = useSelector((state: any) => state.user.loadingcomment);
    const [comment, setComment] = useState<string>('');
    const [loadinglocal, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const [emoji, setEmoji] = useState<any>(null);
    // const [focus, setFocus] = useState(false);
    const [state, setState] = useState(-1);

    const [confirmedinside, setConfirmedinside] = useState<boolean>(false);

    const [mentionedUsers, setMentionedUsers] = useState<any>([]);

    const [playing, toggle] = useAudio('/LOOBR_POST_COMMENT_OR_REPLY.mp3');
    const comments = useSelector((state: any) => state.comments.comments);
    const commentsLoading = useSelector((state: any) => state.comments.commentsLoading);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        focusInput.current?.focus();
    }, []);

    useEffect(() => {
        feed && dispatch(getComments(feed?.nft?._id || feed?._id));
    }, []);

    useEffect(() => {
        if (confirmed) {
            setComment('');

            setLoading(false);
            feed && dispatch(getComments(feed?.nft?._id || feed?._id, false));
        }
    }, [confirmed]);
    useEffect(() => {
        if (confirmedinside) {
            setConfirmedinside(false);
            feed && dispatch(getComments(feed?.nft?._id || feed?._id, false));
        }
    }, [confirmedinside]);
    // useEffect(() => {
    //   setComments([...commentss]);
    // }, [commentss]);

    useEffect(() => {
        listenSocket();
    }, []);
    useEffect(() => {
        // setFocus(true);
        setTimeout(() => {
            if (focusInput.current) focusInput.current.focus();
            // setFocus(true);
        }, 1000);
    }, [feed]);
    const listenSocket = () => {
        _io.on(`${FEED_COMMENT_LIKE_CREATED}`, (newdata: any) => {
            if (user && user.userId != newdata.user) {
                if (newdata.user) {
                    setConfirmedinside(true);
                }
            }
        });
    };
    const postaComment = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (comment.trim() == '') {
            return;
        } else if (loading || loadinglocal) {
            return;
        } else {
            if (user && user.userId) {
                let newText: any = comment;
                newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
                newText = newText.split('###__').join('<a target="_blank" href=/profile/');
                newText = newText.split('^^__').join('>');
                newText = newText.split('###^^^').join(' </a>');
                // let text = newText.trim();
                newText = newText.trim();
                let regix = /#(\S*)/g;
                let alltags: any = [];
                let text = newText;
                if (!otherUser) {
                    text = newText.replace(regix, function (url: any) {
                        let newurl = url.split('#');
                        if (!alltags.includes(newurl[1])) {
                            alltags.push(newurl[1]);
                        }
                        return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
                    });
                }
                toggle();
                if (type == 'nft') {
                    try {
                        setLoading(true);
                        const result = await homeService.commentMarketPlace(feed._id, {
                            text: text,
                            mentioned: mentionedUsers,
                            tag: alltags
                        });
                        // toast.success("Comment posted successfully");
                        setConfirmed && setConfirmed(true);
                        feed?.setCount && feed.setCount(feed?.count + 1);
                        setLoading(false);
                        // setstate();
                    } catch (error) {
                        // toast.error("Error in posting comment");
                        setstate();
                    }
                } else {
                    // const fileters = {
                    //   pageSizeOther: page * 15,
                    //   pageSize: 15,
                    //   page: page,
                    // };
                    dispatch(
                        postComment(
                            {
                                // user: user.userId,
                                feed: feed._id,
                                text: text,
                                mentioned: mentionedUsers,
                                tags: alltags
                            },
                            () => {},
                            // setstate,
                            setConfirmed
                        )
                    );
                }
            } else {
                setPopup(true);
                setState(1);
            }
        }
    };
    // const onEmojiClick = (emoji: any) => {
    //     let a = comment.concat(emoji);
    //     setComment(a);
    // };
    useEffect(() => {
        if (emoji) {
            let a = comment.concat(emoji);
            setEmoji(null);
            setComment(a);
        }
    }, [emoji]);
    const focusInput: any = useRef();
    const emojo = useMemo(() => <EmojiPicker setEmoji={setEmoji} />, []);
    return (
        <div className="w-[37.5rem] xs:w-[25rem]  rounded-2xl">
            <h3 className="border-b border-[#43434C] py-6 px-8 text-white">Comments</h3>

            <div className="overflow-y-auto max-h-[30rem] relative scrolHide mb-[1.25rem]">
                {commentsLoading ? (
                    <Loader />
                ) : isEmpty(comments) ? (
                    <>
                        <NoComment />
                        {!user && (
                            <div className="flex justify-center items-center sm:w-auto mt-6">
                                <Button
                                    className="p-8 pb-2 xl:pt-3.5 xl:pb-3.5 px-7 rounded-full md:px-11 gold"
                                    onClick={() => {
                                        setPopup(true);
                                        setState(1);
                                    }}>
                                    Login
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <CommentReply
                        comments={comments}
                        setConfirmed={setConfirmed}
                        confirmed={confirmed}
                        otherUser={otherUser}
                    />
                )}
            </div>
            {user && user.userId && (
                <form onSubmit={postaComment} key="commenta">
                    <div className=" relative px-8 mb-10">
                        <MentionedInput
                            autoFocuss={true}
                            styles="!rounded-full w-full  pt-[12px] pb-[12px] pl-[20px] pr-[100px] border border-[#43434C] text-base Atmentioninput"
                            singleLine={true}
                            placeHolder={'Add a comment...'}
                            value={comment}
                            setMentionedUsers={setMentionedUsers}
                            setValues={(value: any) => setComment(value)}
                            aboveref={focusInput}
                            //
                        />
                        <div className="flex items-center absolute right-[40px] top-1/2 ">
                            {/* <EmojiPicker setEmoji={onEmojiClick} /> */}
                            {emojo}
                        </div>

                        <p
                            className={`absolute top-[50%] translate-y-[-50%] w-[40px] h-[40px] bg-themecolor flex items-center justify-center rounded-full text-themecolor right-10 ${
                                !loading && !loadinglocal ? 'cursor-pointer' : ''
                            }`}
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
                        </p>
                    </div>
                </form>
            )}
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};

export default Comments;
