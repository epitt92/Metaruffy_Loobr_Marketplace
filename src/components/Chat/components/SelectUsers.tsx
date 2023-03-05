import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { getAllRooms, getUsers, connectRoom } from '../../../redux/messages/actions';
import { json } from 'stream/consumers';
import Button from '../../Button/Button';
import ImageComponent from '../../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
const SelectUsers = ({ setGroup, setValues, values, selectedUser, setSelectedUser }: any) => {
    const allUsers = useSelector((state: any) => state.chat.allusers);
    const authUser = useSelector((state: any) => state.auth.user);
    const [count, setCount] = useState<number>(0);
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<any>([]);
    useEffect(() => {
        setCount(values.users.length);
    }, []);
    const dispatch = useDispatch();
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

    const setChecked = (checked: boolean, user: any) => {
        try {
            if (user && user._id) {
                if (checked) {
                    let arr = values.users;
                    arr.push(user._id);
                    setValues({ ...values, users: [...arr] });
                    setSelectedUser([...selectedUser, user]);
                    setCount(count + 1);
                } else {
                    if (count !== 0) {
                        let array = values.users;
                        let index = array.indexOf(user._id);
                        if (index !== -1) {
                            array.splice(index, 1);
                            setValues({ ...values, users: [...array] });
                        }
                        let array1 = selectedUser;
                        let index1 = array1.findIndex((u: any) => u._id == user._id);
                        if (index1 !== -1) {
                            array1.splice(index1, 1);
                            setSelectedUser([...array1]);
                        }
                        setCount(count - 1);
                    }
                }
            }
        } catch (error) {
            // console.log(error);
        }
    };
    return (
        <div>
            <div className="AtsearchUsers">
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
            <div className="pt-3 pb-3 px-5 lg:min-h-[320px] lg:max-h-[320px] min-h-[500px]max-h-[500px]   overflow-auto at-sidebarwrapper scrollbarHide">
                {/* Selected Users Start */}
                <div className="flex items-center flex-wrap gap-2 pb-2">
                    {selectedUser?.map((user: any, index: number) => {
                        return (
                            <div
                                className="border border-[#5a5a62] rounded-3xl flex items-center gap-x-2 min-w-[132px] max-w-[132px] min-h-[33px] px-2 relative"
                                key={user?._id}>
                                <figure className="w-[20px] h-[20px] rounded-full overflow-hidden">
                                    {user?.avatar ? (
                                        <ImageComponent
                                            width={20}
                                            height={20}
                                            src={user.avatar}
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-sm ">
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                </figure>
                                <p className="text-white truncate max-w-[70px] text-xs font-Proxima-SemiBold">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <button
                                    className="absolute right-2 bottom-1/2 translate-y-1/2"
                                    onClick={() => {
                                        setChecked(false, user);
                                    }}>
                                    <svg
                                        width="9"
                                        height="9"
                                        viewBox="0 0 9 9"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M7.59673 7.59477L1.40625 1.4043M7.59673 1.4043L1.40625 7.59477"
                                            stroke="white"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                    {/* Selected Users End */}
                </div>
                <div>
                    {users.map((user: any, index: number) => {
                        return user._id == authUser?.userId ? null : (
                            <div className="flex cursor-pointer items-center gap-4 py-2 " key={user?._id}>
                                <figure className="w-[32px] h-[32px]    relative overflow-hidden rounded-full UerProfileImage flex items-center justify-center relative flex-shrink-0">
                                    {user?.avatar ? (
                                        <ImageComponent
                                            // width={32}
                                            // height={32}
                                            layout="fill"
                                            objectFit="cover"
                                            
                                            className="rounded-full"
                                            src={user?.avatar}
                                            alt=""
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-xl pt-[2px] ">
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                </figure>
                                <div className="w-full">
                                    <div className="flex justify-between gap-2">
                                        <h6 className="flex flex-shrink-0 text-white text-base font-Proxima-Regular gap-2">
                                            {user?.firstName} {user?.lastName}
                                        </h6>
                                        <div className="At-selectusercheck">
                                            <input
                                                type="checkbox"
                                                name="select-user"
                                                id={`AtSelectuser ${user?._id}`}
                                                onChange={(e: any) => {
                                                    setChecked(e.target.checked, user);
                                                }}
                                                checked={values?.users.includes(user._id)}
                                            />
                                            <label htmlFor={`AtSelectuser ${user?._id}`}></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="fixed bottom-[88px] lg:static lg:bottom-0 w-full">
                <div className="bg-[#28283A] h-[65px] flex items-center justify-between px-5 ">
                    <span className="text-[#a1a1a5] font-[14px]">{count} selected</span>
                    <button
                        type="button"
                        className="inline-flex font-Proxima-Bold items-center justify-center px-11  rounded-full  relative text-black2 !bg-[#FECD08] !py-2.5 text-sm flex-shrink-0 Atthemeshadow"
                        onClick={() => {
                            setGroup(4);
                        }}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectUsers;
