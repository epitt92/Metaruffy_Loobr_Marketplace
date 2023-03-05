import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../hooks/useMetaMask';
import { getMYOwnNft, getUserById } from '../../../redux/user/actions';

type Props = {
    activeTab?: number;
};

const Owned = ({ activeTab }: Props) => {
    const { account }: any = useMetaMask();
    const router = useRouter();
    const { id } = router.query;

    const nfts = useSelector((state: any) => state.user.AllNFT);
    const loading = useSelector((state: any) => state.user.allNFTLoading);
    const user = useSelector((state: any) => state.user.user);
    const userLoading = useSelector((state: any) => state.user.userLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        const filters = { filter: 'OWNER' };
        user && dispatch(getMYOwnNft(filters, user?.wallets[0]?.address));
    }, [dispatch]);

    // useEffect(() => {
    //     id && dispatch(getUserById(id, true));
    // }, [dispatch, id]);

    return (
        <div>
            {loading ? (
                <div className="flex justify-center mt-12">
                    <Loader />
                </div>
            ) : !isEmpty(nfts) ? (
                <div className="grid xl:grid-cols-3 sm:grid-cols-2  gap-10">
                    {nfts?.map((item: any, i: number) => (
                        <MainCard nft={item} key={i} listing={null} where={'nft'} />
                    ))}
                </div>
            ) : (
                <div>
                    <Notfounditem />
                </div>
            )}
        </div>
    );
};

export default Owned;
