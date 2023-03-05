import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import useMetaMask from '../../../hooks/useMetaMask';
import { getActiveBiddings, getMarketPlace, getNftListing } from '../../../redux/nft/actions';
import { GET_MARKETE_PLACE } from '../../../redux/nft/actionTypes';
import ListingsTable from './ListingsTable';

const tabs = [
    {
        name: 'All',
        current: true,
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 3H10C10.55 3 11 3.45 11 4V10C11 10.55 10.55 11 10 11H4C3.45 11 3 10.55 3 10V4C3 3.45 3.45 3 4 3ZM14 3H20C20.55 3 21 3.45 21 4V10C21 10.55 20.55 11 20 11H14C13.45 11 13 10.55 13 10V4C13 3.45 13.45 3 14 3ZM4 13H10C10.55 13 11 13.45 11 14V20C11 20.55 10.55 21 10 21H4C3.45 21 3 20.55 3 20V14C3 13.45 3.45 13 4 13Z"
                    fill="white"
                />
                <path
                    d="M20 13H14C13.45 13 13 13.45 13 14V20C13 20.55 13.45 21 14 21H20C20.55 21 21 20.55 21 20V14C21 13.45 20.55 13 20 13Z"
                    fill="white"
                />
            </svg>
        )
    },
    {
        name: 'Fixed Price',
        current: true,
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.70716 22.4398C8.55368 22.375 8.42614 22.2609 8.34465 22.1156C8.26317 21.9703 8.23239 21.802 8.25716 21.6373L9.62216 12.7498H5.99966C5.88482 12.7529 5.7708 12.7295 5.6664 12.6816C5.56201 12.6336 5.47002 12.5623 5.39755 12.4732C5.32508 12.384 5.27405 12.2794 5.24841 12.1674C5.22277 12.0555 5.2232 11.9391 5.24966 11.8273L7.49966 2.07728C7.53926 1.90948 7.63545 1.76045 7.77205 1.65526C7.90865 1.55008 8.07732 1.49517 8.24966 1.49978H15.7497C15.8617 1.4994 15.9724 1.52413 16.0737 1.57215C16.1749 1.62017 16.2641 1.69026 16.3347 1.77728C16.4062 1.86528 16.4569 1.96837 16.4829 2.07879C16.5089 2.18922 16.5095 2.30409 16.4847 2.41478L15.1872 8.24978H18.7497C18.8902 8.2495 19.028 8.28873 19.1474 8.36299C19.2667 8.43725 19.3628 8.54355 19.4247 8.66978C19.4784 8.79093 19.4991 8.92417 19.4846 9.05591C19.4701 9.18765 19.421 9.31321 19.3422 9.41978L9.59216 22.1698C9.52627 22.2675 9.43828 22.3482 9.33534 22.4056C9.2324 22.4629 9.1174 22.4952 8.99966 22.4998C8.89931 22.4979 8.80015 22.4776 8.70716 22.4398V22.4398Z"
                    fill="white"
                />
            </svg>
        )
    },
    {
        name: 'Timed Auctions',
        current: true,
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.18855 2.67116C9.18855 2.49316 9.26263 2.32245 9.39449 2.19658C9.52635 2.07071 9.70519 2 9.89167 2H14.1104C14.2969 2 14.4757 2.07071 14.6076 2.19658C14.7395 2.32245 14.8135 2.49316 14.8135 2.67116C14.8135 2.84917 14.7395 3.01988 14.6076 3.14575C14.4757 3.27162 14.2969 3.34233 14.1104 3.34233H12.7042V4.84573C14.2045 4.95541 15.6516 5.42448 16.9117 6.20954C16.9396 6.17233 16.9707 6.13731 17.0045 6.10484L18.4107 4.76251C18.4923 4.6846 18.5892 4.62279 18.6959 4.58062C18.8025 4.53846 18.9168 4.51675 19.0323 4.51675C19.1477 4.51675 19.262 4.53846 19.3687 4.58062C19.4753 4.62279 19.5722 4.6846 19.6538 4.76251C19.7355 4.84042 19.8002 4.93292 19.8444 5.03472C19.8886 5.13652 19.9113 5.24563 19.9113 5.35582C19.9113 5.46601 19.8886 5.57511 19.8444 5.67691C19.8002 5.77871 19.7355 5.87121 19.6538 5.94913L18.2828 7.2579C19.7556 8.62854 20.692 10.4394 20.9363 12.3889C21.1806 14.3385 20.7178 16.3091 19.6252 17.9726C18.5326 19.6361 16.8759 20.8922 14.9311 21.5316C12.9863 22.1711 10.8707 22.1553 8.93663 21.487C7.00252 20.8187 5.36658 19.5382 4.30123 17.8586C3.23587 16.1791 2.80538 14.2018 3.08144 12.2561C3.35749 10.3105 4.32344 8.51376 5.81843 7.16519C7.31342 5.81662 9.24725 4.99756 11.2979 4.84439V3.34233H9.89167C9.70519 3.34233 9.52635 3.27162 9.39449 3.14575C9.26263 3.01988 9.18855 2.84917 9.18855 2.67116V2.67116ZM4.40731 13.4098C4.40731 11.4873 5.20736 9.64364 6.63146 8.28427C8.05556 6.9249 9.98706 6.16121 12.001 6.16121C14.015 6.16121 15.9465 6.9249 17.3706 8.28427C18.7947 9.64364 19.5948 11.4873 19.5948 13.4098C19.5948 15.3322 18.7947 17.1759 17.3706 18.5353C15.9465 19.8947 14.015 20.6583 12.001 20.6583C9.98706 20.6583 8.05556 19.8947 6.63146 18.5353C5.20736 17.1759 4.40731 15.3322 4.40731 13.4098V13.4098ZM12.001 13.4098V7.50354C10.9835 7.50342 9.98153 7.74287 9.08405 8.20067C8.18657 8.65848 7.42122 9.3205 6.85582 10.1281C6.29041 10.9357 5.9424 11.864 5.84262 12.8306C5.74283 13.7973 5.89435 14.7725 6.28375 15.6699C6.67315 16.5673 7.28841 17.3592 8.07502 17.9754C8.86164 18.5916 9.79533 19.0131 10.7934 19.2026C11.7914 19.392 12.823 19.3436 13.7968 19.0616C14.7705 18.7796 15.6564 18.2727 16.3759 17.5858L12.001 13.4098Z"
                    fill="white"
                />
            </svg>
        )
    }
];

