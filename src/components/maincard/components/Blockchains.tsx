import React from 'react';
import blockchains from '../../../contractsData/blockchains';

type Props = {
    blockchain: string;
};

const Blockchains = ({ blockchain }: Props) => {
    return (
        <div className="flex flex-shrink-0 gap-2">
            {blockchains.map((item, i) => (
                <div
                    key={i}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-lg relative Atpricehoverholder">
                    <span className="Atpricehover font-Proxima-Regular   px-1 " title={item?.name}>
                        {item?.name}
                    </span>
                    {blockchain?.split(',').includes(item?.name) ? item?.tagname : item?.disabled}
                </div>
            ))}
        </div>
    );
};

export default Blockchains;
