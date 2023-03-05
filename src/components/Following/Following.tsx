import Image from 'next/image';
import React from 'react';
import { Followingdata } from '../../data/Followingdata';
import FollowTabs from '../../modules/ProfileModule/components/FollowTabs';
import Button from '../Button/Button';

const Following = ({ data, setConfirmed, type }: any) => {
    return (
        <div className="w-full md:w-[450px] sm:w-[350px] m-auto rounded-2xl overflow-hidden">
            <FollowTabs data={data} setConfirmed={setConfirmed} type={type} />
        </div>
    );
};

export default Following;
