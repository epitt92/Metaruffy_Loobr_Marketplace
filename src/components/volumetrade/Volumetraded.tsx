import React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Avalanche from '../icons/AvalancheIcon';
import BscIcon from '../icons/BscIcon';
import CardanoIcon from '../icons/CardanoIcon';
import EthIcon from '../icons/EthIcon';
import SolanaIcon from '../icons/SolanaIcon';
import PolygonIcon from '../icons/PolygonIcon';

const Volumetraded = () => {
    const stats = useSelector((state: any) => state.user.stats);
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);
    const usdtPrice = useSelector((state: any) => state.nft.usdtPrice);
    const bnbPrice = useSelector((state: any) => state.nft.bnbPrice);
    const ethPrice = useSelector((state: any) => state.nft.ethPrice);
    const maticPrice = useSelector((state: any) => state.nft.maticPrice);
    const avaxPrice = useSelector((state: any) => state.nft.avaxPrice);

    const getVolume = (chain: string, currency?: string) => {
        if (!stats?.totalVolume?.length) {
            return 0;
        }
        if (!currency) {
            currency = chain;
        }
        const value = stats.totalVolume.find(
            (item: any) => item?._id?.chain == chain && item?._id?.currency == currency
        );
        if (value) {
            return Number(value?.sum).toFixed(3);
        } else {
            return 0;
        }
    };

    const calculateVolume = () => {
        let volume = 0;
        if (!stats?.totalVolume?.length) {
            return volume;
        }

        stats?.totalVolume?.forEach((element: any) => {
            switch (element?._id?.currency) {
                case 'BNB':
                    volume = volume + element?.sum * bnbPrice;
                    break;
                case 'USDT':
                    volume = volume + element?.sum * usdtPrice;
                    break;
                case 'ETH':
                    volume = volume + element?.sum * ethPrice;
                    break;
                case 'AVAX':
                    volume = volume + element?.sum * avaxPrice;
                    break;
                case 'AVAX':
                    volume = volume + element?.sum * maticPrice;
                    break;

                default:
                    break;
            }
        });

        return volume ? Number(volume).toFixed(3) : volume;
    };

    const VolumeTraded = [
        {
            name: 'BSC',
            tagname: <BscIcon />,
            value: getVolume('BSC', 'BNB'),
            tokenValue: getVolume('BSC', 'USDT'),
            tokenSymbol: '/assets/images/logos/usdt.png'
        },
        {
            name: 'Ethereum',
            tagname: <EthIcon />,
            value: getVolume('ETH'),
            tokenValue: getVolume('ETH', 'USDT'),
            tokenSymbol: '/assets/images/logos/usdt.png'
        },
        {
            name: 'Polygon',
            tagname: <PolygonIcon />,
            value: getVolume('MATIC'),
            tokenValue: getVolume('MATIC', 'USDT'),
            tokenSymbol: '/assets/images/logos/usdt.png'
        },

        {
            name: 'Avalanche',
            tagname: <Avalanche />,
            value: getVolume('AVAX'),
            tokenValue: getVolume('AVAX', 'USDT'),
            tokenSymbol: '/assets/images/logos/usdt.png'
        },

        {
            name: 'Solana',
            tagname: <SolanaIcon />,
            value: getVolume('Solana'),
            tokenValue: getVolume('USDT'),
            tokenSymbol: '/assets/images/logos/usdt.png'
        },
        {
            name: 'Cardano',
            tagname: <CardanoIcon />,
            value: getVolume('Cardano'),
            tokenValue: getVolume('USDT'),
            tokenSymbol: '/assets/images/logos/usdt.png'
        }
    ];

    return (
        <div className="lg:w-[23.75rem]   mt-5 z-10  border border-[#2B2B35] bg-[#14141F] rounded-[12px] ">
            <div className=" w-full">
                <h6 className="text-[#14141F] py-1 bg-themecolor text-center rounded-t-[12px]">
                    Total Volume Traded: ${calculateVolume()}
                </h6>
            </div>
            <div className="flex   flex-wrap mt-3  ">
                {VolumeTraded?.map((item: any, i) => (
                    <div className="px-3  w-[33.33%]  my-3  volumetrad" key={i}>
                        <span className="text-sm  text-white font-Proxima-Regular   ml-4">{item.name}</span>
                        <div className="  mt-1.5  ">
                            <div className="flex justify-between items-center gap-4 ">
                                <p className="text-sm text-white  ">{item.tagname}</p>

                                <p className="text-[#FFFFFF]  mt-1 text-center text-lg w-4/5 truncate" title={`${item.value}`}>{item.value}</p>
                            </div>
                            <div className="mt-2 flex justify-between items-center gap-4  ">
                                <figure className="flex-shrink-0">
                                    <Image
                                        className="flex-shrink-0"
                                        src={item.tokenSymbol}
                                        width={24}
                                        height={24}
                                        alt="logo"
                                    />
                                </figure>
                                <p className="text-[#FFFFFF]  mt-1 text-center  w-4/5  text-lg  truncate " title={`${item.tokenValue}`} >{item.tokenValue}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Volumetraded;
