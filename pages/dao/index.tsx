import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Popups from '../../src/components/popup/poups';
import Button from '../../src/components/Button/Button';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPetition, submitVote } from '../../src/redux/dao/actions';
import useMetaMask from '../../src/hooks/useMetaMask';
import { Signer } from 'ethers';
import Loader from '../../src/components/loader/Loader';
import { isEmpty } from 'validate.js';
import Notfound from '../../src/components/notfound/notfound';
import { METAMASK_POPUP } from '../../src/constants/enums';
import { useWeb3React } from '@web3-react/core';
import { fetchImage } from '../../src/utils/functions';
import ImageComponent from '../../src/components/Image/ImageComponent';

const DAO = () => {
    const { library, switchNetwork, isLoading, isActive, isInstalled }: any = useMetaMask();
    const { chainId } = useWeb3React();
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [voted, setVoted] = useState(false);
    const [data, setData] = useState({});
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);

    const petitions = useSelector((state: any) => state.dao.petitions);
    const petitionsLoading = useSelector((state: any) => state.dao.petitionsLoading);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        handleGetPetitions();
    }, [page, voted]);

    useEffect(() => {
        if (!isLoading && !isActive) {
            setPopup(true);
            setState(7);
        } else {
            // setPopup(false);
        }
    }, [isActive, isLoading]);

    // const handleSubmitVote = (perposalId: number, vote: number) => {
    //     const signer: Signer = library?.getSigner();
    //     // @ts-ignore
    //     library && dispatch(submitVote(signer, perposalId, vote, HandleToggleVotted));
    // };

    const handleGetPetitions = async () => {
        try {
            const filters = {
                page,
                pageSize: 5
            };
            // @ts-ignore
            dispatch(getAllPetition(filters, loadMore, setLoadMore));
        } catch (error) {}
    };

    const HandleToggleVotted = () => {
        setVoted(!voted);
    };

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    const checkMetamask = () => {
        if (!isAuthenticated) {
            setPopup(true);
            setState(1);
            return false;
        } else if (isActive) {
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

    const handleStartPetition = async () => {
        try {
            if (!checkMetamask()) {
                return;
            }
            const chain = process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET' ? 3 : 1;

            if (chainId !== chain) {
                const status = await switchNetwork(chain);

                if (!status) {
                    return;
                }
                setPopup(true);
                setState(66);
                return;
            }
            setPopup(true);
            setState(66);
        } catch (error) {}
    };

    return (
        <div className="container lg:min-w-[1080px] lg:max-w-[1080px] sm:w-full min-h-[640px] pt-20 pb-28 !pl-4 !pr-4 lg:!pr-0 lg:!pl-0">
            <Head>
                <title>LooBr | DAO</title>
            </Head>
            <h2 className="text-white xl:text-2rem">LooBr.com is Community driven</h2>
            <p className="text-white sm:text-xl mt-2 sm:w-[50rem]">
                You need 100 Million $MR token to start a petition, every tokenholder can use our Utility Token $MR to
                vote for your petition or against your Petition 1x $MR = 1 Voice
            </p>

            <div className="flex itme-center justify-between mb-[25px] mt-20 ">
                <h2 className="text-5xl text-white uppercase">Dao</h2>
                <Button className="rounded-full" onClick={handleStartPetition}>
                    Start a Petition
                </Button>
            </div>
            {petitionsLoading || isLoading ? (
                <Loader />
            ) : isEmpty(petitions?.proposals) ? (
                <div className="min-h-[90vh] flex justify-center flex-col items-center items-center">
                    <svg
                        className=""
                        width="272"
                        height="230"
                        viewBox="0 0 274 323"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect
                            x="0.612372"
                            y="57.6543"
                            width="182.256"
                            height="261.056"
                            rx="7.5"
                            transform="rotate(-15 0.612372 57.6543)"
                            fill="#14141F"
                            stroke="#D7BDBD"
                        />
                        <rect
                            x="54.4336"
                            y="34.8203"
                            width="72.708"
                            height="18.8187"
                            rx="5"
                            transform="rotate(-15 54.4336 34.8203)"
                            fill="#383843"
                        />
                        <circle
                            cx="89.1619"
                            cy="16.0155"
                            r="8.89137"
                            transform="rotate(-15 89.1619 16.0155)"
                            fill="white"
                            stroke="black"
                            strokeWidth="3"
                        />
                        <rect
                            x="90.8945"
                            y="60.8711"
                            width="182.256"
                            height="261.056"
                            rx="7.5"
                            fill="#14141F"
                            stroke="#D7BDBD"
                        />
                        <rect x="147.812" y="50.9609" width="72.708" height="18.8187" rx="5" fill="#383843" />
                        <circle cx="186.227" cy="41.782" r="8.89137" fill="white" stroke="black" strokeWidth="3" />
                        <g clipPath="url(#clip0_4973_19629)">
                            <path
                                d="M200.605 212.394C195.555 207.344 188.705 204.506 181.563 204.506C174.42 204.506 168.494 206.42 163.443 211.471"
                                stroke="white"
                            />
                            <circle cx="166.701" cy="196.115" r="4.71658" fill="white" />
                            <circle cx="197.345" cy="196.115" r="4.71658" fill="white" />
                            <path
                                d="M220.827 159.789L220.827 159.789C221.686 160.648 222.163 161.811 222.163 163.013V163.804H196.069V137.711H196.86C198.084 137.711 199.248 138.189 200.105 139.046C200.105 139.046 200.105 139.046 200.105 139.046L220.827 159.789ZM146.463 137.711H188.296V165.997C188.296 169.068 190.806 171.577 193.876 171.577H222.163V240.504C222.163 243.043 220.122 245.084 217.583 245.084H146.463C143.924 245.084 141.883 243.043 141.883 240.504V142.291C141.883 139.752 143.924 137.711 146.463 137.711Z"
                                stroke="white"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_4973_19629">
                                <rect
                                    width="108.373"
                                    height="108.373"
                                    fill="white"
                                    transform="translate(127.836 137.211)"
                                />
                            </clipPath>
                        </defs>
                    </svg>
                    <h2 className="mt-12 text-center text-white">No Petition Created Yet</h2>
                </div>
            ) : (
                <ul className="flex flex-col w-full list-none gap-7">
                    {/* "name": "SubmitProposal",
                "contract": "0xeEd056A6bF7569A1ACe6E4acD68BFfCDec586d11",
                "blockHash": "0x78125dd2dd4ef909af79e889fdeeb39ce7ce7caf6bfa9bc0b2eb8cde3d236419",
                "blockNumber": 13049574,
                "transactionHash": "0x7e7604b6b5b8dcada71405d4e4d19a128c3ecced9e5b139c4c02427da82e7267",
                "transactionIndex": 13,
                "from": "0x25A99cf0b20b99B10291257323bFf4836BA83A1a",
                "to": "0xeEd056A6bF7569A1ACe6E4acD68BFfCDec586d11",
                "logIndex": 6,
                "uri": "https://loobr.infura-ipfs.io/ipfs/QmY1wvxWbTHiRDKQFQDJWsWU37BqjZQuuKzywSd4cENrKs",
                "image": "https://loobr.infura-ipfs.io/ipfs/QmSrHuQZj9hRRw4YpSveWnfzaVmR2S5YBekiyjneGfuJif",
                "title": "test",
                "description": "test",
                "proposalId": 2,
                "proposer": "0x25A99cf0b20b99B10291257323bFf4836BA83A1a", */}
                    {petitions &&
                        petitions?.proposals?.map((item: any, i: number) => (
                            <li className="w-full list-none" key={i}>
                                <div className="flex flex-col rounded-3xl border-2 border-[#2B2B35] p-5">
                                    <div className="w-full block sm:flex relative gap-[2.875rem]">
                                        <figure className="w-full xs2:h-[25rem]  xs1:h-[30rem] h-[40rem] rounded-[16px] bg-[#2C2C3E] sm:bg-transparent  sm:w-[250px] sm:h-[200px]  overflow-hidden shrink-0 relative sm:mb-0 mb-5">
                                            {/* {item?.image && ( */}
                                            <ImageComponent
                                                className="!rounded-[16px]"
                                                src={item?.image}
                                                defaultPlaceholder={'/assets/aegims/placeholder1.png'}
                                                layout="fill"
                                                objectFit="cover"
                                                quality={50}
                                                alt=""
                                            />
                                            {/* )} */}
                                        </figure>
                                        <div className="w-full">
                                            <h3 className="text-white text-2xl font-Proxima-Bold mb-[8px]">
                                                <Link legacyBehavior href={`/dao/${item?.proposalId}`}>
                                                    <a className="text-white hover:text-themecolor">{item.title}</a>
                                                </Link>
                                            </h3>
                                            <p className="text-base text-white font-Proxima-Regular ">
                                                {item.description}{' '}
                                                <button
                                                    className="text-base text-themecolor font-Proxima-Bold"
                                                    type="button">
                                                    {/* Read more... */}
                                                </button>
                                            </p>
                                            <div className="flex-col sm:flex-row flex sm:items-center justify-between mt-[7px]">
                                                <ul className="flex items-center gap-5">
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex items-center gap-2 text-base text-white b font-Proxima-Regular"
                                                            // onClick={() => handleSubmitVote(i + 1, 1)

                                                            // }
                                                            onClick={() => {
                                                                setPopup(true);
                                                                setState(69);
                                                                setData(item);
                                                            }}>
                                                            <i>
                                                                <svg
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M8.39001 18.49V8.32998C8.39001 7.92998 8.51001 7.53998 8.73001 7.20998L11.46 3.14998C11.89 2.49998 12.96 2.03998 13.87 2.37998C14.85 2.70998 15.5 3.80998 15.29 4.78998L14.77 8.05998C14.73 8.35998 14.81 8.62998 14.98 8.83998C15.15 9.02998 15.4 9.14998 15.67 9.14998H19.78C20.57 9.14998 21.25 9.46998 21.65 10.03C22.03 10.57 22.1 11.27 21.85 11.98L19.39 19.47C19.08 20.71 17.73 21.72 16.39 21.72H12.49C11.82 21.72 10.88 21.49 10.45 21.06L9.17001 20.07C8.68001 19.7 8.39001 19.11 8.39001 18.49Z"
                                                                        fill="#87DC53"
                                                                    />
                                                                    <path
                                                                        d="M5.21 6.38H4.18C2.63 6.38 2 6.98 2 8.46001V18.52C2 20 2.63 20.6 4.18 20.6H5.21C6.76 20.6 7.39 20 7.39 18.52V8.46001C7.39 6.98 6.76 6.38 5.21 6.38Z"
                                                                        fill="#87DC53"
                                                                    />
                                                                </svg>
                                                            </i>
                                                            <span>{item?.yesVotes}</span>
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="flex items-center gap-2 text-base text-white font-Proxima-Regular"
                                                            // onClick={() => handleSubmitVote(i + 1, 2)}
                                                            onClick={() => {
                                                                setPopup(true);
                                                                setState(70);
                                                            }}>
                                                            <i>
                                                                <svg
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M15.61 5.50002V15.66C15.61 16.06 15.49 16.45 15.27 16.78L12.54 20.84C12.11 21.49 11.04 21.95 10.13 21.61C9.14998 21.28 8.49999 20.18 8.70999 19.2L9.22998 15.93C9.26998 15.63 9.18999 15.36 9.01999 15.15C8.84999 14.96 8.59999 14.84 8.32999 14.84H4.21998C3.42998 14.84 2.74999 14.52 2.34999 13.96C1.96999 13.42 1.89999 12.72 2.14999 12.01L4.60999 4.52002C4.91999 3.28002 6.26999 2.27002 7.60999 2.27002H11.51C12.18 2.27002 13.12 2.50002 13.55 2.93002L14.83 3.92002C15.32 4.30002 15.61 4.88002 15.61 5.50002Z"
                                                                        fill="#EA4335"
                                                                    />
                                                                    <path
                                                                        d="M18.79 17.61H19.82C21.37 17.61 22 17.01 22 15.53V5.48002C22 4.00002 21.37 3.40002 19.82 3.40002H18.79C17.24 3.40002 16.61 4.00002 16.61 5.48002V15.54C16.61 17.01 17.24 17.61 18.79 17.61Z"
                                                                        fill="#EA4335"
                                                                    />
                                                                </svg>
                                                            </i>
                                                            <span>{item?.noVotes}</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                                <Link legacyBehavior href={`/dao/${item?.proposalId}`}>
                                                    <a className="w-full mt-5 sm:mt-0 sm:w-auto">
                                                        <Button className="rounded-full !bg-transparent border !border-themecolor !text-themecolor sm:min-w-[184px] min-w-full ">
                                                            View Petition
                                                        </Button>
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}

                    {!petitionsLoading && petitions?.next && (
                        <div className="flex items-center">
                            <Button
                                disabled={petitionsLoading}
                                isLoading={petitionsLoading}
                                className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                                onClick={handleLoadMore}>
                                Load More
                            </Button>
                        </div>
                    )}
                </ul>
            )}
            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={{ flow: METAMASK_POPUP.dao, ...data }}
                />
            )}
        </div>
    );
};

export default DAO;
