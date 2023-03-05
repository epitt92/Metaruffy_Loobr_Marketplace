import Head from 'next/head';
import React from 'react';
import DisclamerModule from '../src/modules/DisclamerModule/DisclamerModule';

const Disclamer = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Data Disclamer </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DisclamerModule />
        </div>
    );
};

export default Disclamer;
