import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/loader/Loader';
import blockchains from '../../../contractsData/blockchains';
import SelectBlockchain from '../../../modules-v2/CreateItemModule/components/SelectBlockchain';
import { getUser } from '../../../redux/auth/actions';
import { collectionService } from '../../../services-v2/collectios.service';
import TrendingTable from './TrendingTable';
const tabs = [
    { name: 'Trending', current: true },
    { name: 'Most Liked', current: true },
    { name: 'Most Viewed', current: false },
    { name: 'Most Commented', current: false },
    { name: 'Most Traded', current: false },
    { name: 'Top Gainer', current: false }
];

const TrendsTab = ({ newCollections, mixedCollections }: any) => {
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Array<any>>([]);
    const [trending, setTrending] = useState<Array<any>>([]);
    const [metaData, setMetaData] = useState<any>();
    const [selectedBlockchain, setBloackchain] = useState<any>(blockchains[0]);
    const [page, setPage] = useState<number>(1);
    const user = useSelector((state: any) => state.auth.user);
    console.log(trending, 'trending');
    const [collections, setCollections] = useState(mixedCollections);

    const chains = {
        ETH: 0,
        BNB: 1,
        MATIC: 2,
        AVAX: 3
    };
    useEffect(() => {
        getAlltrends();
        console.log('network', selectedBlockchain);
        // getTrendings();
    }, [selectedTabIdx, selectedBlockchain]);
    const dispatch = useDispatch();
    const getAlltrends = async () => {
        setLoading(true);
        try {
            const temp = [];
            if (selectedBlockchain) {
                const idx = chains[selectedBlockchain['symbol']];
                for (let j = 0; j < newCollections[idx].length; j++) {
                    temp.push(newCollections[idx][j]);
                }
                setCollections(temp);
            } else {
                setCollections(mixedCollections);
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
                        <TrendingTable collections={collections} selectedBlockchain={selectedBlockchain} />
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
