import React from 'react';

interface Iprops {
    className?: string;
    count: number;
    percent: string;
    block?: boolean;
}

const TrendsTableCalculator = ({ count, percent, className, block }: Iprops) => {
    return (
        <div className={`${className} flex flex-col items-start`}>
            {count}
            {/* <div
                className={`${className} ${
                    block ? 'text-[#FF0000] bg-[#431019]' : 'text-[#26AB5F] bg-[#18322C]'
                } inline-block px-3 py-0.5  rounded-full text-[11px] font-Proxima-SemiBold`}>
                {percent}%
            </div> */}
        </div>
    );
};

export default TrendsTableCalculator;
