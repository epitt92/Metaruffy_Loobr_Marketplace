import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import CollectionCardComponent from '../../../components/CollectionCard/CollectionCardComponent';
import Loader from '../../../components/loader/Loader';
import Notfound from '../../../components/notfound/notfound';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import Popups from '../../../components/popup/poups';
import Verified from '../../../components/verified';
import blockchains from '../../../contractsData/blockchains';
import useMetaMask from '../../../hooks/useMetaMask';
import { deleteCollection, getAllCollections } from '../../../redux/collections/actions';
import SelectBlockchain from '../../CreateItemModule/components/SelectBlockchain';
import CollectionCard from './CollectionCard';
// import CollectionDropdown from './CollectionDropdown';

const CollectionTabContent = () => {
    const { account }: any = useMetaMask();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [collections, setCollections] = useState<any>([]);
    const [selectedBlockchain, setBloackchain] = useState<any>(blockchains[0]);
    const [extCollections, setExtCollections] = useState<any>([]);
    const [extCollectionsLoading, setExtCollectionsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    console.log(blockchains);

    const user = useSelector((state: any) => state.auth.user);
    const collectionss = useSelector((state: any) => state.collections.collections);

    const loading = useSelector((state: any) => state.collections.collectionsLoading);
    const deleteLoading = useSelector((state: any) => state.collections.deleteLoading);

    useEffect(() => {
        const filters = {
            page: page,
            pageSize: 9,
            userId: user?.userId
        };
        user && dispatch(getAllCollections(filters));
    }, [user?.userId, page]);

    useEffect(() => {
        const filters = {
            chain: selectedBlockchain?.symbol
        };
        user?.userId && account && fetchExternalCollections(account, filters);
    }, [user?.userId, account, selectedBlockchain]);

    useEffect(() => {
        if (loadMore) {
            setCollections([...collections, ...collectionss?.collections]);
            setLoadMore(false);
        } else {
            setCollections(collectionss?.collections);
        }
    }, [collectionss]);

    const handleDelete = (id: string) => {
        dispatch(deleteCollection(id));
    };

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    const handleSelectBlockchain = async (value: any) => {
        console.log(value);

        try {
            setBloackchain(value);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchExternalCollections = async (address: string, filters: any) => {
        console.log(filters);

        try {
            setExtCollectionsLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/external/wallet/${address}`, {
                params: filters
            });
            setExtCollections(res.data?.data);
            setExtCollectionsLoading(false);
        } catch (error) {
            setExtCollections([]);
            setExtCollectionsLoading(false);

            console.log(error);
        }
    };

    return (
        <>
            <div className="w-full mb-7 text-right ">
                <Button
                    className="gold rounded-full"
                    onClick={() => {
                        setPopup(true);
                        setState(21);
                    }}>
                    Create New Collection
                </Button>
                <div className="flex items-center justify-between gap-6 mt-8">
                    <h2 className="text-2xl font-Proxima-SemiBold text-white">Internal Collection</h2>
                    {/* <div className="px-3 py-2.5 text-sm text-[#727279] border border-[#727279] rounded-full flex items-center gap-3">
                        <span className="leading-none">View all</span>
                        <i className="icon-arrow-right text-xl"></i>
                    </div> */}
                </div>
            </div>
            <div className="">
                {!loading && isEmpty(collections) && <Notfound />}
                {!isEmpty(collections) && (
                    <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2  xs2:grid-cols-1 gap-6 sm:gap-10 ">
                        {collections?.map((item: any) => (
                            <CollectionCardComponent data={item} key={item?._id} />
                            // <CollectionCard data={item} key={item?._id} />
                        ))}
                    </div>
                )}
                {loading && <Loader />}
                {!loading && collectionss?.totalPages > page && (
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
                {/* <CollectionCard src={""} name={""} width={""} /> */}
            </div>

            {/* External Collections */}
            <div className="flex items-center justify-between gap-6 mt-10">
                <h2 className="text-2xl font-Proxima-SemiBold text-white">External Collection</h2>
                {/* <div className="px-3 py-2.5 text-sm text-[#727279] border border-[#727279] rounded-full flex items-center gap-3">
                    <span className="leading-none">View all</span>
                    <i className="icon-arrow-right text-xl"></i>
                </div> */}
            </div>
            <div className="xs:self-start  mt-5 self-end">
                <h3 className="text-base font-Proxima-Bold text-white mb-1">Filter by blockchain</h3>
                <SelectBlockchain data={blockchains} onSelect={handleSelectBlockchain} selected={selectedBlockchain} />
            </div>
            <div className="mt-10">
                {extCollectionsLoading ? (
                    <Loader />
                ) : isEmpty(extCollections) ? (
                    <Notfounditem desc="Start exporting your collections" collection={true} />
                ) : (
                    <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2  xs2:grid-cols-1 gap-6 sm:gap-10  ">
                        {extCollections?.map((item: any, i: number) => (
                            <CollectionCardComponent data={item} key={item?._id} />

                            // <Link legacyBehavior href={`/collections/address/${item.tokenAddress}`} key={i}>
                            //     <a>
                            //         <div className=" w-full relative  ">
                            //             <div className="bg-[#292931] px-4 py-6 rounded-t-xl space-y-3.5 ">
                            //                 <div className="flex justify-between truncate">
                            //                     <p className="text-sm text-[#A1A1A5] ">Blockchain</p>
                            //                     <p className="text-sm text-white w-1/2 flex justify-end ">
                            //                         <span className="truncate">{selectedBlockchain?.name}</span>
                            //                     </p>
                            //                 </div>
                            //                 <div className="flex justify-between">
                            //                     <p className="text-sm text-[#A1A1A5]">Contract Type</p>
                            //                     <p className="text-sm text-white w-1/2 flex justify-end ">
                            //                         <span className="truncate">{item?.contractType}</span>
                            //                     </p>
                            //                 </div>
                            //                 <div className="flex justify-between">
                            //                     <p className="text-sm text-[#A1A1A5]">Symbol</p>
                            //                     <p className="text-sm text-white w-1/2 flex justify-end ">
                            //                         <span className="truncate">{item?.symbol}</span>
                            //                     </p>
                            //                 </div>
                            //                 <div className="flex justify-between">
                            //                     <p className="text-sm text-[#A1A1A5]">Address</p>
                            //                     <p className="text-sm text-white w-1/2 flex gap-3 justify-end ">
                            //                         <span className="truncate">{item?.tokenAddress}</span>
                            //                         <svg
                            //                             className="flex-shrink-0 cursor-default"
                            //                             width="14"
                            //                             height="14"
                            //                             viewBox="0 0 14 14"
                            //                             fill="none"
                            //                             xmlns="http://www.w3.org/2000/svg">
                            //                             <path
                            //                                 d="M11.1693 13.6663H2.0026C1.56058 13.6663 1.13665 13.4907 0.824093 13.1782C0.511532 12.8656 0.335938 12.4417 0.335938 11.9997V2.83301C0.335938 2.39098 0.511532 1.96706 0.824093 1.6545C1.13665 1.34194 1.56058 1.16634 2.0026 1.16634H5.33594V2.83301H2.0026V11.9997H11.1693V8.66634H12.8359V11.9997C12.8359 12.4417 12.6603 12.8656 12.3478 13.1782C12.0352 13.4907 11.6113 13.6663 11.1693 13.6663ZM6.7526 8.42217L5.5776 7.24384L10.8218 1.99967H7.83594V0.333008H13.6693V6.16634H12.0026V3.17884L6.7526 8.42217Z"
                            //                                 fill="#727279"
                            //                             />
                            //                         </svg>
                            //                     </p>
                            //                 </div>
                            //             </div>
                            //             <div className="bg-[#20202A]  rounded-b-xl leading-none px-5 py-6">
                            //                 <h3
                            //                     className="text-2xl w-full truncate leading-[35px] text-white "
                            //                     title={item.name}>
                            //                     {item.name}
                            //                 </h3>
                            //             </div>
                            //         </div>
                            //     </a>
                            // </Link>
                        ))}
                    </div>
                )}
                {/* <CollectionCard src={""} name={""} width={""} /> */}
            </div>

            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </>
    );
};

export default CollectionTabContent;
