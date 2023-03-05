import React, { useState } from 'react';
import Image from 'next/image';

const JoinCalling = ({ setstate }: any) => {
    const [state, setState] = useState(false);
    const [record, setRecord] = useState(false);

    let chnageData = () => {
        setState(!state);
    };

    let  recording = () => {
        setRecord(!record)
    };
  
    return (
        <div className="sm:w-[40.5rem] xs3:w-full px-6 py-8 ">
            <div className=' flex justify-between items-center'>
            <h5 className="text-white font-Proxima-Bold">Arlene McCoy</h5>
            <div className={` ${record == true ? "block":"hidden"} w-[4.32rem] h-[1.980rem] rounded-[10px] border flex items-center justify-center gap-1.5  text-base font-Proxima-Regular text-white border-[#ffffff]`}>
            <i className="icon-callend cursor-pointer !text-sm text-[#EA4335]"></i>
            REC
            </div>
            </div>

            <div className="mt-5 relative flex  items-center gap-12 !flex-wrap">
                <div>
                    <figure className="h-[4.375rem] w-[4.375rem] relative border-2 border-[#EFC74D] rounded-full">
                        <Image
                            className="rounded-full"
                            src="/assets/images/avr1.png"
                            layout="fill"
                            objectFit="contain"
                        />

                        <img className="absolute -right-2 top-1/2" src="/assets/images/svgstage/mutesm.svg" alt="" />
                    </figure>
                    <p className="w-[4.375rem] text-center mt-2">Guest01</p>
                </div>
                <div>
                    <figure className="h-[4.375rem] w-[4.375rem] relative  rounded-full">
                        <Image
                            className="rounded-full"
                            src="/assets/images/avr2.png"
                            layout="fill"
                            objectFit="contain"
                        />
                        <img
                            className="absolute -right-2 top-1/2"
                            src="/assets/images/svgstage/microtheme.svg"
                            alt=""
                        />
                    </figure>
                    <p className="w-[4.375rem] text-center mt-2">Guest32</p>
                </div>
                <div>
                    <figure className="h-[4.375rem] w-[4.375rem] relative  rounded-full">
                        <Image className="rounded-full" src="/assets/images/2.png" layout="fill" objectFit="contain" />

                        <img className="absolute -right-2 top-1/2" src="/assets/images/svgstage/handbtn.svg" alt="" />
                    </figure>
                    <p className="w-[4.375rem] text-center mt-2">Guest33</p>
                </div>
                <div>
                    <figure className="h-[4.375rem] w-[4.375rem] relative  rounded-full">
                        <Image className="rounded-full" src="/assets/images/4.png" layout="fill" objectFit="contain" />

                        <img className="absolute -right-2 top-1/2" src="/assets/images/svgstage/mutesm.svg" alt="" />
                    </figure>
                    <p className="w-[4.375rem] text-center mt-2">Guest34</p>
                </div>
                <div>
                    <figure className="h-[4.375rem] w-[4.375rem] relative  rounded-full">
                        <Image className="rounded-full" src="/assets/images/3.png" layout="fill" objectFit="contain" />
                        <img className="absolute -right-2 top-1/2" src="/assets/images/svgstage/mutesm.svg" alt="" />
                    </figure>
                    <p className="w-[4.375rem] text-center mt-2">Guest35</p>
                </div>
                <div>
                    <figure className="h-[4.375rem] w-[4.375rem] relative rounded-full">
                        <Image
                            className="rounded-full"
                            src="/assets/images/avr1.png"
                            layout="fill"
                            objectFit="contain"
                        />

                        <img className="absolute -right-2 top-1/2" src="/assets/images/svgstage/mutesm.svg" alt="" />
                    </figure>
                    <p className="w-[4.375rem] text-center mt-2">Guest01</p>
                </div>
            </div>
            <div className=" mt-10 border   border-[#1F1F2A] mr-8"></div>
            <div className="mt-6 flex justify-between xs3:flex-wrap ">
                <div className="flex items-center  gap-5">
                    <img src="/assets/images/svgstage/micro.svg" alt="" />
                    <img src="/assets/images/svgstage/callend.svg" alt="" />
                </div>
                <div className="flex xs3:gap-10 items-center gap-4 xs3:mt-6">
                    <div className=" h-[3.125rem] w-[3.125rem] flex justify-center items-center border border-[#363642] rounded-full ">
                        <i
                            onClick={chnageData}
                            className={` cursor-pointer icon-handgary ${
                                state == true ? 'text-themecolor' : 'text-white'
                            } text-white text-xl`}></i>
                    </div>

                    <div
                        onClick={recording}
                        className={` h-[3.125rem] w-[3.125rem] flex justify-center items-center border
                        ${record == true ? "border-[#EA4335] bg-[#291921]":"border-[#363642]"}
                           rounded-full `}>
                        <i className="icon-callend cursor-pointer text-[#EA4335]"></i>
                    </div>
                    <div
                      onClick={() => {
                        setstate(76)
                    }}
                     className=" h-[3.125rem] w-[3.125rem]  flex justify-center items-center border border-[#363642] rounded-full ">
                    <img className=' cursor-pointer' src="/assets/images/svgstage/user.svg" alt="" />

                    </div>
                    <div
                     onClick={() => {
                        setstate(77)
                    }}
                     className=" h-[3.125rem] w-[3.125rem] flex justify-center items-center border border-[#363642] rounded-full ">
                        <i className="icon-plus  cursor-pointer text-white text-xl "></i>
                    </div>
                    <div
                      onClick={() => {
                        setstate(78)
                    }}
                     className=" h-[3.125rem] w-[3.125rem] flex justify-center items-center border border-[#363642] rounded-full ">
                        <i className="icon-msg cursor-pointer text-white text-xl "></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinCalling;
