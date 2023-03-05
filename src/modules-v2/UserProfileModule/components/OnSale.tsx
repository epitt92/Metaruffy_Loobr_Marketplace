import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../hooks/useMetaMask';
import { getListingsByUserId, getNftListing } from '../../../redux/nft/actions';

type Props = {
    activeTab?: number;
};

const OnSale = ({ activeTab }: Props) => {
    const { account }: any = useMetaMask();

    const router = useRouter();

    const listing = useSelector((state: any) => state.nft.listings);
    const loading = useSelector((state: any) => state.nft.listingsLoading);
    const user = useSelector((state: any) => state.user.user);

    const dispatch = useDispatch();

    useEffect(() => {
        user && dispatch(getListingsByUserId({ isActive: true }, user?._id));
    }, [user]);

    return (
        <div>
            {loading ? (
                <Loader />
            ) : (
                <div className="grid  xl:grid-cols-3   w-full  sm:grid-cols-2  gap-10">
                    {!isEmpty(listing) ? (
                        <>
                            {listing?.map((item: any, i: number) => (
                                <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                            ))}
                        </>
                    ) : (
                        <div className="col-span-3">
                           <Notfounditem
                        title="No Items listed"
                        desc="Explore our marketplace and buy thousands of items"
                        buttonText="Go to Marketplace "
                        buttonLink="/marketplace"
                    />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OnSale;
