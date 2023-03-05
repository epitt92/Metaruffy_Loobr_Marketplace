import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../../components/Button/Button';
import ImageComponent from '../../../../components/Image/ImageComponent';
import Loader from '../../../../components/loader/Loader';
import Notfound from '../../../../components/notfound/notfound';
import Notfounditem from '../../../../components/notfounditems/notfounditem';
import { TRANSFORMATION_NAMES } from '../../../../constants/enums';
import useMetaMask from '../../../../hooks/useMetaMask';
import { getMYOwnNft } from '../../../../redux/user/actions';
import { GET_NFT } from '../../../../redux/user/actionTypes';
import { fetchImage } from '../../../../utils/functions';
import SmallContentView from './SmallContentView';

type Props = {};

const Minted = (props: Props) => {
    const { account }: any = useMetaMask();
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [tokens, setTokens] = useState<any>([]);

    const nfts = useSelector((state: any) => state.user.AllNFT);
    const loading = useSelector((state: any) => state.user.allNFTLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        const filters = { filter: 'MINTED', page, pageSize: 12 };
        dispatch(getMYOwnNft(filters, account));
        () => {
            dispatch({ type: GET_NFT, payload: null });
        };
    }, [page]);

    useEffect(() => {
        if (loadMore) {
            setTokens([...tokens, ...nfts?.tokens]);
            setLoadMore(false);
        } else {
            setTokens(nfts?.tokens);
        }
    }, [nfts]);

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    return (
        <div>
            {tokens?.map((item: any) => (
                <Link legacyBehavior
                    href={`/nft/${item?.tokenId}?contract=${item?.contractAddress}&&chain=${item?.chain}`}
                    key={item?._id}
                >
                    <a>
                        <div className="py-5 pb-5 flex gap-4 b border-t-[0] border-b-[1px] border-[#2b2b35] cursor-pointer">
                            {/* {item?.image && ( */}

                            <figure className="  ">
                                <SmallContentView nft={item} />
                            </figure>
                            {/* )} */}
                            <div className="flex justify-between w-full relative">
                                <div className=" w-full">
                                    <h5 className="text-[#FFFFFF]">{item.name}</h5>
                                    <p className="text-white">
                                        {/* <span className="text-[#89898F]">{item.name} </span> */}
                                        {item.name}
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
            {!loading && isEmpty(tokens) && <Notfounditem />}
            {loading && <Loader />}
            {!loading && nfts?.metadata?.next && (
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

export default Minted;
