import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import blockchains from '../../../contractsData/blockchains';
import useMetaMask from '../../../hooks/useMetaMask';
import { getMYOwnNft } from '../../../redux/user/actions';
import { getMarketDetailsByChainId } from '../../../utils/functions';
import SelectBlockchain from '../../CreateItemModule/components/SelectBlockchain';

type Props = {
    activeTab: number;
};

const Created = ({ activeTab }: Props) => {
    const { chainId } = useWeb3React();
    const user = useSelector((state: any) => state.user);
    const { account }: any = useMetaMask();
    const [page, setPage] = useState<number>(1);
    const [loadMore, setLoadMore] = useState(false);
    const [tokens, setTokens] = useState<any>([]);
    const [syncLoading, setSyncLoading] = useState(false);
    const [selectedBlockchain, setBloackchain] = useState<any>(blockchains[0]);

    const nfts = useSelector((state: any) => state.user.AllNFT);
    const loading = useSelector((state: any) => state.user.allNFTLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        const filters: any = { filter: activeTab === 0 ? 'CREATOR' : 'OWNER', page, pageSize: 12 };
        if (selectedBlockchain) {
            filters.chain = selectedBlockchain?.symbol;
        }
        ((account && activeTab === 0) || activeTab === 1) && dispatch(getMYOwnNft(filters, account));
    }, [account, activeTab, dispatch, page, selectedBlockchain]);

    useEffect(() => {
        if (loadMore && page > 1) {
            setTokens([...tokens, ...nfts?.tokens]);
            setLoadMore(false);
        } else {
            setTokens(nfts?.tokens);
        }
    }, [nfts]);

    useEffect(() => {
        setTokens([]);
        !(page === 1) && setPage(1);
    }, [activeTab]);

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };
    const handleSelectBlockchain = (value: any) => {
        setBloackchain(value);
    };
    return (
        <div className=" relative">
            <h6 className="text-white mb-1.5  font-Proxima-Bold">Filter by blockchain</h6>
            <SelectBlockchain data={blockchains} onSelect={handleSelectBlockchain} selected={selectedBlockchain} />

            {!isEmpty(tokens) ? (
                <div className="grid xl:grid-cols-3 sm:grid-cols-2 mt-4  gap-10">
                    {tokens?.map((item: any, i: number) => (
                        <MainCard key={i} listing={null} where={'nft'} nft={item} />
                    ))}
                </div>
            ) : (
                !loading && (
                    <div>
                        <Notfounditem
                            title="No Items created"
                            desc="Start creating items today and list them on our marketplace"
                            buttonText="Create NFT "
                            buttonLink="/choosenft"
                        />
                    </div>
                )
            )}
            {loading && (
                <div className="flex justify-center mt-12">
                    <Loader />
                </div>
            )}
            {!loading && nfts?.metadata?.next && !isEmpty(tokens) && (
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

export default Created;
