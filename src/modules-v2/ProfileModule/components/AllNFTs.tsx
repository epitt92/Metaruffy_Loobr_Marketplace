import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../hooks/useMetaMask';
import { getMarketDetailsByChainId } from '../../../utils/functions';

type Props = {
    // activeTab: number;
};

const AllNFTs = ({}: Props) => {
    const { account }: any = useMetaMask();
    const { chainId }: any = useWeb3React();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loadMore, setLoadMore] = useState(false);
    const [tokens, setTokens] = useState<any>([]);
    const [rawTokens, setRawTokens] = useState<any>([]);
    const [loading, setLoading] = useState<any>(false);
    // const [next, setNext] = useState<any>(true);

    const dispatch = useDispatch();
    const chain = getMarketDetailsByChainId(chainId);

    useEffect(() => {
        fetchRawTokens();
    }, [account, chainId]);

    useEffect(() => {
        setTokens([]);
    }, [account, chainId]);

    useEffect(() => {
        chain && rawTokens.length && fetchTokens();
    }, [page, rawTokens]);

    const fetchRawTokens = async () => {
        try {
            setLoading(true);
            const res: { data: [] } = await axios.get(
                `https://lapi.renesistechdemo.com/assets/${chain?.chainName}/${account}`
            );
            setRawTokens(res?.data);
            setLoading(false);

            // setRawTokens(res?.data);
            // if (res.data.length < page * 10) {
            //     setNext(false);
            // }
            // const arr = await res?.data?.slice(page - 1, page * 10)?.map(async (element: any) => {
            //     try {
            //         const resp: any = await axios.get(
            //             element?.external_link?.replace('https://ipfs.infura.io', 'https://loobr.infura-ipfs.io')
            //         );

            //         return {
            //             image: resp.data?.image?.replace('https://ipfs.infura.io', 'https://loobr.infura-ipfs.io'),
            //             token: element?.token,
            //             owner: element?.owner,
            //             creater: element?.creator,
            //             ...resp.data
            //         };
            //     } catch (error) {
            //         console.log(error, 'error');
            //     }
            // });
            // const data = await Promise.all(arr);

            // setTokens(data);
            // setLoading(false);
        } catch (error) {
            setRawTokens([]);
            console.log(error, 'error');

            setLoading(false);
        }
    };

    const fetchTokens = async () => {
        try {
            setLoading(true);

            const ar = [...rawTokens];

            const arr = await ar?.slice((page - 1) * 10, page * pageSize)?.map(async (element: any) => {
                try {
                    if (element?.external_link?.includes('https://unmarshal.mypinata.cloud')) {
                        const resp: any = await axios.get(
                            element?.external_link?.replace(
                                'https://unmarshal.mypinata.cloud',
                                'https://bd.infura-ipfs.io'
                            )
                        );
                        let image: string = resp?.data?.image;
                        if (image?.includes('infura')) {
                            image = 'https://bd.infura-ipfs.io/ipfs/' + image.split('/')[4];
                        }
                        return {
                            image: image,
                            tokenId: element?.token_id,
                            owner: element?.owner,
                            creater: element?.creator,
                            contractAddress: element?.asset_contract,
                            ...resp.data
                        };
                    }
                    const resp: any = await axios.get(
                        element?.external_link?.replace('https://ipfs.infura.io', 'https://bd.infura-ipfs.io')
                    );

                    let image: string = resp?.data?.image;
                    if (image?.includes('infura')) {
                        image = 'https://bd.infura-ipfs.io/ipfs/' + image.split('/')[4];
                    }

                    return {
                        image: image,
                        tokenId: element?.token_id,
                        owner: element?.owner,
                        creater: element?.creator,
                        contractAddress: element?.asset_contract,
                        ...resp.data
                    };
                } catch (error) {
                    console.log(error, 'error');
                }
            });

            const data = await Promise.all(arr);

            setTokens([...tokens, ...data]);
            setLoading(false);
        } catch (error) {
            console.log(error, 'error');

            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    console.log(tokens, 'tokens');

    return (
        <div>
            {loading ? (
                <div className="flex justify-center mt-12">
                    <Loader />
                </div>
            ) : !isEmpty(tokens) ? (
                <div className="grid xl:grid-cols-3 sm:grid-cols-2  gap-10">
                    {tokens?.map((item: any, i: number) => (
                        <MainCard key={i} listing={null} where={'nft'} nft={item} />
                    ))}
                </div>
            ) : (
                <div>
                    <Notfounditem />
                </div>
            )}
            {!loading && tokens?.length < rawTokens.length && (
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

export default AllNFTs;
