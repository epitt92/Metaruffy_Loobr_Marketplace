import React, { useEffect, useRef, useState, useCallback, useLayoutEffect, useMemo } from 'react';
import Image from 'next/image';

import Input from '../../components/input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { _io } from '../../services/socket.service';
import { REMOVE_USER_GROUP, SEND_NEW_MESSAGE, LEAVE_GROUP, ADD_USER_GROUP } from '../../constants/socketEvents';
import { sendMessage, seenMessage, editMessage } from '../../redux/messages/actions';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { EmojiPicker } from '../../components/EmojiPicker/EmojiPicker';
import Deletedropdown from '../../components/Deletedropdown';
import useAudio from '../../hooks/useAudio';
import { ImSpinner9 } from 'react-icons/im';
import Popups from '../../components/popup/poups';
import { DoDecrypt, DoEncrypt } from '../../services/aes.service';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { generateFileUrl, uploadFile } from '../../services/upload.service';
import Verified from '../../components/verified';
import MentionedMessage from '../../components/Chat/Mention';
import Messagedrodpdown from '../../components/Dropdown/Messagedropdown';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import TextArea from '../../components/textArea/textArea';
interface IProps {
    data1: any;
    setClose: Function;
}
const Messages = ({ data1, setClose }: IProps) => {
    const [statepop, setstatepop] = useState<any>(false);
    const [popup, setPopup] = useState(false);
    const [dataa, setDataa] = useState<any>('');
    const [data, setData] = useState<any>(data1);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [wholeMessage, setWholeMessage] = useState<any>();
    const [reply, setReply] = useState<any>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const [newMessage, setNewMessage] = useState(null);
    const [allMessages, setAllMessages] = useState<any>([]);
    const [message, setMessage] = useState<any>('');
    const [type, setType] = useState<any>('');
    const [file, setFile] = useState<any>(null);
    const [src, setSrc] = useState<any>(null);
    const [blockedUser, setBlocked] = useState<boolean>(false);
    const [loadinUpload, setLoadingUpload] = useState<boolean>(false);
    const [closep, setClosep] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<boolean>(true);
    const [typing, setTyping] = useState<boolean>(false);
    const [typingUserName, setTyingUserName] = useState<string>('');
    const [userMentions, setUserMnntions] = useState<Array<any>>([]);
    const onlineUsers = useSelector((state: any) => state.auth.onlineUser);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [emoji, setEmoji] = useState<any>(null);
    const [mentioneduser, setMentionedUser] = useState<any>('');
    const [mentionUi, setMentionUi] = useState<boolean>(false);
    const onDrop = useCallback((acceptedFiles) => {
        uploadtoS3(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'video/*': ['.mp4', '.MPEG', '.WEBM']
        }
    });
    function urlify(text: string) {
        var urlRegex = /(@?@[^\s^\<]+)/g;

        return text?.replace(urlRegex, function (url) {
            return `<a  target="_blank" href=profile/${url.split('@')[1]} id=${url}>${url} </a>`;
        });
    }
    let focusInput: any = useRef();

    const focusTheInput = () => {
        if (typeof window !== 'undefined' && document?.getElementById('TYPE__')) {
            document?.getElementById('TYPE__')?.focus();
        }

        if (focusInput.current) {
            focusInput.current.focus();
        }
    };
    var urlRegex = /<\/?[a-z][\s\S]*>/g;

    const onEmojiClick = (emoji: any) => {
        let a = message.concat(emoji);
        setMessage(a);
        focusTheInput();
        if (trigger) {
            setTrigger(false);
            // const resp = fetch('/api/typing', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ room: data1?._id, user: user?.userName })
            // });
            _io.emit('TYPING_FRONTEND', {
                room: data1?._id,
                user: user?.userName
            });

            setTimeout(() => {
                setTrigger(true);
            }, 3000);
        }
    };
    useEffect(() => {
        if (emoji) {
            let a = message.concat(emoji);
            setEmoji(null);
            setMessage(a);
            focusTheInput();

            if (trigger) {
                setTrigger(false);
                _io.emit('TYPING_FRONTEND', {
                    room: data1?._id,
                    user: user?.userName
                });

                setTimeout(() => {
                    setTrigger(true);
                }, 3000);
            }
        }
    }, [emoji]);
    const [playing, toggle] = useAudio('/LOOBR_CHAT_RECIEVED.mp3');
    const [sentPlaying, sentMessage] = useAudio('/LOOBR_CHAT_SENT.mp3');
    useEffect(() => {
        if (newMessage !== null) {
            setAllMessages([...allMessages, newMessage]);
        }
    }, [newMessage]);
    useEffect(() => {
        dispatch(seenMessage({ roomId: data?._id }));
    }, [newMessage]);

    useEffect(() => {
        if (user && user.userId) {
            listenSocket();
            listenSocketRemoved();
        }
    }, [user, user?.userId]);
    useEffect(() => {
        if (confirmed) {
            setConfirmed(false);
            setFile(null);
            setType('');
            setSrc(null);
            setClose();
        }
    }, [confirmed]);
    useEffect(() => {
        if (confirm) {
            getAllMessages();
            setConfirm(false);
        }
    }, [confirm]);

    const listenSocket = () => {
        _io.off(`${user?.userId}:${SEND_NEW_MESSAGE}`);
        _io.on(`${user?.userId}:${SEND_NEW_MESSAGE}`, (newdata: any) => {
            if (newdata.roomId == data._id) {
                setNewMessage(newdata.messageId);
            }
        });
        _io.off(`${user?.userId}:${ADD_USER_GROUP}`);
        _io.on(`${user?.userId}:${ADD_USER_GROUP}`, (newdata: any) => {
            if (newdata.roomId == data._id) {
                setClosep(true);
                setData(newdata.data);
            }
        });
    };
    const listenSocketRemoved = () => {
        //
        _io.off(`${user?.userId}:${REMOVE_USER_GROUP}`);
        _io.on(`${user?.userId}:${REMOVE_USER_GROUP}`, (newdata: any) => {
            if (newdata.roomId == data._id) {
                setFile(null);
                setType('');
                setSrc(null);
                setClose();
            }
        });
        _io.off(`${user?.userId}:${LEAVE_GROUP}`);
        _io.on(`${user?.userId}:${LEAVE_GROUP}`, (newdata: any) => {
            setClosep(true);
            setData(newdata.data);
        });
    };
    const getAllMessages = async () => {
        // let resp = await messagesService.getAllMessages(data?._id);
        if (data && data._id && user && user.userId) {
            axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/message/messages?room=${data._id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((res) => {
                    setAllMessages(res?.data?.data?.messages);
                })
                .catch((err) => {
                    // console.log(err.response);
                    toast.error(err.response.data.message);
                });
        }
    };

    useEffect(() => {
        if (data?._id !== '') {
            // console.log('=-=-----===-=-=-=-=-');
            getAllMessages();
        }
    }, [data]);

    var element: any;
    if (typeof window !== 'undefined') {
        var element: any = document.getElementById('yourDivID' + '-' + data?._id);
    }

    function updateScroll() {
        // element?.scrollTop = element?.scrollHeight;
    }

    useEffect(() => {
        if (element !== null) {
            updateScroll();
        }
    }, [element]);
    useEffect(() => {
        if (data?.type == 'PRIVATE') {
            data?.roomUsers.map((ele: any, i: number) => {
                if (ele._id !== user?.userId) {
                    if (ele?.blockedBy?.includes(user?.userId) || ele?.blockedUser?.includes(user?.userId)) {
                        setBlocked(true);
                    }
                }
            });
        }
    }, []);
    useEffect(() => {
        if (data) {
            setUserMnntions([]);
            if (data?.type == 'GROUP') {
                data?.roomUsers.map((ele: any, i: number) => {
                    if (ele?._id != user?.userId) {
                        let a = userMentions;
                        if (!userMentions?.some((value: any) => value?.userName == ele?.userName)) {
                            a.push({
                                id: ele._id + '+' + ele.userName,
                                display: '@'.concat(ele.userName),
                                firstName: ele.firstName,
                                lastName: ele.lastName,
                                avatar: ele.avatar,
                                userName: ele.userName
                            });
                        }
                        // a.push({
                        //     id: ele._id + '+' + ele.userName,
                        //     display: '@'.concat(ele.userName),
                        //     firstName: ele.firstName,
                        //     lastName: ele.lastName,
                        //     avatar: ele.avatar,
                        //     userName: ele.userName
                        // });

                        setUserMnntions([...a]);
                    }
                });
            }
        }
    }, [data]);
    // useEffect(() => {
    //     dispatch(seenMessage({ roomId: data?._id }));
    // }, []);
    useEffect(() => {
        if (element !== null) {
            updateScroll();
        }
    }, [element]);

    const isOnlyOneEmoji = (s: string) => {
        var EmojiPattern =
            /^(?:\uD83D(?:\uDD73\uFE0F?|\uDC41(?:(?:\uFE0F(?:\u200D\uD83D\uDDE8\uFE0F?)?|\u200D\uD83D\uDDE8\uFE0F?))?|[\uDDE8\uDDEF]\uFE0F?|\uDC4B(?:\uD83C[\uDFFB-\uDFFF])?|\uDD90(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|[\uDD96\uDC4C\uDC48\uDC49\uDC46\uDD95\uDC47\uDC4D\uDC4E\uDC4A\uDC4F\uDE4C\uDC50\uDE4F\uDC85\uDCAA\uDC42\uDC43\uDC76\uDC66\uDC67](?:\uD83C[\uDFFB-\uDFFF])?|\uDC71(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2640\u2642]\uFE0F?))?)|\u200D(?:[\u2640\u2642]\uFE0F?)))?|\uDC68(?:(?:\uD83C(?:\uDFFB(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFC(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFD(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFE(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFF(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD]|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D(?:\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC68\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92])|\u2708\uFE0F?|\u2764(?:\uFE0F\u200D\uD83D(?:\uDC8B\u200D\uD83D\uDC68|\uDC68)|\u200D\uD83D(?:\uDC8B\u200D\uD83D\uDC68|\uDC68)))))?|\uDC69(?:(?:\uD83C(?:\uDFFB(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFC-\uDFFF]|\uDC68\uD83C[\uDFFC-\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFC(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFD(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFE(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?|\uDFFF(?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83D(?:\uDC69\uD83C[\uDFFB-\uDFFE]|\uDC68\uD83C[\uDFFB-\uDFFE])|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD]|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D(?:\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92])|\u2708\uFE0F?|\u2764(?:\uFE0F\u200D\uD83D(?:\uDC8B\u200D\uD83D[\uDC68\uDC69]|[\uDC68\uDC69])|\u200D\uD83D(?:\uDC8B\u200D\uD83D[\uDC68\uDC69]|[\uDC68\uDC69])))))?|[\uDC74\uDC75](?:\uD83C[\uDFFB-\uDFFF])?|[\uDE4D\uDE4E\uDE45\uDE46\uDC81\uDE4B\uDE47\uDC6E](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDD75(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC82\uDC77](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDC78(?:\uD83C[\uDFFB-\uDFFF])?|\uDC73(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC72\uDC70\uDC7C](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC86\uDC87\uDEB6](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDC83\uDD7A](?:\uD83C[\uDFFB-\uDFFF])?|\uDD74(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\uDC6F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDEA3\uDEB4\uDEB5](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDEC0\uDECC\uDC6D\uDC6B\uDC6C](?:\uD83C[\uDFFB-\uDFFF])?|\uDDE3\uFE0F?|\uDC15(?:\u200D\uD83E\uDDBA)?|[\uDC3F\uDD4A\uDD77\uDD78\uDDFA\uDEE3\uDEE4\uDEE2\uDEF3\uDEE5\uDEE9\uDEF0\uDECE\uDD70\uDD79\uDDBC\uDD76\uDECD\uDDA5\uDDA8\uDDB1\uDDB2\uDCFD\uDD6F\uDDDE\uDDF3\uDD8B\uDD8A\uDD8C\uDD8D\uDDC2\uDDD2\uDDD3\uDD87\uDDC3\uDDC4\uDDD1\uDDDD\uDEE0\uDDE1\uDEE1\uDDDC\uDECF\uDECB\uDD49]\uFE0F?|[\uDE00\uDE03\uDE04\uDE01\uDE06\uDE05\uDE02\uDE42\uDE43\uDE09\uDE0A\uDE07\uDE0D\uDE18\uDE17\uDE1A\uDE19\uDE0B\uDE1B-\uDE1D\uDE10\uDE11\uDE36\uDE0F\uDE12\uDE44\uDE2C\uDE0C\uDE14\uDE2A\uDE34\uDE37\uDE35\uDE0E\uDE15\uDE1F\uDE41\uDE2E\uDE2F\uDE32\uDE33\uDE26-\uDE28\uDE30\uDE25\uDE22\uDE2D\uDE31\uDE16\uDE23\uDE1E\uDE13\uDE29\uDE2B\uDE24\uDE21\uDE20\uDE08\uDC7F\uDC80\uDCA9\uDC79-\uDC7B\uDC7D\uDC7E\uDE3A\uDE38\uDE39\uDE3B-\uDE3D\uDE40\uDE3F\uDE3E\uDE48-\uDE4A\uDC8B\uDC8C\uDC98\uDC9D\uDC96\uDC97\uDC93\uDC9E\uDC95\uDC9F\uDC94\uDC9B\uDC9A\uDC99\uDC9C\uDDA4\uDCAF\uDCA2\uDCA5\uDCAB\uDCA6\uDCA8\uDCA3\uDCAC\uDCAD\uDCA4\uDC40\uDC45\uDC44\uDC8F\uDC91\uDC6A\uDC64\uDC65\uDC63\uDC35\uDC12\uDC36\uDC29\uDC3A\uDC31\uDC08\uDC2F\uDC05\uDC06\uDC34\uDC0E\uDC2E\uDC02-\uDC04\uDC37\uDC16\uDC17\uDC3D\uDC0F\uDC11\uDC10\uDC2A\uDC2B\uDC18\uDC2D\uDC01\uDC00\uDC39\uDC30\uDC07\uDC3B\uDC28\uDC3C\uDC3E\uDC14\uDC13\uDC23-\uDC27\uDC38\uDC0A\uDC22\uDC0D\uDC32\uDC09\uDC33\uDC0B\uDC2C\uDC1F-\uDC21\uDC19\uDC1A\uDC0C\uDC1B-\uDC1E\uDC90\uDCAE\uDD2A\uDDFE\uDDFB\uDC92\uDDFC\uDDFD\uDD4C\uDED5\uDD4D\uDD4B\uDC88\uDE82-\uDE8A\uDE9D\uDE9E\uDE8B-\uDE8E\uDE90-\uDE9C\uDEF5\uDEFA\uDEB2\uDEF4\uDEF9\uDE8F\uDEA8\uDEA5\uDEA6\uDED1\uDEA7\uDEF6\uDEA4\uDEA2\uDEEB\uDEEC\uDCBA\uDE81\uDE9F-\uDEA1\uDE80\uDEF8\uDD5B\uDD67\uDD50\uDD5C\uDD51\uDD5D\uDD52\uDD5E\uDD53\uDD5F\uDD54\uDD60\uDD55\uDD61\uDD56\uDD62\uDD57\uDD63\uDD58\uDD64\uDD59\uDD65\uDD5A\uDD66\uDD25\uDCA7\uDEF7\uDD2E\uDC53-\uDC62\uDC51\uDC52\uDCFF\uDC84\uDC8D\uDC8E\uDD07-\uDD0A\uDCE2\uDCE3\uDCEF\uDD14\uDD15\uDCFB\uDCF1\uDCF2\uDCDE-\uDCE0\uDD0B\uDD0C\uDCBB\uDCBD-\uDCC0\uDCFA\uDCF7-\uDCF9\uDCFC\uDD0D\uDD0E\uDCA1\uDD26\uDCD4-\uDCDA\uDCD3\uDCD2\uDCC3\uDCDC\uDCC4\uDCF0\uDCD1\uDD16\uDCB0\uDCB4-\uDCB8\uDCB3\uDCB9\uDCB1\uDCB2\uDCE7-\uDCE9\uDCE4-\uDCE6\uDCEB\uDCEA\uDCEC-\uDCEE\uDCDD\uDCBC\uDCC1\uDCC2\uDCC5-\uDCD0\uDD12\uDD13\uDD0F-\uDD11\uDD28\uDD2B\uDD27\uDD29\uDD17\uDD2C\uDD2D\uDCE1\uDC89\uDC8A\uDEAA\uDEBD\uDEBF\uDEC1\uDED2\uDEAC\uDDFF\uDEAE\uDEB0\uDEB9-\uDEBC\uDEBE\uDEC2-\uDEC5\uDEB8\uDEAB\uDEB3\uDEAD\uDEAF\uDEB1\uDEB7\uDCF5\uDD1E\uDD03\uDD04\uDD19-\uDD1D\uDED0\uDD4E\uDD2F\uDD00-\uDD02\uDD3C\uDD3D\uDD05\uDD06\uDCF6\uDCF3\uDCF4\uDD31\uDCDB\uDD30\uDD1F-\uDD24\uDD34\uDFE0-\uDFE2\uDD35\uDFE3-\uDFE5\uDFE7-\uDFE9\uDFE6\uDFEA\uDFEB\uDD36-\uDD3B\uDCA0\uDD18\uDD33\uDD32\uDEA9])|\uD83E(?:[\uDD1A\uDD0F\uDD1E\uDD1F\uDD18\uDD19\uDD1B\uDD1C\uDD32\uDD33\uDDB5\uDDB6\uDDBB\uDDD2](?:\uD83C[\uDFFB-\uDFFF])?|\uDDD1(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:\uD83E(?:\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?))?)|\u200D(?:\uD83E(?:\uDD1D\u200D\uD83E\uDDD1|[\uDDB0\uDDB1\uDDB3\uDDB2\uDDAF\uDDBC\uDDBD])|\u2695\uFE0F?|\uD83C[\uDF93\uDFEB\uDF3E\uDF73\uDFED\uDFA4\uDFA8]|\u2696\uFE0F?|\uD83D[\uDD27\uDCBC\uDD2C\uDCBB\uDE80\uDE92]|\u2708\uFE0F?)))?|[\uDDD4\uDDD3](?:\uD83C[\uDFFB-\uDFFF])?|[\uDDCF\uDD26\uDD37](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDD34\uDDD5\uDD35\uDD30\uDD31\uDD36](?:\uD83C[\uDFFB-\uDFFF])?|[\uDDB8\uDDB9\uDDD9-\uDDDD](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDDDE\uDDDF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDDCD\uDDCE\uDDD6\uDDD7\uDD38](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDD3C(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|[\uDD3D\uDD3E\uDD39\uDDD8](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDD23\uDD70\uDD29\uDD2A\uDD11\uDD17\uDD2D\uDD2B\uDD14\uDD10\uDD28\uDD25\uDD24\uDD12\uDD15\uDD22\uDD2E\uDD27\uDD75\uDD76\uDD74\uDD2F\uDD20\uDD73\uDD13\uDDD0\uDD7A\uDD71\uDD2C\uDD21\uDD16\uDDE1\uDD0E\uDD0D\uDD1D\uDDBE\uDDBF\uDDE0\uDDB7\uDDB4\uDD3A\uDDB0\uDDB1\uDDB3\uDDB2\uDD8D\uDDA7\uDDAE\uDD8A\uDD9D\uDD81\uDD84\uDD93\uDD8C\uDD99\uDD92\uDD8F\uDD9B\uDD94\uDD87\uDDA5\uDDA6\uDDA8\uDD98\uDDA1\uDD83\uDD85\uDD86\uDDA2\uDD89\uDDA9\uDD9A\uDD9C\uDD8E\uDD95\uDD96\uDD88\uDD8B\uDD97\uDD82\uDD9F\uDDA0\uDD40\uDD6D\uDD5D\uDD65\uDD51\uDD54\uDD55\uDD52\uDD6C\uDD66\uDDC4\uDDC5\uDD5C\uDD50\uDD56\uDD68\uDD6F\uDD5E\uDDC7\uDDC0\uDD69\uDD53\uDD6A\uDD59\uDDC6\uDD5A\uDD58\uDD63\uDD57\uDDC8\uDDC2\uDD6B\uDD6E\uDD5F-\uDD61\uDD80\uDD9E\uDD90\uDD91\uDDAA\uDDC1\uDD67\uDD5B\uDD42\uDD43\uDD64\uDDC3\uDDC9\uDDCA\uDD62\uDD44\uDDED\uDDF1\uDDBD\uDDBC\uDE82\uDDF3\uDE90\uDDE8\uDDE7\uDD47-\uDD49\uDD4E\uDD4F\uDD4D\uDD4A\uDD4B\uDD45\uDD3F\uDD4C\uDE80\uDE81\uDDFF\uDDE9\uDDF8\uDDF5\uDDF6\uDD7D\uDD7C\uDDBA\uDDE3-\uDDE6\uDD7B\uDE71-\uDE73\uDD7E\uDD7F\uDE70\uDDE2\uDE95\uDD41\uDDEE\uDE94\uDDFE\uDE93\uDDAF\uDDF0\uDDF2\uDDEA-\uDDEC\uDE78-\uDE7A\uDE91\uDE92\uDDF4\uDDF7\uDDF9-\uDDFD\uDDEF])|[\u263A\u2639\u2620\u2763\u2764]\uFE0F?|\u270B(?:\uD83C[\uDFFB-\uDFFF])?|[\u270C\u261D](?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\u270A(?:\uD83C[\uDFFB-\uDFFF])?|\u270D(?:(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F))?|\uD83C(?:\uDF85(?:\uD83C[\uDFFB-\uDFFF])?|\uDFC3(?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFC7\uDFC2](?:\uD83C[\uDFFB-\uDFFF])?|\uDFCC(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFC4\uDFCA](?:(?:\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|\uDFCB(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\uDFF5\uDF36\uDF7D\uDFD4-\uDFD6\uDFDC-\uDFDF\uDFDB\uDFD7\uDFD8\uDFDA\uDFD9\uDFCE\uDFCD\uDF21\uDF24-\uDF2C\uDF97\uDF9F\uDF96\uDF99-\uDF9B\uDF9E\uDFF7\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37]\uFE0F?|\uDFF4(?:(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F|\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F|\uDC77\uDB40\uDC6C\uDB40\uDC73\uDB40\uDC7F)))?|\uDFF3(?:(?:\uFE0F(?:\u200D\uD83C\uDF08)?|\u200D\uD83C\uDF08))?|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|[\uDFFB-\uDFFF\uDF38-\uDF3C\uDF37\uDF31-\uDF35\uDF3E-\uDF43\uDF47-\uDF53\uDF45\uDF46\uDF3D\uDF44\uDF30\uDF5E\uDF56\uDF57\uDF54\uDF5F\uDF55\uDF2D-\uDF2F\uDF73\uDF72\uDF7F\uDF71\uDF58-\uDF5D\uDF60\uDF62-\uDF65\uDF61\uDF66-\uDF6A\uDF82\uDF70\uDF6B-\uDF6F\uDF7C\uDF75\uDF76\uDF7E\uDF77-\uDF7B\uDF74\uDFFA\uDF0D-\uDF10\uDF0B\uDFE0-\uDFE6\uDFE8-\uDFED\uDFEF\uDFF0\uDF01\uDF03-\uDF07\uDF09\uDFA0-\uDFA2\uDFAA\uDF11-\uDF20\uDF0C\uDF00\uDF08\uDF02\uDF0A\uDF83\uDF84\uDF86-\uDF8B\uDF8D-\uDF91\uDF80\uDF81\uDFAB\uDFC6\uDFC5\uDFC0\uDFD0\uDFC8\uDFC9\uDFBE\uDFB3\uDFCF\uDFD1-\uDFD3\uDFF8\uDFA3\uDFBD\uDFBF\uDFAF\uDFB1\uDFAE\uDFB0\uDFB2\uDCCF\uDC04\uDFB4\uDFAD\uDFA8\uDF92\uDFA9\uDF93\uDFBC\uDFB5\uDFB6\uDFA4\uDFA7\uDFB7-\uDFBB\uDFA5\uDFAC\uDFEE\uDFF9\uDFE7\uDFA6\uDD8E\uDD91-\uDD9A\uDE01\uDE36\uDE2F\uDE50\uDE39\uDE1A\uDE32\uDE51\uDE38\uDE34\uDE33\uDE3A\uDE35\uDFC1\uDF8C])|\u26F7\uFE0F?|\u26F9(?:(?:\uFE0F(?:\u200D(?:[\u2642\u2640]\uFE0F?))?|\uD83C(?:[\uDFFB-\uDFFF](?:\u200D(?:[\u2642\u2640]\uFE0F?))?)|\u200D(?:[\u2642\u2640]\uFE0F?)))?|[\u2618\u26F0\u26E9\u2668\u26F4\u2708\u23F1\u23F2\u2600\u2601\u26C8\u2602\u26F1\u2744\u2603\u2604\u26F8\u2660\u2665\u2666\u2663\u265F\u26D1\u260E\u2328\u2709\u270F\u2712\u2702\u26CF\u2692\u2694\u2699\u2696\u26D3\u2697\u26B0\u26B1\u26A0\u2622\u2623\u2B06\u2197\u27A1\u2198\u2B07\u2199\u2B05\u2196\u2195\u2194\u21A9\u21AA\u2934\u2935\u269B\u2721\u2638\u262F\u271D\u2626\u262A\u262E\u25B6\u23ED\u23EF\u25C0\u23EE\u23F8-\u23FA\u23CF\u2640\u2642\u2695\u267E\u267B\u269C\u2611\u2714\u2716\u303D\u2733\u2734\u2747\u203C\u2049\u3030\u00A9\u00AE\u2122]\uFE0F?|[\u0023\u002A\u0030-\u0039](?:\uFE0F\u20E3|\u20E3)|[\u2139\u24C2\u3297\u3299\u25FC\u25FB\u25AA\u25AB]\uFE0F?|[\u2615\u26EA\u26F2\u26FA\u26FD\u2693\u26F5\u231B\u23F3\u231A\u23F0\u2B50\u26C5\u2614\u26A1\u26C4\u2728\u26BD\u26BE\u26F3\u267F\u26D4\u2648-\u2653\u26CE\u23E9-\u23EC\u2B55\u2705\u274C\u274E\u2795-\u2797\u27B0\u27BF\u2753-\u2755\u2757\u26AB\u26AA\u2B1B\u2B1C\u25FE\u25FD])$/;
        return EmojiPattern.test(s);
    };
    const messageHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (blockedUser) {
            toast.error('Blocked');
            return;
        }

        // file && setLoading(true);
        if (message.trim() == '' && !file) {
            return;
        } else {
            let newText = message;
            newText = urlify(message);
            // newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
            // newText = newText.split('###__').join('<a href=/profile/');
            // newText = newText.split('^^__').join('>');
            // newText = newText.split('###^^^').join(' </a>');
            try {
                let isEmoji = isOnlyOneEmoji(message.trim());
                if (message.trim() != '') {
                    let o = {
                        type: type == '' ? 'text' : type,
                        reply: reply,
                        attachment: src,
                        body: DoEncrypt(newText),
                        isEmoji: isEmoji,
                        createdAt: new Date(),
                        sendBy: {
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            _id: user?.userId
                        }
                    };
                    let m = [...allMessages, o];
                    !wholeMessage && setAllMessages(m);
                } else {
                    let o = {
                        reply: reply,
                        type: type,
                        attachment: src,
                        createdAt: new Date(),
                        sendBy: {
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            _id: user?.userId
                        }
                    };
                    let m = [...allMessages, o];
                    !wholeMessage && setAllMessages(m);
                }
                const body = new FormData();
                body.append('room', data?._id);
                message && body.append('body', DoEncrypt(newText));
                // body.append('userId', user.userId);
                type == '' ? body.append('type', 'text') : body.append('type', type);
                file && body.append('attachment', src);
                let res =
                    !wholeMessage &&
                    (await dispatch(
                        sendMessage(
                            {
                                room: data?._id,
                                body: message ? DoEncrypt(newText) : null,
                                isEmoji: isEmoji,
                                attachment: src,
                                type: type ? type : 'text',
                                reply: reply ? reply?._id : null
                            },
                            setConfirm,
                            () => {}
                        )
                    ));
                wholeMessage &&
                    (await dispatch(
                        editMessage(
                            // body,
                            {
                                messageId: wholeMessage._id,
                                body: message ? DoEncrypt(newText) : null,
                                isEmoji: isEmoji,
                                attachment: src,
                                type: type ? type : 'text'
                            },
                            () => {}
                        )
                    ));
                setReply(null);
                setWholeMessage(null);
                sentMessage();

                setFile(null);
                setSrc(null);
                setMessage('');
                setType('');
                updateScroll();
            } catch (err) {
                console.log(err);
            }
        }
    };
    const uploadtoS3 = async (inputFile: any) => {
        var filesize: number = Number((inputFile.size / 1024 / 1024).toFixed(4));
        if (filesize > 10) {
            toast.error('File is too large');
            return;
        }
        try {
            setLoadingUpload(true);
            if (inputFile.type == 'video/mp4' || inputFile.type == 'video/webm' || inputFile.type == 'video/ogg') {
                setType('video');
            } else {
                setType('image');
            }
            try {
                setFile(inputFile);
                let name = `${new Date().valueOf()}.${inputFile.name.split('.')[1]}`;
                let originalName = inputFile.name;
                let type = inputFile.type;
                // let url = await generateFileUrl({ name, mime: type });
                let newUrl = await uploadFile(inputFile);
                newUrl && setSrc(newUrl);
                newUrl && setLoadingUpload(false);
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            // setLoadingUpload(false);
            // console.log(err);
        }
    };

    useEffect((): any => {
        _io.on(`TYPING:${data1._id}`, (message: any) => {
            setTyping(true);
            setTyingUserName(message);
            setTimeout(() => {
                setTyingUserName('');
                setTyping(false);
            }, 3000);
        });

        // socket disconnet onUnmount if exists
        // if (_io) return () => _io.disconnect();
    }, []);

    useEffect(() => {
        if (allMessages) {
            _io.off(`${data1._id}:EDIT_MESSAGE`);
            _io.on(`${data1._id}:EDIT_MESSAGE`, (message: any) => {
                if (message?.messageId?._id) {
                    let newMessage = message.messageId;

                    const newArr: any = allMessages.map((obj: any) => {
                        if (obj._id === message.messageId._id) {
                            return newMessage;
                        }

                        return obj;
                    });
                    setAllMessages([...newArr]);
                }
            });
            _io.off(`${data1._id}:DELETE_MESSAGE`);
            _io.on(`${data1._id}:DELETE_MESSAGE`, (message: any) => {
                if (message?.messageId) {
                    let arr = allMessages.filter((item: any) => item._id !== message?.messageId);
                    setAllMessages([...arr]);
                }
            });
            _io.off(`${user?.userId}:${data1?._id}:SEEN_MESSAGES`);
            _io.on(`${user?.userId}:${data1?._id}:SEEN_MESSAGES`, (message: any) => {
                if (message?.data?.length > 0) {
                    let arr: any = allMessages;
                    message?.data.map((data: any) => {
                        let newMessage = data;
                        const newArr: any = arr.map((obj: any) => {
                            if (obj._id === data._id) {
                                return newMessage;
                            }
                            return obj;
                        });
                        arr = newArr;
                    });
                    setAllMessages([...arr]);
                }
            });
        }
    }, [allMessages]);
    const emojo = useMemo(
        () => <EmojiPicker setEmoji={setEmoji} outerClassName="!right-3 !top-auto !bottom-[0.7rem] !-translate-y-0" />,
        []
    );

    useEffect(() => {
        if (mentioneduser) {
            let a = mentioneduser;

            let messagemention = message.concat(`${mentioneduser}`);
            // let messagemention = message.concat(`<a href=/profile/${mentioneduser}>@${mentioneduser}</a>`);
            setMessage(messagemention);
            setMentionedUser(null);
            setMentionUi(false);
        }
    }, [mentioneduser]);
    const checkMention = (e: any) => {
        console.log(message);

        if (data1?.type == 'GROUP' && e.nativeEvent.data == '@') {
            setMentionUi(true);
        } else {
            setMentionUi(false);
        }
        // if (e.nativeEvent.data == ' ') {
        //     setMentionUi(false);
        // }
        // if (e.nativeEvent.data == null && message.charAt(message.length - 1) == '@') {
        //     setMentionUi(false);
        // }
        !urlRegex.test(e.target.value) && setMessage(e.target.value);
    };
    return (
        <div className="z-30 flex flex-row-reverse block h-full gap-5 shadow-2xl lg:hidden ">
            <div className="bg-[#14141F]  border-blue1   h-[90%]  rounded-lg    relative w-full  ">
                <div className="cursor-pointer bg-[#2B2B35]  fixed z-10 w-full rounded-t-lg  px-9 text-center py-2.5 flex justify-between items-center">
                    <div className="flex items-center w-80 ">
                        {data?.type == 'PRIVATE' &&
                            data?.roomUsers.map((ele: any, i: number) => {
                                return (
                                    ele._id !== user?.userId && (
                                        <>
                                            <Link legacyBehavior href={`/profile/${ele?.userName}`} key={i}>
                                                <a className="flex items-center">
                                                    <figure className="w-[32px] h-[32px] relative overflow-hidden  rounded-full UerProfileImage AtchatUserprofile flex items-center justify-center">
                                                        {ele?.avatar ? (
                                                            <ImageComponent
                                                                // width={32}
                                                                // height={32}
                                                                objectFit="cover"
                                                                layout="fill"
                                                                className="rounded-full"
                                                                src={ele?.avatar}
                                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <p className="w-full h-full !bg-themecolor pt-2  flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                {ele.firstName.charAt(0).toUpperCase()}
                                                            </p>
                                                        )}
                                                    </figure>
                                                </a>
                                            </Link>
                                            <div className="ml-2">
                                                <p className="text-white text-[16px]   whitespace-nowrap leading-tight font-Proxima-Bold flex justify-center">
                                                    {ele.firstName + ' ' + ele.lastName}{' '}
                                                    {ele?.isVerfied && <Verified />}
                                                </p>
                                                <>
                                                    {!blockedUser && (
                                                        <>
                                                            <p
                                                                className={`${
                                                                    onlineUsers?.includes(ele._id) && 'text-[#38FF26]'
                                                                } text-left text-[12px]`}>
                                                                {onlineUsers?.includes(ele._id) ? 'online' : 'offline'}
                                                            </p>
                                                        </>
                                                    )}
                                                </>
                                                <p className="text-sm text-blue1 "></p>
                                            </div>
                                        </>
                                    )
                                );
                            })}
                        {data?.type == 'GROUP' && (
                            <>
                                <a className="flex items-center">
                                    <figure className="w-[32px] h-[32px] relative overflow-hidden rounded-full UerProfileImage flex items-center justify-center">
                                        {data?.image ? (
                                            <ImageComponent
                                                // width={32}
                                                // height={32}
                                                objectFit="cover"
                                                layout="fill"
                                                className="rounded-full"
                                                src={data?.image}
                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                alt=""
                                            />
                                        ) : (
                                            <p className="flex items-center justify-center w-full h-full pt-2 text-2xl rounded-full bg-themecolor text-black1">
                                                {data?.subject?.charAt(0).toUpperCase()}
                                            </p>
                                        )}
                                    </figure>
                                </a>
                                <div className="ml-2">
                                    <p className="flex text-base text-white braek justify-left ">
                                        {data?.subject.length > 20 ? data?.subject.slice(0, 20) + '...' : data?.subject}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center justify-end w-full ">
                        {data.type == 'PRIVATE' && (
                            <div
                                className={`${blockedUser}?"":cursor-pointer`}
                                onClick={async () => {
                                    if (!blockedUser) {
                                        navigator.mediaDevices
                                            .getUserMedia({ audio: true })
                                            .then(function (stream: any) {
                                                // console.log(stream.getAudioTracks());
                                                if (
                                                    // stream.getVideoTracks().length > 0 &&
                                                    stream.getAudioTracks().length > 0
                                                ) {
                                                    // let a: any = stream.getVideoTracks();
                                                    // stream.getVideoTracks()[0].stop();
                                                    stream.getAudioTracks()[0].stop();
                                                    // console.log(a[0]);
                                                    // a.stop();

                                                    // stream.removeTrack(a[0]);
                                                    // let a: any = stream.getAudioTracks;
                                                    // a.pause();
                                                    // let b: any;
                                                    // b.srcObject = stream.getAudioTracks;
                                                    // b.pause();
                                                    // console.log(stream);
                                                    // setDataa({ query: data?._id, calling: true, users: data?.roomUsers });
                                                    // setPopup(true);
                                                    // setstatepop(73);
                                                    setDataa({
                                                        roomId: data?._id,
                                                        calling: true,
                                                        users: data?.roomUsers,
                                                        reciver: data?.roomUsers.find(
                                                            (el: any) => el._id !== user?.userId
                                                        )?._id
                                                    });
                                                    setPopup(true);
                                                    setstatepop(73);
                                                    // toast.error('BRO ISSUE sdfsdjj');
                                                    // code for when none of the devices are available
                                                } else {
                                                    toast.success('Please Allow the mic access');
                                                }
                                            })
                                            .catch(function (error) {
                                                toast.success('Please Allow the mic access');
                                            });
                                        // handleStartVideo();
                                        // setDataa({ query: data?._id, calling: true, users: data?.roomUsers });
                                        // setPopup(true);
                                        // setstatepop(73);

                                        // diffferec

                                        // let mic = false;
                                        // let cam = false;
                                        // await navigator.mediaDevices.enumerateDevices().then((devices) =>
                                        //     devices.forEach((device) => {
                                        //         if (device.kind == 'audioinput' && device.label) {
                                        //             mic = true;
                                        //         }
                                        //         if (device.kind == 'videoinput' && device.label) cam = true;
                                        //     })
                                        // );
                                        // console.log(mic);
                                        // console.log(cam);
                                        // if (mic && cam) {
                                        //     toast.success('lets do it');
                                        // } else {
                                        //     toast.error('You do not have camera permissions');
                                        // }

                                        // diffferec

                                        // navigator.mediaDevices
                                        //     .getUserMedia({ audio: true, video: true })
                                        //     .then((stream) => {
                                        //         console.log('stream', stream);
                                        //     })
                                        //     .catch((err) => {
                                        //         console.log('stream1', err);
                                        //         if (err.name == 'NotAllowedError') {
                                        //             console.log('User has denied accessed');
                                        //         }
                                        //     });
                                        // navigator.mediaDevices
                                        //     .getUserMedia({ audio: true, video: true })
                                        //     .then(function (stream) {
                                        //         console.log(stream);
                                        //         if (
                                        //             stream.getVideoTracks().length > 0 &&
                                        //             stream.getAudioTracks().length > 0
                                        //         ) {
                                        //             setDataa({ query: data?._id, calling: true, users: data?.roomUsers });
                                        //             setPopup(true);
                                        //             setstatepop(73);
                                        //             // toast.error('BRO ISSUE');
                                        //             //code for when none of the devices are available
                                        //         } else {
                                        //             toast.success('BRO SUCCESS');
                                        //             // code for when both devices are available
                                        //         }
                                        //     })
                                        //     .catch(function (error) {
                                        //         toast.error('This is issue');
                                        //         console.log('ERROR', error);
                                        //         // code for when there is an error
                                        //     });
                                        // handleStartVideo();

                                        // diffferec

                                        // const micro = 'microphone' as PermissionName;
                                        // const camera = 'camera' as PermissionName;
                                        // const permission = await navigator.permissions
                                        //     .query({ name: camera })
                                        //     .then(async (res) => {
                                        //         if (res.state == 'granted') {
                                        //             await navigator.permissions.query({ name: micro }).then((res) => {
                                        //                 if (res.state == 'granted') {
                                        //                     setDataa({
                                        //                         query: data?._id,
                                        //                         calling: true,
                                        //                         users: data?.roomUsers
                                        //                     });
                                        //                     setPopup(true);
                                        //                     setstatepop(73);
                                        //                 } else {
                                        //                     toast.error('You do not have microphone permissions');
                                        //                 }
                                        //             });
                                        //         } else {
                                        //             toast.error('You do not have camera permissions');
                                        //         }
                                        //     });
                                    }
                                }}>
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20.3296 21.48L22.5696 19.24C22.8713 18.9421 23.2531 18.7381 23.6684 18.6529C24.0838 18.5677 24.515 18.6049 24.9096 18.76L27.6396 19.85C28.0385 20.0119 28.3804 20.2882 28.6224 20.6441C28.8645 21.0001 28.9957 21.4197 28.9996 21.85V26.85C28.9973 27.1428 28.9358 27.4321 28.8187 27.7005C28.7016 27.9688 28.5315 28.2107 28.3185 28.4116C28.1055 28.6125 27.854 28.7682 27.5792 28.8693C27.3044 28.9704 27.0121 29.0149 26.7196 29C7.58965 27.81 3.72965 11.61 2.99965 5.41004C2.96576 5.10558 2.99672 4.79739 3.09049 4.50575C3.18427 4.21411 3.33873 3.94563 3.54371 3.71798C3.7487 3.49032 3.99956 3.30865 4.2798 3.1849C4.56004 3.06116 4.86331 2.99816 5.16965 3.00004H9.99965C10.4307 3.00132 10.8514 3.13151 11.2078 3.37387C11.5643 3.61623 11.84 3.95968 11.9996 4.36004L13.0896 7.09004C13.2499 7.48311 13.2908 7.91468 13.2072 8.33085C13.1236 8.74702 12.9192 9.12934 12.6196 9.43004L10.3796 11.67C10.3796 11.67 11.6696 20.4 20.3296 21.48Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center ">
                        <div className="relative flex items-center gap-1 ">
                            {/* <svg
                                width="25"
                                height="25"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.3296 21.48L22.5696 19.24C22.8713 18.9421 23.2531 18.7381 23.6684 18.6529C24.0838 18.5677 24.515 18.6049 24.9096 18.76L27.6396 19.85C28.0385 20.0119 28.3804 20.2882 28.6224 20.6441C28.8645 21.0001 28.9957 21.4197 28.9996 21.85V26.85C28.9973 27.1428 28.9358 27.4321 28.8187 27.7005C28.7016 27.9688 28.5315 28.2107 28.3185 28.4116C28.1055 28.6125 27.854 28.7682 27.5792 28.8693C27.3044 28.9704 27.0121 29.0149 26.7196 29C7.58965 27.81 3.72965 11.61 2.99965 5.41004C2.96576 5.10558 2.99672 4.79739 3.09049 4.50575C3.18427 4.21411 3.33873 3.94563 3.54371 3.71798C3.7487 3.49032 3.99956 3.30865 4.2798 3.1849C4.56004 3.06116 4.86331 2.99816 5.16965 3.00004H9.99965C10.4307 3.00132 10.8514 3.13151 11.2078 3.37387C11.5643 3.61623 11.84 3.95968 11.9996 4.36004L13.0896 7.09004C13.2499 7.48311 13.2908 7.91468 13.2072 8.33085C13.1236 8.74702 12.9192 9.12934 12.6196 9.43004L10.3796 11.67C10.3796 11.67 11.6696 20.4 20.3296 21.48Z"
                                    fill="white"
                                />
                            </svg> */}
                            <Deletedropdown
                                closep={closep}
                                setClosep={setClosep}
                                setData={setData}
                                data1={data}
                                roomId={data?._id}
                                setConfirmed={setConfirmed}
                                group={data?.type == 'GROUP' ? true : false}
                            />
                        </div>
                        <i
                            onClick={() => {
                                setClose();
                            }}
                            className={`icon-close bg-[#363642]  h-7 w-7 flex justify-center mr-2 text-2xl items-center  rounded-full  text-[#7C7EBB]`}>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.2199 1.78025C12.4278 1.98827 12.5447 2.27036 12.5447 2.5645C12.5447 2.85864 12.4278 3.14073 12.2199 3.34875L8.56578 7.00043L12.2199 10.6521C12.4282 10.8604 12.5452 11.1429 12.5452 11.4375C12.5452 11.732 12.4282 12.0145 12.2199 12.2228C12.0116 12.4311 11.7291 12.5481 11.4345 12.5481C11.1399 12.5481 10.8574 12.4311 10.6491 12.2228L6.99721 8.56892L3.34533 12.2228C3.24219 12.326 3.11975 12.4078 2.98499 12.4636C2.85023 12.5194 2.7058 12.5481 2.55994 12.5481C2.41408 12.5481 2.26964 12.5194 2.13488 12.4636C2.00012 12.4078 1.87768 12.326 1.77454 12.2228C1.6714 12.1197 1.58959 11.9972 1.53377 11.8625C1.47795 11.7277 1.44922 11.5833 1.44922 11.4375C1.44922 11.2916 1.47795 11.1472 1.53377 11.0124C1.58959 10.8777 1.6714 10.7552 1.77454 10.6521L5.42863 7.00043L1.77454 3.34875C1.56624 3.14046 1.44922 2.85796 1.44922 2.56339C1.44922 2.26882 1.56624 1.98632 1.77454 1.77803C1.98284 1.56975 2.26536 1.45273 2.55994 1.45273C2.85452 1.45273 3.13703 1.56975 3.34533 1.77803L6.99721 5.43194L10.6491 1.77803C10.7521 1.67473 10.8745 1.59278 11.0093 1.53685C11.1441 1.48093 11.2886 1.45215 11.4345 1.45215C11.5804 1.45215 11.7249 1.48093 11.8596 1.53685C11.9944 1.59278 12.1168 1.67473 12.2199 1.77803V1.78025Z"
                                    fill="#777E91"
                                />
                            </svg>
                        </i>
                    </div>
                </div>
                <div className="flex flex-col justify-end  h-[calc(100vh-100px)] sm:h-[calc(100vh-26px)] ">
                    <div
                        className=" px-9   bg-[#14141F] h-[82vh]
                     relative duration-300  hover:bg-[#1c1c27]   overflow-y-auto  "
                        role="presentation">
                        <div
                            className="flex flex-col-reverse justify-start w-full mt-20 scrolHide scrollbarHide at-sidebarwrapper"
                            id={'yourDivID' + '-' + data?._id}>
                            <div>
                                {allMessages !== null && allMessages.length > 0
                                    ? allMessages.map((el: any, index: number, array: any) => {
                                          return (
                                              <>
                                                  {index > 0 &&
                                                  moment(array[index]?.createdAt).isSame(
                                                      array[index - 1]?.createdAt,
                                                      'day'
                                                  ) ? (
                                                      ''
                                                  ) : (
                                                      <p className="text-center ">
                                                          {el?.createdAt && moment(el?.createdAt).format('LL')}
                                                      </p>
                                                  )}
                                                  {el?.type == 'call' && (
                                                      <>
                                                          <div className="flex items-center justify-center">
                                                              <p className="text-themecolor">
                                                                  Call {el?.call?.status?.toLowerCase()}{' '}
                                                              </p>
                                                              <p className="pl-1 text-themecolor">
                                                                  {el?.createdAt &&
                                                                      moment(el?.createdAt).format('hh:mm A')}
                                                              </p>
                                                          </div>
                                                      </>
                                                  )}
                                                  {el?.sendBy._id === user?.userId ? (
                                                      <div className="flex justify-end px-3" key={index}>
                                                          <div className="inline-block ">
                                                              <div className="flex flex-row-reverse items-center mt-2">
                                                                  {el?.body && (
                                                                      <div className="flex flex-col ">
                                                                          <div className="flex items-center justify-end gap-1.5 relative">
                                                                              {el?.type == 'text' && (
                                                                                  <>
                                                                                      {' '}
                                                                                      <Messagedrodpdown
                                                                                          data={el}
                                                                                          setMessage={setMessage}
                                                                                          setWholeMessage={(
                                                                                              data: any
                                                                                          ) => {
                                                                                              setWholeMessage(data);
                                                                                              setTimeout(() => {
                                                                                                  focusTheInput();
                                                                                              }, 500);
                                                                                          }}
                                                                                      />
                                                                                      <svg
                                                                                          width="20"
                                                                                          height="15"
                                                                                          viewBox="0 0 20 15"
                                                                                          fill="none"
                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                          className="cursor-pointer"
                                                                                          onClick={() => {
                                                                                              focusTheInput();
                                                                                              setReply(el);
                                                                                          }}>
                                                                                          <path
                                                                                              d="M7.88182 11.85L1.02982 6.92997C0.868428 6.8346 0.734682 6.69881 0.641773 6.53598C0.548864 6.37316 0.5 6.18894 0.5 6.00147C0.5 5.81401 0.548864 5.62978 0.641773 5.46696C0.734682 5.30413 0.868428 5.16834 1.02982 5.07297L7.88182 0.14997C8.04516 0.0538978 8.23101 0.00275221 8.4205 0.00172478C8.60999 0.000697337 8.79639 0.0498245 8.96076 0.14412C9.12513 0.238416 9.26162 0.374522 9.35638 0.538622C9.45115 0.702722 9.50081 0.888974 9.50032 1.07847V2.99997C11.7503 2.99997 18.5003 2.99997 20.0003 15C16.2503 8.24997 9.50032 8.99997 9.50032 8.99997V10.9215C9.50032 11.7615 8.59132 12.2685 7.88182 11.8515V11.85Z"
                                                                                              fill="#5A5A62"
                                                                                          />
                                                                                      </svg>
                                                                                  </>
                                                                              )}

                                                                              <span
                                                                                  className={` ${
                                                                                      el?.isEmoji
                                                                                          ? 'bg-transparent'
                                                                                          : 'bg-themecolor '
                                                                                  } relative ml-2 px-2 py-2   w-auto 
                                                                        round-yellow Atmymessage   font-Proxima-Regular `}>
                                                                                  {el?.reply && (
                                                                                      <p
                                                                                          className=" line-clamp text-[13px] mb-2 px-2 pt-2    rounded-md bg-[#2A2A36] text-white"
                                                                                          dangerouslySetInnerHTML={{
                                                                                              __html: DOMPurify.sanitize(
                                                                                                  el?.reply?.body &&
                                                                                                      DoDecrypt(
                                                                                                          el?.reply
                                                                                                              ?.body
                                                                                                      )
                                                                                              )
                                                                                          }}></p>
                                                                                  )}

                                                                                  <p
                                                                                      className={`text-[#14141F]    braek  messageLink break-words ${
                                                                                          el?.isEmoji
                                                                                              ? 'text-[92px]'
                                                                                              : 'text-lg  '
                                                                                      }`}
                                                                                      dangerouslySetInnerHTML={{
                                                                                          __html: DOMPurify.sanitize(
                                                                                              el?.body &&
                                                                                                  DoDecrypt(el?.body)
                                                                                          )
                                                                                      }}></p>
                                                                              </span>
                                                                          </div>

                                                                          {el?.type == 'text' && (
                                                                              <p className="flex justify-end mt-1 text-right ">
                                                                                  {el?._id && (
                                                                                      <>
                                                                                          {' '}
                                                                                          {el?.seenBy?.length >=
                                                                                          data?.roomUsers?.length ? (
                                                                                              <svg
                                                                                                  width="16"
                                                                                                  height="16"
                                                                                                  viewBox="0 0 16 16"
                                                                                                  fill="none"
                                                                                                  xmlns="http://www.w3.org/2000/svg">
                                                                                                  <path
                                                                                                      d="M8.97065 4.97004C9.11151 4.83593 9.29897 4.76179 9.49346 4.76326C9.68796 4.76473 9.87427 4.8417 10.0131 4.97793C10.1519 5.11416 10.2324 5.29899 10.2375 5.49342C10.2427 5.68785 10.1721 5.87667 10.0406 6.02004L6.05065 11.01C5.98204 11.0839 5.89923 11.1432 5.80718 11.1844C5.71513 11.2256 5.61572 11.2478 5.5149 11.2496C5.41408 11.2515 5.31392 11.233 5.2204 11.1953C5.12689 11.1575 5.04194 11.1014 4.97065 11.03L2.32465 8.38404C2.25096 8.31538 2.19186 8.23258 2.15086 8.14058C2.10987 8.04858 2.08783 7.94927 2.08605 7.84857C2.08428 7.74786 2.1028 7.64783 2.14052 7.55445C2.17824 7.46106 2.23439 7.37622 2.30561 7.305C2.37683 7.23379 2.46166 7.17764 2.55505 7.13992C2.64844 7.1022 2.74847 7.08367 2.84917 7.08545C2.94987 7.08723 3.04918 7.10927 3.14118 7.15026C3.23318 7.19125 3.31598 7.25036 3.38465 7.32404L5.47865 9.41704L8.95065 4.99204C8.95687 4.98432 8.96355 4.97698 8.97065 4.97004V4.97004ZM8.05065 10.11L8.97065 11.03C9.04193 11.1012 9.12681 11.1573 9.22023 11.1949C9.31365 11.2325 9.41369 11.251 9.51439 11.2491C9.61509 11.2472 9.71438 11.2251 9.80634 11.184C9.8983 11.143 9.98105 11.0838 10.0496 11.01L14.0416 6.02004C14.1134 5.94924 14.1701 5.86472 14.2084 5.77152C14.2467 5.67832 14.2658 5.57835 14.2647 5.47758C14.2635 5.37682 14.242 5.27732 14.2015 5.18504C14.1611 5.09276 14.1024 5.00958 14.0291 4.94047C13.9557 4.87137 13.8692 4.81775 13.7747 4.78282C13.6801 4.74789 13.5796 4.73237 13.4789 4.73718C13.3782 4.742 13.2796 4.76705 13.1888 4.81084C13.0981 4.85462 13.0171 4.91625 12.9506 4.99204L9.47765 9.41704L8.99265 8.93104L8.04965 10.11H8.05065Z"
                                                                                                      fill="#777E77"
                                                                                                  />
                                                                                              </svg>
                                                                                          ) : (
                                                                                              <svg
                                                                                                  width="16"
                                                                                                  height="16"
                                                                                                  viewBox="0 0 16 16"
                                                                                                  fill="none"
                                                                                                  xmlns="http://www.w3.org/2000/svg">
                                                                                                  <path
                                                                                                      d="M10.9706 4.96999C11.1115 4.83588 11.299 4.76173 11.4935 4.76321C11.688 4.76468 11.8743 4.84165 12.0131 4.97787C12.1519 5.1141 12.2324 5.29893 12.2375 5.49336C12.2427 5.68779 12.1721 5.87661 12.0406 6.01999L8.05065 11.01C7.98204 11.0839 7.89923 11.1432 7.80718 11.1844C7.71513 11.2255 7.61572 11.2477 7.5149 11.2496C7.41408 11.2514 7.31392 11.2329 7.2204 11.1952C7.12689 11.1575 7.04194 11.1013 6.97065 11.03L4.32465 8.38399C4.25096 8.31532 4.19186 8.23252 4.15086 8.14052C4.10987 8.04853 4.08783 7.94921 4.08605 7.84851C4.08428 7.74781 4.1028 7.64778 4.14052 7.55439C4.17824 7.461 4.23439 7.37617 4.30561 7.30495C4.37683 7.23373 4.46166 7.17758 4.55505 7.13986C4.64844 7.10214 4.74847 7.08362 4.84917 7.08539C4.94987 7.08717 5.04918 7.10921 5.14118 7.15021C5.23318 7.1912 5.31598 7.2503 5.38465 7.32399L7.47865 9.41699L10.9516 4.99199C10.9579 4.98429 10.9646 4.97694 10.9716 4.96999H10.9706Z"
                                                                                                      fill="#777E77"
                                                                                                  />
                                                                                              </svg>
                                                                                          )}
                                                                                      </>
                                                                                  )}

                                                                                  {el?.createdAt &&
                                                                                      moment(el?.createdAt).format(
                                                                                          'hh:mm A'
                                                                                      )}
                                                                              </p>
                                                                          )}
                                                                      </div>
                                                                  )}
                                                              </div>
                                                              <div className="relative mt-3">
                                                                  {el?.type == 'video' && (
                                                                      <>
                                                                          <div className="flex ">
                                                                              <Messagedrodpdown
                                                                                  //   message={el}
                                                                                  data={el}
                                                                                  setMessage={setMessage}
                                                                                  setWholeMessage={setWholeMessage}
                                                                              />
                                                                              <figure className="Atfilefover bg-[#29303a] min-w-[148px] max-w-[148px] min-h-[126px] max-h-[126px] rounded-[5px]">
                                                                                  <video
                                                                                      id="video-summary"
                                                                                      width={148}
                                                                                      height={125}
                                                                                      controls
                                                                                      controlsList="nodownload"
                                                                                      src={el?.attachment}
                                                                                  />
                                                                              </figure>
                                                                          </div>

                                                                          <p className="flex justify-end mt-1 text-right ">
                                                                              {el?._id && (
                                                                                  <>
                                                                                      {' '}
                                                                                      {el?.seenBy?.length >=
                                                                                      data?.roomUsers?.length ? (
                                                                                          <svg
                                                                                              width="16"
                                                                                              height="16"
                                                                                              viewBox="0 0 16 16"
                                                                                              fill="none"
                                                                                              xmlns="http://www.w3.org/2000/svg">
                                                                                              <path
                                                                                                  d="M8.97065 4.97004C9.11151 4.83593 9.29897 4.76179 9.49346 4.76326C9.68796 4.76473 9.87427 4.8417 10.0131 4.97793C10.1519 5.11416 10.2324 5.29899 10.2375 5.49342C10.2427 5.68785 10.1721 5.87667 10.0406 6.02004L6.05065 11.01C5.98204 11.0839 5.89923 11.1432 5.80718 11.1844C5.71513 11.2256 5.61572 11.2478 5.5149 11.2496C5.41408 11.2515 5.31392 11.233 5.2204 11.1953C5.12689 11.1575 5.04194 11.1014 4.97065 11.03L2.32465 8.38404C2.25096 8.31538 2.19186 8.23258 2.15086 8.14058C2.10987 8.04858 2.08783 7.94927 2.08605 7.84857C2.08428 7.74786 2.1028 7.64783 2.14052 7.55445C2.17824 7.46106 2.23439 7.37622 2.30561 7.305C2.37683 7.23379 2.46166 7.17764 2.55505 7.13992C2.64844 7.1022 2.74847 7.08367 2.84917 7.08545C2.94987 7.08723 3.04918 7.10927 3.14118 7.15026C3.23318 7.19125 3.31598 7.25036 3.38465 7.32404L5.47865 9.41704L8.95065 4.99204C8.95687 4.98432 8.96355 4.97698 8.97065 4.97004V4.97004ZM8.05065 10.11L8.97065 11.03C9.04193 11.1012 9.12681 11.1573 9.22023 11.1949C9.31365 11.2325 9.41369 11.251 9.51439 11.2491C9.61509 11.2472 9.71438 11.2251 9.80634 11.184C9.8983 11.143 9.98105 11.0838 10.0496 11.01L14.0416 6.02004C14.1134 5.94924 14.1701 5.86472 14.2084 5.77152C14.2467 5.67832 14.2658 5.57835 14.2647 5.47758C14.2635 5.37682 14.242 5.27732 14.2015 5.18504C14.1611 5.09276 14.1024 5.00958 14.0291 4.94047C13.9557 4.87137 13.8692 4.81775 13.7747 4.78282C13.6801 4.74789 13.5796 4.73237 13.4789 4.73718C13.3782 4.742 13.2796 4.76705 13.1888 4.81084C13.0981 4.85462 13.0171 4.91625 12.9506 4.99204L9.47765 9.41704L8.99265 8.93104L8.04965 10.11H8.05065Z"
                                                                                                  fill="#777E77"
                                                                                              />
                                                                                          </svg>
                                                                                      ) : (
                                                                                          <svg
                                                                                              width="16"
                                                                                              height="16"
                                                                                              viewBox="0 0 16 16"
                                                                                              fill="none"
                                                                                              xmlns="http://www.w3.org/2000/svg">
                                                                                              <path
                                                                                                  d="M10.9706 4.96999C11.1115 4.83588 11.299 4.76173 11.4935 4.76321C11.688 4.76468 11.8743 4.84165 12.0131 4.97787C12.1519 5.1141 12.2324 5.29893 12.2375 5.49336C12.2427 5.68779 12.1721 5.87661 12.0406 6.01999L8.05065 11.01C7.98204 11.0839 7.89923 11.1432 7.80718 11.1844C7.71513 11.2255 7.61572 11.2477 7.5149 11.2496C7.41408 11.2514 7.31392 11.2329 7.2204 11.1952C7.12689 11.1575 7.04194 11.1013 6.97065 11.03L4.32465 8.38399C4.25096 8.31532 4.19186 8.23252 4.15086 8.14052C4.10987 8.04853 4.08783 7.94921 4.08605 7.84851C4.08428 7.74781 4.1028 7.64778 4.14052 7.55439C4.17824 7.461 4.23439 7.37617 4.30561 7.30495C4.37683 7.23373 4.46166 7.17758 4.55505 7.13986C4.64844 7.10214 4.74847 7.08362 4.84917 7.08539C4.94987 7.08717 5.04918 7.10921 5.14118 7.15021C5.23318 7.1912 5.31598 7.2503 5.38465 7.32399L7.47865 9.41699L10.9516 4.99199C10.9579 4.98429 10.9646 4.97694 10.9716 4.96999H10.9706Z"
                                                                                                  fill="#777E77"
                                                                                              />
                                                                                          </svg>
                                                                                      )}
                                                                                  </>
                                                                              )}
                                                                              {el?.createdAt &&
                                                                                  moment(el?.createdAt).format(
                                                                                      'hh:mm A'
                                                                                  )}
                                                                          </p>
                                                                      </>
                                                                  )}
                                                                  {el?.type == 'image' && (
                                                                      <>
                                                                          <div className="flex ">
                                                                              <Messagedrodpdown
                                                                                  //   message={el}
                                                                                  data={el}
                                                                                  setMessage={setMessage}
                                                                                  setWholeMessage={setWholeMessage}
                                                                              />
                                                                              <figure
                                                                                  className="Atfilefover Atmsgfile min-w-[148px] max-w-[148px] min-h-[126px] max-h-[126px] rounded-[5px] cursor-pointer"
                                                                                  onClick={() => {
                                                                                      setDataa(el?.attachment);
                                                                                      setPopup(true);
                                                                                      setstatepop(45);
                                                                                  }}>
                                                                                  <ImageComponent
                                                                                      width={200}
                                                                                      height={100}
                                                                                      className=""
                                                                                      src={el?.attachment}
                                                                                      quality={50}
                                                                                      alt=""
                                                                                  />
                                                                              </figure>
                                                                          </div>

                                                                          <p className="flex justify-end mt-1 text-right ">
                                                                              {el?._id && (
                                                                                  <>
                                                                                      {' '}
                                                                                      {el?.seenBy?.length >=
                                                                                      data?.roomUsers?.length ? (
                                                                                          <svg
                                                                                              width="16"
                                                                                              height="16"
                                                                                              viewBox="0 0 16 16"
                                                                                              fill="none"
                                                                                              xmlns="http://www.w3.org/2000/svg">
                                                                                              <path
                                                                                                  d="M8.97065 4.97004C9.11151 4.83593 9.29897 4.76179 9.49346 4.76326C9.68796 4.76473 9.87427 4.8417 10.0131 4.97793C10.1519 5.11416 10.2324 5.29899 10.2375 5.49342C10.2427 5.68785 10.1721 5.87667 10.0406 6.02004L6.05065 11.01C5.98204 11.0839 5.89923 11.1432 5.80718 11.1844C5.71513 11.2256 5.61572 11.2478 5.5149 11.2496C5.41408 11.2515 5.31392 11.233 5.2204 11.1953C5.12689 11.1575 5.04194 11.1014 4.97065 11.03L2.32465 8.38404C2.25096 8.31538 2.19186 8.23258 2.15086 8.14058C2.10987 8.04858 2.08783 7.94927 2.08605 7.84857C2.08428 7.74786 2.1028 7.64783 2.14052 7.55445C2.17824 7.46106 2.23439 7.37622 2.30561 7.305C2.37683 7.23379 2.46166 7.17764 2.55505 7.13992C2.64844 7.1022 2.74847 7.08367 2.84917 7.08545C2.94987 7.08723 3.04918 7.10927 3.14118 7.15026C3.23318 7.19125 3.31598 7.25036 3.38465 7.32404L5.47865 9.41704L8.95065 4.99204C8.95687 4.98432 8.96355 4.97698 8.97065 4.97004V4.97004ZM8.05065 10.11L8.97065 11.03C9.04193 11.1012 9.12681 11.1573 9.22023 11.1949C9.31365 11.2325 9.41369 11.251 9.51439 11.2491C9.61509 11.2472 9.71438 11.2251 9.80634 11.184C9.8983 11.143 9.98105 11.0838 10.0496 11.01L14.0416 6.02004C14.1134 5.94924 14.1701 5.86472 14.2084 5.77152C14.2467 5.67832 14.2658 5.57835 14.2647 5.47758C14.2635 5.37682 14.242 5.27732 14.2015 5.18504C14.1611 5.09276 14.1024 5.00958 14.0291 4.94047C13.9557 4.87137 13.8692 4.81775 13.7747 4.78282C13.6801 4.74789 13.5796 4.73237 13.4789 4.73718C13.3782 4.742 13.2796 4.76705 13.1888 4.81084C13.0981 4.85462 13.0171 4.91625 12.9506 4.99204L9.47765 9.41704L8.99265 8.93104L8.04965 10.11H8.05065Z"
                                                                                                  fill="#777E77"
                                                                                              />
                                                                                          </svg>
                                                                                      ) : (
                                                                                          <svg
                                                                                              width="16"
                                                                                              height="16"
                                                                                              viewBox="0 0 16 16"
                                                                                              fill="none"
                                                                                              xmlns="http://www.w3.org/2000/svg">
                                                                                              <path
                                                                                                  d="M10.9706 4.96999C11.1115 4.83588 11.299 4.76173 11.4935 4.76321C11.688 4.76468 11.8743 4.84165 12.0131 4.97787C12.1519 5.1141 12.2324 5.29893 12.2375 5.49336C12.2427 5.68779 12.1721 5.87661 12.0406 6.01999L8.05065 11.01C7.98204 11.0839 7.89923 11.1432 7.80718 11.1844C7.71513 11.2255 7.61572 11.2477 7.5149 11.2496C7.41408 11.2514 7.31392 11.2329 7.2204 11.1952C7.12689 11.1575 7.04194 11.1013 6.97065 11.03L4.32465 8.38399C4.25096 8.31532 4.19186 8.23252 4.15086 8.14052C4.10987 8.04853 4.08783 7.94921 4.08605 7.84851C4.08428 7.74781 4.1028 7.64778 4.14052 7.55439C4.17824 7.461 4.23439 7.37617 4.30561 7.30495C4.37683 7.23373 4.46166 7.17758 4.55505 7.13986C4.64844 7.10214 4.74847 7.08362 4.84917 7.08539C4.94987 7.08717 5.04918 7.10921 5.14118 7.15021C5.23318 7.1912 5.31598 7.2503 5.38465 7.32399L7.47865 9.41699L10.9516 4.99199C10.9579 4.98429 10.9646 4.97694 10.9716 4.96999H10.9706Z"
                                                                                                  fill="#777E77"
                                                                                              />
                                                                                          </svg>
                                                                                      )}
                                                                                  </>
                                                                              )}
                                                                              {el?.createdAt &&
                                                                                  moment(el?.createdAt).format(
                                                                                      'hh:mm A'
                                                                                  )}
                                                                          </p>
                                                                      </>
                                                                  )}
                                                              </div>
                                                          </div>
                                                      </div>
                                                  ) : (
                                                      <>
                                                          {data.type == 'GROUP' && (
                                                              <div>
                                                                  <p className=" pl-[45px] ">
                                                                      {index > 0 &&
                                                                      array[index]?.sendBy?._id !=
                                                                          array[index - 1]?.sendBy?._id
                                                                          ? el.sendBy.firstName
                                                                          : ''}
                                                                  </p>
                                                              </div>
                                                          )}
                                                          <div className="flex justify-start px-3">
                                                              <div className="inline-block ">
                                                                  {' '}
                                                                  <div className="flex items-start mt-2 justify">
                                                                      {data.type == 'GROUP' && (
                                                                          <figure className=" w-[30px]  mr-2  h-[30px] flex-shrink-0 relative rounded-full  ">
                                                                              {index < array.length &&
                                                                                  array[index]?.sendBy?._id !=
                                                                                      array[index + 1]?.sendBy?._id && (
                                                                                      <div>
                                                                                          <Link
                                                                                              legacyBehavior
                                                                                              href={`/profile/${el?.sendBy?.userName}`}>
                                                                                              <a>
                                                                                                  {el?.sendBy
                                                                                                      ?.avatar ? (
                                                                                                      <ImageComponent
                                                                                                          className="rounded-full"
                                                                                                          src={
                                                                                                              el?.sendBy
                                                                                                                  ?.avatar
                                                                                                          }
                                                                                                          height={30}
                                                                                                          width={30}
                                                                                                          transformation={
                                                                                                              TRANSFORMATION_NAMES.fit_50x50
                                                                                                          }
                                                                                                          alt=""
                                                                                                      />
                                                                                                  ) : (
                                                                                                      <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                                                                          {el?.sendBy?.firstName
                                                                                                              .charAt(0)
                                                                                                              .toUpperCase()}
                                                                                                      </p>
                                                                                                  )}
                                                                                              </a>
                                                                                          </Link>
                                                                                      </div>
                                                                                  )}
                                                                          </figure>
                                                                      )}

                                                                      <div className="flex flex-col ">
                                                                          {el?.body && (
                                                                              <div className="mb-3">
                                                                                  <div className="flex items-center gap-2 Atreplymesgstyle">
                                                                                      <span
                                                                                          className={`Atothermes w-auto  max-w-[270px] ${
                                                                                              el?.isEmoji
                                                                                                  ? 'bg-transparent'
                                                                                                  : 'bg-[#7B7B7B]'
                                                                                          } px-2 py-2    rounded-[10px]  break-words  braek  `}>
                                                                                          {el?.reply && (
                                                                                              <p
                                                                                                  className=" line-clamp text-[13px] mb-2    px-2 pt-2
                                                                                  rounded-md text-white bg-[#2A2A36]"
                                                                                                  dangerouslySetInnerHTML={{
                                                                                                      __html: DOMPurify.sanitize(
                                                                                                          el?.reply
                                                                                                              ?.body &&
                                                                                                              DoDecrypt(
                                                                                                                  el
                                                                                                                      ?.reply
                                                                                                                      ?.body
                                                                                                              )
                                                                                                      )
                                                                                                  }}></p>
                                                                                          )}
                                                                                          <p
                                                                                              className={`text-white   messageLink   ${
                                                                                                  el?.isEmoji
                                                                                                      ? 'text-[92px]  '
                                                                                                      : 'text-base   '
                                                                                              }`}
                                                                                              dangerouslySetInnerHTML={{
                                                                                                  __html: DOMPurify.sanitize(
                                                                                                      el?.body &&
                                                                                                          DoDecrypt(
                                                                                                              el?.body
                                                                                                          )
                                                                                                  )
                                                                                              }}>
                                                                                              {/* <p>Testing</p> */}
                                                                                              {/* {DoEncrypt(el?.body)} */}

                                                                                              {/* {el?.body && (
                                                                                  <SingleMessage data={el?.body} />
                                                                              )} */}
                                                                                          </p>
                                                                                      </span>
                                                                                      {el?.type == 'text' && (
                                                                                          <svg
                                                                                              width="20"
                                                                                              height="15"
                                                                                              viewBox="0 0 20 15"
                                                                                              fill="none"
                                                                                              xmlns="http://www.w3.org/2000/svg"
                                                                                              className="cursor-pointer"
                                                                                              onClick={() => {
                                                                                                  focusTheInput();
                                                                                                  setReply(el);
                                                                                              }}>
                                                                                              <path
                                                                                                  d="M7.88182 11.85L1.02982 6.92997C0.868428 6.8346 0.734682 6.69881 0.641773 6.53598C0.548864 6.37316 0.5 6.18894 0.5 6.00147C0.5 5.81401 0.548864 5.62978 0.641773 5.46696C0.734682 5.30413 0.868428 5.16834 1.02982 5.07297L7.88182 0.14997C8.04516 0.0538978 8.23101 0.00275221 8.4205 0.00172478C8.60999 0.000697337 8.79639 0.0498245 8.96076 0.14412C9.12513 0.238416 9.26162 0.374522 9.35638 0.538622C9.45115 0.702722 9.50081 0.888974 9.50032 1.07847V2.99997C11.7503 2.99997 18.5003 2.99997 20.0003 15C16.2503 8.24997 9.50032 8.99997 9.50032 8.99997V10.9215C9.50032 11.7615 8.59132 12.2685 7.88182 11.8515V11.85Z"
                                                                                                  fill="#5A5A62"
                                                                                              />
                                                                                          </svg>
                                                                                      )}
                                                                                  </div>

                                                                                  {/* {DoEncrypt(el?.body)} */}
                                                                                  <p className="mt-1">
                                                                                      {el?.type == 'text' &&
                                                                                          el?.createdAt &&
                                                                                          moment(el?.createdAt).format(
                                                                                              'hh:mm A'
                                                                                          )}
                                                                                  </p>
                                                                              </div>
                                                                          )}
                                                                          <div className="relative mt-3">
                                                                              {el?.type == 'video' && (
                                                                                  <>
                                                                                      <figure className="Atfilefover bg-[#29303a] min-w-[148px] max-w-[148px] min-h-[126px] max-h-[126px] rounded-[5px]">
                                                                                          <video
                                                                                              id="video-summary"
                                                                                              width={148}
                                                                                              height={125}
                                                                                              controls
                                                                                              controlsList="nodownload"
                                                                                              src={el?.attachment}
                                                                                          />
                                                                                      </figure>
                                                                                      <p className="mt-1">
                                                                                          {el?.createdAt &&
                                                                                              moment(
                                                                                                  el?.createdAt
                                                                                              ).format('hh:mm A')}
                                                                                      </p>
                                                                                  </>
                                                                              )}
                                                                              {el?.type == 'image' && (
                                                                                  <>
                                                                                      <figure
                                                                                          className="Atfilefover Atmsgfile  min-w-[148px] max-w-[148px] min-h-[126px] max-h-[126px] rounded-[5px] cursor-pointer"
                                                                                          onClick={() => {
                                                                                              setDataa(el?.attachment);
                                                                                              setPopup(true);
                                                                                              setstatepop(45);
                                                                                          }}>
                                                                                          <ImageComponent
                                                                                              width={200}
                                                                                              height={100}
                                                                                              className=""
                                                                                              src={el?.attachment}
                                                                                              quality={50}
                                                                                              alt=""
                                                                                          />
                                                                                      </figure>
                                                                                      <span className="mt-1">
                                                                                          {el?.createdAt &&
                                                                                              moment(
                                                                                                  el?.createdAt
                                                                                              ).format('hh:mm A')}
                                                                                      </span>
                                                                                  </>
                                                                              )}
                                                                          </div>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </>
                                                  )}
                                              </>
                                          );
                                      })
                                    : null}
                                <form
                                    className=""
                                    onSubmit={(e: any) => {
                                        !loadinUpload && messageHanlder(e);
                                    }}>
                                    {/* File Select area Start*/}
                                    {file && (
                                        <div className="w-full bg-[#14141f] absolute z-[2] bottom-[10px] p-[10px] left-0 border-t-[1px] border-[#262639] ">
                                            <div className="relative flex items-center">
                                                <figure className="flex-shrink-0 mr-[12px] w-[38px] h-[38px] overflow-hidden rounded-lg">
                                                    {type == 'image' && (
                                                        <Image
                                                            className="rounded-lg"
                                                            width={38}
                                                            height={38}
                                                            src={URL.createObjectURL(file)}
                                                            alt="File Image"
                                                        />
                                                    )}
                                                    {type == 'video' && (
                                                        <video
                                                            className="rounded-lg"
                                                            width={38}
                                                            height={38}
                                                            src={URL.createObjectURL(
                                                                new Blob([file], { type: 'video/mp4' })
                                                            )}
                                                        />
                                                    )}
                                                </figure>
                                                <div>
                                                    <h5 className="text-white text-sm font-Proxima-SemiBold max-w-[200px] truncate">
                                                        {file.name}
                                                    </h5>
                                                    {loadinUpload ? (
                                                        <ImSpinner9 className="text-2xl animate-spin" />
                                                    ) : (
                                                        <span className="block text-[#727279] text-xs">
                                                            {file.size / 1000 > 1000
                                                                ? (file.size / 1000000).toFixed(2) + 'mb'
                                                                : (file.size / 1000).toFixed(2) + 'kb'}
                                                        </span>
                                                    )}
                                                </div>
                                                {!loadinUpload && (
                                                    <div
                                                        className="absolute right-0 -translate-y-1/2 cursor-pointer top-1/2"
                                                        onClick={(e: any) => {
                                                            setFile(null);
                                                            setType('');
                                                            setSrc(null);
                                                        }}>
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 16 16"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M15.5 8C15.5 8.98491 15.306 9.96018 14.9291 10.8701C14.5522 11.7801 13.9997 12.6069 13.3033 13.3033C12.6069 13.9997 11.7801 14.5522 10.8701 14.9291C9.96018 15.306 8.98491 15.5 8 15.5C7.01509 15.5 6.03982 15.306 5.12987 14.9291C4.21993 14.5522 3.39314 13.9997 2.6967 13.3033C2.00026 12.6069 1.44781 11.7801 1.0709 10.8701C0.693993 9.96018 0.5 8.98491 0.5 8C0.5 6.01088 1.29018 4.10322 2.6967 2.6967C4.10322 1.29018 6.01088 0.5 8 0.5C9.98912 0.5 11.8968 1.29018 13.3033 2.6967C14.7098 4.10322 15.5 6.01088 15.5 8ZM11.09 6.09C11.1675 6.01252 11.2289 5.92054 11.2709 5.81931C11.3128 5.71807 11.3344 5.60957 11.3344 5.5C11.3344 5.39043 11.3128 5.28193 11.2709 5.18069C11.2289 5.07946 11.1675 4.98748 11.09 4.91C11.0125 4.83252 10.9205 4.77106 10.8193 4.72913C10.7181 4.6872 10.6096 4.66561 10.5 4.66561C10.3904 4.66561 10.2819 4.6872 10.1807 4.72913C10.0795 4.77106 9.98748 4.83252 9.91 4.91L8 6.82167L6.09 4.91C5.93352 4.75352 5.72129 4.66561 5.5 4.66561C5.27871 4.66561 5.06648 4.75352 4.91 4.91C4.75352 5.06648 4.66561 5.27871 4.66561 5.5C4.66561 5.72129 4.75352 5.93352 4.91 6.09L6.82167 8L4.91 9.91C4.75352 10.0665 4.66561 10.2787 4.66561 10.5C4.66561 10.7213 4.75352 10.9335 4.91 11.09C5.06648 11.2465 5.27871 11.3344 5.5 11.3344C5.72129 11.3344 5.93352 11.2465 6.09 11.09L8 9.17833L9.91 11.09C10.0665 11.2465 10.2787 11.3344 10.5 11.3344C10.7213 11.3344 10.9335 11.2465 11.09 11.09C11.2465 10.9335 11.3344 10.7213 11.3344 10.5C11.3344 10.2787 11.2465 10.0665 11.09 9.91L9.17833 8L11.09 6.09Z"
                                                                fill="#89898F"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {/* File Select area Start*/}
                                </form>
                                <div
                                    className={`  pr-4 flex items-end bottom-[100px] pb-4 w-[100%]  left-0 fixed  z-[2]  `}>
                                    {mentionUi && (
                                        <div className="absolute w-full p-4 space-y-2 bottom-16 ">
                                            {userMentions?.map((entry: any, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="color-[#fff]  !bottom-[0px] !top-auto cursor-pointer border-[#89898F]"
                                                        onClick={() => {
                                                            setMentionedUser(entry?.userName);
                                                        }}>
                                                        <div className="flex items-center ">
                                                            <figure className="w-[20px] h-[20px] relative !rounded-full flex items-center justify-center mr-[5px] UerProfileImage !overflow-hidden">
                                                                {entry?.avatar ? (
                                                                    <ImageComponent
                                                                        width={40}
                                                                        height={40}
                                                                        className="rounded-full"
                                                                        src={entry?.avatar}
                                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <p className="w-full h-full  !bg-themecolor  flex items-center justify-center rounded-full text-black1 text-sm pt-0.5">
                                                                        {entry?.firstName.charAt(0).toUpperCase()}
                                                                    </p>
                                                                )}{' '}
                                                            </figure>
                                                            <div className="ml-2">
                                                                <h3 className="text-base text-white">
                                                                    {entry?.firstName} {entry?.lastName}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {typing && typingUserName != user?.userName && (
                                <div
                                    className={`w-full  bg-[#14141f] fixed z-[2]  ${
                                        file || reply ? 'bottom-[70px]' : 'bottom-[175px]'
                                    }  left-0 border-t-[1px] border-[#262639]  `}>
                                    <p className={` text-left text-[12px] pl-4 py-2   `}>
                                        {typingUserName} is typing ....
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative my-2">
                        {reply && (
                            <div className=" pl-4 pr-6 py-4   bg-[#14141F] hover:bg-[#25252c] w-full border-transparent  border border-t-[#2B2B35] text-base font-Circular-Book  outline-none  text-white leading-[0] ">
                                <p
                                    className="text-[#b8b8bc] text-sm truncate mt-6 mx-1 !break font-Proxima-Regular "
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(reply?.body && DoDecrypt(reply?.body))
                                    }}></p>
                                <p className="absolute text-sm text-white font-Proxima-SemiBold top-3 left-4 hover:text-themecolor">
                                    Replying to
                                </p>
                                <div className="absolute top-4 right-4 AtReplyingHover">
                                    <svg
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setReply(null);
                                        }}
                                        width="11"
                                        height="11"
                                        viewBox="0 0 9 9"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.5009 4.49992L8.21469 8.21372M0.787109 8.21372L4.5009 4.49992L0.787109 8.21372ZM8.21469 0.786133L4.50019 4.49992L8.21469 0.786133ZM4.50019 4.49992L0.787109 0.786133L4.50019 4.49992Z"
                                            stroke="#A1A1A5"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div className="pl-[40px] pr-[34px] relative">
                            <label className="absolute  z-20  cursor-pointer !bottom-2.5 left-1">
                                <input
                                    disabled={file || reply}
                                    type="file"
                                    // value={''}
                                    onClick={(event: any) => {
                                        event.target.value = null;
                                    }}
                                    accept=",video/*,image/*"
                                    className="absolute w-0 "
                                    onChange={(e: any) => {
                                        e.preventDefault();
                                        uploadtoS3(e.target.files[0]);
                                    }}
                                />
                                <div className="h-[28px] w-[28px] font-Proxima-Bold text-xl  text-themecolor rounded-full bg-[#43434C] flex justify-center items-center">
                                    <svg
                                        width="29"
                                        height="29"
                                        viewBox="0 0 29 29"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.5003 0.357422C22.3107 0.357422 28.6431 6.68989 28.6431 14.5003C28.6431 22.3107 22.3107 28.6431 14.5003 28.6431C6.68989 28.6431 0.357422 22.3107 0.357422 14.5003C0.357422 6.68989 6.68989 0.357422 14.5003 0.357422ZM14.5003 7.42885C14.2867 7.42886 14.0803 7.50622 13.9193 7.64661C13.7583 7.78701 13.6537 7.98095 13.6246 8.19256L13.6164 8.31278V13.6164H8.31278C8.08882 13.6164 7.87324 13.7015 7.7096 13.8544C7.54595 14.0073 7.44644 14.2166 7.43118 14.44C7.41591 14.6635 7.48603 14.8844 7.62736 15.0581C7.76869 15.2318 7.9707 15.3454 8.19256 15.376L8.31278 15.3842H13.6164V20.6878C13.6164 20.9117 13.7015 21.1273 13.8544 21.291C14.0073 21.4546 14.2166 21.5541 14.44 21.5694C14.6635 21.5846 14.8844 21.5145 15.0581 21.3732C15.2318 21.2319 15.3454 21.0299 15.376 20.808L15.3842 20.6878V15.3842H20.6878C20.9117 15.3841 21.1273 15.2991 21.291 15.1462C21.4546 14.9933 21.5541 14.784 21.5694 14.5605C21.5846 14.3371 21.5145 14.1162 21.3732 13.9425C21.2319 13.7687 21.0299 13.6551 20.808 13.6246L20.6878 13.6164H15.3842V8.31278C15.3842 8.07835 15.2911 7.85352 15.1253 7.68775C14.9595 7.52198 14.7347 7.42885 14.5003 7.42885Z"
                                            fill="#F1C94A"
                                        />
                                    </svg>
                                </div>
                            </label>
                            {/* {data1?.type == 'PRIVATE' && ( */}
                            <div className="relative bg-[#14141F] rounded-md ">
                                <TextArea
                                    autoFocus
                                    name="text"
                                    id="TYPE__"
                                    disabled={loadinUpload}
                                    value={message}
                                    onchange={(e: any) => {
                                        if (e.nativeEvent.data != ' ') {
                                            if (trigger) {
                                                setTrigger(false);
                                                _io.emit('TYPING_FRONTEND', {
                                                    room: data1?._id,
                                                    user: user?.userName
                                                });

                                                setTimeout(() => {
                                                    setTrigger(true);
                                                }, 3000);
                                            }
                                            if (urlRegex.test(e.target.value)) {
                                                toast.error('Invalid text');
                                            } else {
                                                checkMention(e);
                                                // !urlRegex.test(e.target.value) &&
                                                //     setMessage(e.target.value);
                                            }
                                        }
                                        if (e.nativeEvent.data === ' ') {
                                            if (message.length > 0) {
                                                if (trigger) {
                                                    setTrigger(false);
                                                    _io.emit('TYPING_FRONTEND', {
                                                        room: data1?._id,
                                                        user: user?.userName
                                                    });

                                                    setTimeout(() => {
                                                        setTrigger(true);
                                                    }, 3000);
                                                }
                                                if (urlRegex.test(e.target.value)) {
                                                    toast.error('Invalid text');
                                                } else {
                                                    checkMention(e);
                                                    // !urlRegex.test(e.target.value) &&
                                                    //     setMessage(e.target.value);
                                                }
                                            }
                                        }
                                    }}
                                    styles=" !px-0   !py-0   !border-[#2B2B35] bg-[#14141f]   leading-[0]   !rounded-[10px] "
                                    className="px-6 pr-[48px] pl-[12px] h-[45px] py-3  placeholder:text-[#89898F]  !rounded-[10px]"
                                    placeholder={isDragActive ? 'Drop the files here ...' : 'Type your message'}
                                />
                                <div className="">
                                    {/* <EmojiPicker setEmoji={onEmojiClick} /> */}
                                    {emojo}
                                </div>
                            </div>
                            {/* )} */}
                            {/* {data1?.type == 'GROUP' && (
                                        <MentionedMessage
                                            aboveref={focusInput}
                                            message={message}
                                            setMessage={setMessage}
                                            trigger={trigger}
                                            setTrigger={setTrigger}
                                            userMentions={userMentions}
                                            data1={data1}
                                            user={user}
                                            isDragActive={isDragActive}
                                            loadinUpload={loadinUpload}
                                            height={true}
                                        />
                                    )} */}
                            <p
                                className="text-white w-[22px]  AtChatMessageIcon h-[22px]  bg-transparent rounded-full flex items-center justify-center cursor-pointer  border-l-[#2B2B35] text-sm font-Proxima-Regular absolute right-1 bottom-[0.7rem]"
                                onClick={(e: any) => {
                                    !loadinUpload && messageHanlder(e);
                                }}>
                                {' '}
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1.72415 1.05281C1.64045 1.01095 1.54668 0.993419 1.45351 1.00221C1.36034 1.01101 1.27151 1.04577 1.19711 1.10255C1.12272 1.15934 1.06576 1.23586 1.03271 1.32341C0.999658 1.41096 0.991841 1.50604 1.01015 1.59781L2.41315 6.44781C2.43931 6.5382 2.49044 6.61936 2.56067 6.68198C2.6309 6.74461 2.71737 6.78614 2.81015 6.80181L8.50015 7.75481C8.76815 7.80781 8.76815 8.19181 8.50015 8.24481L2.81015 9.19781C2.71737 9.21349 2.6309 9.25502 2.56067 9.31764C2.49044 9.38026 2.43931 9.46143 2.41315 9.55181L1.01015 14.4018C0.991841 14.4936 0.999658 14.5887 1.03271 14.6762C1.06576 14.7638 1.12272 14.8403 1.19711 14.8971C1.27151 14.9539 1.36034 14.9886 1.45351 14.9974C1.54668 15.0062 1.64045 14.9887 1.72415 14.9468L14.7241 8.44681C14.8071 8.40524 14.8768 8.34142 14.9256 8.26248C14.9743 8.18353 15.0001 8.09259 15.0001 7.99981C15.0001 7.90704 14.9743 7.81609 14.9256 7.73715C14.8768 7.65821 14.8071 7.59438 14.7241 7.55281L1.72415 1.05281Z"
                                        fill="#fff"
                                    />
                                </svg>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {statepop && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={statepop}
                    data={dataa}
                    setstate={setstatepop}
                    setData={setDataa}
                />
            )}
        </div>
    );
};
export default Messages;
