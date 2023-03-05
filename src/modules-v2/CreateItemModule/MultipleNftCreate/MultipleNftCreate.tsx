import Head from 'next/head';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/Button/Button';
import Input from '../../../components/input/Input';
import Label from '../../../components/label/Label';
import { createNftLoading } from '../../../redux/nft/actions';
import useMetaMask from '../../../hooks/useMetaMask';
import NFTAbi from '../../../contractsData/NFT.json';
import { create } from 'ipfs-http-client';
import Popups from '../../../components/popup/poups';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getMYOwnNft } from '../../../redux/user/actions';
import Collections from '../Collections';
import { isEmpty, validate } from 'validate.js';
import useAudio from '../../../hooks/useAudio';
import Image from 'next/image';
import { createNftSchema } from '../../../validations';
import Loader from '../../../components/loader/Loader';
import { Contract } from 'ethers';
import { sample } from '../../../data/nftSample';
import { fetchImage, getMarketDetailsByChainId, isJsonString } from '../../../utils/functions';
import { useWeb3React } from '@web3-react/core';
import Select from '../components/Select';
import SelectBlockchain from '../components/SelectBlockchain';
import BscIcon from '../../../components/icons/BscIcon';
import EthIcon from '../../../components/icons/EthIcon';
import Avalanche from '../../../components/icons/AvalancheIcon';
import PolygonIcon from '../../../components/icons/PolygonIcon';
import SolanaIcon from '../../../components/icons/SolanaIcon';
import CardanoIcon from '../../../components/icons/CardanoIcon';
import withAuth from '../../../components/Hoc/withAuth';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import ImageComponent from '../../../components/Image/ImageComponent';

type Props = {};
type NFT = {
    image: string;
    name: string;
    description: string;
    attributes: string[];
    categories: string[];
    collectionId: string;
};
type State = {
    fActiveIndex: number;
    nfts: NFT[];
};

const auth =
    'Basic ' +
    Buffer.from(
        process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_SECRET
    ).toString('base64');
const client: any = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization: auth
    }
});

