import React, { useState } from 'react';
import Input from '../input/Input';
import Image from 'next/image';
import Button from '../Button/Button';

const CreateStage = ({ setstate }: any) => {
    let Data = [
        {
            name: 'Guy Hawkins',
            src1: '/assets/images/trending/004.png'
        },
        {
            name: 'Savannah Nguyen',
            src1: '/assets/images/trending/005.png'
        },
        {
            name: 'Eleanor Pena',
            src1: '/assets/images/trending/006.png'
        }
    ];

    return (
        <div className="w-[43.375rem] xs4:w-[25rem] bg-[#14141F] !rounded-[24px] pt-6 pb-8">
            <h4 className="text-white sm:text-[24px] text-center font-Proxima-SemiBold ">Create Stage</h4>
            <div className="border  border-[#1F1F2A] mt-7"></div>

            <div className="px-8 pt-5">
                <h4 className="text-white sm:text-[24px] mb-2 font-Proxima-SemiBold ">Please fill in the details</h4>
                <p className="font-Proxima-Regular text-base mb-5 text-[#5A5A62]">
                    If something is wrong please notify us. Your feedback is really important to us.
                </p>
                <Input placeholder='Updates' className='py-5 mb-6'/>
               <textarea  className='w-full rounded-lg min-h-[9.813rem] bg-transparent resize-none border border-[#5A5A62] outline-none py-5 px-4 text-white focus:border-[#EFC74D] mb-[3.5rem]'
               placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pellentesque interdum leo in gravida. Donec in dolor non nibh hendrerit faucibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pellentesque interdum leo in gravida. Donec in dolor non nibh hendrerit faucibus.'
               />
               <Input placeholder='Sat, Sep 18, '/>
               <Input placeholder="12:00 PM"/>

            </div>
        </div>
    );
};

export default CreateStage;
