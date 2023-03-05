import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { notificationService } from '../src/services/notification.service';
import moment from 'moment';
import Loader from '../src/components/loader/Loader';
import { Subscription } from 'rxjs';
import { NotificationAction } from '../src/services/rxjs.service';
import { isEmpty } from 'validate.js';
import Notfound from '../src/components/notfound/notfound';
import Button from '../src/components/Button/Button';
import ImageComponent from '../src/components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../src/constants/enums';

const Notifications = () => {
    let subscription = new Subscription();
    const [notification, setNotifications] = useState<any>([]);
    const [metamata, setMetadata] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const Fecth = (showLoading: boolean = true) => {
        if (showLoading) setLoading(true);
        notificationService
            .getAllNotifications({ page, pageSize: 10 })
            .then((res) => {
                showLoading === true
                    ? setNotifications(res?.data?.data?.notifications)
                    : setNotifications([...notification, ...res?.data?.data?.notifications]);
                setMetadata(res?.data?.data?.metadata);
                setLoading(false);
                notificationService.seenNotifications();
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    useEffect(() => {
        Fecth();
        const notificationSubs = NotificationAction.listen.subscribe(onListenNotification);
        subscription.add(notificationSubs);
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        page > 1 && Fecth(false);
    }, [page]);

    const onListenNotification = (evt: any) => {
        Fecth(false);
    };

    const handleLoadMore = () => {
        setPage(page + 1);
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
                  item.eventType == 'LIKE_REPLY_NFT'
                ? `/listings/${item?.listing?.listingId}`
                : item.eventType == 'LISTED_NFT'
                ? `/listings/${item?.listing}`
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

    return (
        <div>
            <Head>
                <title>LooBr | Notifications</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container pt-12 sm:pt-[7.5rem] pb-[15.875rem] min-h-[1000px]">
                <h1 className="xl:px-[14.5rem] lg:px-[5rem] md:px-[0] font-bold text-[3rem] mb-[4.9375rem]">
                    Notifications
                </h1>
                <div className="xl:px-[14.5rem] lg:px-[5rem] md:px-[0] w-full">
                    {loading ? (
                        <Loader />
                    ) : !isEmpty(notification) ? (
                        notification?.map((item: any, i: number) => (
                            <Link legacyBehavior href={handleRedirect(item)} key={i}>
                                <a className="block">
                                    <div className="flex items-center w-full border-b-[1px] border-[#2b2b35] py-3.5">
                                        <figure>
                                            {item?.from?.avatar ? (
                                                // eslint-disable-next-line jsx-a11y/alt-text
                                                <ImageComponent
                                                    figClassName=" w-[46px] h-[46px] relative flex-shrink-0 mr-[12px] flex-shrink-0 rounded-full overflow-hidden"
                                                    objectFit="cover"
                                                    layout="fill"
                                                    src={item?.from?.avatar}
                                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                />
                                            ) : (
                                                <p className="w-[46px] h-[46px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-xl">
                                                    {item?.from?.firstName.charAt(0).toUpperCase()}
                                                </p>
                                            )}
                                        </figure>
                                        <div className="w-[calc(100%-60px)] relative">
                                            <h3 className="text-[1.25rem] text-white font-Proxima-SemiBold leading-5">
                                                {item?.from?.firstName} {item?.from?.lastName}
                                                {/* <span className="inline text-[#b8b8bc] font-Proxima-Regular">
                                                {item?.shortmsg}
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
                                                    ? 'Liked your in reply'
                                                    : item.eventType === 'LIKE_COMMENT_FEED'
                                                    ? 'Liked your comment'
                                                    : item.eventType === 'WALL_POST'
                                                    ? 'Posted on your feed'
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
                                                    : item.eventType === 'STAGE'
                                                    ? 'Schedule Stage will be start in 5 mintues'
                                                    : item.eventType === 'LISTED_NFT'
                                                    ? 'Listed new nft in the marketplace'
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
                            </Link>
                        ))
                    ) : (
                        <Notfound />
                    )}
                </div>
                <div className="flex items-center">
                    {metamata?.next && (
                        <Button
                            className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                            onClick={handleLoadMore}>
                            Load More
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
