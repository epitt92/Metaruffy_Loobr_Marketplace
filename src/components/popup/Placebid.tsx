import React, { useEffect, useMemo, useState } from 'react';
import Button from '../Button/Button';
import Input from '../input/Input';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../hooks/useMetaMask';
import { getBidsBylistingId, placeBid } from '../../redux/nft/actions';
import Image from 'next/image';
import { isEmpty } from 'validate.js';
import { useWeb3React } from '@web3-react/core';
import { getMarketDetailsByAddressAndCurrency } from '../../utils/functions';

const Placebid = ({ setstate, data }: any) => {
    const { chainId } = useWeb3React();
    const [values, setValues] = useState({
        price: ''
    });

    const { account, library }: any = useMetaMask();
    const bids = useSelector((state: any) => state.nft.bids);
    const blockchain: any = useMemo(() => getMarketDetailsByAddressAndCurrency(data?.to, data?.currency), [data]);

    const dispatch = useDispatch();

    useEffect(() => {
        data?.listingId && dispatch(getBidsBylistingId(data?.listingId));
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const getMaxBid = () => {
        return !isEmpty(bids) ? bids[0]?.price : data?.price || 0;
    };

    const handleMakeOffer = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        setstate(17);
        const signer = library?.getSigner();
        dispatch(
            // @ts-ignore
            placeBid(
                signer,
                data?.listingId,
                values.price /* + (Number(values.price) * 1) / 100 */,
                account,
                data?.setTxHash,
                setstate,
                data?.to,
                blockchain?.tokenAddress,
                blockchain?.native
            )
        );
        // setstate(14);
    };

    return (
        <div className="p-8   w-[34.125rem] xs3:w-[30rem] xs4:w-[25rem]">
            <h4 className="text-2rem  text-white ">Place a Bid</h4>
            {/* <p className="text-lg  text-[#D0D0D2] mt-2">
                You are about to purchase a{" "}
                <span className="  mt-2"> #002 DeadFellaz</span> from Herri
                Susanto.
            </p> */}
            <p className="text-[#E7E7E9] mt-8">Place a bid</p>
            <div className="mt-2 relative mb-8">
                <Input
                    styles=""
                    className=" placeholder:!text-sm text-[#B0B0B0]"
                    placeholder="Enter Bid Amount "
                    value={values.price}
                    name="price"
                    onchange={handleChange}
                    type="number"
                />
                {/* <div className=" absolute top-6 right-3">
                    <svg
                        width="16"
                        height="21"
                        viewBox="0 0 16 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8 16C8.53043 16 9.03914 15.7893 9.41421 15.4142C9.78929 15.0391 10 14.5304 10 14C10 13.4696 9.78929 12.9609 9.41421 12.5858C9.03914 12.2107 8.53043 12 8 12C7.46957 12 6.96086 12.2107 6.58579 12.5858C6.21071 12.9609 6 13.4696 6 14C6 14.5304 6.21071 15.0391 6.58579 15.4142C6.96086 15.7893 7.46957 16 8 16ZM14 7C14.5304 7 15.0391 7.21071 15.4142 7.58579C15.7893 7.96086 16 8.46957 16 9V19C16 19.5304 15.7893 20.0391 15.4142 20.4142C15.0391 20.7893 14.5304 21 14 21H2C1.46957 21 0.960859 20.7893 0.585786 20.4142C0.210714 20.0391 0 19.5304 0 19V9C0 8.46957 0.210714 7.96086 0.585786 7.58579C0.960859 7.21071 1.46957 7 2 7H3V5C3 3.67392 3.52678 2.40215 4.46447 1.46447C5.40215 0.526784 6.67392 0 8 0C8.65661 0 9.30679 0.129329 9.91342 0.380602C10.52 0.631876 11.0712 1.00017 11.5355 1.46447C11.9998 1.92876 12.3681 2.47995 12.6194 3.08658C12.8707 3.69321 13 4.34339 13 5V7H14ZM8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5V7H11V5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2Z"
                            fill="#777E91"
                        />
                    </svg>
                </div> */}
            </div>
            {/* <div className="mt-10 flex justify-between">
                
            </div> */}
            {/* <div className="mt-3 flex justify-between">
             
            </div> */}

            {/* <div className="border-b border-[#43434C] mt-5  text-center"></div> */}

            <div className=" flex justify-between mt-2">
                <p className="text-white text-lg"> Highest Bid</p>
                <p className="text-[#D0D0D2] text-lg ">
                    {Number(getMaxBid()).toLocaleString()}{' '}
                    <i className="inline-block align-top ml-2 ">
                        {/* {blockchain && <Image src={blockchain.tokenPath} width={25} height={25} alt="logo" />} */}
                        {blockchain && blockchain.sellCurrency}
                    </i>
                </p>
            </div>
            <div className=" flex justify-between mt-2">
                <p className="text-white text-lg">Fees</p>
                <p className="text-[#D0D0D2] text-lg ">
                    {0}
                    {/* {Number((Number(values.price) * 1) / 100).toFixed(2)}{' '} */}
                    <i className="inline-block align-top ml-2 ">
                        {/* {/* {blockchain && <Image src={blockchain.tokenPath} width={25} height={25} alt="logo" />} */}
                        {blockchain && blockchain.sellCurrency}
                    </i>
                </p>
            </div>
            <div className=" flex justify-between mt-2 mb-5">
                <p className="text-white text-lg">You will pay</p>
                <p className="text-[#D0D0D2] text-lg ">
                    {Number(values.price).toLocaleString()}{' '}
                    {/* {Number(Number(values.price) + (Number(values.price) * 1) / 100).toFixed(2)}{' '} */}
                    <i className="inline-block align-top ml-2 ">
                        {/* {blockchain && <Image src={blockchain.tokenPath} width={25} height={25} alt="logo" />} */}
                        {blockchain && blockchain.sellCurrency}
                    </i>
                </p>
            </div>
            <Button
                className="   text-xl  rounded-[3.125rem] gold w-full  "
                onClick={(e: any) => {
                    //   setstate(17);
                    //   setPopup(true);
                    handleMakeOffer(e);
                }}>
                Place a bid
            </Button>
            {/* <Link legacyBehavior href="/nftdetail">
                <a>
                    <Button className=" bg-transparent border border-[#2B2B35]   text-xl  rounded-[3.125rem] text-white w-full mt-3 ">
                        Cancel
                    </Button>
                </a>
            </Link> */}
        </div>
    );
};

export default Placebid;
