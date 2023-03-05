import React from 'react';
import Head from 'next/head';

import MetaRuffyModule from '../src/modules/MetaRuffyModule/MetaRuffyModule';
import TwitterHead from '../src/components/head/TwitterHead';
import GenralHead from '../src/components/head/GenralHead';

const MetaRuffy = () => {
    return (
        <div>
            <Head>
                <title>Meta Ruffy NFT Marketplace | LooBr</title>

                {/* genral */}
                <meta property="og:url" content={'https://loobr.com/metaruffy'} key="ogurl" />
                <meta
                    property="og:title"
                    content={'LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs'}
                    key={'title'}
                />
                <meta
                    name="og:description"
                    content={
                        ' Meta Ruffy is Metaverse open world based on the latest technology, which merges web3.0, blockchain, VR, & AR. To know more about Meta Ruffy coin, tokens, and news, visit us now!'
                    }
                    key={'OGdescription'}
                />
                <meta property="og:image" content="/loobr-landing-view.png" key={'image'} />
                <meta
                    name="description"
                    content=" Meta Ruffy is Metaverse open world based on the latest technology, which merges web3.0, blockchain, VR, & AR. To know more about Meta Ruffy coin, tokens, and news, visit us now!"
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/metaruffy'} key="ogurl" />
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
                        ' Meta Ruffy is Metaverse open world based on the latest technology, which merges web3.0, blockchain, VR, & AR. To know more about Meta Ruffy coin, tokens, and news, visit us now!'
                    }
                    key={'twitterDescription'}
                />
                <meta name="twitter:image" content={'/loobr-landing-view.png'} key={'twitterImage'} />

                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://loobr.com/metaruffy" />
                <meta
                    name="keywords"
                    content="How To Buy Meta Ruffy, Meta Ruffy Coin, Meta Ruffy Crypto, Meta Ruffy News, Meta Ruffy NFT Marketplace, Meta Ruffy Staking, Meta Ruffy Token"></meta>
            </Head>
            <MetaRuffyModule />;
        </div>
    );
};

export default MetaRuffy;
