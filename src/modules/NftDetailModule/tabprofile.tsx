import React, { useState } from 'react';
import Image from 'next/image';
import { fetchImage } from '../../utils/functions';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';

const tabs = [
    { name: 'Bids', current: false },
    { name: 'History', current: true }
];
const Tabnft = () => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const people = [
        {
            image: '/assets/images/nftdetail/01.png',
            mr: '0.012 MR',
            by: 'by',
            name: 'Jimmy Hardy',
            hours: '16 hours ago'
        },
        {
            image: '/assets/images/nftdetail/02.png',
            mr: '0.003 MR',
            by: 'by',
            name: ' Kim Bowen',
            hours: '3 hours ago'
        }

        // More people...
    ];
    const History = [
        {
            image: '/assets/images/nftdetail/02.png',
            mr: '0.003 MR',
            by: 'by',
            name: ' Kim Bowen',
            hours: '3 hours ago'
        },
        {
            image: '/assets/images/nftdetail/01.png',
            mr: '0.012 MR',
            by: 'by',
            name: 'Jimmy Hardy',
            hours: '16 hours ago'
        }

        // More people...
    ];

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
                `}
                            onClick={() => setSelectedTabIdx(i)}>
                            {tab.name}
                        </a>
                    ))}
                </div>
            </div>
            {selectedTabIdx === 0 && (
                <div className="overflow-hidden ">
                    {people.map((item) => (
                        <>
                            <div className=" flex items-center mb-3">
                                <figure>
                                    <ImageComponent
                                        className="rounded-full"
                                        src={item.image}
                                        alt=""
                                        height={56}
                                        width={56}
                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                    />
                                </figure>
                                <div className="flex flex-col pl-4 pt-2 w-full">
                                    <h3 className="text-[#FFFFFF] text-base ">
                                        {item.mr} <span className="text-[#A1A1A5]"> {item.by} </span> {item.name}
                                    </h3>
                                    <span className="block text-sm text-[#A1A1A5] ">{item.hours}</span>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            )}
            {selectedTabIdx === 1 && (
                <div className="overflow-hidden ">
                    {History.map((item) => (
                        <>
                            <div className=" flex items-center mb-3">
                                <figure>
                                    <ImageComponent
                                        className=" rounded-full"
                                        src={item.image}
                                        alt=""
                                        height={56}
                                        width={56}
                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                    />
                                </figure>
                                <div className="flex flex-col pl-4 pt-2 w-full">
                                    <h3 className="text-[#FFFFFF] text-base ">
                                        {item.mr} <span className="text-[#A1A1A5]"> {item.by} </span> {item.name}
                                    </h3>
                                    <span className="block text-sm text-[#A1A1A5] ">{item.hours}</span>
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
