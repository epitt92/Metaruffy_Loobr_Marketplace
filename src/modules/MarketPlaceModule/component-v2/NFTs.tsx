import React, { useEffect, useState } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import CollectionCardComponent from '../../../components/CollectionCard/CollectionCardComponent';
import Notfound from '../../../components/notfound/notfound';
import Skelton from '../../../components/skelton/Skelton';
import SkeltonCard from '../../../components/skelton/Skeltoncard';
import { getAllCollections } from '../../../redux/collections/actions';

type Props = {
    fromType: string;
};

const Collections = ({ fromType }: Props) => {
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const collections = useSelector((state: any) => state.collections.collections);
    const loading = useSelector((state: any) => state.collections.collectionsLoading);

    const dispatch = useDispatch();
    useEffect(() => {
        const filters = {
            // userId: user?.userId,
            page: page,
            pageSize: 20
        };
        fromType == 'collection' && dispatch(getAllCollections(filters));
    }, [fromType, page]);

    const hasMoreItem = () => {
        return collections?.metadata?.totalPages > page;
    };

    const handleLoadMore = () => {
        if (loading) {
            return;
        }
        setLoadMore(true);
        setPage(page + 1);
    };

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMoreItem(),
        onLoadMore: handleLoadMore,
        rootMargin: '0px 0px 1000px 0px'
    });

    return (
        <div>
            <div className={`grid lg:grid-cols-3 sm:grid-cols-2  mb-10    gap-7 lg:gap-10`}>
                {collections &&
                    collections?.collections?.length > 0 &&
                    collections?.collections?.map((item: any) => (
                        <CollectionCardComponent key={item?._id} data={item} /* size */ />
                    ))}
            </div>
            {loading && (
                <div className="grid lg:grid-cols-3 sm:grid-cols-2  mb-10     gap-7 lg:gap-10`">
                    {Array(3).map((item, i) => (
                        // eslint-disable-next-line react/jsx-key
                        <Skelton key={i} />
                    ))}
                </div>
            )}
            {!loading && isEmpty(collections?.collections) && (
                <div className="flex justify-center w-full ">
                    {' '}
                    <Notfound />
                </div>
            )}
            {hasMoreItem() && <div ref={sentryRef}></div>}
        </div>
    );
};

export default Collections;
