import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import ImageComponent from '../Image/ImageComponent';
import Verified from '../verified';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import { feedService } from '../../services/feed.service';
import Loader from '../loader/Loader';
import { useRouter } from 'next/router';
import { Follow } from '../Follow/follow';
const PollVoters = ({ data, setstate }: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [voters, setVoters] = useState<any>([]);
    useEffect(() => {
        if (data) {
            getVotes();
        }
    }, []);
    const getVotes = async () => {
        setLoading(true);
        try {
            let res = await feedService.getPollVoters(data);
            setVoters(res?.data?.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };
    const router = useRouter();
    return (
        <div className="w-[28.125rem] xs4:w-[25rem]  rounded-2xl py-3 min-h-[28rem]">
            <h3 className=" border border-b-[#2B2B35] border-transparent  text-white  text-center py-2">Voters </h3>
            <div className="overflow-y-auto max-h-[31.25rem] at-sidebarwrapper AtScroll mt-2">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {voters?.map((vote: any) => {
                            return (
                                <div className="py-2 px-6 flex justify-between items-center ">
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => {
                                            router.push(`/profile/${vote?.userName}`);
                                        }}>
                                        {/* <ImageComponent
                                            src="/assets/images/avr1.png"
                                            width={50}
                                            height={50}
                                            alt=""
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        /> */}
                                        <figure className="flex items-center justify-center rounded-full w-14 h-14 relative overflow-hidden UerProfileImage ">
                                            {vote?.avatar ? (
                                                <ImageComponent
                                                    className="rounded-full"
                                                    src={vote?.avatar}
                                                    alt=""
                                                    // height={56}
                                                    // width={56}
                                                    objectFit="cover"
                                                    layout="fill"
                                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                />
                                            ) : (
                                                <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                                    {vote?.firstName?.charAt(0).toUpperCase()}
                                                </p>
                                            )}
                                        </figure>
                                        <div className="pl-4">
                                            <div className="flex gap-1.5 items-center">
                                                <h4 className=" text-base text-white max-w-[9.5rem]  truncate">
                                                    {vote?.firstName} {vote?.lastName}
                                                </h4>
                                                {vote?.isVerfied && <Verified />}
                                            </div>
                                            <p className="text-[14px] max-w-[150px] lg:max-w-auto truncate">
                                                @{vote?.userName}
                                            </p>
                                        </div>
                                    </div>
                                    {/* <Button className=" px-6 h-[29px] text-sm gold">Follow</Button> */}
                                    <Follow userModule={true} otherUser={vote} />
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default PollVoters;
