import Head from 'next/head';
import React from 'react';
import GenralHead from '../src/components/head/GenralHead';
import TwitterHead from '../src/components/head/TwitterHead';
import TrendsModule from '../src/modules/TrendsModule/TrendsModule';

const Trends = () => {
    return (
        <>
            <Head>
                <title>LooBr | Trends </title>
                <link rel="icon" href="/favicon.ico" />
                {/* genral */}
                <meta property="og:image" content={'/meta-trends.png'} key={'image'} />
                <meta property="og:url" content={'https://loobr.com/trends'} key="ogurl" />
                <meta
                    property="og:title"
                    content={'LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs'}
                    key={'title'}
                />
                <meta
                    name="og:description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'OGdescription'}
                />
                <meta property="og:image" content="/meta-trends.png" key={'image'} />
                <meta
                    name="description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/trends'} key="ogurl" />
                <meta name="twitter:site" content={'@loobr_com'} key={'twitterSite'} />
                <meta name="twitter:creator" content="@loobr_com" key={'twitterCreater'} />
                <meta
                    name="twitter:title"
                    content={'LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs'}
                    key={'twitterTitle'}
                />
                <meta
                    name="twitter:description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'twitterDescription'}
                />
                <meta name="twitter:image" content={'/meta-trends.png'} key={'twitterImage'} />
            </Head>{' '}
            <TrendsModule />
        </>
    );
};

export default Trends;
