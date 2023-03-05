import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import MainCard from '../../components/maincard/MainCard';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import MarketPlaceFilters from './component-v2/MarketPlaceFilters';
import Select from '../../components/select/Select';
import { getMarketPlace } from '../../redux/nft/actions';
import { useDispatch, useSelector } from 'react-redux';
import Notfound from '../../components/notfound/notfound';
import { isEmpty } from 'validate.js';
import Skelton from '../../components/skelton/Skelton';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import debounce from 'lodash.debounce';
import NewCard from '../../components/maincard/NewCard';
import SkeltonCard from '../../components/skelton/Skeltoncard';
// import CollectionCardComponent from '../../components/CollectionCard/CollectionCardComponent';
// import { getAllCollections } from '../../redux/collections/actions';
import Collections from './component-v2/Collections';
import FilterComponent from '../../components/select/Filter';

const sortdatalands = [
    { id: 0, name: 'Sort by' },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 }
];

const sortdata = [
    { id: 0, name: 'Sort by' },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 2, name: 'Price: High to Low', value: 'price', order: -1 },
    { id: 1, name: 'Likes: Low to High', value: 'likes', order: 1 },
    { id: 2, name: 'Likes: High to Low', value: 'likes', order: -1 },
    { id: 1, name: 'Comments: Low to High', value: 'comments', order: 1 },
    { id: 2, name: 'Comments: High to Low', value: 'comments', order: -1 },
    { id: 3, name: 'Newest To Oldest', value: 'createdAt', order: -1 },
    { id: 4, name: 'Oldest To Newest', value: 'createdAt', order: 1 }
];
const sortdata2 = [
    { id: 1, name: 'Newest To Oldest', value: 'createdAt', order: -1 },
    { id: 2, name: 'Oldest To Newest', value: 'createdAt', order: 1 }
    // { id: 3, name: 'Sort by' },
];

const arr = [1, 2, 3, 4, 5, 6];

