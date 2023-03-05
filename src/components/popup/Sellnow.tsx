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
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import Select from '../../components/select/Select';
import {
    getAllMarketDetailsByChainId,
    getMarketDetailsByAddress,
    getMarketDetailsByNFTAddress
} from '../../utils/functions';
import contracts from '../../contractsData/contracts-details';

const Sellnow = ({ setstate, state, data }: any) => {
    const { library, account, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();

    let [plan, setPlan] = useState('startup');
    const [checked, setChecked] = useState(false);
    const [applied, setApplied] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [royalityError, setRoyalityError] = useState(false);

    const [values, setValues] = useState<any>({
        price: '',
        royalties: '',
        fee: 2,
        txFee: 1
    });

    const loading = useSelector((state: any) => state.nft.listNftLoading);
    const royalty = useSelector((state: any) => state.nft.royalty);
    const royaltyLoading = useSelector((state: any) => state.nft.royaltyLoading);
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);
    const usdtPrice = useSelector((state: any) => state.nft.usdtPrice);
    const bnbPrice = useSelector((state: any) => state.nft.bnbPrice);
    const ethPrice = useSelector((state: any) => state.nft.ethPrice);
    const maticPrice = useSelector((state: any) => state.nft.maticPrice);
    const avaxPrice = useSelector((state: any) => state.nft.avaxPrice);
    const blockchain = useMemo(() => getAllMarketDetailsByChainId(chainId), [chainId]);

    const currencies = useMemo(
        () =>
            blockchain?.map((item: any) => ({
                name: item.sellCurrency,
                src: item.sellSymbol,
                marketAddress: item.marketAddress
            })),
        [blockchain, chainId]
    );
    console.log(currencies, 'currencies');

    const [selected, setSelected] = useState(currencies && currencies[0]);

    const dispatch = useDispatch();

    useEffect(() => {
        currencies && setSelected(currencies[0]);
    }, [chainId]);

    useEffect(() => {
        const signer = library?.getSigner();
        dispatch(getRoyaltyInfo(signer, data?.tokenId, data?.contractAddress));
    }, []);

    useEffect(() => {
        priceError && setPriceError(false);
    }, [values.price]);

    useEffect(() => {
        royalityError && setRoyalityError(false);
    }, [values.royalties]);

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
        setValues({ ...values, fee: selected?.name == 'LOOBR' ? 0 : 2 });
    }, [selected]);

    const getPrice = (price: number) => {
        if (!price) {
            return 0;
        }
        const chain = contracts.find(
            (item) => item.sellCurrency == selected?.name && item.marketAddress == selected?.marketAddress
        );

        const currency = chain?.native ? chain.nativeCurrency : chain?.tokenSymbol;
        const rate =
            currency === 'ETH'
                ? ethPrice
                : currency === 'BNB'
                ? bnbPrice
                : currency === 'USDT'
                ? usdtPrice
                : currency == 'LOOBR'
                ? loobrPrice
                : currency == 'AVAX'
                ? avaxPrice
                : currency == 'MATIC'
                ? maticPrice
                : 0;

        return Number(Number(Number(rate) * Number(price)).toFixed(2)).toLocaleString();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const calculateRoyalty = () => {
        return values.royalties ? Number(values.royalties) * 100 : 0;
    };

    const calculatePrice = () => {
        return Number(Number(Number(values.price) + (values.fee / 100) * values.price).toFixed(4));
    };

    const calculateFee = () => {
        const total = values.fee + values.txFee;
        return values.price ? Number((total / 100) * Number(values.price)).toFixed(2) : 0;
    };

    const handleShowRoyalty = () => {
        if (royalty && data.creater === account) {
            return true;
        }
        return false;
    };

    const handleSwitchNetwork = async (contractAddress: string) => {
        const contracts = getMarketDetailsByNFTAddress(contractAddress);
        const chain = contracts ? contracts.chainId : undefined;
        if (!contracts) {
            // toast.error('This chain does not supported.');
            return true;
        } else if (chain == chainId) {
            return true;
        } else {
            await switchNetwork(contracts.chainId);
            return true;
        }
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!values.price || Number(values.price) < 0.0001) {
            setPriceError(true);
            return;
        }

        // await handleSwitchNetwork(data?.contractAddress);

        const signer = library?.getSigner();

        const type = NFT_TYPES.fixedPrice;
        const data1 = {
            ...data,
            type,
            price: values.price,
            startTime: 0,
            duration: 0,
            royalty: calculateRoyalty(),
            chainId,
            marketAddress: selected?.marketAddress,
            currency: selected?.name
        };

        dispatch(listNftOnMarketePlace(signer, setstate, data1));
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

    return (
        <div className="w-full md:w-[540px] sm:w-[440px]  m-auto  rounded-lg px-8 ">
            <div className=" py-6 text-center">
                <h2 className=" xl:text-2rem text-white text-left">List Your NFT</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="py-6  ">
                    <RadioGroup
                        value={plan}
                        onChange={(e) => {
                            // console.log(e);
                        }}
                        className="grid sm:grid-cols-2 gap-x-4">
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
                                        checked ? 'border-themecolor border' : ' border border-[#2B2B35;] '
                                    } flex flex-col items-center justify-center rounded-[18px] h-[132px] border cursor-pointer`}>
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
                                    <p
                                        className={`block text-lg mt-6 ${
                                            checked ? ' text-{themecolor}' : 'text-[#A1A1A5]'
                                        }`}>
                                        Timed Auction
                                    </p>
                                </div>
                            )}
                        </RadioGroup.Option>
                    </RadioGroup>

                    {handleShowRoyalty() && (
                        <>
                            <div className="flex items-center justify-between">
                                <p className=" font-Circular-Medium text-lg  text-white mt-6 flex items-center">
                                    Royalties (Optional)
                                    <svg
                                        className="ml-2 cursor-pointer tool"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 734 734"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M367 688.125C281.832 688.125 200.153 654.292 139.93 594.07C79.7077 533.847 45.875 452.168 45.875 367C45.875 281.832 79.7077 200.153 139.93 139.93C200.153 79.7077 281.832 45.875 367 45.875C452.168 45.875 533.847 79.7077 594.07 139.93C654.292 200.153 688.125 281.832 688.125 367C688.125 452.168 654.292 533.847 594.07 594.07C533.847 654.292 452.168 688.125 367 688.125ZM367 734C464.334 734 557.682 695.334 626.508 626.508C695.334 557.682 734 464.334 734 367C734 269.666 695.334 176.318 626.508 107.492C557.682 38.666 464.334 0 367 0C269.666 0 176.318 38.666 107.492 107.492C38.666 176.318 0 269.666 0 367C0 464.334 38.666 557.682 107.492 626.508C176.318 695.334 269.666 734 367 734V734Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M409.664 302.224L304.61 315.391L300.848 332.823L321.492 336.631C334.979 339.842 337.64 344.705 334.704 358.146L300.848 517.241C291.948 558.39 305.665 577.75 337.915 577.75C362.917 577.75 391.956 566.189 405.122 550.316L409.159 531.232C399.984 539.306 386.588 542.518 377.689 542.518C365.073 542.518 360.486 533.664 363.743 518.066L409.664 302.224ZM412.875 206.437C412.875 218.604 408.042 230.273 399.438 238.876C390.835 247.479 379.167 252.312 367 252.312C354.833 252.312 343.164 247.479 334.561 238.876C325.958 230.273 321.125 218.604 321.125 206.437C321.125 194.271 325.958 182.602 334.561 173.999C343.164 165.396 354.833 160.563 367 160.562C379.167 160.563 390.835 165.396 399.438 173.999C408.042 182.602 412.875 194.271 412.875 206.437Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <span className="bg-black w-[60%]  xs:w-full p-3  text-base  tip  rounded-md">
                                        Royalty % is paid out to the NFT creator on each sale of this NFT. Note: The
                                        Royalty cannot be changed once applied.
                                    </span>
                                </p>

                                <div className="form-check form-switch  Atroyalitycheck">
                                    <input
                                        type="checkbox"
                                        name="royality"
                                        id="Ataddroyality"
                                        onChange={() => setChecked(!checked)}
                                        checked={checked}
                                        disabled={/* hasRoyltiesApplied() || */ applied}
                                    />
                                    <label htmlFor="Ataddroyality"></label>
                                </div>
                            </div>
                            <div
                                className={`mt-2 relative ${
                                    (!checked ||
                                        /*  hasRoyltiesApplied() || */
                                        applied) &&
                                    'opacity-20'
                                }`}>
                                <div className="relative  flex ">
                                    <div className="relative w-full">
                                        <Input
                                            className="placeholder:!text-sm  rounded-r-none"
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
                                        className={` gold rounded-l-none  `}
                                        disabled={!checked || royaltyLoading || applied}
                                        onClick={handleSetRoylties}
                                        isLoading={royaltyLoading}>
                                        {/* hasRoyltiesApplied() ||  */ applied ? 'Applied' : 'Apply'}
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

                    <p className=" font-Circular-Medium text-lg text-white mt-6">
                        How much do you want to get for your NFT? <span className="text-gray-400">(Required)</span>
                    </p>
                    <div className="mt-2 relative  ">
                        <div className="relative">
                            <input
                                className="placeholder:!text-sm  input-text placeholder:[#B0B0B0] px-4 py-4 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Proxima-Regular w-full outline-none rounded-xl text-white leading-[0]"
                                placeholder="0.00 "
                                value={values.price}
                                name="price"
                                type="number"
                                onChange={handleChange}
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
                                            placeholder={''}
                                        />
                                    ) : (
                                        <Image src="/assets/images/loobricon.svg" height={26} width={26} alt="" />
                                    )}
                                </div>
                            </div>
                        </div>
                        {priceError && (
                            <p className="text-red-500 py-2">
                                Price should not be empty. (minimum should be 0.0001 {selected?.name})
                            </p>
                        )}
                        {/* <Input
                            className=" placeholder:!text-sm"
                            placeholder="0.00 "
                            value={values.price}
                            name="price"
                            type="number"
                            onchange={handleChange}
                            error={priceError}
                            helperText="Price should not be empty. (minimum should be 1 Loobr)"
                        /> */}
                    </div>

                    <div className={`mt-2`}>
                        <p className="">
                            Marketplace fee <span className="text-white">{values.fee}%</span>
                        </p>
                        {/* <p className="">
              Token Transaction fee{" "}
              <span className="text-white">{values.txFee}%</span>
            </p> */}
                        {/* <p className="">
              Total fees <span className="text-white">{calculateFee()}</span>
            </p> */}
                        <p>
                            You will recieve{' '}
                            <span className="text-white mt-3 braek">
                                {Number(Number(values.price).toFixed(4)).toLocaleString()}
                                <i className="inline-block align-top ml-2 ">
                                    {selected ? (
                                        selected?.name
                                    ) : (
                                        <Image src="/assets/images/loobricon.svg" height={20} width={20} alt="logo" />
                                    )}
                                </i>{' '}
                                ${getPrice(values.price)}
                            </span>
                        </p>
                        {!handleShowRoyalty() && royalty && (
                            <p>
                                Royalty <span className="text-white mt-3">{Number(royalty[1]) / 10 ** 18} %</span>
                            </p>
                        )}
                    </div>
                    <div className="flex  gap-2 mt-6">
                        <svg width="24" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM8.93 6.588L7.93 11.293C7.86 11.633 7.959 11.826 8.234 11.826C8.428 11.826 8.721 11.756 8.92 11.58L8.832 11.996C8.545 12.342 7.912 12.594 7.367 12.594C6.664 12.594 6.365 12.172 6.559 11.275L7.297 7.807C7.361 7.514 7.303 7.408 7.01 7.337L6.559 7.256L6.641 6.875L8.931 6.588H8.93ZM8 5.5C7.73478 5.5 7.48043 5.39464 7.29289 5.20711C7.10536 5.01957 7 4.76522 7 4.5C7 4.23478 7.10536 3.98043 7.29289 3.79289C7.48043 3.60536 7.73478 3.5 8 3.5C8.26522 3.5 8.51957 3.60536 8.70711 3.79289C8.89464 3.98043 9 4.23478 9 4.5C9 4.76522 8.89464 5.01957 8.70711 5.20711C8.51957 5.39464 8.26522 5.5 8 5.5Z"
                                fill="#B8B8BC"
                            />
                        </svg>
                        <p className="text-sm text-white font-Proxima-Regular braek ">
                            We’ll list this NFT on marketplace for {Number(calculatePrice()).toLocaleString()}{' '}
                            {selected?.name} which includes {values.fee}% marketplace fee.{' '}
                        </p>
                    </div>

                    <Link legacyBehavior href="#">
                        <a>
                            <Button
                                onClick={handleSubmit}
                                className={`w-full rounded-[3.125rem] mt-[2.75rem] gold`}
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

export default Sellnow;
