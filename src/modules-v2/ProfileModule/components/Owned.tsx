import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Avalanche from '../../../components/icons/AvalancheIcon';
import BscIcon from '../../../components/icons/BscIcon';
import CardanoIcon from '../../../components/icons/CardanoIcon';
import EthIcon from '../../../components/icons/EthIcon';
import PolygonIcon from '../../../components/icons/PolygonIcon';
import SolanaIcon from '../../../components/icons/SolanaIcon';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import Select from '../../../components/select/Select';
import blockchains from '../../../contractsData/blockchains';
import useMetaMask from '../../../hooks/useMetaMask';
import { getMYOwnNft } from '../../../redux/user/actions';
import { getMarketDetailsByChainId } from '../../../utils/functions';
import SelectBlockchain from '../../CreateItemModule/components/SelectBlockchain';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { marketPlaceService } from '../../../services/marketplace.service';

type Props = {
    activeTab: number;
};
const sortdata = [
    { id: 0, name: 'Sort by' },
    { id: 1, name: 'Newest To Oldest', value: 'createdAt', order: -1 },
    { id: 2, name: 'Oldest To Newest', value: 'createdAt', order: 1 }
];

const Owned = ({ activeTab }: Props) => {
    const { account }: any = useMetaMask();
    const [page, setPage] = useState<number>(1);
    const [loadMore, setLoadMore] = useState(false);
    const [selectedBlockchain, setBloackchain] = useState<any>(blockchains[0]);
    const [selected, setSelected] = useState(sortdata[0]);

    const { isLoading, isError, error, data, fetchNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
        ['content', page, selectedBlockchain?.symbol],
        ({ pageParam }) =>
            marketPlaceService.getOwnedTokens(account, {
                page,
                pageSize: 12,
                chain: selectedBlockchain?.symbol,
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

            // enabled: Boolean(user?.userId),
            enabled: true,
            // keepPreviousData: true,
            // refetchOnMount: false,
            keepPreviousData: true,
            staleTime: 5000
        }
    );

    const handleSelectSort = (values: any) => {
        page != 1 && setPage(1);
        setSelected(values);
    };

    const handleSelectBlockchain = (value: any) => {
        setBloackchain(value);
    };

    return (
        <div className="relative">
            <div className="flex flex-row items-center justify-between xs:gap-8 xs:flex-col xs:items-start">
                <div>
                    <h6 className="text-white mb-1.5  font-Proxima-Bold">Filter by blockchain</h6>
                    <SelectBlockchain
                        data={blockchains}
                        onSelect={handleSelectBlockchain}
                        selected={selectedBlockchain}
                    />
                </div>
                <Select
                    className="rounded-[50px]  cursor-pointer  "
                    style="!w-[220px] xs:!w-full !m-0 cursor-pointer"
                    data={sortdata}
                    selected={selected}
                    onSelect={handleSelectSort}
                    sortByIcon
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center mt-12">
                    <Loader />
                </div>
            ) : !isEmpty(data?.pages[0]?.data?.data?.content) ? (
                <div className="grid gap-10 mt-4 xl:grid-cols-3 sm:grid-cols-2">
                    {data?.pages.map((page) =>
                        page?.data?.data?.content?.map((item: any, i: number) => (
                            <MainCard key={i} listing={null} where={'nft'} nft={item} />
                        ))
                    )}
                </div>
            ) : (
                !isLoading && (
                    <div>
                        <Notfounditem
                            title="No Items owned"
                            desc="Start buying items today from our marketplace"
                            buttonText="Go to Marketplace "
                            buttonLink="/marketplace"
                        />
                    </div>
                )
            )}

            {loadMore && (
                <div className="flex items-center">
                    <Button
                        disabled={isLoading}
                        isLoading={isLoading}
                        className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                        onClick={fetchNextPage}>
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Owned;
