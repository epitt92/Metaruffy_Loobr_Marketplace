import React, { useEffect } from "react";
import Image from "next/image";

const BuyLoading = ({ setstate, data }: any) => {
    // useEffect(() => {
    //     if (!data?.loading && data?.hash && data?.next !== false) {
    //         setstate(15);
    //     }
    // }, [data?.loading]);

    interface Iprops {
        data: {
            handing: string;
            text: string;
        };
    }
    return (
        <div className=" w-[34.125rem] xs:w-[23rem]   p-8 ">
            <h3 className="xl:text-2rem  text-white ">Buying NFT</h3>

            <div className="flex items-center gap-4">
                {/* <figure className="mt-6">
                    <Image
                        src="/assets/images/loader.png"
                        height={47}
                        width={47}
                        alt=""
                    />
                </figure> */}
                <figure className="mt-6 ">
                    <div className="loadingio-spinner-rolling-jz7efhw30v">
                        <div className="ldio-fcd0x3izul5">
                            <div></div>
                        </div>
                    </div>
                </figure>
                <div>
                    <h4 className="xl:text-2xl font-Proxima-SemiBold text-white mt-6 ">
                        Please Wait
                    </h4>
                    <p>Sending transactions with your wallet</p>
                </div>
            </div>
        </div>
    );
};

export default BuyLoading;