const MyListings = () => {
    const { account }: any = useMetaMask();
    const [activeTab, setActiveTab] = useState(0);
    // const router = useRouter();
    // const listing = useSelector((state: any) => state.nft.listings);
    // const loading = useSelector((state: any) => state.nft.listingsLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        page !== 1 && setPage(1);
    }, [activeTab]);

    // useEffect(() => {
    //     const filters: any = {
    //         address: account,
    //         isActive: true
    //     };
    //     if (activeTab == 1) {
    //         filters.sellMode = '0';
    //     }
    //     if (activeTab == 2) {
    //         filters.sellMode = '1';
    //     }
    //     if (activeTab == 0) {
    //         delete filters.sellMode;
    //     }
    //     account && dispatch(getNftListing(filters));
    // }, [account, activeTab, dispatch]);

    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);

    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const loading = useSelector((state: any) => state.nft.marketplaceLoading);

    useEffect(() => {
        const filters: any = {
            page: page,
            address: account,
            isActive: true
        };
        if (activeTab == 1) {
            filters.type = ['0'];
        }
        if (activeTab == 2) {
            filters.type = ['1'];
        }
        if (activeTab == 0) {
            delete filters.type;
        }

        account && dispatch(getMarketPlace(filters, loadMore, setLoadMore));
        () => {
            dispatch({
                type: GET_MARKETE_PLACE,
                payload: null
            });
        };
    }, [account, activeTab, dispatch, page]);

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    console.log(marketplace);

    return (
        <div>
            <div className="flex items-center flex-wrap gap-4 mb-5 mt=10">
                {tabs.map((tab, i) => (
                    <div className={`activityRadio`} key={i} onClick={() => setActiveTab(i)}>
                        <input type="radio" name="select-filter" id={`${i}tab`} />
                        <label
                            htmlFor={`${i}tab`}
                            className={`${
                                i === activeTab && '!bg-[#F1C94A] gold  !text-[#2B2B35]'
                            } font-Proxima-SemiBold  `}>
                            {tab.icon}
                            <span className="ml-2.5 ">{tab.name}</span>
                        </label>
                    </div>
                ))}
            </div>
            {!(loading && page == 1) &&
                !isEmpty(marketplace?.listings) &&
                account &&
                tabs.map(
                    (item: any, i: number) =>
                        activeTab === i && <ListingsTable listings={marketplace?.listings} activeTab={activeTab} />
                )}
            {loading && <Loader />}
            {!loading && (isEmpty(marketplace?.listings) || !account) && (
                <div>
                   <Notfounditem
                            title="No items listed"
                            desc="Start listing items today on our marketplace"
                          
                        />
                </div>
            )}
            {!loading && marketplace?.metadata?.totalPages > page && account && (
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

export default MyListings;
