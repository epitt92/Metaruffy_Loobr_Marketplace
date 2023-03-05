import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../../components/Button/Button';
import Loader from '../../../../components/loader/Loader';
import Notfounditem from '../../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../../hooks/useMetaMask';
import { getMarketPlace } from '../../../../redux/nft/actions';
import { GET_MARKETE_PLACE } from '../../../../redux/nft/actionTypes';
import SmallContentView from './SmallContentView';

type Props = {};

const Sold = (props: Props) => {
    const { account }: any = useMetaMask();
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);

    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const loading = useSelector((state: any) => state.nft.marketplaceLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        const filters = {
            status: 'SOLD',
            page: page,
            address: account
        };

        account && dispatch(getMarketPlace(filters, loadMore, setLoadMore));
        () => {
            dispatch({
                type: GET_MARKETE_PLACE,
                payload: null
            });
        };
    }, [account /* activeTab */, dispatch, page]);

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    return (
        <div>
            {account &&
                marketplace?.listings?.map((item: any) => (
                    <Link legacyBehavior
                        href={`/nft/${item?.tokenId}?contract=${item?.nft?.contractAddress}&&chain=${item?.chain}`}
                        key={item?.nft?._id}>
                        <a>
                            <div className="py-5 pb-5 flex gap-4 b border-t-[0] border-b-[1px] border-[#2b2b35]">
                                {/* {item?.nft?.image && ( */}
                                <figure>
                                    <SmallContentView nft={item?.nft} />
                                </figure>
                                {/* )} */}
                                <div className="flex justify-between w-full relative">
                                    <div className=" w-full">
                                        <h5 className="text-[#FFFFFF]">{item?.nft?.name}</h5>
                                        <p className="text-white">
                                            {/* <span className="text-[#89898F]">{item.name} </span> */}
                                            {item?.nft?.name}
                                        </p>
                                        <span className="top-0 absolute right-0">
                                            {moment(item?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            {!loading && isEmpty(marketplace?.listings || account) && <Notfounditem />}
            {loading && <Loader />}
            {!loading && account && marketplace?.metadata?.totalPages > page && (
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
