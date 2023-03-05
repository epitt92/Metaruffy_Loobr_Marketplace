import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import { getMarketPlace } from '../../../redux/nft/actions';
import { GET_MARKETE_PLACE } from '../../../redux/nft/actionTypes';

type Props = {
    activeTab?: number;
};

const Sold = ({ activeTab }: Props) => {
    const [loadMore, setLoadMore] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [page, setPage] = useState(1);

    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const loading = useSelector((state: any) => state.nft.marketplaceLoading);
    const user = useSelector((state: any) => state.user.user);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsMounted(true);
        const filters = {
            status: 'SOLD',
            page: page,
            userId: user?._id
        };

        user && dispatch(getMarketPlace(filters, loadMore, setLoadMore));
        () => {
            dispatch({
                type: GET_MARKETE_PLACE,
                payload: null
            });
        };
    }, [page]);

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    return (
        <div>
            {!loading && !isEmpty(marketplace?.listings) && isMounted && (
                <div className="grid xl:grid-cols-3 sm:grid-cols-2  gap-10 at-soldhide">
                    {marketplace?.listings?.map((item: any, i: number) => (
                        <MainCard key={i} listing={item} where={'listing'} nft={item.nft} />
                    ))}
                </div>
            )}
            {loading && <Loader />}
            {!loading && isEmpty(marketplace?.listings) && isMounted && (
                <div>
                    <Notfounditem />
                </div>
            )}
            {!loading && marketplace?.metadata?.totalPages > page && (
                <div className="flex items-center">
                    <Button
                        disabled={loading}
                        isLoading={loading}
                        className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                        onClick={handleLoadMore}>
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Sold;
