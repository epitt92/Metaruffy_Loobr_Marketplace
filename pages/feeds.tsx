import Head from 'next/head';
import SocialfeedModule from '../src/modules/SocialfeedModule/SocialfeedModule';

const socialfeedpage = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Social feeds</title>
                <link rel="icon" href="/favicon.ico" />
                {/* genral */}
                <meta property="og:image" content={'https://loobr.com/meta-feed.png'} key={'image'} />
                <meta property="og:url" content={'https://loobr.com/feeds'} key="ogurl" />
                <meta property="og:title" content="LooBr | Social feeds" />
                <meta
                    name="og:description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'OGdescription'}
                />
                <meta
                    name="description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/feeds'} key="ogurl" />
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
                <meta name="twitter:image" content={'https://loobr.com/meta-feed.png'} key={'twitterImage'} />

                <link rel="canonical" href="https://loobr.com/feeds" />
            </Head>
            <SocialfeedModule tag="" allowPost={true} />
        </div>
    );
};

export default socialfeedpage;
