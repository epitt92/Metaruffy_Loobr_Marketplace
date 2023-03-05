import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { connectRoom, getUsers } from '../../../redux/messages/actions';
import Button from '../../Button/Button';
import Verified from '../../verified';
import ImageComponent from '../../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
const CreateGroupChat = ({ setGroup, setValues, values }: any) => {
    const allUsers = useSelector((state: any) => state.chat.allusers);
    const user = useSelector((state: any) => state.auth.user);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<any>([]);
    const dispatch = useDispatch();
    const authUser = useSelector((state: any) => state.auth.user);
    useEffect(() => {
        const fileters = {
            search
        };
        dispatch(getUsers(fileters));
    }, [search]);
    useEffect(() => {
        if (allUsers != null) {
            setUsers(allUsers);
        } else {
            dispatch(getUsers());
        }
    }, [allUsers]);
    const connect = (id: string) => {
        user?.userId && dispatch(connectRoom({ recievedBy: id, type: 'PRIVATE' }));
        setSearch('');
        setGroup(1);
    };
    return (
        <div>
            <div className="AtsearchUsers ">
                <button
                    type="button"
                    onClick={() => {
                        setGroup(1);
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.5 12C1.5 14.7848 2.60625 17.4555 4.57538 19.4246C6.54451 21.3938 9.21523 22.5 12 22.5C14.7848 22.5 17.4555 21.3938 19.4246 19.4246C21.3938 17.4555 22.5 14.7848 22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5C9.21523 1.5 6.54451 2.60625 4.57538 4.57538C2.60625 6.54451 1.5 9.21523 1.5 12V12ZM24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12V12ZM17.25 11.25C17.4489 11.25 17.6397 11.329 17.7803 11.4697C17.921 11.6103 18 11.8011 18 12C18 12.1989 17.921 12.3897 17.7803 12.5303C17.6397 12.671 17.4489 12.75 17.25 12.75H8.5605L11.781 15.969C11.8507 16.0387 11.906 16.1215 11.9438 16.2126C11.9815 16.3037 12.0009 16.4014 12.0009 16.5C12.0009 16.5986 11.9815 16.6963 11.9438 16.7874C11.906 16.8785 11.8507 16.9613 11.781 17.031C11.7113 17.1007 11.6285 17.156 11.5374 17.1938C11.4463 17.2315 11.3486 17.2509 11.25 17.2509C11.1514 17.2509 11.0537 17.2315 10.9626 17.1938C10.8715 17.156 10.7887 17.1007 10.719 17.031L6.219 12.531C6.14916 12.4613 6.09374 12.3786 6.05593 12.2874C6.01812 12.1963 5.99866 12.0987 5.99866 12C5.99866 11.9013 6.01812 11.8037 6.05593 11.7125C6.09374 11.6214 6.14916 11.5387 6.219 11.469L10.719 6.969C10.8598 6.82817 11.0508 6.74905 11.25 6.74905C11.4492 6.74905 11.6402 6.82817 11.781 6.969C11.9218 7.10983 12.0009 7.30084 12.0009 7.5C12.0009 7.69916 11.9218 7.89017 11.781 8.031L8.5605 11.25H17.25Z"
                            fill="#fff"
                        />
                    </svg>
                </button>
                <svg width="15" height="15" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21 21L17 17M20 10.5C20 15.7467 15.7467 20 10.5 20C5.25329 20 1 15.7467 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <input
                    type="search"
                    className="text-white text-sm"
                    name="search-users"
                    placeholder="Search people"
                    value={search}
                    onChange={(e: any) => {
                        setSearch(e.target.value);
                    }}
                />
            </div>
            <div className="pt-3 px-5">
                {/* <button
                    type="button"
                    className="flex items-center text-white text-sm font-Proxima-SemiBold gap-x-2.5 pb-3 "
                    onClick={() => {
                        setGroup(3);
                    }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z"
                            fill="#272739"
                        />
                        <path
                            d="M13.95 16C15.828 16 17.35 14.4329 17.35 12.5C17.35 10.5671 15.828 9 13.95 9C12.072 9 10.55 10.5671 10.55 12.5C10.55 14.4329 12.072 16 13.95 16ZM15.2967 17.3125H12.6033C10.0605 17.3125 8 19.4344 8 22.0512C8 22.5762 8.41225 23 8.92066 23H18.9783C19.4883 23 19.9 22.5762 19.9 22.0512C19.9 19.4344 17.8388 17.3125 15.2967 17.3125ZM20.7261 17.75H18.7645C19.985 18.7809 20.75 20.323 20.75 22.0512C20.75 22.4012 20.6491 22.7238 20.4844 23H24.15C24.6202 23 25 22.6063 25 22.1004C25 19.7078 23.0981 17.75 20.7261 17.75ZM19.475 16C21.1192 16 22.45 14.6301 22.45 12.9375C22.45 11.2449 21.1192 9.875 19.475 9.875C18.808 9.875 18.1989 10.1089 17.7028 10.4905C18.0088 11.0954 18.2 11.7727 18.2 12.5C18.2 13.4713 17.8831 14.3632 17.3609 15.0897C17.8998 15.65 18.6463 16 19.475 16Z"
                            fill="#6F6F84"
                        />
                    </svg>
                    <span>Create a new group</span>
                </button> */}
                <div>
                    {users.map((user: any, index: number) => {
                        return user._id == authUser?.userId ? null : (
                            <div
                                className="flex cursor-pointer items-center gap-4 py-2 "
                                key={user?._id}
                                onClick={() => {
                                    connect(user?._id);
                                }}>
                                <figure className="w-[32px] h-[32px]  relative overflow-hidden rounded-full UerProfileImage flex items-center justify-center relative flex-shrink-0">
                                    {user?.avatar ? (
                                        <ImageComponent
                                            // width={32}
                                            // height={32}
                                            objectFit="cover"
                                            layout="fill"
                                            className="rounded-full"
                                            src={user?.avatar}
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                            alt=""
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-xl pt-[2px]">
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                </figure>
                                <div className="w-full">
                                    <div className="flex gap-2">
                                        <h6 className="flex flex-shrink-0 text-white text-base font-Proxima-Regular gap-2">
                                            {' '}
                                            {user?.firstName} {user?.lastName}
                                        </h6>
                                        {user?.isVerfied && <Verified />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CreateGroupChat;
