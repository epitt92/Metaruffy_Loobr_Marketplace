import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { getComments } from '../../../redux/comments/actions';
import Loader from '../../../components/loader/Loader';
import { isEmpty } from 'validate.js';
import NoComment from '../../../components/NoCommentFound/nocomment';
import { postReply } from '../../../redux/user/actions';
import { toast } from 'react-toastify';
import { homeService } from '../../../services/home.service';
import Input from '../../../components/input/Input';
import Button from '../../../components/Button/Button';
import useAudio from '../../../hooks/useAudio';
import { FEED_COMMENT_LIKE_CREATED } from '../../../constants/socketEvents';
import { _io } from '../../../services/socket.service';
import MentionedInput from '../../../components/mentionedInput/mentionedInput';
import { EmojiPicker } from '../../../components/EmojiPicker/EmojiPicker';
import CommentReply from '../../../components/CommentsWithReply/comments';
type Props = {
    nft: any;
    setConfirm?: Function;
};

const Comments = ({ nft, setConfirm }: Props) => {
    const [loadinglocal, setLoading] = useState(false);
    const [comment, setComment] = useState<string>('');
    const [confiremd, setConfirmed] = useState<boolean>(false);

    const comments = useSelector((state: any) => state.comments.comments);
    const user = useSelector((state: any) => state.auth.user);

    const [confirmedinside, setConfirmedinside] = useState<boolean>(false);

    const [mentionedUsers, setMentionedUsers] = useState<any>([]);
    const commentsLoading = useSelector((state: any) => state.comments.commentsLoading);
    const [emoji, setEmoji] = useState<any>(null);
    const [playing, toggle] = useAudio('/LOOBR_POST_COMMENT_OR_REPLY.mp3');
    const dispatch = useDispatch();

    useEffect(() => {
        nft?._id && dispatch(getComments(nft?._id));
    }, [dispatch]);
    useEffect(() => {
        if (confiremd) {
            setConfirmed(false);
            setLoading(false);
            setComment('');
            setConfirm && setConfirm(true);
            nft?._id && dispatch(getComments(nft?._id, false));
        }
    }, [confiremd]);

    useEffect(() => {
        if (confirmedinside) {
            setConfirm && setConfirm(true);
            setConfirmedinside(false);
            nft?._id && dispatch(getComments(nft?._id, false));
        }
    }, [confirmedinside]);

    const postaComment = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loadinglocal) {
            return;
        } else if (comment.trim() == '') {
            return;
        } else {
            if (user && user.userId) {
                toggle();
                try {
                    let newText: any = comment;
                    newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
                    newText = newText.split('###__').join('<a target="_blank" href=/profile/');
                    newText = newText.split('^^__').join('>');
                    newText = newText.split('###^^^').join(' </a>');
                    newText.trim();
                    // let regix = /#(\S*)/g;
                    // let alltags: any = [];
                    // newText.replace(regix, function (url: any) {
                    //     let newurl = url.split('#');
                    //     if (!alltags.includes(newurl[1])) {
                    //         alltags.push(newurl[1]);
                    //     }
                    //     return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
                    // });
                    let regix = /#(\S*)/g;
                    let alltags: any = [];
                    let text = newText.replace(regix, function (url: any) {
                        let newurl = url.split('#');
                        if (!alltags.includes(newurl[1])) {
                            alltags.push(newurl[1]);
                        }
                        return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
                    });
                    setLoading(true);

                    const result = await homeService.commentMarketPlace(nft._id, {
                        text: text,
                        mentioned: mentionedUsers,
                        tag: alltags
                    });
                    // setConfirm(true);
                    //   toast.success("Comment posted successfully");
                    setConfirmed(true);
                    // setComment("");
                    // dispatch(getComments(nft?._id, false));

                    // setLoading(false);
                } catch (error) {
                    toast.error('Error in posting comment');
                    // setLoading(false);
                }
            }
        }
    };

    useEffect(() => {
        listenSocket();
    }, []);
    const listenSocket = () => {
        // console.log("message socket called");

        _io.on(`${FEED_COMMENT_LIKE_CREATED}`, (newdata: any) => {
            if (user && user.userId != newdata.user) {
                if (newdata.user) {
                    // setConfirm(true);
                    setConfirmedinside(true);
                }
            }
        });
    };

    const onEmojiClick = (emoji: any) => {
        let a = comment.concat(emoji);
        setComment(a);
    };
    useEffect(() => {
        if (emoji) {
            let a = comment.concat(emoji);
            setEmoji(null);
            setComment(a);
        }
    }, [emoji]);
    const emojo = useMemo(() => <EmojiPicker setEmoji={setEmoji} />, []);
    return (
        <div>
            <div className="relative">
                {user && user?.userId && (
                    <form onSubmit={postaComment}>
                        <div className=" relative mb-10 ">
                            <MentionedInput
                                // autoFocuss={false}
                                autoFocuss={true}
                                styles="!rounded-full w-full py-3 pl-[20px] pr-[150px] border border-[#43434C] text-base At-textsize Atmentioninput"
                                // styles="!rounded-full w-full pr-[130px]"
                                singleLine={true}
                                placeHolder={'Add comments'}
                                value={comment}
                                setMentionedUsers={setMentionedUsers}
                                setValues={(value: any) => setComment(value)}
                            />
                            <div className="flex items-center absolute right-[70px] xs:right-[83px]  top-1/2 ">
                                {/* <EmojiPicker setEmoji={onEmojiClick} /> */}
                                {emojo}
                            </div>
                            <Button
                                className="!absolute  top-1/2 sm:!py-2 sm:px-7 -translate-y-1/2 right-[15px] rounded-full text-base"
                                onClick={postaComment}
                                isLoading={loadinglocal}
                                disabled={loadinglocal}
                                type="submit">
                                Post
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            <div className="overflow-y-auto max-h-[50rem] min-h-[50rem] scrolHide mb-[1.25rem]">
                {commentsLoading ? (
                    <Loader />
                ) : isEmpty(comments) ? (
                    <> {user && <NoComment />} </>
                ) : (
                    <CommentReply comments={comments} setConfirmed={setConfirmed} confirmed={confiremd} />
                )}
            </div>
        </div>
    );
};

export default Comments;
