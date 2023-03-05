import Image from 'next/image';
import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import TextLength from '../TextLength/textLength';
import MentionedInput from '../mentionedInput/mentionedInput';
import { MentionReplyReply } from './MentionnedInputReplyReply';
import { MentionReply } from './MentionedInputReply';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import { LikeComment } from '../Like/LikeComment';
import useAudio from '../../hooks/useAudio';
import { postReply } from '../../redux/user/actions';
import Drodpdown from '../Dropdown/DropDownComment';
import Link from 'next/link';
import Poups from '../popup/poups';
import Verified from '../verified';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
interface Iprops {
    comments: Array<any>;
    setConfirmed?: Function;
    confirmed?: boolean;
    otherUser?: any;
}

const Comments = ({ comments, confirmed, setConfirmed, otherUser }: Iprops) => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [reply, setReply] = useState<string>('');
    const [reply1, setReply1] = useState<string>('');
    const [index, setIndex] = useState<number>();
    const [index1, setIndex1] = useState<any>();
    const [replyshow, Setreplyshow] = useState<boolean>(false);
    const [replyofreplyshow, Setreplyofreplyshow] = useState<boolean>(false);
    const [commentIndex, setCommentIndex] = useState<Array<number>>([]);
    const [replyIndex, setReplyindex] = useState<Array<number>>([]);
    const [replyofreplyIndex, setReplyofreplyindex] = useState<Array<number>>([]);
    const [playing, toggle] = useAudio('/LOOBR_POST_COMMENT_OR_REPLY.mp3');
    const [mentionedUsers, setMentionedUsers] = useState<any>([]);
    const [confirmedReply, setConfirmedReply] = useState<boolean>(false);
    const [showreplies, setShowReplies] = useState<Array<any>>([]);
    const [newReply, setNewreply] = useState<any>('');
    const [newReply1, setNewreply1] = useState<any>('');
    const [emojireply1, setEmojiReply1] = useState<any>(null);
    const [emojireply, setEmojiReply] = useState<any>(null);
    const [showrepliesofreplies, setShowRepliesofreplies] = useState<Array<any>>([]);
    const dispatch = useDispatch();
    let focusInput: any = useRef();
    useEffect(() => {
        if (confirmedReply) {
            if (newReply != '') {
                if (!showreplies?.includes(newReply)) {
                    let a = showreplies;
                    a.push(newReply);
                    setShowReplies([...a]);
                }
                setNewreply('');
            }
            if (newReply1 != '') {
                if (!showrepliesofreplies?.includes(newReply1)) {
                    let a = showrepliesofreplies;
                    a.push(newReply1);

                    setShowRepliesofreplies([...a]);
                }
                setNewreply1('');
            }
            setReply1('');
            setIndex(0);
            setIndex1(0);
            setReply('');
            Setreplyshow(false);
            Setreplyofreplyshow(false);
            setConfirmedReply(false);
        }
    }, [confirmed]);
    let showReply = (index: number) => {
        if (replyshow == true) {
            setReply('');
        }
        setIndex(index);
        Setreplyshow(!replyshow);
    };
    let showReplyofReply = (index: any) => {
        if (replyofreplyshow == true) {
            setReply1('');
            setIndex1(null);
        } else {
            setIndex1(index);
        }
        Setreplyofreplyshow(!replyofreplyshow);
    };

    const postaReply = async (event: React.ChangeEvent<HTMLFormElement>, commentId: string) => {
        event.preventDefault();
        // console.log(commentId);
        if (confirmedReply) {
            return;
        }
        if (reply.trim() == '') {
            return;
        } else {
            if (user && user?.userId) {
                setConfirmedReply(true);
                let newText: any = reply;
                newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
                newText = newText.split('###__').join('<a  target="_blank" href=/profile/');
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
                        if (!alltags?.includes(newurl[1])) {
                            alltags.push(newurl[1]);
                        }
                        return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
                    });
                }
                toggle();
                dispatch(
                    postReply(
                        {
                            // user: user.userId,
                            comment: commentId,
                            text: text,
                            mentioned: mentionedUsers,
                            tags: alltags
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
    const postaReply1 = async (event: React.ChangeEvent<HTMLFormElement>, commentId: string) => {
        event.preventDefault();
        // console.log(commentId);
        if (confirmedReply) {
            return;
        }
        if (reply1.trim() == '') {
            return;
        } else {
            if (user && user?.userId) {
                setConfirmedReply(true);
                let newText: any = reply1;
                newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
                newText = newText.split('###__').join('<a target="_blank" href=/profile/');
                newText = newText.split('^^__').join('>');
                newText = newText.split('###^^^').join(' </a>');
                newText = newText.trim();
                let regix = /#(\S*)/g;
                let alltags: any = [];
                let text = newText;
                if (!otherUser) {
                    text = newText.replace(regix, function (url: any) {
                        let newurl = url.split('#');
                        if (!alltags?.includes(newurl[1])) {
                            alltags.push(newurl[1]);
                        }
                        return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
                    });
                }
                toggle();
                dispatch(
                    postReply(
                        {
                            // user: user.userId,
                            comment: commentId,
                            text: text,
                            mentioned: mentionedUsers,
                            tags: alltags
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
    const setCommentt = (e: number) => {
        // console.log(e);
        let array = [...commentIndex];
        if (array?.includes(e)) {
            let index = array.indexOf(e);
            if (index > -1) {
                array.splice(index, 1);
                setCommentIndex([...array]);
            }
        } else {
            array.push(e);
            setCommentIndex([...array]);
        }
    };
    const onEmojiClickreply = (emoji: any) => {
        let a = reply.concat(emoji);
        setReply(a);
    };
    const onEmojiClickreply1 = (emoji: any) => {
        let a = reply1.concat(emoji);
        setReply1(a);
    };
    useEffect(() => {
        if (emojireply1) {
            let a = reply1.concat(emojireply1);
            setEmojiReply1(null);
            setReply1(a);
        }
    }, [emojireply1]);
    useEffect(() => {
        if (emojireply) {
            let a = reply.concat(emojireply);
            setEmojiReply(null);
            setReply(a);
        }
    }, [emojireply]);
    const user = useSelector((state: any) => state.auth.user);
    const setReplyy = (e: number) => {
        let a = replyIndex;
        let array = replyIndex;
        if (array?.includes(e)) {
            let index = array.indexOf(e);
            if (index > -1) {
                array.splice(index, 1);
                setReplyindex([...array]);
            }
        } else {
            array.push(e);
            setReplyindex([...array]);
        }
    };
    const setReplyofreply = (e: any) => {
        let a = replyofreplyIndex;
        let array = replyofreplyIndex;
        if (array?.includes(e)) {
            let index = array.indexOf(e);
            if (index > -1) {
                array.splice(index, 1);
                setReplyofreplyindex([...array]);
            }
        } else {
            array.push(e);
            setReplyofreplyindex([...array]);
        }
    };
    const sethiding = (val: any) => {
        if (showreplies?.includes(val)) {
            let a = showreplies;
            let index = a.indexOf(val);
            if (index > -1) {
                a.splice(index, 1);
                setShowReplies([...a]);
            }
        } else {
            let a = showreplies;
            a.push(val);
            setShowReplies([...a]);
        }
    };
    const sethidingreplies = (val: any) => {
        if (showrepliesofreplies?.includes(val)) {
            let a = showrepliesofreplies;
            let index = a.indexOf(val);
            if (index > -1) {
                a.splice(index, 1);

                setShowRepliesofreplies([...a]);
            }
        } else {
            let a = showrepliesofreplies;
            a.push(val);

            setShowRepliesofreplies([...a]);
        }
    };
    const checkblocked = (otherUser: any) => {
        return otherUser?.blockedBy?.includes(user?.userId) || otherUser?.blockedUser?.includes(user?.userId);
    };
    // useEffect(() => {
    //     // setFocus(true);
    //     console.log('Cahnged', focusInput);
    //     if (replyofreplyshow) {
    //         setTimeout(() => {
    //             console.log('Cahnged with the flow');
    //             console.log(focusInput);
    //             if (focusInput.current) focusInput.current.focus();
    //             // setFocus(true);
    //         }, 1000);
    //     }
    // }, [replyofreplyshow, index1]);

    // useLayoutEffect(() => {
    //     focusInput.current?.focus();
    // }, []);
    const emojo = useMemo(
        () => (
            <EmojiPicker
                outerClassName="!right-[65px] Atemoji z-[2]"
                className={index1 == 0 || index1 == 1 ? 'bottom-auto top-[100%]' : ''}
                setEmoji={setEmojiReply1}
            />
        ),
        [index1]
    );
    const emojo1 = useMemo(
        () => (
            <EmojiPicker
                outerClassName="!right-[65px] Atemoji z-[2]"
                className={index == 0 || index == 1 ? 'bottom-auto top-[100%] ' : ''}
                setEmoji={setEmojiReply}
            />
        ),
        [index]
    );
    return (
        <div className="w-full ">
            {comments?.map((item: any, val: number) => (
                <>
                    <div
                        className={`flex  items-start px-4 sm:px-8 pt-6 relative   justify-center ${
                            item?.replies?.length > 0 ? 'Atlines' : ''
                        }`}
                        key={item?._id}>
                        <Link
                            legacyBehavior
                            href={
                                // item?.user?._id == user?.userId ? `/profile/me` :
                                `/profile/${item?.user?.userName} `
                            }>
                            <a className="">
                                <figure className="w-[32px]  h-[32px] relative overflow-hidden  !rounded-full flex items-center justify-center UerProfileImage !overflow-hidden">
                                    {item?.user?.avatar ? (
                                        <ImageComponent
                                            // width={32}
                                            // height={32}
                                            objectFit="cover"
                                            layout="fill"
                                            className="rounded-full"
                                            src={item?.user?.avatar}
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                            alt=""
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor  flex items-center justify-center rounded-full text-black1 text-lg ">
                                            {item?.user?.firstName.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                </figure>
                            </a>
                        </Link>
                        <div className="w-full relative pl-4 pr-6   ">
                            <div className="flex">
                                <div className="sm:flex w-full mt-0.5 ">
                                    <Link
                                        legacyBehavior
                                        href={
                                            // item?.user?._id == user?.userId
                                            //     ? `/profile/me`
                                            //     :
                                            `/profile/${item?.user?.userName} `
                                        }>
                                        <a className="">
                                            <h4 className="text-base max-w-[60%] flex   cursor-pointer  sm:max-w-[160px]  md:max-w-full 2xl:max-w-full flex-shrink-0 truncate  text-white mr-1">
                                                {item?.user?.firstName} {item?.user?.lastName}
                                                <span className="ml-2">{item?.user?.isVerfied && <Verified />}</span>
                                            </h4>
                                        </a>
                                    </Link>
                                    {/* {item?.user?.isVerfied && <Verified />} */}

                                    <div className="flex mt-0.5 ">
                                        <p className="text-sm sm:ml-3       max-w-[170px] lg:max-w-full truncate">
                                            @{item?.user?.userName}
                                        </p>
                                        <span className="text-[#727279]     text-sm ml-3">
                                            {moment(item?.createdAt).fromNow()}
                                        </span>
                                    </div>
                                </div>
                                {user && user?.userId ? (
                                    <Drodpdown comment={item} setConfirmed={setConfirmed} />
                                ) : (
                                    <div className="p-5"></div>
                                )}
                            </div>

                            <div className={`sm:flex   mt-2 sm:-mt-2  gap-4 justify-between `}>
                                <TextLength
                                    item={item}
                                    indexes={commentIndex}
                                    setIndexes={(e: any) => {
                                        setCommentt(e);
                                    }}
                                    val={val}
                                />
                                <div
                                    className={`flex items-center   gap-x-4 mt-3 sm:mt-0 ${
                                        checkblocked(item?.user) ? 'opacity-50' : ''
                                    }`}>
                                    <LikeComment comment={item} setConfirmed={setConfirmed} />
                                    <button
                                        type="button"
                                        className={`inline-flex items-center gap-2.5 text-white text-[14px] ${
                                            checkblocked(item?.user) ? 'cursor-default' : ''
                                        }`}
                                        onClick={() => {
                                            if (user && user?.userId) {
                                                !checkblocked(item?.user) && showReply(val);
                                            } else {
                                                setState(1);
                                                setPopup(true);
                                            }
                                        }}>
                                        <div className="reply-color-bg">
                                            <svg
                                                className="reply-color"
                                                width="17"
                                                height="14"
                                                viewBox="0 0 17 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3.31016 6.49999L6.27316 9.46299C6.40735 9.59682 6.48591 9.77648 6.49303 9.96587C6.50015 10.1552 6.43531 10.3403 6.31155 10.4838C6.18778 10.6274 6.01427 10.7187 5.8259 10.7395C5.63753 10.7603 5.44826 10.709 5.29616 10.596L5.21216 10.523L0.970158 6.28099C0.842878 6.15395 0.765486 5.98539 0.752086 5.80606C0.738686 5.62672 0.790171 5.44854 0.897158 5.30399L0.970158 5.21999L5.21216 0.976992C5.3456 0.841082 5.52576 0.761034 5.71606 0.753094C5.90636 0.745154 6.09256 0.809917 6.23686 0.934239C6.38116 1.05856 6.47275 1.23313 6.49305 1.42251C6.51335 1.6119 6.46083 1.80191 6.34616 1.95399L6.27316 2.03799L3.31016 4.99999H9.00016C11.013 5.00002 12.9468 5.78314 14.3925 7.18365C15.8382 8.58417 16.6823 10.4922 16.7462 12.504L16.7502 12.751C16.7502 12.9499 16.6711 13.1407 16.5305 13.2813C16.3898 13.422 16.1991 13.501 16.0002 13.501C15.8012 13.501 15.6105 13.422 15.4698 13.2813C15.3292 13.1407 15.2502 12.9499 15.2502 12.751C15.2502 11.1332 14.6229 9.57836 13.5002 8.41351C12.3775 7.24865 10.8469 6.56453 9.23016 6.50499L9.00016 6.49999H3.31016L6.27316 9.46299L3.31016 6.49999Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <span className=" ">{item?.replies?.length}</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end mt-1 ">
                                {showreplies?.includes('' + val) ? (
                                    <p
                                        className={`${checkblocked(item?.user) ? '' : 'cursor-pointer'} `}
                                        onClick={() => {
                                            !checkblocked(item?.user) && sethiding('' + val);
                                        }}>
                                        Hide replies
                                    </p>
                                ) : (
                                    item?.replies?.length > 0 && (
                                        <p
                                            className={`${checkblocked(item?.user) ? '' : 'cursor-pointer'} `}
                                            onClick={() => {
                                                !checkblocked(item?.user) && sethiding('' + val);
                                            }}>
                                            Show replies
                                        </p>
                                    )
                                )}
                            </div>

                            {/* Reply Show Area Start*/}
                            {showreplies?.includes('' + val) &&
                                item?.replies?.map((reply: any, i: number) => {
                                    return (
                                        <div className="" key={i}>
                                            <div className=" flex  Atsubcomment pt-3 pb-3 w-full  pl-0 -z-10">
                                                <Link
                                                    legacyBehavior
                                                    href={
                                                        // reply?.user?._id == user?.userId
                                                        //     ? `/profile/me`
                                                        //     :
                                                        `/profile/${reply?.user?.userName}`
                                                    }>
                                                    <a className="">
                                                        <figure className="w-[26px] h-[26px] relative !rounded-full flex items-center justify-center UerProfileImage !overflow-hidden">
                                                            {reply?.user?.avatar ? (
                                                                <ImageComponent
                                                                    // width={26}
                                                                    // height={26}
                                                                    className="rounded-full"
                                                                    objectFit="cover"
                                                                    layout="fill"
                                                                    src={reply?.user?.avatar}
                                                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-lg ">
                                                                    {reply?.user?.firstName.charAt(0).toUpperCase()}
                                                                </p>
                                                            )}
                                                        </figure>
                                                    </a>
                                                </Link>
                                                <div className="w-full relative ml-4 ">
                                                    <div className="flex ">
                                                        <div className="sm:flex w-full">
                                                            <Link
                                                                legacyBehavior
                                                                href={
                                                                    // reply?.user?._id == user?.userId
                                                                    //     ? `/profile/me`
                                                                    //     :
                                                                    `/profile/${reply?.user?.userName}`
                                                                }>
                                                                <a className="">
                                                                    <h4 className="text-base  flex  sm:max-w-[160px]  cursor-pointer  md:max-w-full xl:max-w-[160px] 2xl:max-w-full flex-shrink-0 truncate  text-white mr-1">
                                                                        {reply?.user?.firstName} {reply?.user?.lastName}
                                                                        <span className="ml-2">
                                                                            {reply?.user?.isVerfied && <Verified />}
                                                                        </span>
                                                                    </h4>
                                                                </a>
                                                            </Link>
                                                            <div className="flex mt-0.5">
                                                                <p className="text-sm sm:ml-3 min-w-[auto] md:max-w-full max-w-[75px] truncate">
                                                                    @{reply?.user?.userName}
                                                                </p>
                                                                <span className="text-[#727279] text-sm ml-3">
                                                                    {moment(reply.createdAt).fromNow()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {user && user?.userId && (
                                                            <Drodpdown comment={reply} setConfirmed={setConfirmed} />
                                                        )}
                                                    </div>
                                                    <div className="sm:flex mt-2 sm:mt-0 gap-4  justify-between">
                                                        <TextLength
                                                            item={reply}
                                                            indexes={replyIndex}
                                                            setIndexes={() => setReplyy(i)}
                                                            val={'' + val + i}
                                                        />
                                                        <div
                                                            className={`flex items-center   gap-x-4 mt-3 sm:mt-0 ${
                                                                checkblocked(reply?.user) ? 'opacity-50' : ''
                                                            }`}>
                                                            <LikeComment comment={reply} setConfirmed={setConfirmed} />
                                                            <button
                                                                type="button"
                                                                className={`inline-flex items-center gap-2.5 text-white text-[14px]  ${
                                                                    checkblocked(reply?.user) ? 'cursor-default' : ''
                                                                }`}
                                                                onClick={() => {
                                                                    if (user && user?.userId) {
                                                                        !checkblocked(reply?.user) &&
                                                                            showReplyofReply('' + i + val);
                                                                    } else {
                                                                        setState(1);
                                                                        setPopup(true);
                                                                    }
                                                                }}>
                                                                <div className="reply-color-bg">
                                                                    <svg
                                                                        className="reply-color"
                                                                        width="17"
                                                                        height="14"
                                                                        viewBox="0 0 17 14"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M3.31016 6.49999L6.27316 9.46299C6.40735 9.59682 6.48591 9.77648 6.49303 9.96587C6.50015 10.1552 6.43531 10.3403 6.31155 10.4838C6.18778 10.6274 6.01427 10.7187 5.8259 10.7395C5.63753 10.7603 5.44826 10.709 5.29616 10.596L5.21216 10.523L0.970158 6.28099C0.842878 6.15395 0.765486 5.98539 0.752086 5.80606C0.738686 5.62672 0.790171 5.44854 0.897158 5.30399L0.970158 5.21999L5.21216 0.976992C5.3456 0.841082 5.52576 0.761034 5.71606 0.753094C5.90636 0.745154 6.09256 0.809917 6.23686 0.934239C6.38116 1.05856 6.47275 1.23313 6.49305 1.42251C6.51335 1.6119 6.46083 1.80191 6.34616 1.95399L6.27316 2.03799L3.31016 4.99999H9.00016C11.013 5.00002 12.9468 5.78314 14.3925 7.18365C15.8382 8.58417 16.6823 10.4922 16.7462 12.504L16.7502 12.751C16.7502 12.9499 16.6711 13.1407 16.5305 13.2813C16.3898 13.422 16.1991 13.501 16.0002 13.501C15.8012 13.501 15.6105 13.422 15.4698 13.2813C15.3292 13.1407 15.2502 12.9499 15.2502 12.751C15.2502 11.1332 14.6229 9.57836 13.5002 8.41351C12.3775 7.24865 10.8469 6.56453 9.23016 6.50499L9.00016 6.49999H3.31016L6.27316 9.46299L3.31016 6.49999Z"
                                                                            fill="white"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <span>{reply?.replies?.length}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <span>
                                                        <div className="flex justify-end mt-1">
                                                            {showrepliesofreplies?.includes('' + i + val) ? (
                                                                <p
                                                                    className={`${
                                                                        checkblocked(reply?.user)
                                                                            ? ''
                                                                            : 'cursor-pointer'
                                                                    } ml-auto`}
                                                                    onClick={() => {
                                                                        !checkblocked(reply?.user) &&
                                                                            sethidingreplies('' + i + val);
                                                                    }}>
                                                                    Hide replies
                                                                </p>
                                                            ) : (
                                                                reply?.replies?.length > 0 && (
                                                                    <p
                                                                        className={`${
                                                                            checkblocked(reply?.user)
                                                                                ? ''
                                                                                : 'cursor-pointer'
                                                                        } ml-auto`}
                                                                        onClick={() => {
                                                                            !checkblocked(reply?.user) &&
                                                                                sethidingreplies('' + i + val);
                                                                        }}>
                                                                        Show replies
                                                                    </p>
                                                                )
                                                            )}
                                                        </div>
                                                        <div
                                                            className={`mb-[10px] relative ${
                                                                replyofreplyshow == true && '' + i + val == index1
                                                                    ? 'block'
                                                                    : 'hidden'
                                                            }`}>
                                                            <form
                                                                onSubmit={(e: any) => {
                                                                    postaReply1(e, reply?._id);
                                                                    setNewreply1('' + i + val);
                                                                }}
                                                                key="reply">
                                                                <div className="relative at-mentioninput mt-[18px]  ">
                                                                    {/* <MentionedInput
                                                                        autoFocuss={true}
                                                                        // styles={""}
                                                                        styles="!rounded-full py-3 pl-[20px]    pr-[100px] border border-[#43434C] text-base Atmentioninput"
                                                                        singleLine={true}
                                                                        placeHolder={'Add reply'}
                                                                        value={reply1}
                                                                        setMentionedUsers={setMentionedUsers}
                                                                        setValues={(value: any) => setReply1(value)}
                                                                        aboveref={focusInput}
                                                                    /> */}
                                                                    <MentionReplyReply
                                                                        setMentionedUsers={setMentionedUsers}
                                                                        reply1={reply1}
                                                                        setReply1={setReply1}
                                                                        replyofreplyshow={replyofreplyshow}
                                                                    />
                                                                    {emojo}
                                                                    <p
                                                                        className={`absolute top-[50%] translate-y-[-50%]  text-themecolor right-4 font-Proxima-Bold ${
                                                                            !confirmedReply ? 'cursor-pointer' : ''
                                                                        }`}
                                                                        onClick={(e: any) => {
                                                                            setNewreply1('' + i + val);
                                                                            postaReply1(e, reply?._id);
                                                                        }}>
                                                                        Reply
                                                                    </p>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        {/* Reply Show Area Start*/}
                                                        {showrepliesofreplies?.includes('' + i + val) &&
                                                            reply?.replies?.map((replyofreply: any, k: number) => {
                                                                return (
                                                                    <div key={k}>
                                                                        <div className=" flex  Atsubcomment Atsubcomment2 pt-3 pb-3 pl-0 -z-10 ">
                                                                            <Link
                                                                                legacyBehavior
                                                                                href={
                                                                                    // replyofreply?.user?._id ==
                                                                                    // user?.userId
                                                                                    //     ? `/profile/me`
                                                                                    //     :
                                                                                    `/profile/${replyofreply?.user?.userName}`
                                                                                }>
                                                                                <a className="">
                                                                                    <figure className="w-[22px] h-[22px] relative !rounded-full flex items-center justify-center UerProfileImage !overflow-hidden">
                                                                                        {replyofreply?.user?.avatar ? (
                                                                                            <ImageComponent
                                                                                                width={32}
                                                                                                height={32}
                                                                                                className="rounded-full"
                                                                                                src={
                                                                                                    replyofreply?.user
                                                                                                        ?.avatar
                                                                                                }
                                                                                                alt=""
                                                                                                transformation={
                                                                                                    TRANSFORMATION_NAMES.fit_50x50
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-base">
                                                                                                {replyofreply?.user?.firstName
                                                                                                    .charAt(0)
                                                                                                    .toUpperCase()}
                                                                                            </p>
                                                                                        )}
                                                                                    </figure>
                                                                                </a>
                                                                            </Link>
                                                                            <div className="w-full  ml-4">
                                                                                <div className="flex ">
                                                                                    <div className="sm:flex w-full">
                                                                                        <Link
                                                                                            legacyBehavior
                                                                                            href={
                                                                                                // replyofreply?.user
                                                                                                //     ?._id ==
                                                                                                // user?.userId
                                                                                                //     ? `/profile/me`
                                                                                                //     :
                                                                                                `/profile/${replyofreply?.user?.userName}`
                                                                                            }>
                                                                                            <a className="">
                                                                                                <h4 className="text-base max-w-[60%] flex cursor-pointer  sm:max-w-[160px]  md:max-w-full xl:max-w-[160px] 2xl:max-w-full flex-shrink-0 truncate  text-white">
                                                                                                    {
                                                                                                        replyofreply
                                                                                                            ?.user
                                                                                                            ?.firstName
                                                                                                    }{' '}
                                                                                                    {
                                                                                                        replyofreply
                                                                                                            ?.user
                                                                                                            ?.lastName
                                                                                                    }
                                                                                                    <span className="ml-2">
                                                                                                        {replyofreply
                                                                                                            ?.user
                                                                                                            ?.isVerfied && (
                                                                                                            <Verified />
                                                                                                        )}
                                                                                                    </span>
                                                                                                </h4>
                                                                                            </a>
                                                                                        </Link>

                                                                                        <div className="flex mt-0.5">
                                                                                            <p className="text-sm sm:ml-3  min-w-[auto] max-w-[75px] lg:max-w-full truncate">
                                                                                                @
                                                                                                {
                                                                                                    replyofreply?.user
                                                                                                        ?.userName
                                                                                                }
                                                                                            </p>
                                                                                            <span className="text-[#727279] text-sm ml-3">
                                                                                                {moment(
                                                                                                    replyofreply.createdAt
                                                                                                ).fromNow()}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {user && user?.userId && (
                                                                                        <Drodpdown
                                                                                            comment={replyofreply}
                                                                                            setConfirmed={setConfirmed}
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                                <div className="sm:flex mt-2 sm:mt-0 gap-4  justify-between">
                                                                                    <TextLength
                                                                                        item={replyofreply}
                                                                                        indexes={replyofreplyIndex}
                                                                                        setIndexes={() =>
                                                                                            setReplyofreply('' + i + k)
                                                                                        }
                                                                                        val={'' + val + i + k}
                                                                                    />
                                                                                    <div
                                                                                        className={`mt-2 ${
                                                                                            checkblocked(
                                                                                                replyofreply?.user
                                                                                            )
                                                                                                ? 'opacity-50'
                                                                                                : ''
                                                                                        }`}>
                                                                                        <LikeComment
                                                                                            comment={replyofreply}
                                                                                            setConfirmed={setConfirmed}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            {/* Reply Show Area Start*/}
                            <div
                                className={`mb-[10px] relative ${
                                    replyshow == true && val == index ? 'block' : 'hidden'
                                }`}>
                                <form
                                    onSubmit={(e: any) => {
                                        setNewreply('' + val);
                                        postaReply(e, item?._id);
                                    }}
                                    key="reply">
                                    <div className="relative at-mentioninput">
                                        {/* <MentionedInput
                                            autoFocuss={true}
                                            // styles={"[#43434C]"}

                                            styles="!rounded-full  py-3 pl-[20px]  pr-[100px]   border border-[#43434C] text-base Atmentioninput"
                                            singleLine={true}
                                            placeHolder={'Add reply'}
                                            value={reply}
                                            setMentionedUsers={setMentionedUsers}
                                            setValues={(value: any) => setReply(value)}
                                        /> */}
                                        <MentionReply
                                            reply={reply}
                                            setMentionedUsers={setMentionedUsers}
                                            setReply={setReply}
                                            replyshow={replyshow}
                                        />
                                        {emojo1}
                                        <p
                                            className={`absolute top-[50%] translate-y-[-50%]  text-themecolor right-4 font-Proxima-Bold ${
                                                !confirmedReply ? 'cursor-pointer' : ''
                                            }`}
                                            onClick={(e: any) => {
                                                setNewreply('' + val);
                                                postaReply(e, item?._id);
                                            }}>
                                            Reply
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            ))}
            {state && <Poups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};

export default Comments;
