import Head from 'next/head';
import React from 'react';
import ComingSoon from './ComingSoon';

const Staking = () => {
    return (
        <div className="container !min-h-0 pt-6 pb-28">
            <Head>
                <title>LooBr | Mystry Box</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ComingSoon />
        </div>
    );
};

export default Staking;
