import React, { useEffect } from 'react';
import TopUsersCard from '../../../components/popup/TopUserscard';
import { Topuserdata } from '../../../data/Topuser';
import Button from '../../../components/Button/Button';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getRecentlyRegistered, getTopUsers } from '../../../redux/user/actions';
import Loader from '../../../components/loader/Loader';

const TopUsers = () => {
    const dispatch = useDispatch();

    const users = useSelector((state: any) => state.user.recentUsers);
    const loading = useSelector((state: any) => state.user.recentUsersLoading);

    useEffect(() => {
        // const filters = {
        //   pageSize: 15,
        // };
        // dispatch(getTopUsers(filters));
        dispatch(getRecentlyRegistered());
    }, []);

    return (
        <div className="">
            <div className="flex items-center xs:block justify-between container  !min-h-0">
                <h2 className="xl:text-[48px] text-5xl text-white ">Top Users</h2>
                {/* <Link legacyBehavior href="/alluserspage">
                    <a>
                        <Button className=" xs: mt-0  xd: w-full xs:mt-4 border px-8 !text-white border-[#5A5A62] bg-transparent rounded-full">
                            View All
                        </Button>
                    </a>
                </Link> */}
            </div>
            {loading && <Loader />}
            <div className="container !min-h-0 pb-24 pt-12 relative grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3  sm:grid-cols-2 gap-8">
                {users && users?.map((item: any, i: number) => <TopUsersCard {...item} key={item?._id} item={item} />)}
            </div>
        </div>
    );
};

export default TopUsers;
