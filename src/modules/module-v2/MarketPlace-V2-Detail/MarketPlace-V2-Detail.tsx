import React from 'react';
import VerifiedIcon from '../../../components-v2/VerifiedIcon';
import Button from '../../../components/Button/Button';

const MarketPlaceDetailModule = () => {
    return (
        <div className="container my-16 min-h-[30rem]">
            <div className="p-2 border border-dashed border-themecolor rounded-md w-[32rem]">
                <div className="flex gap-2 items-center justify-center">
                    <p className="text-base">Creator</p>
                    <div className="flex items-center gap-1 flex-shrink-0  ">
                        <div className="h-6 w-6 rounded-full border-2 flex-shrink-0 bg-[#9D9D9D]"></div>
                        <div>
                            <div className="flex items-center gap-1">
                                <p className="text-[10px] font-Proxima-Bold text-white">User A</p>
                                <VerifiedIcon />
                                <span className="text-[8px]">@username</span>
                            </div>
                            <p className="text-[8px]">280 Followers</p>
                        </div>
                    </div>
                    <Button className="text-[12px] font-Proxima-Bold py-3 !px-4 ">Follow</Button>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="20" height="20" rx="3" fill="#F1C94A" />
                        <g clipPath="url(#clip0_439_2152)">
                            <path
                                d="M7.35 11.15V6.5H4.5C3.675 6.5 3 7.175 3 8V12.5C3 13.325 3.675 14 4.5 14H5.25V16.25L7.5 14H11.25C12.075 14 12.75 13.325 12.75 12.5V11.135C12.7007 11.1456 12.6504 11.1509 12.6 11.1508H7.35V11.15ZM16.5 2.75H9.75C8.925 2.75 8.25 3.425 8.25 4.25V10.25H13.5L15.75 12.5V10.25H16.5C17.325 10.25 18 9.57575 18 8.75V4.25C18 3.425 17.325 2.75 16.5 2.75Z"
                                fill="black"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_439_2152">
                                <rect width="15" height="15" fill="white" transform="translate(3 2)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default MarketPlaceDetailModule;
