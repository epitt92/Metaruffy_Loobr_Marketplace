import Head from 'next/head';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import Button from '../src/components/Button/Button';
// import Select from '../src/components/Select/Select';
import { Topuserdataall } from '../src/data/Topuserall';
import TopUsersCard from '../src/components/popup/TopUserscard';
import Select from '../src/components/select/Select';
import Input from '../src/components/input/Input';
import { getAllUsers, getTopUsers } from '../src/redux/user/actions';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../src/components/loader/Loader';
import DirectChat from '../src/components/Chat/DirectChat';
import Notfound from '../src/components/notfound/notfound';
import { isEmpty } from 'validate.js';
const Alluserspage = () => {
    const [search, setSearch] = useState('');
    const authUser = useSelector((state: any) => state.auth.user);
    const allUsers = useSelector((state: any) => state.user.allUsers);
    const loading = useSelector((state: any) => state.user.allUsersLoading);
    const [page, setPage] = useState(1);
    const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
    const [users, setUsers] = useState<Array<any>>([]);

    const dispatch = useDispatch();
    useEffect(() => {
        const fileters = {
            search,
            pageSize: 30,
            page: page
        };
        dispatch(getAllUsers(fileters));
    }, [dispatch, page, search]);

    useEffect(() => {
        if (isLoadMoreClicked) {
            allUsers?.users && setUsers([...users, ...allUsers?.users]);
        } else {
            allUsers?.users && setUsers(allUsers?.users);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allUsers]);

    const hasMoreItem = () => {
        return allUsers?.metadata?.totalPages > page;
    };

    const handleLoadMore = () => {
        setIsLoadMoreClicked(true);
        setPage(page + 1);
    };

    return (
        <div className="container pt-28 pb-28 min-h-[900px] ">
            <Head>
                <title>LooBr | All Users</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex items-center xs:block justify-between xs:mb-4 mb-8">
                <h2 className="xl:text-[48px] xs:w-full  text-5xl text-white">All Users</h2>
                <div className="relative max-w-[24.688rem] min-w-[24.688rem] w-full sm:mt-0 mt-5">
                    <Input
                        className="text-white pl-12 !rounded-full placeholder: placeholder:text-xl"
                        placeholder="Search"
                        name="search"
                        onchange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        value={search}
                    />
                    <i className="icon-search text-white absolute top-1/2 translate-y-[-50%] left-[20px]"></i>
                </div>
            </div>
            <div className="py-24 relative grid  xl:grid-cols-4  lg:grid-cols-3  sm:grid-cols-2 gap-8">
                {users?.map((item: any, i: number) => (
                    <TopUsersCard {...item} key={i} />
                ))}
            </div>
            {loading && (
                <div className=" flex w-full  justify-center ">
                    <Loader />
                </div>
            )}

            {/* {authUser && authUser.userId && <DirectChat />} */}
        </div>
    );
};

export default Alluserspage;
