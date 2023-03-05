import React, { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import CollectionCardComponent from '../../../components-v2/CollectionCard/CollectionCardComponent';
import Notfound from '../../../components/notfound/notfound';
import Skelton from '../../../components/skelton/Skelton';
import SkeltonCard from '../../../components/skelton/Skeltoncard';
import { getAllCollections } from '../../../redux/collections/actions';
import { collectionService } from '../../../services/collectios.service';
import { useInfiniteQuery } from 'react-query';
import Button from '../../../components/Button/Button';
import SkeltonCollection from '../../../components/skelton/Skeltoncollection';
import axios from 'axios';
import { setRoyaltiesLoading } from '../../../redux/nft/actions';
import Carousel from './Carousel';
import { _io } from '../../../services-v2/socket.service';

type Props = {
    fromType: string;
    name: string;
    selected: any;
    chains: string[];
};

const Collections = ({ fromType, name, chains, selected }: Props) => {
    const [page, setPage] = useState<any>(1);
    const [apiFetching, setApiFetching] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [newCollections, setNewCollections] = useState(null);
    const [type, setType] = useState(false);

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
    const getTrending = async () => {
        setApiFetching(true);
        const chains = ['ETH', 'BNB', 'MATIC', 'AVAX'];
        const collections = [];
        for (let i = 0; i < chains.length; i++) {
            const res = await axios.get(`/api/statistics/collections?chain=${chains[i]}&limit=10`);
            collections.push(res.data.success ? res.data.data : null);
        }
        setNewCollections(collections);
        setApiFetching(false);
    };

    const listenSocket = () => {
        // log socket connection
        _io.on('initialize', (data: any) => {
            setNewCollections(data);
        });
        _io.on('ethchanged', (data: any) => {
            const temp: any = newCollections;
            temp[0] = data;
            setNewCollections(temp);
        });

        // log _io connection
        _io.on('bnbchanged', () => {
            const temp: any = newCollections;
            temp[1] = data;
            setNewCollections(temp);
        });
        // log _io connection
        _io.on('maticchanged', () => {
            const temp: any = newCollections;
            temp[2] = data;
            setNewCollections(temp);
        });
        // log _io connection
        _io.on('avaxchanged', () => {
            const temp: any = newCollections;
            temp[3] = data;
            setNewCollections(temp);
        });
    };
    useEffect(() => {
        // update chat on new message dispatched
        listenSocket();
        // getTrending();
        // socket disconnet onUnmount if exists
        if (_io) return () => _io.disconnect();
    }, []);
    const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: loadMore,
        onLoadMore: fetchNextPage,
        rootMargin: '0px 0px 300px 0px'

        // disabled: false
    });

    return (
        <div>
            {!apiFetching &&
                newCollections &&
                !type &&
                newCollections.map((networkItem: any, i: number) => (
                    <Carousel
                        children={networkItem?.map((item: any, i: number) => (
                            <div key={item?._id}>
                                <CollectionCardComponent data={item} />
                            </div>
                        ))}
                        count={4}
                    />
                ))}
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
