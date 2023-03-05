import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../hooks/useMetaMask';
import { Activebidding } from '../../components/activebiddingsmodule/activebiddingsmodule';
import { getActiveBiddings } from '../../redux/nft/actions';
import ProfileActivity from './components/ProfileActivity';
import MyListings from './components/MyListings';
import Favourites from './components/Favourites';
import Created from './components/Created';
import Tabs from './components/Tabs';
import CollectionTabContent from './components/CollectionTabContent';
import Sold from './components/Sold';
import SocialfeedOnlyModule from '../SocialFeedsOnlyModule/SocialfeedOnlyModule';
import AllNFTs from './components/AllNFTs';
import Owned from './components/Owned';
import Offer from './components/offers/Offer';
import ScheduledPostComponent from './components/ScheduledPostComponent';
import { useRouter } from 'next/router';

const tabs = [
    { name: 'Created', current: true },
    { name: 'Owned', current: true },
    { name: 'Feeds', current: true },
    { name: 'Sold', current: true },
    { name: 'Listed', current: true },
    { name: 'My Bids', current: true },
    { name: 'Activity', current: true },
    { name: 'Liked', current: true },
    { name: 'Collections', current: true },
    { name: 'Scheduled Post', current: true },
    { name: 'Offers', current: true }
];

const Followtabs = () => {
    const dispatch = useDispatch();
    const { account }: any = useMetaMask();
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const router = useRouter();
    useEffect(() => {
        account && selectedTabIdx === 3 && dispatch(getActiveBiddings(account));
    }, [account, dispatch, selectedTabIdx]);
    const user = useSelector((state: any) => state.auth.user);
    useEffect(() => {
        if (router?.query?.schedule) {
            setSelectedTabIdx(9);
        }
    }, [router.query]);
    return (
        <>
            {/* Always use this prectise */}
            {/* Tabs Should be in separate component */}
            <Tabs tabs={tabs} activeTabIndex={selectedTabIdx} onActiveTab={setSelectedTabIdx} />

            {/* This component should be tab panel */}
            {selectedTabIdx === 0 && <Created activeTab={selectedTabIdx} />}
            {selectedTabIdx === 1 && <Owned activeTab={selectedTabIdx} />}
            {selectedTabIdx === 2 && (
                <SocialfeedOnlyModule tag="" allowPost={false} setConfirmation={() => {}} id={user?.userName} />
            )}
            {selectedTabIdx === 3 && <Sold />}
            {selectedTabIdx === 4 && <MyListings />}
            {selectedTabIdx === 5 && <Activebidding />}
            {selectedTabIdx === 6 && <ProfileActivity />}
            {selectedTabIdx === 7 && <Favourites />}
            {selectedTabIdx === 8 && <CollectionTabContent />}
            {selectedTabIdx === 9 && <ScheduledPostComponent />}
            {selectedTabIdx === 10 && <Offer />}

            {/* {selectedTabIdx === 9 && <AllNFTs />} */}
        </>
    );
};
export default Followtabs;
