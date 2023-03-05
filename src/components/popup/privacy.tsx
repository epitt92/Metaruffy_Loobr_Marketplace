import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { GET_USER } from '../../redux/auth/actionTypes';
const Privacy = ({ setstate: testate }: any) => {
    const [settings, setSettings] = useState<any>();

    const [privacy, setPrivacy] = useState<any>();
    const user = useSelector((state: any) => state.auth.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.settings) {
            setPrivacy(user?.settings?.messagePrivacy);
        }
    }, [user?.settings]);
    const submit = async (value: string) => {
        setPrivacy(value);
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/change-settings`, {
                ...user.settings,
                messagePrivacy: value
            });
            dispatch({
                type: GET_USER,
                payload: { ...user, settings: { ...user.settings, messagePrivacy: value } }
            });
        } catch (error) {}
    };
    return (
        <div className="w-full sm:w-[33rem]  rounded-2xl px-12  !py-6">
            <div 
                className="cursor-pointer z-20 relative   "
                onClick={() => {
                    testate(53);
                }}>
                <svg className=' cursor-pointer ' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15 18.14L8.93 12.07L15 6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <h3 className="  text-center  text-white -mt-5   ">Privacy</h3>
            <h5 className="font-Proxima-SemiBold text-white text-lg mt-10">Who can message you?</h5>
            <div className="flex items-center gap-2 mt-6">
                <input
                    type="radio"
                    id="EVERYONE"
                    name="yes"
                    className="h-5 w-5 !border-none !outline-none cursor-pointer"
                    // value={privacy}
                    value="EVERYONE"
                    checked={privacy === 'EVERYONE'}
                    onChange={() => {
                        submit('EVERYONE');
                    }}
                />

                <h6 className="text-white font-Proxima-Regular ">Everyone</h6>
            </div>
            <div className="flex items-center gap-2 mt-5">
                <input
                    type="radio"
                    id="FOLLOW"
                    name="yes"
                    className="h-5 w-5 !border-none !outline-none cursor-pointer"
                    value="FOLLOW"
                    checked={privacy === 'FOLLOW'}
                    onChange={() => {
                        submit('FOLLOW');
                    }}
                />

                <h6 className="text-white font-Proxima-Regular ">People you follow / followers</h6>
            </div>
            <div className="flex items-center gap-2 mt-5">
                <input
                    type="radio"
                    id="NOONE"
                    name="yes"
                    className="h-5 w-5 !border-none !outline-none cursor-pointer"
                    value="NOONE"
                    checked={privacy === 'NOONE'}
                    onChange={() => {
                        submit('NOONE');
                    }}
                />

                <h6 className="text-white font-Proxima-Regular ">No one</h6>
            </div>
            <p className="text-sm text-[#B8B8BC] mt-10">
                {' '}
                Choose who can who can message you. When people try to message you they won’t be able to do it if they
                you don’t allow.
            </p>
        </div>
    );
};

export default Privacy;
