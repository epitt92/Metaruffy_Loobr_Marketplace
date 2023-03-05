import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Stage, Layer, Star, Text, Image as KonvaImage, Rect, Line } from 'react-konva';
import axios from 'axios';

import Image from 'next/image';
import Link from 'next/link';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import KingdomComponent from '../../components/kingdompage/Kingdom';
import LandnameComponent from '../../components/landname/Landname';
import { useWeb3React } from '@web3-react/core';
import useMetaMask from '../../hooks/useMetaMask';
import { useDispatch, useSelector } from 'react-redux';
import Popups from '../../components/popup/poups';
import Marquee from 'react-fast-marquee';
import contracts from '../../contractsData/contracts-details';
const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

import tokens from '../../contractsData/tokens';
import { METAMASK_POPUP } from '../../constants/enums';
import MinlandComponent from './minlandcomponent';
import { getIslands, getLands } from '../../redux/landmap/actions';
import MapComponent from './mapcomponent';
import MapFilter from './mapFilter';
import MapCtrlComponent from './mapCtrls';

const MapPage = () => {
    const stageRef = useRef(null);

    let lastCenter: any = null;
    let lastDist = 0;

    const [filters, setFilters] = useState([true, false, false]);
    const filterData = [
        { id: 1, name: 'Minted Land', value: 0 },
        { id: 2, name: 'My Lands', value: 1 },
        { id: 3, name: 'Listed for Sale', value: 2 }
    ];
    // Blockchain
    const { library, isInstalled, isActive, account, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();
    const [price, setPrice] = useState<any>(0);
    const [popup, setPopup] = useState(false);
    const user = useSelector((state: any) => state.auth.user);
    const topIslandowners = useSelector((state: any) => state.landmap.topIslandOwners);
    const topOneIslandOwners = useSelector((state: any) => state.landmap.topOneIslandOwners);
    const plots = useSelector((state: any) => state.landmap.lands);
    const islands = useSelector((state: any) => state.landmap.islands);
    const islandOwners = useSelector((state: any) => state.landmap.islandOwners);
    const openModal = useMemo(() => popup, [popup]);

    const walletData = useMemo(
        () => ({ ...tokens[1], price: price, switchNetwork, /* chainId: chain, */ flow: METAMASK_POPUP.mint }),
        [account]
    );
    const [state, setState] = useState(-1);
    const modalState = useMemo(() => state, [state]);
    const dispatch = useDispatch();
    const [islandUser, setIslandUser] = useState(null);
    const [landUser, setlandUser] = useState(null);
    const [apiFetching, setApiFetching] = useState(false);
    // Layers
    const [isTreeVis, setTreeVisible] = useState(true);
    const [isMineVis, setMineVisible] = useState(true);
    const [showMyland, setTogMyland] = useState(filters[1]);
    const [showAvailable, setTogAvail] = useState(true);
    const [showMinted, setTogMinted] = useState(filters[0]);
    const [showListed, setTogListed] = useState(filters[2]);
    const [filterShow, setFilterShow] = useState(false);
    // Get NFT data from database
    const [myPlots, setMyPlots] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const [offsetX, setOffsetX] = useState(-4000);
    const [offsetY, setOffsetY] = useState(-3000);

    const [mapWidth, setMapWidth] = useState(window.innerWidth * 0.86);
    const [mapHeight, setMapHeight] = useState(800);

    const [searchX, setSearchX] = useState(0);
    const [searchY, setSearchY] = useState(0);
    const [selNftId, setNftId] = useState<string>('');
    const [searchQry, setSearchQry] = useState<number>(0);

    // Combining estate
    const [selCombinePlots, setSelCombinePlots] = useState([]);
    const [isCombinePlots, setCombinePlots] = useState(false);

    const [selBlock, setSelBlock] = useState(null);
    const searchByPlot = () => {
        try {
            let nftId = parseInt(selNftId);
            setSearchQry(nftId);
        } catch (err) {
            console.log('error in search query');
        }
    };
    const editMyLandHandler = () => {
        if (!account) {
            // console.log(account,"WALLET")
            // alert("wallet not connected")
            setPopup(true);
            setState(7);
        } else {
            setPopup(true);
            setState(102);
        }
    };

    // Combine plots to estate
    const combinePlots = () => {
        if (isCombinePlots === false) {
            setCombinePlots(true);
            setSelBlock(null);
        } else {
            let minX = Math.min(...selCombinePlots.map((item) => item['posX']));
            let minY = Math.min(...selCombinePlots.map((item) => item['posY']));
            let maxX = Math.max(...selCombinePlots.map((item) => item['posX']));
            let maxY = Math.max(...selCombinePlots.map((item) => item['posY']));
            let width = maxX - minX + 1;
            let height = maxY - minY + 1;
            if (width * height === selCombinePlots.length) {
                let data = {
                    posX: minX,
                    posY: minY,
                    width,
                    height,
                    status: selCombinePlots[0]['status'],
                    island: selCombinePlots[0]['island'],
                    owner: account
                };
                axios.post(`${BACKEND_URL}/api/nfts`, data).then((response) => {
                    // setImgNFTs(null)
                });
            } else {
            }
            setSelCombinePlots([]);
            setCombinePlots(false);
        }
    };

    const spliteEstate = () => {
        axios.post(`${BACKEND_URL}/api/nfts/splite`, selBlock).then((response) => {});
    };

    const handleSearchKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            searchByPlot();
        }
    };
    const getIslandsData = async () => {
        dispatch(getIslands());
    };

    useEffect(() => {
        plots &&
            selBlock &&
            Object.keys(plots).map((key, index) => {
                plots[key]['id'] === selBlock['id'] && setSelBlock(plots[key]);
            });
    }, [plots]);

    const getLandsData = async () => {
        dispatch(getLands());
    };

    useEffect(() => {}, []);

    const fetchUserInfo = async () => {
        setApiFetching(true);
        if (!selBlock || !islandOwners) {
            setSelBlock(null);
            setApiFetching(false);
            return;
        }
        try {
            const isListed = contracts.filter(
                (contract) => contract.marketAddress.toUpperCase() === (selBlock['owner'] as any).toUpperCase()
            ).length;
            let newLandUser: any = { isListed };

            let contractAddrs = [
                '0xf97199f79ca6677c3baa20a48320029ba9264b08',
                '0x81FEa6a299FbA9742ebcd6AD4dE7361f92391aBb',
                '0xC4ee3ff221ad2566f30F75087FB519fA740cE7Fe',
                '0x9AEfe5cD9Aaf86E6E04CB7607D795b292bc59ce3'
            ];
            if (isListed) {
                let landUsr = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/marketplace/listingbyToken/${selBlock['landID']}/${
                        contractAddrs[selBlock['network'] - 1]
                    }`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log('island--', landUsr.data.listing);
                newLandUser = { ...landUsr.data.listing, ...newLandUser };
            } else {
                let landUsr = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${selBlock['owner']}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                newLandUser = { ...landUsr.data.data, ...newLandUser };
                newLandUser['info'] = null;
                if (newLandUser.user) {
                    const landInfo = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/user/userByUserName/${newLandUser.user.userName}`,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    newLandUser['info'] = landInfo.data.data;
                }
            }
            setlandUser(newLandUser);
            setIslandUser(topOneIslandOwners[selBlock['island'] - 1]);
            setApiFetching(false);
        } catch (err) {
            console.log('Error in nft selection');
            setSelBlock(null);
            setApiFetching(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [selBlock]);

    // useEffect(() => {
    //     account && axios.get(`${BACKEND_URL}/api/nfts/${account.toUpperCase()}`).then((res) => setMyPlots(res.data));
    // }, [account]);

    const omitAddress = (addr: string) => {
        return addr.substring(0, 4) + '...' + addr.substr(-4);
    };

    const checkMetamask = async () => {
        if (isActive) {
            return true;
        } else if (!isInstalled && window.innerWidth > 480) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
            return false;
        } else if (!isActive) {
            setPopup(true);
            setState(7);
            return false;
        }
    };
    const handleIslandFilter = (val: any) => {
        console.log(val, 'MYLAND');
        if (val.id == 2 && !account) {
            setPopup(true);
            setState(7);
        } else {
            let newFilter = filters;
            newFilter[val['value']] = !newFilter[val['value']];
            setTogMinted(newFilter[0]);
            setTogMyland(newFilter[1]);
            setTogListed(newFilter[2]);
            setFilters(newFilter);
            setFilterShow(true);
        }
    };
    return (
        <div className="pb-5">
            <div className={`${selBlock ? 'hidden sm:block' : ''}`}>
                <div className="flex items-center pt-4 Atmintingmarque overflow-hidden">
                    <Marquee speed={50} direction="left" pauseOnHover={true}>
                        <MinlandComponent />
                    </Marquee>
                </div>

                <div className="pb-24 pt-5 h-full flex gap-12">
                    <div className="m-auto px-5 v-landmap w-full">
                        <div className={`px-5 z-10 absolute flex justify-between mt-5 items-start gap-2`}>
                            <div className={`flex justify-center gap-2 mb-5 flex-wrap sm:flex-nowrap items-center`}>
                                <MapFilter
                                    className="w-[100px] sm:w-[150px] text-[#727279] h-[50px] cursor-pointer "
                                    style="pt-1 !m-0 cursor-pointer"
                                    data={filterData}
                                    selected={filters}
                                    onSelect={handleIslandFilter}
                                    view={filterShow}
                                    sortByIcon
                                />
                                <Button
                                    className="w-[100px] sm:w-[150px] text-[#727279] bg-[#303035] h-[50px] px-3 !py-1 flex gap-x-1.5  flex-col justify-center items-center"
                                    onClick={editMyLandHandler}>
                                    <div className="flex gap-x-1.5 items-center !font-Proxima-Bold">
                                        <span className=""> Edit My Lands </span>{' '}
                                    </div>
                                </Button>
                                {/* <Button
                                onClick={async (e: any) => {
                                    if (!(await checkMetamask())) {
                                        return;
                                    }
                                    setTogMyland(!showMyland);
                                }}
                                className={`${
                                    !showMyland ? 'bg-transparent border-2 border-green-500' : 'bg-green-500'
                                } !text-white rounded-3xl `}>
                                My Land
                            </Button>
                            <Button
                                onClick={(e: any) => {
                                    setTogMinted(!showMinted);
                                }}
                                className={`${
                                    !showMinted ? 'bg-transparent border-2' : 'bg-primary'
                                } !text-white rounded-3xl `}>
                                Minted Land
                            </Button> */}
                            </div>
                            <div className=" flex justify-center mb-5 items-center">
                                <Input
                                    className="w-[100px] sm:w-[150px] text-[#727279] bg-[#303035] text-white text-xl h-[50px] pl-[1.813rem] py-4 placeholder:text-xl "
                                    placeholder="Search"
                                    styles="  "
                                    name="search"
                                    value={selNftId}
                                    onchange={(e: any) => setNftId(e.target.value)}
                                    onKeyDown={(e: any) => handleSearchKeyDown(e)}
                                    type="text"
                                />
                                <button className="search search-submit" onClick={searchByPlot} title="Search">
                                    <i className="icon-fl-search-filled"></i>
                                </button>
                            </div>
                            <div className="flex flex-wrap sm:flex-nowrap justify-center mb-5 items-center gap-2">
                                <Button
                                    className="w-[100px] sm:w-[150px] text-[#727279] bg-[#303035] h-[50px] px-3 !py-1 flex gap-x-1.5  flex-col justify-center items-center"
                                    onClick={() => {
                                        setPopup(true);
                                        setState(100);
                                    }}>
                                    <div className="flex gap-x-1.5 items-center !font-Proxima-Bold">
                                        <span className=""> TOP 20 LANDOWNER </span>{' '}
                                    </div>
                                </Button>

                                {/* <Link href="/leaderboard" legacyBehavior>
                                <a> */}
                                <Button
                                    className="w-[100px] sm:w-[150px] text-[#727279] bg-[#303035] h-[50px] px-3 !py-1 flex gap-x-1.5  flex-col justify-center items-center"
                                    onClick={() => {
                                        setPopup(true);
                                        setState(101);
                                    }}>
                                    <div className="flex gap-x-1.5 items-center !font-Proxima-Bold">
                                        <span className="">LEADERBOARD</span>{' '}
                                    </div>
                                </Button>
                                {/* </a>
                            </Link> */}
                                <Link href="/toplandowner" legacyBehavior>
                                    <Button className="hidden rounded-3xl h-[50px] px-3 !py-1 flex gap-x-1.5  flex-col justify-center items-center">
                                        <div className="flex gap-x-1.5 items-center !font-Proxima-Bold">
                                            {/* <ImageComponent src="/assets/images/region.png" className="!mt-2" height={35} width={30} /> */}
                                            <span className=""> Leaderboard</span>{' '}
                                        </div>
                                        {/* <span className="text-center !ml-8">Leaderboard</span> */}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <figure className="mt-1 flex-shrink-0 relative  sm:rounded-[10px] overflow-hidden">
                            {typeof window !== 'undefined' && (
                                <MapComponent
                                    selBlock={selBlock}
                                    setSelBlock={setSelBlock}
                                    initX={offsetX}
                                    initY={offsetY}
                                    showMyland={showMyland}
                                    showMinted={showMinted}
                                    showListed={showListed}
                                    searchQry={searchQry}
                                />
                            )}
                        </figure>
                    </div>
                </div>
            </div>
            {selBlock && (
                <LandnameComponent
                    land={selBlock}
                    getLandsData={getLandsData}
                    owner={omitAddress(selBlock['owner'] as string)}
                    addr={account && `${selBlock['owner']}`.toUpperCase()}
                    user={landUser}
                    setSelBlock={setSelBlock}
                    loading={apiFetching}
                />
            )}
            {selBlock && (
                <KingdomComponent
                    owner={islandOwners && omitAddress(islandOwners[selBlock['island'] - 1]['owner'] as string)}
                    user={islandUser && islandUser}
                    island={islands && islands[selBlock['island'] - 1]}
                    getIslandsData={getIslandsData}
                    addr={islandOwners && `${islandOwners[selBlock['island'] - 1]['owner']}`.toUpperCase()}
                    loading={apiFetching}
                    topOwners={topIslandowners && topIslandowners[selBlock['island'] - 1]}
                    setSelBlock={setSelBlock}
                />
            )}
            {state > 0 && (
                <Popups
                    show={openModal}
                    hide={setPopup}
                    state={modalState}
                    setstate={setState}
                    data={walletData}
                    type="nft"
                />
            )}
        </div>
    );
};

export default memo(MapPage);
