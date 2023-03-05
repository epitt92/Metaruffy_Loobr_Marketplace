import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import ImageComponent from '../../components/Image/ImageComponent';
import Image from 'next/image';
import Button from '../../components/Button/Button';
import { MinlandData } from './minlanddata';
import { Islandata1 } from './islanddata1';
import { Islandata2 } from './islanddata2';
import Verified from '../../components/verified';
import { kingData } from '../MapModule/king';
import { Follow } from '../../components/Follow/follow';
import { useRouter } from 'next/router';
import { connectRoom } from '../../redux/messages/actions';
import { useDispatch } from 'react-redux';
import UserItem from '../../components/landmap/UserItem';
const fontSize = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base'];

const LandownerComponent = ({ owners }) => {
    const router = useRouter();
    const dispatch = useDispatch();

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
    return (
        <div className="w-full">
            <div className="flex gap-3.5 justify-center ">
                <div>
                    <div className="flex gap-2">
                        {/* <figure className="mt-16">
                            <ImageComponent className="" src="/assets/images/crown.png" height={50} width={50} />
                        </figure> */}
                        <div>
                            <Button className="bg-transparent px-0 !py-1 flex gap-x-1.5 cursor-default  flex-col justify-center items-center">
                                <div className="flex gap-x-1.5 items-center !font-Proxima-Bold">
                                    {/* <ImageComponent
                                        src="/assets/images/topleader1.png"
                                        className="!mt-2"
                                        height={30}
                                        width={27}
                                    /> */}
                                    <span className="text-3xl text-white">{owners[0].island}: </span>{' '}
                                </div>
                            </Button>
                            {owners.map((item: any, i: number) => (
                                <div
                                    key={i + 'leaderboard-owners'}
                                    className={`${!i ? 'border-2 border-dashed' : ''} border-themecolor mb-2 w-full`}>
                                    <UserItem item={item} num={i + 1} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandownerComponent;
