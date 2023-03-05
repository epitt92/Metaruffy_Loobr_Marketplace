import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fragment } from 'react';
import { Menu, Switch, Transition } from '@headlessui/react';
import { NotificationAction } from '../../../services/rxjs.service';
import { Subscription } from 'rxjs';
import { notificationService } from '../../../services/notification.service';
import moment from 'moment';
import useAudio from '../../../hooks/useAudio';
import Nonotification from './Nonotification';
import { isEmpty } from 'validate.js';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getMYOwnNft } from '../../../redux/user/actions';
import useMetaMask from '../../../hooks/useMetaMask';
import Popups from '../../../components/popup/poups';
import { createNftLoading } from '../../../redux/nft/actions';
import ImageComponent from '../../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';

const NotificationDropwon = () => {
    const { account }: any = useMetaMask();
    const router = useRouter();
    let subscription = new Subscription();
    const [notification, setNotifications] = useState<any>([]);
    const [count, setCount] = useState<any>(0);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);

    const [loading, setLoading] = useState(false);
    const [playing, toggle] = useAudio('/LOOBR_NOTIFICATION.mp3');
    const [playing1, play] = useAudio('/LOOBR_MINT_COMPLETE_SOUND.mp3');

    const user = useSelector((state: any) => state.auth.user);
    const nftLoading = useSelector((state: any) => state.nft.createNftLoading);

    const dispatch = useDispatch();

    const Fecth = (showLoading: boolean = true) => {
        if (showLoading) setLoading(true);
        notificationService
            .getAllNotifications()
            .then((res) => {
                setNotifications(res?.data?.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                // console.log(err);
            });
    };

    const fetchUnseen = async () => {
        try {
            const res = await notificationService.countNotificatins();
            setCount(res.data?.data);
        } catch (error) {
            // console.log(error);
        }

        // setCount;
    };

    useEffect(() => {
        if (user) {
            Fecth();
            fetchUnseen();
            const notificationSubs = NotificationAction.listen.subscribe(onListenNotification);
            subscription.add(notificationSubs);
        }

        return () => {
            subscription.unsubscribe();
        };
    }, [user, user?.settings?.alerts?.notifications]);

    const onListenNotification = (evt: any) => {
        /* Temp */
        if (evt?.eventType == 'MINT_NFT' && nftLoading) {
            play();
            dispatch(createNftLoading(false));
            const filters = { filter: 'CREATOR' };
            dispatch(getMYOwnNft(filters, account));
            setState(-1);
            router.push(`/profile/${user?.userName}`);
        }

        Fecth(false);
        user?.settings?.alerts?.notifications && toggle();
        fetchUnseen();
    };

    const handleRedirect = (item: any) => {
        const link =
            item?.eventType === 'FOLLOW_USER'
                ? `/profile/${item?.from?.userName}`
                : item.eventType === 'LIKE_NFT' ||
                  item.eventType === 'COMMENT_ON_NFT' ||
                  item.eventType == 'REPLY_ON_COMMENT_NFT' ||
                  item.eventType == 'COMMENT_MENTIONED_NFT' ||
                  item.eventType == 'MENTION_REPLY_NFT' ||
                  item.eventType == 'LIKE_COMMENT_NFT' ||
                  item.eventType == 'BID_NFT' ||
                  item.eventType == 'LISTED_NFT' ||
                  item.eventType == 'LIKE_REPLY_NFT'
                ? `/listings/${item?.listing?.listingId}`
                : item.eventType === 'MINT_NFT'
                ? `/nft/${item?.nft?.tokenId}`
                : item.eventType === 'SOLD'
                ? `/nft/${item?.listing?.nft?.tokenId}`
                : item.eventType === 'BOUGHT_NFT'
                ? `/nft/${item?.listing?.nft?.tokenId}`
                : item?.feed?._id
                ? `/feed/${item?.feed?._id}`
                : item.eventType === 'STAGE'
                ? `/scheduled-room/${item.roomId}`
                : '/feeds';
        return link;
    };

    const seenAllnotificatio = () => {
        notificationService.seenNotifications();
    };

    return (
        <div className="flex">
            {/* <button onClick={toggle}>{playing ? "Pause" : "Play"}</button> */}
            <Menu
                as="div"
                className={` ${
                    router.pathname == '/notifications' ? 'hidden' : 'block'
                } lg:relative  md:relative sm:static inline-block text-left Atnotificationdropdown`}>
                {' '}
                <div className="flex items-center ">
                    {' '}
                    <Menu.Button className="border-gray-600   ">
                        <div
                            className="flex items-center"
                            onClick={() => {
                                seenAllnotificatio();
                                setCount(0);
                            }}>
                            <div className="relative  h-14 md:h-12 w-14 md:w-12 ">
                                {count > 0 && (
                                    <span className="w-[25px] h-[25px] rounded-full bg-red-600 text-white absolute right-[-5px] top-[-5px] font-Proxima-SemiBold text-base flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                                <div className="bg-[#43434C] h-[3.125rem] w-[3.125rem] rounded-full flex justify-center items-center border border-transparent hover:border-white">
                                    <i className="icon-notification text-white text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="z-50 absolute  top-[80px] lg:w-[38.75rem] w-[35.75rem] xs:w-full right-0 rounded-[12px] shadow-[0px 0px 50px rgba(0, 0, 0, 0.15)] px-0 py-0 bg-[#23232e] divide-y divide-gray-100 focus:outline-none">
                        <div className="flex justify-between items-center py-5 px-10">
                            <h2 className="text-white text-[1.5rem] leading-6 font-Proxima-SemiBold">Notifications</h2>
                            <div>
                                <a
                                    onClick={() => {
                                        router.push('/notifications');
                                    }}
                                    className="text-base text-themecolor cursor-pointer">
                                    See All
                                </a>
                            </div>
                        </div>
                        {isEmpty(notification?.notifications) ? (
                            <Nonotification />
                        ) : (
                            <div className="!border-0 h-[40vh] overflow-auto scrollbarHide at-sidebarwrapper rounded-b-[10px]">
                                {notification?.notifications?.map((item: any, i: number) => (
                                    <Menu.Item key={i}>
                                        <div
                                            //   href={handleRedirect(item)}
                                            onClick={() => {
                                                router.push(handleRedirect(item));
                                            }}>
                                            <a className="px-10 block bg-[#29292F] cursor-pointer">
                                                <div className="flex items-center w-full border-b-[1px] border-[#2b2b35] py-3.5">
                                                    <figure className="">
                                                        {item?.from?.avatar ? (
                                                            // eslint-disable-next-line jsx-a11y/alt-text
                                                            <ImageComponent
                                                                // width={46}
                                                                // height={46}
                                                                figClassName=' w-[46px] h-[46px] flex-shrink-0 relative mr-[12px] flex-shrink-0 rounded-full overflow-hidden'
                                                                objectFit="cover"
                                                                layout="fill"
                                                                src={item?.from?.avatar}
                                                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                            />
                                                        ) : (
                                                            <p className="w-[46px] h-[46px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                                {item?.from?.firstName.charAt(0).toUpperCase()}
                                                            </p>
                                                        )}
                                                    </figure>
                                                    <div className="w-[calc(100%-60px)] relative">
                                                        <h3 className="text-[1.25rem] text-white font-Proxima-SemiBold leading-5">
                                                            {item?.from?.firstName} {item?.from?.lastName}
                                                            {/* <span className="inline text-[#b8b8bc] font-Proxima-Regular">
                                                            {item.shortmsg}
                                                        </span> */}
                                                        </h3>
                                                        <p className="w-full truncate text-[#727279]">
                                                            {item.eventType === 'LIKE_FEEDS'
                                                                ? 'Liked your post'
                                                                : item.eventType === 'COMMENT_ON_FEEDS'
                                                                ? 'Commented on your post'
                                                                : item.eventType === 'FOLLOW_USER'
                                                                ? 'Started following you'
                                                                : item.eventType === 'LIKE_NFT'
                                                                ? 'Liked your listing'
                                                                : item.eventType === 'COMMENT_ON_NFT'
                                                                ? 'Commented on your nft'
                                                                : item.eventType === 'REPLY_ON_COMMENT_FEED' ||
                                                                  item.eventType === 'REPLY_ON_COMMENT_NFT'
                                                                ? 'Replied to your comment'
                                                                : item.eventType === 'FEED_MENTIONED'
                                                                ? 'Mentioned you in Feed'
                                                                : item.eventType === 'COMMENT_MENTIONED_NFT' ||
                                                                  item.eventType === 'COMMENT_MENTIONED'
                                                                ? 'Mentioned you in Comment'
                                                                : item.eventType === 'LIKE_REPLY_FEED'
                                                                ? 'Liked your reply'
                                                                : item.eventType === 'LIKE_REPLY_NFT'
                                                                ? 'Liked your  reply'
                                                                : item.eventType === 'WALL_POST'
                                                                ? 'Posted on your feed'
                                                                : item.eventType === 'LIKE_COMMENT_FEED'
                                                                ? 'Liked your comment'
                                                                : item.eventType === 'LIKE_COMMENT_NFT'
                                                                ? 'Liked your comment'
                                                                : item.eventType === 'MENTION_REPLY_NFT'
                                                                ? 'Mentioned you in reply'
                                                                : item.eventType === 'MENTION_REPLY_FEED'
                                                                ? 'Mentioned you in reply'
                                                                : item.eventType === 'MINT_NFT'
                                                                ? 'NFT minted successfully'
                                                                : item.eventType === 'BID_NFT'
                                                                ? 'Placed bid on your nft'
                                                                : item.eventType === 'LISTED_NFT'
                                                                ? 'Listed nft on the marketplace'
                                                                : item.eventType === 'STAGE'
                                                                ? `'${item?.stageName}' Stage will be start in 5 mintues`
                                                                : item.eventType === 'BOUGHT_NFT'
                                                                ? `You bought ${item?.listing?.nft?.name}`
                                                                : item.eventType === 'SOLD'
                                                                ? `You sold ${item?.listing?.nft?.name}`
                                                                : ''}
                                                        </p>
                                                        <time
                                                            dateTime="2022-12-12"
                                                            className="lg:absolute md:absolute sm:absolute static block top-0 right-0 text-[#727279] font-Proxima-Regular text-[0.875rem]">
                                                            {moment(item?.createdAt).fromNow()}
                                                        </time>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </Menu.Item>
                                ))}
                            </div>
                        )}
                    </Menu.Items>
                </Transition>
            </Menu>
            <Popups show={popup} hide={setPopup} state={state} setstate={setState} />
        </div>
    );
};

export default NotificationDropwon;
