import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MainCard from '../../../components/maincard/MainCard';
import { Exploretabdata } from '../../../data/Exploretabdata';
import { useDispatch, useSelector } from 'react-redux';
import { getMarketPlace } from '../../../redux/nft/actions';
import Loader from '../../../components/loader/Loader';
import { isEmpty } from 'validate.js';
import Notfound from '../../../components/notfound/notfound';
import { homeService } from '../../../services/home.service';
import useMetaMask from '../../../hooks/useMetaMask';
const tabs = [
    { name: 'All', current: false },
    { name: 'Artwork', current: false },
    { name: 'Virtual Land', current: false },
    { name: 'RuffyWorld Assets', current: false },
    { name: 'Physical Artwork', current: false }
];
const Tab = () => {
    const { account }: any = useMetaMask();

    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const [featuredList, setfeaturedList] = useState<any>(null);
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchListing = async () => {
            setLoadingState(true);
            try {
                const params = {
                    limit: '8',
                    filter: selectedTabIdx === 0 ? [] : [tabs[selectedTabIdx].name]
                };
                const res = await homeService.exploreMarketPlace(params);
                setfeaturedList(res.data?.data);
            } catch (error) {
                // console.log('error', error);
            }
            setLoadingState(false);
        };
        fetchListing();
    }, [selectedTabIdx]);

    return (
        <>
            <div className=" flex flex-wrap items-center  gap-3 mb-14 mt-7" aria-label="Tabs">
                {tabs.map((tab, i) => (
                    <a
                        key={i}
                        className={`
                ${i === selectedTabIdx && '!bg-[#F1C94A] !text-sm gold !text-[#2B2B35]  '}
                 px-6 !py-2 cursor-pointer text-sm rounded-full borders font-montserrat-regular hover:bg-[#43434a] focus:outline-none bg-[#2B2B35] !text-white`}
                        onClick={() => setSelectedTabIdx(i)}>
                        {tab.name}
                    </a>
                ))}
            </div>

            {tabs.map((tab, key) => (
                <div key={key}>
                    {key == selectedTabIdx &&
                        (loadingState ? (
                            <div className="flex justify-center">
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {!loadingState && featuredList?.length < 1 && (
                                    <div className="flex justify-center items-center  w-[100%]">
                                        <Notfound />
                                    </div>
                                )}
                                <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-5 lg:gap-10">
                                    {!loadingState &&
                                        featuredList?.length > 0 &&
                                        featuredList?.map((item: any, i: number) => (
                                            <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                                        ))}
                                </div>
                            </>
                        ))}
                </div>
            ))}
        </>
    );
};
export default Tab;
