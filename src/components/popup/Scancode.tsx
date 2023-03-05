import React from 'react';
import Image from 'next/image';
import { QrReader } from 'react-qr-reader';

const Scancode = ({ data, setstate }: any) => {
    const handleSelect = (result: any, error: any) => {
        if (!!result) {
            data?.setAddress(result?.text?.replace('ethereum:', ''));
            setstate(-1);
            console.log(result);
        }

        if (!!error) {
            console.info(error);
        }
    };
    return (
        <div className="sm:w-[450px] w-[30rem] xs:w-[25rem] m-auto rounded-lg py-6 ">
            <div className=" py-6 text-center px-6">
                <h2 className="text-2xl text-white ">Scan QR Code</h2>
            </div>

            <hr className="bg-[#1F1F2A] h-[1px] border-none" />

            <div className="mt-5 flex   justify-center items-center mb-5">
                <figure className="w-[20.25rem] h-[19.438rem] relative mt-5  overflow-hidden">
                    <Image src="/assets/images/scan.png" className="z-[1]" objectFit="fill" layout="fill" />

                    <QrReader
                        onResult={handleSelect}
                        constraints={{
                            facingMode: 'environment'
                        }}
                        className="absolute rt-videoscan w-[100%] h-[100%]"
                    />
                </figure>
            </div>
        </div>
    );
};

export default Scancode;
