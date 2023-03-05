import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import MainCard from '../../components/maincard/MainCard';
import { useRouter } from 'next/router';
import Loader from '../../components/loader/Loader';
import { isEmpty } from 'validate.js';
import Notfound from '../../components/notfound/notfound';
import Popups from '../../components/popup/poups';
import axios from 'axios';
import Button from '../../components/Button/Button';
import SelectBlockchain from '../../modules/CreateItemModule/components/SelectBlockchain';
import { useDispatch, useSelector } from 'react-redux';
import blockchains from '../../contractsData/blockchains';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import EditExternalCollection from '../../components/Collections/EditExternalCollection';
import CollectionEdit from '../../components/Collections/CollectionEditdropdown';
import BscIcon from '../../components/icons/BscIcon';
import EthIconDisable from '../../components/icons/EthIconDisable';
import AvalancheDisable from '../../components/icons/AvalancheIconDisable';
import PolygonIconDisable from '../../components/icons/PolygonIconDisable';
import SolanaIconDisable from '../../components/icons/SolanaIconDisable';
import CardanoIconDisable from '../../components/icons/CardanoIconDisable';
import EthIcon from '../../components/icons/EthIcon';
import BscIconDisable from '../../components/icons/BscIconDisable';
import Link from 'next/link';
import NFTAbi from '../../contractsData/Mystery.json';
import { collectionABI } from '../../contractsData/abis';
const Contract = require('web3-eth-contract');
// set provider for all later instances to use
Contract.setProvider('https://eth.getblock.io/mainnet/?api_key=919b6eda-7ddf-4dcd-a034-4c55a6e2e9e1');
import ImageComponent from '../../components/Image/ImageComponent';
import Tabs from '../../modules/ProfileModule/components/Tabs';
import Feeds from './components/FeedsTab';
import NFTsTab from './components/ExtNFTsTab';
import ExtNFTsTab from './components/ExtNFTsTab';
import CollectionInfo from './components/CollectionInfo';
import { getCollectionByAddress } from '../../redux/collections/actions';
import { collectionService } from '../../services/collectios.service';
import debounce from 'lodash.debounce';

const tabs = [
    { name: 'NFTs', current: true },
    { name: 'Feeds', current: true }
];

interface Props {
    collection: any;
    stats: any;
}

export const CollectionContext = React.createContext({});

const CollectionByAddressModule = ({ collection, stats }: Props) => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(0);
    const [nfts, setNfts] = useState<any>(null);
    const [nftsLoading, setNftLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    // const [search, setSearch] = useState<any>('');
    const [statsLoading, setStatsLoading] = useState<any>(false);
    const [owner, setOwner] = useState<any>('');
    const [image, setImage] = useState<any>('');
    const [nft, setNFT] = useState<any>(null);
    const [supply, setSupply] = useState<any>(0);
    const [maxSupply, setMaxSupply] = useState<any>(0);
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    // const collection = useSelector((state: any) => state.collections.collection);
    const collectionLoading = useSelector((state: any) => state.collections.collectionLoading);

    const router = useRouter();
    const { address }: any = router.query;
    const dispatch = useDispatch();

    // const debouncedEventHandler = useMemo(() => debounce(handleChange, 1000), [values]);

    useEffect(() => {
        // address && dispatch(getCollectionByAddress(address));
        // address && getStats(address);
    }, [address]);

    // const fetchCollection = async (address: string) => {
    //     try {
    //         setCollectionLoading(true);
    //         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/external/${address}`);
    //         setCollection(res.data.data);
    //         setCollectionLoading(false);
    //     } catch (error) {
    //         setCollectionLoading(false);
    //     }
    // };

    useEffect(() => {
        if (!collection?.logoPicture && collection?._id && image) {
            updatelogo();
        }
    }, [image]);

    const updatelogo = async () => {
        let t = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image);
        if (t || image.includes('https://loobr.infura-ipfs.io')) {
            await collectionService.UpdateProfile(collection?._id, image);
        }
    };

    const getStats = async (address: string) => {
        try {
            setStatsLoading(true);

            const contract = new Contract(collectionABI, address);
            const owner = await contract.methods.owner().call();
            const supply = await contract.methods.totalSupply().call();
            // const max = await contract.methods.maxSupply().call();
            setOwner(owner);
            setSupply(Number(supply));
            // setMaxSupply(Number(max));

            setStatsLoading(false);
        } catch (error) {
            setStatsLoading(false);
            console.log(error, 'Error price');
        }
    };

    return (
        <div>
            <Head>
                <title>LooBr | Collection Detail</title>
                <meta name={'description'} content={collection?.description} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CollectionContext.Provider value={{ nft, setNFT, image, setImage }}>
                <div>
                    {collectionLoading ? (
                        <div className="flex items-center min-h-screen">
                            <Loader />
                        </div>
                    ) : isEmpty(collection) ? (
                        <Notfound />
                    ) : (
                        <div>
                            <figure className="w-full h-[350px]  Atcollectionbanner AtthemeImage">
                                <ImageComponent
                                    width={1920}
                                    height={350}
                                    key={collection?.coverPicture}
                                    src={collection?.coverPicture}
                                    defaultPlaceholder={'/assets/images/collection-default-cover.png'}
                                    alt={collection?.name}
                                    quality={60}
                                />
                            </figure>
                            <div className="container pb-28">
                                <div className="w-full     mt-[-82px]  mb-24">
                                    <CollectionInfo
                                        collection={{ ...collection, owner, image }}
                                        stats={stats}
                                        // fetchCollection={fetchCollection}
                                    />
                                </div>

                                <Tabs tabs={tabs} activeTabIndex={selectedTabIdx} onActiveTab={setSelectedTabIdx} />
                                {selectedTabIdx == 0 && (
                                    <ExtNFTsTab
                                        setImage={setImage}
                                        collection={collection}
                                        // setSearch={setSearch}
                                        // search={search}
                                    />
                                )}
                                {selectedTabIdx == 1 && <Feeds collection={collection} />}
                            </div>
                        </div>
                    )}
                </div>
            </CollectionContext.Provider>

            <Popups
                show={popup}
                hide={setPopup}
                state={state}
                setstate={setState}
                confirmed={false}
                data={{ collection: { ...collection, owner } }}
            />
        </div>
    );
};

export default CollectionByAddressModule;
