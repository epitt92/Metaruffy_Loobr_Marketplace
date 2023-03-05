import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../../hooks/useMetaMask';
import { useRouter } from 'next/router';
import { removeFromMarkete, removeListing, unlistNft } from '../../../redux/nft/actions';
import { isEmpty } from 'validate.js';
import TableLoader from '../../../components/tableloader/TableLoader';
import Tablenotdata from '../../../components/tablenotdata/Tablenotdata';
import Button from '../../../components/Button/Button';
import Popups from '../../../components/popup/poups';
import Countdown from 'react-countdown';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { fetchImage, getMarketDetailsByAddress, getMarketDetailsByNFTAddress } from '../../../utils/functions';
import blockchains from '../../../contractsData/blockchains';
import { ethers } from 'ethers';
import marketeNFTJson from '../../../contractsData/Marketplace.json';
import ImageComponent from '../../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';

const ListingsTable = ({ listings, activeTab }: any) => {
    const dispatch = useDispatch();
    const { library, isActive, isInstalled, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [txHash, setTxHash] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [relistLoading, setRelistLoading] = useState(false);
    const loading = useSelector((state: any) => state.nft.listingsLoading);
    const unlistNftLoading = useSelector((state: any) => state.nft.unlistNftLoading);

    const data = {
        tokenId: listings && listings[activeIndex]?.nft?.tokenId,
        ...(listings && listings[activeIndex]),
        loading: unlistNftLoading,
        hash: txHash,
        setTxHash: setTxHash,
        loaderHeading: 'Unlisting NFT',
        loaderText: 'Loading',
        successHeading: 'Transaction successfull',
        switchNetwork,
        chainId,
        contractAddress: listings && listings[activeIndex]?.nft?.contractAddress
    };

    const calculateAmount = (amount: number, currency: string) => {
        const fee = currency == 'LOOBR' ? 0 : 2;
        return Number(Number(amount + (fee / 100) * amount).toFixed(4));
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

    const handleUnlist = async (listingId: string, to: string, chainName: string) => {
        if (!checkMetamask()) {
            return;
        }

        const chain: any = blockchains.find((item) => item?.symbol == chainName);
        const status = await switchNetwork(chain?.chainId);
        if (!status) {
            return;
        }

        setPopup(true);
        setState(39);
        const signer = library?.getSigner();

        dispatch(unlistNft(signer, listingId, setState, setTxHash, to));
    };

    const handleRelist = async (listingId: string, owner: string, chainName: string) => {
        try {
            setRelistLoading(true);
            if (!checkMetamask()) {
                return;
            }

            const chain: any = blockchains.find((item) => item?.symbol == chainName);
            const status = await switchNetwork(chain?.chainId);
            if (!status) {
                return;
            }
            const signer = library?.getSigner();
            const contract = new ethers.Contract(owner, marketeNFTJson.abi, signer);
            const transaction = await contract.removeListing(listingId);

            let tx = await transaction.wait();
            let hash = tx.transactionHash;

            setPopup(true);
            setState(24);

            // dispatch(removeListing(listingId));
            // dispatch(removeFromMarkete(listingId));
            // dispatch(unlistNftLoading(false));
            setRelistLoading(false);
        } catch (error) {
            setRelistLoading(false);
            console.log(error);
        }
    };

    const isExpired = (startTime: number, duration: number) => {
        if (duration == 0 || startTime == 0) {
            return false;
        }
        const time = new Date((Number(startTime) + Number(duration)) * 1000).getTime();
        return time < new Date().getTime() ? true : false;
    };

    const handleSubmit = (listing: any, index: number) => {
        setActiveIndex(index);
        // handleRelist(listing?.listingId, listing?.to, listing?.chain);
        isExpired(listing.startTime, listing.duration)
            ? handleRelist(listing?.listingId, listing?.to, listing?.chain)
            : handleUnlist(listing?.listingId, listing?.to, listing?.chain);
    };

    return (
        <div className="relative w-full">
            <div className=" overflow-x-auto max-w-[100%]  rounded-lg border border-[#2B2B35] ">
                <table className="min-w-full order-table ">
                    <thead>
                        <tr>
                            <th className="text-white pr-7">NFT</th>
                            <th className="text-white px-7">Title</th>
                            {activeTab === 0 ? (
                                <>
                                    <th className="text-white whitespace-nowrap px-7">Price/Min Bid</th>
                                    <th className="text-white px-7">Type</th>
                                    <th className="text-white px-7 whitespace-nowrap">End Time</th>
                                </>
                            ) : activeTab === 1 ? (
                                <th className="text-white px-7 whitespace-nowrap">Price</th>
                            ) : (
                                <>
                                    <th className="text-white whitespace-nowrap px-7">Min Bid</th>
                                    <th className="text-white whitespace-nowrap px-7">End Time</th>
                                </>
                            )}

                            <th className="text-white px-7 whitespace-nowrap"> Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <TableLoader />}
                        {!loading && isEmpty(listings) && <Tablenotdata />}
                        {!loading &&
                            !isEmpty(listings) &&
                            listings?.map((item: any, i: number) => (
                                <>
                                    <tr className="border border-[#2B2B35] " key={i}>
                                        <td className=" p-3">
                                            <div className="flex items-center pr-7 whitespace-nowrap">
                                                {/* eslint-disable-next-line @next/next/link-passhref */}
                                                <Link legacyBehavior href={`/listings/${item?.listingId}`}>
                                                    <figure className="rounded-lg cursor-pointer  relative  w-[56px] h-[56px] flex-shrink-0">
                                                        {/* {item?.nft?.image && ( */}
                                                        <ImageComponent
                                                            // width="60"
                                                            // height="60"
                                                            objectFit="cover"
                                                            layout="fill"
                                                            alt=""
                                                            src={item?.nft?.image}
                                                            defaultPlaceholder={'/assets/images/main-place.jpg'}
                                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                            className="rounded-lg bg-[#c9cdd3] "
                                                        />
                                                        {/* )} */}
                                                    </figure>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="">
                                            <span className="text-[#C0B6B6] text-lg  px-7 whitespace-nowrap">
                                                {(item?.nft?.name).includes(item?.nft?.tokenId)
                                                    ? item?.nft?.name
                                                    : `${item?.nft?.name} #${item?.nft?.tokenId}`}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-lg px-7 whitespace-nowrap ">
                                                {item?.sellMode === '1'
                                                    ? Number(Number(item?.price).toFixed(4)).toLocaleString()
                                                    : Number(
                                                          calculateAmount(item?.price, item?.currency)
                                                      ).toLocaleString()}

                                                <i className="inline-block align-top ml-2 ">
                                                    {' '}
                                                    {item?.currency == 'LOOBR' ? (
                                                        <Image
                                                            src={'/assets/images/loobricon.svg'}
                                                            width="25"
                                                            height="25"
                                                        />
                                                    ) : (
                                                        item?.currency
                                                    )}
                                                </i>
                                            </span>
                                        </td>
                                        {activeTab === 0 && (
                                            <td>
                                                <span className="text-lg px-7 whitespace-nowrap ">
                                                    {item?.sellMode === '1' ? 'Timed Auction' : 'Fixed Price'}
                                                </span>
                                            </td>
                                        )}
                                        {(activeTab === 0 || activeTab === 2) && (
                                            <td>
                                                <span className="text-lg relative w-[100px] block px-7 whitespace-nowrap">
                                                    <Countdown
                                                        className={
                                                            isExpired(item.startTime, item.duration)
                                                                ? 'text-red-500'
                                                                : ''
                                                        }
                                                        date={
                                                            new Date(Number(item?.startTime) * 1000).getTime() +
                                                            item?.duration * 1000
                                                        }
                                                    />
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-7">
                                            <Button
                                                className={`inline-block text-sm font-montserrat-regular !px-6 !py-2  rounded-full border border-themecolor bg-transparent text-themecolor hover:bg-themecolor hover:text-black`}
                                                onClick={
                                                    (e: any) => handleSubmit(item, i)
                                                    // handleUnlist(item?.listingId, item?.to, i, item?.chain)
                                                }
                                                disabled={unlistNftLoading}
                                                isLoading={
                                                    (unlistNftLoading && i === activeIndex) ||
                                                    (relistLoading && i == activeIndex)
                                                }>
                                                {/* Relist */}
                                                {isExpired(item?.startTime, item?.duration) ? 'Relist' : 'Unlist'}
                                            </Button>
                                        </td>
                                    </tr>
                                </>
                            ))}
                    </tbody>
                </table>
            </div>
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={data} />}
        </div>
    );
};

export default ListingsTable;
