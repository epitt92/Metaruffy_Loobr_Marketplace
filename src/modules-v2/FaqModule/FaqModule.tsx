import React, { useState } from 'react';
import Questions from './Questions';

const FaqModule = () => {
    const tabs = [
        { name: 'General', current: false },
        { name: 'Payments', current: true },
        { name: 'Services', current: false },
        { name: 'Refund', current: false },
        { name: 'Contact', current: false }
    ];
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    return (
        <div>
            <div className="mx-auto max-w-[102.5rem]  pt-12 sm:pt-[7.5rem] pb-[15.875rem] min-h-[1000px] sm:flex px-8 lg:px-0">
                <div
                    className="flex flex-col flex-wrap gap-2 w-full  sm:w-[24.813rem] sm:mt-[9.15rem] "
                    aria-label="Tabs">
                    {tabs.map((tab, i) => (
                        <a
                            key={i}
                            className={`
                             ${i === selectedTabIdx ? 'border-l-[4px] border-[#EFC74D] text-#EFC74D' : '  !text-white'}
                             px-3 py-2 cursor-pointer text-[16px]`}
                            onClick={() => {
                                setSelectedTabIdx(i);
                            }}>
                            <div className="">{tab.name}</div>
                        </a>
                    ))}
                </div>
                <div className="w-full sm:w-[75.938rem] ">
                    <h1 className=" font-bold text-[2.5rem] my-12 sm:my-0 sm:mb-[4.9375rem]">
                        Frequently Asked Questions
                    </h1>
                    {selectedTabIdx === 0 && <Questions />}
                    {selectedTabIdx === 1 && <h2 className="text-white">Comming Soon....</h2>}
                    {selectedTabIdx === 2 && <h2 className="text-white">Comming Soon....</h2>}
                    {selectedTabIdx === 3 && <h2 className="text-white">Comming Soon....</h2>}
                    {selectedTabIdx === 4 && <h2 className="text-white">Comming Soon....</h2>}
                    {selectedTabIdx === 5 && <h2 className="text-white">Comming Soon....</h2>}
                    {selectedTabIdx === 6 && <h2 className="text-white">Comming Soon....</h2>}
                </div>
            </div>
        </div>
    );
};

export default FaqModule;
