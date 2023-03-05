import React, { useEffect } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import useMetaMask from '../../hooks/useMetaMask';
import { connectors } from '../wallet/connectors';
import { useWeb3React } from '@web3-react/core';

const Connectmetamask = ({ setstate, data }: any) => {
    const { activate } = useWeb3React();
    const { connect, setIsLoading }: any = useMetaMask();

    const handleConnectMetamask = () => {
        setstate(8);
        connect().then(() => {
            console.log('connected');
            setIsLoading(false);
        });
        setProvider('injected');
    };

    const handleConnectWallet = () => {
        try {
            activate(connectors.walletConnect);
            setProvider('walletConnect');
            setstate();
        } catch (error) {
            console.log('test');
        }
    };

    const handleConnectCoinbase = () => {
        setstate(8);
        activate(connectors.coinbaseWallet);
        setProvider('coinbaseWallet');
    };

    const setProvider = (type: string) => {
        window.localStorage.setItem('provider', type);
    };

    return (
        <div className="!w-[27.563rem] !xs:w-full xs:px-4 py-7  ">
            <h6 className="text-white text-center ">Connect Your Wallet</h6>

            <div className="border-b border-[#43434C] mt-5  text-center"></div>

            <div className="text-center ">
                <p className="text-[#A1A1A5] font-SofiaPro-Regular text-base mt-8  text-center">
                    By connecting your wallet, you agree to our
                    <br /> Terms of Services and Privacy Policy
                </p>
                <div className="md:block">
                    <Button
                        onClick={handleConnectMetamask}
                        className="w-[21.125rem] xs:w-[15rem]   mt-6 flex justify-between items-center border border-none py-4 lg:py-3 text-left px-6 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-300 ">
                        <span className="text-base font-SofiaPro-Regular text-white">MetaMask</span>

                        <div className="flex gap-3 items-center">
                            <figure className="h-10 w-10   relative">
                                <Image objectFit="contain" layout="fill" src="/assets/images/mask.png" alt="" />
                            </figure>

                            <figure className="h-10 w-10  relative">
                                <Image objectFit="contain" layout="fill" src="/assets/images/trust.png" alt="" />
                            </figure>
                        </div>
                    </Button>
                </div>
                {/* <Button
                    onClick={handleConnectCoinbase}
                    className="w-[21.125rem] xs:w-[15rem]  mt-6 flex justify-between items-center border border-none py-4 lg:py-3 text-left px-6 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-300 ">
                    <span className="text-base font-SofiaPro-Regular text-white">Coinbase Wallet</span>

                    <figure className="h-10 w-10  relative">
                        <Image objectFit="contain" layout="fill" src="/assets/images/mask.png" alt="" />
                    </figure>
                </Button> */}
                <Button
                    onClick={handleConnectWallet}
                    className="w-[21.125rem] xs:w-[15rem]  mt-6 flex justify-between items-center border border-none py-4 lg:py-3 text-left px-6 rounded-lg bg-white ">
                    <span className="text-base font-SofiaPro-Regular text-black">Wallet Connect</span>

                    <figure className="h-10 w-10  relative">
                        <Image objectFit="contain" layout="fill" src="/assets/images/walletconnect.svg" alt="" />
                    </figure>
                </Button>
            </div>
        </div>
    );
};

export default Connectmetamask;
