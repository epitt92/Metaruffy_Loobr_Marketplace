import Head from 'next/head';
import React from 'react';
import MarketPlaceDetailModule from '../../src/modules/module-v2/MarketPlace-V2-Detail/MarketPlace-V2-Detail';

const MarketplaceDetail = () => {
    return (
        <>
            <Head>
                <title>MarketPlace-Detail | LooBr</title>
                <meta
                    name="description"
                    content=""
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        <MarketPlaceDetailModule/>
        </>
    );
};

export default MarketplaceDetail;
