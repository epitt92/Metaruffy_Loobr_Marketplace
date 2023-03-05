import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import { isEmpty } from 'validate.js';
import { useDispatch, useSelector } from 'react-redux';
import { Follow } from '../Follow/follow';
import { getUser } from '../../redux/auth/actions';
import Verified from '../verified';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';

interface Iprops {
    avatar: string;
    firstName: string;
    lastName?: any;
    isVerfied?: any;
    wallets: any[];
    _id: any;
    followers: any[];
    blockedBy: any[];
    blockedUser: any[];
    item: any;
    userName?: any;
}
const TopUsersCard = ({
    avatar,
    firstName,
    lastName,
    isVerfied,
    wallets,
    _id,
    blockedBy,
    userName,
    // followers,
    blockedUser,
    item
}: Iprops) => {
    const [followers, setFollowers] = useState<any>(item?.followers?.length);
    const [confirm, setConfirm] = useState<Boolean>(false);

    const user = useSelector((state: any) => state.auth.user);
    const otherUser = useSelector((state: any) => state.user.user);
    const onlineUsers = useSelector((state: any) => state.auth.onlineUser);
    const checkblocked = (user: any) => {
        return blockedBy?.includes(user?.userId) || blockedUser?.includes(user?.userId);
    };

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('ITEM:', item);
        if (item?.followers?.length != followers) {
            setFollowers(item?.followers?.length);
        }
    }, [item]);

    useEffect(() => {
        // dispatch(getUser());
    }, []);

    return (
        <div>
            <div className="">
                <div className="relative">
                    <Link
                        legacyBehavior
                        href={
                            // user && user?.userId === _id ? '/profile/me' :
                            `/profile/${userName}`
                        }>
                        <a className="flex items-center justify-between hover:bg-[#1c1c27] relative border-[#2B2B35] rounded-xl border-2 h-[80px] pl-5 pr-3 ">
                            {user && user?.userId && (
                                <>
                                    {!checkblocked(user) && user && user.userId && user.userId != _id && (
                                        <i
                                            className={`w-[15px] rounded-full h-[15px] block absolute border-[1px]  border-white left-[12px] top-[15px] z-10 ${
                                                onlineUsers.includes(_id) ? 'bg-[#0e750e]' : 'bg-[#646465]'
                                            }`}></i>
                                    )}
                                </>
                            )}
                            <div className="flex items-center  w-2/3 ">
                                <figure className="w-[50px] h-[50px] relative overflow-hidden rounded-full flex-shrink-0">
                                    {avatar ? (
                                        <ImageComponent
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                            className="!rounded-full "
                                            src={avatar}
                                            objectFit="cover"
                                            layout="fill"
                                            alt=""
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl px-0 pt-1">
                                            {firstName?.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                </figure>
                                <div className="pl-5  w-9/12">
                                    <span className="flex  w-full">
                                        <h2 className="text-white text-base truncate  capitalize mr-1">
                                            {firstName} {lastName}
                                        </h2>
                                        <span className="flex-shrink-0">{isVerfied && <Verified />}</span>
                                    </span>
                                    <span className="text-gray8 font-normal font-base">
                                        {/* 5.6K Followers */}
                                        {followers /*  && followers?.length > 0 ? followers.length : 0 */}
                                        {followers > 1 ? ' Followers' : ' Follower'}
                                        {/* {followers && followers?.length > 1 ? ' Followers' : ' Follower'} */}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </Link>
                    {!checkblocked(user) && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <Follow
                                userModule={true}
                                otherUser={item}
                                followers={followers}
                                setFollowers={setFollowers}
                                setConfirm={setConfirm}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopUsersCard;
