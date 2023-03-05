import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import UserItem from '../../components/landmap/UserItem';
import { useSelector } from 'react-redux';

const MinlandComponent = () => {
    const topOneIslandOwners = useSelector((state: any) => state.landmap.topOneIslandOwners);

    return (
        <>
            {topOneIslandOwners &&
                topOneIslandOwners.map((item: any, i: number) => (
                    <div className="flex items-center gap-2 " key={i + 'minland'}>
                        <p className="text-white whitespace-nowrap ">{item[0]?.island}:</p>
                        <figure>
                            <Image src="/assets/images/crownminland.svg" height={30} width={30} alt="crown" />
                        </figure>
                        <div className="bg-[#1A1B22] px-2 py-1 flex justify-between  w-[28rem] ">
                            <UserItem item={item[0]} num={0} />
                        </div>
                    </div>
                ))}
        </>
    );
};

export default memo(MinlandComponent);
