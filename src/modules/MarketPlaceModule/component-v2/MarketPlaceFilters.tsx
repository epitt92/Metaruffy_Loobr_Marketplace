import React from 'react';
import ToggleDisclosure from './ToggleDisclosure';
import { CheckBoxData } from './CheckBoxData';
import Input from '../../../components/input/Input';
import Button from '../../../components/Button/Button';
import { ChanisData } from './ChainsData';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { GlobalSearch } from '../../../components/header/GlobalSearch';
import Search from '../../../components-v2/forms/Search';

const ChecktypeData = ['Fixed Price', 'Timed Auction'];
const fromTypeData = [
    { name: `NFTs`, value: 'nft' },
    { name: `Collections`, value: 'collection' }
];

type Iprops = {
    onClear: Function;
    onSelectCategory: React.ChangeEventHandler<HTMLInputElement>;
    onSelectType: React.ChangeEventHandler<HTMLInputElement>;
    types: string[];
    categories: String[];
    search: string;
    onApply: Function;
    onClearSearch: Function;
    onSliderChange: (value: number | number[]) => void;
    minPrice: number;
    maxPrice: number;
    debouncedEventHandler: Function;
    onSelectChain: React.ChangeEventHandler<HTMLInputElement>;
    chains: any;
    fromType: string;
    setFromType: Function;
    debouncedNameHandler: Function;
};

const MarketPlaceFilters = ({
    // onChange,
    onClear,
    onSelectCategory,
    onSelectType,
    types,
    categories,
    search,
    onApply,
    onClearSearch,
    onSliderChange,
    minPrice,
    maxPrice,
    debouncedEventHandler,
    onSelectChain,
    chains,
    fromType,
    setFromType,
    debouncedNameHandler
}: Iprops) => {
    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const [showSearch, setShowSearch] = useState(false);

    const getSlider = (min: number, max: number) => (
        <Slider
            range
            allowCross={false}
            defaultValue={[min, max]}
            value={[Number(minPrice), Number(maxPrice)]}
            onChange={onSliderChange}
            max={max}
            min={min}
            className="AtSliderrange"
            step={100}
        />
    );

    return (
        <>
            <div className="relative mt-8 mb-8 xl:mt-0 ">
                    
                <Search  className='text-[#7D7D8E]' />
                
            </div>
            <div className="hidden border border-[#2B2B35]  rounded-3xl px-4 pt-6 pb-[1.125rem] mb-8">
                <ToggleDisclosure heading="From" close={false}>
                    <div className="grid grid-cols-2 gap-2 ">
                        {fromTypeData.map((checkitem, i) => (
                            <label className="selecttype" key={i}>
                                <input
                                    id=""
                                    type="checkbox"
                                    className="pl-9 "
                                    name="type"
                                    value={checkitem.value}
                                    checked={fromType == checkitem.value}
                                    onChange={(e: any) => setFromType(e.target.value)}
                                />
                                <span>{checkitem?.name}</span>
                            </label>
                        ))}
                    </div>
                </ToggleDisclosure>
            </div>

            <div className={` ${fromType == 'nft' ? 'block' : 'hidden'}`}>
                <div className="hidden border border-[#2B2B35] rounded-3xl px-4 pt-6 pb-[1.125rem] mb-8">
                    <ToggleDisclosure heading="Select Types" close={false}>
                        <div className="grid grid-cols-2 gap-2">
                            {ChecktypeData.map((checkitem, i) => (
                                <label className="selecttype" key={i}>
                                    <input
                                        id=""
                                        type="checkbox"
                                        className="pl-9"
                                        name="type"
                                        value={checkitem}
                                        checked={types.includes(i?.toString())}
                                        onChange={onSelectType}
                                    />
                                    <span>{checkitem}</span>
                                </label>
                            ))}
                        </div>
                    </ToggleDisclosure>
                </div>
              
                <div className=" bg-[#2B2B35] rounded-md border border-[#5C5C63]  p-2     mb-8">
                    <ToggleDisclosure heading="Category" close={false}>
                        <div className="at-sidebarwrapper">
                            {CheckBoxData.map((item, i) => (
                                <div className="flex  justify-between w items-center   mb-1 Atcheckbox " key={i}>
                                    
                                    <label htmlFor="" className="text-sm text-[#727279]   font-Proxima-Bold">
                                        {item}
                                    </label>
                                    <label className="h-[12px] w-[12px] cursor-pointer">
                                        <input
                                            id=""
                                            type="checkbox"
                                            className={` `}
                                            name="category"
                                            value={item}
                                            checked={categories.includes(item)}
                                            // checked={categories[item]}
                                            onChange={onSelectCategory}
                                        />
                                        <span></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ToggleDisclosure>
                </div>
            </div>

            <div className="bg-[#2B2B35] rounded-md border border-[#5C5C63]  px-4 py-2.5   mb-8">
                <ToggleDisclosure heading="Blockchain" close={false}>
                    <div className=" at-sidebarwrapper">
                        {ChanisData.map((item, i) => (
                            <div className="flex justify-between items-center Atcheckbox  mb-1" key={i}>
                              
                                <label
                                    htmlFor=""
                                    className={`${
                                        !(i == 0 || i == 1 || i == 2 || i == 3) ? '' : 'text-white'
                                    } text-base    font-Circular-Book flex items-center`}>
                                        {item.src ? <img className="mr-2 h-[15px] w-[15px] " src={item.src} alt="" />: <a className='mr-6'> </a>}
                                        <p className="text-sm text-[#727279]   font-Proxima-Bold">
                                    
                                    {item.name}
                                    </p>

                                </label>
                                <label className="h-[12px] w-[12px]  cursor-pointer">
                                    <input
                                        disabled={!(i == 0 || i == 1 || i == 2 || i == 3)}
                                        id=""
                                        type="checkbox"
                                        className={` `}
                                        name="blockchain"
                                        value={item?.value}
                                        checked={chains?.includes(item?.value)}
                                        onChange={onSelectChain}
                                    />
                                    <span></span>
                                </label>
                            </div>
                        ))}
                    </div>
                </ToggleDisclosure>
            </div>
        </>
    );
};

export default MarketPlaceFilters;
