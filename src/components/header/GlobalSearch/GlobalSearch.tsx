import axios from 'axios';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { isEmpty } from 'validate.js';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import { homeService } from '../../../services/home.service';
import { userService } from '../../../services/user.service';
import Button from '../../Button/Button';
import ImageComponent from '../../Image/ImageComponent';
import Loader from '../../loader/Loader';
import Notfound from '../../notfound/notfound';
import Verified from '../../verified';
import VerifiedIcon from './components/VerifiedIcon';
import blockchains from '../../../contractsData/blockchains';
import { useQuery } from 'react-query';
import { marketPlaceService } from '../../../services/marketplace.service';
import { formatNumber, slicedAddress } from '../../../utils/functions';
import { Router, useRouter } from 'next/router';
import ExternalCollectionList from './components/ExternalCollectionList';
// import VerifiedIcon from co;

type Props = {
    showSearch: boolean;
    setShowSearch: Function;
};

const GlobalSearch = ({ showSearch, setShowSearch }: Props) => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const [star, setStar] = useState(false);

    const [values, setValues] = useState({
        search: ''
    });
    const [show, setShow] = useState(false);
    const wrapperRef = useRef(null);

    const [clicked]: any = useOutsideAlerter(wrapperRef);

    const [suggestions, setSuggestions] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [recentSearch, setRecentSearch] = useState<any>([]);

    const [extTokens, setExtTokens] = useState<any>([]);
    const [extTokensLoading, setExtTokensLoading] = useState<any>(false);
    const user = useSelector((state: any) => state.auth.user);

    const router = useRouter();

    const { data, isLoading } = useQuery(
        ['suggestions', values.search],
        () => marketPlaceService.getSuggestions({ keyword: values.search }),
        {
            enabled: Boolean(values.search.length > 2),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchInterval: false,
            refetchOnReconnect: false,
            staleTime: 1000 * 60 * 60
        }
    );
    console.log(data, 'suggestions');

    useEffect(() => {
        if (values.search.length > 2) {
            setShow(true);
            // fetch();
            // getSearchNFT(values.search);
        }
        return () => {
            debouncedEventHandler.cancel();
        };
    }, [values.search]);

    useEffect(() => {
        if (!showSearch) {
            setValues({ ...values, search: '' });
        }
    }, [showSearch]);

    useEffect(() => {
        if (clicked && show) {
            setSuggestions(null);
            setShow(false);
        }
    }, [clicked]);

    // const fetch = async () => {
    //     try {
    //         setLoading(true);
    //         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/suggestions`, {
    //             params: { keyword: values.search }
    //         });
    //         setSuggestions(null);
    //         setSuggestions(res.data.data);
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
    //     }
    // };

    const getSearchNFT = async (keyword: string) => {
        try {
            setExtTokensLoading(true);
            const fileters = {
                query: keyword,
                pageSize: 5,
                chain: 'ETH'
            };
            const res = await homeService.searchExternalCollection(fileters);
            setExtTokens(res.data?.data);
            setExtTokensLoading(false);
        } catch (error) {
            setExtTokens([]);
            console.log(error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == '') {
            setShow(false);
        }
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const debouncedEventHandler = useMemo(() => debounce(handleChange, 1000), [values]);

    useEffect(() => {
        if (user?.userId) {
            getRecentSearch();
        }
    }, [user, showSearch]);
    useEffect(() => {
        if (!user) {
            setRecentSearch([]);
        }
    }, [user]);
    const getRecentSearch = async () => {
        try {
            if (user?.userId) {
                let res = await userService.getRecentSearches();
                let result = res?.data?.data?.search;
                let result2 = result?.reverse();
                setRecentSearch(result2);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const saveRecent = async () => {
        setShowSearch(false);
        if (user && user?.userId) {
            let res = await userService.addRecentSearch({ keyword: values.search });
            getRecentSearch();
        }
    };
    const removeSearch = async (value: string) => {
        try {
            if (user && user?.userId) {
                let result = recentSearch.filter((val: any) => val != value);
                setRecentSearch(result);
                let res = await userService.removeSearch({ keyword: value });
            }
        } catch (err) {}
    };
    const clearSearch = async () => {
        try {
            if (user && user?.userId) {
                setRecentSearch([]);
                let res = await userService.clearSearch();
            }
        } catch (err) {}
    };

    return (
        <div className={`flex items-center Atthemeglobalsearch ${showSearch && 'Atshowsearch'}`}>
            <button
                className=" border-gray-600"
                onClick={() => {
                    setShowSearch(true);
                }}>
                <div className={` block md:hidden  relative -mt-1  AtSearchbutton`}>
                    <div className="bg-[#43434C] h-[3.125rem]  w-[3.125rem] rounded-full flex justify-center items-center border border-transparent hover:border-white">
                        <i className="icon-search text-xl text-white"></i>
                    </div>
                </div>
                {!showSearch && (
                    // <div className="hidden md:block ">
                    <div className="bg-transparent cursor-pointer border hidden md:flex md:gap-3 items-center search  hover:border-[#b9b9bf] border-[#5A5A62] rounded-full py-4  px-5 text-sm outline-none relative  h-12 w-[10rem] sm:w-[15rem]">
                        <i className="icon-search pr-1 text-lg text-white"></i>
                        Search collections &amp; users
                    </div>
                    // </div>
                )}
            </button>
            {showSearch && (
                <div
                    className="absolute z-50 w-full    md:min-w-[350px] lg:min-w-[700px] xl:min-w-[820px]  right-0 md:right-1.5 md:mr-3"
                    ref={wrapperRef}>
                    <form className="Atformsearch   h-full" onSubmit={handleSubmit}>
                        <fieldset>
                            <svg
                                className="Atsearchicon  "
                                width="20"
                                height="20"
                                viewBox="0 0 22 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21 20.1926L17 16.3541M20 10.1165C20 15.1514 15.7467 19.2329 10.5 19.2329C5.25329 19.2329 1 15.1514 1 10.1165C1 5.08158 5.25329 1 10.5 1C15.7467 1 20 5.08158 20 10.1165Z"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <input
                                autoFocus
                                type="text"
                                name="search"
                                autoComplete="off"
                                placeholder="Search collections &amp; users"
                                onChange={debouncedEventHandler}
                                className="!text-white hover:bg-[#1F1F2C] "
                                // value={values.search}
                            />
                            <button
                                className="AtClosesearch"
                                type="button"
                                onClick={() => {
                                    setShow(false);
                                    setShowSearch(false);
                                }}>
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 13 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M11.5555 1.44434L1.44482 11.555M1.44482 1.44434L11.5555 11.555L1.44482 1.44434Z"
                                        stroke="#A1A1A5"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            {!show && user && user?.userId && recentSearch?.length > 0 && (
                                <div className="Atsearchresultholder ">
                                    <div className="AtsearchResults">
                                        <div className="flex justify-between items-center ">
                                            <h3 className="text-white uppercase text-base font-Proxima-Bold mb-[15px] ">
                                                Recent Search
                                            </h3>
                                            <Button
                                                className="!py-3 mb-[15px] !px-0 text-[#696969] hover:text-white !bg-transparent"
                                                onClick={() => {
                                                    clearSearch();
                                                }}>
                                                Clear all
                                            </Button>
                                        </div>
                                        <ul className="w-full list-none pr-2">
                                            {recentSearch?.map((item: any, i: number) => (
                                                <li
                                                    className="w-full  list-none  flex justify-between items-center  py-[6px]"
                                                    key={i}>
                                                    <div
                                                        className="flex  cursor-pointer items-center truncate gap-2"
                                                        onClick={() => setValues({ ...values, search: item })}>
                                                        <i className="icon-search pr-1 text-lg text-white"></i>
                                                        <p className="truncate text-white">{item}</p>
                                                    </div>
                                                    <div className="h-[2rem] w-[2rem] cursor-pointer hover:bg-[#43434a] cross flex justify-center items-center rounded-full">
                                                        <i
                                                            onClick={() => {
                                                                removeSearch(item);
                                                            }}
                                                            className="icon-cancel cursor-pointer text-[#696969]  text-sm"></i>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {show && (
                                <div className="Atsearchresultholder">
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            {!isEmpty(data?.data?.data?.results) && (
                                                <div className="AtsearchResults ">
                                                    <h3 className="text-[#a1a1a5] uppercase text-base font-Proxima-Bold mb-[15px]">
                                                        External Collections
                                                    </h3>
                                                    <ul className="w-full list-none ">
                                                        {data?.data?.data?.results.map((item: any) => {
                                                            return (
                                                                <ExternalCollectionList
                                                                    key={item?._id}
                                                                    item={item}
                                                                    router={router}
                                                                    saveRecent={saveRecent}
                                                                    setShow={setShow}
                                                                />
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                            {/* Collection Result Area Start */}
                                            {!isEmpty(data?.data?.data?.collections) && (
                                                <div className="AtsearchResults">
                                                    <h3 className="text-[#a1a1a5] uppercase mt-3 text-base font-Proxima-Bold mb-[15px]">
                                                        Collections
                                                    </h3>
                                                    <ul className="w-full list-none">
                                                        {data?.data?.data?.collections?.map((item: any, i: number) => {
                                                            const user = { firstName: item?.name };
                                                            return (
                                                                <li
                                                                    className="w-full list-none flex items-center gap-3 border border-b-[#303044] icon-star hover:bg-[#2A2A3D] border-transparent py-3"
                                                                    key={i}
                                                                    onClick={() => setShow(false)}>
                                                                    <Link
                                                                        legacyBehavior
                                                                        href={
                                                                            item?.address
                                                                                ? `/collections/address/${item?.address}?chain=${item?.chain}`
                                                                                : `/collections/${item?._id}`
                                                                        }>
                                                                        <a
                                                                            className="w-full list-none flex items-center gap-3  "
                                                                            onClick={() => {
                                                                                saveRecent();
                                                                            }}>
                                                                            <figure className="w-[45px] h-[45px] relative rounded-full overflow-hidden">
                                                                                {!!item?.logoPicture ? (
                                                                                    <ImageComponent
                                                                                        src={item?.logoPicture}
                                                                                        objectFit="cover"
                                                                                        layout="fill"
                                                                                        className="rounded-full"
                                                                                        transformation={
                                                                                            TRANSFORMATION_NAMES.fit_50x50
                                                                                        }
                                                                                        isUserProfile
                                                                                        user={user}
                                                                                        size={2}
                                                                                    />
                                                                                ) : (
                                                                                    <p className="w-full h-full shrink-none bg-themecolor  flex items-center justify-center rounded-full text-black1 text-base font-Proxima-SemiBold">
                                                                                        {item?.name
                                                                                            ?.charAt(0)
                                                                                            .toUpperCase()}
                                                                                    </p>
                                                                                )}
                                                                            </figure>

                                                                            <div className="flex items-center gap-2 ">
                                                                                <h4 className="text-base text-white font-Proxima-SemiBold flex items-center gap-2">
                                                                                    {item?.name}
                                                                                    {/* <span className=" ml-1.5">
                                                                                        <i
                                                                                            onClick={() =>
                                                                                                setStar(!star)
                                                                                            }
                                                                                            className={` hidden ${
                                                                                                star
                                                                                                    ? 'text-themecolor icon-start'
                                                                                                    : ' icon-ion_star text-white'
                                                                                            }   text-xl`}></i>
                                                                                    </span> */}
                                                                                </h4>
                                                                                <span>
                                                                                    {item?.isVerfied && <Verified />}
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                            {/* Collection Result Area Start */}
                                            {/* Users Result Area Start */}
                                            {!isEmpty(data?.data?.data?.accounts) && (
                                                <div className="AtsearchResults ">
                                                    <h3 className="text-[#a1a1a5] uppercase text-base mt-3 font-Proxima-Bold mb-[15px]">
                                                        Users
                                                    </h3>
                                                    <ul className="w-full list-none">
                                                        {data?.data?.data?.accounts?.map((item: any, i: number) => (
                                                            <li
                                                                className="w-full list-none flex items-center gap-3 border border-b-[#303044] hover:bg-[#2A2A3D] border-transparent  py-3"
                                                                key={i}
                                                                onClick={() => setShow(false)}>
                                                                <Link
                                                                    legacyBehavior
                                                                    href={`/profile/${item?.userName}`}>
                                                                    <a
                                                                        className="w-full list-none flex items-center gap-3"
                                                                        onClick={() => {
                                                                            saveRecent();
                                                                        }}>
                                                                        <figure className="w-[45px] relative   h-[45px] rounded-full ">
                                                                            {!!item?.avatar ? (
                                                                                <ImageComponent
                                                                                    src={item?.avatar}
                                                                                    className="rounded-full"
                                                                                    objectFit="cover"
                                                                                    layout="fill"
                                                                                    transformation={
                                                                                        TRANSFORMATION_NAMES.fit_50x50
                                                                                    }
                                                                                    isUserProfile
                                                                                    user={item}
                                                                                    size={2}
                                                                                />
                                                                            ) : (
                                                                                <p className="w-full h-full shrink-none bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl font-Proxima-SemiBold">
                                                                                    {item?.firstName
                                                                                        ?.charAt(0)
                                                                                        .toUpperCase()}
                                                                                </p>
                                                                            )}
                                                                        </figure>
                                                                        <div className="mt-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <h4 className="text-sm  gap-2 flex  leading-[14px]  text-white font-Proxima-SemiBold">
                                                                                    {item?.firstName} {item?.lastName}
                                                                                </h4>
                                                                                <span>
                                                                                    {item?.isVerfied && (
                                                                                        <VerifiedIcon />
                                                                                    )}
                                                                                </span>
                                                                            </div>

                                                                            <span className="text-[#B8B8BC] !text-[16px]   font-Proxima-Regular">
                                                                                @{item?.userName}
                                                                            </span>
                                                                        </div>
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {/* extTokensLoading */}
                                    {/* {extTokensLoading ? (
                                        <Loader />
                                    ) : (
                                        !isEmpty(extTokens) && (
                                            <div className="AtsearchResults ">
                                                <div className="flex justify-between">
                                                    <h3 className="text-[#a1a1a5] uppercase text-base font-Proxima-Bold mb-[15px]">
                                                        External Items
                                                    </h3>
                                                    <Link
                                                        legacyBehavior
                                                        href={`/searchnft?chain=ETH&query=${values.search}`}>
                                                        <a
                                                            onClick={() => {
                                                                setShow(false);
                                                                setShowSearch(false);
                                                            }}
                                                            className="cursor-pointer text-[#a1a1a5] text-base font-Proxima-Bold mb-[15px]">
                                                            View all
                                                        </a>
                                                    </Link>
                                                </div>
                                                <ul className="w-full list-none">
                                                    {extTokens?.map((item: any, i: number) => (
                                                        <li
                                                            className="w-full list-none flex items-center gap-3  py-[6px]"
                                                            key={i}
                                                            onClick={() => setShow(false)}>
                                                            <Link
                                                                legacyBehavior
                                                                href={`/nft/${item?.tokenId}?chain=${item?.chain}&&contract=${item?.contractAddress}`}>
                                                                <a
                                                                    className="w-full list-none flex items-center gap-3"
                                                                    onClick={() => {
                                                                        saveRecent();
                                                                    }}>
                                                                    <figure className="w-[45px] relative   h-[45px] rounded-full ">
                                                                        {!!item?.image ? (
                                                                            <ImageComponent
                                                                                src={item?.image}
                                                                                className="rounded-full"
                                                                                objectFit="cover"
                                                                                layout="fill"
                                                                                transformation={
                                                                                    TRANSFORMATION_NAMES.fit_50x50
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <p className="w-full h-full shrink-none bg-themecolor flex items-center justify-center rounded-full text-black1 text-xl font-Proxima-SemiBold">
                                                                                {item?.name?.charAt(0).toUpperCase()}
                                                                            </p>
                                                                        )}
                                                                    </figure>
                                                                    <div className="mt-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className="text-sm  gap-2 flex  leading-[14px]  text-white font-Proxima-SemiBold">
                                                                                {item?.name}
                                                                            </h4>
                                                                            {item?.chain &&
                                                                                blockchains?.filter(
                                                                                    (chain: any) =>
                                                                                        item?.chain == chain?.symbol
                                                                                )[0]?.tagname}
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    )} */}

                                    {isEmpty(data?.data?.data?.collections) &&
                                        isEmpty(data?.data?.data?.accounts) &&
                                        isEmpty(data?.data?.data?.results) &&
                                        // isEmpty(extTokens) &&
                                        // !loading &&
                                        !isLoading && (
                                            <div className="AtsearchNodatafound">
                                                <Notfound />
                                            </div>
                                        )}
                                    {/* Users Result Area Start */}
                                </div>
                            )}
                        </fieldset>
                    </form>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
