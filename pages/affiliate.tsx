import Head from 'next/head';
import React from 'react';
import ReferralModule from '../src/modules/ReferralModule/ReferralModule';

const Referral = () => {
    return (
        <>
            <Head>
                <title>LooBr | Affiliate </title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ReferralModule />
        </>
    );
};

export default Referral;
