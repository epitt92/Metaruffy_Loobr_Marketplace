import Head from 'next/head';
import React from 'react';
import Moblileviewchatmodule from '../src/modules/mobileviewchatmodule/Moblileviewchatmodule';

const Mobileviewchat = () => {
    return (
        <>
            <Head>
                <title>LooBr | Message </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Moblileviewchatmodule />
        </>
    );
};

export default Mobileviewchat;
