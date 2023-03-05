import React, { useEffect } from "react";
import Image from "next/image";
import Button from "../Button/Button";
import { useRouter } from "next/router";
import useMetaMask from "../../hooks/useMetaMask";

const Connectingnft = ({ setstate }: any) => {
    const { isLoading }: any = useMetaMask();

    const router = useRouter();

    useEffect(() => {
        // console.log("isLoading", isLoading);

        if (!isLoading) {
            setstate(10);
        }
    }, [isLoading]);
    return (
        <div className=" w-[27.563rem] xs:w-[23rem] text-center   py-7 ">
            <h6 className="text-white text-center text-lg">Connecting</h6>
            <div className="border-b border-[#43434C] mt-5  text-center"></div>
            <div className="text-center ">
                <p className="text-[#A1A1A5]  font-Circular-Book text-base mt-8   text-center">
                    MetaMask wallet details screen<br></br> with data will come
                    here
                </p>
            </div>
            <figure className="mt-12">
                {/* <Image src="/assets/images/loader.png" height={48} width={48} alt="" /> */}
                <div className="loadingio-spinner-rolling-jz7efhw30v">
                    <div className="ldio-fcd0x3izul5">
                        <div></div>
                    </div>
                </div>
            </figure>
            <p className="text-base font-SofiaPro-Regular mt-6 ">
                Loading to Connect
            </p>
        </div>
    );
};

export default Connectingnft;
