import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import ImageComponent from '../../components/Image/ImageComponent';
import Button from '../../components/Button/Button';
import Verified from '../../components/verified';
import Popups from '../../components/popup/poups';
import Image from 'next/image';
import axios from 'axios';
import { Follow } from '../../components/Follow/follow';
import { connectRoom } from '../../redux/messages/actions';
import { kingsData } from '../MapModule/king';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import useMetaMask from '../../hooks/useMetaMask';
import { getLands, getMylands } from '../../redux/landmap/actions';

const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

const EditMyLands = () => {
    // const myPlots = useSelector((state: any) => state.landmap.lands);
    const router = useRouter();
    const dispatch = useDispatch();
    const { account }: any = useMetaMask();
    const topLandowners = useSelector((state: any) => state.landmap.topLandOwners);
    const myPlots = useSelector((state: any) => state.landmap.mylands);

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const user = useSelector((state: any) => state.auth.user);

    const [selLand, setSelLand] = useState(null);
    const [selLands, setSelLands] = useState(null);

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

    const getAvatarURL = (url: string) => {
        return url
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/` + url
            : '/assets/images/default.png';
    };

    const handleUpdate = (st: number) => {
        setState(st);
        dispatch(getMylands(account));
    };
    return (
        <>
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

                    <h2 className="text-white text-center text-3xl mb-4">Edit My Lands</h2>
                    <div className="min-h-[690px] max-h-[390px] overflow-auto at-sidebarwrapper scrollbarHide">
                        {myPlots &&
                            Object.keys(myPlots).map((key, index) => (
                                <div className="bg-[#1A1B22] px-4 py-1 flex justify-between mt-4" key={index}>
                                    <div className={'hidden font-normal flex truncate Atcheckbox items-center '}>
                                        <input
                                            id=""
                                            checked={false}
                                            type="checkbox"
                                            readOnly
                                            className={` `}
                                            name="Background"
                                        />
                                        <span className="float-right"></span>
                                    </div>
                                    <div className="w-[70%] flex gap-2.5 items-center">
                                        <figure className="w-[40px] h-[40px] UerProfileImage bg-[#272737] flex items-center justify-center relative flex-shrink-0">
                                            <Image
                                                width={40}
                                                height={40}
                                                className=""
                                                src={myPlots[key]?.logo || '/assets/images/default.png'}
                                                alt=""
                                            />
                                        </figure>
                                        <p style={{ wordWrap: 'break-word' }} className="w-[100%] text-base">
                                            <span className="text-white">
                                                {myPlots[key]?.name} {`#${myPlots[key]?.landID}`}
                                            </span>
                                            <br /> {myPlots[key]?.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <Button
                                            className="rounded-2xl   text-sm gold !w-16  h-8 !px-0  "
                                            onClick={() => {
                                                setSelLand(myPlots[key]);
                                                setPopup(true);
                                                setState(99);
                                            }}>
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            </div>
            {state > 90 && selLand && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    data={{ ...selLand, isOwner: true }}
                    state={state}
                    setstate={handleUpdate}
                />
            )}
        </>
    );
};

export default EditMyLands;
