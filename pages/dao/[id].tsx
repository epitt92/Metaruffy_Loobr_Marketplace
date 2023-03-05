import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Popups from '../../src/components/popup/poups';
import Button from '../../src/components/Button/Button';
import { Signer } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../src/hooks/useMetaMask';
import { getPetitionById, submitVote } from '../../src/redux/dao/actions';
import { useRouter } from 'next/router';
import Loader from '../../src/components/loader/Loader';
import { isEmpty } from 'validate.js';
import Notfound from '../../src/components/notfound/notfound';
import { useWeb3React } from '@web3-react/core';
import { fetchImage } from '../../src/utils/functions';
import ImageComponent from '../../src/components/Image/ImageComponent';
// import { service } from '../../services/service';

const DaoDetail = () => {
    const { library, switchNetwork }: any = useMetaMask();
    const { chainId } = useWeb3React();
    const [popup, setPopup] = useState<boolean>(false);
    const [state, setState] = useState(-1);
    const [voted, setVoted] = useState(false);
    const [yesVotes, setYesVotes] = useState(0);
    const [noVotes, setNoVotes] = useState(0);
    const { isInstalled, isActive }: any = useMetaMask();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    const router = useRouter();
    const { id }: any = router.query;

    const petition = useSelector((state: any) => state.dao.petition);
    const petitionLoading = useSelector((state: any) => state.dao.petitionLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        // const signer: Signer = library?.getSigner();
        // @ts-ignore
        id && dispatch(getPetitionById(id));
    }, [id, voted]);

    useEffect(() => {
        if (petition) {
            setYesVotes(petition?.yesVotes);
            setNoVotes(petition?.noVotes);
        }
    }, [petition]);

    const fetchData = async () => {};

    useEffect(() => {
        fetchData().catch(console.error);
    }, []);

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

    const handleSubmitVote = async (perposalId: number | string, vote: number) => {
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
            }
            const signer: Signer = library?.getSigner();
            // @ts-ignore
            library && dispatch(submitVote(signer, perposalId, vote, HandleToggleVotted));
        } catch (error) {
            console.log(error);
        }
    };

    const HandleToggleVotted = (vote: any) => {
        if (vote == 1) {
            setYesVotes(yesVotes + 1);
        } else {
            setNoVotes(noVotes + 1);
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
        <div className="container pb-[7.5rem] pt-16 lg:pt-[7.5rem] min-h-[800px] ">
            <Head>
                <title>LooBr | DAO</title>
            </Head>
            {petitionLoading ? (
                <Loader />
            ) : isEmpty(petition) ? (
                <Notfound />
            ) : (
                <div className="block lg:flex gap-12 items-start  mb-[7.5rem] ">
                    <div className="w-full lg:w-[60%] order-2 lg:order-1 lg:mb-0 mb-[40px]">
                        <figure className="mb-7 relative overflow-hidden xs2:h-[25rem]  xs1:h-[30rem] h-[40rem] Atnftdetailimag max-h-[640px] rounded-xl ">
                            <ImageComponent
                                className="rounded-xl"
                                src={petition?.image}
                                defaultPlaceholder={'/assets/images/placeholder2.png'}
                                layout="fill"
                                quality={60}
                                objectFit="cover"
                                alt=""
                            />
                        </figure>
                        <div className="relative w-full overflow-hidden">
                            <div className="w-full">
                                <p className="mb-8 text-base text-white font-Proxima-Regular">
                                    {petition?.description}
                                </p>
                            </div>
                            <div className="w-full">
                                <div className="border-2 border-[#2B2B35] rounded-3xl  p-4 sm:flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <figure className="w-[7.25rem] h-[7.43rem] flex-shrink-0 relative  rounded-[10px] overflow-hidden">
                                            <Image src="/assets/images/dao/pen-img.jpg" alt="Pen Image" layout="fill" />
                                        </figure>
                                        <div>
                                            <h4 className="text-2xl text-white font-Proxima-Bold">
                                                Start Petition of your own
                                            </h4>
                                            <p className="text-[#A1A1A5] text-lg md:text-xl font-Proxima-Regular xs:w-full w-[25rem] leading-6 mt-2">
                                                This petition starter stood up and took action. Will you do the same?
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button className="mt-4 rounded-full sm:mt-0" onClick={handleStartPetition}>
                                            Start a Petition
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" sm:justify-between w-full lg:w-[40%] flex flex-col lg:mt-0 mb-6 order-1 lg:order-2">
                        <div className="w-full overflow-hidden">
                            <h4 className="text-3xl text-white">
                                <strong className="text-themecolor">{noVotes + yesVotes}</strong>{' '}
                                <span className="font-Proxima-Bold">People</span> have{' '}
                                <span className="text-themecolor">voted</span> on this petition.
                            </h4>
                        </div>
                        <div className="w-full mt-10 overflow-hidden">
                            <h4 className="mb-5 text-2xl text-white font-Proxima-Bold">Positive Votes</h4>
                            <button
                                className=""
                                type="button"
                                onClick={() => {
                                    setPopup(true);
                                    setState(69);
                                }}>
                                <span className="text-base text-white font-Proxima-Bold">
                                    {yesVotes}{' '}
                                    <em className="text-base font-Proxima-Bold text-[#87DC53] not-italic">
                                        ( {Number((yesVotes / (yesVotes + noVotes)) * 100).toFixed()}% )
                                    </em>
                                </span>
                            </button>
                        </div>
                        <div className="w-full mt-10 overflow-hidden">
                            <h4 className="mb-5 text-2xl text-white font-Proxima-Bold">Negative Votes</h4>
                            <button
                                className=""
                                type="button"
                                onClick={() => {
                                    setPopup(true);
                                    setState(70);
                                }}>
                                <span className="text-base text-white font-Proxima-Bold">
                                    {noVotes}{' '}
                                    <em className="text-base font-Proxima-Bold text-[#EA4335] not-italic">
                                        ( {Number((noVotes / (yesVotes + noVotes)) * 100).toFixed()}% )
                                    </em>
                                </span>
                            </button>
                        </div>
                        {/* <div className="overflow-hidden w-full mt-[40px]">
                            <div className="flex items-center gap-3 mb-7">
                                <figure className="w-[56px] h-[56px] overflow-hidden rounded-full">
                                    <Image
                                        src="/assets/images/dao/placeholder.jpg"
                                        height={56}
                                        width={56}
                                        alt="Admin Pic"
                                    />
                                </figure>
                                <h3 className="text-base text-white">
                                    Kim Bowen <span className="text-[#A1A1A5]">voted</span>
                                    <p className="w-full text-[#A1A1A5]">3 hours ago</p>
                                </h3>
                            </div>
                            <div className="flex items-center gap-3 mb-7">
                                <figure className="w-[56px] h-[56px] overflow-hidden rounded-full">
                                    <Image
                                        src="/assets/images/dao/placeholder.jpg"
                                        height={56}
                                        width={56}
                                        alt="Admin Pic"
                                    />
                                </figure>
                                <h3 className="text-base text-white">
                                    Jimmy Hardy <span className="text-[#A1A1A5]">voted</span>
                                    <p className="w-full text-[#A1A1A5]">16 hours ago</p>
                                </h3>
                            </div>
                        </div> */}
                        <div className="overflow-hidden w-full mt-[40px]">
                            <h4 className="text-white text-2xl font-Proxima-Bold mb-[20px]">Vote for this petition</h4>
                            <ul className="flex items-center gap-10">
                                <li
                                    className="flex flex-col text-center cursor-pointer"
                                    onClick={() => handleSubmitVote(id, 1)}>
                                    <svg
                                        viewBox="0 0 100 100"
                                        fill="none"
                                        className="w-16 h-16 md:w-20 md:h-20 "
                                        xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="50" fill="#87DC53" />
                                        <path
                                            d="M44.2842 60.2758V44.1891C44.2842 43.5558 44.4742 42.9383 44.8225 42.4158L49.145 35.9874C49.8258 34.9583 51.52 34.2299 52.9608 34.7683C54.5125 35.2908 55.5417 37.0324 55.2092 38.5841L54.3858 43.7616C54.3225 44.2366 54.4492 44.6641 54.7183 44.9966C54.9875 45.2974 55.3833 45.4874 55.8108 45.4874H62.3183C63.5692 45.4874 64.6458 45.9941 65.2792 46.8808C65.8808 47.7358 65.9917 48.8441 65.5958 49.9683L61.7008 61.8274C61.21 63.7908 59.0725 65.3899 56.9508 65.3899H50.7758C49.715 65.3899 48.2267 65.0258 47.5458 64.3449L45.5192 62.7774C44.7433 62.1916 44.2842 61.2574 44.2842 60.2758Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M39.2491 41.1017H37.6183C35.1641 41.1017 34.1666 42.0517 34.1666 44.395V60.3234C34.1666 62.6667 35.1641 63.6167 37.6183 63.6167H39.2491C41.7033 63.6167 42.7008 62.6667 42.7008 60.3234V44.395C42.7008 42.0517 41.7033 41.1017 39.2491 41.1017Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <span className="block text-white font-Proxima-Bold mt-[18px] text-xl">Yes</span>
                                </li>
                                <li
                                    className="flex flex-col text-center cursor-pointer"
                                    onClick={() => handleSubmitVote(id, 2)}>
                                    <svg
                                        className="w-16 h-16 md:w-20 md:h-20 "
                                        viewBox="0 0 100 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="50" fill="#EA4335" />
                                        <path
                                            d="M55.7159 39.7083V55.7949C55.7159 56.4283 55.5259 57.0458 55.1776 57.5683L50.8551 63.9966C50.1743 65.0258 48.4801 65.7541 47.0393 65.2158C45.4876 64.6933 44.4584 62.9516 44.7909 61.4L45.6143 56.2225C45.6776 55.7474 45.5509 55.3199 45.2818 54.9874C45.0126 54.6866 44.6168 54.4966 44.1893 54.4966H37.6818C36.4309 54.4966 35.3543 53.99 34.7209 53.1033C34.1193 52.2483 34.0084 51.1399 34.4043 50.0158L38.2993 38.1566C38.7901 36.1933 40.9276 34.5941 43.0493 34.5941H49.2243C50.2851 34.5941 51.7734 34.9583 52.4543 35.6391L54.4809 37.2066C55.2568 37.8083 55.7159 38.7266 55.7159 39.7083Z"
                                            fill="white"
                                        />
                                        <path
                                            d="M60.7507 58.8825H62.3816C64.8357 58.8825 65.8332 57.9325 65.8332 55.5891V39.6766C65.8332 37.3333 64.8357 36.3833 62.3816 36.3833H60.7507C58.2966 36.3833 57.2991 37.3333 57.2991 39.6766V55.605C57.2991 57.9325 58.2966 58.8825 60.7507 58.8825Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <span className="block text-white font-Proxima-Bold mt-[18px] text-xl">No</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={petition} />}
        </div>
    );
};

export default DaoDetail;
