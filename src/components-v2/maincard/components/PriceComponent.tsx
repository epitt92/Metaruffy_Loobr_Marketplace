import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getMarketDetailsByAddress } from '../../../utils/functions';

type Props = {
    amount: number;
    chain: string;
    marketAddress: string | undefined;
    fee: boolean;
    currency: string;
    className: string;
    className1: string;
    className2: string;
    size:any
};

const PriceComponent = ({ amount, chain, fee, currency, className, className1, className2,size }: Props) => {
    const router = useRouter();
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);
    const ethPrice = useSelector((state: any) => state.nft.ethPrice);
    const bnbPrice = useSelector((state: any) => state.nft.bnbPrice);
    const usdtPrice = useSelector((state: any) => state.nft.usdtPrice);
    const maticPrice = useSelector((state: any) => state.nft.maticPrice);
    // const blockchain = useMemo(() => getMarketDetailsByAddress(marketAddress), [marketAddress]);

    const convertTotalAmount = (amount: any) => {
        amount = Number(amount);
        let k = 1000;
        let m = k * 1000;
        let b = m * 1000;
        if (amount >= b) {
            return `${(Number(amount) / b).toFixed(2)}B`;
        }
        if (amount >= m) {
            return `${(Number(amount) / m).toFixed(2)}M`;
        }
        if (amount >= k) {
            return `${(Number(amount) / k).toFixed(2)}K`;
        }
        return `${Number(amount).toFixed(2)}`;
    };

    const getPrice = (price: number) => {
        if (!price) {
            return '0.00';
        }
        // const currency = blockchain?.native ? blockchain.nativeCurrency : blockchain?.tokenSymbol;
        const rate =
            currency === 'ETH'
                ? ethPrice
                : currency === 'BNB'
                    ? bnbPrice
                    : currency === 'USDT'
                        ? usdtPrice
                        : currency == 'LOOBR'
                            ? loobrPrice
                            : currency == 'MATIC'
                                ? maticPrice
                                : 0;

        return Number(Number(Number(rate) * Number(price)).toFixed(2)).toLocaleString();
    };

    const calculateAmount = (amount: number) => {
        if (!fee) {
            return amount;
        }
        const fees = currency == 'LOOBR' ? 0 : 2;
        return Number(Number(amount + (fees / 100) * amount).toFixed(4));
    };

    return (
        <div className={`${className} flex text-right justify-end `}>
            <div className="truncate">
                <h3 className={`text-[#F1C94A]   ${size ? "text-[12px]":"text-[1.25rem] py-2 leading-[1.15rem]"}   flex items-center `}>
                    <i className={` ${className1} inline-block not-italic`}>
                        {Number(calculateAmount(amount)).toLocaleString()}
                    </i>
                    <i className="inline-block align-top ml-2 not-italic flex-shrink-0">
                        {currency == 'LOOBR' ? (
                            <Image src={'/assets/images/loobricon.svg'} width="17" height="17" />
                        ) : (
                            currency
                        )}
                        {/* {blockchain?.native ? blockchain.nativeCurrency : blockchain?.tokenSymbol} */}
                    </i>
                </h3>
                <i
                    className={` ${className2}text-[#a1a1a5] font-Proxima-Regular     w-full text-sm block not-italic  mt-1`}>
                    ${getPrice(calculateAmount(amount))}
                </i>
            </div>
        </div>
    );
};

export default PriceComponent;
