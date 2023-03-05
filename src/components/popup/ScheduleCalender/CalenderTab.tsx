import React, { useState } from 'react';
import Calender from './CalenderComponents';
import { AiFillCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import Button from '../../Button/Button';
import AnalogClock from 'analog-clock-react';

const tabs = [
    { name: '', current: true },
    { name: '', current: false }
];

const CalenderTab = () => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    let options = {
        width: '300px',
        border: true,
        borderColor: '#2e2e2e',
        baseColor: '#17a2b8',
        centerColor: '#459cff',
        centerBorderColor: '#ffffff',
        handColors: {
            second: '#d81c7a',
            minute: '#ffffff',
            hour: '#ffffff'
        }
    };

    return (
        <div>
            <div className="  ">
                <nav
                    className=" flex  bg-[#2b2b35] py-6 items-center space-x-24  z-10 relative justify-around  rounded-md lg:w-full"
                    aria-label="Tabs">
                    {tabs.map((tab, i) => (
                        <a
                            key={tab.name}
                            className={`
                ${
                    i === selectedTabIdx
                        ? '      focus:outline-none border-themecolor border-b  '
                        : 'border-b border-transparent text-white '
                }
                whitespace-nowrap  py-4 cursor-pointer text-base text-center`}
                            onClick={() => setSelectedTabIdx(i)}>
                            {i == 0 ? <h6 className="font-Proxima-Regular">2022</h6> : <h6></h6>}

                            {i == 0 ? (
                                <h5 className="text-2xl">Dec8</h5>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <h5 className="text-2xl"> 10:00</h5>
                                    <div>
                                        {' '}
                                        <h6>am</h6> <h6>pm</h6>{' '}
                                    </div>
                                </div>
                            )}
                            {i == 0 ? (
                                <AiFillCalendar className="text-xl text-center mt-3 ml-2" />
                            ) : (
                                <AiOutlineClockCircle className="text-xl text-center mt-3 ml-4" />
                            )}
                        </a>
                    ))}
                </nav>
            </div>
            {selectedTabIdx === 0 && (
                <div className="mt-12 px-8 pb-4">
                    <Calender />
                    <div className="flex justify-end">
                        <Button className="py-2">Cancel</Button>
                    </div>
                </div>
            )}
            {selectedTabIdx === 1 && (
                <div className="mt-12 px-8">
                    <div className="flex justify-center">
                        <AnalogClock {...options} />
                    </div>
                </div>
            )}
        </div>
    );
};
export default CalenderTab;
