import React, { useEffect, useState } from 'react';
import TrendsTable from './TrendsTable';
import blockchains from '../../contractsData/blockchains';
import SelectBlockchain from '../CreateItemModule/components/SelectBlockchain';
import { collectionService } from '../../services/collectios.service';
import Loader from '../../components/loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/auth/actions';
import TrendingTable from './TrendingTable';
const tabs = [
    { name: 'Trending', current: true },
    { name: 'Most Liked', current: true },
    { name: 'Most Viewed', current: false },
    { name: 'Most Commented', current: false },
    { name: 'Most Traded', current: false },
    { name: 'Top Gainer', current: false }
];

const TrendsTab = () => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Array<any>>([]);
    const [trending, setTrending] = useState<Array<any>>([]);
    const [metaData, setMetaData] = useState<any>();
    const [selectedBlockchain, setBloackchain] = useState<any>(blockchains[0]);
    const [page, setPage] = useState<number>(1);
    const user = useSelector((state: any) => state.auth.user);
    console.log(trending, 'trending');

    useEffect(() => {
        getAlltrends();
        // getTrendings();
    }, [selectedTabIdx, selectedBlockchain]);
    const dispatch = useDispatch();
    const getAlltrends = async () => {
        setLoading(true);
        try {
            let query = {
                id: selectedTabIdx,
                chainId: selectedBlockchain?.symbol,
                page: page,
                pageSize: 20
            };
            let res = await collectionService.getTrends(query);
            setMetaData(res?.data?.data?.metadata);

            setData(res?.data?.data?.stats);
            if (user && user?.userId) {
                dispatch(getUser());
            }
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };

    // const getTrendings = async () => {
    //     setLoading(true);
    //     try {
    //         let query = {
    //             // id: selectedTabIdx,
    //             // chainId: selectedBlockchain?.symbol,
    //             // page: page,
    //             // pageSize: 20
    //         };

    //         setTrending(res?.data?.data);
    //         setLoading(false);
    //     } catch {
    //         setLoading(false);
    //     }
    // };
    const onChange = async (val: any) => {
        setPage(val.selected + 1);
        setLoading(true);
        try {
            let query = {
                id: selectedTabIdx,
                chainId: selectedBlockchain?.symbol,
                page: val.selected + 1,
                pageSize: 10
            };
            let res = await collectionService.getTrends(query);
            setMetaData(res?.data?.data?.metadata);

            setData(res?.data?.data?.stats);
            setLoading(false);
        } catch {
            setLoading(false);
        }
    };
    const handleSelectBlockchain = async (value: any) => {
        try {
            setBloackchain(value);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className=" mt-16 mb-10">
                <nav className=" flex items-center space-x-4 lg:w-full" aria-label="Tabs">
                    <div className="flex-col md:flex-row flex  md:justify-between gap-6 w-full md:items-center">
                        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0">
                            {tabs.map((tab, i) => (
                                <a
                                    key={tab.name}
                                    className={`${
                                        i === selectedTabIdx
                                            ? 'text-[#000000] bg-themecolor gold2 font-Proxima-Bold '
                                            : 'text-white bg-[#2B2B35] hover:bg-[#43434a] font-Proxima-SemiBold'
                                    }
                                    whitespace-nowrap px-4 py-3 cursor-pointer text-sm   rounded-full focus:outline-none`}
                                    onClick={() => setSelectedTabIdx(i)}>
                                    {tab.name}
                                </a>
                            ))}
                        </div>
                        <div className="xs:self-start  self-end">
                            <h3 className="text-base font-Proxima-Bold text-white mb-1">Filter by blockchain</h3>
                            <SelectBlockchain
                                data={blockchains}
                                onSelect={handleSelectBlockchain}
                                selected={selectedBlockchain}
                            />
                        </div>
                    </div>
                </nav>
            </div>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="">
                        {selectedTabIdx == 0 ? (
                            <TrendingTable data={trending} page={page} selectedBlockchain={selectedBlockchain} />
                        ) : (
                            <TrendsTable data={data} page={page} selectedBlockchain={selectedBlockchain} />
                        )}
                    </div>
                </>
            )}
            {/* <div className={`mt-12 flex justify-end ${loading ? 'hidden' : ''}`}>
                {metaData && (
                    <ReactPaginate
                        pageCount={metaData?.totalPages}
                        pageRangeDisplayed={4}
                        marginPagesDisplayed={1}
                        onPageChange={onChange}
                        containerClassName="pagination flex"
                        activeClassName="active"
                        pageLinkClassName="page-link"
                        breakLinkClassName="page-link"
                        nextLinkClassName="page-link"
                        previousLinkClassName="page-link"
                        pageClassName="page-item"
                        breakClassName="page-item"
                        nextClassName="page-item"
                        previousClassName="page-item"
                        previousLabel={<>&lsaquo;</>}
                        nextLabel={<>&rsaquo;</>}
                    />
                )}
            </div> */}
        </div>
    );
};
export default TrendsTab;
