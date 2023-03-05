import React, { useState } from 'react';

const EveryThingCard = ({ data }: any) => {
    return (
        <div
            className={`  overflow-hidden  min-h-[330px]  py-10 px-8 border-2 border-[#5A5A62]  flex flex-col  rounded-[10px] text-center`}>
            <i className={`text-white ${data.icon} text-7xl`}></i>
            <h5 className="mt-5 text-2xl text-white font-Proxima-Bold">{data.title}</h5>
            <p className="mt-5 text-[#B8B8BC] text-[16px]">{data.desc}</p>
        </div>
    );
};

export default EveryThingCard;
