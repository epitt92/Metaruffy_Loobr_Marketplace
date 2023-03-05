import React, { useEffect, useState } from 'react';
import Head from 'next/head';
// import { EditprofileModal } from '../src/modules/editprofilemodule/editprofilemodule';

import UserProfileModule from '../src/modules/UserProfileModule/UserModule';
import ProfileModule from '../src/modules/ProfileModule/ProfileModule';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Loader from '../src/components/loader/Loader';

const Userprofile = () => {
    const router = useRouter();
    const { username } = router.query;
    const user = useSelector((state: any) => state.auth.user);
    const getLoading = useSelector((state: any) => state.auth.getLoading);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        if (!getLoading) {
            setLoading(false);
        }
    }, [getLoading]);
    return (
        <>
            <Head>
                <title>LooBr | Edit Profile </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {loading ? (
                <div className="h-screen">
                    <Loader />
                </div>
            ) : (
                <>{isAuthenticated && user?.userName === username ? <ProfileModule /> : <UserProfileModule />}</>
            )}
        </>
    );
};

export default Userprofile;
