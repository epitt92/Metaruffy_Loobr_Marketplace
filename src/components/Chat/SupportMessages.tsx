import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import Input from '../input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { _io } from '../../services/socket.service';
import { SEND_NEW_MESSAGE } from '../../constants/socketEvents';
import { sendMessage, seenMessage, connectRoomSupport } from '../../redux/messages/actions';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import Deletedropdown from '../Deletedropdown';
import { id } from 'ethers/lib/utils';
import useAudio from '../../hooks/useAudio';
import dynamic from 'next/dynamic';
import { ImSpinner9 } from 'react-icons/im';
import Popups from '../popup/poups';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import ReactS3Client from 'react-aws-s3-typescript';
import { s3Config } from '../../services/s3.service';
import { DoDecrypt, DoEncrypt } from '../../services/aes.service';
import SingleMessage from './components/messageText';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { generateFileUrl, uploadFile } from '../../services/upload.service';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import TextArea from '../textArea/textArea';

interface IProps {
    // data1: any;
    // index: number;
    // closeHandler: Function;
    // openChatHeadHandle: Function;
    // openedChatHead: any;
    // close: boolean;
    // setClose: Function;
    setOpenSupport: Function;
    setsupportHeadOpened: Function;
    supportHeadOpened: boolean;
}

