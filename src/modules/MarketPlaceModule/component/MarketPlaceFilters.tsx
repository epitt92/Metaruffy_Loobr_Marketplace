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
                <Input
                    className="text-white border-2 border-[#2B2B35] hover:border-[#b9b9bf] !rounded-full text-xl pl-[1.813rem] py-5 placeholder:text-xl "
                    placeholder="Search"
                    styles="  "
                    name="search"
                    // value={search}
                    onchange={fromType == 'nft' ? debouncedEventHandler : debouncedNameHandler}
                    type="text"
                    svgicon="right-6 top-[50%] translate-y-[-50%] cursor-pointer"
                    svgIconName={
                        search && (
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 9 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7.59673 7.59477L1.40625 1.4043M7.59673 1.4043L1.40625 7.59477"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )
                    }
                    onIconClick={onClearSearch}
                />
            </div>

            <div className="border border-[#2B2B35]  rounded-3xl px-4 pt-6 pb-[1.125rem] mb-8">
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

            <div className={`${fromType == 'nft' ? 'block' : 'hidden'}`}>
                <div className="border border-[#2B2B35] rounded-3xl px-4 pt-6 pb-[1.125rem] mb-8">
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
                <div className="border border-[#2B2B35] rounded-3xl px-4 pt-6 pb-[1.125rem] mb-8">
                    <ToggleDisclosure heading="Price" close={false}>
                        <div className="flex flex-col items-center mb-4">
                            <h4 className="mb-4 text-base text-white">
                                ({Number(minPrice || 0).toLocaleString()} - {Number(maxPrice).toLocaleString()}){' '}
                                {/* <i className="inline-block ml-2 align-top ">
                                <Image src={'/assets/images/loobricon.svg'} width={25} height={25} alt="logo" />
                            </i> */}
                            </h4>
                            {marketplace?.metadata?.max &&
                                getSlider(marketplace?.metadata?.min, marketplace?.metadata?.max)}
                            {/* <Range /> */}
                            <div className="flex items-center justify-between w-full max-w-[300px]">
                                <span>{Number(minPrice || 0).toLocaleString()}</span>
                                <span>{Number(maxPrice).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Button
                                className="border-2 px-6 py-3 border-[#2B2B35] hover:bg-[#1F1F2C] text-sm rounded-[96px] text-themecolor bg-transparent text-white mr-2"
                                onClick={onClear}>
                                Clear
                            </Button>
                            <Button
                                className="border-2 px-6 py-3 border-themecolor gold text-sm text-black rounded-[96px]"
                                onClick={onApply}>
                                Apply
                            </Button>
                        </div>
                    </ToggleDisclosure>
                </div>
                <div className="border border-[#2B2B35] rounded-3xl px-4 py-6 mb-8">
                    <ToggleDisclosure heading="Category" close={false}>
                        <div className="max-h-[380px]  overflow-y-auto at-sidebarwrapper AtScroll">
                            {CheckBoxData.map((item, i) => (
                                <div className="flex items-start mb-2.5 Atcheckbox " key={i}>
                                    <label className="h-[25px] w-[25px] cursor-pointer">
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
                                    <label htmlFor="" className="text-base text-white ml-2.5  font-Circular-Book">
                                        {item}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ToggleDisclosure>
                </div>
            </div>

            <div className="border border-[#2B2B35] rounded-3xl px-4 py-6">
                <ToggleDisclosure heading="Chains" close={false}>
                    <div className="max-h-[380px]   overflow-y-auto AtScroll at-sidebarwrapper">
                        {ChanisData.map((item, i) => (
                            <div className="flex items-center mb-2.5 Atcheckbox " key={i}>
                                <label className="h-[25px] w-[25px]  cursor-pointer">
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
                                <label
                                    htmlFor=""
                                    className={`${
                                        !(i == 0 || i == 1 || i == 2 || i == 3) ? '' : 'text-white'
                                    } text-base  ml-2.5  font-Circular-Book flex items-center`}>
                                    <img className="mr-2" src={item.src} alt="" />
                                    {item.name}
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
