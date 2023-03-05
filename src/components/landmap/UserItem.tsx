import Image from 'next/image';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useRouter } from 'next/router';
import { connectRoom } from '../../redux/messages/actions';

import Button from '../Button/Button';
import Verified from '../verified';
import { Follow } from '../Follow/follow';
import { useDispatch } from 'react-redux';
const fontSize = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base'];

const UserItem = (props: any) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { item, num } = props;
    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }
    const conectRoom = (id: any) => {
        dispatch(
            connectRoom({
                recievedBy: id,
                type: 'PRIVATE'
            })
        );
    };
    const getAvatarURL = (url: string) => {
        return url
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/` + url
            : '/assets/images/default.png';
    };
    return (
        <div className="bg-[#1A1B22] xl:w-full w-full px-4 py-1 flex justify-between items-center">
            <div className="flex gap-2.5 items-center">
                {num ? <span className={`font-bold ${fontSize[num - 1]} text-themecolor`}>{num + '.'}</span> : ''}
                <figure className="w-[40px] h-[40px]   rounded-full UerProfileImage bg-[#272737] flex items-center justify-center relative flex-shrink-0">
                    <i className="w-[10px] rounded-full h-[10px] block absolute border-1 bottom-0 right-[30px] border-white z-10 bg-[#646465]"></i>
                    <Image
                        width={40}
                        height={40}
                        className="rounded-full "
                        src={getAvatarURL(item?.user?.avatar)}
                        alt=""
                    />
                </figure>
                <div className="text-left ">
                    <div className="flex gap-1.5 items-center pr-2">
                        <h5
                            className="hover:cursor-pointer border-b border-transparent hover:border-white text-ellipsis w-[7em] whitespace-nowrap overflow-hidden font-Proxima-Regular text-white text-lg"
                            onClick={() => router.push(`/profile/${item.user?.userName}`)}>
                            {item?.user?.firstName} {item?.user?.lastName}
                        </h5>
                        {item?.user?.isVerfied && <Verified />}
                    </div>

                    <p className="text-base -mt-1">{item?.followers} Followers</p>
                </div>
            </div>
            {item.info ? (
                <div className="flex gap-2 items-center">
                    <Follow
                        customClass={'!rounded-2xl !min-w-[80px] !max-w-[80px] !text-sm gold !w-16  h-8 !px-0'}
                        userModule={true}
                        otherUser={item.info}
                    />
                    <Button
                        className="rounded-2xl   text-sm gold !w-12  h-8 !px-0  "
                        onClick={() => {
                            let dimentions = getWindowSize();
                            if (dimentions.innerWidth < 1024) {
                                router.push('/mobileviewchat');
                            }
                            conectRoom(item?.info && item?.info._id);
                        }}>
                        Chat
                    </Button>
                    <Button className="border-2 border-themecolor bg-transparent text-themecolor rounded-2xl  font-bold text-md !w-14  h-8 !px-0  ">
                        {item?.landCount}
                    </Button>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default UserItem;
