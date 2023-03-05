import React from 'react';

const SkeltonLandmap = () => {
    return (
        <div className="h-full bg-white rounded-md p-4 pb-6 animate-pulse   ">
            <div className="flex justify-center items-center flex-col">
                <div className=" h-6 bg-[#c9cdd3] w-32 mt-6"></div>
                <div className=" h-6 bg-[#c9cdd3] w-52 mt-3"></div>
                <div className=" h-6 bg-[#c9cdd3] w-48 mt-3"></div>
                <div className=" bg-[#c9cdd3] h-[4.875rem] mt-6 rounded-lg  w-full flex justify-between px-4 items-center gap-2 mt-4 ">
                    <div className="flex gap-2 items-center">
                        <div className="h-[2.125rem] w-[2.125rem]  rounded-full bg-white animate-pulse"></div>
                        <div className="">
                            <div className=" h-4 bg-white animate-pulse w-16 "></div>
                            <div className=" h-2 bg-white animate-pulse w-24 mt-1"></div>
                        </div>
                    </div>
                    <div className="flex gap-2 item-center">
                        <div className=" h-6 bg-white animate-pulse w-16  rounded-xl"></div>
                        <div className=" h-6 bg-white animate-pulse  w-16 rounded-xl"></div>
                    </div>
                </div>

                <div className="h-[14.125rem] w-[14.125rem]  mt-6 rounded-md bg-[#c9cdd3]"></div>
                <div className=" h-6 bg-[#c9cdd3] w-full mt-16"></div>
                <div className="flex justify-around w-full mt-16">
                    <div className="h-[1.125rem] w-[1.125rem]  mt-6 rounded-md bg-[#c9cdd3]"></div>
                    <div className="h-[1.125rem] w-[1.125rem]  mt-6 rounded-md bg-[#c9cdd3]"></div>

                    <div className="h-[1.125rem] w-[1.125rem]  mt-6 rounded-md bg-[#c9cdd3]"></div>
                </div>

                <div className=" h-20 bg-[#c9cdd3] w-full mt-10"></div>
                <div className="h-[1.125rem] w-[1.125rem]  mt-6 rounded-md bg-[#c9cdd3]"></div>

                <div className=" h-6 bg-[#c9cdd3] w-full mt-6"></div>
            </div>

            {/* <div className="sm:flex justify-between items-center gap-2 mt-1 ">
                <div className=" bg-[#c9cdd3] h-[4.875rem] sm:mt-0 mt-2  sm:w-[50%] rounded-lg"></div>
                <div className=" sm:w-[50%] bg-[#c9cdd3] sm:mt-0 mt-2  h-[4.875rem] rounded-lg"></div>
            </div> */}
        </div>
    );
};

export default SkeltonLandmap;
