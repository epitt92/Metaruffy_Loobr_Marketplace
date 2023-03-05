import { Loader } from '@react-three/drei';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../../../components/Button/Button';
import ImageComponent from '../../../../components/Image/ImageComponent';
import Notfound from '../../../../components/notfound/notfound';
import TableLoader from '../../../../components/tableloader/TableLoader';
import Tablenotdata from '../../../../components/tablenotdata/Tablenotdata';
import useMetaMask from '../../../../hooks/useMetaMask';
import { contractsService } from '../../../../services/contracts.service';
import { offerService } from '../../../../services/offers.service';
import { toPascalCase } from '../../../../utils/functions';

const Tabs = ({ tab, tabs, onSelectTab }: any) => (
    <div className="flex items-center flex-wrap gap-4">
        {tabs.map((item: any) => (
            <div className={`activityRadio`} onClick={() => onSelectTab(item)} key={item.name}>
                <input type="radio" name="select-filter" />
                <label
                    // htmlFor="purchase"
                    className={`font-Proxima-SemiBold ${
                        tab.value === item.value ? '!bg-[#F1C94A]  gold !text-[#2B2B35]' : ''
                    }`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.5951 22.9992C10.2128 22.9079 9.82045 22.8467 9.45036 22.7209C8.22934 22.303 7.2799 21.5072 6.49075 20.5093C5.30423 19.0067 4.61636 17.2815 4.24515 15.4188C3.75764 12.9756 3.83557 10.5475 4.51342 8.14663C4.95864 6.56665 5.6543 5.10911 6.73952 3.86138C7.62997 2.83904 8.68735 2.06936 10.0436 1.78386C10.3833 1.71531 10.7288 1.67917 11.0754 1.67589C11.9152 1.66087 12.7556 1.68869 13.5954 1.66698C15.2599 1.62469 16.6296 2.27528 17.7916 3.4195C18.1121 3.73505 18.4327 4.06338 18.6876 4.43125C19.0091 4.90587 19.2984 5.40156 19.5536 5.91495C20.4523 7.6797 20.8742 9.5691 20.9755 11.5386C21.0912 13.7965 20.7646 15.9847 19.8747 18.0673C19.5825 18.7512 19.1935 19.4001 18.7956 20.0312C18.1411 21.0768 17.2092 21.9201 16.1036 22.4672C15.5773 22.7358 15.0057 22.9047 14.4179 22.9653C14.3781 22.9731 14.3392 22.9846 14.3016 22.9998L10.5951 22.9992ZM16.3752 12.3417C16.3752 12.1892 16.3791 12.0362 16.3752 11.8837C16.3713 11.7312 16.358 11.5787 16.348 11.4262C16.2433 9.80395 15.8866 8.24456 15.1726 6.77811C14.6806 5.76857 14.0506 4.86144 13.1346 4.18415C11.7989 3.19465 10.2662 3.2041 8.93501 4.20418C8.13639 4.80411 7.55371 5.58328 7.08901 6.45591C6.27426 7.98747 5.87189 9.63368 5.75335 11.3533C5.61644 13.3468 5.86466 15.2869 6.60039 17.1518C7.06565 18.3339 7.7012 19.4091 8.67568 20.2516C10.1527 21.5283 11.9108 21.5317 13.3967 20.2711C14.079 19.6923 14.5954 18.9828 15.0106 18.1975C15.9795 16.3699 16.3552 14.3975 16.3752 12.3417ZM20.1813 14.1004C20.326 12.9266 20.326 11.7396 20.1813 10.5658H18.1094V14.1004H20.1813ZM17.2629 7.00295C17.5111 7.94905 17.7582 8.88847 18.0053 9.83067H20.0806C19.9291 8.89516 19.6745 7.9793 19.3215 7.0998C19.3084 7.07521 19.2898 7.054 19.2671 7.03787C19.2444 7.02174 19.2182 7.01113 19.1907 7.00687C18.5396 6.99907 17.8879 7.00295 17.2629 7.00295ZM18.0053 14.8389C17.7554 15.7894 17.51 16.7249 17.2629 17.6666C17.8879 17.6666 18.539 17.6666 19.1907 17.6627C19.2182 17.6584 19.2444 17.6478 19.2671 17.6317C19.2898 17.6155 19.3084 17.5943 19.3215 17.5697C19.6746 16.6903 19.929 15.7744 20.08 14.8389H18.0053ZM15.9033 4.51084C16.1476 4.92378 16.3791 5.30722 16.6023 5.69512C16.7136 5.886 16.7615 6.16539 16.9229 6.25944C17.0948 6.36017 17.3681 6.29115 17.5951 6.29227C18.0404 6.29227 18.4889 6.29227 18.9686 6.29227C18.6726 5.67776 18.3076 5.09896 17.8806 4.56703C17.8413 4.53031 17.7892 4.51035 17.7354 4.51138C17.1332 4.50971 16.531 4.51084 15.9033 4.51084ZM18.982 18.429L18.9263 18.3767C18.2891 18.3767 17.6524 18.3734 17.0152 18.3828C16.9562 18.3828 16.8783 18.4552 16.8438 18.5142C16.5444 19.0195 16.2522 19.5298 15.9595 20.039C15.9403 20.0778 15.9238 20.1177 15.91 20.1587C16.4353 20.1587 16.9423 20.1381 17.446 20.1665C17.7532 20.1837 17.9469 20.0858 18.1032 19.8254C18.3832 19.354 18.687 18.8937 18.982 18.429ZM13.695 2.40104C14.2665 2.77373 14.7898 3.21541 15.2533 3.7161C15.3136 3.76806 15.3907 3.79636 15.4703 3.7957C15.8999 3.80293 16.3296 3.79958 16.7592 3.79958H17.1727C16.1498 2.86796 15.0368 2.34707 13.6939 2.40161L13.695 2.40104ZM17.1032 20.8688C16.57 20.8688 16.0363 20.8622 15.5031 20.875C15.3916 20.8807 15.2858 20.9261 15.2048 21.0029C14.7778 21.4586 14.2958 21.8596 13.7701 22.1967C13.7395 22.2162 13.7145 22.2435 13.6616 22.2869C15.0368 22.3214 16.1526 21.8027 17.102 20.8694L17.1032 20.8688Z"
                            fill={tab.value === item.value ? '#2B2B35' : '#E7E7E9'}
                        />
                        <path
                            d="M15.6752 12.1487C15.6463 14.2229 15.3474 16.0444 14.5065 17.7468C14.1414 18.487 13.6834 19.1632 13.0479 19.7013C11.7528 20.8005 10.2296 20.776 8.97019 19.6318C8.11481 18.8576 7.57887 17.877 7.18596 16.8113C6.5454 15.0649 6.34505 13.2562 6.46247 11.4069C6.56154 9.83467 6.891 8.31869 7.5989 6.89899C8.03132 6.03248 8.5834 5.25725 9.39481 4.69794C10.4222 3.98948 11.6109 3.97443 12.6527 4.66174C13.4764 5.20547 14.0318 5.97905 14.4726 6.84222C15.1215 8.11222 15.4565 9.47292 15.5951 10.8854C15.639 11.3718 15.6569 11.8582 15.6752 12.1487Z"
                            fill={tab.value === item.value ? '#2B2B35' : '#E7E7E9'}
                        />
                    </svg>
                    <span className="ml-2.5">{item?.name}</span>
                </label>
            </div>
        ))}
    </div>
);

const Offer = () => {
    const tabs = [
        {
            name: 'Offers Received',
            value: 'RECEIVED'
        },
        {
            name: 'Offers Sent',
            value: 'SENT'
        }
    ];
    const { account, library, switchNetwork }: any = useMetaMask();
    const [cancelLoading, setCancelLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [offers, setOffers] = useState<any>(null);
    const [tab, setTab] = useState<any>(tabs[0]);
    const [offersReceived, setOffersReceived] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState<any>(null);
    const [page, setPage] = useState(1);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    useEffect(() => {
        isAuthenticated && tab.value == 'SENT' && fetchOffers();
        isAuthenticated && tab.value == 'RECEIVED' && account && fetchOffersReceived();
        return () => {};
    }, [isAuthenticated, tab, account, page]);

    useEffect(() => {
        setPage(1);
    }, [tab]);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const filters = {
                page: page,
                pageSize: 10
            };
            const res = await offerService.getAllOffers(account, filters);
            if (page > 1) {
                setOffers({ ...res.data?.data, offers: [...offers?.offers, ...res.data?.data?.offers] });
            } else {
                setOffers(res.data?.data);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const fetchOffersReceived = async () => {
        try {
            setLoading(true);
            const filters = {
                page: page
            };
            const res = await offerService.getAllOffersReceivedByAddress(account, filters);
            if (page > 1) {
                setOffers({
                    ...res.data?.data,
                    offersReceived: [...offersReceived?.offers, ...res.data?.data?.offers]
                });
            } else {
                setOffersReceived(res.data?.data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);

            setLoading(false);
        }
    };

    const handleCancel = async (
        contractAddress: string,
        tokenAddress: string,
        tokenId: string,
        chainId: number,
        i: number
    ) => {
        try {
            setCancelLoading(true);
            setActiveIndex(i);

            const status = await switchNetwork(chainId);
            if (!status) {
                return;
            }
            const signer = library?.getSigner();
            const res = await contractsService.cancelOffer(contractAddress, tokenAddress, tokenId, signer);
            const arr: any = [...offers?.offers];
            arr[i].status = 'CANCELED';
            setOffers({ ...offers, offers: arr });
            toast.success('Offer cancelled');
            setCancelLoading(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
            setCancelLoading(false);
        }
    };

    const handleAccept = async (
        contractAddress: string,
        tokenAddress: string,
        tokenId: string,
        biddingId: string,
        chainId: number,
        i: number
    ) => {
        try {
            setAcceptLoading(true);
            setActiveIndex(i);

            const status = await switchNetwork(chainId);
            if (!status) {
                return;
            }
            const signer = library?.getSigner();
            const res = await contractsService.acceptOffer(contractAddress, tokenAddress, tokenId, biddingId, signer);
            const arr: any = [...offersReceived?.offers];
            arr[i].status = 'ACCEPTED';
            setOffersReceived({ ...offersReceived, offers: arr });
            toast.success('Offer accepted.');
            setAcceptLoading(false);
        } catch (error: any) {
            console.log(error);

            toast.error(error?.message);
            setAcceptLoading(false);
        }
    };

    const handleReject = async (id: string, i: number) => {
        try {
            setRejectLoading(true);
            setActiveIndex(i);
            const res = await offerService.rejectOffer(id);
            const arr: any = [...offersReceived?.offers];
            arr[i].status = 'REJECTED';
            setOffersReceived({ ...offersReceived, offers: arr });
            toast.success('Offer rejected.');
            setRejectLoading(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
            setRejectLoading(false);
        }
    };

    const handleLoadMore = () => {
        // setLoadMore(true);
        setPage(page + 1);
    };
    // console.log(offersReceived);

    return (
        <div className="relative w-full">
            <div className="mb-10">
                <h2 className="text-white text-2xl font-Proxima-SemiBold mb-5">Filters</h2>
                <Tabs tab={tab} tabs={tabs} onSelectTab={setTab} />
            </div>

            {tab?.value == 'SENT' && (
                <div className=" overflow-x-auto max-w-[100%] !rounded-[12px] mt-6">
                    <table className="min-w-full order-table  ">
                        <thead className="bg-[#2B2B35]  ">
                            <tr className="bg-[#2B2B35] ">
                                <th className="text-primary px-7 whitespace-nowrap">Item</th>
                                <th className="text-primary  px-7  whitespace-nowrap">User</th>

                                <th className="text-primary   px-12  whitespace-nowrap">Offer</th>
                                <th className="text-primary  px-7  whitespace-nowrap">Time</th>

                                <th className="text-primary px-7  whitespace-nowrap">Action</th>
                            </tr>
                        </thead>

                        <tbody className="  ">
                            {!loading && isEmpty(offers?.offers) ? (
                                <Tablenotdata />
                            ) : (
                                offers?.offers?.map((item: any, i: number) => (
                                    <tr className="  " key={item?._id}>
                                        <td className=" px-6 py-6 ">
                                            <div className="flex gap-1.5    ">
                                                <Link
                                                    legacyBehavior
                                                    href={`/nft/${item?.nft?.tokenId}?chain=${item?.nft?.chain}&&contract=${item?.nft?.contractAddress}`}>
                                                    <a>
                                                        <figure className="rounded-lg cursor-pointer   overflow-hidden  flex-shrink-0  w-[64px] h-[64px] ">
                                                            {/* {item?.nft?.image && ( */}
                                                            <ImageComponent
                                                                width="64"
                                                                height="64"
                                                                alt=""
                                                                src={
                                                                    item?.nft?.image || '/assets/images/main-place.jpg'
                                                                }
                                                                defaultPlaceholder={'/assets/images/main-place.jpg'}
                                                                className="rounded-[12px]  flex-shrink-0 "
                                                            />
                                                        </figure>
                                                    </a>
                                                </Link>
                                                <div className="flex items-center">
                                                    <p className="text-white w-28 truncate font-Proxima-Bold text-base whitespace-nowrap">
                                                        {item?.nft?.name}
                                                    </p>
                                                    {/* <div className="flex gap-1 flex-shrink-0 mt-1">
                                                        <img
                                                            className="h-[17px] w-[17px] rounded-[25px] flex-shrink-0"
                                                            src="/assets/images/avr1.png"
                                                            alt=""
                                                        />{' '}
                                                        <p className="text-sm font-Proxima-Regular w-28 truncate whitespace-nowrap ">
                                                            Exclusive
                                                        </p>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6">
                                            <div className="flex gap-1.5  ">
                                                <Link legacyBehavior href={`/profile/${item?.receiver?.userName}`}>
                                                    <a>
                                                        <figure className="rounded-full cursor-pointer   overflow-hidden flex-shrink-0   ">
                                                            {/* {item?.nft?.image && ( */}
                                                            <ImageComponent
                                                                width="50"
                                                                height="50"
                                                                alt=""
                                                                src={item?.receiver?.avatar}
                                                                defaultPlaceholder={'/assets/images/main-place.jpg'}
                                                                className="!rounded-full  flex-shrink-0 "
                                                                figClassName="  !rounded-full"
                                                            />
                                                        </figure>
                                                    </a>
                                                </Link>
                                                <div>
                                                    <p className="text-white w-28 truncate font-Proxima-Bold text-base whitespace-nowrap">
                                                        {item?.receiver?.firstName}
                                                    </p>

                                                    <p className="text-sm font-Proxima-Regular w-28 truncate whitespace-nowrap ">
                                                        @{item?.receiver?.userName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12">
                                            <p className="text-white  font-Proxima-Bold text-base w-28 truncate whitespace-nowrap">
                                                {item?.amount} WETH
                                            </p>
                                        </td>

                                        <td className="px-8">
                                            <span className="text-lg relative w-28 truncate   block  whitespace-nowrap">
                                                {moment(item?.createdAt).fromNow()}
                                            </span>
                                        </td>
                                        <td className=" text-center px-6 ">
                                            <div className="flex gap-1.5">
                                                <Button
                                                    isLoading={i == activeIndex && cancelLoading}
                                                    disabled={
                                                        (i == activeIndex && cancelLoading) || item?.status !== 'PLACED'
                                                    }
                                                    onClick={() =>
                                                        handleCancel(
                                                            item?.contractAddress,
                                                            item?.tokenAddress,
                                                            item?.tokenId,
                                                            item?.chainId,
                                                            i
                                                        )
                                                    }
                                                    className={`inline-block text-sm  font-Proxima-Bold ml-3 !px-6 !py-2  rounded-full border border-themecolor bg-transparent text-themecolor hover:bg-themecolor hover:text-black`}>
                                                    {item?.status === 'PLACED' ? 'Cancel' : toPascalCase(item?.status)}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="h-[200px] flex justify-center  items-center ">
                                            <TableLoader />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {!loading && offers?.next && (
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
            )}
            {tab?.value == 'RECEIVED' && (
                <div className=" overflow-x-auto max-w-[100%] !rounded-[12px] mt-6">
                    <table className="min-w-full order-table  ">
                        <thead className="bg-[#2B2B35]  ">
                            <tr className="bg-[#2B2B35] ">
                                <th className="text-primary px-7 whitespace-nowrap">Item</th>
                                <th className="text-primary  px-7  whitespace-nowrap">User</th>

                                <th className="text-primary   px-12  whitespace-nowrap">Offer</th>
                                <th className="text-primary  px-7  whitespace-nowrap">Time</th>

                                <th className="text-primary px-7  whitespace-nowrap">Action</th>
                            </tr>
                        </thead>

                        <tbody className="">
                            {!loading && isEmpty(offersReceived?.offers) ? (
                                <Tablenotdata />
                            ) : (
                                offersReceived?.offers?.map((item: any, i: number) => (
                                    <tr className="  " key={item?._id}>
                                        <td className=" px-6 py-6">
                                            <div className="flex gap-1.5  ">
                                                <Link
                                                    legacyBehavior
                                                    href={`/nft/${item?.nft?.tokenId}?chain=${item?.nft?.chain}&&contract=${item?.nft?.contractAddress}`}>
                                                    <a>
                                                        <figure className="rounded-lg cursor-pointer  overflow-hidden  flex-shrink-0  w-[64px] h-[64px] ">
                                                            {/* {item?.nft?.image && ( */}
                                                            <ImageComponent
                                                                width="64"
                                                                height="64"
                                                                alt=""
                                                                src={
                                                                    item?.nft?.image || '/assets/images/main-place.jpg'
                                                                }
                                                                defaultPlaceholder={'/assets/images/main-place.jpg'}
                                                                className="rounded-[12px]  flex-shrink-0 "
                                                            />
                                                        </figure>
                                                    </a>
                                                </Link>
                                                <div className="flex items-center">
                                                    <p className="text-white w-28 truncate font-Proxima-Bold text-base whitespace-nowrap">
                                                        {item?.nft?.name}
                                                    </p>
                                                    {/* <div className="flex gap-1 flex-shrink-0 mt-1">
                                                        <img
                                                            className="h-[17px] w-[17px] rounded-[25px] flex-shrink-0"
                                                            src="/assets/images/avr1.png"
                                                            alt=""
                                                        />{' '}
                                                        <p className="text-sm font-Proxima-Regular w-28 truncate whitespace-nowrap ">
                                                            Exclusive
                                                        </p>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6">
                                            <div className="flex gap-1.5  ">
                                                <Link legacyBehavior href={`/profile/${item?.sender?.userName}`}>
                                                    <a>
                                                        <figure className="rounded-full cursor-pointer    overflow-hidden flex-shrink-0   ">
                                                            {/* {item?.nft?.image && ( */}
                                                            <ImageComponent
                                                                width="50"
                                                                height="50"
                                                                alt=""
                                                                src={item?.sender?.avatar}
                                                                defaultPlaceholder={'/assets/images/main-place.jpg'}
                                                                className="!rounded-full  flex-shrink-0 "
                                                                figClassName="  !rounded-full"
                                                            />
                                                        </figure>
                                                    </a>
                                                </Link>
                                                <div>
                                                    <p className="text-white w-28 truncate font-Proxima-Bold text-base whitespace-nowrap">
                                                        {item?.sender?.firstName}
                                                    </p>

                                                    <p className="text-sm font-Proxima-Regular w-28 truncate whitespace-nowrap ">
                                                        @{item?.sender?.userName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12">
                                            <p className="text-white  font-Proxima-Bold text-base w-28 truncate whitespace-nowrap">
                                                {item?.amount} WETH
                                            </p>
                                        </td>

                                        <td className="px-8">
                                            <span className="text-lg relative w-28 truncate   block  whitespace-nowrap">
                                                {moment(item?.createdAt).fromNow()}
                                            </span>
                                        </td>
                                        <td className=" text-center px-6 ">
                                            <div className="flex gap-1.5">
                                                {item?.status !== 'ACCEPTED' && (
                                                    <Button
                                                        className={`inline-block text-sm  font-Proxima-Bold ml-3 !px-6 !py-2  rounded-full border border-themecolor bg-transparent text-themecolor hover:bg-themecolor hover:text-black`}
                                                        onClick={() => handleReject(item?._id, i)}
                                                        isLoading={i == activeIndex && rejectLoading}
                                                        disabled={
                                                            (i == activeIndex && rejectLoading) ||
                                                            item?.status === 'REJECTED' ||
                                                            item?.status === 'ACCEPTED'
                                                        }>
                                                        {item?.status === 'REJECTED' ? 'Rejected' : 'Reject'}
                                                    </Button>
                                                )}
                                                {item?.status !== 'REJECTED' && (
                                                    <Button
                                                        isLoading={i == activeIndex && acceptLoading}
                                                        disabled={
                                                            (i == activeIndex && acceptLoading) ||
                                                            item?.status === 'REJECTED' ||
                                                            item?.status === 'ACCEPTED'
                                                        }
                                                        onClick={() =>
                                                            handleAccept(
                                                                item?.contractAddress,
                                                                item?.tokenAddress,
                                                                item?.tokenId,
                                                                item?.offerId,
                                                                item?.chainId,
                                                                i
                                                            )
                                                        }
                                                        className={`inline-block text-sm  font-Proxima-Bold ml-3 !px-6 !py-2  rounded-full border border-themecolor bg-transparent text-themecolor hover:bg-themecolor hover:text-black`}>
                                                        {item?.status === 'ACCEPTED' ? 'Accepted' : 'Accept'}
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="h-[200px] flex justify-center  items-center ">
                                            <TableLoader />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {!loading && offersReceived?.next && (
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
            )}
        </div>
    );
};

export default Offer;
