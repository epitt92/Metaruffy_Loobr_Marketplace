import React, { useState, useEffect } from 'react';
// import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
// import MainCard from "../../components/maincard/MainCard";
// import Button from "../../components/Button/Button";
// import Popups from "../../components/popup/poups";
import { useRouter } from 'next/router';
// import { getNftListing } from "../../redux/nft/actions";
// import Notfounditem from "../../components/notfounditems/notfounditem";
// import { userService } from "../../services/user.service";
// import Drodpdown from "../../components/Dropdown/Dropdown";
// import { LikeComponent } from "../../components/Like/LikeComponent";
import moment from 'moment';
import Tabs from './components/Tabs';
import OnSale from './components/OnSale';
import Favourite from './components/Favourite';
// import Owned from "./components/Owned";
import Collection from './components/Collections';
import Sold from './components/Sold';
import SocialfeedOnlyModule from '../SocialFeedsOnlyModule/SocialfeedOnlyModule';

const tabs = [
    { name: 'Feed', current: false },
    { name: 'For Sale', current: false },
    { name: 'Liked', current: false },
    { name: 'Sold', current: false },
    // { name: "Owned", current: false },
    { name: 'Collections', current: false }
];
const Tab = ({ setConfirmed, confirm }: any) => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const user = useSelector((state: any) => state.user.user);
    const router = useRouter();
    const { username } = router.query;

    return (
        <>
            <Tabs tabs={tabs} activeTabIndex={selectedTabIdx} onActiveTab={setSelectedTabIdx} />
            {selectedTabIdx === 0 && (
                <SocialfeedOnlyModule
                    confirmation={confirm}
                    tag=""
                    allowPost={true}
                    setConfirmation={setConfirmed}
                    id={username}
                />
            )}
            {selectedTabIdx === 1 && <OnSale />}
            {selectedTabIdx === 2 && <Favourite />}
            {/* {selectedTabIdx === 3 && <Owned />} */}
            {selectedTabIdx === 3 && <Sold />}
            {selectedTabIdx === 4 && <Collection />}
        </>
    );
};
export default Tab;
