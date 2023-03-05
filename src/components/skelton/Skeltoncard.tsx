import React from 'react';

const SkeltonCard = () => {
    return (
        <div className="inline-block p-4 bg-white rounded-2xl animate-pulse">
            <div className="h-44 bg-[#c9cdd3]"></div>
            <div className="flex justify-between  items-center my-3">
                <div className=" h-6 bg-[#c9cdd3] w-44"></div>
            </div>
            <div className=" bg-[#c9cdd3] h-6 w-28"></div>
            <div className="w-28 mt-2 bg-[#c9cdd3] h-6"></div>

            <div className=" h-6 bg-[#c9cdd3] w-44 mt-2"></div>
            <div className=" h-6 bg-[#c9cdd3] w-44 mt-2"></div>
        </div>
    );
};

export default SkeltonCard;
