import React, { useState } from 'react';
import Image from 'next/image';
import { getMarketDetailsByAddress } from '../../utils/functions';

const Successbid = ({ setstate, data }: any) => {
    const blockchain = getMarketDetailsByAddress(data?.to);

    // const [popup, setPopup] = useState(false);
    // const [state, setState] = useState(-1);
    return (
        <div>
            <div className="pt-0 pb-8 xs:px-20 px-40 flex justify-center flex-col items-center">
                <figure className="">
                    <Image src="/assets/images/placid.gif" width={200} height={200} className="rounded-full" />
                </figure>
                {/* </div> */}

                <h2 className="mt-8 text-themecolor text-2rem font-Proxima-Regular">Success Bid</h2>
                <h5 className=" font-Circular-Book text-[#B8B8BC]  font-Proxima-SemiBold mt-2">{data?.nft?.name}</h5>

                <h2 className="mt-3 md:mt-12  text-themecolor text-2rem font-Proxima-Regular">
                    {data?.hash} {blockchain?.native ? blockchain?.nativeCurrency : blockchain?.tokenSymbol}
                </h2>
                <h5 className=" text-[#B8B8BC] font-Proxima-SemiBold mb-10">Until the end of the auction</h5>
            </div>
        </div>
    );
};

export default Successbid;
