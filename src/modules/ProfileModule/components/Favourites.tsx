import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../hooks/useMetaMask';
import { homeService } from '../../../services/home.service';

type Props = {};

const Favourites = (props: Props) => {
    const { account }: any = useMetaMask();

    const [liked, setLiked] = useState<any>();
    // const [loading, setLoading] = useState<Boolean>(false);

    const user = useSelector((state: any) => state.auth.user);
    // @ts-ignore
    const { data, isLoading } = useQuery(
        ['tokens', user?.userId],
        () => homeService.getLikedNfts({ userId: user?.userId }),
        {
            enabled: Boolean(user?.userId),
            refetchOnMount: false,
            staleTime: 1000 * 60 * 60
        }
    );
    console.log(data);

    // const { isSuccess, data: pokemon, isLoading, isError } = useQuery(
    //     ["getPokemon", pokemonID],
    //     () => fetchPokemon(pokemonID),
    //     {
    //       enabled: pokemonID.length > 0
    //     }
    //   );
    // const {
    //     isSuccess,
    //     data: pokemon,
    //     isLoading,
    //     isError
    // } = useQuery(['getPokemon'], () => fetchPokemon({ userId: user?._id }), {
    //     enabled: pokemonID.length > 0
    // });

    // const getLikesListing = async () => {
    //     // setLoading(true);
    //     // let res = await homeService.getLikedNfts({ userId: user?.userId });
    //     setLiked(data?.data?.data);
    //     // setLoading(false);
    // };

    // useEffect(() => {
    //     // user && getLikesListing();
    // }, [user]);

    return (
        <div>
            <div>
                {isLoading ? (
                    <div className="flex justify-center mt-12">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {!isEmpty(data?.data?.data) ? (
                            <div className="grid  xl:grid-cols-3   w-full  sm:grid-cols-2  gap-10">
                                {data?.data?.data?.map((item: any, i: number) => (
                                    <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                                ))}
                            </div>
                        ) : (
                            <div>
                                <Notfounditem
                                    title="No favourite items"
                                    desc="Explore our marketplace and start liking items"
                                    buttonText="Go to Marketplace "
                                    buttonLink="/marketplace"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Favourites;
