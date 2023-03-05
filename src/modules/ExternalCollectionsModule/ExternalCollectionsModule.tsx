import React, { useState } from 'react';

import BlurImage from '../../components/blurimage/BlurImage';
import MainCard from '../../components/maincard/MainCard';
import Select from '../../components/select/Select';
import ExternalCollectionFilter from './ExternalCollectionFilter';
import ExternalCollectionTable from './ExternalCollectionTable';

const sortdata = [
    { id: 0, name: 'Sort by' },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 2, name: 'Price: High to Low', value: 'price', order: -1 },
    { id: 1, name: 'Likes: Low to High', value: 'likes', order: 1 },
    { id: 2, name: 'Likes: High to Low', value: 'likes', order: -1 },
    { id: 1, name: 'Comments: Low to High', value: 'comments', order: 1 },
    { id: 2, name: 'Comments: High to Low', value: 'comments', order: -1 },
    { id: 3, name: 'Newest To Oldest', value: 'createdAt', order: -1 },
    { id: 4, name: 'Oldest To Newest', value: 'createdAt', order: 1 }
];

const ExternalCollectionsModule = () => {
    const [selected, setSelected] = useState(sortdata[0]);
    const [page, setPage] = useState(1);
    const [show, setshow] = useState(false);
    const handleSelectSort = (values: any) => {
        page != 1 && setPage(1);
        setSelected(values);
    };
    const togglebar = () => {
        setshow(!show);
    };
    return (
        <div className="container pt-12  pb-[98px]">
            <div className=" md:flex  gap-8 sm:pt-[80px]  relative">
                <i
                    className="absolute top-0 left-0 block p-2 mt-0 text-2xl text-white border border-white rounded-md icon-filter xl:hidden sm:mt-2 sm:top-24"
                    onClick={togglebar}></i>
                <div
                    className={`xl:w-[20%]  lg:w-[30%]  sm:w-[40%] w-full h-full px-4  xl:block  xl:bg-transparent xl:rounded-none rounded-lg flex-shrink-0 bg-[#22222f] xl:shadow-none shadow-lg hidden fixed top-0  left-0 xl:relative xl:z-[30] z-[99]  overflow-y-auto  ${
                        show === false ? 'hidden' : '!block'
                    }`}>
                    <ExternalCollectionFilter AtClose={togglebar} />
                </div>
                <div className="w-full  md:w-[60%] ">
                    <div className="flex flex-row justify-between mb-10 xs:flex-col sm:items-center">
                        <h2 className="mb-8 text-white xs:text-4xl pl-14 xl:pl-0 sm:mb-0">Collections</h2>
                        <div className="flex justify-end">
                            <Select
                                className="rounded-[50px]  cursor-pointer  "
                                style="!w-[220px] xs:!w-full !m-0 cursor-pointer"
                                data={sortdata}
                                selected={selected}
                                onSelect={handleSelectSort}
                            />
                        </div>
                    </div>

                    <div className="mb-10 lg:gap-10">
                        <ExternalCollectionTable />
                    </div>
                </div>
                <div className={` w-full md:w-[40%] xl:w-[20%]  xl:block  xl:rounded-none `}>
                    <h2 className="mb-12 text-white xs:text-4xl">Activity</h2>
                    <div className="border border-[#2B2B35] rounded-[12px] px-3 py-4 space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center w-2/3 gap-1 ">
                                <BlurImage
                                    src={'/assets/images/placeholder2.png'}
                                    figClassName="flex-shrink-0 relative overflow-hidden h-8 w-8"
                                    className="rounded-lg"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <div className="w-full gap-2 truncate ">
                                    <h6 className="text-sm text-white truncate cursor-pointer font-Proxima-SemiBold">
                                        <span className="truncate">Forever Cartridge</span>
                                    </h6>
                                    <p className="flex items-center text-xs gap-x-1 text-secondary">
                                        sold by
                                        <div className="flex items-center gap-1 ">
                                            <BlurImage
                                                src={'/assets/images/placeholder2.png'}
                                                figClassName="flex-shrink-0 relative overflow-hidden h-3 w-3"
                                                className="rounded-lg"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                            <div className="w-[5rem]  flex items-center truncate gap-2">
                                                <h6 className="text-xs text-white truncate cursor-pointer font-Proxima-SemiBold">
                                                    @rainbow112
                                                </h6>
                                            </div>
                                        </div>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end w-1/3">
                                <h6 className="text-base text-white font-Proxima-SemiBold">1.2 ETH</h6>
                                <h6 className="text-xs text-secondary">10h ago</h6>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center w-2/3 gap-1 ">
                                <BlurImage
                                    src={'/assets/images/placeholder2.png'}
                                    figClassName="flex-shrink-0 relative overflow-hidden h-8 w-8"
                                    className="rounded-lg"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <div className="w-full gap-2 truncate ">
                                    <h6 className="text-sm text-white truncate cursor-pointer font-Proxima-SemiBold">
                                        <span className="truncate">Forever Cartridge</span>
                                    </h6>
                                    <p className="flex items-center text-xs gap-x-1 text-secondary">
                                        sold by
                                        <div className="flex items-center gap-1 ">
                                            <BlurImage
                                                src={'/assets/images/placeholder2.png'}
                                                figClassName="flex-shrink-0 relative overflow-hidden h-3 w-3"
                                                className="rounded-lg"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                            <div className="w-[5rem]  flex items-center truncate gap-2">
                                                <h6 className="text-xs text-white truncate cursor-pointer font-Proxima-SemiBold">
                                                    @rainbow112
                                                </h6>
                                            </div>
                                        </div>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end w-1/3">
                                <h6 className="text-base text-white font-Proxima-SemiBold">1.2 ETH</h6>
                                <h6 className="text-xs text-secondary">10h ago</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExternalCollectionsModule;
