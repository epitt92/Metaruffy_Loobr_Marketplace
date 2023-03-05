import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useMetaMask from '../../hooks/useMetaMask';
import { getMarketDetailsByNFTAddress } from '../../utils/functions';
import Button from '../Button/Button';

type IProps = {
    data: {
        loading: boolean;
        onDelete: Function;
        switchNetwork: Function;
        deleteIndex: number;
        heading: string;
        contractAddress: string;
        chain: string;
        chainId: number;
    };
    account?: boolean;
    setstate: Function;
};


const SwitchNetwork = ({ data, setstate, account }: IProps) => {
console.log(data, 'data');

    const [loading, setLoading] = useState(false);
    const contracts = getMarketDetailsByNFTAddress(data?.contractAddress);
    const chain = contracts
        ? contracts?.chainId
        : data?.chainId
        ? data?.chainId
        : data?.chain == 'BSC'
        ? 56
        : data?.chain == 'ETH'
        ? 1
        : data?.chain == 'AVAX'
        ? 43113
        : 80001;

    const { switchNetwork }: any = useMetaMask();

    const handleSwitchNetwork = async () => {
        try {
            setLoading(true);
            const status = await switchNetwork(chain);
            setLoading(false);
            if (status) {
                data.switchNetwork();
            }
        } catch (error) {}
    };

    return (
        <div className=" sm:w-[31.25rem] w-[25rem]  m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">{data.heading}</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want <span className="block"> switch network?</span>
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                    disabled={data.loading}
                    onClick={() => {
                        setstate();
                    }}
                    className="w-full md:px-11 px-1 rounded-lg text-[#727279] !bg-[#2b2b35]">
                    Cancel
                </Button>
                <Button
                    className="w-full md:px-11 px-1 rounded-lg bg-gold"
                    onClick={handleSwitchNetwork}
                    isLoading={loading}
                    disabled={loading}>
                    Switch Network
                </Button>
            </div>
        </div>
    );
};

export default SwitchNetwork;
