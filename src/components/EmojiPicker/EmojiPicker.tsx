import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { userInfo } from 'os';
import { useSelector } from 'react-redux';
import getStoredState from 'redux-persist/es/integration/getStoredStateMigrateV4';
import Poups from '../popup/poups';
interface IProps {
    setEmoji: Function;
    className?: any;
    outerClassName?: any;
}
export const EmojiPicker = ({ setEmoji, className, outerClassName }: IProps) => {
    const [show, setShow] = useState<boolean>(false);
    const [state, setState] = useState<any>(-1);
    const [popoup, setPopup] = useState<boolean>(false);
    const myRef11: any = useRef(null);
    const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });
    const user = useSelector((state: any) => state.auth.user);
    const emojiHandle = (e: React.ChangeEvent<HTMLFormElement>) => {
        if (user && user.userId) {
            if (e.target.id == 'outer') {
                setShow(!show);
            }
        } else {
            setPopup(true);
            setState(1);
        }
    };
    const onEmojiClick = (event: any, emojiObject: any) => {
        setEmoji(emojiObject.emoji);
        // setShow(false);
    };

    const handleClickOutside = (e: any) => {
        if (!myRef11?.current?.contains(e.target) && e.target.id != 'outer') {
            setShow(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });
    return (
        <div className={`flex items-center absolute right-[45px]  top-1/2 -translate-y-1/2 ${outerClassName}`}>
            <div
                onClick={(e: any) => {
                    emojiHandle(e);
                    // setShow(!show);
                }}>
                {' '}
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="cursor-pointer"
                        id={'outer'}
                        d="M2 16C2 8.268 8.268 2 16 2C23.732 2 30 8.268 30 16C30 23.732 23.732 30 16 30C8.268 30 2 23.732 2 16ZM12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15ZM22 13C22 12.4696 21.7893 11.9609 21.4142 11.5858C21.0391 11.2107 20.5304 11 20 11C19.4696 11 18.9609 11.2107 18.5858 11.5858C18.2107 11.9609 18 12.4696 18 13C18 13.5304 18.2107 14.0391 18.5858 14.4142C18.9609 14.7893 19.4696 15 20 15C20.5304 15 21.0391 14.7893 21.4142 14.4142C21.7893 14.0391 22 13.5304 22 13ZM9.553 19.106C9.31599 19.2246 9.13577 19.4325 9.05196 19.684C8.96814 19.9354 8.98758 20.2099 9.106 20.447V20.45L9.108 20.452L9.111 20.458L9.119 20.473C9.14992 20.5327 9.18328 20.5911 9.219 20.648C9.284 20.755 9.379 20.9 9.505 21.068C9.8469 21.5203 10.2444 21.9279 10.688 22.281C11.79 23.163 13.508 24 16 24C18.493 24 20.21 23.163 21.312 22.28C21.7555 21.9275 22.153 21.5206 22.495 21.069C22.6369 20.8792 22.7659 20.6801 22.881 20.473L22.889 20.458L22.892 20.452L22.894 20.449V20.447C23.0041 20.2116 23.0183 19.9425 22.9334 19.6968C22.8486 19.4511 22.6714 19.2482 22.4394 19.1309C22.2075 19.0136 21.9389 18.9912 21.6908 19.0685C21.4426 19.1458 21.2343 19.3167 21.11 19.545L21.106 19.552L21.072 19.61C21.0172 19.6991 20.9581 19.7856 20.895 19.869C20.727 20.094 20.455 20.405 20.063 20.719C19.29 21.337 18.007 22 16 22C13.993 22 12.71 21.337 11.937 20.72C11.6252 20.4723 11.3456 20.1864 11.105 19.869C11.0289 19.7675 10.9587 19.6617 10.895 19.552L10.891 19.545C10.7711 19.31 10.5632 19.1319 10.3126 19.0495C10.062 18.9671 9.78897 18.987 9.553 19.105V19.106Z"
                        fill="#F1C94A"
                    />
                </svg>
                {show && (
                    <div ref={myRef11} className={`bottom-[25px] absolute right-0 ${className}`}>
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
            {state && <Poups show={popoup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};
