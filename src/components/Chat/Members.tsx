import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import { addToRoom, getUsers } from '../../redux/messages/actions';
import { getAllUsers } from '../../redux/user/actions';
import ImageComponent from '../Image/ImageComponent';
import Input from '../input/Input';
import Memberdropdown from './components/Memberdropdown';

const Members = ({ data1, setState, setChat }: any) => {
    const allUsers = useSelector((state: any) => state.chat.allusers);
    const [searchedusers, setUsers] = useState<Array<any>>([]);
    const [search, setSearch] = useState<string>('');
    const [showSerach, setShowSearch] = useState<boolean>(false);
    const [data, setData] = useState<any>(data1);
    const dispatch = useDispatch();
    const loadingAdd = useSelector((state: any) => state.chat.addUserLoading);
    useEffect(() => {
        if (data) {
            setChat(data);
            // console.log("changed");
        }
        // setData(data1);
    }, [data]);
    useEffect(() => {
        // console.log('All users', data1);
        if (data1) {
            setData(data1);
            // console.log("changed");
        }
        // setData(data1);
    }, [data1]);

    useEffect(() => {
        if (allUsers != null) {
            setUsers(allUsers);
        } else {
            dispatch(getUsers());
        }
    }, [allUsers]);
    const user = useSelector((state: any) => state.auth.user);
    useEffect(() => {
        const fileters = {
            search
        };
        dispatch(getUsers(fileters));
    }, [search]);
    const addTheUser = (roomId: string, userId: string) => {
        if (user && user.userId) {
            setShowSearch(false);
            setSearch('');
            dispatch(
                addToRoom(
                    {
                        otherUser: userId,
                        roomId: roomId
                    },
                    setData
                )
            );
        }
    };
    return (
        <div
            className={`${
                data?.createdBy == user?.userId ? 'bg-[#14141F]' : 'bg-transparent z-[-1]'
            }  border-blue1 rounded-lg overflow-hidden px-10 pt-10 sm:w-[50rem] w-[40rem] xs:w-[26rem]  relative`}>
            <div className="absolute right-0 top-0 !bg-transparent z-[99]"></div>
            <div className=" w-full flex items-center justify-between gap-3">
                <h2 className="text-[2rem] text-white i">Members</h2>
                {data?.createdBy == user?.userId && (
                    <label className="relative cursor-pointer ">
                        <div
                            className=" font-Proxima-Bold text-black text-xl  bg-themecolor rounded-md px-5 py-3"
                            onClick={() => {
                                setShowSearch(!showSerach);
                            }}>
                            Add Members
                            {/* <svg
                                    width="29"
                                    height="29"
                                    viewBox="0 0 29 29"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.5003 0.357422C22.3107 0.357422 28.6431 6.68989 28.6431 14.5003C28.6431 22.3107 22.3107 28.6431 14.5003 28.6431C6.68989 28.6431 0.357422 22.3107 0.357422 14.5003C0.357422 6.68989 6.68989 0.357422 14.5003 0.357422ZM14.5003 7.42885C14.2867 7.42886 14.0803 7.50622 13.9193 7.64661C13.7583 7.78701 13.6537 7.98095 13.6246 8.19256L13.6164 8.31278V13.6164H8.31278C8.08882 13.6164 7.87324 13.7015 7.7096 13.8544C7.54595 14.0073 7.44644 14.2166 7.43118 14.44C7.41591 14.6635 7.48603 14.8844 7.62736 15.0581C7.76869 15.2318 7.9707 15.3454 8.19256 15.376L8.31278 15.3842H13.6164V20.6878C13.6164 20.9117 13.7015 21.1273 13.8544 21.291C14.0073 21.4546 14.2166 21.5541 14.44 21.5694C14.6635 21.5846 14.8844 21.5145 15.0581 21.3732C15.2318 21.2319 15.3454 21.0299 15.376 20.808L15.3842 20.6878V15.3842H20.6878C20.9117 15.3841 21.1273 15.2991 21.291 15.1462C21.4546 14.9933 21.5541 14.784 21.5694 14.5605C21.5846 14.3371 21.5145 14.1162 21.3732 13.9425C21.2319 13.7687 21.0299 13.6551 20.808 13.6246L20.6878 13.6164H15.3842V8.31278C15.3842 8.07835 15.2911 7.85352 15.1253 7.68775C14.9595 7.52198 14.7347 7.42885 14.5003 7.42885Z"
                                        fill="#F1C94A"
                                    />
                                </svg> */}
                        </div>
                    </label>
                )}
            </div>

            <div className="overflow-y-auto max-h-[37.25rem] min-h-[35.25rem] pb-10  mt-6 at-sidebarwrapper  AtScroll AtScroll1 w-full">
                {showSerach && (
                    <div className="relative">
                        <div className="relative w-full">
                            <Input
                                className="text-white pl-12 !rounded-full placeholder: placeholder:text-base"
                                placeholder="Search and add users"
                                name="search"
                                onchange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                value={search}
                                disabled={loadingAdd}
                            />
                            <i className="icon-search text-white absolute top-1/2 translate-y-[-50%] left-[20px]"></i>
                        </div>
                        {search && searchedusers?.length > 0 && (
                            <div className="w-full rounded-lg p-5 max-h-[350px] overflow-y-auto absolute top-[60px] left-0 z-10 scrolHide bg-[#37363c]">
                                {searchedusers?.map((user: any, i: number) => {
                                    return (
                                        <div
                                            key={user?._id}
                                            className={`${
                                                data?.roomUsers.filter((e: any) => e._id === user?._id).length > 0
                                                    ? 'opacity-50'
                                                    : 'cursor-pointer'
                                            }`}
                                            onClick={() => {
                                                data?.roomUsers.filter((e: any) => e._id === user?._id).length > 0
                                                    ? ''
                                                    : !loadingAdd && addTheUser(data?._id, user._id);
                                            }}>
                                            <div className="flex items-center py-2" key={i}>
                                                <figure className="w-[35px] h-[35px] relative rounded-full flex-shrink-0">
                                                    {user?.avatar ? (
                                                        <ImageComponent
                                                            className="rounded-full"
                                                            // width={35}
                                                            // height={35}
                                                            objectFit="cover"
                                                            layout="fill"
                                                            src={user?.avatar}
                                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                            alt="User Image"
                                                        />
                                                    ) : (
                                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                            {user?.firstName?.charAt(0).toUpperCase()}
                                                        </p>
                                                    )}
                                                </figure>
                                                <div className="w-full pl-3">
                                                    <h3 className="text-white text-[1rem] leading-3">
                                                        {user?.firstName} {user?.lastName}
                                                    </h3>

                                                    <span className="block">@{user?.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
                {data?.roomUsers?.map((item: any, val: number) => (
                    <>
                        <div className="py-2  flex justify-between  items-center " key={item?._id}>
                            <div className="flex items-center">
                                <Link legacyBehavior href={`/profile/${item?.userName}`}>
                                    <a>
                                        <figure className="w-[50px] h-[50px] relative  rounded-full UerProfileImage AtchatUserprofile flex items-center justify-center">
                                            {item?.avatar ? (
                                                <Image
                                                    src={item?.avatar}
                                                    // width={50}
                                                    // height={50}
                                                    objectFit="cover"
                                                    layout='fill'
                                                    alt=""
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                    {item?.firstName?.charAt(0).toUpperCase()}
                                                </p>
                                            )}
                                        </figure>
                                    </a>
                                </Link>
                                <h4 className="pl-4 text-base text-white">
                                    {item?.firstName} {item?.lastName}
                                </h4>
                            </div>
                            {user && user.userId == data?.createdBy && (
                                <div className="relative">
                                    {data?.createdBy != item?._id && (
                                        <Memberdropdown
                                            otherUser={item?._id}
                                            roomId={data._id}
                                            setData={setData}
                                            data={data?.roomUsers}
                                            id={val}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
};

export default Members;
