import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/Button/Button';
import Popups from '../../../components/popup/poups';
import CollectionDropdown from './CollectionDropdown';
import ImageComponent from '../../../components/Image/ImageComponent';
import Verified from '../../../components/verified';

const CollectionCard = ({ data, size }: any) => {
    return (
        <Link legacyBehavior href={`/collections/${data?._id}`} key={data?._id}>
            <a>
                <div className=" w-full relative   ">
                    {data?.coverPicture && (
                        <ImageComponent
                            src={data?.logoPicture}
                            {...(!size && { height: size?.height || 480, width: size?.width || 500 })}
                            alt=""
                            className="rounded-xl "
                            quality={50}
                            blurEffect
                            {...(size && {
                                objectFit: 'cover',
                                layout: 'fill',
                                figClassName: 'relative rounded-xl h-[30rem] w-full '
                            })}
                        />
                    )}
                    <div className="  absolute inset-0 bg-[#00000066]  rounded-xl leading-none px-8 pb-8  flex flex-col justify-end ">
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl max-w-full truncate leading-[35px] text-white">{data.name}</h3>
                            <span> {data?.isVerfied && <Verified />}</span>
                        </div>
                        {/* <CollectionDropdown
                                            onDelete={handleDelete}
                                            id={data._id}
                                        /> */}
                    </div>
                </div>
            </a>
        </Link>
    );
};
export default CollectionCard;
