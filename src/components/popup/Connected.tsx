import React, { useEffect } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Connected = ({ setstate, state }: any) => {
    const user = useSelector((state: any) => state.auth.user);
    return (
        <div className=" w-[27.563rem]  xs:w-[23rem]   py-7 ">
            <h6 className="text-lg text-white text-center">Wallet</h6>
            <div className="border-b border-[#43434C] mt-5  text-center"></div>
            <div className=" m-auto mt-10 bg-themecolor h-[78px] w-[78px] rounded-full flex justify-center items-center">
                <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.99982 12.6714L21.9989 0L24 1.94902L8.99982 16.5695L0 7.79747L1.99965 5.84845L8.99982 12.6714Z"
                        fill="#14141F"
                    />
                </svg>
            </div>

            <div className="text-center ">
                <h6 className="text-lg text-white text-center mt-6">Wallet Connected</h6>

                <p className="text-[#A1A1A5] font-SofiaPro-Regular text-base   text-center">
                    You have connected your wallet successfully
                </p>
            </div>
            <Link legacyBehavior href={`/profile/${user.userName}`}>
                <a>
                    <Button
                        className="!px-16 !py-6 !block m-auto mt-6  rounded-[6.25rem]"
                        onClick={() => {
                            setstate();
                        }}>
                        View Profile
                    </Button>
                </a>
            </Link>
        </div>
    );
};

export default Connected;
