import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { getUser } from '../../redux/auth/actions';
import { GET_USER } from '../../redux/auth/actionTypes';
import { change2FARequest } from '../../redux/user/actions';
import Button from '../Button/Button';
import Switch from '../switch/Switch';
import Poups from './poups';
interface Iprops {
    setstate: Function;
    hide: any;
    setData: any;
    data: any;
}
const Settingsdrop = ({ setstate, setData, data }: Iprops) => {
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: any) => state.auth.user);

    const dispatch = useDispatch();

    const handleToggleTowFA = async (value: boolean) => {
        try {
            setLoading(true);
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/change-settings`, { twoFa: value });
            dispatch({
                type: GET_USER,
                payload: { ...user, settings: { twoFa: value } }
            });

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="w-full sm:w-[33rem]  rounded-2xl  py-3">
            <h3 className=" border px-6 border-b-[#2B2B35] border-transparent text-center  text-white  pb-3 ">
                Settings
            </h3>
            <div className="mt-9 w-full px-6">
                <div
                    className="text-white   flex justify-between items-center gap-3 mt-5 cursor-pointer"
                    onClick={() => {
                        setstate(97);
                    }}>
                    <h5 className="text-xl">Notification Settings</h5>
                    <img src="/assets/images/arrow.svg" alt="" />
                </div>
                <div
                    className="text-white   flex justify-between items-center gap-3 mt-5 cursor-pointer"
                    onClick={() => {
                        setstate(81);
                    }}>
                    <h5 className="text-xl">Messaging Privacy</h5>
                    <img src="/assets/images/arrow.svg" alt="" />
                </div>
                {/* <div className="mt-6 border-2 border-themecolor relative rounded-lg">
                    <span className="block absolute bg-themecolor w-full opacity-10  h-full "></span>
                    <Button
                        className="bg-transparent text-themecolor w-full  !px-6"
                        onClick={handleSubmit}
                        isLoading={loading}
                        disabled={loading}>
                        Save Settings
                    </Button>
                </div> */}
            </div>
            <div className="text-white flex justify-between items-center gap-3 mt-6 px-6">
                <div className="flex items-center gap-4">
                    <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M25.8999 3.86673L16.7332 0.433398C15.7832 0.0833985 14.2332 0.0833985 13.2832 0.433398L4.11651 3.86673C2.34984 4.5334 0.916504 6.60006 0.916504 8.48339V21.9834C0.916504 23.3334 1.79984 25.1167 2.88317 25.9167L12.0498 32.7667C13.6665 33.9834 16.3165 33.9834 17.9332 32.7667L27.0998 25.9167C28.1832 25.1001 29.0665 23.3334 29.0665 21.9834V8.48339C29.0832 6.60006 27.6499 4.5334 25.8999 3.86673ZM20.7998 13.2001L13.6332 20.3667C13.3832 20.6167 13.0665 20.7334 12.7498 20.7334C12.4332 20.7334 12.1165 20.6167 11.8665 20.3667L9.19984 17.6667C8.71651 17.1834 8.71651 16.3834 9.19984 15.9001C9.68318 15.4167 10.4832 15.4167 10.9665 15.9001L12.7665 17.7001L19.0498 11.4167C19.5332 10.9334 20.3332 10.9334 20.8165 11.4167C21.2998 11.9001 21.2998 12.7167 20.7998 13.2001Z"
                            fill="#EFC74D"
                        />
                    </svg>
                    <div>
                        <h5 className="text-xl ">Use Two-Factor Authentication</h5>
                        <p className="text-white text-xs">
                            We will ask for a login code if we notice an attempted{' '}
                            <span className="block">login from an unrecognized decive or browser</span>
                        </p>
                    </div>
                </div>
                <Switch
                    checked={user?.settings?.twoFa}
                    onSelect={(value) => {
                        handleToggleTowFA(value);
                    }}
                />
            </div>
            <div className="border-t-2 mt-7 border-t-[#2B2B35] ">
                <div className="text-white flex justify-between items-center gap-3 px-6  mt-7 mb-2">
                    <h5 className="text-xl">Account settings</h5>
                    <Button
                        className="text-[#FF0000] bg-transparent border border-[#FF0000] !px-6"
                        onClick={() => {
                            setstate(51);
                        }}>
                        Delete account
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Settingsdrop;
