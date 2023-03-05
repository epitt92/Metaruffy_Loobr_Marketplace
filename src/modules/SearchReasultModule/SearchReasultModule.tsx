import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Loader from '../../components/loader/Loader';

import MainCard from '../../components/maincard/MainCard';
import blockchains from '../../contractsData/blockchains';
import { homeService } from '../../services/home.service';
import SelectBlockchain from '../CreateItemModule/components/SelectBlockchain';
import { ChanisData } from '../MarketPlaceModule/component/ChainsData';
import ToggleDisclosure from '../MarketPlaceModule/component/ToggleDisclosure';

const SearchReasultModule = () => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const router = useRouter();
    const query = router.query;
    const initFetch = useRef(false);
    const [selectedBlockchain, setBloackchain] = useState<any>(ChanisData[1].value || query?.chain);

    useEffect(() => {
        const getSearchNFT = async () => {
            setLoading(true);
            try {
                const res = await homeService.searchExternalCollection(query);
                setResult(res?.data?.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };

        if (Object.keys(query).length > 0) {
            getSearchNFT();
        }

        return () => {};
    }, [query]);

    useEffect(() => {
        if (selectedBlockchain && initFetch.current) {
            router.push(`/searchnft?chain=${selectedBlockchain}&query=${query?.query}`, undefined, { shallow: true });
        }
        initFetch.current = true;
        return () => {};
    }, [selectedBlockchain]);

    // main return
    return (
        <div className=" container lg:pt-[9.5rem] pt-12  pb-[98px] min-h-screen">
            <div className="lg:flex gap-10 ">
                <div className="w-[20%] ">
                    <div className="lg:hidden block">
                        <SelectBlockchain data={blockchains} onSelect={setBloackchain} selected={selectedBlockchain} />
                    </div>

                    <div className="border border-[#2B2B35] rounded-3xl px-4 py-6 lg:block hidden ">
                        <ToggleDisclosure heading="Chains" close={false}>
                            <div className="max-h-[380px]   overflow-y-auto AtScroll at-sidebarwrapper">
                                {ChanisData.map((item, i) => (
                                    <div className="flex items-center mb-2.5 Atcheckbox " key={i}>
                                        <label className="h-[25px] w-[25px]  cursor-pointer">
                                            <input
                                                disabled={!(i == 0 || i == 1 || i == 2 || i == 3)}
                                                id={item?.value}
                                                type="checkbox"
                                                className={` `}
                                                name="blockchain"
                                                value={item?.value}
                                                checked={selectedBlockchain == item?.value}
                                                onChange={(e: any) => setBloackchain(e.target.value)}
                                            />
                                            <span></span>
                                        </label>
                                        <label
                                            htmlFor=""
                                            className="text-base text-white ml-2.5 font-Circular-Book flex items-center">
                                            <img className="mr-2" src={item.src} alt="" />
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </ToggleDisclosure>
                    </div>
                </div>
                <div className="w-[80%] lg:mt-0 mt-12 ">
                    <h5 className=" font-Proxima-Bold text-2xl text-white">
                        Search results for “{query?.query ? query?.query : ''}”
                    </h5>
                    {loading && (
                        <div className="flex-center">
                            {' '}
                            <Loader width="w-full" heigth="h-full" />{' '}
                        </div>
                    )}
                    <div className=" grid lg:grid-cols-3 sm:grid-cols-2  mb-10    gap-7 lg:gap-10">
                        {loading ||
                            (result?.length > 0 &&
                                result?.map((item: any, i: number) => (
                                    <MainCard key={item?.tokenId} where="nft" listing={null} nft={item} />
                                )))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchReasultModule;
