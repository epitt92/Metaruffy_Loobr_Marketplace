import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Search from '../search/Search';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { getAllRooms, getUsers, connectRoom, removeRoom, removeConnection } from '../../redux/messages/actions';
import Messages from './Messages';
import CreateGroupChat from './components/CreateGroupChat';
import SelectUsers from './components/SelectUsers';
import GroupName from './components/GroupName';
import { _io } from '../../services/socket.service';
import {
    REMOVE_USER_GROUP,
    SEND_NEW_MESSAGE,
    NEW_GROUP_CREATED,
    LEAVE_GROUP,
    ADD_USER_GROUP
} from '../../constants/socketEvents';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
import useAudio from '../../hooks/useAudio';
import SingleMessage from './components/messageText';
import { json } from 'stream/consumers';
import SupportMessages from './SupportMessages';
import { toast } from 'react-toastify';
import Verified from '../verified';
import { DoDecrypt, DoEncrypt } from '../../services/aes.service';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import CopmposeDropdown from './Composedropdown';
interface IProps {
    togggle?: boolean;
    setReciever?: Function;
    reciever?: string;
}
const DirectChat = ({ togggle, reciever, setReciever }: IProps) => {
    const [state, setstate] = useState(false);
    const [search, setSearch] = useState('');
    const [close, setClose] = useState<boolean>(false);
    const [chatRoom, setChatRoom] = useState([]);
    const [openedChat, setOpenedChat] = useState<any>([]);
    const [openedChatHead, setOpenedChatHead] = useState<any>([]);
    const [newReciever, setnewReciever] = useState<any>();
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [requested, setRequested] = useState<boolean>(false);
    const dispatch = useDispatch();
    let getFromLocal = localStorage.getItem('messageLoader');
    const chat = useSelector((state: any) => state.chat);
    const user = useSelector((state: any) => state.auth.user);
    const allUsers = useSelector((state: any) => state.chat.allusers);
    const [group, setGroup] = useState(1);
    const [color, setColor] = useState<boolean>(false);
    const [newChatCounter, setNewChatcounter] = useState<number>(0);
    const [newChat, setNewChat] = useState<boolean>(false);
    const [openSupport, setOpenSupport] = useState<boolean>(false);
    const [suppoortChat, setSupportChat] = useState<any>(null);
    const [supportHeadOpened, setsupportHeadOpened] = useState<boolean>(true);

    const [values, setValues] = useState({
        name: '',
        users: [],
        image: null
    });
    const [playing, chatRecieved] = useAudio('/LOOBR_CHAT_RECIEVED.mp3');
    const [newplaying, newchatRecieved] = useAudio('/LOOBR_NEWCHAT_RECIEVED.mp3');
    const onlineUsers = useSelector((state: any) => state.auth.onlineUser);
    const ToggleClass = () => {
        setColor(false);
        if (state == false || state == undefined) {
            dispatch(getAllRooms(false));
        }
        setstate(!state);
    };

    useEffect(() => {
        if (chat.newRoom) {
            openChatHandler(chat.newRoom);
            // dispatch(removeRoom());
            dispatch(removeConnection());
        }
    }, [chat.newRoom]);
    useEffect(() => {
        if (chat.rooms != null) {
            setChatRoom(chat?.rooms?.newRooms);
            chat?.rooms?.newRooms?.map((chat: any) => {
                if (chat.type == 'SUPPORT') {
                    setSupportChat(chat);
                }
            });
        } else {
            dispatch(getAllRooms());
        }
    }, [chat.rooms]);

    const openChatHandler = (chat: any) => {
        openChatHeadHandle(chat, 'OPEN');
        let a = [...openedChat];
        if (openedChat.some((item: any) => item._id === chat._id)) {
            return;
        } else {
            if (a.length === 3) {
                let chatTemp = [...openedChat];
                // let chatHeadTemp = [...openedChatHead];
                chatTemp.splice(2, 1);
                chatTemp.push(chat);
                setClose(true);
                setOpenedChat([...chatTemp]);
                // setOpenedChatHead([...chatHeadTemp]);
            } else {
                if (openSupport && a.length === 2) {
                    setOpenSupport(false);
                    setsupportHeadOpened(true);
                }
                a.push(chat);
                // setOpenedChat(a);
                setOpenedChat([...a]);
            }
        }
    };

    const openChatHeadHandle = (room: any, action: string = '') => {
        if (openedChatHead.some((item: any) => item._id === room._id) && action !== 'OPEN') {
            const indexOfObject = openedChatHead.findIndex((object: any) => {
                return object._id === room._id;
            });
            let a = [...openedChatHead];
            a.splice(indexOfObject, 1);
            setOpenedChatHead(a);
        } else {
            if (!openedChatHead.some((item: any) => item._id === room._id)) {
                let a = [...openedChatHead];
                a.push(room);
                setOpenedChatHead(a);
            }
        }
    };

    const closeHandler = (index: number) => {
        let chatTemp = [...openedChat];
        let chatHeadTemp = [...openedChatHead];
        chatTemp.splice(index, 1);
        setClose(true);
        setOpenedChat([...chatTemp]);
        setOpenedChatHead([...chatHeadTemp]);
    };

    const listenSocket = () => {
        _io.on(`${user?.userId}:${ADD_USER_GROUP}`, (newdata: any) => {
            if (newdata?.to == user?.userId) {
                dispatch(getAllRooms(false));
            }
        });
    };
    const listenSocketRemoved = () => {
        _io.on(`${user?.userId}:${REMOVE_USER_GROUP}`, (newdata: any) => {
            if (newdata?.to == user?.userId) {
                dispatch(getAllRooms(false));
            }
        });

        _io.on(`${user?.userId}:${NEW_GROUP_CREATED}`, (newdata: any) => {
            // console.log('New Group Created');
            dispatch(getAllRooms(false));
            toast.success(newdata.message);
        });

        _io.on(`${user?.userId}:${LEAVE_GROUP}`, (newdata: any) => {
            dispatch(getAllRooms(false));
        });
    };
    const newChatCheck = (data: any) => {
        // console.log('=-=-=-=-==-', data, newChatCounter);
        if (data.type == 'PRIVATE') {
            setNewChatcounter(newChatCounter + 1);
            setNewChat(true);
        }
    };
    useEffect(() => {
        if (user && user.userId) {
            // _io.off(`${user?.userId}:${SEND_NEW_MESSAGE}`);
            _io.on(`${user?.userId}:${SEND_NEW_MESSAGE}`, (newdata: any) => {
                if (!newdata.deletedBy.includes(user?.userId)) {
                    if (newdata?.new) {
                        newChatCheck(newdata);
                        user?.settings?.alerts?.messenger && newchatRecieved();
                    } else {
                        user?.settings?.alerts?.messenger && chatRecieved();
                    }
                    dispatch(getAllRooms(false));
                    setColor(true);
                }
            });
        }
    }, [user?.settings?.alerts?.messenger, user]);
    useEffect(() => {
        if (user && user.userId) {
            listenSocketRemoved();
            listenSocket();
        }
    }, [user]);

    useEffect(() => {}, [openedChatHead, openedChat]);
    const countRequests = () => {
        let request = 0;
        chatRoom?.map((chat: any) => {
            if (chat?.requested?.includes(user?.userId)) {
                request = request + 1;
            }
        });
        return request;
    };
    return (
        <div
            className={`${
                state ? '  border-transparent' : ' border-blue1'
            } bg-[#1E1E2C] z-40 rounded-r-none  rounded-tl-2xl border-b-0  fixed right-0 hidden lg:block  bottom-0 w-[23rem] !focus-visible:outline-none focus-visible:border-0 `}>
            <div
                className={`relative cursor-pointer  bg-black2  text-center h-16 flex justify-between px-4 items-center rounded-r-none rounded-tl-lg ${
                    !state && color ? 'bg-[#fecd08]' : ''
                }`}
                onClick={ToggleClass}>
                <div className="flex items-center w-full">
                    <figure className="relative flex-shrink-0 mr-3 rounded-full">
                        {chat?.rooms?.unread > 0 && (
                            <i className="not-italic w-[30px] h-[30px] rounded-full bg-red-600 text-white absolute right-[-8px] top-[-6px] font-Proxima-SemiBold text-base flex items-center justify-center z-[2]">
                                {chat?.rooms?.unread}
                            </i>
                        )}
                        <Image
                            className="rounded-full"
                            src="/assets/images/loobr-chat-icon.svg"
                            height={32}
                            width={32}
                            alt=""
                        />
                    </figure>

                    <div className="items-center w-full ">
                        <h6
                            className={`font-Proxima-SemiBold text-center ${
                                !state && color ? 'text-black' : 'text-white'
                            }`}>
                            Messenger
                        </h6>
                    </div>
                </div>
                <div className="flex">
                    <button
                        type="button"
                        className="bg-[#363642] w-[38px] h-[38px] rounded-full flex items-center justify-center">
                        {state ? (
                            <img src="/assets/images/icons/close-chat.png" alt="" />
                        ) : (
                            <img src="/assets/images/icons/open-chat.png" alt="" />
                        )}
                    </button>
                </div>
            </div>
            <div
                className={`${
                    state ? 'h-[455px] overflow-y-scroll opacity-100' : 'h-0  opacity-0'
                } relative duration-300 AtScroll scrollbarHide at-sidebarwrapper  hover:bg-[#181821]      overflow-hidden !focus-visible:outline-none !focus-visible:border-0 `}>
                {(() => {
                    switch (group) {
                        case 1: {
                            return (
                                <div className="relative ">
                                    <div className="px-3 ">
                                        <Search
                                            value={search}
                                            onChange={(e: any) => {
                                                let r = /^[0-9\b]+$/;
                                                if (/^[A-Za-z0-9!@#$%^&]*$/.test(e.target.value))
                                                    setSearch(e.target.value);
                                            }}
                                            placeholder="Search"
                                            className="mt-4 w-full !border-2 py-4  !pl-[4rem] border-[#2B2B35] bg-transparent !rounded-full"
                                        />
                                    </div>
                                    {countRequests() > 0 && newChat && (
                                        <div
                                            className="min-h-[50px] w-full bg-themecolor flex items-center relative px-3 py-3 mt-[12px]"
                                            onClick={() => {
                                                setNewChat(false);
                                                setRequested(true);
                                            }}>
                                            <div className="flex items-center gap-3 cursor-pointer ">
                                                <svg
                                                    width="29"
                                                    height="27"
                                                    viewBox="0 0 29 27"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M0 14.3196C0.15135 14.0746 0.31537 13.836 0.452641 13.5832C1.47759 11.6877 2.49997 9.79035 3.51976 7.89109C4.31804 6.39097 5.55207 5.64548 7.2507 5.67083C7.56185 5.67575 7.873 5.67083 8.18344 5.67083C8.62552 5.67787 8.9416 5.97634 8.93878 6.37478C8.93596 6.77321 8.61848 7.06817 8.17358 7.07451C7.77796 7.08014 7.38234 7.07028 6.98672 7.07451C6.08707 7.0914 5.36763 7.47224 4.9333 8.25503C3.92876 10.0649 2.96223 11.8959 1.98163 13.7184C1.97292 13.752 1.96842 13.7865 1.96825 13.8212H2.2618C4.07095 13.8212 5.88011 13.8303 7.68856 13.8148C8.18485 13.8106 8.49881 13.9873 8.69662 14.4526C9.01973 15.2143 9.38579 15.9584 9.72932 16.7109C10.1935 17.7391 10.9863 18.2537 12.108 18.2547C13.6341 18.2547 15.1594 18.2547 16.6837 18.2547C17.8198 18.2547 18.6181 17.7373 19.0891 16.706C19.441 15.9359 19.8085 15.1735 20.145 14.3977C20.3245 13.9866 20.6138 13.8233 21.0496 13.8254C22.934 13.8331 24.8185 13.8254 26.7023 13.8254H27.0895C27.0444 13.7114 27.0156 13.6304 26.9797 13.5516C26.2288 11.8992 25.4762 10.2472 24.7221 8.59574C24.2603 7.58487 23.4761 7.07239 22.3603 7.07591C21.8422 7.07591 21.3241 7.07591 20.806 7.07591C20.3175 7.07591 19.995 6.78307 20.0007 6.3607C20.0063 5.951 20.3252 5.67223 20.8004 5.67012C21.3185 5.67012 21.8366 5.66308 22.3547 5.67012C24.0554 5.69335 25.2824 6.46911 25.9977 8.01498C26.8938 9.95296 27.7575 11.9043 28.6677 13.8374C28.8562 14.2345 28.9502 14.6699 28.9423 15.1094C28.9289 17.0805 28.9423 19.0473 28.9352 21.017C28.9296 23.4006 27.5632 25.3751 25.3141 26.1453C24.7068 26.3456 24.0712 26.4468 23.4317 26.4451C17.4496 26.4672 11.466 26.471 5.48097 26.4564C2.64193 26.4564 0.482911 24.5931 0.0401258 21.7927C0.0313589 21.7496 0.0179033 21.7076 0 21.6674V14.3196ZM1.4248 15.2347C1.41776 15.3319 1.40861 15.3959 1.40861 15.46C1.40861 17.3536 1.40861 19.2465 1.41354 21.1395C1.4141 21.4217 1.44669 21.703 1.51068 21.9779C1.95558 23.856 3.50498 25.0555 5.48167 25.057C11.4718 25.057 17.462 25.057 23.4522 25.057C23.7626 25.059 24.0725 25.0297 24.3772 24.9697C26.2553 24.5797 27.5189 23.0239 27.5337 21.0677C27.547 19.2029 27.5337 17.3367 27.5337 15.4734C27.5337 15.403 27.5203 15.3326 27.5133 15.2622C27.481 15.253 27.448 15.2464 27.4147 15.2425C25.4366 15.2425 23.4585 15.2382 21.4811 15.2488C21.3945 15.2488 21.2699 15.3551 21.2284 15.4424C20.9257 16.0696 20.6469 16.7095 20.3477 17.3353C19.66 18.7784 18.5301 19.6056 16.9188 19.645C15.2434 19.6867 13.567 19.6867 11.8897 19.645C10.2904 19.607 9.16264 18.7911 8.47558 17.3592C8.17523 16.7266 7.88426 16.0924 7.60268 15.4565C7.52665 15.284 7.43444 15.2263 7.24578 15.2277C5.99274 15.2368 4.74041 15.2326 3.48738 15.2326L1.4248 15.2347Z"
                                                        fill="#14141F"
                                                    />
                                                    <path
                                                        d="M13.7744 10.3053V9.88718C13.7744 7.09014 13.7744 4.29311 13.7744 1.49607C13.7744 1.17507 13.8349 0.899825 14.132 0.721725C14.2279 0.666618 14.3356 0.635346 14.4461 0.630536C14.5566 0.625727 14.6666 0.64752 14.7669 0.694087C14.8672 0.740654 14.9549 0.810629 15.0225 0.898127C15.0901 0.985626 15.1358 1.08809 15.1555 1.19689C15.1712 1.32768 15.1766 1.45948 15.1717 1.59111C15.1717 4.35998 15.1717 7.12886 15.1717 9.89774V10.2927L16.8352 8.92558C17.1407 8.67427 17.4434 8.42014 17.7503 8.17306C18.0967 7.8964 18.5387 7.91611 18.7879 8.21248C19.0498 8.52362 18.9907 8.96782 18.6373 9.25925C17.4317 10.2542 16.2234 11.246 15.0126 12.2349C14.6184 12.5573 14.3249 12.5573 13.925 12.2349C12.7002 11.2493 11.4772 10.261 10.256 9.26981C9.89632 8.97767 9.83366 8.54263 10.0878 8.22515C10.3419 7.90767 10.7819 7.89359 11.1437 8.18502C11.9181 8.81013 12.6924 9.44017 13.4724 10.0674C13.5548 10.1343 13.635 10.1962 13.7744 10.3053Z"
                                                        fill="#14141F"
                                                    />
                                                </svg>
                                                <div>
                                                    <h4 className="text-[16px] font-Proxima-Bold text-darkgray">
                                                        New Message request
                                                    </h4>
                                                    <span className="text-[14px] block font-Proxima-SemiBold text-darkgray">
                                                        {newChatCounter} Person you may know
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="absolute right-[20px] top-1/2 -translate-y-1/2"
                                                type="button"
                                                onClick={() => {
                                                    setNewChatcounter(0);
                                                    setNewChat(false);
                                                }}>
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 17 17"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.5 16.5C12.9183 16.5 16.5 12.9183 16.5 8.5C16.5 4.08172 12.9183 0.5 8.5 0.5C4.08172 0.5 0.5 4.08172 0.5 8.5C0.5 12.9183 4.08172 16.5 8.5 16.5Z"
                                                        stroke="black"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M5.5 5.5L11.5 11.5M11.5 5.5L5.5 11.5"
                                                        stroke="black"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    <p className="pr-3 mt-4 text-right ">
                                        <span
                                            className="inline-block cursor-pointer"
                                            onClick={() => {
                                                setRequested(!requested);
                                            }}>
                                            {requested ? 'All Chats' : `Requests(${countRequests()})`}
                                        </span>
                                    </p>
                                    {chat.loading ? (
                                        <div className="flex items-center justify-center mt-8 ">
                                            <div className="text-center ">
                                                <figure className="mt-12">
                                                    <div className="loadingio-spinner-rolling-jz7efhw30v !bg-transparent">
                                                        <div className="ldio-fcd0x3izul5">
                                                            <div></div>
                                                        </div>
                                                    </div>
                                                </figure>
                                            </div>
                                        </div>
                                    ) : !requested ? (
                                        <div className="relative">
                                            <div
                                                className="flex items-center gap-4 px-4 py-4 cursor-pointer xs:block "
                                                onClick={() => {
                                                    if (openSupport) {
                                                        setsupportHeadOpened(!supportHeadOpened);
                                                    } else if (openedChat?.length < 3) {
                                                        setOpenSupport(true);
                                                    }
                                                }}>
                                                <figure className="w-[40px] h-[40px]  relative  rounded-full UerProfileImage bg-[#272737] flex items-center justify-center relative flex-shrink-0">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full "
                                                        objectFit="cover"
                                                        // layout="fill"
                                                        src="/assets/images/loobr-chat-icon.svg"
                                                        alt=""
                                                    />
                                                </figure>
                                                <div className="w-full">
                                                    <div className="flex justify-between gap-2">
                                                        <h6 className="flex flex-shrink-0 flex-col text-[#ff5500] text-[18px] font-Proxima-Bold">
                                                            Support
                                                            <span className="block text-[14px] text-white font-Proxima-Regular w-[9rem]  truncate ">
                                                                {suppoortChat?.messages?.length ? (
                                                                    suppoortChat?.messages[0]?.deletedBy?.includes(
                                                                        user?.userId
                                                                    ) ? (
                                                                        'No Message'
                                                                    ) : suppoortChat?.messages[0]?.body ? (
                                                                        <>
                                                                            {suppoortChat?.messages[0]?.body && (
                                                                                <SingleMessage
                                                                                    data={
                                                                                        suppoortChat?.messages[0]?.body
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        suppoortChat?.messages[0]?.type
                                                                    )
                                                                ) : (
                                                                    'No Message'
                                                                )}
                                                            </span>
                                                        </h6>
                                                        <div className="relative ">
                                                            <p className="text-[#727279]  text-sm font-Proxima-Regular flex flex-col items-end ">
                                                                {suppoortChat?.messages?.length
                                                                    ? moment(
                                                                          suppoortChat?.messages[0]?.createdAt
                                                                      ).fromNow()
                                                                    : null}
                                                            </p>
                                                            {suppoortChat?.unreadCount > 0 && (
                                                                <span className="bg-red-600 text-white mt-2 font-Proxima-Bold absolute right-0  h-[25px] pt-[2px] w-[25px] rounded-full flex justify-center items-center">
                                                                    {suppoortChat?.unreadCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="h-[2px] border-none bg-[#2B2B35]" />

                                            {chatRoom?.some((chat: any) => {
                                                return !chat?.requested?.includes(user.userId);
                                            }) ? (
                                                ''
                                            ) : (
                                                <div className="w-full h-48 mt-14">
                                                    <figure className="flex justify-center mb-4">
                                                        <svg
                                                            width="109"
                                                            height="104"
                                                            viewBox="0 0 109 104"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M38.7539 68.6171C38.7539 87.9201 54.4 103.566 73.703 103.566C78.1979 103.574 82.6515 102.708 86.8165 101.018C86.9023 101.029 86.9886 101.034 87.0749 101.034H102.371C102.864 101.034 103.351 100.937 103.806 100.749C104.261 100.561 104.674 100.285 105.022 99.9365C105.37 99.5884 105.647 99.1751 105.835 98.7202C106.023 98.2654 106.12 97.7778 106.12 97.2855V81.6952C107.799 77.54 108.659 73.099 108.652 68.6171C108.652 49.314 93.0061 33.668 73.703 33.668C54.4 33.668 38.7539 49.314 38.7539 68.6171Z"
                                                                fill="#2D2D3A"
                                                            />
                                                            <path
                                                                d="M87.6906 43.8448C87.6906 68.0614 68.0619 87.69 43.8455 87.69C38.2064 87.6995 32.6192 86.614 27.3939 84.4938C27.2864 84.5064 27.1782 84.5128 27.0699 84.5128H7.87945C7.26185 84.5131 6.65024 84.3917 6.07959 84.1556C5.50894 83.9194 4.99043 83.573 4.55372 83.1363C4.11701 82.6996 3.77066 82.1811 3.53447 81.6104C3.29828 81.0398 3.17689 80.4282 3.17723 79.8106V60.2518C1.06996 55.039 -0.00891468 49.4677 5.54786e-05 43.8451C5.54786e-05 19.6286 19.6287 0 43.8452 0C68.0618 0 87.6906 19.6283 87.6906 43.8448Z"
                                                                fill="#3F3F49"
                                                            />
                                                            <path
                                                                d="M23.5106 52.7409C27.02 52.7409 29.8649 49.8959 29.8649 46.3866C29.8649 42.8772 27.02 40.0322 23.5106 40.0322C20.0012 40.0322 17.1562 42.8772 17.1562 46.3866C17.1562 49.8959 20.0012 52.7409 23.5106 52.7409Z"
                                                                fill="white"
                                                            />
                                                            <path
                                                                d="M41.9364 52.7409C45.4458 52.7409 48.2907 49.8959 48.2907 46.3866C48.2907 42.8772 45.4458 40.0322 41.9364 40.0322C38.427 40.0322 35.582 42.8772 35.582 46.3866C35.582 49.8959 38.427 52.7409 41.9364 52.7409Z"
                                                                fill="white"
                                                            />
                                                            <path
                                                                d="M61.0028 52.7409C64.5122 52.7409 67.3571 49.8959 67.3571 46.3866C67.3571 42.8772 64.5122 40.0322 61.0028 40.0322C57.4934 40.0322 54.6484 42.8772 54.6484 46.3866C54.6484 49.8959 57.4934 52.7409 61.0028 52.7409Z"
                                                                fill="white"
                                                            />
                                                        </svg>
                                                    </figure>
                                                    <h5 className="text-xl text-center text-white">No Messages yet.</h5>

                                                    <p className="px-12 text-sm text-center">
                                                        No messages in your chat box yet! Start connecting with your
                                                        loobr community.
                                                    </p>
                                                </div>
                                            )}

                                            {chatRoom?.map((chat: any, i: number) => {
                                                return chat.type == 'GROUP' &&
                                                    chat?.subject?.match(new RegExp(search, 'i')) ? (
                                                    <span key={i}>
                                                        <div
                                                            onClick={() => {
                                                                openChatHandler(chat);
                                                            }}
                                                            key={i}
                                                            className="flex items-center gap-4 px-4 py-4 cursor-pointer xs:block">
                                                            <figure className="w-[40px] h-[40px]  rounded-full UerProfileImage flex items-center justify-center relative flex-shrink-0">
                                                                {chat?.image ? (
                                                                    <ImageComponent
                                                                        // width={40}
                                                                        // height={40}
                                                                        className="rounded-full "
                                                                        src={chat?.image}
                                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                                        objectFit="cover"
                                                                        layout="fill"
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                                        {chat?.subject?.charAt(0).toUpperCase()}
                                                                    </p>
                                                                )}
                                                            </figure>
                                                            <div className="w-full">
                                                                <div className="flex justify-between gap-2">
                                                                    <h6 className="flex flex-shrink-0 gap-2 text-base text-white font-Proxima-Regular">
                                                                        {chat?.subject.length > 20
                                                                            ? chat?.subject.slice(0, 20) + '...'
                                                                            : chat?.subject}
                                                                    </h6>
                                                                    <div className="relative ">
                                                                        <p className="text-[#727279]  text-sm font-Proxima-Regular flex flex-col items-end ">
                                                                            {chat.messages.length
                                                                                ? moment(
                                                                                      chat.messages[0].createdAt
                                                                                  ).fromNow()
                                                                                : null}
                                                                        </p>
                                                                        {chat.unreadCount > 0 && (
                                                                            <span className="bg-[#F1C94A] text-[#14141f] mt-2 font-Proxima-Bold absolute right-0  h-[20px] w-[20px] rounded-full flex justify-center items-center">
                                                                                {chat.unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <p className=" w-56 truncate text-[#A1A1A5] text-[14px]  font-Proxima-Regular">
                                                                    {chat.messages.length ? (
                                                                        chat.messages[0]?.deletedBy?.includes(
                                                                            user?.userId
                                                                        ) ? (
                                                                            'No Message'
                                                                        ) : chat.messages[0].body ? (
                                                                            <>
                                                                                {chat.messages[0].body && (
                                                                                    // <SingleMessage
                                                                                    //     data={chat.messages[0].body}
                                                                                    // />
                                                                                    <div
                                                                                        className={` `}
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: DOMPurify.sanitize(
                                                                                                chat.messages[0].body &&
                                                                                                    DoDecrypt(
                                                                                                        chat.messages[0]
                                                                                                            .body
                                                                                                    )
                                                                                            )
                                                                                        }}></div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            chat.messages[0].type
                                                                        )
                                                                    ) : (
                                                                        'No Message'
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <hr className="h-[2px] border-none bg-[#2B2B35]" />
                                                    </span>
                                                ) : (
                                                    chat.type == 'PRIVATE' &&
                                                        !chat?.requested?.includes(user.userId) &&
                                                        chat?.roomUsers
                                                            .filter(
                                                                (name: any) =>
                                                                    name?.firstName?.match(new RegExp(search, 'i')) ||
                                                                    name?.lastName?.match(new RegExp(search, 'i')) ||
                                                                    name?.userName?.match(new RegExp(search, 'i')) ||
                                                                    name?.email?.match(new RegExp(search, 'i'))
                                                            )
                                                            .map((ele: any, i: number) => {
                                                                return ele._id === user?.userId ? null : (
                                                                    <div key={i}>
                                                                        <div
                                                                            onClick={() => {
                                                                                openChatHandler(chat);
                                                                            }}
                                                                            className="flex items-start gap-4 px-4 py-4 cursor-pointer xs:block">
                                                                            <>
                                                                                <figure className="w-[40px] h-[40px] rounded-full   UerProfileImage flex items-center justify-center relative flex-shrink-0">
                                                                                    <i
                                                                                        className={`w-[10px] rounded-full h-[10px] block absolute border-1 top-[0px] right-[30px] border-white z-10 ${
                                                                                            onlineUsers?.includes(
                                                                                                ele?._id
                                                                                            )
                                                                                                ? 'bg-[#0e750e]'
                                                                                                : 'bg-[#646465]'
                                                                                        }`}></i>
                                                                                    {ele?.avatar ? (
                                                                                        <ImageComponent
                                                                                            width={40}
                                                                                            height={40}
                                                                                            className="rounded-full"
                                                                                            src={ele?.avatar}
                                                                                            transformation={
                                                                                                TRANSFORMATION_NAMES.fit_50x50
                                                                                            }
                                                                                            alt=""
                                                                                        />
                                                                                    ) : (
                                                                                        <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                                                            {ele?.firstName
                                                                                                .charAt(0)
                                                                                                .toUpperCase()}
                                                                                        </p>
                                                                                    )}
                                                                                </figure>
                                                                                <div className="w-full">
                                                                                    <div className="flex justify-between gap-2">
                                                                                        <div>
                                                                                            <h6 className="flex flex-row flex-shrink-0 text-base text-white gap-x-1 font-Proxima-Regular">
                                                                                                {ele?.firstName}{' '}
                                                                                                {ele?.lastName}{' '}
                                                                                                {ele?.isVerfied && (
                                                                                                    <Verified />
                                                                                                )}
                                                                                            </h6>

                                                                                            <span className="block text-[12px] text-gray6">
                                                                                                @{ele?.userName}
                                                                                            </span>
                                                                                        </div>

                                                                                        <div className="relative ">
                                                                                            <p className="text-[#727279]  text-sm font-Proxima-Regular flex flex-col items-end ">
                                                                                                {chat.messages.length
                                                                                                    ? moment(
                                                                                                          chat
                                                                                                              .messages[0]
                                                                                                              .createdAt
                                                                                                      ).fromNow()
                                                                                                    : null}
                                                                                            </p>
                                                                                            {chat.unreadCount > 0 && (
                                                                                                <span className="bg-red-600 text-white mt-2 font-Proxima-Bold absolute right-0  h-[25px] pt-[2px] text-sm w-[25px] rounded-full flex justify-center items-center">
                                                                                                    {chat.unreadCount}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className=" w-56 truncate text-[#A1A1A5] text-[14px] font-Proxima-Regular ">
                                                                                        {chat.messages.length ? (
                                                                                            chat.messages[0]?.deletedBy?.includes(
                                                                                                user?.userId
                                                                                            ) ? (
                                                                                                'No Message'
                                                                                            ) : chat.messages[0]
                                                                                                  .body ? (
                                                                                                <>
                                                                                                    {chat.messages[0]
                                                                                                        .body && (
                                                                                                        <SingleMessage
                                                                                                            data={
                                                                                                                chat
                                                                                                                    .messages[0]
                                                                                                                    .body
                                                                                                            }
                                                                                                        />
                                                                                                    )}
                                                                                                </>
                                                                                            ) : (
                                                                                                chat.messages[0].type
                                                                                            )
                                                                                        ) : (
                                                                                            'No Message'
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                        <hr className="h-[2px] border-none bg-[#2B2B35]" />
                                                                    </div>
                                                                );
                                                            })
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        requested && (
                                            <div className="relative">
                                                {chatRoom?.some((chat: any) => {
                                                    return chat?.requested?.includes(user.userId);
                                                }) ? (
                                                    ''
                                                ) : (
                                                    <div className="w-full h-48 mt-14">
                                                        <figure className="flex justify-center mb-4">
                                                            {/* <Image
                                                                src="/assets/images/avatar/msg.png"
                                                                height={103}
                                                                width={108}
                                                            /> */}
                                                            <svg
                                                                width="109"
                                                                height="104"
                                                                viewBox="0 0 109 104"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M38.7539 68.6171C38.7539 87.9201 54.4 103.566 73.703 103.566C78.1979 103.574 82.6515 102.708 86.8165 101.018C86.9023 101.029 86.9886 101.034 87.0749 101.034H102.371C102.864 101.034 103.351 100.937 103.806 100.749C104.261 100.561 104.674 100.285 105.022 99.9365C105.37 99.5884 105.647 99.1751 105.835 98.7202C106.023 98.2654 106.12 97.7778 106.12 97.2855V81.6952C107.799 77.54 108.659 73.099 108.652 68.6171C108.652 49.314 93.0061 33.668 73.703 33.668C54.4 33.668 38.7539 49.314 38.7539 68.6171Z"
                                                                    fill="#2D2D3A"
                                                                />
                                                                <path
                                                                    d="M87.6906 43.8448C87.6906 68.0614 68.0619 87.69 43.8455 87.69C38.2064 87.6995 32.6192 86.614 27.3939 84.4938C27.2864 84.5064 27.1782 84.5128 27.0699 84.5128H7.87945C7.26185 84.5131 6.65024 84.3917 6.07959 84.1556C5.50894 83.9194 4.99043 83.573 4.55372 83.1363C4.11701 82.6996 3.77066 82.1811 3.53447 81.6104C3.29828 81.0398 3.17689 80.4282 3.17723 79.8106V60.2518C1.06996 55.039 -0.00891468 49.4677 5.54786e-05 43.8451C5.54786e-05 19.6286 19.6287 0 43.8452 0C68.0618 0 87.6906 19.6283 87.6906 43.8448Z"
                                                                    fill="#3F3F49"
                                                                />
                                                                <path
                                                                    d="M23.5106 52.7409C27.02 52.7409 29.8649 49.8959 29.8649 46.3866C29.8649 42.8772 27.02 40.0322 23.5106 40.0322C20.0012 40.0322 17.1562 42.8772 17.1562 46.3866C17.1562 49.8959 20.0012 52.7409 23.5106 52.7409Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M41.9364 52.7409C45.4458 52.7409 48.2907 49.8959 48.2907 46.3866C48.2907 42.8772 45.4458 40.0322 41.9364 40.0322C38.427 40.0322 35.582 42.8772 35.582 46.3866C35.582 49.8959 38.427 52.7409 41.9364 52.7409Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M61.0028 52.7409C64.5122 52.7409 67.3571 49.8959 67.3571 46.3866C67.3571 42.8772 64.5122 40.0322 61.0028 40.0322C57.4934 40.0322 54.6484 42.8772 54.6484 46.3866C54.6484 49.8959 57.4934 52.7409 61.0028 52.7409Z"
                                                                    fill="white"
                                                                />
                                                            </svg>
                                                        </figure>
                                                        <h5 className="text-xl text-center text-white">
                                                            No Requests yet.
                                                        </h5>
                                                    </div>
                                                )}
                                                {chatRoom?.map((chat: any, i: number) => {
                                                    return (
                                                        chat.type == 'PRIVATE' &&
                                                        chat?.requested?.includes(user.userId) &&
                                                        chat?.roomUsers
                                                            .filter(
                                                                (name: any) =>
                                                                    name?.firstName?.match(new RegExp(search, 'i')) ||
                                                                    name?.lastName?.match(new RegExp(search, 'i')) ||
                                                                    name?.userName?.match(new RegExp(search, 'i')) ||
                                                                    name?.email?.match(new RegExp(search, 'i'))
                                                            )
                                                            .map((ele: any, i: number) => {
                                                                return ele._id === user?.userId ? null : (
                                                                    <div key={i}>
                                                                        <div
                                                                            onClick={() => {
                                                                                openChatHandler(chat);
                                                                            }}
                                                                            className="flex items-center gap-4 px-4 py-4 cursor-pointer xs:block">
                                                                            <>
                                                                                <figure className="w-[40px] h-[40px]  rounded-full UerProfileImage flex items-center justify-center relative flex-shrink-0">
                                                                                    <i
                                                                                        className={`w-[10px] rounded-full h-[10px] block absolute border-1 top-[0px] right-[30px] border-white z-10 ${
                                                                                            onlineUsers.includes(
                                                                                                ele?._id
                                                                                            )
                                                                                                ? 'bg-[#0e750e]'
                                                                                                : 'bg-[#646465]'
                                                                                        }`}></i>
                                                                                    {ele?.avatar ? (
                                                                                        <ImageComponent
                                                                                            width={40}
                                                                                            height={40}
                                                                                            className="rounded-full"
                                                                                            src={ele?.avatar}
                                                                                            transformation={
                                                                                                TRANSFORMATION_NAMES.fit_50x50
                                                                                            }
                                                                                            alt=""
                                                                                        />
                                                                                    ) : (
                                                                                        <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                                                            {ele?.firstName
                                                                                                .charAt(0)
                                                                                                .toUpperCase()}
                                                                                        </p>
                                                                                    )}
                                                                                </figure>
                                                                                <div className="w-full">
                                                                                    <div className="flex justify-between gap-2">
                                                                                        <h6 className="flex flex-shrink-0 gap-2 text-base text-white font-Proxima-Regular">
                                                                                            {ele?.firstName}
                                                                                        </h6>
                                                                                        <div className="relative ">
                                                                                            <p className="text-[#727279]  text-sm font-Proxima-Regular flex flex-col items-end ">
                                                                                                {chat.messages.length
                                                                                                    ? moment(
                                                                                                          chat
                                                                                                              .messages[0]
                                                                                                              .createdAt
                                                                                                      ).fromNow()
                                                                                                    : null}
                                                                                            </p>
                                                                                            {chat.unreadCount > 0 && (
                                                                                                <span className="bg-red-600 text-white mt-2 font-Proxima-Bold absolute right-0  h-[25px] pt-[2px] w-[25px] rounded-full flex justify-center items-center">
                                                                                                    {chat.unreadCount}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <p className=" w-56 truncate text-[#A1A1A5] text-[14px]  font-Proxima-Regular">
                                                                                        {chat.messages.length ? (
                                                                                            chat.messages[0]?.deletedBy?.includes(
                                                                                                user?.userId
                                                                                            ) ? (
                                                                                                'No Message'
                                                                                            ) : chat.messages[0]
                                                                                                  .body ? (
                                                                                                <>
                                                                                                    {chat.messages[0]
                                                                                                        .body && (
                                                                                                        <SingleMessage
                                                                                                            data={
                                                                                                                chat
                                                                                                                    .messages[0]
                                                                                                                    .body
                                                                                                            }
                                                                                                        />
                                                                                                    )}
                                                                                                </>
                                                                                            ) : (
                                                                                                chat.messages[0].type
                                                                                            )
                                                                                        ) : (
                                                                                            'No Message'
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                        <hr className="h-[2px] border-none bg-[#2B2B35]" />
                                                                    </div>
                                                                );
                                                            })
                                                    );
                                                })}
                                            </div>
                                        )
                                    )}

                                    {/* <div className='relative '>
                        <button
                                        className="bg-themecolor text-[#20242a]  fixed bottom-[36px] right-[15px] rounded-full  h-12 w-12 flex items-center justify-center text-[14px] font-Proxima-SemiBold shadow-[0_0_30px_0_rgba(241,207,74,0.5)"
                                        type="button"
                                        onClick={() => {
                                            setGroup(2);
                                        }}>
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 20V12M12 12V4M12 12H20M12 12H4"
                                                stroke="#14141F"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                    </button>
                        </div> */}
                                    <CopmposeDropdown setGroup={setGroup} />
                                </div>
                            );
                        }
                        case 2: {
                            return <CreateGroupChat setGroup={setGroup} />;
                        }
                        case 3: {
                            return (
                                <SelectUsers
                                    setGroup={setGroup}
                                    setValues={setValues}
                                    values={values}
                                    setSelectedUser={setSelectedUser}
                                    selectedUser={selectedUser}
                                />
                            );
                        }
                        case 4: {
                            return (
                                <GroupName
                                    setGroup={setGroup}
                                    setValues={setValues}
                                    values={values}
                                    setSelectedUser={setSelectedUser}
                                    selectedUser={selectedUser}
                                />
                            );
                        }
                    }
                })()}

                {/*  */}
                {/* <SelectUsers/> */}
                {/* <GroupName/> */}
            </div>

            <div className="absolute shadow-2xl z-30 bottom-0 right-[106%] flex flex-row-reverse items-end gap-5">
                {openedChat?.map((ele: any, i: number) => {
                    return (
                        <Messages
                            key={i}
                            data1={ele}
                            index={i}
                            closeHandler={closeHandler}
                            openChatHeadHandle={openChatHeadHandle}
                            openedChatHead={openedChatHead}
                            close={close}
                            setClose={setClose}
                        />
                    );
                })}
                {openSupport && (
                    <SupportMessages
                        setOpenSupport={setOpenSupport}
                        supportHeadOpened={supportHeadOpened}
                        setsupportHeadOpened={setsupportHeadOpened}
                    />
                )}
            </div>
        </div>
    );
};
export default DirectChat;
