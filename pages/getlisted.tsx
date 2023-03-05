import Head from 'next/head';
import React from 'react';
import GetListed from '../src/modules/GetListed/GetListed';

const MultipleCreatePage = () => {
    return (
        <>
            <Head>
                <title>LooBr | Get listed </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <GetListed />;
        </>
    );
};

export default MultipleCreatePage;
