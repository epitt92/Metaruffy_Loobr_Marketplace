import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import Label from '../../components/label/Label';
import { createNftLoading } from '../../redux/nft/actions';
import useMetaMask from '../../hooks/useMetaMask';
import NFTAbi from '../../contractsData/NFT.json';
import { Contract } from '@ethersproject/contracts';
import { create } from 'ipfs-http-client';
import Popups from '../../components/popup/poups';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getMYOwnNft } from '../../redux/user/actions';
import Collections from './Collections';
import { isEmpty, validate } from 'validate.js';
import useAudio from '../../hooks/useAudio';
import { createSingleNftSchema } from '../../validations';
import { useWeb3React } from '@web3-react/core';
import { getMarketDetailsByChainId } from '../../utils/functions';
import SelectBlockchain from './components/SelectBlockchain';
import blockchains from '../../contractsData/blockchains';
import Webgl from '../../components/Webgl';
import withAuth from '../../components/Hoc/withAuth';
import { METAMASK_POPUP } from '../../constants/enums';
import Image from 'next/image';

function CreateItemModule() {
    const { chainId } = useWeb3React();
    const [declare, setDeclare] = useState<boolean>(false);
    const [loadingUpload, setLoadinUpload] = useState<boolean>(false);
    const [thumbLoading, setThumbLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string>('');
    const [terms, setTerms] = useState<boolean>(false);
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const { library, account, switchNetwork, isActive, isLoading }: any = useMetaMask();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [txHash, setTxHash] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [playing, play] = useAudio('/LOOBR_MINT_COMPLETE_SOUND.mp3');
    const [selectedBlockchain, setBloackchain] = useState(blockchains.find((item) => item?.chainId == chainId));

    const router = useRouter();
    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);
    const [attributes, setAttributes] = useState([]);

    const [categories, setCategories] = useState<string[]>([]);
    const ChecktypeData = ['Artwork', 'Virtual Land', 'RuffyWorld Assets', 'Physical Artwork'];
    const [values, setValues] = useState({
        file: '',
        name: '',
        description: ''
    });

    const collections = useSelector((state: any) => state.collections.collections);

    const nftPropertiesHandler = (obj: any) => {
        let a: any = [...attributes];
        a.push(...obj);
        setAttributes(a);
        setPopup(false);
    };
    const [imageUrl, setImageUrl] = useState('');
    const [thumbUrl, setThumbUrl] = useState('');
    const [file, setFile] = useState<File>();
    const [nail, setNail] = useState<File>();
    const [fileType, setFileType] = useState<string>();

    const auth =
        'Basic ' +
        Buffer.from(
            process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_ID +
                ':' +
                process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_SECRET
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

    const loading = useSelector((state: any) => state.nft.createNftLoading);
    const user = useSelector((state: any) => state.auth.user);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isLoading && !isActive) {
            setPopup(true);
            setState(7);
        } else {
            // setPopup(false);
        }
    }, [isActive, isLoading]);

    useEffect(() => {
        const errors = validate(
            {
                ...values,
                categories,
                collectionId: isEmpty(collections?.collections) ? '' : collections?.collections[selectedIndex],
                image: imageUrl ? fileType : '',
                terms: terms ? terms : '',
                declare: declare ? declare : '',
                thumbnail: thumbUrl ? thumbUrl : ''
            },
            createSingleNftSchema
        );

        setErrors({ ...(errors || {}) });
    }, [selectedIndex, categories, collections, file, values, terms, declare, thumbUrl, imageUrl]);

    useEffect(() => {
        const chain = blockchains.find((item) => item.chainId == chainId);
        setBloackchain(chain);
    }, [chainId]);

    const handleSelectBlockchain = async (value: any) => {
        try {
            const status = await switchNetwork(value?.chainId);
            if (!status) {
                return;
            }
            setBloackchain(value);
        } catch (error) {
            console.log(error);
        }
    };

    const hasCollectionsError = () => {
        if (
            !isEmpty(collections) &&
            collections?.collections[selectedIndex]?.numberOfNfts <= collections?.collections[selectedIndex]?.count
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        if (name === 'title' || name === 'description') {
            const isNotValid = event.target.value.length > (name === 'title' ? 25 : 500);
            if (isNotValid) {
                toast.dismiss();
                toast.warn(
                    name === 'title'
                        ? "Title can't be more than 25 charachters"
                        : "Descrption can't be more than 500 charachters"
                );
                return;
            }
        }
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleCategories = (e: any, value: string) => {
        if (e.target.checked) {
            setCategories([value]);
        } else {
            setCategories([]);
        }
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };

    const enabledTouchedValues = () => {
        const newState: any = {};
        Object.keys(errors).forEach((item) => {
            newState[item] = true;
        });
        setTouched(newState);
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

        if (!isActive) {
            setPopup(true);
            setState(7);
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!handleValidations()) {
            return;
        }

        setPopup(true);
        setState(14);
        handleCreateNFT();
    };

    const saveFile = async (e: any) => {
        setLoadinUpload(true);
        try {
            if (e.target.files.length) {
                let name = e.target.files[0]?.name;
                const slices: string[] | undefined = name?.split('.');
                const ext: string = slices ? slices[slices.length - 1] : '';

                if (!/(gif|jpe?g|tiff?|png|webp|bmp|glb)$/i.test(ext)) {
                    toast.error('File types supported: JPG, PNG, GIF, JPEG,GLB');
                    setLoadinUpload(false);
                    return;
                }
                setFileType(ext);
                setFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
                const added = await client.add(e.target.files[0]);
                setImageUrl(`https://loobr.infura-ipfs.io/ipfs/${added.path}`);
            }
            setLoadinUpload(false);
        } catch (error) {
            console.log('Error uploading file: ', error);
            setLoadinUpload(false);
        }
    };
    console.log(chainId);

    const saveThumbnailFile = async (e: any) => {
        setThumbLoading(true);
        try {
            if (e.target.files.length) {
                setNail(e.target.files[0]);
                const added = await client.add(e.target.files[0]);
                setThumbUrl(`https://loobr.infura-ipfs.io/ipfs/${added.path}`);
            }
            setThumbLoading(false);
        } catch (error) {
            console.log('Error uploading file: ', error);
            setThumbLoading(false);
        }
    };

    const handleCreateNFT = async () => {
        try {
            dispatch(createNftLoading(true));
            const result = await client.add(
                JSON.stringify({
                    image: imageUrl,
                    name: values.name,
                    description: values.description,
                    imageHash: '',
                    edition: 1,
                    date: new Date().getTime(),
                    attributes: attributes,
                    categories: categories,
                    collectionId: collections?.collections[selectedIndex]._id,
                    fileType: fileType,
                    ...(fileType == 'glb' && { preview: thumbUrl })
                })
            );
            const uri = `https://loobr.infura-ipfs.io/ipfs/${result.path}`;

            const signer = library?.getSigner();
            // @ts-ignore
            const contract = new Contract(getMarketDetailsByChainId(chainId)?.nftAddress, NFTAbi.abi, signer);

            const nft = await contract.mint(account, uri);
            let tx = await nft.wait();
            // let event = tx.events[0];
            // let value = event.args[2];
            // let tokenId = value.toNumber();
            let hash = tx.events[0].transactionHash;

            setTxHash(hash);
            play();
            dispatch(createNftLoading(false));
            const filters = { filter: 'CREATOR' };
            dispatch(getMYOwnNft(filters, account));

            router.push(`/profile/${user?.userName}`);
        } catch (error: any) {
            dispatch(createNftLoading(false));
            toast.error(error?.reason || error?.data?.message || error?.message);
            setPopup(false);
        }
    };

    return (
        <>
            <Head>
                <title>LooBr | Create Item</title>
            </Head>
            <form onSubmit={handleSubmit} key="create-item">
                <section className="bg-[url('/assets/images/create-item-bg.svg')] bg-no-repeat bg-[length:100%_1001px]">
                    <div className="container lg:min-w-[840px] lg:max-w-[840px] sm:w-[53rem] w-[45rem] xs:w-[23rem] pt-28 pb-28 lg:!pl-0 lg:!pr-0  md:!pl-0 md:!pr-0">
                        <h3 className="text-white mb-3 ">Create Item</h3>
                        <p className="mb-8 text-[#a1a1a5] text-base">Start minting your one of a kind NFT and enjoy!</p>
                        {/* <PriceLogos height="30" width="30" /> */}
                        <SelectBlockchain
                            data={blockchains}
                            onSelect={handleSelectBlockchain}
                            selected={selectedBlockchain}
                        />
                        <span className="text-red-500 mt-2 block ">
                            {hasError('chainId') ? `Image should not be empty` : null}
                        </span>

                        <h6 className="text-white mt-8 mb-3">Upload File</h6>

                        {file ? (
                            <div className="relative cursor-pointer  border-2 sm:w-[350px] w-full min-h-[350px] flex items-stretch justify-center  overflow-hidden border-dashed border-[#2B2B35] rounded-[1.5rem]">
                                <div
                                    className={`flex flex-col justify-center   px-6 ${
                                        file ? ' p-6' : 'pt-12 pb-4'
                                    } items-center  CreateNftImage`}>
                                    <div className="flex basis-auto justify-center   h-full relative">
                                        {fileType == 'glb' ? (
                                            <>
                                                <div className="">
                                                    <Webgl src={preview} />

                                                    {/* <Loader /> */}
                                                </div>
                                            </>
                                        ) : (
                                            <img src={preview} alt="" className="max-h-full  max-w-full relative" />
                                        )}
                                        <div className=" absolute bottom-0 text-center   !w-full   ">
                                            <label className="inline-flex font-Proxima-Bold items-center justify-center cursor-pointer px-11 py-3 !w-full !text-white hover:!bg-themecolor rounded-lg !bg-transparent relative hover:!text-black2">
                                                <input type="file" className="w-0 absolute" onChange={saveFile} />
                                                Change
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <label className="relative cursor-pointer  border-2 sm:w-[350px] w-full h-[350px] flex items-stretch justify-center  overflow-hidden border-dashed border-[#2B2B35] hover:border-[#595959] rounded-[1.5rem]">
                                <input type="file" className="w-0 absolute" onChange={saveFile} />
                                <div
                                    className={`flex flex-col justify-center  px-6 ${
                                        file ? ' p-6' : 'pt-12 pb-4'
                                    } items-center  CreateNftImage`}>
                                    <>
                                        <Image
                                            className=""
                                            src="/assets/images/icons/upload-icon.svg"
                                            width={60}
                                            height={47}
                                        />

                                        <h4 className="block text-base capitalize font-Proxima-SemiBold   text-lightgray mt-4 text-center">
                                            PNG, GIF, WEBP ETC. MAX 100MB.
                                        </h4>

                                        <Button className="text-[#F1C94A] hover:!bg-red-500 !py-2.5 bg-[#2A2623] rounded-[13px]  mt-4 pointer-events-none">
                                            Choose Files
                                        </Button>
                                        <h4 className="block text-base capitalize mt-24  font-Proxima-SemiBold text-lightgray  text-center">
                                            Recommended size: 512px x 512px
                                        </h4>
                                    </>
                                </div>
                            </label>
                        )}

                        <span className="text-red-500 mt-2 block ">
                            {hasError('image') ? `Image should not be empty` : null}
                        </span>

                        {/* Thumbnail Image of 3D Model */}
                        {fileType == 'glb' && (
                            <Fragment>
                                {' '}
                                <h6 className="text-white mt-8 mb-3">Preview Image</h6>
                                <p className="text-base  font-Proxima-SemiBold  text-lightgray  mb-3">
                                    Because you’ve included multimedia, You’ll need to provide an image (PNG, JPG, or
                                    GIF) for the card display of your item.
                                </p>
                                {nail ? (
                                    <div className="relative cursor-pointer  border-2 sm:w-[200px] w-full h-[200px] flex items-stretch justify-center  overflow-hidden border-dashed border-[#2B2B35] hover:border-[#595959] rounded-[1.5rem]">
                                        <div
                                            className={`flex flex-col justify-center  px-6 ${
                                                nail ? ' p-2' : 'pt-12 pb-4'
                                            } items-center  CreateNftImage`}>
                                            <div className="flex basis-auto justify-center  h-full">
                                                <div className=" relative">
                                                    <img
                                                        src={URL.createObjectURL(nail)}
                                                        alt=""
                                                        className="max-h-full  max-w-full relative"
                                                    />
                                                    <div className=" absolute top-[75%]  left-[51%] translate-x-[-50%]   min-w-[10rem] ">
                                                        <label className="inline-flex cursor-pointer font-Proxima-Bold items-center justify-center px-6 whitespace-nowrap py-3 rounded-lg bg-themecolor relative text-black2">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="w-0 absolute"
                                                                onChange={saveThumbnailFile}
                                                            />
                                                            Change Image
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="relative cursor-pointer  border-2 sm:w-[250px] w-full h-[250px] flex items-stretch justify-center  overflow-hidden border-dashed border-[#2B2B35] rounded-[1.5rem]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-0 absolute"
                                            onChange={saveThumbnailFile}
                                        />
                                        <div
                                            className={`flex flex-col justify-center  px-6 ${
                                                nail ? ' p-6' : 'pt-12 pb-8'
                                            } items-center  CreateNftImage`}>
                                            <>
                                                <Image
                                                    className=""
                                                    src="/assets/images/icons/upload-icon.svg"
                                                    width={60}
                                                    height={47}
                                                />

                                                {/* <h4 className="block text-base capitalize  font-Proxima-SemiBold text-lightgray mt-4 text-center">
                                                    PNG, GIF, WEBP ETC. 
                                                </h4> */}

                                                <Button className="text-[#F1C94A] !py-2.5 bg-[#2A2623] rounded-[13px]  mt-8 pointer-events-none">
                                                    Choose Image
                                                </Button>
                                            </>
                                        </div>
                                    </label>
                                )}
                            </Fragment>
                        )}
                        <span className="text-red-500 mt-2 block ">
                            {hasError('thumbnail') ? `Preview image should not be empty` : null}
                        </span>
                        {/* Thumbnail Image of 3D Model */}

                        <Label htmlFor="id_title" className="mt-8 mb-2">
                            Title
                        </Label>
                        <Input
                            name="name"
                            placeholder="NFT title"
                            id="id_title"
                            className='hover:border-[#595959]'
                            value={values.name}
                            onchange={handleChange}
                            onBlur={handleBlur}
                            error={hasError('name')}
                            helperText={hasError('name') ? errors.name[0] : null}
                        />

                        <Label htmlFor="id_title" className="mt-8 mb-2">
                            Description <span className="font-Proxima-Regular text-lightgray">(Optional)</span>
                        </Label>
                        <Input
                            name="description"
                            onchange={handleChange}
                            placeholder='e. g. "After purchasing you’ll be able to get the real T-Shirt"'
                            id="id_title"
                            className='hover:border-[#595959]'

                        />
                        <Collections onSelect={setSelectedIndex} activeIndex={selectedIndex} />
                        {hasError('collectionId') && (
                            <span className="text-red-500 mt-4 block">
                                Select a collection or create when not created.
                            </span>
                        )}
                        {/* <span className="mt-4">With preserved line-breaks</span> */}

                        <Label htmlFor="id_title" className="mt-8 mb-2">
                            Properties
                            <span className="font-Proxima-Regular text-lightgray ml-1">(Optional)</span>
                        </Label>
                        <div
                            className=" cursor-pointer relative border flex items-center border-themecolor h-[60px] rounded-[12px]"
                            onClick={() => {
                                setPopup(true);
                                setState(29);
                            }}>
                            {/* <Input
                            name="attributes"
                            onchange={handleChange}
                            placeholder="NFT Properties"
                            id="id_title"
                            plusIcon="+"
                        /> */}
                            <p className="ml-3">Add Properties</p>
                            <div className="h-[40px] w-[40px] font-Proxima-Bold text-2xl absolute right-0 top-1/2 -translate-y-1/2 mr-3 text-themecolor rounded-full bg-[#43434C] flex justify-center items-center pt-[3px]">
                                +
                            </div>
                        </div>
                        <div
                            className={`grid grid-cols-3 gap-x-7 gap-y-7 mt-[45px] ${
                                attributes.length < 1 ? 'hidden' : 'block'
                            }`}>
                            {attributes.map((property: any, i: number) => {
                                return (
                                    <div
                                        key={i}
                                        className="border border-1 border-themecolor flex items-center justify-center relative flex-col rounded-[16px] min-h-[100px]">
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
                                        <h3 className="text-white text-lg font-Proxima-Regular">{property.value}</h3>
                                    </div>
                                );
                            })}
                        </div>

                        <div>
                            <Label htmlFor="id_title" className="mt-8 mb-2">
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
                                            checked={checkitem === categories[0]}
                                            className=""
                                            onChange={(e) => {
                                                handleCategories(e, checkitem);
                                            }}
                                            disabled={i == 2 || i == 3}
                                        />
                                        <span className="!bg-[#2B2B35]  hover:!bg-[#43434a] !border-0 !pl-[25px] !pr-[25px]   !pt-[8px] !pb-[8px] !text-white !text-sm !font-medium">
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
                                I declare that I am the only valid owner of all said copyrights. I have the legal rights
                                that allow me to state the previous of free will and testimony. I agree that if any
                                infringements by me of said copyrights previously stated occur, or any false
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

                        <div className=" space-x-4  pt-10">
                            <div className="w-full">
                                <Button
                                    className={'w-full rounded-full gold '}
                                    onClick={handleSubmit}
                                    isLoading={loading || loadingUpload || thumbLoading}
                                    disabled={loading || loadingUpload || thumbLoading}
                                    type="submit">
                                    Create Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={{
                        loading,
                        hash: txHash,
                        loaderHeading: 'Minting',
                        loaderText: 'Please Wait',
                        successHeading: 'Transaction successfull',
                        next: false,
                        flow: METAMASK_POPUP.buy
                    }}
                    setPopup={undefined}
                    nftPropertiesHandler={nftPropertiesHandler}
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
            )}
        </>
    );
}
export default withAuth(CreateItemModule);
