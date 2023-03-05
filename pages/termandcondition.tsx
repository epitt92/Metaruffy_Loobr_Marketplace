import Head from 'next/head';
import React from 'react';
import TermAndConditionsModule from '../src/modules/TermAndConditionsModule/TermAndConditionsModule';

const TermAndCondition = () => {
    return (
        <>
            {' '}
            <Head>
                <title>LooBr | Terms & Conditions; </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>{' '}
            <TermAndConditionsModule />
        </>
    );
};

export default TermAndCondition;
