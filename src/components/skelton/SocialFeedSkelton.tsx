import React from 'react';

const SocialFeedSkelton = () => {
    return (
        <div className="inline-block w-full bg-white rounded-2xl animate-pulse ">
            <div className="flex items-center justify-between border-b-2 border-[#c9cdd3] p-5">
                <div className="flex items-center gap-5 ">
                    <div className="rounded-full w-14 h-14 bg-[#c9cdd3] "></div>
                    <div>
                        <div className="w-40 bg-[#c9cdd3] h-4 rounded-full"></div>
                        <div className="w-48 mt-2 bg-[#c9cdd3] h-4 rounded-full"></div>
                    </div>
                </div>
                <div className="w-36 bg-[#c9cdd3] h-8 rounded-full"></div>
            </div>
            <div className="py-5">
                <div className=" bg-[#c9cdd3] h-[23.4rem] w-full  "></div>
            </div>
            <div className="flex items-center p-5 justify-between border-t-2 border-[#c9cdd3]">
                <div className="flex items-center w-3/4 gap-6 ">
                    <div className="flex items-center gap-2 ">
                        <div className="rounded-full w-10 h-10 bg-[#c9cdd3] "></div>
                        <div className="w-16 bg-[#c9cdd3] h-4 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2 ">
                        <div className="rounded-full w-10 h-10 bg-[#c9cdd3] "></div>
                        <div className="w-16 bg-[#c9cdd3] h-4 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2 ">
                        <div className="rounded-full w-10 h-10 bg-[#c9cdd3] "></div>
                        <div className="w-16 bg-[#c9cdd3] h-4 rounded-full"></div>
                    </div>
                </div>
                <div className=" h-6 bg-[#c9cdd3] w-24 rounded-full"></div>
            </div>
        </div>
    );
};

export default SocialFeedSkelton;
