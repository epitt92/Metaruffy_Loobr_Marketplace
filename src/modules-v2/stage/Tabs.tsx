import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import Stagecomponent from './Stagecomponent';
import Popups from '../../components/popup/poups';
const tabs = [
    { name: 'All stage', current: true },
    { name: ' My Stage', current: false }
];

const StagTabs = () => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);

    return (
        <div>
            <div className=" overflow-x-auto">
                <nav className=" flex  items-center space-x-4   lg:w-full" aria-label="Tabs">
                    <div className="flex justify-between w-full mt-14 items-center">
                        <div className="flex gap-3">
                            {tabs.map((tab, i) => (
                                <a
                                    key={tab.name}
                                    className={`
              border 
                ${
                    i === selectedTabIdx
                        ? ' !px-6 !py-3 !text-[#000000] border-transparent rounded-[39px] !text-lg bg-themecolor    focus:outline-none '
                        : '!px-6 border-[#696969]  !py-3  !text-[#696969] rounded-[39px] !font-Proxima-Regular !text-lg bg-transparent'
                }
                whitespace-nowrap  px-10 sm:px-14 cursor-pointer text-base`}
                                    onClick={() => setSelectedTabIdx(i)}>
                                    {tab.name}
                                </a>
                            ))}
                        </div>
                        <Button className="!px-6 !py-3 text-darkgray rounded-[39px] !text-lg"
                        onClick={() => {
                            setPopup(true);
                            setState(79);
                        }}
                        >Create Stage</Button>
                    </div>
                </nav>
            </div>
            {selectedTabIdx === 0 && (
                <div>
                    <Stagecomponent />
                </div>
            )}
            {selectedTabIdx === 1 && (
                    <Stagecomponent  data="delete" />
               
            )}

            
{state && (
                    <Popups
                        show={popup}
                        hide={setPopup}
                        state={state}
                        setstate={setState}
                        setPopup={false}
                       
                    />
                )}
        </div>
    );
};
export default StagTabs;
