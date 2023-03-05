import Head from 'next/head';
import React from 'react';
import withAuth from '../src/components/Hoc/withAuth';
import ChooseNftModule from '../src/modules/ChooseNftModule/ChooseNftModule';

const Choosenft = () => {
    return (
        <div>
            <Head>
                <title>Create Your NFT Collection for Free | LooBr</title>
                <meta
                    name="description"
                    content="NFTs are becoming more and more part of everyday life. Now create your NFT Collection online with Loobr. We are available with single NFTs and Multiple NFTs. Choose yours now!"
                />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://loobr.com/choosenft" />
                <meta
                    name="keywords"
                    content="How to Create an NFT For Free, How to Create NFT Collection, How To Create NFT On Loobr, Mint NFT For Free, Where To Buy NFT"></meta>
            </Head>
            <ChooseNftModule />
        </div>
    );
};

export default withAuth(Choosenft);
