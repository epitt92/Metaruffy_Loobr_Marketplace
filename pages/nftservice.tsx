import React from 'react';
import Head from 'next/head';

import NftServiceModule from '../src/modules/NftServiceModule/NftServiceModule';

const NftService = () => {
    return (
        <div>
            <Head>
                <title>Custom Free NFT Generator Online | NFT design services | LooBr</title>
                {/* genral */}
                <meta property="og:url" content={'https://loobr.com/nftservice'} key="ogurl" />
                <meta
                    property="og:title"
                    content={'LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs'}
                    key={'title'}
                />
                <meta
                    name="og:description"
                    content={
                        'Want to design your custom NFT collection but do not know where to start? LooBr creative team will help you every step of the way for either a 2D or a 3D NFT collection. Visit now!'
                    }
                    key={'OGdescription'}
                />
                <meta property="og:image" content="/loobr-landing-view.png" key={'image'} />
                <meta
                    name="description"
                    content="Want to design your custom NFT collection but do not know where to start? LooBr creative team will help you every step of the way for either a 2D or a 3D NFT collection. Visit now!"
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/nftservice'} key="ogurl" />
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
                        'Want to design your custom NFT collection but do not know where to start? LooBr creative team will help you every step of the way for either a 2D or a 3D NFT collection. Visit now!'
                    }
                    key={'twitterDescription'}
                />
                <meta name="twitter:image" content={'/loobr-landing-view.png'} key={'twitterImage'} />

                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://loobr.com/nftservice" />
                <meta
                    name="keywords"
                    content="create NFT digital art,Create Your Own NFT Collection,custom made NFT generator,custom NFT generator,Free NFT generator online,How to design an NFT collection,How to sell NFT,how to sell nft on LooBr,How to Sell NFTs for Free,how to trade nfts,NFT art design services,NFT Art Generator,NFT design online,NFT design services,NFT Generator free,NFT Marketing Services,NFT Marketplace Fees,online NFT Maker,Random NFT generator,sell nft marketplace,sell nft online,sell your first NFT,where to sell nft,"></meta>
            </Head>
            <NftServiceModule />
        </div>
    );
};

export default NftService;
