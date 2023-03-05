import React from 'react';
import Image from 'next/image';

const SuccessfullyOffered = ({ setstate, data }: any) => {
    return (
        <div>
            <div className="pt-0 pb-8 xs:px-20 px-40 flex justify-center flex-col items-center">
                <figure className="">
                    <Image src="/assets/images/placid.gif" width={200} height={200} className="rounded-full" />
                </figure>
                {/* </div> */}

                <h2 className="mt-8 text-themecolor sm:marker text-[2rem]  xs3:text-xl font-Proxima-Regular">
                    Successfully Offered
                </h2>
                <h5 className=" font-Circular-Book text-[#B8B8BC]   font-Proxima-SemiBold mt-2">{data?.name}</h5>

                <h2 className="mt-3 md:mt-12  text-themecolor stext-[2rem] xs3:text-xl font-Proxima-Regular">
                    {data?.offer} WETH
                </h2>
                <h5 className=" text-[#B8B8BC] font-Proxima-SemiBold mb-10">Until the owner accepts your offer</h5>
            </div>
        </div>
    );
};

export default SuccessfullyOffered;
