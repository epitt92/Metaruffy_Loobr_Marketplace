import React from 'react';
import { EveryThingData } from '../../../data/EveryThingData';
import EveryThingCard from './EveryThingCard';

const Everything = () => {
    return (
        <div className="container pb-24">
            <div className="text-center">
                <h2 className="text-5xl text-white xs:text-3xl"> Features LooBr only has!</h2>
                {/* <p className="mt-5 text-2xl max-w-[55.8rem] mx-auto text-white">
                    We have created a new product that will help designers, developers and companies create websites for
                    their startups quickly and easily.
                </p> */}
            </div>
            <div className="mt-[3.375rem] grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[1.875rem]">
                {EveryThingData?.map((item, i) => {
                    return <EveryThingCard key={i} data={item} />;
                })}
            </div>
        </div>
    );
};

export default Everything;
