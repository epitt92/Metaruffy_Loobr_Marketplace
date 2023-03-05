import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loader from '../../../components/loader/Loader';
import { collectionABI } from '../../../contractsData/abis';
const Contract = require('web3-eth-contract');
Contract.setProvider('https://eth.getblock.io/mainnet/?api_key=919b6eda-7ddf-4dcd-a034-4c55a6e2e9e1');

type Props = {};

const ExtStats = (props: Props) => {
    const [statsLoading, setStatsLoading] = useState<any>(false);
    const [owner, setOwner] = useState<any>('');
    const [supply, setSupply] = useState<any>(0);

    const router = useRouter();
    const { address }: any = router.query;

    useEffect(() => {
        address && getStats(address);
    }, [address]);
    const getStats = async (address: string) => {
        try {
            setStatsLoading(true);

            const contract = new Contract(collectionABI, address);
            const supply = await contract.methods.totalSupply().call();
            // const max = await contract.methods.maxSupply().call();
            setSupply(Number(supply));
            // setMaxSupply(Number(max));

            setStatsLoading(false);
        } catch (error) {
            setStatsLoading(false);
            console.log(error, 'Error price');
        }
    };

    return (
        <div className="mt-8 flex   lg:flex-nowrap flex-wrap   ">
            {statsLoading ? (
                <Loader />
            ) : (
                <div className="h-[6.813rem] sm:w-[11.75rem] w-full   flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg   text-themecolor font-Proxima-SemiBold">
                        {supply}
                    </h3>
                    <p className="sm:text-lg mt-5 text-white">Supply</p>
                </div>
            )}
        </div>
    );
};

export default ExtStats;
