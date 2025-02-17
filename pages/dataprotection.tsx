import Head from 'next/head';
import React from 'react';
import DataProtectionModule from '../src/modules/DataProtectionModule/DataProtectionModule';

const DataProtection = () => {
    return (
        <>
            <Head>
                <title>LooBr | Data protection </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <DataProtectionModule />;
        </>
    );
};

export default DataProtection;
