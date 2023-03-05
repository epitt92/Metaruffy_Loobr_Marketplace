import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ImageComponent from '../../components/Image/ImageComponent';
import Button from '../../components/Button/Button';
import Verified from '../../components/verified';
import { kingData } from '../MapModule/king';
import LandownerComponent from './landdownercomponent';
import { Follow } from '../../components/Follow/follow';
import { connectRoom } from '../../redux/messages/actions';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../components/loader/Loader';

const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

const TopLandownerModule = () => {
    const topIslandowners = useSelector((state: any) => state.landmap.topIslandOwners);
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }
    const conectRoom = (id: any) => {
        dispatch(
            connectRoom({
                recievedBy: id,
                type: 'PRIVATE'
            })
        );
    };
    const [islandOwners, setIslandOwners] = useState([]);
    const getKingdomshipData = async () => {
        axios.get(`${BACKEND_URL}/api/top/global`);
    };

    const getIslandsData = async () => {
        setLoading(true);
        let islandOwnersRes = await axios.get(`${BACKEND_URL}/api/islandOwnersInfo/5`);
        setIslandOwners(islandOwnersRes.data);
        setLoading(false);
        console.log('success', islandOwnersRes.data[0]);
    };

    const getAvatarURL = (url: string) => {
        return url
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/` + url
            : '/assets/images/default.png';
    };
    useEffect(() => {
        // getIslandsData();
    }, []);
    return (
        <>
            <div className="container min-h-[50vh] py-16 pb-20 ">
                <h2 className="text-white text-center">LEADERBOARD</h2>
                {/* <h3 className="text-3xl text-white text-center">per island / mainland</h3> */}

                {/* <div className="flex justify-center items-center">
                    <Button className="px-6 cursor-default !py-1 flex gap-x-2  flex-col  items-center">
                        <div className="flex gap-x-1.5 items-center !font-Proxima-Bold">
                            <ImageComponent src="/assets/images/region.png" className="!mt-4" height={45} width={40} />
                            <span className="border-b-[1px] border-[#2b2b35]"> TOP LANDOWNER</span>{' '}
                        </div>
                        <span className="text-center !ml-8 -mt-2">Islands / District</span>
                    </Button>
                </div> */}
                {!topIslandowners ? (
                    <Loader />
                ) : (
                    <div className="grid 2xl:grid-cols-3   xl:grid-cols-2   gap-4 mt-12">
                        {topIslandowners &&
                            topIslandowners.map((item: any, i) => (
                                <LandownerComponent key={i + 'leaderboard'} owners={item} />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TopLandownerModule;
