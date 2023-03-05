import React, { useMemo } from 'react';
import { getMarketDetailsByAddress } from '../../utils/functions';
import PriceComponent from '../../components/maincard/components/PriceComponent';
import useMetaMask from '../../hooks/useMetaMask';
interface Iprops {
    listing: any;
}
const FeedPrice = ({ listing }: Iprops) => {
    const { account }: any = useMetaMask();
    const calculateAmount = (amount: number) => {
        return Number(Number(amount + (1 / 100) * amount).toFixed());
    };
    const blockchain: any = useMemo(() => getMarketDetailsByAddress(listing?.nft?.owner), [listing]);
    return (
        <div className="priceComponentFeed">
            <PriceComponent
                amount={listing?.price || 0}
                currency={listing?.currency}
                chain={listing?.chain}
                marketAddress={blockchain?.marketAddress}
                fee={listing?.sellMode == '0'}
            />
        </div>
    );
};
export default FeedPrice;
