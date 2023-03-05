import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Popups from '../../popup/poups';

type Props = {
    nft: any;
    disabled?: boolean;
    size: any;
    showLoginPopup?: boolean;
};

const CommentCount = ({ nft, size, disabled, showLoginPopup }: Props) => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [count, setCount] = useState<number>(nft?.comments?.length || 0);
    const [confirmed, setConfirmed] = useState<boolean>(false);

    const data = useMemo(() => ({ ...nft, setCount, count }), [nft, count]);

    useEffect(() => {
        if (confirmed) {
            setConfirmed(false);
        }
    }, [confirmed]);
    useEffect(() => {
        setCount(nft?.comments?.length || 0);
    }, [nft]);
    return (
        <div className="flex items-center cursor-pointer">
            <div
                onClick={() => {
                    !disabled && setPopup(true);
                    !disabled && setState(26);
                    if (showLoginPopup) {
                        setPopup(true);
                        setState(1);
                    }
                }}
                className={`${size ? 'Atcardhovercomment-bg2' : 'Atcardhovercomment-bg'}`}>
                <svg
                    className={` ${
                        size ? 'h-[16px] w-[16px] Atcardhovercomment2 ' : 'h-[1.25rem] w-[1.25rem] Atcardhovercomment'
                    }`}
                    // width="20"
                    // height="20"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 7H16M6 12H12M7.5 18H7C3 18 1 17 1 12V7C1 3 3 1 7 1H15C19 1 21 3 21 7V12C21 16 19 18 15 18H14.5C14.19 18 13.89 18.15 13.7 18.4L12.2 20.4C11.54 21.28 10.46 21.28 9.8 20.4L8.3 18.4C8.14 18.18 7.77 18 7.5 18Z"
                        stroke="#A1A1A5"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <p className=" text-white text-[14px]  ml-[1.5px]  font-Proxima-Bold">{count}</p>
            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={data}
                    type="nft"
                    setConfirmed={setConfirmed}
                    confirmed={confirmed}
                />
            )}
        </div>
    );
};

export default CommentCount;
