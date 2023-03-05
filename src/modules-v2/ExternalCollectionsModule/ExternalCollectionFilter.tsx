import React from 'react';
import search from '../../../pages/search';
import Input from '../../components/input/Input';
import ToggleDisclosure from '../MarketPlaceModule/component/ToggleDisclosure';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const ExternalCollectionFilter = ({ AtClose }: any) => {
    return (
        <div>
            <div className="flex justify-end mt-4 cursor-pointer">
                <AiOutlineCloseCircle className={` xl:hidden block text-5xl`} onClick={AtClose} />
            </div>
            <div className="relative mt-16 mb-12 xl:mb-8 xl:mt-0">
                <i className="absolute z-10 -translate-y-1/2 icon-search top-1/2 right-6"></i>
                <Input
                    className="text-white border-2 border-[#2B2B35] bg-[#14141F] !rounded-full text-xl pl-[1.813rem] pr-12 py-5 placeholder:text-xl "
                    placeholder="Search"
                    styles="  "
                    name="search"
                    type="text"
                    svgicon="right-6 top-[50%] translate-y-[-50%] cursor-pointer"
                />
            </div>
            <div className="border border-[#2B2B35] bg-[#14141F] rounded-3xl px-4 pt-6 pb-[1.125rem] mb-8 space-y-5">
                <p className="text-lg text-white font-Proxima-Bold">Attributes</p>
                <ToggleDisclosure heading="Background" close={false}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-start mb-2.5 Atcheckbox ">
                            <label className="h-[25px] w-[25px] cursor-pointer">
                                <input id="" type="checkbox" className={` `} name="Background" />
                                <span></span>
                            </label>
                            <label htmlFor="" className="text-base text-white ml-2.5 font-Circular-Book">
                                Blue
                            </label>
                        </div>
                    </div>
                </ToggleDisclosure>
                <ToggleDisclosure heading="Body" close={false}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-start mb-2.5 Atcheckbox ">
                            <label className="h-[25px] w-[25px] cursor-pointer">
                                <input id="" type="checkbox" className={` `} name="Background" />
                                <span></span>
                            </label>
                            <label htmlFor="" className="text-base text-white ml-2.5 font-Circular-Book">
                                Blue
                            </label>
                        </div>
                    </div>
                </ToggleDisclosure>
                <ToggleDisclosure heading="Face" close={false}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-start mb-2.5 Atcheckbox ">
                            <label className="h-[25px] w-[25px] cursor-pointer">
                                <input id="" type="checkbox" className={` `} name="Background" />
                                <span></span>
                            </label>
                            <label htmlFor="" className="text-base text-white ml-2.5 font-Circular-Book">
                                Blue
                            </label>
                        </div>
                    </div>
                </ToggleDisclosure>
                <ToggleDisclosure heading="Headgear" close={false}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-start mb-2.5 Atcheckbox ">
                            <label className="h-[25px] w-[25px] cursor-pointer">
                                <input id="" type="checkbox" className={` `} name="Background" />
                                <span></span>
                            </label>
                            <label htmlFor="" className="text-base text-white ml-2.5 font-Circular-Book">
                                Blue
                            </label>
                        </div>
                    </div>
                </ToggleDisclosure>
                <ToggleDisclosure heading="Outline" close={false}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-start mb-2.5 Atcheckbox ">
                            <label className="h-[25px] w-[25px] cursor-pointer">
                                <input id="" type="checkbox" className={` `} name="Background" />
                                <span></span>
                            </label>
                            <label htmlFor="" className="text-base text-white ml-2.5 font-Circular-Book">
                                Blue
                            </label>
                        </div>
                    </div>
                </ToggleDisclosure>
                <ToggleDisclosure heading="Tasslels" close={false}>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-start mb-2.5 Atcheckbox ">
                            <label className="h-[25px] w-[25px] cursor-pointer">
                                <input id="" type="checkbox" className={` `} name="Background" />
                                <span></span>
                            </label>
                            <label htmlFor="" className="text-base text-white ml-2.5 font-Circular-Book">
                                Blue
                            </label>
                        </div>
                    </div>
                </ToggleDisclosure>
            </div>
        </div>
    );
};

export default ExternalCollectionFilter;