const MultipleNftCreate = ({}: Props) => {
    const { chainId } = useWeb3React();
    const { library, account, switchNetwork }: any = useMetaMask();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState<any>(-1);
    const [txHash, setTxHash] = useState('');
    const [cActiveIndex, setcActiveIndex] = useState(0); /* Active collection index */
    const [playing, play] = useAudio('/LOOBR_MINT_COMPLETE_SOUND.mp3');
    const [files, setFiles] = useState<File[]>([]);
    const [fileLoading, setFilesLoading] = useState<any>(false);
    // const [uploaded, setUploaded] = useState<string[]>([]);
    const [preview, setPreview] = useState<string>('');
    const [values, setValues] = useState<State>({
        fActiveIndex: 0,
        nfts: []
    });
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [progress, setProgress] = useState<any>(0);
    const [fPogress, setFProgress] = useState<any>(0);
    const [pCopiedIndex, setPCopiedIndex] = useState<any>(-1);
    const [deleteIndex, setDeleteIndex] = useState<any>(0);
    const [dCopiedIndex, setDCopiedIndex] = useState<any>(-1);
    const [declare, setDeclare] = useState<boolean>(false);
    const [terms, setTerms] = useState<boolean>(false);
    const [selectedBlockchain, setBloackchain] = useState(blockchains.find((item) => item?.chainId == chainId));

    const router = useRouter();

    const [attributes, setAttributes] = useState([]);
    const [categories, setCategories] = useState<any>([]);
    const ChecktypeData = ['Artwork', 'Virtual Land', 'RuffyWorld Assets', 'Physical Artwork'];
    const fileRef: any = useRef();

    const collections = useSelector((state: any) => state.collections.collections);

    const nftPropertiesHandler = (obj: any) => {
        const activeIndex = values.fActiveIndex;
        const selectedItem = values.nfts[activeIndex];
        let props: any = [...values.nfts[values.fActiveIndex].attributes];
        props.push(...obj);
        let item = {
            ...selectedItem,
            attributes: props
        };

        let arr = [...values.nfts];
        arr[activeIndex] = item;

        setValues({ ...values, nfts: arr });

        setPopup(false);
    };
    console.log(values);

    const loading = useSelector((state: any) => state.nft.createNftLoading);
    const user = useSelector((state: any) => state.auth.user);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        const chain = blockchains.find((item) => item.chainId == chainId);
        setBloackchain(chain);
    }, [chainId]);

    useEffect(() => {
        values.nfts.length ? setPreview(values.nfts[values.fActiveIndex].image) : setPreview('');
    }, [values.fActiveIndex, values.nfts]);

    useEffect(() => {
        const nfts = [...values.nfts];
        const arr = nfts.map((item) => (item.categories = categories));
    }, [categories]);

    useEffect(() => {
        const nfts: NFT[] = [...values.nfts];
        const arr = !isEmpty(collections?.collections)
            ? nfts.map((item) => ({ ...item, collectionId: collections?.collections[cActiveIndex]._id }))
            : nfts;

        setValues({ ...values, nfts: arr });
    }, [cActiveIndex]);

    useEffect(() => {
        const errors = validate(
            {
                ...values.nfts[values.fActiveIndex],
                categories,
                collectionId: collections?.collections && collections?.collections[cActiveIndex],
                files:
                    values.nfts.length < 2 ||
                    values.nfts.length >
                        ((collections?.collections && collections?.collections[cActiveIndex]?.numberOfNfts) || 100)
                        ? ''
                        : values.nfts.length,
                terms: terms ? terms : '',
                declare: declare ? declare : ''
            },
            createNftSchema
        );

        setErrors({ ...(errors || {}) });
    }, [cActiveIndex, categories, collections, files, values, terms, declare]);
    console.log(values);

    const cPromise = (promises: any, progress_cb: Function) => {
        let d = 0;
        progress_cb(0);
        for (const p of promises) {
            p.then((res: any) => {
                // console.log(res, "res");
                d++;
                progress_cb((d * 100) / promises.length);
            });
        }
        return Promise.all(promises);
    };

    const handleSelectBlockchain = (value: any) => {
        setBloackchain(value);
        switchNetwork(value?.chainId);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const activeIndex = values.fActiveIndex;
        const selectedItem = values.nfts[activeIndex];
        let item = {
            ...selectedItem,
            [event.target.name]: event.target.value
        };

        let arr = [...values.nfts];
        arr[activeIndex] = item;

        setValues({ ...values, nfts: arr });
    };

    const handleCopytoAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.checked) {
            if (e.target.name === 'description-check') {
                values.fActiveIndex === dCopiedIndex && setDCopiedIndex(-1);
            }
            if (e.target.name === 'properties-check') {
                values.fActiveIndex === pCopiedIndex && setPCopiedIndex(-1);
            }
            return;
        }
        if (e.target.name === 'description-check') {
            const nfts = [...values.nfts];
            const arr = nfts.map((item) => (item.description = nfts[values.fActiveIndex].description));
            setDCopiedIndex(values.fActiveIndex);
        }
        if (e.target.name === 'properties-check') {
            const nfts = [...values.nfts];
            const arr = nfts.map((item) => (item.attributes = nfts[values.fActiveIndex].attributes));
            setPCopiedIndex(values.fActiveIndex);
        }
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleCategories = (e: any, value: string) => {
        if (e.target.checked) {
            setCategories([value]);
        } else {
            setCategories([]);
        }
    };

    const hasCollectionsError = () => {
        if (
            !isEmpty(collections) &&
            collections?.collections[cActiveIndex]?.numberOfNfts <
                collections?.collections[cActiveIndex]?.count + values.nfts.length
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleValidations = () => {
        enabledTouchedValues();
        if (!isEmpty(errors)) {
            return false;
        }

        if (hasCollectionsError()) {
            toast.error('This collection reached the maximum number of NFTs.');
            return false;
        }

        const index = values.nfts.findIndex((item) => item.name == '');
        if (index !== -1) {
            setValues({ ...values, fActiveIndex: index });
            return false;
        }

        if (!isAuthenticated) {
            setPopup(true);
            setState(1);
            return false;
        }

        if (!user?.isEmailVerified) {
            setPopup(true);
            setState(36);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!handleValidations()) {
            return;
        }

        setPopup(true);
        setState(14);

        const promises: any = [];

        values.nfts.forEach((element) => {
            promises.push(client.add(JSON.stringify(element)));
        });

        const results2 = await cPromise(promises, (p: any) => {
            setProgress(p);
        });

        const uris: any = results2.map((item) => `https://loobr.infura-ipfs.io/ipfs/${item.path}`);

        handleCreateNFT(uris);
    };

    const getProperties = (attributes: []) => {
        const arr: any = [];
        attributes.forEach((p: { trait_type: string; value: string }) => {
            if (!!p.trait_type && !!p.value) {
                const property = { trait_type: p.trait_type, value: p.value };
                arr.push(property);
            }
        });
        return arr;
    };

    const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!values.nfts.length) {
                toast.error(`Upload the images before uploading the json file.`);
                return;
            }
            const nfts: NFT[] = [...values.nfts];
            const fileReader = new FileReader();
            e.target.files && fileReader?.readAsText(e.target.files[0], 'UTF-8');
            fileReader.onload = (event: any) => {
                if (typeof event.target?.result === 'string' && isJsonString(event.target?.result)) {
                    const data: any[] = JSON.parse(event.target?.result);
                    if (
                        data &&
                        data.every((item) =>
                            ['description', 'image', 'name', 'attributes'].every(
                                (p) =>
                                    Object.keys(item).includes(p) &&
                                    item.attributes.some((prop: any) =>
                                        ['trait_type', 'value'].every((t) => Object.keys(prop).includes(t))
                                    )
                            )
                        )
                    ) {
                        toast.success('File uploaded');
                        const latest: any = nfts.map((item, i) => ({
                            ...item,
                            ...(data[i]?.description && { description: data[i]?.description }),
                            ...(data[i]?.name && { name: data[i]?.name }),
                            ...(data[i]?.attributes && {
                                attributes: getProperties(data[i]?.attributes)
                            }),
                            collectionId: collections?.collections[cActiveIndex]?._id
                        }));

                        setValues({ ...values, nfts: latest });
                    } else {
                        toast.error(`File format is not correct, download the sample file.`);
                    }
                } else {
                    toast.error(`File format is not correct, download the sample file.`);
                }
            };
        } catch (error) {
            toast.error(`File format is not correct, download the sample file.`);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setFilesLoading(true);
            const items: NFT[] = [];
            const filesArr = e.target.files;

            const promises = [];
            if (filesArr) {
                for (let file of filesArr) {
                    promises.push(client.add(file));
                }
            }
            const paths = await cPromise(promises, (p: any) => {
                setFProgress(p);
            });
            console.log(paths, 'paths');

            paths.forEach((path, i) => {
                items.push({
                    image: `https://loobr.infura-ipfs.io/ipfs/${path.path}`,
                    name: `image ${values.nfts.length + i + 1}`,
                    description: '',
                    attributes: [],
                    categories: categories,
                    collectionId: !isEmpty(collections?.collections) ? collections?.collections[cActiveIndex]?._id : ''
                });
            });
            const nfts = [...values.nfts, ...items];
            setValues({
                ...values,
                nfts: nfts,
                fActiveIndex: items.length - 1
            });

            setFilesLoading(false);
        } catch (error) {
            setFilesLoading(false);

            console.log('Error uploading file: ', error);
        }
    };

    const handleDeleteFile = (index: number) => {
        const newValues = [...values.nfts];
        newValues.splice(index, 1);

        setValues({
            ...values,
            nfts: newValues,
            fActiveIndex: values.fActiveIndex > 0 ? values.fActiveIndex - 1 : 0
        });
        setPopup(false);
        setState(-1);
    };

    const getValuesFromLocal = async () => {
        const data = localStorage.getItem('values');
        if (data) {
            setValues(JSON.parse(data));
        }
    };

    const getCategoriesFromLocal = async () => {
        const data = localStorage.getItem('categories');
        // console.log(data, "categories");

        if (data) {
            setCategories(JSON.parse(data));
        }
        // }
    };

    useEffect(() => {
        getValuesFromLocal();
        getCategoriesFromLocal();
    }, []);

    useEffect(() => {
        localStorage.setItem('values', JSON.stringify(values));
    }, [values]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);

    const enabledTouchedValues = () => {
        const newState: any = {};
        Object.keys(errors).forEach((item) => {
            newState[item] = true;
        });
        setTouched(newState);
    };

    const handleCreateNFT = async (uri: string) => {
        try {
            dispatch(createNftLoading(true));

            const signer = library?.getSigner();
            // @ts-ignore
            const contract = new Contract(getMarketDetailsByChainId(chainId)?.nftAddress, NFTAbi.abi, signer);

            const nft = await contract.multiMint(uri, account);
            let tx = await nft.wait();
            let event = tx.events[0];
            let value = event.args[2];
            let hash = tx.events[0].transactionHash;

            setTxHash(hash);
            play();
            dispatch(createNftLoading(false));
            const filters = { filter: 'CREATOR' };
            dispatch(getMYOwnNft(filters, account));
            localStorage.removeItem('values');
            localStorage.removeItem('categories');
            localStorage.removeItem('complete');

            router.push(`/profile/${user?.userName}`);
        } catch (error: any) {
            dispatch(createNftLoading(false));
            toast.error(error?.reason || error?.data?.message || error?.message);
            setPopup(false);
        }
    };

    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(sample))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = 'data.json';
        link.click();
    };

    const handleDeleteAll = () => {
        setValues({
            fActiveIndex: 0,
            nfts: []
        });
        fileRef.current.value = null;
        setPopup(false);
        setState(-1);
    };

    console.log(state, 'state');

    return (
        <>
            <Head>
                <title>LooBr | Create Item</title>
            </Head>
            <form onSubmit={handleSubmit} key="create-item">
                <section className="bg-[url('/assets/images/create-item-bg.svg')] bg-no-repeat bg-[length:100%_1001px]">
                    <div className="pt-28 pb-40">
                        <div className="container 2xl:min-w-[840px] 2xl:max-w-[840px] sm:w-[53rem]  w-[45rem] xs:w-[23rem]  lg:!pl-0 lg:!pr-0 md:!pl-0 md:!pr-0">
                            <h3 className="text-white mb-2 text-[1.75rem]">Create Multiple NFTs</h3>
                            <p className="mb-7 text-[#a1a1a5] text-base">
                                Start minting your one of a kind NFT and enjoy!
                            </p>
                            {/* <PriceLogos height="30" width="30" /> */}
                            <SelectBlockchain
                                data={blockchains}
                                onSelect={handleSelectBlockchain}
                                selected={selectedBlockchain}
                            />
                            <h6 className="text-white text-base mt-8 mb-3">Upload File</h6>

                            <div className="sm:flex items-start gap-3 mb-5">
                                <div className="w-full">
                                    <label className="relative cursor-pointer border-2  w-full h-[350px] flex items-stretch justify-center overflow-hidden border-dashed border-[#2B2B35] hover:border-[#595959] rounded-[1.5rem]">
                                        {fileLoading ? (
                                            <div className="flex flex-col p-4">
                                                <p>Processed: {Number(fPogress).toFixed()}%</p>
                                                <Loader />
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    onClick={(event: any) => {
                                                        event.target.value = null;
                                                    }}
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="w-0 absolute "
                                                    onChange={handleFileChange}
                                                />
                                                <div className="flex flex-col justify-center p-6 items-center  CreateNftImage ">
                                                    <div>
                                                        <div className="flex justify-center">
                                                            <Image
                                                                src="/assets/images/icons/upload-icon.svg"
                                                                width={60}
                                                                height={47}
                                                            />
                                                        </div>
                                                        <p className="text-white  text-lg mt-4 text-center">
                                                            Upload 2-100 NFTs
                                                        </p>
                                                        <p className=" text-sm capitalize text-lightgray text-center ">
                                                            Png, Gif, WEBP etc. Max 20mb.
                                                        </p>

                                                        <Button className="text-[#F1C94A] !py-2.5 bg-[#2A2623] rounded-[13px] ml-4  mt-4 pointer-events-none">
                                                            Choose Files
                                                        </Button>
                                                        <p className=" text-sm capitalize mt-24 text-lightgray text-center ">
                                                            Recommended size: 512px x 512px
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                    <span className="text-red-500 mt-2 block ">
                                        {hasError('files')
                                            ? `Files should be between 2 to ${
                                                  isEmpty(collections?.collections)
                                                      ? 100
                                                      : collections?.collections[cActiveIndex]?.numberOfNfts
                                              } and should not be empty`
                                            : null}
                                    </span>
                                </div>

                                <label className="relative cursor-pointer border-2  w-full h-[350px]  flex items-stretch justify-center overflow-hidden border-dashed border-[#2B2B35] hover:border-[#595959] rounded-[1.5rem] ">
                                    <input
                                        type="file"
                                        accept="application/JSON"
                                        className="w-0 absolute "
                                        onChange={handleJsonUpload}
                                        ref={fileRef}
                                    />
                                    <div className="flex flex-col  p-6  items-center  justify-center CreateNftImage ">
                                        <div>
                                            <div className="flex justify-center">
                                                <Image
                                                    src="/assets/images/icons/upload-icon.svg"
                                                    width={60}
                                                    height={47}
                                                />
                                            </div>
                                            <p className="text-white  text-lg mt-4 text-center">Upload 2-100 NFTs</p>
                                            <p className=" text-sm capitalize text-lightgray text-center">JSON</p>
                                            <Button className="text-[#F1C94A] !py-2.5 bg-[#2A2623] rounded-[13px]   mt-4 pointer-events-none">
                                                Choose Files
                                            </Button>
                                            <a
                                                // href="#"
                                                onClick={() => {
                                                    exportData();
                                                    // downloadFile();
                                                }}
                                                className=" text-md capitalize text-themecolor block text-center mt-24 ">
                                                Download sample file
                                            </a>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {!isEmpty(values.nfts) && (
                            <div className="container 2xl:min-w-[840px] 2xl:max-w-[840px] sm:w-[53rem]  lg:!pl-0 lg:!pr-0 md:!pl-0 md:!pr-0 relative">
                                <div className="border-2 border-gray4 rounded-3xl overflow-hidden pb-6  ">
                                    <div className="flex border-b-2 border-gray4 bg-[#191926] py-4 px-10   justify-between items-center ">
                                        <h6 className="text-xl font-Proxima-SemiBold text-white">NFT</h6>
                                        <div className="flex ">
                                            {/* <h6 className="text-xl font-Proxima-SemiBold text-white mt-3  mr-5">Actions</h6> */}
                                            <span
                                                onClick={() => {
                                                    setDeleteIndex(-1);
                                                    setPopup(true);
                                                    setState(80);
                                                }}
                                                className="cursor-pointer">
                                                <Button className="text-lg rounded-xl bg-transparent border  !px-2 !py-2 !text-white border-themecolor  font-Proxima-SemiBold ">
                                                    Clear all
                                                </Button>
                                                {/* <svg
                                                    width="18"
                                                    height="19"
                                                    viewBox="0 0 18 19"
                                                    fill="red"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9.00156 0.375C9.75631 0.374894 10.4838 0.656935 11.0413 1.16575C11.5987 1.67456 11.9458 2.37338 12.0145 3.125H16.7016C16.9106 3.12506 17.1118 3.20447 17.2645 3.34717C17.4173 3.48987 17.5101 3.68523 17.5244 3.89377C17.5386 4.10231 17.4732 4.30848 17.3413 4.47063C17.2094 4.63278 17.0208 4.73881 16.8138 4.7673L16.7016 4.775H16.0603L14.6666 16.853C14.6045 17.3891 14.3475 17.8838 13.9445 18.2427C13.5415 18.6017 13.0206 18.8001 12.4809 18.8H5.52226C4.98254 18.8001 4.46163 18.6017 4.05862 18.2427C3.65561 17.8838 3.39863 17.3891 3.33656 16.853L1.94176 4.775H1.30156C1.1022 4.77499 0.909586 4.70279 0.759339 4.57176C0.609091 4.44072 0.511376 4.25971 0.484262 4.0622L0.476562 3.95C0.476571 3.75064 0.548769 3.55802 0.679806 3.40778C0.810843 3.25753 0.991853 3.15981 1.18936 3.1327L1.30156 3.125H5.98866C6.05728 2.37338 6.40439 1.67456 6.96184 1.16575C7.51929 0.656935 8.24682 0.374894 9.00156 0.375ZM7.35156 7.25C7.08206 7.25 6.85656 7.4205 6.81036 7.6449L6.80156 7.7318V14.4693L6.81036 14.5551C6.85656 14.7795 7.08206 14.95 7.35156 14.95C7.62106 14.95 7.84656 14.7795 7.89276 14.5551L7.90156 14.4682V7.7329L7.89276 7.6449C7.84656 7.4216 7.62106 7.25 7.35156 7.25ZM10.6516 7.25C10.3821 7.25 10.1566 7.4205 10.1104 7.6449L10.1016 7.7318V14.4693L10.1104 14.5551C10.1566 14.7795 10.3821 14.95 10.6516 14.95C10.9211 14.95 11.1466 14.7795 11.1928 14.5551L11.2016 14.4682V7.7329L11.1928 7.6449C11.1466 7.4216 10.9211 7.2511 10.6516 7.2511V7.25ZM9.00156 2.025C8.33606 2.025 7.78056 2.498 7.65406 3.125H10.3491C10.2215 2.498 9.66706 2.025 9.00156 2.025Z"
                                                        fill="#727279"
                                                    />
                                                </svg> */}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        {values.nfts.map((item: NFT, i: number) => (
                                            <div
                                                className={`flex justify-between px-10 py-2 mt-[10px]  cursor-pointer ${
                                                    i === values.fActiveIndex && 'bg-[#1b1b29]'
                                                }`}
                                                key={i}>
                                                <div
                                                    className="flex gap-3 items-center w-full"
                                                    onClick={() =>
                                                        setValues({
                                                            ...values,
                                                            fActiveIndex: i
                                                        })
                                                    }>
                                                    <ImageComponent
                                                        width={32}
                                                        height={32}
                                                        src={values.nfts[i]?.image}
                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                        alt=""
                                                        className="rounded-lg"
                                                    />

                                                    <p className="font-Proxima-SemiBold text-white text-base flex items-center gap-4">
                                                        {item?.name || `image ${i + 1}`}{' '}
                                                        {values.nfts[i]?.name ? (
                                                            <svg
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 22 22"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M11 0.5C5.20156 0.5 0.5 5.20156 0.5 11C0.5 16.7984 5.20156 21.5 11 21.5C16.7984 21.5 21.5 16.7984 21.5 11C21.5 5.20156 16.7984 0.5 11 0.5ZM15.5352 7.57109L10.5992 14.4148C10.5302 14.5111 10.4393 14.5896 10.3339 14.6437C10.2286 14.6978 10.1118 14.7261 9.99336 14.7261C9.87491 14.7261 9.75816 14.6978 9.6528 14.6437C9.54743 14.5896 9.45649 14.5111 9.3875 14.4148L6.46484 10.3648C6.37578 10.2406 6.46484 10.0672 6.61719 10.0672H7.71641C7.95547 10.0672 8.18281 10.182 8.32344 10.3789L9.99219 12.6945L13.6766 7.58516C13.8172 7.39062 14.0422 7.27344 14.2836 7.27344H15.3828C15.5352 7.27344 15.6242 7.44688 15.5352 7.57109Z"
                                                                    fill="#19B100"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                width="22"
                                                                height="22"
                                                                viewBox="0 0 22 22"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M11 0.5C5.20156 0.5 0.5 5.20156 0.5 11C0.5 16.7984 5.20156 21.5 11 21.5C16.7984 21.5 21.5 16.7984 21.5 11C21.5 5.20156 16.7984 0.5 11 0.5ZM15.5352 7.57109L10.5992 14.4148C10.5302 14.5111 10.4393 14.5896 10.3339 14.6437C10.2286 14.6978 10.1118 14.7261 9.99336 14.7261C9.87491 14.7261 9.75816 14.6978 9.6528 14.6437C9.54743 14.5896 9.45649 14.5111 9.3875 14.4148L6.46484 10.3648C6.37578 10.2406 6.46484 10.0672 6.61719 10.0672H7.71641C7.95547 10.0672 8.18281 10.182 8.32344 10.3789L9.99219 12.6945L13.6766 7.58516C13.8172 7.39062 14.0422 7.27344 14.2836 7.27344H15.3828C15.5352 7.27344 15.6242 7.44688 15.5352 7.57109Z"
                                                                    fill="#383b4f"
                                                                />
                                                            </svg>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                    <span
                                                        onClick={() =>
                                                            setValues({
                                                                ...values,
                                                                fActiveIndex: i
                                                            })
                                                        }>
                                                        <svg
                                                            width="23"
                                                            height="21"
                                                            viewBox="0 0 23 21"
                                                            fill="red"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M0.5625 19.3125H22.4375V20.875H0.5625V19.3125ZM18.8438 6.03125C19.4688 5.40625 19.4688 4.46875 18.8438 3.84375L16.0312 1.03125C15.4062 0.40625 14.4688 0.40625 13.8438 1.03125L2.125 12.75V17.75H7.125L18.8438 6.03125ZM14.9375 2.125L17.75 4.9375L15.4062 7.28125L12.5938 4.46875L14.9375 2.125ZM3.6875 16.1875V13.375L11.5 5.5625L14.3125 8.375L6.5 16.1875H3.6875Z"
                                                                fill="#727279"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span
                                                        onClick={() => {
                                                            setDeleteIndex(i);
                                                            setPopup(true);
                                                            setState(80);
                                                        }}>
                                                        <svg
                                                            width="18"
                                                            height="19"
                                                            viewBox="0 0 18 19"
                                                            fill="red"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M9.00156 0.375C9.75631 0.374894 10.4838 0.656935 11.0413 1.16575C11.5987 1.67456 11.9458 2.37338 12.0145 3.125H16.7016C16.9106 3.12506 17.1118 3.20447 17.2645 3.34717C17.4173 3.48987 17.5101 3.68523 17.5244 3.89377C17.5386 4.10231 17.4732 4.30848 17.3413 4.47063C17.2094 4.63278 17.0208 4.73881 16.8138 4.7673L16.7016 4.775H16.0603L14.6666 16.853C14.6045 17.3891 14.3475 17.8838 13.9445 18.2427C13.5415 18.6017 13.0206 18.8001 12.4809 18.8H5.52226C4.98254 18.8001 4.46163 18.6017 4.05862 18.2427C3.65561 17.8838 3.39863 17.3891 3.33656 16.853L1.94176 4.775H1.30156C1.1022 4.77499 0.909586 4.70279 0.759339 4.57176C0.609091 4.44072 0.511376 4.25971 0.484262 4.0622L0.476562 3.95C0.476571 3.75064 0.548769 3.55802 0.679806 3.40778C0.810843 3.25753 0.991853 3.15981 1.18936 3.1327L1.30156 3.125H5.98866C6.05728 2.37338 6.40439 1.67456 6.96184 1.16575C7.51929 0.656935 8.24682 0.374894 9.00156 0.375ZM7.35156 7.25C7.08206 7.25 6.85656 7.4205 6.81036 7.6449L6.80156 7.7318V14.4693L6.81036 14.5551C6.85656 14.7795 7.08206 14.95 7.35156 14.95C7.62106 14.95 7.84656 14.7795 7.89276 14.5551L7.90156 14.4682V7.7329L7.89276 7.6449C7.84656 7.4216 7.62106 7.25 7.35156 7.25ZM10.6516 7.25C10.3821 7.25 10.1566 7.4205 10.1104 7.6449L10.1016 7.7318V14.4693L10.1104 14.5551C10.1566 14.7795 10.3821 14.95 10.6516 14.95C10.9211 14.95 11.1466 14.7795 11.1928 14.5551L11.2016 14.4682V7.7329L11.1928 7.6449C11.1466 7.4216 10.9211 7.2511 10.6516 7.2511V7.25ZM9.00156 2.025C8.33606 2.025 7.78056 2.498 7.65406 3.125H10.3491C10.2215 2.498 9.66706 2.025 9.00156 2.025Z"
                                                                fill="#727279"
                                                            />
                                                        </svg>
                                                    </span>
                                                    {/* <Delete onDelete={handleDeleteFile} index={i} /> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className=" w-full 2xl:w-[21.75rem]  mt-8 2xl:mt-0 2xl:absolute left-[103%] 2xl:left-[106%] top-0 ">
                                    <h6 className="text-white text-base">NFT Preview</h6>
                                    <div className="h-[14.37rem] 2xl:w-[14.37rem] relative overflow-hidden rounded-3xl bg-[#1E1E2B] mt-4 flex basis-auto  justify-center">
                                        {preview && (
                                            // <div className="flex basis-auto  justify-center">
                                            <Image
                                                src={preview}
                                                layout="fill"
                                                objectFit="cover"
                                                alt=""
                                                className="max-h-full max-w-full relative"
                                            />
                                            // </div>
                                        )}
                                    </div>
                                    <Label htmlFor="id_title" className="mt-8 mb-2">
                                        Title
                                    </Label>
                                    <Input
                                        name="name"
                                        placeholder="NFT Title"
                                        id="id_title"
                                        maxLength={25}
                                        value={values.nfts[values.fActiveIndex]?.name || ''}
                                        onchange={handleChange}
                                        className="h-[3.75rem]"
                                        onBlur={handleBlur}
                                        error={hasError('name')}
                                        helperText={hasError('name') ? errors.name[0] : null}
                                    />

                                    <Label htmlFor="id_title" className="mt-8 mb-2">
                                        Description{' '}
                                        <span className="font-Proxima-Regular text-lightgray">(Optional)</span>
                                    </Label>
                                    <Input
                                        name="description"
                                        onchange={handleChange}
                                        value={values.nfts[values.fActiveIndex]?.description}
                                        placeholder='e.g. this NFT looks great"'
                                        id="id_title"
                                        className="h-[3.75rem]"
                                    />
                                    <div className="flex items-start  mt-3 Atcheckbox ">
                                        <label className="h-[25px] w-[25px] hidden">
                                            <input
                                                id="dp1"
                                                type="checkbox"
                                                className={` `}
                                                name="description-check"
                                                onChange={handleCopytoAll}
                                                checked={dCopiedIndex === values.fActiveIndex}
                                            />
                                            <span></span>
                                        </label>
                                        {dCopiedIndex ? (
                                            <label
                                                htmlFor="dp1"
                                                className="text-base text-white cursor-pointer font-Circular-Book inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 rounded-lg bg-themecolor relative text-black2  , undefined, rounded-full py-2 mt-1 px-6 gold ">
                                                Copy to all
                                            </label>
                                        ) : (
                                            <label
                                                htmlFor="dp1"
                                                className="text-base text-white cursor-pointer font-Circular-Book inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 rounded-lg bg-transparent border border-themecolor text-themecolor relative text-black2  , undefined, rounded-full py-2 mt-1 px-6 gold ">
                                                <svg
                                                    width="14"
                                                    height="11"
                                                    viewBox="0 0 14 11"
                                                    className="mr-3"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M13.7137 0H12.0301C11.6639 0 11.3157 0.169508 11.1003 0.460092L5.45704 8.00146L2.90106 4.58363C2.68567 4.29651 2.34104 4.12354 1.97129 4.12354H0.287643C0.0543026 4.12354 -0.0821121 4.37953 0.0543026 4.56288L4.52727 10.5406C4.63293 10.6827 4.77223 10.7986 4.93362 10.8784C5.095 10.9583 5.27381 11 5.45525 11C5.63668 11 5.81549 10.9583 5.97688 10.8784C6.13826 10.7986 6.27756 10.6827 6.38322 10.5406L13.9435 0.439337C14.0835 0.255992 13.9471 0 13.7137 0V0Z"
                                                        fill="#EFC74D"
                                                    />
                                                </svg>{' '}
                                                Copied
                                            </label>
                                        )}
                                    </div>

                                    <Label htmlFor="id_title" className="mt-8 mb-2">
                                        Properties
                                        <span className="font-Proxima-Regular text-lightgray ml-1">(Optional)</span>
                                    </Label>
                                    <div
                                        className=" cursor-pointer relative border flex items-center border-themecolor h-[3.75rem]  rounded-[12px]"
                                        onClick={() => {
                                            setPopup(true);
                                            setState(29);
                                        }}>
                                        <p className="ml-3">Add Properties</p>
                                        <div className="h-10 w-10 font-Proxima-Bold text-xl absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-themecolor rounded-full bg-[#43434C] flex justify-center items-center">
                                            +
                                        </div>
                                    </div>

                                    <div className="flex items-start mt-3 Atcheckbox   ">
                                        <label className="h-[25px] w-[25px] hidden">
                                            <input
                                                id="dp2"
                                                type="checkbox"
                                                className={` `}
                                                name="properties-check"
                                                onChange={handleCopytoAll}
                                                checked={pCopiedIndex === values.fActiveIndex}
                                            />
                                            <span></span>
                                        </label>
                                        {pCopiedIndex ? (
                                            <label
                                                htmlFor="dp2"
                                                className="text-base text-white cursor-pointer font-Circular-Book inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 rounded-lg bg-themecolor relative text-black2  , undefined, rounded-full py-2 mt-1 px-6 gold ">
                                                Copy to all
                                            </label>
                                        ) : (
                                            <label
                                                htmlFor="dp2"
                                                className="text-base text-white cursor-pointer font-Circular-Book inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 rounded-lg bg-transparent border border-themecolor text-themecolor relative text-black2  , undefined, rounded-full py-2 mt-1 px-6 gold ">
                                                <svg
                                                    width="14"
                                                    height="11"
                                                    viewBox="0 0 14 11"
                                                    className="mr-3"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M13.7137 0H12.0301C11.6639 0 11.3157 0.169508 11.1003 0.460092L5.45704 8.00146L2.90106 4.58363C2.68567 4.29651 2.34104 4.12354 1.97129 4.12354H0.287643C0.0543026 4.12354 -0.0821121 4.37953 0.0543026 4.56288L4.52727 10.5406C4.63293 10.6827 4.77223 10.7986 4.93362 10.8784C5.095 10.9583 5.27381 11 5.45525 11C5.63668 11 5.81549 10.9583 5.97688 10.8784C6.13826 10.7986 6.27756 10.6827 6.38322 10.5406L13.9435 0.439337C14.0835 0.255992 13.9471 0 13.7137 0V0Z"
                                                        fill="#EFC74D"
                                                    />
                                                </svg>{' '}
                                                Copied
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* <div className="container 2xl:min-w-[840px] 2xl:max-w-[840px] sm:w-[53rem] lg:!pl-0 lg:!pr-0 md:!pl-0 md:!pr-0">
                            <Label htmlFor="id_title" className="mt-8 mb-2">
                                Blockchain
                            </Label>
                            <Select
                                data={blockchains}
                                onSelect={handleSelectBlockchain}
                                selected={selectedBlockchain}
                            />
                        </div> */}
                        <div className="container 2xl:min-w-[840px] 2xl:max-w-[840px] sm:w-[53rem] lg:!pl-0 lg:!pr-0 md:!pl-0 md:!pr-0">
                            <Collections onSelect={setcActiveIndex} activeIndex={cActiveIndex} />
                            {hasError('collectionId') && (
                                <span className="text-red-500 mt-4 block">
                                    Select a collection or create when not created.
                                </span>
                            )}

                            {values.nfts[values.fActiveIndex] && (
                                <div
                                    className={`grid grid-cols-3 gap-x-7 gap-y-7 mt-[45px] ${
                                        values.nfts[values.fActiveIndex]?.attributes?.length < 1 ? 'hidden' : 'block'
                                    }`}>
                                    {values.nfts[values.fActiveIndex]?.attributes?.map((property: any, i: number) => {
                                        return (
                                            <div
                                                key={i}
                                                className="border border-themecolor flex items-center justify-center relative flex-col rounded-[16px] min-h-[100px]">
                                                <button
                                                    className="absolute top-[-10px] right-[-10px] w-[30px] h-[30px] bg-themecolor flex items-center justify-center rounded-full"
                                                    type="button"
                                                    onClick={() => {
                                                        setPopup(true);
                                                        setState(29);
                                                    }}>
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M9.52438 1.75682C10.5724 0.729498 12.2723 0.729498 13.3203 1.75682L14.4083 2.82333C15.4563 3.85065 15.4563 5.51692 14.4083 6.54424L6.23047 14.5605C5.76285 15.0189 5.12886 15.2761 4.46711 15.2761H1.11801C0.806889 15.2761 0.556875 15.0248 0.564629 14.72L0.648874 11.4074C0.665623 10.7813 0.92697 10.1844 1.3787 9.74159L9.52438 1.75682ZM8.89124 3.9107L2.16154 10.509C1.91044 10.7551 1.76492 11.0875 1.75562 11.4351L1.68532 14.1905L4.46711 14.1909C4.79444 14.1909 5.10922 14.0779 5.35767 13.8739L5.44763 13.7931L12.2107 7.16375L8.89124 3.9107ZM12.5374 2.52419C11.9218 1.92068 10.9229 1.92068 10.3072 2.52419L9.67466 3.14326L12.9933 6.3963L13.6254 5.77687C14.2069 5.20688 14.2392 4.30185 13.7224 3.69464L13.6254 3.5907L12.5374 2.52419Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                </button>
                                                <span className="block text-themecolor uppercase font-Proxima-SemiBold text-base">
                                                    {property.trait_type}
                                                </span>
                                                <h3 className="text-white text-lg font-Proxima-Regular">
                                                    {property.value}
                                                </h3>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div>
                                <Label htmlFor="id_title" className="mt-7 mb-2">
                                    Select Categories
                                </Label>
                                <div className="flex flex-wrap gap-3">
                                    {ChecktypeData.map((checkitem, i) => (
                                        <label
                                            className="selecttype select-catagories relative Atcatagoryhovershow"
                                            key={i}>
                                            <input
                                                id=""
                                                name=""
                                                type="checkbox"
                                                className=""
                                                checked={checkitem === categories[0]}
                                                onChange={(e) => {
                                                    handleCategories(e, checkitem);
                                                }}
                                                disabled={i == 2 || i == 3}
                                            />
                                            <span
                                                className={`${
                                                    categories.includes(checkitem)
                                                        ? '!bg-[#f1c94a] !text-black'
                                                        : '!bg-[#2B2B35] !text-white hover:!bg-[#43434a]'
                                                } !border-0 !pl-[25px] !pr-[25px] !pt-[8px] !pb-[8px] !text-sm !font-medium `}>
                                                {checkitem}
                                            </span>
                                            {(i == 2 || i == 3) && (
                                                <i className="Atcatagoryholder font-Proxima-Regular whitespace-nowrap">
                                                    Coming Soon
                                                </i>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                <span className="text-red-500  mt-3 text-[16px] block">
                                    {hasError('categories') ? errors.categories[0] : null}
                                </span>
                            </div>
                            <div className="flex items-start mt-12 Atcheckbox ">
                                <label className="h-[25px] w-[25px] cursor-pointer">
                                    <input
                                        id=""
                                        type="checkbox"
                                        className={` `}
                                        name="declare"
                                        checked={declare}
                                        onChange={(e) => {
                                            setDeclare(e.target.checked);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    <span></span>
                                </label>
                                <label htmlFor="" className="text-[16px] text-secondary ml-3 font-Proxima-Regular">
                                    I declare that I am the only valid owner of all said copyrights. I have the legal
                                    rights that allow me to state the previous of free will and testimony. I agree that
                                    if any infringements by me of said copyrights previously stated occur, or any false
                                    declarations pertaining to my ownership of said copyrights come to light, my account
                                    shall be banned immediately.
                                </label>
                            </div>
                            <span className="text-red-500  mt-3 text-[16px]">
                                {hasError('declare') ? errors.declare[0] : null}
                            </span>

                            <div className="flex items-start mt-5 Atcheckbox ">
                                <label className="h-[25px] w-[25px] cursor-pointer ">
                                    <input
                                        id=""
                                        type="checkbox"
                                        className={` `}
                                        name="terms"
                                        checked={terms}
                                        onChange={(e) => {
                                            setTerms(e.target.checked);
                                        }}
                                        onBlur={handleBlur}
                                    />
                                    <span></span>
                                </label>
                                <label htmlFor="" className="text-[16px] text-secondary ml-3 font-Proxima-Regular">
                                    I have read and accept{' '}
                                    <a target="_blank" href="/termandcondition" className=" text-base !text-themecolor">
                                        Terms & Conditions
                                    </a>
                                </label>
                            </div>
                            <span className="text-red-500 block mt-2 text-[16px]">
                                {hasError('terms') ? errors.terms[0] : null}
                            </span>

                            <div className=" space-x-4  mt-24">
                                <div className="w-full">
                                    <Button
                                        className={'w-full rounded-full gold '}
                                        onClick={handleSubmit}
                                        isLoading={loading}
                                        // disabled={loading}
                                        type="submit">
                                        Create Item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
            {state > 0 && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={{
                        loading,
                        hash: txHash,
                        heading: 'Delete NFTs',
                        loaderHeading: 'Minting',
                        loaderText: 'Please Wait',
                        successHeading: 'Transaction successfull',
                        next: false,
                        progress,
                        onDelete: deleteIndex == -1 ? handleDeleteAll : handleDeleteFile,
                        deleteIndex: deleteIndex
                    }}
                    setPopup={undefined}
                    nftPropertiesHandler={nftPropertiesHandler}
                    attributes={values.nfts[values.fActiveIndex]?.attributes}
                    setAttributes={setAttributes}
                />
            )}
        </>
    );
};

export default withAuth(MultipleNftCreate);

let blockchains: any[];

if (process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET') {
    blockchains = [
        {
            name: 'BSC Testnet',
            chainId: 97,
            tagname: <BscIcon />
        },
        {
            name: 'Ropsten Test Network',
            chainId: 3,
            tagname: <EthIcon />
        },
        {
            name: 'Avalanche',
            chainId: 43113,
            tagname: <Avalanche />
        },
        {
            name: 'Polygon',
            chainId: 80001,
            tagname: <PolygonIcon />
        },
        {
            name: 'Solana',
            tagname: <SolanaIcon />
        },
        {
            name: 'Cardano',
            tagname: <CardanoIcon />
        }
    ];
} else {
    blockchains = [
        {
            name: 'BSC',
            chainId: 56,
            tagname: <BscIcon />
        },
        {
            name: 'Ethereum',
            chainId: 1,
            tagname: <EthIcon />
        },
        {
            name: 'Avalanche',
            chainId: 43114,
            tagname: <Avalanche />
        },
        {
            name: 'Polygon',
            chainId: 137,
            tagname: <PolygonIcon />
        },
        {
            name: 'Solana',
            tagname: <SolanaIcon />
        },
        {
            name: 'Cardano',
            tagname: <CardanoIcon />
        }
    ];
}
