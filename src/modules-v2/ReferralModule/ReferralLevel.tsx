import React from 'react';

const ReferralLevel = ({ title, head }: any) => {
    return (
        <div className="bg-[#2B2B35] text-xl pt-3 pb-4 px-4 rounded-xl flex flex-col justify-between h-[7.5rem]">
            <p className="font-Proxima-SemiBold text-gray6 text-lg leading-[1.5rem] pr-3">{title}</p>
            <p className="text-2xl xl:text-[2rem] text-themecolor ">{head}</p>
        </div>
    );
};

export default ReferralLevel;
