import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Image from 'next/image';

const Tabnft = () => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);

    const nft = useSelector((state: any) => state.nft.nft);
    const bids = useSelector((state: any) => state.nft.bids);
    const bidsLoading = useSelector((state: any) => state.nft.bidsLoading);
    const history = useSelector((state: any) => state.nft.history);
    const historyLoading = useSelector((state: any) => state.nft.bidsLoading);

    const tabs = [
        { name: 'Bids', current: false },
        { name: 'History', current: true }
    ];
    useEffect(() => {
        if (nft.sellMode == '0') {
            setSelectedTabIdx(1);
        }
    }, [nft]);
    return (
        <>
            <div
                className=" lg:flex flex-wrap items-center gap-3 border-t-[1px] border-[#2B2B35]      md:justify-between ]"
                aria-label="Tabs">
                <div className="     inline-flex     flex-wrap items-center gap-6 ">
                    {tabs.map((tab, i) => (
                        <a
                            key={i}
                            className={`cursor-pointer  pt-4 mb-6 !text-sm whitespace-nowrap font-Circular-Book text-[#727279]  
                ${i === selectedTabIdx && '     !pointer-events-auto !text-white border-t-2 border-themecolor '}
                                ${i === 0 && nft.sellMode == '0' && 'hidden'}
                `}
                            onClick={() => setSelectedTabIdx(i)}>
                            {tab.name}
                        </a>
                    ))}
                </div>
            </div>
            {selectedTabIdx === 0 && (
                <div className="overflow-hidden ">
                    {bids &&
                        bids.map((item: any, i: number) => (
                            <>
                                <div className=" flex items-center mb-3">
                                    <figure>
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 56 56"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="28" cy="28" r="28" fill="url(#paint0_linear_1892_4419)" />
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_1892_4419"
                                                    x1="0"
                                                    y1="0"
                                                    x2="56"
                                                    y2="56"
                                                    gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#4400FF" />
                                                    <stop offset="1" stopColor="#FF4400" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </figure>
                                    <div className="flex flex-col pl-4 pt-2 w-full">
                                        <h3 className="text-[#FFFFFF] text-base ">
                                            {Number(item.price ).toFixed(2)}{' '}
                                            <i className="inline-block align-top ml-2 ">
                                                <Image
                                                    src={'/assets/images/loobricon.svg'}
                                                    width={25}
                                                    height={25}
                                                    alt="logo"
                                                />
                                            </i>
                                            <span className="text-[#A1A1A5]"> By </span> {item.bidder}
                                        </h3>
                                        <span className="block text-sm text-[#A1A1A5] ">
                                            {moment(item.createdAt).fromNow()}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ))}
                </div>
            )}
            {selectedTabIdx === 1 && (
                <div className="overflow-hidden ">
                    {history &&
                        history.map((item: any, i: number) => (
                            <>
                                <div className=" flex items-center mb-3">
                                    <figure>
                                        <svg
                                            width="48"
                                            height="48"
                                            viewBox="0 0 56 56"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="28" cy="28" r="28" fill="url(#paint0_linear_1892_4419)" />
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_1892_4419"
                                                    x1="0"
                                                    y1="0"
                                                    x2="56"
                                                    y2="56"
                                                    gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#4400FF" />
                                                    <stop offset="1" stopColor="#FF4400" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </figure>
                                    <div className="flex flex-col pl-4 pt-2 w-full">
                                        <h3 className="text-[#FFFFFF] text-base ">
                                            {Number(item.price ).toFixed(2)}{' '}
                                            <i className="inline-block align-top ml-2 ">
                                                <Image
                                                    src={'/assets/images/loobricon.svg'}
                                                    width={25}
                                                    height={25}
                                                    alt="logo"
                                                />
                                            </i>
                                            <span className="text-[#A1A1A5]"> By </span> {item.sender}
                                        </h3>
                                        <span className="block text-sm text-[#A1A1A5] ">
                                            {moment(item.createdAt).fromNow()}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ))}
                </div>
            )}
        </>
    );
};
export default Tabnft;
