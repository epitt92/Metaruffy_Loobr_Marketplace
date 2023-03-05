import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../hooks/useMetaMask';
import { useRouter } from 'next/router';
import { claimNft, getActiveBiddings } from '../../redux/nft/actions';
import Button from '../Button/Button';
import Popups from '../popup/poups';
import TableLoader from '../tableloader/TableLoader';
import { isEmpty } from 'validate.js';
import Tablenotdata from '../tablenotdata/Tablenotdata';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { fetchImage, getMarketDetailsByAddress, getMarketDetailsByNFTAddress } from '../../utils/functions';
import blockchains from '../../contractsData/blockchains';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import SmallContentView from '../../modules/ProfileModule/components/activity/SmallContentView';
import Notfounditem from '../notfounditems/notfounditem';

export const Activebidding = () => {
    const dispatch = useDispatch();
    const { account, library, isActive, isInstalled, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [txHash, setTxHash] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const router = useRouter();
    const { address } = router.query;
    const bids = useSelector((state: any) => state.nft.activeBiddings);
    const loading = useSelector((state: any) => state.nft.activeBiddingsLoading);
    const claimNftLoading = useSelector((state: any) => state.nft.claimNftLoading);

    // const handleOnSwitchNetwork = () => {
    //     setState(-1);
    // };

    const data: any = {
        loading: claimNftLoading,
        hash: txHash,
        setTxHash: setTxHash,
        loaderHeading: 'Claim NFT',
        loaderText: 'Loading',
        successHeading: 'Transaction successfull',
        chainId,
        contractAddress: bids && bids[activeIndex]?.nft?.contractAddress
        // switchNetwork: handleOnSwitchNetwork
    };

    useEffect(() => {
        const add = router.pathname === '/profile/me' ? account : account;
        add && dispatch(getActiveBiddings(add));
    }, [account, address, dispatch, router.pathname]);

    const checkStatus = (startTime: number, duration: number) => {
        const time = new Date((Number(startTime) + Number(duration)) * 1000).getTime();

        return time < new Date().getTime() ? false : true;
    };

    const checkMetamask = () => {
        if (isActive) {
            return true;
        } else if (!isInstalled && window.innerWidth > 480) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
            return false;
        } else if (!isActive) {
            setPopup(true);
            setState(7);
            return false;
        }
    };

    // const handleSwitchNetwork = async (contractAddress: string) => {
    //     const contracts = getMarketDetailsByNFTAddress(contractAddress);
    //     const chain = contracts ? contracts?.chainId : undefined;

    //     if (!contracts) {
    //         toast.error('This chain does not supported.');
    //         return false;
    //     } else if (chain == chainId) {
    //         return true;
    //     } else {
    //         setPopup(true);
    //         setState(64);
    //         return false;
    //     }
    // };

    const handleClaim = async (
        e: React.ChangeEvent<HTMLInputElement>,
        biddingId: string,
        price: number,
        index: number,
        contractAddress: string,
        chainName: string
    ) => {
        e.preventDefault();
        if (!checkMetamask()) {
            return;
        }
        setActiveIndex(index);

        const chain = blockchains.find((item) => item?.symbol == chainName);
        const status = await switchNetwork(chain?.chainId);
        if (!status) {
            return;
        }
        const signer = library?.getSigner();
        const blockchain = getMarketDetailsByAddress(contractAddress);

        dispatch(
            claimNft(signer, biddingId, price, account, contractAddress, blockchain?.tokenAddress, blockchain?.native)
        );
    };

    const handleSymbols = (contractAddress: string) => {
        const blockchain = getMarketDetailsByNFTAddress(contractAddress);
        return blockchain?.native ? blockchain?.nativeCurrency : blockchain?.tokenSymbol;
    };

    return (
        <div className="  relative">
            <h2 className="text-[#FFFFFF] mb-6 font-Proxima-Regular  text-[1.75rem]">Active Bids</h2>
            <div className="overflow-hidden overflow-x-auto max-w-[100%]  rounded-lg border border-[#2B2B35] ">
                {loading ? (
                    <div className="flex items-center justify-center">
                        {' '}
                        <TableLoader />
                    </div>
                ) : (
                    <>
                        {!loading && isEmpty(bids) ? (
                            <Notfounditem
                                title="No active bids"
                                desc="Explore our marketplace and start placing bids"
                                buttonText="Go to Marketplace "
                                buttonLink="/marketplace"
                            />
                        ) : (
                            <table className="min-w-full order-table ">
                                <thead>
                                    <tr>
                                        <th className="text-white pr-7">NFT</th>
                                        <th className="text-white px-7">Title</th>
                                        <th className="text-white px-7">price</th>
                                        <th className="text-white px-7">Token ID</th>
                                        <th className="text-white px-7">Bid amount </th>
                                        <th className="text-white px-7">Status</th>
                                        <th className="text-white px-7"> Claim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading &&
                                        bids &&
                                        bids?.map((item: any, i: number) => (
                                            <>
                                                <tr className="border border-[#2B2B35] " key={i}>
                                                    <td className=" p-3 pr-7">
                                                        <div className="flex items-center">
                                                            {/* eslint-disable-next-line @next/next/link-passhref */}
                                                            <Link legacyBehavior href={`/listings/${item?.listingId}`}>
                                                                <figure className="rounded-lg  w-[56px] h-[56px] cursor-pointer ">
                                                                    <SmallContentView
                                                                        nft={item?.nft}
                                                                        dimentions={{ w: 60, h: 60 }}
                                                                    />
                                                                </figure>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className="">
                                                        <span className="text-[#C0B6B6] text-lg px-7">
                                                            {item?.nft?.name}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-lg  px-7">
                                                            {Number(
                                                                Number(item?.listing?.price).toFixed(4)
                                                            ).toLocaleString()}{' '}
                                                            <i className="inline-block align-top ml-2 ">
                                                                {/* {item?.listing?.currency?} */}
                                                                {item?.listing?.currency == 'LOOBR' ? (
                                                                    <Image
                                                                        src={'/assets/images/loobricon.svg'}
                                                                        width="25"
                                                                        height="25"
                                                                    />
                                                                ) : (
                                                                    item?.listing?.currency
                                                                )}
                                                            </i>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-lg  px-7">{item?.nft?.tokenId}</span>
                                                    </td>
                                                    <td>
                                                        <span className="text-lg px-7">
                                                            {Number(
                                                                Number(item?.listing?.price).toFixed(4)
                                                            ).toLocaleString()}{' '}
                                                            <i className="inline-block align-top ml-2 ">
                                                                {/* {item?.listing?.currency} */}
                                                                {item?.listing?.currency == 'LOOBR' ? (
                                                                    <Image
                                                                        src={'/assets/images/loobricon.svg'}
                                                                        width="25"
                                                                        height="25"
                                                                    />
                                                                ) : (
                                                                    item?.listing?.currency
                                                                )}
                                                            </i>
                                                        </span>
                                                    </td>
                                                    <td className="px-7">{item.canClaim ? 'Ended' : 'Live'}</td>
                                                    <td className="px-7">
                                                        <Button
                                                            className={`text-black inline-block text-sm font-montserrat-regular !px-6 !py-2  rounded-full    bg-themecolor gold`}
                                                            onClick={(e: any) =>
                                                                handleClaim(
                                                                    e,
                                                                    item?.biddingId,
                                                                    item?.price,
                                                                    i,
                                                                    item?.contractAddress,
                                                                    item?.chain
                                                                )
                                                            }
                                                            disabled={!item.canClaim || claimNftLoading}
                                                            isLoading={claimNftLoading && i === activeIndex}>
                                                            Claim Now
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={data} />}
        </div>
    );
};
