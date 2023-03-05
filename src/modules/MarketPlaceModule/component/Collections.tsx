import React, { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import CollectionCardComponent from '../../../components/CollectionCard/CollectionCardComponent';
import Notfound from '../../../components/notfound/notfound';
import Skelton from '../../../components/skelton/Skelton';
import SkeltonCard from '../../../components/skelton/Skeltoncard';
import { getAllCollections } from '../../../redux/collections/actions';
import { collectionService } from '../../../services/collectios.service';
import { useInfiniteQuery } from 'react-query';
import Button from '../../../components/Button/Button';
import SkeltonCollection from '../../../components/skelton/Skeltoncollection';

type Props = {
    fromType: string;
    name: string;
    selected: any;
    chains: string[];
};

const Collections = ({ fromType, name, chains, selected }: Props) => {
    const [page, setPage] = useState<any>(1);
    const [loadMore, setLoadMore] = useState(false);
    const collections = useSelector((state: any) => state.collections.collections);
    const loading = useSelector((state: any) => state.collections.collectionsLoading);

    const { isLoading, isError, error, data, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
        ['collections-market', page, name, chains, selected],
        ({ pageParam }) =>
            collectionService.getAllCollections({
                search: name,
                blockchains: chains,
                page: pageParam?.page,
                pageSize: 15,
                sortBy: selected?.order
                // sortType: selected.value
            }),
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage?.data?.data?.totalPages > page) {
                    !loadMore && setLoadMore(true);
                } else if (lastPage?.data?.data?.totalPages <= page) {
                    loadMore && setLoadMore(false);
                }
                return { page: lastPage?.data?.data?.page + 1 };
            },
            enabled: true,
            keepPreviousData: true,
            staleTime: 3600 * 60,
            refetchInterval: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false
        }
    );

    useEffect(() => {
        page !== 1 && setPage(1);
    }, [selected?.order]);

    const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: loadMore,
        onLoadMore: fetchNextPage,
        rootMargin: '0px 0px 300px 0px'

        // disabled: false
    });

    return (
        <div>
            <div className={`grid lg:grid-cols-3 sm:grid-cols-2  mb-10     gap-7 lg:gap-10 `}>
                {!(!isFetchingNextPage && isFetching) &&
                    data?.pages.map((page) =>
                        page?.data?.data?.collections?.map((item: any, i: number) => (
                            <div key={item?._id}>
                                <CollectionCardComponent data={item} />
                            </div>
                        ))
                    )}
            </div>
            {(isLoading || isFetching) && (
                <div className="grid lg:grid-cols-3 sm:grid-cols-2  mb-10     gap-7 lg:gap-10">
                    {Array(3)
                        .fill('')
                        .map((item, i) => (
                            // eslint-disable-next-line react/jsx-key
                            <SkeltonCollection key={i} />
                        ))}
                </div>
            )}
            {!isLoading && isEmpty(isEmpty(data?.pages[0]?.data?.data?.content)) && (
                <div className="flex justify-center w-full ">
                    {' '}
                    <Notfound />
                </div>
            )}
            {loadMore && <div ref={sentryRef}></div>}
        </div>
    );
};

export default Collections;
