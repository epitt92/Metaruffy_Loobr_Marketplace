import { Loader } from '@react-three/drei';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import MainCard from '../../../components/maincard/MainCard';
import Notfound from '../../../components/notfound/notfound';
import { getCollectionById, getNft } from '../../../redux/collections/actions';

type Props = {};

const NFTsTab = (props: Props) => {
    const [search, setSearch] = useState<any>('');

    const nfts = useSelector((state: any) => state.collections.nfts);
    const nftsLoading = useSelector((state: any) => state.collections.nftsLoading);

    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            getNft({
                collectionId: id,
                search
            })
        );
    }, [dispatch, search, id]);

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <div className="relative Atcollectionsearch w-full sm:w-[25rem]">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21 21L17 17M20 10.5C20 15.7467 15.7467 20 10.5 20C5.25329 20 1 15.7467 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <input
                        type="search"
                        name="search"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            {
                <div>
                    {nftsLoading && <Loader />}
                    {!nftsLoading && isEmpty(nfts) && <Notfound />}
                    <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10">
                        {!nftsLoading &&
                            nfts?.map((item: any, i: number) => (
                                <MainCard
                                    nft={item}
                                    key={i}
                                    listing={item?.listing}
                                    where={item?.listing ? 'listing' : 'nft'}
                                />
                            ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default NFTsTab;
