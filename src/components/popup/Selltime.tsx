import React, { useEffect, useMemo } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { getRoyaltyInfo, listNftOnMarketePlace, setRoyalties } from '../../redux/nft/actions';
import useMetaMask from '../../hooks/useMetaMask';
import { NFT_TYPES } from '../../constants/enums';
import { isEmpty, validate } from 'validate.js';
import { auctionSchema } from '../../validations';
import { toast } from 'react-toastify';
import Select from '../../components/select/Select';
import { useWeb3React } from '@web3-react/core';
import { getAllMarketDetailsByChainId } from '../../utils/functions';

const Selltime = ({ setstate, state, data }: any) => {
    const { library, account }: any = useMetaMask();
    const { chainId } = useWeb3React();

    let [plan, setPlan] = useState('business');
    const [values, setValues] = useState<any>({
        price: '',
        royalties: '',
        fee: 0,
        hours: '',
        minutes: '',
        seconds: ''
    });
    const [checked, setChecked] = useState(false);
    const [applied, setApplied] = useState(false);
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [royalityError, setRoyalityError] = useState(false);

    const loading = useSelector((state: any) => state.nft.listNftLoading);
    const royalty = useSelector((state: any) => state.nft.royalty);
    const royaltyLoading = useSelector((state: any) => state.nft.royaltyLoading);
    const blockchain = useMemo(() => getAllMarketDetailsByChainId(chainId), [chainId]);

    const currencies = useMemo(
        () =>
            blockchain?.map((item) => ({
                name: item.sellCurrency,
                src: item.sellSymbol,
                marketAddresss: item.marketAddress
            })),
        [blockchain, chainId]
    );
    const [selected, setSelected] = useState(currencies && currencies[0]);

    const dispatch = useDispatch();

    useEffect(() => {
        currencies && setSelected(currencies[0]);
    }, [chainId]);

    useEffect(() => {
        const errors = validate(
            {
                price: values.price < 0.0001 ? '' : values.price,
                duration: calculateSeconds(values.hours, values.minutes, values.seconds)
            },
            auctionSchema
        );
        setErrors({ ...(errors || {}) });
    }, [values]);

    useEffect(() => {
        const signer = library?.getSigner();
        dispatch(getRoyaltyInfo(signer, data.tokenId, data?.contractAddress));
    }, []);

    useEffect(() => {
        if (royalty) {
            setValues({ ...values, royalties: Number(royalty[1] / 10 ** 18) });
            setApplied(royalty[0] !== '0x0000000000000000000000000000000000000000');
            if (royalty[0] !== '0x0000000000000000000000000000000000000000') {
                setChecked(true);
            }
        }
    }, [royalty]);

    useEffect(() => {
        royalityError && setRoyalityError(false);
    }, [values.royalties]);

    const calculateRoyalty = () => {
        return values.royalties ? Number(values.royalties) * 100 : 0;
    };

    const handleShowRoyalty = () => {
        if (royalty && data.creater === account) {
            return true;
        }
        return false;
    };

    const handleSetRoylties = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pattern = /^([1-9]|10)$/;

        if (!pattern.test(values.royalties)) {
            setRoyalityError(true);
            return;
        }

        const signer = library?.getSigner();

        dispatch(
            setRoyalties(signer, data.tokenId, data.creater, calculateRoyalty(), setApplied, data?.contractAddress)
        );
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'price') {
            const isNotValid = value.toString().includes('-');
            if (isNotValid) {
                toast.dismiss();
                toast.error("Price can't be set negative");
                return;
            }
        }

        if (['minutes', 'seconds'].includes(event.target.name)) {
            if (event.target.value.length > 2 || Number(event.target.value) > 59) {
                return;
            }
        }
        if (['hours'].includes(event.target.name)) {
            if (event.target.value.length > 3) {
                return;
            }
        }
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };

    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);

    const enabledTouchedValues = () => {
        const newState: any = {};
        Object.keys(errors).forEach((item) => {
            newState[item] = true;
        });
        setTouched(newState);
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        enabledTouchedValues();
        if (!isEmpty(errors)) {
            return;
        }

        const startTime = Math.floor(new Date().getTime() / 1000) + 60 * 2;
        const duration = calculateSeconds(values.hours, values.minutes, values.seconds);
        const signer = library?.getSigner();
        const type = NFT_TYPES.timedAuction;
        const data1 = {
            ...data,
            type,
            price: values.price,
            duration,
            startTime,
            address: account,
            chainId,
            marketAddress: selected?.marketAddresss
        };

        dispatch(listNftOnMarketePlace(signer, setstate, data1));
    };

    const calculateSeconds = (hours: string, minutes: string, seconds: string) => {
        const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
        return total;
    };

    return (
        <div className="lg:w-[540px] m-auto rounded-lg px-8 ">
            <div className=" py-6 text-center">
                <h2 className="xl:text-2rem text-white text-left">List Your NFT</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="py-6 ">
                    <RadioGroup value={plan} onChange={setPlan} className="grid sm:grid-cols-2 gap-x-4">
                        <RadioGroup.Option value="startup">
                            {({ checked }) => (
                                <div
                                    // onClick={togglebar}
                                    onClick={() => {
                                        setstate(24);
                                    }}
                                    className={`${
                                        checked ? ' border border-[#F1C94A]  ' : ' border   border-[#2B2B35;] '
                                    } flex flex-col items-center justify-center rounded-[18px] h-[132px] border cursor-pointer`}>
                                    <i
                                        className={`icon-eye-show text-4xl mb-[1.625rem] ${
                                            checked ? 'text-[#F1C94A]' : 'text-[#A1A1A5]'
                                        }`}></i>

                                    <p
                                        className={`block text-lg mb-1 ${
                                            checked ? 'text-[#F1C94A]' : 'text-[#A1A1A5]'
                                        }`}>
                                        Fixed Price
                                    </p>
                                </div>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option className="sm:mt-0 mt-6" value="business">
                            {({ checked }) => (
                                <div
                                    onClick={() => {
                                        setstate(27);
                                    }}
                                    className={`${
                                        checked ? 'border-themecolor border' : ' border !border-[#2B2B35;] '
                                    } flex flex-col items-center justify-center rounded-[18px] h-[132px] border cursor-pointer`}>
                                    {checked ? (
                                        <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M16.0006 0.639648C11.9269 0.639648 8.02002 2.25793 5.13946 5.13849C2.25891 8.01905 0.640625 11.9259 0.640625 15.9996C0.64073 18.0168 1.03813 20.0141 1.81014 21.8776C2.58215 23.7411 3.71365 25.4343 5.14003 26.8606C6.56641 28.2868 8.25975 29.4181 10.1233 30.1899C11.9869 30.9618 13.9843 31.359 16.0014 31.3588C18.0185 31.3587 20.0159 30.9613 21.8794 30.1893C23.7429 29.4173 25.4361 28.2858 26.8624 26.8594C28.2886 25.4331 29.4199 23.7397 30.1917 21.8761C30.9635 20.0125 31.3607 18.0152 31.3606 15.998C31.3606 7.51645 24.4822 0.639648 16.0006 0.639648ZM16.0006 28.158C14.4038 28.158 12.8225 27.8435 11.3472 27.2324C9.87187 26.6213 8.53137 25.7256 7.40221 24.5965C6.27305 23.4673 5.37735 22.1268 4.76625 20.6515C4.15515 19.1762 3.84062 17.5949 3.84062 15.998C3.84062 14.4012 4.15515 12.8199 4.76625 11.3446C5.37735 9.8693 6.27305 8.52879 7.40221 7.39963C8.53137 6.27047 9.87187 5.37477 11.3472 4.76367C12.8225 4.15258 14.4038 3.83805 16.0006 3.83805V15.9996L26.8678 10.566C27.7174 12.2513 28.1602 14.1123 28.1606 15.9996C28.1602 19.2244 26.8789 22.3169 24.5985 24.597C22.3181 26.8771 19.2254 28.158 16.0006 28.158Z"
                                                fill="#f1c94a"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="32"
                                            height="32"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M16.0006 0.639648C11.9269 0.639648 8.02002 2.25793 5.13946 5.13849C2.25891 8.01905 0.640625 11.9259 0.640625 15.9996C0.64073 18.0168 1.03813 20.0141 1.81014 21.8776C2.58215 23.7411 3.71365 25.4343 5.14003 26.8606C6.56641 28.2868 8.25975 29.4181 10.1233 30.1899C11.9869 30.9618 13.9843 31.359 16.0014 31.3588C18.0185 31.3587 20.0159 30.9613 21.8794 30.1893C23.7429 29.4173 25.4361 28.2858 26.8624 26.8594C28.2886 25.4331 29.4199 23.7397 30.1917 21.8761C30.9635 20.0125 31.3607 18.0152 31.3606 15.998C31.3606 7.51645 24.4822 0.639648 16.0006 0.639648ZM16.0006 28.158C14.4038 28.158 12.8225 27.8435 11.3472 27.2324C9.87187 26.6213 8.53137 25.7256 7.40221 24.5965C6.27305 23.4673 5.37735 22.1268 4.76625 20.6515C4.15515 19.1762 3.84062 17.5949 3.84062 15.998C3.84062 14.4012 4.15515 12.8199 4.76625 11.3446C5.37735 9.8693 6.27305 8.52879 7.40221 7.39963C8.53137 6.27047 9.87187 5.37477 11.3472 4.76367C12.8225 4.15258 14.4038 3.83805 16.0006 3.83805V15.9996L26.8678 10.566C27.7174 12.2513 28.1602 14.1123 28.1606 15.9996C28.1602 19.2244 26.8789 22.3169 24.5985 24.597C22.3181 26.8771 19.2254 28.158 16.0006 28.158Z"
                                                fill="#A1A1A5"
                                            />
                                        </svg>
                                    )}

                                    <p className={`block text-lg mt-6 ${checked ? ' text-white' : 'text-[#A1A1A5]'}`}>
                                        Timed Auction
                                    </p>
                                </div>
                            )}
                        </RadioGroup.Option>
                    </RadioGroup>

                    {handleShowRoyalty() && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className=" font-Circular-Medium text-lg text-white mt-6">Royalties (Optional)</p>
                                <div className="form-check form-switch Atroyalitycheck">
                                    <input
                                        type="checkbox"
                                        name="royality"
                                        id="Ataddroyality"
                                        onChange={() => setChecked(!checked)}
                                        checked={checked}
                                        disabled={applied}
                                    />
                                    <label htmlFor="Ataddroyality"></label>
                                </div>
                            </div>
                            <div className={`mt-2 relative ${(!checked || applied) && 'opacity-20'}`}>
                                <div className=" relative flex">
                                    <div className="relative w-full">
                                        <Input
                                            className="placeholder:!text-sm rounded-r-none"
                                            placeholder="0.00"
                                            value={values.royalties}
                                            name="royalties"
                                            type="number"
                                            onchange={handleChange}
                                            disabled={!checked || applied}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777e90] text-[18px]">
                                            %
                                        </span>
                                    </div>
                                    <Button
                                        className=" gold rounded-l-none "
                                        disabled={!checked || royaltyLoading || applied}
                                        onClick={handleSetRoylties}
                                        isLoading={royaltyLoading}>
                                        {applied ? 'Applied' : 'Apply'}
                                    </Button>
                                </div>
                                {royalityError && checked && (
                                    <p className="text-red-500 py-2">
                                        Royalties should be between 1% and 10% and not decimal.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                    <p className="  text-lg text-white mt-6">
                        Minimum Bid* <span className="text-secondary">(Bid below this amount won’t be allowed)</span>
                    </p>
                    <div className="mt-2 relative ">
                        <div className="relative z-[9]">
                            <input
                                className="placeholder:!text-sm input-text placeholder:[#B0B0B0] px-4 py-4 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Proxima-Regular w-full outline-none rounded-xl text-white leading-[0]"
                                placeholder="0.00 "
                                value={values.price}
                                name="price"
                                type="number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <div className=" absolute right-3 top-[50%] -translate-y-1/2">
                                <div className="flex items gap-2 ">
                                    {blockchain ? (
                                        <Select
                                            data={currencies}
                                            onSelect={setSelected}
                                            selected={selected}
                                            className="!border-none gap-2  "
                                            parentstyle="  !min-w-[140px] bg-black !right-1  "
                                        />
                                    ) : (
                                        <Image src="/assets/images/loobricon.svg" height={26} width={26} alt="" />
                                    )}
                                    {/* <p className=" font-Proxima-Regular">Loobr</p> */}
                                </div>
                            </div>
                        </div>
                        {hasError('price') && (
                            <p className="text-red-500 py-2">
                                {hasError('price')
                                    ? `Price should not be empty. (minimum should be 0.001 ${selected?.name})`
                                    : null}
                            </p>
                        )}
                    </div>
                    <p className=" font-Circular-Medium text-lg text-white mt-6">
                        Auction Deadline*{' '}
                        <span className="text-secondary">(Deadline should be between 24 to 168 hours)</span>
                    </p>

                    <div className={`mt-3 `}>
                        <div className="sm:flex justify-evenly gap-6">
                            <div>
                                <Input
                                    className=" text-center mt-2  !text-2rem h-full md:placeholder:!text-2rem "
                                    styles="sm:w-[148px] h-[100px]"
                                    placeholder="00"
                                    name="hours"
                                    value={values.hours}
                                    type="number"
                                    onchange={handleChange}
                                />
                                <p className=" text-[#777E90] mt-3  text-base  md:w-[148px] text-center font-Circular-Medium">
                                    Hours
                                </p>
                            </div>
                            <div>
                                <Input
                                    className=" text-center mt-2 !text-2rem h-full md:placeholder:!text-2rem  "
                                    styles="sm:w-[148px] h-[100px]"
                                    placeholder="00"
                                    name="minutes"
                                    value={values.minutes}
                                    type="number"
                                    onchange={handleChange}
                                />
                                <p className=" text-[#777E90] mt-3 text-base md:w-[148px] text-center font-Circular-Medium">
                                    Minutes
                                </p>
                            </div>
                            <div>
                                <Input
                                    className=" text-center mt-2 !text-2rem h-full md:placeholder:!text-2rem  "
                                    styles="sm:w-[148px] h-[100px] "
                                    placeholder="00"
                                    name="seconds"
                                    value={values.seconds}
                                    type="number"
                                    onchange={handleChange}
                                />
                                <p className="text-[#777E90] mt-3 text-base md:w-[148px] text-center font-Circular-Medium">
                                    Seconds
                                </p>
                            </div>
                        </div>
                        <span className="text-red-500 py-2">{hasError('duration') ? errors.duration[0] : null}</span>
                        {!handleShowRoyalty() && royalty && (
                            <p className="mt-2">
                                Royalty <span className="text-white mt-3">{Number(royalty[1]) / 10 ** 18} %</span>
                            </p>
                        )}
                    </div>

                    <Link legacyBehavior href="">
                        <a>
                            <Button
                                className={`w-full mt-[2.75rem] rounded-[3.125rem]  `}
                                onClick={handleSubmit}
                                isLoading={loading}
                                disabled={loading || (handleShowRoyalty() && checked && !applied)}
                                type="submit">
                                List on Marketplace
                            </Button>
                        </a>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Selltime;
