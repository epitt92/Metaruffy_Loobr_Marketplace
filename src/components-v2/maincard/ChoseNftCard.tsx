import React, { useMemo } from 'react';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getMarketDetailsByAddress } from '../../utils/functions';
import PriceComponent from './components/PriceComponent';
import useMetaMask from '../../hooks/useMetaMask';
import ImageComponent from '../Image/ImageComponent';
interface Iprops {
    nft?: any;
    onSelect: Function;
    setstate: Function;
}
const ChoseNftCard = ({ nft, onSelect, setstate }: Iprops) => {
    const { account }: any = useMetaMask();
    const calculateAmount = (amount: number) => {
        return Number(Number(amount + (1 / 100) * amount).toFixed());
    };
    const blockchain: any = useMemo(() => getMarketDetailsByAddress(nft?.nft?.owner), [nft]);
    return (
        <div className="">
            <div
                className={`w-full bg-[#2B2B35] relative rounded-2xl ease-in-out duration-300 cursor-pointer  p-4 border-2  border-transparent hover:border-[#F1C94A] hover:shadow-[0_0_30px_0_rgba(241,207,74,0.5)]
`}>
                <div className=" text-white text-lg">
                    <figure className=" relative AtthemeImage rounded-lg">
                        {(nft?.nft?.image || nft?.nft?.preview) && (
                            <>
                                {nft?.nft?.fileType == 'glb' ? (
                                    <ImageComponent
                                        src={nft?.nft?.preview}
                                        defaultPlaceholder={'/assets/images/main-place.jpg'}
                                        width={348}
                                        height={300}
                                        alt=""
                                        figClassName=""
                                        quality={50}
                                        className="rounded-lg"
                                    />
                                ) : (
                                    <ImageComponent
                                        src={nft?.nft?.image}
                                        width={348}
                                        height={300}
                                        alt=""
                                        figClassName=""
                                        quality={50}
                                        className="rounded-lg"
                                    />
                                )}
                            </>
                        )}
                    </figure>
                </div>
                <div className="flex justify-between   items-center flex-shrink-0">
                    <h5 className=" text-lg !truncate   text-white mt-4 min-h-[30px] ">{nft?.nft?.name}</h5>
                </div>

                <div className=" mt-4  ">
                    <p>Price</p>
                    <div className=" flex priceComponentFeed ">
                        <PriceComponent
                            amount={nft?.price || 0}
                            chain={nft?.chain}
                            marketAddress={blockchain?.marketAddress}
                            currency={nft?.currency}
                            fee={nft?.sellMode == '0'}
                        />
                    </div>
                    <div className="flex justify-end mt-3">
                        <Button
                            className="bg-transparent border border-themecolor  !py-2.5 text-themecolor !px-5 rounded-[6rem] text-sm"
                            onClick={() => {
                                onSelect(nft);
                                setstate();
                            }}>
                            Choose NFT
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChoseNftCard;
