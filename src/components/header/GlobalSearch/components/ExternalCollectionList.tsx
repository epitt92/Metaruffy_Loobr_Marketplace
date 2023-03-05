import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import blockchains from '../../../../contractsData/blockchains';
import { collectionService } from '../../../../services/collectios.service';
import { formatNumber, slicedAddress } from '../../../../utils/functions';
import ImageComponent from '../../../Image/ImageComponent';
import Verified from './VerifiedIcon';

export default function ExternalCollectionList({ saveRecent, router, item, setShow, isLiked = false }: any) {
    const user = { firstName: item?.name };
    const [star, setStar] = useState(isLiked || false);
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    const onStar = async (e: any) => {
        e.stopPropagation();
        setStar((prev: boolean) => !prev);

        try {
            const res = await collectionService.updateLikeCollection({ address: item.address, chain: item.chain });
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <>
            <a
                className="w-full list-none flex items-center gap-3  "
                onClick={() => {
                    saveRecent();
                    router.push(`/collections/address/${item.address}?chain=${item.chain}`);
                }}>
                <li
                    className="w-full list-none border cursor-pointer border-b-[#303044] icon-star hover:bg-[#2A2A3D] border-transparent flex items-center gap-3 py-3"
                    onClick={() => setShow(false)}
                    key={item?.name}>
                    <a className="w-full list-none flex items-center gap-3  ">
                        <figure className="w-[45px] h-[45px] relative rounded-full overflow-hidden">
                            {!!item.logoPicture ? (
                                <ImageComponent
                                    src={item.logoPicture}
                                    objectFit="cover"
                                    layout="fill"
                                    className="rounded-full"
                                    isUserProfile
                                    user={user}
                                    size={2}
                                />
                            ) : (
                                <p className="w-full h-full shrink-none bg-themecolor  flex items-center justify-center rounded-full text-black1 text-xl font-Proxima-SemiBold">
                                    {item.name?.charAt(0).toUpperCase()}
                                </p>
                            )}
                        </figure>
                        <div>
                            <h4 className="text-base flex gap-2 items-center   text-white font-Proxima-SemiBold ">
                                {item.name}
                                {item?.isVerified && <Verified />}
                                {/* {isAuthenticated && (
                                    <span className="">
                                        <i
                                            onClick={onStar}
                                            className={` hidden ${
                                                star ? 'text-themecolor icon-start' : ' icon-ion_star text-white'
                                            }   text-xl`}></i>
                                    </span>
                                )} */}
                            </h4>
                            <h6 className="text-base mt-[2px]  text-[#B8B8BC] font-Proxima-Regular ">
                                {slicedAddress(item.address)}
                            </h6>
                        </div>
                    </a>
                    <div className="flex w-[25rem] justify-between    items-center ">
                        <div>
                            <div className="min-w-[80px] flex items-center  flex-col">
                                <h6 className="font-Proxima-SemiBold text-left text-lg text-white">
                                    {item?.owners_total ? formatNumber(item?.owners_total, 0) : '--'}
                                </h6>

                                <p className="font-Proxima-Regular mt-1  text-left  text-sm text-[#B8B8BC]">Holders</p>
                            </div>
                        </div>
                        <div>
                            <div className="min-w-[80px] flex items-center  flex-col">
                                <h6 className="font-Proxima-SemiBol text-lg text-white">
                                    {item?.items_total ? formatNumber(item?.items_total, 0) : '--'}
                                </h6>
                                <p className="font-Proxima-Regular mt-1   text-sm text-[#B8B8BC]">Items</p>
                            </div>
                        </div>
                        <div>
                            <div className="min-w-[80px] flex  items-center  flex-col">
                                <h6 className="">
                                    <span className="">
                                        {item?.chain &&
                                            blockchains?.filter((chain: any) => item?.chain == chain?.symbol)[0]
                                                ?.tagname}
                                    </span>
                                    <span></span>
                                </h6>
                                <p className="font-Proxima-Regular mt-3   text-sm text-[#B8B8BC]">Blockchain</p>
                            </div>
                        </div>
                    </div>
                </li>
            </a>
        </>
    );
}
