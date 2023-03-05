// import Link from "next/link";
import { useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import useMetaMask from '../../hooks/useMetaMask';
import Everything from './components/Everything';
// import Alertconfirmation from "../../components/alertconfirmation/alertconfirmation";
// import Alertthanks from "../../components/alertthanks/alertthanks";
// import DirectChat from "../../components/Chat/DirectChat";
import ExploreMarketplace from './components/ExploreMarketplace';
import ExploreNft from './components/Explorenft';
import FeaturedNfts from './components/FeaturedNfts';
import LiveAuctions from './components/LiveAuctions';
import MainBanner from './components/MainBanner';
import TopUsers from './components/TopUsers';

export const HomeModule = () => {
    const user = useSelector((state: any) => state.auth.user);

    return (
        <>
            <MainBanner />
            <LiveAuctions />
            <TopUsers />
            <FeaturedNfts />
            <ExploreNft/>
            <ExploreMarketplace />
            <Everything/>
            {/* {user && user.userId && <DirectChat />} */}
        </>
    );
};
