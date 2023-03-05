import React from 'react';
import Head from 'next/head';
import ComingSoon from './ComingSoon';
import dynamic from 'next/dynamic';

const MapPage = dynamic(() => import('../src/modules/MapModule/mappage'), {
    ssr: false
});
const Landmap = () => {
    return (
        <div className="relative !min-h-[50vh]">
            <Head>
                <title>LooBr | Landmap</title>

                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MapPage />
        </div>
    );
};

export default Landmap;