export const MarketPlaceModuleV2 = () => {
    const islands = useSelector((state: any) => state.landmap.islands);
    const [sortlanddata, setSortlanddata] = useState(null);
    const [landNums, setLandNums] = useState(null);

    const [selected, setSelected] = useState(sortdata[0]);
    const [islandFilter, setIslandFilter] = useState([]);
    const plots = useSelector((state: any) => state.landmap.lands);
    const [filteredNFTs, setFilteredNFTs] = useState(null);
    const [show, setshow] = useState(false);
    const [cleared, setCleared] = useState(false);
    const [values, setValues] = useState({
        search: '',
        minPrice: '',
        maxPrice: ''
    });
    const [fromType, setFromType] = useState<string>('nft');
    const [types, setTypes] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [blockchains, setBlockchains] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [filterShow, setFilterShow] = useState(false);

    /* For Collection Search  */
    // TODO: Temp
    const [name, setName] = useState('');

    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const loading = useSelector((state: any) => state.nft.marketplaceLoading);
    const [toggle, setToggle] = useState(false);
    const [readmore, setReadmore] = useState<boolean>(false);

    const dispatch = useDispatch();

    const handleSubmitFileters = useCallback(() => {
        const filters = {
            search: categories.length && categories[0].includes('Land') ? 'Meta Ruffy Land' : values.search,
            minPrice: values.minPrice,
            maxPrice: values.maxPrice,
            type: types,
            category: categories.length && categories[0].includes('Land') ? [] : categories,
            sortBy: selected.order,
            sortType: selected.value,
            pageSize: 10,
            page: page,
            isActive: true,
            blockchains,
            expired: true
            // from: fromType
        };

        fromType == 'nft' && dispatch(getMarketPlace(filters, loadMore, setLoadMore));
    }, [
        categories,
        dispatch,
        page,
        selected.id,
        types,
        values.maxPrice,
        values.minPrice,
        values.search,
        loadMore,
        blockchains,
        fromType
    ]);

    useEffect(() => {
        handleSubmitFileters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        values.search,
        types,
        categories,
        selected,
        cleared,
        page,
        blockchains
        // fromType
        // handleSubmitFileters,
    ]);

    useEffect(() => {
        if (marketplace?.metadata) {
            setValues({ ...values, maxPrice: marketplace.metadata.max, minPrice: marketplace.metadata.min });
        }
    }, [marketplace?.metadata?.max, marketplace?.metadata?.min]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'search') {
            page != 1 && setPage(1);
        }

        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === 'search') {
            page != 1 && setPage(1);
        }
        setName(event.target.value);
    };

    const handleSelectSort = (values: any) => {
        page != 1 && setPage(1);
        setSelected(values);
    };
    const isInFilters = (item: any) => {
        return islandFilter.filter((ele: any) => ele.id === item.id).length;
    };
    const handleIslandFilter = (values: any) => {
        console.log('set filter:', values);
        let temp = [...islandFilter];
        if (isInFilters(values)) {
            temp = temp.filter((ele: any) => ele.id !== values.id);
        } else {
            temp.push(values);
        }
        setIslandFilter(temp);
        setFilterShow(true);
    };

    const isInSelectedIslands = (nft: any) => {
        if (!islandFilter || !plots) return false;
        let contractAddrs = [
            '0x81FEa6a299FbA9742ebcd6AD4dE7361f92391aBb',
            '0xf97199f79ca6677c3baa20a48320029ba9264b08',
            '0xC4ee3ff221ad2566f30F75087FB519fA740cE7Fe',
            '0x9AEfe5cD9Aaf86E6E04CB7607D795b292bc59ce3'
        ];
        let isLand = contractAddrs.findIndex((addr) => addr.toUpperCase() === nft?.contractAddress.toUpperCase());
        if (isLand !== -1) {
            let keys = Object.keys(plots);
            for (let i = 0; i < keys.length; i++) {
                if (plots[keys[i]]['landID'] === parseInt(nft?.tokenId)) {
                    // console.log('Found land:', plots[key]['island'] === islandFilter['value']);
                    let temp = islandFilter.filter((ele) => ele['value'] === plots[keys[i]]['island']);
                    console.log(plots[keys[i]]['island'], islandFilter, temp, plots[keys[i]]['island']);
                    if (temp.length) return true;
                }
            }
        }
        return false;
    };
    const isInSelectedIsland = (nft: any, island: any) => {
        if (!islandFilter || !plots) return false;
        let contractAddrs = [
            '0x81FEa6a299FbA9742ebcd6AD4dE7361f92391aBb',
            '0xf97199f79ca6677c3baa20a48320029ba9264b08',
            '0xC4ee3ff221ad2566f30F75087FB519fA740cE7Fe',
            '0x9AEfe5cD9Aaf86E6E04CB7607D795b292bc59ce3'
        ];
        let isLand = contractAddrs.findIndex((addr) => addr.toUpperCase() === nft?.contractAddress.toUpperCase());
        if (isLand !== -1) {
            let keys = Object.keys(plots);
            for (let i = 0; i < keys.length; i++) {
                if (plots[keys[i]]['landID'] === parseInt(nft?.tokenId)) {
                    // console.log('Found land:', plots[key]['island'] === islandFilter['value']);
                    if (plots[keys[i]]['island'] === island['island']) return true;
                }
            }
        }
        return false;
    };
    const getLandNums = () => {
        let temp = islands.map(
            (island: any) => marketplace?.listings.filter((item: any) => isInSelectedIsland(item['nft'], island)).length
        );
        setLandNums(temp);
    };
    const filterLandNFTS = () => {
        let newMarketplace = marketplace?.listings.filter((item: any) => isInSelectedIslands(item['nft']));
        setFilteredNFTs(newMarketplace);
    };
    useEffect(() => {
        marketplace?.listings && plots && islands && filterLandNFTS();
    }, [islandFilter]);

    useEffect(() => {
        if (!marketplace) return;
        setFilteredNFTs(marketplace?.listings);
        islands && getLandNums();
    }, [marketplace]);

    useEffect(() => {
        marketplace?.listings && plots && islands && filterLandNFTS();
        marketplace && islands && getLandNums();
    }, [plots]);

    useEffect(() => {
        if (!islands) return;
        // let data = [{ id: 0, name: 'None', value: 0 }];
        let data = islands.map((island: any, idx: number) => {
            return {
                id: idx + 1,
                name: island['name'],
                value: island['island']
            };
        });

        setSortlanddata(data);

        marketplace && getLandNums();
    }, [islands]);

    const debouncedEventHandler = useMemo(() => debounce(handleChange, 1000), [values]);
    const debouncedNameHandler = useMemo(() => debounce(handleChangeName, 1000), [name]);

    // Stop the invocation of the debounced function
    // after unmounting
    useEffect(() => {
        return () => {
            debouncedEventHandler.cancel();
        };
    }, []);

    const handleSelectTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
        page != 1 && setPage(1);
        const type = event.target.value == 'Fixed Price' ? '0' : '1';
        if (!types.includes(type)) {
            setTypes([...types, type]);
        } else {
            setTypes(types.filter((item) => item !== type));
        }
    };

    const handleSelectCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        page != 1 && setPage(1);
        // if((event.target.value).includes('Land')) {
        //     console.log(event.target.value)

        //         // setValues({ ...values, search: 'Meta Ruffy Land' });
        //         setCategories(categories.filter((item) => item !== event.target.value));
        //     }
        if (!categories.includes(event.target.value)) {
            setCategories([...categories, event.target.value]);
        } else {
            setCategories(categories.filter((item) => item !== event.target.value));
        }
    };

    const handleSelectBlockchains = (event: React.ChangeEvent<HTMLInputElement>) => {
        page != 1 && setPage(1);
        if (!blockchains.includes(event.target.value)) {
            setBlockchains([...blockchains, event.target.value]);
        } else {
            setBlockchains(blockchains.filter((item) => item !== event.target.value));
        }
    };

    const handleClear = () => {
        setValues({ ...values, maxPrice: marketplace?.metadata?.max, minPrice: marketplace?.metadata?.min });
        // setValues({ ...values, minPrice: '', maxPrice: '' });
        setCleared(!cleared);
    };

    const handleClearSearch = () => {
        setValues({ ...values, search: '' });
        setCleared(!cleared);
    };

    const handleApply = (e?: React.ChangeEvent<HTMLFormElement>) => {
        e?.preventDefault();
        page != 1 && setPage(1);
        handleSubmitFileters();
    };

    const handleSliderChange = (value: any) => {
        setValues({ ...values, minPrice: value[0], maxPrice: value[1] });
    };

    const togglebar = () => {
        setshow(!show);
    };

    const hasMoreItem = () => {
        return marketplace?.metadata?.totalPages > page;
    };

    const handleLoadMore = () => {
        if (loading) {
            return;
        }
        setLoadMore(true);
        setPage(page + 1);
    };

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: hasMoreItem(),
        onLoadMore: handleLoadMore,
        rootMargin: '0px 0px 1000px 0px'
    });

    const onSwitchType = (value: string) => {
        setFromType(value);
        if (value == 'nft') {
            setSelected(sortdata[0]);
        } else {
            setSelected(sortdata2[0]);
        }
    };

    return (
        <div
            className="container pt-12  pb-[98px]"

            // style={{ height: 100 }}
        >
            <h1 className="text-[3rem]">NFT Artwork Collection Marketplace</h1>
            <p className="text-lg text-[#D0D0D2] mb-2">
                There is no better moment than now to join the{' '}
                <span className="text-white font-Proxima-SemiBold inline-block "> 3d NFT Art Collection</span>, which is
                destined to play a significant role in the future economy and create a brand that is prepared for
                enormous development in the future.
                <span className={` ${readmore ? 'visible' : 'hidden'}`}>
                    <span className="text-lg">
                        See why LooBr is preferred by users worldwide to alternative platforms for the advancement of
                        their NFT businesses: freedom from the restrictions of aggregator markets and the hassles of
                        vendor management. One doesn't have to worry about app and web server maintenance or upgrades
                        and may access and administer the business from anywhere as a good{' '}
                        <span className="text-white font-Proxima-SemiBold "> social NFT marketplace</span> .
                    </span>{' '}
                    <span className="text-lg">
                        Increase sales even more by using several strategies and the
                        <span className="text-white font-Proxima-SemiBold "> NFT Collection Dashboard</span> to motivate
                        customers and create urgency without having to be concerned about updating or maintaining the
                        application or the web servers.{' '}
                    </span>
                </span>
                <span
                    className="text-themecolor  inline-block text-lg font-Proxima-SemiBold cursor-pointer ml-1"
                    onClick={() => setReadmore(!readmore)}>
                    {readmore ? 'Read Less' : 'Read More'}
                </span>
            </p>

            <div className="flex gap-0 xl:gap-8 sm:pt-[80px] items-start justify-between relative">
                <i
                    className="absolute top-0 left-0 block p-2 mt-0 text-2xl text-white border border-white rounded-md icon-filter xl:hidden sm:mt-2 sm:top-24"
                    onClick={togglebar}></i>

                <div
                    className={`xl:w-[23.75rem]  xl:p-0 p-6 lg:w-[30%]  sm:w-[40%] w-full xl:block  h-[100%] xl:bg-transparent xl:rounded-none rounded-lg flex-shrink-0 bg-[#14141F] xl:shadow-none shadow-lg hidden fixed top-0  left-0 xl:relative xl:z-[30] z-[99]  overflow-y-auto  ${
                        show === false ? 'hidden' : '!block'
                    }`}>
                    <h3 className=" text-white mb-0 xl:mb-[3.375rem]">Filters</h3>
                    <div className="flex justify-end -mt-5 ">
                        <AiOutlineCloseCircle className={` xl:hidden block text-2xl`} onClick={togglebar} />
                    </div>
                    <MarketPlaceFilters
                        // onChange={handleChange}
                        onClear={handleClear}
                        onApply={handleApply}
                        onSelectCategory={handleSelectCategory}
                        onSelectChain={handleSelectBlockchains}
                        onSelectType={handleSelectTypes}
                        {...values}
                        search={values.search}
                        types={types}
                        fromType={fromType}
                        setFromType={onSwitchType}
                        minPrice={values.minPrice}
                        maxPrice={values.maxPrice}
                        categories={categories}
                        chains={blockchains}
                        onClearSearch={handleClearSearch}
                        onSliderChange={handleSliderChange}
                        debouncedEventHandler={debouncedEventHandler}
                        debouncedNameHandler={debouncedNameHandler}
                    />
                </div>
                <div className="w-full xl:w-[calc(100%-380px)]">
                    <div className="flex flex-row justify-between mb-10 xs:flex-col sm:items-center">
                        <h2 className="text-white text-3xl sm:text-[2.5rem]  pl-14 xl:pl-0 mb-8 sm:mb-0">
                            Marketplace
                        </h2>

                        <div className="flex items-center justify-end gap-4">
                            <FilterComponent
                                className="hidden rounded-[50px]  cursor-pointer "
                                style="!w-[300px] xs:!w-full !m-0 cursor-pointer"
                                data={sortlanddata || []}
                                selected={islandFilter}
                                onSelect={handleIslandFilter}
                                landNums={landNums}
                                sortByIcon
                                view={filterShow}
                            />
                            <Select
                                className="rounded-[50px]  cursor-pointer "
                                style="!w-[220px] xs:!w-full !m-0 cursor-pointer"
                                data={fromType == 'nft' ? sortdata : sortdata2}
                                selected={selected}
                                onSelect={handleSelectSort}
                                sortByIcon
                            />
                            <div className={`flex justify-end gap-4 ${fromType == 'collection' && 'hidden'}`}>
                                <div
                                    onClick={() => {
                                        setToggle(false);
                                    }}
                                    className={` ${
                                        toggle == false ? 'bg-[#20202C]' : 'bg-transparent hover:bg-[#1F1F2C]'
                                    }  cursor-pointer  h-[3.438rem] w-[3.438rem] flex justify-center items-center rounded-full`}>
                                    <i
                                        className={`icon-menuebar2 ${
                                            toggle == false ? 'text-themecolor' : ''
                                        }  text-2xl lg:text-[28px] cursor-pointer`}></i>
                                </div>
                                <div
                                    onClick={() => {
                                        setToggle(true);
                                    }}
                                    className={` ${
                                        toggle == true ? 'bg-[#20202C]' : 'bg-transparent hover:bg-[#1F1F2C]'
                                    }  cursor-pointer h-[3.438rem] w-[3.438rem] flex justify-center items-center rounded-full`}>
                                    <i
                                        className={`icon-menubar  ${
                                            toggle == true ? 'text-themecolor' : ''
                                        }  text-2xl lg:text-[28px] cursor-pointer`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Collections fromType={fromType} name={name} chains={blockchains} selected={selected} />
                    {/* {user && user.userId && <DirectChat />} */}
                </div>
            </div>
        </div>
    );
};

