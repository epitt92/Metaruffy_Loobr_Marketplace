import Head from 'next/head';
import React from 'react';
import Prov2 from '../../../src/modules/MarketPlaceModule/ProV2';

const pro = () => {
    return (
        <>
            <Head>
                <title>MarketPlace-Pro | LooBr</title>
                <meta
                    name="description"
                    content=""
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Prov2/>
        </>
    );
};

export default pro;
