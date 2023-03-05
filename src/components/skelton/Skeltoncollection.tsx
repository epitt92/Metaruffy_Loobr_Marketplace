import React from 'react';

const SkeltonCollection = () => {
    return (
        <div className=" bg-white rounded-[1rem] p-4 pb-6 animate-pulse">
            <div className="flex justify-center items-center">
                <div className="h-[6.125rem] w-[6.125rem] rounded-full bg-[#c9cdd3]"></div>
            </div>
            <div className=" h-6 bg-[#c9cdd3] w-44 mt-10"></div>
            <div className=" h-4 bg-[#c9cdd3] w-32 mt-2"></div>
            <div className=" h-6 bg-[#c9cdd3] w-60 mt-4"></div>
            <div className="sm:flex justify-between mt-4 items-center gap-2 ">
                <div className=" bg-[#c9cdd3] h-[4.875rem]  sm:w-[50%] rounded-lg"></div>
                <div className=" sm:w-[50%] bg-[#c9cdd3] sm:mt-0 mt-2 h-[4.875rem] rounded-lg"></div>
            </div>
            <div className="sm:flex justify-between items-center gap-2 mt-1 ">
                <div className=" bg-[#c9cdd3] h-[4.875rem] sm:mt-0 mt-2  sm:w-[50%] rounded-lg"></div>
                <div className=" sm:w-[50%] bg-[#c9cdd3] sm:mt-0 mt-2  h-[4.875rem] rounded-lg"></div>
            </div>
        </div>
    );
};

export default SkeltonCollection;