type Props = {
    marketplace: any;
    loading: boolean;
    hasMoreItem: Function;
    sentryRef: any;
    toggle: boolean;
    nfts: any;
};

const MarketPlaceNFTs = ({ marketplace, nfts, loading, hasMoreItem, sentryRef, toggle }: Props) => {
    return (
        <div>
            <div
                className={`${
                    toggle
                        ? 'grid xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xs4:grid-cols-1   mb-10    gap-6 xl:g:gap-3'
                        : 'grid lg:grid-cols-3 sm:grid-cols-2  mb-10    gap-7 lg:gap-10'
                }`}>
                {marketplace &&
                    nfts &&
                    nfts.length > 0 &&
                    nfts.map((item: any) =>
                        toggle ? (
                            <NewCard key={item?._id} where="listing" listing={item} nft={item?.nft} />
                        ) : (
                            <MainCard key={item?._id} where="listing" listing={item} nft={item?.nft} />
                        )
                    )}
            </div>
            {loading && (
                <div
                    className={`${
                        toggle
                            ? 'grid xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 xs4:grid-cols-1   mb-10    gap-6 xl:g:gap-3'
                            : 'grid lg:grid-cols-3 sm:grid-cols-2  mb-10    gap-7 lg:gap-10'
                    }`}>
                    {arr.map((item, i) =>
                        // eslint-disable-next-line react/jsx-key
                        toggle ? <SkeltonCard key={i} /> : <Skelton />
                    )}
                </div>
            )}
            {!loading && isEmpty(marketplace?.listings) && (
                <div className="flex justify-center w-full ">
                    {' '}
                    <Notfound />
                </div>
            )}
            {hasMoreItem() && <div ref={sentryRef}></div>}
        </div>
    );
};
