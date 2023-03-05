import React, { useMemo } from 'react';
import blockchains from '../../../contractsData/blockchains';

type Props = {
    blockchain: string;
    removetootip?: any;
    size?: 'lg' | 'sm';
};

const Cardchains = ({ blockchain, removetootip, size = 'lg' }: Props) => {
    const chain = useMemo(() => blockchains.find((item) => blockchain == item?.symbol), [blockchain]);
    return (
        <div className="flex flex-shrink-0 gap-2">
            <div
                className={`w-[24px] h-[24px] flex items-center justify-center rounded-lg relative ${
                    removetootip ? '' : 'Atpricehoverholder'
                } `}>
                <span className="Atpricehover font-Proxima-Regular   px-1 " title={chain?.name}>
                    {chain?.name}
                </span>
                <span className={size == 'sm' ? 'icon-new' : ''}>
                    {blockchain == chain?.symbol ? chain?.tagname : chain?.disabled}
                </span>
            </div>
        </div>
    );
};

export default Cardchains;
