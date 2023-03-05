import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../hooks/useMetaMask';
import { homeService } from '../../../services/home.service';

type Props = {};

const Favourite = (props: Props) => {
    const { account }: any = useMetaMask();

    const [liked, setLiked] = useState<any>();
    const [loading, setLoading] = useState<Boolean>(false);
    const user = useSelector((state: any) => state.user.user);

    // const router = useRouter();
    // const { id } = router.query;

    const getLikesListing = async () => {
        setLoading(true);
        let res = await homeService.getLikedNfts({ userId: user?._id });
        setLiked(res.data.data);
        setLoading(false);
    };

    useEffect(() => {
        user && getLikesListing();
    }, [user]);

    return (
        <div>
            <div>
                {loading ? (
                    <div className="flex justify-center mt-12">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {!isEmpty(liked) ? (
                            <div className="grid  xl:grid-cols-3   w-full  sm:grid-cols-2  gap-10">
                                {liked?.map((item: any, i: number) => (
                                    <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                                ))}
                            </div>
                        ) : (
                            <Notfounditem />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Favourite;
