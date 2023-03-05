import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ImageComponent from '../../components/Image/ImageComponent';
import Button from '../../components/Button/Button';
import Verified from '../../components/verified';
import Image from 'next/image';
import axios from 'axios';
import { Follow } from '../../components/Follow/follow';
import { connectRoom } from '../../redux/messages/actions';
import { kingsData } from '../MapModule/king';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

const TopLandownerComponent = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const topLandowners = useSelector((state: any) => state.landmap.topLandOwners);

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
    const [landOnwers, setLandOnwers] = useState([]);
    const getKingdomshipData = async () => {
        axios.get(`${BACKEND_URL}/api/top/global`);
    };

    const getIslandsData = async () => {
        let landOnwersRes = await axios.get(`${BACKEND_URL}/api/top/global`);
        setLandOnwers(landOnwersRes.data);
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
        <div className=" px-8 pt-4 pb-8 sm:w-[500px]">
            <>
                {/* <Link href="/leaderboard" legacyBehavior>
                    <a className="flex justify-center ">
                        <Button className="px-3 py-4 flex gap-1.5 mb-4 items-center">
                            <ImageComponent src="/assets/images/topleader1.png" height={30} width={27} />
                            <span className="border-b-[1px] "> TOP LANDOWNER </span>{' '}
                        </Button>
                    </a>
                </Link> */}

                <h2 className="text-white text-center text-3xl mb-4">Top 20 Land Owners</h2>
                <div className="min-h-[690px] max-h-[390px] overflow-auto at-sidebarwrapper scrollbarHide">
                    {topLandowners &&
                        topLandowners.map((item: any, i) => (
                            <div className="bg-[#1A1B22] px-4 py-1 flex justify-between mt-4" key={i + 'top-20-owners'}>
                                <div className="flex gap-2.5 items-center">
                                    <span className="text-white">{i + 1}</span>
                                    <figure className="w-[40px] h-[40px]   rounded-full UerProfileImage bg-[#272737] flex items-center justify-center relative flex-shrink-0">
                                        <i className="w-[10px] rounded-full h-[10px] block absolute border-1 bottom-0 right-[30px] border-white z-10 bg-[#646465]"></i>
                                        <Image
                                            width={40}
                                            height={40}
                                            className="rounded-full "
                                            src={getAvatarURL(item.user.avatar)}
                                            alt=""
                                        />
                                    </figure>
                                    <div>
                                        <div className="flex gap-1.5 items-center">
                                            <h5
                                                className="hover:cursor-pointer font-Proxima-Regular text-white text-lg"
                                                onClick={() => router.push(`/profile/${item.user?.userName}`)}>
                                                {' '}
                                                {item.user.firstName} {item.user.lastName}
                                            </h5>
                                            {item?.isVerified && <Verified />}
                                        </div>

                                        <p className="text-base -mt-1">
                                            {' '}
                                            {item.info ? item.info.followers.length : 0} Followers
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Follow
                                        customClass={
                                            '!rounded-2xl !min-w-[80px] !max-w-[80px] !text-sm gold !w-16  h-8 !px-0'
                                        }
                                        userModule={true}
                                        otherUser={item.info}
                                    />
                                    <Button className="rounded-2xl   text-sm gold !w-16  h-8 !px-0  ">
                                        {item.landCount}
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            </>
        </div>
    );
};

export default TopLandownerComponent;
