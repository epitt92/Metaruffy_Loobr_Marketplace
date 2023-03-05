import React from 'react';

const Skelton = () => {
    return (
        <div className="inline-block p-4 bg-white rounded-2xl animate-pulse">
            <div className="h-72 bg-[#c9cdd3]"></div>
            <div className="flex justify-between items-center my-4">
                <div className=" h-6 bg-[#c9cdd3] w-44"></div>
            </div>
            <div className="flex justify-between items-center my-4">
                <div className=" h-6 bg-[#c9cdd3] w-60 mt-6"></div>
            </div>
            <div className=" h-4 bg-[#c9cdd3] w-44"></div>
            <div className=" h-6 bg-[#c9cdd3] w-60 mt-2"></div>
            <div className="flex justify-between mt-2">
                <div className=" bg-[#c9cdd3] h-6 w-28"></div>
                <div className="w-28 bg-[#c9cdd3] h-6"></div>
            </div>
            <div className="flex justify-between mt-2">
                <div className=" bg-[#c9cdd3] h-6 w-28"></div>
                <div className="w-28 bg-[#c9cdd3] h-6"></div>
            </div>
            <div className="flex justify-end gap-2 items-center my-4">
                <div className=" h-6 bg-[#c9cdd3] w-24  rounded-md"></div>
                <div className=" h-6 bg-[#c9cdd3] w-24  rounded-md"></div>
            </div>
        </div>
    );
};

export default Skelton;
