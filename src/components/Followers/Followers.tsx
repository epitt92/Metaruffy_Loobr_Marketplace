import Image from 'next/image';
import React from 'react';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import { Followersdata } from '../../data/followersdata';
import Button from '../Button/Button';
import ImageComponent from '../Image/ImageComponent';

const Followers = () => {
    return (
        <div className="sm:w-[28.125rem]   rounded-2xl py-6">
            {/* <h3 className=' border border-b-[#2B2B35] border-transparent  text-white py-6 text-center'>Followers</h3> */}
            <div className="overflow-y-scroll max-h-[31.25rem] at-sidebarwrapper AtScroll">
                {Followersdata.map((item) => (
                    <>
                        <div className="py-2 px-6 flex justify-between items-center ">
                            <div className="flex items-center">
                                <figure className='w-[50px] h-[50px] relative'>
                                <ImageComponent
                                    src={item?.src}
                                    // width={50}
                                    // height={50}
                                    objectFit="cover"
                                    layout="fill"
                                    alt=""
                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                />
                                </figure>
                                <h4 className="pl-4 text-base text-white">{item?.name}</h4>
                            </div>
                            <Button className=" px-6 h-[29px] text-sm gold">Follow</Button>
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
};

export default Followers;
