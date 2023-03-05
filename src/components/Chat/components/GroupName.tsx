import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { connectRoom } from '../../../redux/messages/actions';
import { generateFileUrl, uploadFile } from '../../../services/upload.service';
import { ImSpinner11, ImSpinner9 } from 'react-icons/im';
import ImageComponent from '../../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
const GroupName = ({ setGroup, setValues, values, selectedUser, setSelectedUser }: any) => {
    const [count, setCount] = useState<number>(0);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const [loadinUpload, setLoadingUpload] = useState<boolean>(false);
    useEffect(() => {
        setCount(values.users.length);
        setError({ name: '', users: '' });
    }, []);
    const [error, setError] = useState({
        name: '',
        users: ''
    });

    const setChecked = (checked: boolean, user: any) => {
        try {
            if (user && user._id) {
                if (count !== 0) {
                    let array = values.users;
                    let index = array.indexOf(user._id);
                    if (index !== -1) {
                        array.splice(index, 1);
                        setValues({ ...values, users: [...array] });
                    }
                    let array1 = selectedUser;
                    let index1 = array1.indexOf(user);
                    if (index1 !== -1) {
                        array1.splice(index1, 1);
                        setSelectedUser([...array1]);
                    }
                    setCount(count - 1);
                }
            }
        } catch (error) {
            // console.log(error);
        }
    };
    const createGroup = () => {
        if (!values.name || values.users.length < 2) {
            if (values.users.length < 2) {
                setError({ ...error, users: 'Please select atleast 2 users' });
            }
            !values.name && setError({ ...error, name: 'Please add the group name' });
            return false;
        } else {
            setError({ name: '', users: '' });
        }
        user &&
            user.userId &&
            dispatch(
                connectRoom({ subject: values.name, type: 'GROUP', image: values.image, recievedBy: values.users })
            );
        setGroup(1);
    };
    return (
        <div>
            <div className="pt-3 pb-3 px-5 min-h-[390px] max-h-[390px] overflow-auto at-sidebarwrapper scrollbarHide ">
                <div className="flex items-center gap-x-2.5 pb-7">
                    <div className="AtselectUserimg flex-shrink-0">
                        {loadinUpload ? (
                            <div className="w-[50px] h-[50px] flex items-center ">
                                <ImSpinner9 className="animate-spin text-4xl" />
                            </div>
                        ) : (
                            <>
                            <button
                            type="button"
                            onClick={() => {
                                setGroup(3);
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

                            <input
                                type="file"
                                accept="image/*"
                                name="select-image"
                                id="Atselectimage"
                                onChange={async (e: any) => {
                                    setLoadingUpload(true);
                                    try {
                                        let name = `${new Date().valueOf()}.${e.target.files[0].name.split('.')[1]}`;
                                        let originalName = e.target.files[0].name;
                                        let type = e.target.files[0].type;
                                        // let url = await generateFileUrl({ name, mime: type });
                                        let newUrl = await uploadFile(e.target.files[0]);
                                        setValues({ ...values, image: newUrl });
                                        setLoadingUpload(false);
                                    } catch (err) {}
                                }}
                            />
                            </>
                        )}
                        {values?.image ? (
                            <figure className="w-[50px] h-[50px]  rounded-full overflow-hidden">
                                <ImageComponent
                                    width={50}
                                    height={50}
                                    src={values.image}
                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                />
                            </figure>
                        ) : (
                            !loadinUpload && (
                                <label htmlFor="Atselectimage ">
                                    <svg
                                        width="22"
                                        height="21"
                                        viewBox="0 0 22 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.0003 5.79961C9.62114 5.79961 8.2985 6.34746 7.32331 7.32265C6.34812 8.29784 5.80027 9.62048 5.80027 10.9996C5.80027 12.3787 6.34812 13.7014 7.32331 14.6766C8.2985 15.6518 9.62114 16.1996 11.0003 16.1996C12.3794 16.1996 13.702 15.6518 14.6772 14.6766C15.6524 13.7014 16.2003 12.3787 16.2003 10.9996C16.2003 9.62048 15.6524 8.29784 14.6772 7.32265C13.702 6.34746 12.3794 5.79961 11.0003 5.79961ZM7.10027 10.9996C7.10027 9.96526 7.51116 8.97328 8.24255 8.24189C8.97394 7.5105 9.96592 7.09961 11.0003 7.09961C12.0346 7.09961 13.0266 7.5105 13.758 8.24189C14.4894 8.97328 14.9003 9.96526 14.9003 10.9996C14.9003 12.034 14.4894 13.0259 13.758 13.7573C13.0266 14.4887 12.0346 14.8996 11.0003 14.8996C9.96592 14.8996 8.97394 14.4887 8.24255 13.7573C7.51116 13.0259 7.10027 12.034 7.10027 10.9996ZM8.56147 0.599609C8.20013 0.599621 7.84589 0.700033 7.53829 0.889642C7.2307 1.07925 6.98183 1.3506 6.81947 1.67341L6.05247 3.19961H3.85547C2.99352 3.19961 2.16686 3.54202 1.55737 4.15151C0.947878 4.76101 0.605469 5.58766 0.605469 6.44961V16.8496C0.605469 17.7116 0.947878 18.5382 1.55737 19.1477C2.16686 19.7572 2.99352 20.0996 3.85547 20.0996H18.1555C19.0174 20.0996 19.8441 19.7572 20.4536 19.1477C21.0631 18.5382 21.4055 17.7116 21.4055 16.8496V6.44961C21.4055 5.58766 21.0631 4.76101 20.4536 4.15151C19.8441 3.54202 19.0174 3.19961 18.1555 3.19961H15.9585L15.1993 1.67861C15.0374 1.35443 14.7885 1.08176 14.4803 0.891171C14.1722 0.700584 13.817 0.599622 13.4547 0.599609H8.56147ZM7.98037 2.25711C8.03458 2.14952 8.11763 2.05912 8.22024 1.99599C8.32286 1.93286 8.44099 1.89949 8.56147 1.89961H13.4547C13.5755 1.89937 13.694 1.93282 13.7969 1.9962C13.8998 2.05958 13.9829 2.15038 14.0371 2.25841L14.977 4.13951C15.031 4.24734 15.114 4.33801 15.2166 4.40138C15.3192 4.46474 15.4375 4.49831 15.5581 4.49831H18.1568C18.6739 4.49831 19.1699 4.70375 19.5356 5.06945C19.9013 5.43515 20.1068 5.93114 20.1068 6.44831V16.8496C20.1068 17.3668 19.9013 17.8628 19.5356 18.2285C19.1699 18.5942 18.6739 18.7996 18.1568 18.7996H3.85677C3.3396 18.7996 2.84361 18.5942 2.47791 18.2285C2.11221 17.8628 1.90677 17.3668 1.90677 16.8496V6.44961C1.90677 5.93244 2.11221 5.43645 2.47791 5.07075C2.84361 4.70505 3.3396 4.49961 3.85677 4.49961H6.45417C6.57456 4.49936 6.69252 4.46569 6.79489 4.40234C6.89726 4.33898 6.98003 4.24844 7.03397 4.14081L7.98037 2.25711Z"
                                            fill="#B8B8BC"
                                        />
                                    </svg>
                                </label>
                            )
                        )}
                    </div>
                    <div className='mt-4'>
                        <input
                            className="bg-transparent w-full focus:outline-none pl-2.5 pb-3.5   text-themecolor text-sm border-b-[1px] border-[#2b2b35]"
                            type="text"
                            name="group-name"
                            placeholder="Group Name"
                            value={values.name}
                            onChange={(e) => {
                                !loadinUpload && setValues({ ...values, name: e.target.value });
                            }}
                        />
                        {error.name && <p className="text-red-500">{error.name}</p>}
                    </div>
                </div>
                {/* Selected Users Start */}
                <div>
                    <h3 className="text-gray6 text-sm font-Proxima-Regular mb-3">Participants</h3>
                </div>
                <div className="flex items-center flex-wrap gap-2 pb-2">
                    {selectedUser?.map((user: any, index: number) => {
                        return (
                            <div
                                className="border border-[#5a5a62] rounded-3xl flex items-center gap-x-2 min-w-[132px] max-w-[132px] min-h-[33px] px-2 relative"
                                key={index}>
                                <figure className="w-[20px] h-[20px] rounded-full overflow-hidden">
                                    {user?.avatar ? (
                                        <ImageComponent
                                            width={20}
                                            height={20}
                                            className="rounded-full"
                                            src={user?.avatar}
                                            alt=""
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 ">
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
                                        !loadinUpload && setChecked(false, user);
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

                    <div className="border border-[#5a5a62] rounded-3xl flex items-center justify-center gap-x-2 min-w-[108px] max-w-[132px] min-h-[33px] px-2 relative">
                        <button
                            className="flex items-center justify-center gap-x-2"
                            onClick={() => {
                                !loadinUpload && setGroup(3);
                            }}>
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.2083 8.70833C17.7713 8.70833 17.4167 9.063 17.4167 9.5C17.4167 13.8653 13.8653 17.4167 9.5 17.4167C5.13475 17.4167 1.58333 13.8653 1.58333 9.5C1.58333 5.13475 5.13475 1.58333 9.5 1.58333C11.6252 1.58333 13.6202 2.41379 15.1181 3.92192C15.4256 4.23225 15.9271 4.23423 16.2375 3.92588C16.5478 3.61792 16.5494 3.11679 16.2414 2.80646C14.4444 0.996708 12.05 0 9.5 0C4.26154 0 0 4.26154 0 9.5C0 14.7385 4.26154 19 9.5 19C14.7385 19 19 14.7385 19 9.5C19 9.063 18.6453 8.70833 18.2083 8.70833Z"
                                    fill="white"
                                />
                                <path
                                    d="M12.6667 8.70833H10.2917V6.33333C10.2917 5.89633 9.937 5.54167 9.5 5.54167C9.063 5.54167 8.70833 5.89633 8.70833 6.33333V8.70833H6.33333C5.89633 8.70833 5.54167 9.063 5.54167 9.5C5.54167 9.937 5.89633 10.2917 6.33333 10.2917H8.70833V12.6667C8.70833 13.1037 9.063 13.4583 9.5 13.4583C9.937 13.4583 10.2917 13.1037 10.2917 12.6667V10.2917H12.6667C13.1037 10.2917 13.4583 9.937 13.4583 9.5C13.4583 9.063 13.1037 8.70833 12.6667 8.70833Z"
                                    fill="white"
                                />
                            </svg>
                            <span className="text-white text-xs font-Proxima-SemiBold">Add more</span>
                        </button>
                    </div>
                    {error.users && <p className="text-red-500 py-2">{error.users}</p>}
                </div>
                {/* Selected Users End */}
            </div>
            <div className="fixed bottom-[88px] lg:static lg:bottom-0 w-full">
                <div className="bg-[#28283A] h-[65px]  flex items-center justify-between px-5">
                    <span className="text-[#a1a1a5] font-[14px]">{count} selected</span>
                    <button
                        type="button"
                        className="inline-flex font-Proxima-Bold items-center justify-center px-11  rounded-full  relative text-black2 !bg-[#FECD08] !py-2.5 text-sm flex-shrink-0 Atthemeshadow"
                        onClick={() => {
                            !loadinUpload && createGroup();
                        }}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupName;
