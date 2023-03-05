import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { userService } from '../../../services/user.service';
import Loader from '../../../components/loader/Loader';
import { Follow } from '../../../components/Follow/follow';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import ImageComponent from '../../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';

const tabs = [
    { name: 'Followers', current: true },
    { name: 'Following', current: false }
];
const FollowTabs = ({ data, setConfirmed, type }: any) => {
    const [loading, setLoading] = useState<Boolean>(false);
    const [user, setUser] = useState<any>();
    const [change, setChange] = useState<boolean>(false);
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const userAuth = useSelector((state: any) => state.auth.user);

    const onSelectTab = (i: any) => {
        if (change) return;
        setSelectedTabIdx(i);
    };
    useEffect(() => {
        setLoading(true);
        if (data) {
            // console.log('This is due to start');
            getData();
        }
    }, []);
    useEffect(() => {
        if (data && change) {
            // console.log('This is due to change');
            setChange(false);
            getData();
        }
        ``;
    }, [change]);
    useEffect(() => {
        if (type == 'followers') {
        } else {
            setSelectedTabIdx(1);
        }
    }, []);

    useEffect(() => {
        // console.log('This is due to  selectedTabIdx');
        getData();
    }, [selectedTabIdx]);
    const getData = async () => {
        const allData = await userService.getfollowers(data);

        setUser(allData.data.data);
        setChange(false);
        setLoading(false);
    };
    return (
        <>
            <div className=" flex flex-wrap items-center mb-4 relative z-10" aria-label="Tabs">
                {tabs.map((tab, i) => (
                    <a
                        key={i}
                        className={`
                ${i === selectedTabIdx ? '!bg-[#F1C94A] !text-[#2B2B35]' : 'bg-darkgray !text-white !text-lg'}
                 px-6 !py-2 w-1/2 cursor-pointer min-h-[58px] text-lg flex items-center justify-center borders font-montserrat-regular focus:outline-none `}
                        onClick={() => onSelectTab(i)}>
                        {tab.name}
                    </a>
                ))}
            </div>

            {selectedTabIdx === 0 && (
                <div className="overflow-y-scroll at-sidebarwrapper min-h-[25rem] max-h-[25rem] scrolHide">
                    {loading && (
                        <div className="flex justify-center mt-12">
                            <Loader />
                        </div>
                    )}

                    {user && user.followers && user.followers.length > 0 ? (
                        <>
                            {' '}
                            {user.followers.map((item: any, index: number) => (
                                <>
                                    <div className="py-2 px-6 flex justify-between items-center " key={index}>
                                        <div className="flex items-center w-full">
                                            <a
                                                href={`${
                                                    // userAuth && userAuth.userId == item?._id
                                                    //     ? '/profile/me'
                                                    //     :
                                                    `/profile/${item?.userName}`
                                                }`}>
                                                {item.avatar && (
                                                    <figure className="w-[50px] h-[50px]  rounded-full relative overflow-hidden UerProfileImage flex items-center justify-center">
                                                        <ImageComponent
                                                            src={item.avatar}
                                                            // width={50}
                                                            // height={50}
                                                            objectFit="cover"
                                                            layout="fill"
                                                            alt=""
                                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                        />
                                                    </figure>
                                                )}
                                                {!item.avatar && (
                                                    <figure className="w-[50px] h-[50px] rounded-full UerProfileImage overflow-hidden flex items-center justify-center">
                                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                            {item?.firstName.charAt(0).toUpperCase()}
                                                        </p>
                                                    </figure>
                                                )}
                                            </a>

                                            <h4 className="pl-4 text-base text-white w-full max-w-[50%] min-w-[50%] truncate">
                                                {item.firstName} {item.lastName}
                                            </h4>
                                        </div>
                                        <Follow otherUser={item} setChange={setChange} setConfirm={setConfirmed} />
                                        {/* <Button className=' px-6 h-[29px] text-sm gold'>Follow</Button> */}
                                    </div>
                                </>
                            ))}
                        </>
                    ) : (
                        !loading && (
                            <Notfounditem
                                title="No Following Found"
                                desc={'Go to Social Feed page to follow'}
                                buttonText="Follow"
                                buttonLink="/feeds"
                            />
                        )
                    )}
                    {/* {loading && user && user.followers && user.followers.length > 0 ? <></> :
                        <Notfounditem title='No Follower Found' desc={"Go to All Users page to follow"} buttonText="Follow" buttonLink="/alluserspage" />
                    } */}
                </div>
            )}

            {selectedTabIdx === 1 && (
                <div className="overflow-y-scroll min-h-[25rem] max-h-[25rem] at-sidebarwrapper scrolHide">
                    {loading && (
                        <div className="flex justify-center mt-12">
                            <Loader />
                        </div>
                    )}
                    {user && user.following && user.following.length > 0 ? (
                        <>
                            {user.following.map((item: any, index: number) => (
                                <>
                                    <div className="py-2 px-6 flex justify-between items-center " key={index}>
                                        <div className="flex items-center w-full">
                                            <a
                                                href={`${
                                                    // userAuth && userAuth.userId == item?._id
                                                    //     ? '/profile/me'
                                                    //     :
                                                    `/profile/${item?.userName}`
                                                }`}>
                                                {item.avatar && (
                                                    <figure className="w-[50px] h-[50px] relative rounded-full overflow-hidden UerProfileImage flex items-center justify-center">
                                                        <ImageComponent
                                                            src={item.avatar}
                                                            // width={50}
                                                            // height={50}
                                                            objectFit="cover"
                                                            layout="fill"
                                                            alt=""
                                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                        />
                                                    </figure>
                                                )}
                                                {!item.avatar && (
                                                    <figure className="w-[50px] h-[50px] rounded-full UerProfileImage flex items-center justify-center">
                                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                            {item?.firstName.charAt(0).toUpperCase()}
                                                        </p>
                                                    </figure>
                                                )}
                                            </a>
                                            <h4 className="pl-4 text-base text-white  w-full max-w-[50%] min-w-[50%] truncate">
                                                {item.firstName} {item.lastName}
                                            </h4>
                                        </div>
                                        <Follow otherUser={item} setChange={setChange} setConfirm={setConfirmed} />
                                        {/* <Button className=' px-6 h-[29px] text-sm gold'>Follow</Button> */}
                                    </div>
                                </>
                            ))}
                        </>
                    ) : (
                        !loading && (
                            <Notfounditem
                                title="No Following Found"
                                desc={'Go to Social Feed page to follow'}
                                buttonText="Follow"
                                buttonLink="/feeds"
                            />
                        )
                    )}
                    {/* {loading && user && user.following && user.following.length > 0 ? <></> :
                        <Notfounditem title='No Following Found' desc={"Go to All Users page to follow"} buttonText="Follow" buttonLink="/alluserspage" />
                    } */}
                </div>
            )}
        </>
    );
};
export default FollowTabs;
