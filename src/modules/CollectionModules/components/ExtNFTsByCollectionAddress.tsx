import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfound from '../../../components/notfound/notfound';
import { CollectionContext } from '../CollectionByAddressModule';
import debounce from 'lodash.debounce';
import { useInfiniteQuery } from 'react-query';
import { collectionService } from '../../../services/collectios.service';

type Props = {
    address: string;
    collection: any;
    setImage?: Function;
};

const ExternalNFTsByCollectionAddress = ({ address, collection }: Props) => {
    const [nftsLoading, setNftLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [nfts, setNfts] = useState<any>(null);
    const [loadMore, setLoadMore] = useState(false);
    const { nft, setNFT, image, setImage }: any = useContext(CollectionContext);
    const [search, setSearch] = useState<any>('');

    const { isLoading, isError, error, data, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
        ['tokens', page, collection?.chain, address, search],
        ({ pageParam }) =>
            collectionService.getExtNFTs(address, {
                keyword: search,
                page: page,
                pageSize: 12,
                chain: collection?.chain,
                next: pageParam?.next
            }),
        {
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.data?.data?.next) {
                    loadMore && setLoadMore(false);
                }
                if (lastPage?.data?.data?.next) {
                    !loadMore && setLoadMore(true);
                }
                return { page: page + 1, next: lastPage?.data?.data?.next };
            },

            enabled: Boolean(address),
            retry: false,
            // enabled: true,
            // keepPreviousData: true,
            refetchOnMount: false,
            // refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            // keepPreviousData: Boolean(search || address),
            keepPreviousData: true,
            staleTime: 3600 * 60 * 60
        }
    );
    console.log(data, 'datadata');

    // Stop the invocation of the debounced function
    // after unmounting
    useEffect(() => {
        return () => {
            debouncedEventHandler.cancel();
        };
    }, []);

    // useEffect(() => {
    //     page !== 1 && setPage(1);
    // }, [address]);
    console.log(collection, 'collect');

    // const collection = useSelector((state: any) => state.collections.collection);

    const router = useRouter();
    // const { address }: any = router.query;

    // useEffect(() => {
    //     const filters = {
    //         keyword: search,
    //         page: page,
    //         pageSize: 12,
    //         chain: collection?.chain,
    //         ...(nfts?.next && page !== 1 && { next: nfts?.next })
    //     };
    //     if (address && collection) {
    //         setImage && setImage('');
    //         // fetchNfts(address, filters);
    //         // if (collection?.chain == 'BSC' || collection?.chain == 'MATIC') {
    //         //     fetchAlchemyNfts(address, filters);
    //         // } else {
    //         //     fetchNfts(address, filters);
    //         // }
    //     }
    // }, [address, page, collection, search]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // if (event.target.name === 'search') {
        //     page != 1 && setPage(1);
        // }

        setSearch(event.target.value);
    };

    const debouncedEventHandler = useMemo(() => debounce(handleChange, 1000), [search]);

    // const fetchNfts = useCallback(
    //     async (address: string, filters: any) => {
    //         try {
    //             setNftLoading(true);
    //             const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/external/nfts/${address}`, {
    //                 params: filters
    //             });
    //             console.log(page);
    //             console.log(res.data, 'ass');

    //             if (page > 1) {
    //                 setNfts({ ...res.data.data, tokens: [...nfts?.tokens, ...res?.data?.data?.tokens] });
    //             } else {
    //                 setNfts(res.data.data);
    //                 if (!isEmpty(res?.data?.data?.tokens)) {
    //                     setImage(res?.data?.data?.tokens[0]?.image);
    //                     setNFT(res?.data?.data?.tokens[0]);
    //                 } else {
    //                     setImage('');
    //                 }
    //             }

    //             setNftLoading(false);
    //         } catch (error) {
    //             setNftLoading(false);
    //         }
    //     },
    //     [page, search, address]
    // );

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    return (
        <div key={address}>
            {collection?.chain == 'ETH' && (
                <div className="flex items-center justify-between mb-5 ">
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
                            // value={search}
                            placeholder="Search Token Id"
                            onChange={debouncedEventHandler}
                        />
                    </div>
                </div>
            )}

            {page == 1 && isLoading ? (
                <Loader />
            ) : !isEmpty(data?.pages[0]?.data?.data?.tokens) ? (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10">
                    {data?.pages.map((page) =>
                        page?.data?.data?.tokens?.map((item: any) => (
                            <MainCard
                                key={item?._id}
                                listing={item?.listing}
                                where={'nft'}
                                nft={{ ...item, image: item?.imageUrl || item?.image, collectionId: collection?._id }}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div>
                    <Notfound />
                </div>
            )}

            {loadMore && (
                <div className="flex items-center">
                    <Button
                        disabled={isFetchingNextPage}
                        isLoading={isFetchingNextPage}
                        className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                        onClick={fetchNextPage}>
                        Load More
                    </Button>
                </div>
            )}

            {/* {nfts?.total > page && (
                <div className="flex items-center">
                    <Button
                        disabled={nftsLoading}
                        isLoading={nftsLoading}
                        className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                        onClick={handleLoadMore}>
                        Load More
                    </Button>
                </div>
            )} */}
        </div>
    );
};

export default ExternalNFTsByCollectionAddress;
