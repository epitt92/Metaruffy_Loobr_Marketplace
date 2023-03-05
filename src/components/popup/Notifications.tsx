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
    data: any;
}
const SettingsNotifications = ({ setstate }: Iprops) => {
    const [settings, setSettings] = useState<any>();
    const [emailNotification, setEmailNotification] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const user = useSelector((state: any) => state.auth.user);
    const initRef = useRef(false);
    const initSettingRef = useRef(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.settings?.alerts && initSettingRef.current == false) {
            const payload = {
                messenger: true,
                // like: true,
                notifications: true,
                bids: true,
                buy: true,
                sell: true,
                mint: true,
                comment: true,
                follow: true
            };
            setSettings(user?.settings?.alerts);
            console.log({ setting: user?.settings });
            user?.settings?.email ? setEmailNotification(user?.settings?.email) : setEmailNotification(payload);
            initSettingRef.current = true;
        }
    }, [user?.settings]);

    const handleToggle = (name: string, value: boolean) => {
        setSettings((prev: any) => {
            return { ...prev.settings, [name]: value };
        });
        handleSubmit(false, name, value);
    };
    const handleEmailToggle = (name: string, value: boolean) => {
        setEmailNotification((prev: any) => {
            return { ...prev.emailNotification, [name]: value };
        });
        handleSubmit(true, name, value);
    };

    const handleSubmit = async (isEmail: boolean, name: string, value: boolean) => {
        try {
            setLoading(true);
            const alerts = settings;
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/user/change-settings`,
                isEmail
                    ? { email: { ...emailNotification, [name]: value } }
                    : { alerts: { ...settings, [name]: value } }
            );
            console.log({ email: { ...emailNotification, [name]: value }, alerts: { ...settings, [name]: value } });
            dispatch({
                type: GET_USER,
                payload: {
                    ...user,
                    settings: isEmail
                        ? { ...user.settings, email: { ...emailNotification, [name]: value } }
                        : { ...user.settings, alerts: { ...settings, [name]: value } }
                }
            });

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const mapData = [
        { id: 'messenger', title: 'Messenger Alert' },
        { id: 'bids', title: 'Bidding Alert' },
        { id: 'buy', title: 'Purchasing Alert' },
        { id: 'sell', title: 'Selling Alert' },
        { id: 'mint', title: 'Miniting Alert' },
        // { id: 'like', title: 'Like Alert' },
        { id: 'comment', title: 'Comment Alert' },
        { id: 'follow', title: 'Follow Alert' }
    ];

    return (
        <div className=" w-[33rem] xs2:w-[28rem] xs3:w-[25rem]  rounded-2xl  pt-5 pb-8">
            <div
                className=" relative px-4 cursor-pointer z-20"
                onClick={() => {
                    setstate(53);
                }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <h3 className="  px-7  text-center  text-white  pb-3 -mt-6 ">Notifications</h3>

            <div className="mt-6 w-full px-6">
                <div className="flex justify-end">
                    <div className="flex gap-14 w-[10rem]  items-center">
                        <p className=" font-Proxima-SemiBold">LooBr</p>
                        <p className="font-Proxima-SemiBold  "> Email</p>
                    </div>
                </div>
                {settings &&
                    emailNotification &&
                    mapData?.map((item: any) => {
                        return (
                            <div className="text-white flex justify-between items-center gap-3 mt-5">
                                <h5 className="text-xl">{item?.title}</h5>
                                <div className="flex gap-10">
                                    <Switch
                                        key={`${item?.id}-settings`}
                                        checked={settings[item.id]}
                                        onSelect={(value) => {
                                            handleToggle(item.id, value);
                                        }}
                                    />
                                    <Switch
                                        key={`${item?.id}-emails`}
                                        checked={emailNotification[item.id]}
                                        onSelect={(value) => {
                                            handleEmailToggle(item.id, value);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default SettingsNotifications;
