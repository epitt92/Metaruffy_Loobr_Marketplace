import React, { useEffect } from "react";
import Image from "next/image";

interface IProps {
    text?: string
    setstate?: any
    data?: any
    text2?: string
}
const Loadingbid = ({ setstate, data, text, text2 }: any) => {

    // useEffect(() => {
    //     console.log(data.loading, "data");

    //     if (!data.loading && data.hash) {
    //         setstate(18);
    //     }
    // }, [data?.loading]);
    return (
        <div className=" w-[34.125rem] xs:w-[23rem]   p-8 ">
            <h3 className="xl:text-2rem  text-white ">{text || 'Placing Bid'}</h3>

            <div className="flex items-center gap-4">
                <figure className="mt-6 ">
                    <div className="loadingio-spinner-rolling-jz7efhw30v">
                        <div className="ldio-fcd0x3izul5">
                            <div></div>
                        </div>
                    </div>
                </figure>
                <div>
                    <h4 className="xl:text-2xl font-Proxima-SemiBold text-white mt-6 ">
                        Processing
                    </h4>
                    <p>{text2 ||'Sit tight! your bid is being placed.'}</p>
                </div>
            </div>
        </div>
    );
};

export default Loadingbid;
