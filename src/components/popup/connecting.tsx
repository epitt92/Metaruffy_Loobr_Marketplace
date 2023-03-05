import React, { useEffect } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import useMetaMask from '../../hooks/useMetaMask';
import { METAMASK_POPUP } from '../../constants/enums';

const Connecting = ({ setstate, state, data }: any) => {
    const { connect, disconnect, isActive, account, library, isLoading }: any = useMetaMask();

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isActive) {
            if (data?.flow === METAMASK_POPUP.create) {
                setstate(11);
            }
            if (data?.flow === METAMASK_POPUP.profile) {
                setstate(9);
            }
            if (data?.flow === METAMASK_POPUP.bid) {
                setstate(13);
            }
            if (data?.flow === METAMASK_POPUP.buy) {
                setstate();
            }
            if (data?.flow === METAMASK_POPUP.unlist) {
                setstate();
            }
            if (data?.flow === METAMASK_POPUP.mint) {
                setstate();
            }
            if (data?.flow === METAMASK_POPUP.dao) {
                setstate();
            } else {
                // setstate();
            }
        }
    }, [isLoading, isActive]);

    return (
        <div className=" sm:w-[27.563rem] w-full text-center   py-7 ">
            <h6 className="text-white text-center text-lg">Connecting</h6>
            <div className="border-b border-[#43434C] mt-5  text-center"></div>
            <div className="text-center ">
                <p className="text-[#A1A1A5]  font-Circular-Book text-base mt-8   text-center">
                    MetaMask wallet details screen<br></br> with data will come here
                </p>
            </div>
            <figure className="mt-12">
                {/* <Image src="/assets/images/loader.png" height={48} width={48} alt="" /> */}
                <div className="loadingio-spinner-rolling-jz7efhw30v">
                    <div className="ldio-fcd0x3izul5">
                        <div></div>
                    </div>
                </div>
            </figure>
            <p className="text-base font-SofiaPro-Regular mt-6 ">Loading to Connect</p>
        </div>
    );
};

export default Connecting;
