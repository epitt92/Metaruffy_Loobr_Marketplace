import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ChoseNftCard from '../maincard/ChoseNftCard';
import useMetaMask from '../../hooks/useMetaMask';
import { getNftListingLocal } from '../../redux/nft/actions';
import Loader from '../../components/loader/Loader';
import Notfounditem from '../../components/notfounditems/notfounditem';
import { isEmpty } from 'validate.js';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import { METAMASK_POPUP } from '../../constants/enums';
interface Iprops {
    setNft: any;
    setstate: Function;
    setData?: Function;
}
const Choosenft = ({ setNft, setstate, setData }: Iprops) => {
    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const { account }: any = useMetaMask();
    const dispatch = useDispatch();
    const listing = useSelector((state: any) => state.nft.listinglocal);
    const loading = useSelector((state: any) => state.nft.listingLoadinglocal);
    const router = useRouter();
    useEffect(() => {
        account && dispatch(getNftListingLocal({ address: account, isActive: true }));
    }, [account]);
    const { isInstalled, isActive }: any = useMetaMask();

    const handleCreate = () => {
        if (isActive) {
            router.push('/choosenft');
        } else if (!isInstalled) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
        } else if (!isActive) {
            setstate(7);
            setData && setData({ flow: METAMASK_POPUP.create });
        }
    };
    return (
        <div className="w-full sm:w-[50rem] md:w-[68.188rem] rounded-2xl p-6">
            <h3 className=" border border-b-[#2B2B35] border-transparent  text-white  py-6 ">Choose your NFT</h3>
            <div className="overflow-y-auto max-h-[70vh] lg:max-h-[80vh] at-sidebarwrapper AtScroll">
                {/* <div className=" grid 2xl:grid-cols-3 xl:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-10"> */}
                {loading ? (
                    <div className="flex justify-center mt-12">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {!isEmpty(listing) ? (
                            <div className=" grid 2xl:grid-cols-3 xl:grid-cols-2 sm:grid-cols-2 mt-6 lg:grid-cols-3 gap-7 lg:gap-10">
                                <>
                                    {listing?.map((item: any, i: number) => (
                                        <>
                                            <ChoseNftCard nft={item} key={i} onSelect={setNft} setstate={setstate} />
                                        </>
                                    ))}
                                </>
                            </div>
                        ) : (
                            // <Notfounditem
                            //     desc={"Start creating new NFT's"}
                            //     buttonText="Create NFTs"
                            //     buttonLink="/choosenft"
                            // />
                            <div className="flex justify-center items-center h-[30vh]">
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="text-white">No Items found</h2>
                                    <p className="mt-2 xl:text-xl font-Proxima-Regular">{`Start creating new NFT's`}</p>
                                    <Button
                                        onClick={() => handleCreate()}
                                        className="mt-8 !px-9 !py-4 rounded-[100px] gold">
                                        Create NFTs
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Choosenft;
