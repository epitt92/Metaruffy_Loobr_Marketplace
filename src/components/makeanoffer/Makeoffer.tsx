import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import blockchains from '../../contractsData/blockchains';
import contracts from '../../contractsData/contracts-details';
import useMetaMask from '../../hooks/useMetaMask';
import { contractsService } from '../../services/contracts.service';
import { offerService } from '../../services/offers.service';
import Button from '../Button/Button';
import EthIcon from '../icons/EthIcon';
import ImageComponent from '../Image/ImageComponent';
import Input from '../input/Input';
import Popups from '../popup/poups';

const MakeOffer = ({ setstate, data }: any) => {
    const { account, library }: any = useMetaMask();

    const [values, setValues] = useState({
        amount: ''
    });
    const [priceError, setPriceError] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        priceError && setPriceError(false);
    }, [priceError, values.amount]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (!user) {
                toast.error('Please login to your account.');
                return;
            }

            if (!values.amount || Number(values.amount) < 0.0001) {
                setPriceError(true);
                return;
            }

            setLoading(true);

            const signer = library?.getSigner();
            const contract = contracts.find((item) => item?.chain == data?.chain && item.sellCurrency == 'USDT');

            if (!contract) {
                return;
            }
            const duration = 24 * 60 * 60;
            const res = await contractsService.makeAnOffer(
                contract?.offerAddress,
                data?.contractAddress,
                contract?.wethAddress,
                data?.tokenId,
                values.amount,
                duration,
                account,
                signer
            );

            // const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/token`, data);
            // const res = await offerService.makeOffer(data1);
            setstate(89);
            data?.setOffer(values.amount);
            if (data?.offers?.offers) {
                data?.setOffers({
                    ...data?.offers,
                    offers: [
                        {
                            amount: values.amount,
                            sender: {
                                firstName: user?.firstName,
                                userName: user?.userName,
                                isVerfied: user?.isVerfied,
                                avatar: user?.avatar
                            }
                        },
                        ...data?.offers?.offers
                    ]
                });
            }

            setLoading(false);
        } catch (error: any) {
            console.log(error);
            toast.error(error?.message);
            setLoading(false);
            // toast.error(error?.response?.data?.message);
        }
    };

    const chain = blockchains.find((item) => item?.symbol == data?.chain);
    return (
        <div className="w-[33.75rem] xs3:w-full   rounded-![16px]  bg-![#14141F]">
            <form onSubmit={handleSubmit}>
                <div className="pt-6 px-6 pb-[22px] ">
                    <h2 className="text-2xl xl:text[32px] text-white  font-Proxima-Bold">Make an offer</h2>
                    <div className="flex justify-center flex-col  mt-4">
                        <p className="text-white ">Price</p>

                        <div className="!relative py-4    mt-2">
                            <Input
                                className="pr-16"
                                type="number"
                                placeholder="0.00"
                                name="amount"
                                onchange={handleChange}
                                helperText={'Incorrect amount.'}
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer items-center justify-center  flex   gap-2">
                                <ImageComponent src="/assets/images/weth.png" width={20} height={20} />{' '}
                                <span className="text-[#A1A1A5] mt-1"> WETH</span>
                            </div>
                        </div>
                        <div className=" mt-10  mb-2">
                            <Button
                                className="w-full  rounded-[3.125rem] !px-14 !py-3 text-black "
                                isLoading={loading}
                                disabled={loading}
                                onClick={handleSubmit}
                                type="submit">
                                Make Offer
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MakeOffer;