const SupportMessages = ({
    setOpenSupport,
    supportHeadOpened,
    setsupportHeadOpened
}: // data1,
// closeHandler,
// index,
// openChatHeadHandle,
// openedChatHead,
// setClose,
// close,

IProps) => {
    const [state, setstate] = useState(true);
    const [statepop, setstatepop] = useState<any>(false);
    const [popup, setPopup] = useState(false);
    const [dataa, setDataa] = useState<any>('');
    const [data, setData] = useState<any>();

    const ToggleClass = () => {
        // setstate(!state);
    };

    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const roomSupport = useSelector((state: any) => state.chat.adminRoom);
    const [newMessage, setNewMessage] = useState(null);
    const [sendedMessage, setSentMessage] = useState(null);
    const [allMessages, setAllMessages] = useState<any>([]);
    const [message, setMessage] = useState<any>('');
    const [type, setType] = useState<any>('');
    const [file, setFile] = useState<any>(null);
    const [src, setSrc] = useState<any>(null);

    const [blockedUser, setBlocked] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
    const onlineUsers = useSelector((state: any) => state.auth.onlineUser);
    const [loadinUpload, setLoadingUpload] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    var urlRegex = /<\/?[a-z][\s\S]*>/g;
    useEffect(() => {
        if (roomSupport) {
            setData(roomSupport);
            listenSocket(roomSupport?._id);
            dispatch(seenMessage({ roomId: roomSupport?._id }));
            setLoadingMessage(true);
            axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/message/messages?room=${roomSupport._id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((res) => {
                    setLoadingMessage(false);
                    setAllMessages(res.data.data.messages);
                })
                .catch((err) => {
                    setLoadingMessage(false);
                    // console.log(err.response);
                    toast.error(err?.response?.data?.message);
                });
        }
    }, [roomSupport]);
    useEffect(() => {
        dispatch(connectRoomSupport());
    }, []);
    const onDrop = useCallback((acceptedFiles) => {
        uploadtoS3(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'video/*': ['.png', '.jpg', '.jpeg']
        }
    });

    const onEmojiClick = (emoji: any) => {
        let a = message.concat(emoji);
        setMessage(a);
    };
    const [playing, toggle] = useAudio('/LOOBR_CHAT_RECIEVED.mp3');
    const [sentPlaying, sentMessage] = useAudio('/LOOBR_CHAT_SENT.mp3');
    useEffect(() => {
        if (newMessage !== null) {
            setAllMessages([...allMessages, newMessage]);
        }
    }, [newMessage]);
    useEffect(() => {
        if (data && supportHeadOpened) {
            dispatch(seenMessage({ roomId: data?._id }));
        }
    }, [newMessage, supportHeadOpened]);

    useEffect(() => {
        if (confirm) {
            getAllMessages();
            setConfirm(false);
        }
    }, [confirm]);

    const listenSocket = (id: string) => {
        _io.on(`${user?.userId}:${SEND_NEW_MESSAGE}`, (newdata: any) => {
            if (newdata?.roomId == id) {
                // toggle();
                setNewMessage(newdata?.messageId);
                // if (state) {
                //   dispatch(seenMessage({ userId: user.userId, roomId: data?._id }));
                // }
                // checkseenMessage(newdata.roomId, data._id);
            }
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
                    setAllMessages(res.data.data.messages);
                })
                .catch((err) => {
                    // console.log(err.response);
                    toast.error(err?.response?.data?.message);
                });
        }
    };

    var element: any = document?.getElementById('yourDivID' + '-' + data?._id);
    function updateScroll() {
        element.scrollTop = element.scrollHeight;
    }

    useEffect(() => {
        if (element !== null) {
            updateScroll();
        }
    }, [element]);
    useEffect(() => {
        if (element !== null) {
            updateScroll();
        }
    }, [element]);
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
            } catch (err) {}
        } catch (err) {
            setLoadingUpload(false);
            // console.log(err);
        }
    };

    const messageHanlder = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (blockedUser) {
            toast.error('Blocked');
            return;
        }
        if (message.trim() == '' && !file) {
            return;
        } else {
            try {
                if (message.trim() != '') {
                    let o = {
                        type: type,
                        attachment: src,
                        body: DoEncrypt(message),
                        createdAt: new Date(),
                        sendBy: {
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            _id: user?.userId
                        }
                    };
                    let m = [...allMessages, o];
                    setAllMessages(m);
                } else {
                    let o = {
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

                    setAllMessages(m);
                }

                const body = new FormData();
                body.append('room', data?._id);
                message && body.append('body', DoEncrypt(message));
                body.append('userId', user.userId);
                type == '' ? body.append('type', 'text') : body.append('type', type);
                file && body.append('attachment', src);
                let res = await dispatch(sendMessage(body, setConfirm, setSentMessage));
                sentMessage();
                setSentMessage(null);
                setFile(null);
                setSrc(null);
                setMessage('');
                setType('');
                updateScroll();
            } catch (err) {
                // console.log(err);
            }
        }
    };
    return (
        <div className={`bg-[#14141F]  border-blue1 rounded-lg w-[22.938rem] relative `}>
            <div
                className="cursor-pointer bg-[#2B2B35]  rounded-t-lg text-center h-16  flex justify-between px-4 items-center "
                onClick={() => {
                    setsupportHeadOpened(!supportHeadOpened);
                }}>
                <div className="flex items-center w-80 ">
                    <>
                        <a className="flex items-center">
                            <figure className="w-[32px] h-[32px] rounded-full UerProfileImage flex items-center justify-center">
                                <Image
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                    src="/assets/images/loobr-chat-icon.svg"
                                    alt=""
                                />
                            </figure>
                        </a>
                        <div className="ml-2">
                            <p className="text-base text-white braek hover:text-themecolor">Support</p>
                        </div>
                    </>
                </div>
                <div className="flex items-center ">
                    <i
                        onClick={() => setOpenSupport(false)}
                        className={`icon-close AtChatCrossIcon cursor-pointer  bg-[#363642] h-7 w-7 flex justify-center mr-2 text-2xl items-center  rounded-full  text-[#7C7EBB]`}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div
                className={`${
                    supportHeadOpened ? 'h-[448px] overflow-y-auto flex' : 'h-0  hidden'
                }  flex-col justify-end`}>
                <div
                    className={`
                   ${supportHeadOpened ? 'h-[50vh] overflow-y-auto opacity-100' : 'h-0  opacity-0'}
                bg-[#14152 relative at-sidebarwrapper hover:bg-[#1c1c27]   scrollbarHide scrolHide duration-300 AtScroll overflow-hidden flex flex-col-reverse`}
                    {...getRootProps({
                        onClick: (event) => event.stopPropagation()
                    })}>
                    <div
                        id={'yourDivID' + '-' + data?._id}
                        className="h-[50vh] overflow-y-auto scrolHide  scrollbarHide at-sidebarwrapper w-full  flex flex-col-reverse justify-start">
                        {loadingMessage && (
                            <div className="text-center ">
                                <figure className="pb-40">
                                    <div className="loadingio-spinner-rolling-jz7efhw30v">
                                        <div className="ldio-fcd0x3izul5">
                                            <div></div>
                                        </div>
                                    </div>
                                </figure>
                            </div>
                        )}
                        {!loadingMessage && (
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
                                                      <p className="text-center">
                                                          {el?.createdAt && moment(el?.createdAt).format('LL')}
                                                      </p>
                                                  )}
                                                  {el?.sendBy._id === user?.userId ? (
                                                      <div className="flex justify-end px-3 " key={index}>
                                                          <div className="inline-block ">
                                                              <div className="flex flex-row-reverse items-center mt-2">
                                                                  {el?.body && (
                                                                      <div className="flex flex-col">
                                                                          <p className="text-[#14141F] mt-1 bg-[#F1C94A] relative ml-2 px-2 py-2 round-yellow Atmymessage  font-Proxima-Regular text-lg braek">
                                                                              {el?.body && (
                                                                                  <SingleMessage data={el?.body} />
                                                                              )}
                                                                          </p>

                                                                          {el?.type == 'text' && (
                                                                              <p className="text-right ">
                                                                                  {el?.createdAt &&
                                                                                      moment(el?.createdAt).format(
                                                                                          'hh:mm A'
                                                                                      )}
                                                                              </p>
                                                                          )}
                                                                      </div>
                                                                  )}
                                                              </div>
                                                              <div className="mt-3">
                                                                  {el?.type == 'video' && (
                                                                      <>
                                                                          <figure className="Atfilefover bg-[#29303a]  min-w-[148px] max-w-[148px] min-h-[126px] max-h-[126px] rounded-[5px]">
                                                                              <video
                                                                                  id="video-summary"
                                                                                  width={148}
                                                                                  height={125}
                                                                                  controls
                                                                                  controlsList="nodownload"
                                                                                  src={el?.attachment}
                                                                              />
                                                                          </figure>
                                                                          <p className="text-right ">
                                                                              {el?.createdAt &&
                                                                                  moment(el?.createdAt).format(
                                                                                      'hh:mm A'
                                                                                  )}
                                                                          </p>
                                                                      </>
                                                                  )}
                                                                  {el?.type == 'image' && (
                                                                      <>
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
                                                                                  alt=""
                                                                                  quality={50}
                                                                              />
                                                                              <figcaption></figcaption>
                                                                          </figure>
                                                                          <p className="text-right ">
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
                                                      <div className="flex justify-start px-3">
                                                          <div className="inline-block ">
                                                              {' '}
                                                              <div className="flex items-start mt-2 justify">
                                                                  {data.type == 'GROUP' && (
                                                                      <figure className=" w-[30px]  mr-2  h-[30px] flex-shrink-0 relative rounded-full  ">
                                                                          {index < array.length &&
                                                                              array[index]?.sendBy?._id !=
                                                                                  array[index + 1]?.sendBy?._id && (
                                                                                  <>
                                                                                      <Link
                                                                                          legacyBehavior
                                                                                          href={`/profile/${el?.sendBy?._id}`}>
                                                                                          <a>
                                                                                              {el?.sendBy?.avatar ? (
                                                                                                  <ImageComponent
                                                                                                      className="rounded-full"
                                                                                                      src={
                                                                                                          el?.sendBy
                                                                                                              ?.avatar
                                                                                                      }
                                                                                                      height={30}
                                                                                                      width={30}
                                                                                                      alt=""
                                                                                                      transformation={
                                                                                                          TRANSFORMATION_NAMES.fit_50x50
                                                                                                      }
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
                                                                                  </>
                                                                              )}
                                                                      </figure>
                                                                  )}
                                                                  <div className="flex flex-col">
                                                                      {el?.body && (
                                                                          <div>
                                                                              <p className="text-white text-lg  Atothermessage px-2 py-2 bg-[#43434C] roundedchat  braek ">
                                                                                  {/* {DoEncrypt(el?.body)} */}
                                                                                  {el?.type == 'text' && el?.body && (
                                                                                      <SingleMessage data={el?.body} />
                                                                                  )}
                                                                              </p>

                                                                              {/* {DoEncrypt(el?.body)} */}
                                                                              {el?.createdAt &&
                                                                                  moment(el?.createdAt).format(
                                                                                      'hh:mm A'
                                                                                  )}
                                                                          </div>
                                                                      )}
                                                                      <div className="mt-3">
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
                                                                                  {el?.createdAt &&
                                                                                      moment(el?.createdAt).format(
                                                                                          'hh:mm A'
                                                                                      )}
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
                                                                                      <figcaption></figcaption>
                                                                                  </figure>
                                                                                  {el?.createdAt &&
                                                                                      moment(el?.createdAt).format(
                                                                                          'hh:mm A'
                                                                                      )}
                                                                              </>
                                                                          )}
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  )}
                                              </>
                                          );
                                      })
                                    : null}
                            </div>
                        )}

                        <form
                            className=""
                            onSubmit={(e: any) => {
                                !loadinUpload && messageHanlder(e);
                            }}>
                            {file && (
                                <div className="w-full bg-[#14141f] absolute z-[2] bottom-[60px] p-[10px]  left-0 border-t-[1px] border-[#262639] ">
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
                                                    src={URL.createObjectURL(new Blob([file], { type: 'video/mp4' }))}
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
                        </form>
                    </div>
                </div>
                <div className={` ${supportHeadOpened ? '' : 'hidden'} my-2 relative  pl-[40px] pr-[34px]`}>
                    <label className="absolute bottom-[0.6rem]  left-1 top-auto z-20 cursor-pointer">
                        <input
                            disabled={file}
                            type="file"
                            accept=",video/*,image/*"
                            className="absolute w-0 "
                            onChange={(e: any) => {
                                e.preventDefault();
                                uploadtoS3(e.target.files[0]);
                            }}
                        />
                        <div className="h-[28px] AtChatAddIcon w-[28px] font-Proxima-Bold text-xl  text-themecolor rounded-full bg-[#43434C] flex  justify-center items-center">
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
                    <div className="relative">
                        <TextArea
                            autoFocus
                            name="text"
                            id="TYPE__"
                            disabled={loadinUpload}
                            value={message}
                            // pattern="[^\s]+"
                            onchange={(e: any) => {
                                if (e.nativeEvent.data != ' ') {
                                    if (urlRegex.test(e.target.value)) {
                                        toast.error('Invalid text');
                                    } else {
                                        !urlRegex.test(e.target.value) && setMessage(e.target.value);
                                    }
                                }
                                if (e.nativeEvent.data === ' ') {
                                    if (message.length > 0) {
                                        if (urlRegex.test(e.target.value)) {
                                            toast.error('Invalid text');
                                        } else {
                                            !urlRegex.test(e.target.value) && setMessage(e.target.value);
                                        }
                                    }
                                }
                                // if(e.nativeEvent.data != " " && message.length > 0 ) setMessage(e.target.value)
                            }}
                            styles=" !px-0   !py-0   !border-[#2B2B35] bg-[#14141f]   leading-[0]   !rounded-[10px] "
                            className="px-6 pr-[12px] pl-[12px]  !py-3  placeholder:text-[#89898F]  !rounded-[10px]"
                            placeholder={isDragActive ? 'Drop the files here ...' : 'Type your message'}
                        />
                    </div>
                    <p
                        className="text-white w-[22px] AtChatMessageIcon h-[22px] bg-transparent rounded-full flex items-center justify-center cursor-pointer  border-l-[#2B2B35] text-sm font-Proxima-Regular  absolute right-1 bottom-[0.7rem]"
                        onClick={(e: any) => {
                            !loadinUpload && messageHanlder(e);
                        }}>
                        {' '}
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.72415 1.05281C1.64045 1.01095 1.54668 0.993419 1.45351 1.00221C1.36034 1.01101 1.27151 1.04577 1.19711 1.10255C1.12272 1.15934 1.06576 1.23586 1.03271 1.32341C0.999658 1.41096 0.991841 1.50604 1.01015 1.59781L2.41315 6.44781C2.43931 6.5382 2.49044 6.61936 2.56067 6.68198C2.6309 6.74461 2.71737 6.78614 2.81015 6.80181L8.50015 7.75481C8.76815 7.80781 8.76815 8.19181 8.50015 8.24481L2.81015 9.19781C2.71737 9.21349 2.6309 9.25502 2.56067 9.31764C2.49044 9.38026 2.43931 9.46143 2.41315 9.55181L1.01015 14.4018C0.991841 14.4936 0.999658 14.5887 1.03271 14.6762C1.06576 14.7638 1.12272 14.8403 1.19711 14.8971C1.27151 14.9539 1.36034 14.9886 1.45351 14.9974C1.54668 15.0062 1.64045 14.9887 1.72415 14.9468L14.7241 8.44681C14.8071 8.40524 14.8768 8.34142 14.9256 8.26248C14.9743 8.18353 15.0001 8.09259 15.0001 7.99981C15.0001 7.90704 14.9743 7.81609 14.9256 7.73715C14.8768 7.65821 14.8071 7.59438 14.7241 7.55281L1.72415 1.05281Z"
                                fill="#fff"
                            />
                        </svg>
                    </p>
                </div>
            </div>
            {/* {openedChatHead.some((item: any) => item._id === data1._id) && (
                <div className="Atemojichat">
                    <EmojiPicker setEmoji={onEmojiClick} />
                </div>
            )} */}
            {statepop && <Popups show={popup} hide={setPopup} state={statepop} data={dataa} setstate={setstatepop} />}
            <div className="absolute top-0 bottom-0 right-0 z-30 flex flex-row-reverse items-end gap-5 shadow-2xl"></div>
        </div>
    );
};

export default SupportMessages;
