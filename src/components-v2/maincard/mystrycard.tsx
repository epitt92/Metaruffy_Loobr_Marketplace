/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import React, { memo, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Popups from '../popup/poups';
import Button from '../Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { buyNFT, createNftLoading, removeFromMarkete, unlistNft } from '../../redux/nft/actions';
import useMetaMask from '../../hooks/useMetaMask';
import Countdown from 'react-countdown';
import { useRouter } from 'next/router';
import { LikeComponent } from '../Like/LikeComponent';
import CommentCount from './components/CommentCount';
import Blockchains from './components/Blockchains';
import useAudio from '../../hooks/useAudio';
import { METAMASK_POPUP } from '../../constants/enums';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { create } from 'ipfs-http-client';
import { getMYOwnNft } from '../../redux/user/actions';
import ImageComponent from '../Image/ImageComponent';
import { BigNumber, Contract, ethers, providers } from 'ethers';
// const Contract = require('web3-eth-contract');
// // set provider for all later instances to use
// Contract.setProvider(process.env.NEXT_PUBLIC_RPC_URL_LOOBR);

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

interface Iprops {
    listing: any;
    where: string;
    nft: any;
    ABI?: any;
    contractInfo?: any;
}

const MustryCard = ({ listing, where, nft, ABI, contractInfo }: Iprops) => {
    const { library, isInstalled, isActive, account, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();
    // const [playing, play] = useAudio('/LOOBR_PURCHASE_NFT_SUCCESSFUL.mp3');
    const router = useRouter();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [price, setPrice] = useState<any>(0);
    const [MRPrice, setMRPrice] = useState<any>(0);
    const [loadingPrice, setLoading] = useState<any>(false);
    const [supply, setSupply] = useState(0);
    const [total, setTotal] = useState(0);

    const [data, setData] = useState();

    // const [txHash, setTxHash] = useState('');
    const user = useSelector((state: any) => state.auth.user);
    const openModal = useMemo(() => popup, [popup]);
    const modalState = useMemo(() => state, [state]);
    const loading = useSelector((state: any) => state.nft.createNftLoading);
    const ethPrice = useSelector((state: any) => state.nft.ethPrice);

    // const switchNetwork = () => {
    //     setPopup(true);
    //     setState(74);
    //     // handleMint();
    // };
    // const chain = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'MAINNET' ? 1 : 3;
    let temp = { ...nft, ABI, price: price, switchNetwork, /* chainId: chain, */ flow: METAMASK_POPUP.mint };

    useEffect(
        () => {
            setData(temp);

            /* library && */ getBoxPrice();
        },
        [
            /* library */
        ]
    );

    const dispatch = useDispatch();

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

    const handleMint = async (isNative: number) => {
        try {
            dispatch(createNftLoading(true));
            const signer = library?.getSigner();
            // @ts-ignore
            const contract = new Contract(ABI, nft?.contractAddress, signer);
            const mintedPrice = await contract.methods.mintPrice().call();
            const price = Number(Number(mintedPrice) * 1);
            const wrapContract = await contract.methods.wrapToken().call();
            // const nftPrice = ethers.utils.parseEther(price.toString(), 'ether');
            // console.log(nftPrice, 'nftPrice');
            // const token = await contract.mint(1, account, { value: price });
            // let tx = await token.wait();
            // console.log(tx);

            // const nftPrice = ethers.utils.parseEther(price.toString(), 'ether');
            // console.log(nftPrice, 'nftPrice');

            // const token = await contract.mintWithMR(1, account);
            // let tx = await token.wait();
            // console.log(tx);
            // let event = tx.events[0];
            // let value = event.args[2];
            // let tokenId = value.toNumber();
            // let hash = tx.events[0].transactionHash;

            // setTxHash(hash);
            // play();
            dispatch(createNftLoading(false));
            // const filters = { filter: 'CREATOR' };
            // dispatch(getMYOwnNft(filters, account));

            // router.push('/profile/me');
        } catch (error: any) {
            console.log(error);

            dispatch(createNftLoading(false));
            // toast.error(error?.reason || error?.data?.message || error?.message);
            setPopup(false);
        }
    };

    const handleItemClick = () => {
        router.push({
            pathname: where === 'listing' ? `/listings/${listing?.listingId}` : `/nft/${nft.tokenId}`,
            ...(!listing && { query: { blockchain: nft?.chain } })
        });
    };

    const handleOnComplete = () => {
        dispatch(removeFromMarkete(listing?.listingId));
    };

    // const handleSwitchNetwork = async () => {
    //     const chain = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET' ? 3 : 1;
    //     if (chain == chainId) {
    //         return true;
    //     }
    //     setPopup(true);
    //     setState(64);
    //     return false;
    // };

    const handleButtonClick = async (isWrap: number) => {
        if (!(await checkMetamask())) {
            return;
        }
        const chain = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET' ? 3 : 1;

        setData({ ...data, isWrap });
        if (chainId !== nft?.chain_id) {
            const status = await switchNetwork(nft?.chain_id);
            if (status) {
                setPopup(true);
                setState(74);
            }
        } else {
            setPopup(true);
            setState(74);
        }

        // handleMint(1);
        /* Place bid */
    };

    const getBoxPrice = async () => {
        try {
            setLoading(true);
            const signer = library?.getSigner();
            // const contract = new Contract(data?.contractAddress, NFTAbi);
            // const signer = library?.getSigner();
            if (nft?.chain_id === 1) {
                console.log(typeof ABI);
                let provider = new providers.EtherscanProvider();
                const contract = new Contract(nft?.contractAddress, ABI, provider);
                //     // Pay with MR
                const mintedPrice = await contract.mrMintPrice();
                const nftPrice = mintedPrice / Math.pow(10, 18);
                //     const wrapToken = await contract.mrToken();
                setMRPrice(nftPrice);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error, 'Error price');
        }
    };

    return (
        <div className="" key={nft?._id}>
            <div
                className={`w-full bg-[#2B2B35] relative rounded-2xl ease-in-out duration-300  px-4 pt-4 pb-6 border-2 border-transparent hover:border-[#F1C94A] hover:shadow-[0_0_30px_0_rgba(241,207,74,0.5)]`}>
                <div className="text-lg text-white rounded-2xl">
                    <figure className="relative overflow-hidden AtthemeImage AtScaleImage rounded-2xl">
                        <ImageComponent
                            src={nft?.image}
                            width={350}
                            height={350}
                            alt=""
                            figClassName=""
                            className="rounded-lg"
                            quality={40}
                            blurEffect
                        />
                    </figure>
                </div>
                <div className="mt-[12px]">
                    <div className="w-full">
                        <h5 className="w-full text-2xl !truncate text-themecolor font-Proxima-Bold capitalize">
                            {nft?.name}
                        </h5>
                    </div>
                    {/* This condition will not display this component if user is creator of this item */}

                    <div>
                        <h4 className="text-[14px] text-white font-Proxima-Regular mb-[5px] tracking-wider">
                            Blockchain
                        </h4>
                        <Blockchains blockchain={nft?.chain || 'BSC'} />
                    </div>
                    <div className="flex items-center items-end justify-between gap-2 mt-3">
                        <div>
                            <p className="text-white">Collection</p>
                            <p className="text-base  font-Proxima-Bold text-themecolor">
                                {/* {total} / {supply} pcs */}
                                {parseInt(contractInfo?.supply).toLocaleString()} / {nft?.quantity.toLocaleString()} pcs
                            </p>
                        </div>

                        <div className="flex text-right ">
                            <div>
                                <h3 className="text-[#F1C94A]  text-[1.25rem]     py-2 flex items-center leading-[1.15rem]">
                                    <i className="min-w-[20px] max-w-[160px] truncate inline-block not-italic">
                                        {/* {Number(calculateAmount(amount)).toLocaleString()} */}
                                        {contractInfo?.price} {nft?.unit || 'ETH'}
                                    </i>
                                </h3>
                                <i className="text-[#a1a1a5] font-Proxima-Regular  text-sm block not-italic  mt-1">
                                    ${Number(ethPrice * parseFloat(contractInfo?.price)).toFixed()}
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-2 mt-3">
                    {
                        <div className="w-1/2 ">
                            <h4 className="text-[14px] text-white font-Proxima-Regular mb-[5px] tracking-wider">
                                Published by
                            </h4>
                            {/* <Link legacyBehavior href={`/profile/${listing?.ownerDetails?.userName}`}>
                                <a target={'_blank'}> */}
                            <div className="flex items-center">
                                <Image
                                    className="rounded-full "
                                    src="/assets/images/mrlogo.png"
                                    alt=""
                                    height={24}
                                    width={24}
                                />

                                <p className=" text-[14px]  !truncate !p-0 ml-[5px] text-white">@MetaRuffy</p>
                                <svg
                                    className="ml-1.5"
                                    width="18"
                                    height="16"
                                    viewBox="0 0 18 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.02539 13.4755L2.96289 13.0255C2.77539 12.988 2.62539 12.891 2.51289 12.7345C2.40039 12.5785 2.35664 12.4068 2.38164 12.2193L2.58789 10.1005L1.18164 8.48802C1.05664 8.35052 0.994141 8.18802 0.994141 8.00052C0.994141 7.81302 1.05664 7.65052 1.18164 7.51302L2.58789 5.90052L2.38164 3.78177C2.35664 3.59427 2.40039 3.42252 2.51289 3.26652C2.62539 3.11002 2.77539 3.01302 2.96289 2.97552L5.02539 2.52552L6.11289 0.688021C6.21289 0.525521 6.35039 0.419271 6.52539 0.369271C6.70039 0.319271 6.87539 0.325521 7.05039 0.388021L9.00039 1.21302L10.9504 0.388021C11.1254 0.325521 11.3004 0.319271 11.4754 0.369271C11.6504 0.419271 11.7879 0.525521 11.8879 0.688021L12.9754 2.52552L15.0379 2.97552C15.2254 3.01302 15.3754 3.11002 15.4879 3.26652C15.6004 3.42252 15.6441 3.59427 15.6191 3.78177L15.4129 5.90052L16.8191 7.51302C16.9441 7.65052 17.0066 7.81302 17.0066 8.00052C17.0066 8.18802 16.9441 8.35052 16.8191 8.48802L15.4129 10.1005L15.6191 12.2193C15.6441 12.4068 15.6004 12.5785 15.4879 12.7345C15.3754 12.891 15.2254 12.988 15.0379 13.0255L12.9754 13.4755L11.8879 15.313C11.7879 15.4755 11.6504 15.5818 11.4754 15.6318C11.3004 15.6818 11.1254 15.6755 10.9504 15.613L9.00039 14.788L7.05039 15.613C6.87539 15.6755 6.70039 15.6818 6.52539 15.6318C6.35039 15.5818 6.21289 15.4755 6.11289 15.313L5.02539 13.4755ZM7.68789 10.138C7.82539 10.2755 8.00039 10.3443 8.21289 10.3443C8.42539 10.3443 8.60039 10.2755 8.73789 10.138L11.9254 6.95052C12.0754 6.80052 12.1504 6.62227 12.1504 6.41577C12.1504 6.20977 12.0754 6.03177 11.9254 5.88177C11.7754 5.73177 11.5974 5.65677 11.3914 5.65677C11.1849 5.65677 11.0066 5.73177 10.8566 5.88177L8.21289 8.52552L7.12539 7.45677C6.97539 7.31927 6.79739 7.25352 6.59139 7.25952C6.38489 7.26602 6.21289 7.33802 6.07539 7.47552C5.93789 7.61302 5.86914 7.78802 5.86914 8.00052C5.86914 8.21302 5.93789 8.38802 6.07539 8.52552L7.68789 10.138Z"
                                        fill="#64C3FD"
                                    />
                                </svg>
                            </div>
                            {/* </a>
                            </Link> */}
                        </div>
                    }

                    <div className="flex items-center justify-end flex-grow mt-4  at-soldbtn">
                        <Button
                            className="bg-[#F1C94A] gold !py-1.5 text-[#14141F] rounded-[6rem] !text-sm  items-center flex-shrink-0 gap-1.5 !px-3"
                            onClick={() => handleButtonClick(1)}
                            disabled={loading}>
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[1.063rem] h-[1.063rem]">
                                <path
                                    d="M1.67157 2.24512C1.42219 2.24512 1.18266 2.24512 0.943601 2.24512C0.435476 2.24184 0.0567257 1.87809 0.0586007 1.39715C0.0604757 0.916211 0.439226 0.559492 0.949226 0.557617C1.4236 0.557617 1.89813 0.557617 2.37282 0.557617C2.85563 0.557617 3.19313 0.861836 3.25548 1.33715C3.32391 1.8598 3.3961 2.38152 3.46829 2.90371C3.54048 3.4259 3.61266 3.94715 3.6886 4.49746H15.6708C15.7468 4.49416 15.8229 4.49651 15.8986 4.50449C16.2375 4.55699 16.4358 4.87246 16.3477 5.2273C15.9073 6.99918 15.4658 8.77043 15.023 10.5411C14.9452 10.8532 14.8688 11.1659 14.7886 11.4786C14.6452 12.0411 14.2214 12.3753 13.6416 12.3757C10.4191 12.3757 7.19657 12.3757 3.97407 12.3757C3.36751 12.3757 2.91235 12.0036 2.82657 11.4036C2.69907 10.5129 2.59735 9.61527 2.48532 8.72043C2.3272 7.45387 2.16969 6.18715 2.01282 4.92027C1.91251 4.11809 1.81204 3.31637 1.71141 2.51512C1.70204 2.42699 1.68563 2.34355 1.67157 2.24512Z"
                                    fill="black"
                                />
                                <path
                                    d="M5.12391 13.4998C5.45767 13.4998 5.78393 13.5988 6.06144 13.7842C6.33895 13.9696 6.55523 14.2332 6.68296 14.5415C6.81068 14.8499 6.8441 15.1892 6.77899 15.5165C6.71388 15.8439 6.55316 16.1445 6.31716 16.3805C6.08115 16.6165 5.78047 16.7773 5.45313 16.8424C5.12578 16.9075 4.78648 16.8741 4.47813 16.7464C4.16978 16.6186 3.90623 16.4023 3.72081 16.1248C3.53538 15.8473 3.43641 15.5211 3.43641 15.1873C3.4374 14.7401 3.61551 14.3114 3.93176 13.9952C4.24802 13.6789 4.67666 13.5008 5.12391 13.4998Z"
                                    fill="black"
                                />
                                <path
                                    d="M11.8669 13.4998C12.2007 13.4984 12.5274 13.5961 12.8057 13.7804C13.084 13.9647 13.3014 14.2274 13.4303 14.5352C13.5593 14.8431 13.5941 15.1823 13.5303 15.51C13.4664 15.8376 13.3069 16.1389 13.0718 16.3759C12.8367 16.6128 12.5366 16.7747 12.2094 16.8411C11.8823 16.9075 11.5428 16.8753 11.234 16.7488C10.9251 16.6222 10.6607 16.4068 10.4743 16.13C10.2878 15.8531 10.1876 15.5272 10.1864 15.1934C10.1859 14.7463 10.3624 14.3173 10.6773 13.9999C10.9921 13.6826 11.4198 13.5028 11.8669 13.4998Z"
                                    fill="black"
                                />
                            </svg>
                            <span className="mt-0.5">Mint Now</span>
                        </Button>
                    </div>
                </div>
            </div>
            {state > 0 && (
                <Popups
                    show={openModal}
                    hide={setPopup}
                    state={modalState}
                    setstate={setState}
                    data={data}
                    type="nft"
                />
            )}
            {nft?.network === 'Ethereum' ? (
                <Button
                    className="w-full bg-[#F1C94A] gold !py-1.5 text-[#14141F] rounded-[6rem] !text-sm  items-center flex-shrink-0 gap-1.5 !px-3 mt-3"
                    onClick={() => handleButtonClick(2)}
                    disabled={loading}>
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[1.063rem] h-[1.063rem]">
                        <path
                            d="M1.67157 2.24512C1.42219 2.24512 1.18266 2.24512 0.943601 2.24512C0.435476 2.24184 0.0567257 1.87809 0.0586007 1.39715C0.0604757 0.916211 0.439226 0.559492 0.949226 0.557617C1.4236 0.557617 1.89813 0.557617 2.37282 0.557617C2.85563 0.557617 3.19313 0.861836 3.25548 1.33715C3.32391 1.8598 3.3961 2.38152 3.46829 2.90371C3.54048 3.4259 3.61266 3.94715 3.6886 4.49746H15.6708C15.7468 4.49416 15.8229 4.49651 15.8986 4.50449C16.2375 4.55699 16.4358 4.87246 16.3477 5.2273C15.9073 6.99918 15.4658 8.77043 15.023 10.5411C14.9452 10.8532 14.8688 11.1659 14.7886 11.4786C14.6452 12.0411 14.2214 12.3753 13.6416 12.3757C10.4191 12.3757 7.19657 12.3757 3.97407 12.3757C3.36751 12.3757 2.91235 12.0036 2.82657 11.4036C2.69907 10.5129 2.59735 9.61527 2.48532 8.72043C2.3272 7.45387 2.16969 6.18715 2.01282 4.92027C1.91251 4.11809 1.81204 3.31637 1.71141 2.51512C1.70204 2.42699 1.68563 2.34355 1.67157 2.24512Z"
                            fill="black"
                        />
                        <path
                            d="M5.12391 13.4998C5.45767 13.4998 5.78393 13.5988 6.06144 13.7842C6.33895 13.9696 6.55523 14.2332 6.68296 14.5415C6.81068 14.8499 6.8441 15.1892 6.77899 15.5165C6.71388 15.8439 6.55316 16.1445 6.31716 16.3805C6.08115 16.6165 5.78047 16.7773 5.45313 16.8424C5.12578 16.9075 4.78648 16.8741 4.47813 16.7464C4.16978 16.6186 3.90623 16.4023 3.72081 16.1248C3.53538 15.8473 3.43641 15.5211 3.43641 15.1873C3.4374 14.7401 3.61551 14.3114 3.93176 13.9952C4.24802 13.6789 4.67666 13.5008 5.12391 13.4998Z"
                            fill="black"
                        />
                        <path
                            d="M11.8669 13.4998C12.2007 13.4984 12.5274 13.5961 12.8057 13.7804C13.084 13.9647 13.3014 14.2274 13.4303 14.5352C13.5593 14.8431 13.5941 15.1823 13.5303 15.51C13.4664 15.8376 13.3069 16.1389 13.0718 16.3759C12.8367 16.6128 12.5366 16.7747 12.2094 16.8411C11.8823 16.9075 11.5428 16.8753 11.234 16.7488C10.9251 16.6222 10.6607 16.4068 10.4743 16.13C10.2878 15.8531 10.1876 15.5272 10.1864 15.1934C10.1859 14.7463 10.3624 14.3173 10.6773 13.9999C10.9921 13.6826 11.4198 13.5028 11.8669 13.4998Z"
                            fill="black"
                        />
                    </svg>
                    <span className="mt-0.5">Mint with $MR / {MRPrice.toLocaleString()}</span>
                </Button>
            ) : (
                ''
            )}
        </div>
    );
};
export default memo(MustryCard);
