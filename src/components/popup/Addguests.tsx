import React, { useState } from 'react';
import Input from '../input/Input';
import Search from '../search/Search';
import Image from 'next/image';
import Button from '../Button/Button';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';

const Addguests = ({ setstate }: any) => {
    let Data = [
        {
            name: 'Guy Hawkins',
            src1: '/assets/images/trending/01.png'
        },
        {
            name: 'Savannah Nguyen',

            src1: '/assets/images/trending/002.png'
        },
        {
            name: 'Eleanor Pena',

            src1: '/assets/images/trending/003.png'
        }
    ];
    const [state, setState] = useState(false);

    const addRequested = (i: any) => {
        setState(!false);
    };

    return (
        <div className="w-[28.125rem] xs4:w-[25rem] bg-[#14141F] !rounded-[24px] pt-6 pb-8">
            <h4 className="text-white sm:text-[24px] text-center font-Proxima-SemiBold ">Add Guests</h4>
            <div className="border  border-[#1F1F2A] mt-6"></div>
            <Search
                className="border mt-2  !border-transparent bg-transparent w-full !pl-14"
                placeholder="Search people"
            />
            <div className="border  border-[#1F1F2A] mt-2"></div>
            <div className="">
                <div className="relative mt-6 px-5">
                    <ul className="min-h-[200px] max-h-[200px]   overflow-auto scrollbarHide">
                        {Data.map((item, i) => (
                            <li className="flex justify-between items-center py-2" key={i}>
                                <div className="flex items-center gap-4">
                                    <figure className="h-[3.125rem] w-[3.125rem] relative rounded-full">
                                        <ImageComponent
                                            className="rounded-full"
                                            src={item.src1}
                                            layout="fill"
                                            objectFit="contain"
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        />
                                    </figure>
                                    <h6 className="text-white">{item.name}</h6>
                                </div>
                                <Button
                                    onClick={addRequested}
                                    className={`!py-1.5  ${
                                        state === true ? '!hidden' : '!block'
                                    }  !px-6 !text-[#14141F] !font-Proxima-Bold`}>
                                    Add
                                </Button>
                                <Button
                                    className={` ${
                                        state === true ? '!block' : '!hidden'
                                    } !py-1.5   !px-6 !text-themecolor border border-themecolor !bg-transparent !font-Proxima-Bold`}>
                                    Requested
                                </Button>
                            </li>
                        ))}
                    </ul>

                    <Button
                        onClick={() => {
                            setstate(75);
                        }}
                        className="!w-full !text-xl !rounded-[50px] !py-5 mt-8 !text-[#14141F] !font-Proxima-Bold">
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Addguests;
