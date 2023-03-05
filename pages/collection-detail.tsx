import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Button from '../src/components/Button/Button';
import MainCard from '../src/components/maincard/MainCard';
import Search from '../src/components/search/Search';
import Select from '../src/components/select/Select';
import { getMarketPlace } from '../src/redux/nft/actions';
import { useDispatch, useSelector } from 'react-redux';

const sortdata = [
    { id: 0, name: 'Sort by' },
    { id: 1, name: 'Low to High' },
    { id: 2, name: 'High to Low' }
];
const CollectionDetail = () => {
    const [listings, setListings] = useState<Array<any>>([]);

    const marketplace = useSelector((state: any) => state.nft.marketplace);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getMarketPlace);
    }, []);

    return (
        <div>
            <Head>
                <title>LooBr | Collection Detail</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <figure className="w-full h-[350px] Atcollectionbanner AtthemeImage">
                <Image width={1920} height={350} src="/assets/images/collectionimages/cover.jpg" alt="Banner Image" />
            </figure>
            <div className="container pb-28">
                <div className="w-full max-w-[815px] mx-auto m-[-82px] mb-24">
                    <figure className="AtthemeImage w-[164px] h-[164px] rounded-full border border-white mx-auto">
                        <Image
                            width={164}
                            height={164}
                            className="rounded-full"
                            src="/assets/images/collectionimages/logo-image.jpg"
                            alt={''}
                        />
                    </figure>
                    <h3 className="text-white font-Proxima-Bold text-center text-4xl mt-6">Gooniez Gang</h3>
                    <p className="text-center mt-3 text-[#a1a1a5]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis ut venenatis, volutpat nibh.
                        Habitasse odio aliquam tristique vestibulum at massa leo ullamcorper non. Morbi tristique
                        aliquam auctor urna, augue arcu. Vel viverra feugiat dolor, eu platea. Felis leo nulla vivamus
                        fringilla.
                    </p>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div className="relative Atcollectionsearch">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21 21L17 17M20 10.5C20 15.7467 15.7467 20 10.5 20C5.25329 20 1 15.7467 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5Z"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <input type="search" name="search" placeholder="Search" />
                        </div>
                        <div className="flex justify-end">
                            <Select className="rounded-[50px]" style="!w-[220px] !m-0" data={sortdata} />
                        </div>
                    </div>
                    <div className="flex">
                        <div className=" grid 2xl:grid-cols-3 xl:grid-cols-2 sm:grid-cols-2   lg:grid-cols-3 gap-7 lg:gap-10">
                            {marketplace &&
                                listings?.map((item: any, i: number) => (
                                    <MainCard key={i} where="listing" listing={item} nft={item?.nft} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetail;
