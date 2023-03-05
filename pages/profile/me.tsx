import type { NextPage } from 'next';
import Head from 'next/head';
// import ProfileModule from '../../src/modules/ProfileModule/ProfileModule';
import withAuth from '../../src/components/Hoc/withAuth';

const Profile = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Profile</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <ProfileModule /> */}
        </div>
    );
};

export default withAuth(Profile);
