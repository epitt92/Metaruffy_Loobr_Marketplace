import React from 'react';
import Button from '../Button/Button';

const NotVerified = ({ setstate }: any) => {
    return (
        <div className="w-full  sm:w-[451px]   rounded-![16px]  bg-![#14141F]">
            <div className="pt-6 px-6 pb-[22px] ">
                <h2 className="text-2xl xl:text[32px] text-white  font-Proxima-Bold">Not Verified</h2>
                <div className="flex justify-center flex-col items-center mt-4">
                    <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M90.0013 45.8873C89.7622 57.8089 84.8036 69.1489 76.2135 77.4189C67.6234 85.6888 56.1034 90.2134 44.1813 89.9998C19.4038 89.6473 -0.411234 69.1698 0.0387655 44.0648C0.483766 19.1723 21.0388 -0.522684 46.0563 0.0248156C70.7288 0.557316 90.4513 20.9798 90.0013 45.8873ZM45.1288 14.9998C38.3288 14.9998 33.1938 21.3898 34.7913 28.0173C37.1863 37.9573 39.6788 47.8748 42.1413 57.7998C42.5388 59.4098 43.6413 60.3323 45.0663 60.3548C46.4913 60.3773 47.6738 59.4348 48.0663 57.7873C50.5213 47.8298 53.0113 37.8798 55.3863 27.9023C56.9588 21.3548 51.8338 14.9998 45.1288 14.9998ZM45.0363 66.9148C43.445 66.8989 41.9125 67.5158 40.776 68.6297C39.6396 69.7437 38.9922 71.2635 38.9763 72.8548C38.9604 74.4461 39.5772 75.9786 40.6912 77.115C41.8052 78.2515 43.325 78.8989 44.9163 78.9148C46.5116 78.9262 48.0466 78.3062 49.1866 77.1902C50.3265 76.0741 50.9789 74.5525 51.0013 72.9573C51.0098 72.1679 50.862 71.3847 50.5662 70.6528C50.2705 69.9208 49.8326 69.2547 49.278 68.6929C48.7234 68.1311 48.0631 67.6848 47.335 67.3796C46.607 67.0744 45.8257 66.9164 45.0363 66.9148Z"
                            fill="#FF0000"
                        />
                    </svg>
                    <p className="text-[#89898F] font-Proxima-Regular text-base mt-8 sm:w-[362px] text-center">
                        The NFT you are currently purchasing belongs to a collection that has not been officially
                        verified by LooBr. Please confirm the authenticity of the current collection to avoid
                        unnecessary losses.
                    </p>
                </div>

                <div className=" mt-10  mb-2">
                    <Button
                        className="w-full  rounded-[3.125rem] !px-14 !py-3 text-black "
                        onClick={() => {
                            setstate(88);
                        }}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NotVerified;
