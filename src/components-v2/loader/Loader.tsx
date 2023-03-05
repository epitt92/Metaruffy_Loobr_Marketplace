import React from 'react';
import { Rings } from 'react-loader-spinner';
import Image from 'next/image';

const Loader = ({ width, height }: any) => {
    return (
        <div className="flex justify-center w-full  ">
            <figure className="mt-12">
                <div className="">
                    <figure>
                        <Image alt="loader" src="/assets/images/loader.gif" height={70} width={70} />
                    </figure>
                    {/* <div className="ldio-fcd0x3izul5">
                        <div></div>
                    </div> */}
                </div>
            </figure>
        </div>
    );
};

export default Loader;
