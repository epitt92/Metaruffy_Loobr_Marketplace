import React from "react";
import Button from "../../Button/Button";
import Link from "next/link";
const Congratulationnfts = ({ setstate }: any) => {
    return (
        <div className="pt-14 pb-8 sm:px-20 px-5 flex justify-center flex-col items-center ">
            <div className=" bg-themecolor flex justify-center items-center h-[6.25rem] w-[6.25rem] rounded-full">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M46.4509 6.70242C45.7504 6.00069 44.6138 5.99948 43.9132 6.69944L22.383 28.1728L14.615 19.736C13.9438 19.0074 12.8089 18.9601 12.0791 19.6313C11.3498 20.3025 11.3031 21.4379 11.9744 22.1672L21.0076 31.9775C21.3385 32.3371 21.8015 32.5459 22.2896 32.556C22.3028 32.5566 22.3154 32.5566 22.328 32.5566C22.8024 32.5566 23.2588 32.3682 23.595 32.0332L46.4474 9.24064C47.1497 8.54077 47.1509 7.40415 46.4509 6.70242Z"
                        fill="white"
                    />
                    <path
                        d="M46.0147 22.2052C45.0235 22.2052 44.2201 23.0086 44.2201 24C44.2201 35.1498 35.1498 44.2201 24 44.2201C12.8508 44.2201 3.77981 35.1498 3.77981 24C3.77981 12.8508 12.8508 3.77981 24 3.77981C24.9912 3.77981 25.7947 2.97642 25.7947 1.98517C25.7947 0.993815 24.9912 0.19043 24 0.19043C10.8712 0.19043 0.19043 10.8712 0.19043 24C0.19043 37.1281 10.8712 47.8095 24 47.8095C37.1281 47.8095 47.8095 37.1281 47.8095 24C47.8095 23.0087 47.0061 22.2052 46.0147 22.2052Z"
                        fill="white"
                    />
                </svg>
            </div>
            <h2 className="mt-4 text-lg sm:text-2rem   text-white">
                Successfully Listed
            </h2>
            <p className=" text-[#A1A1A5] font-Proxima-Light mt-2">
                Your NFT successfully listed on Marketplace
            </p>
            <Link legacyBehavior href="/marketplace">
                <a>
                    <Button className="w-full mt-[2.75rem] rounded-[3.125rem] ">
                        View on Marketplace
                    </Button>
                </a>
            </Link>
        </div>
    );
};

export default Congratulationnfts;
