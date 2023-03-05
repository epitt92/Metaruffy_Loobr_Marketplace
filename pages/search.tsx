import type { NextPage } from 'next';
import Head from 'next/head';
import SocialfeedModule from '../src/modules/SocialfeedModule/SocialfeedModule';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SearchPage = () => {
    const [value, setValue] = useState<string>('');
    const router: any = useRouter();

    useEffect(() => {
        if (router.asPath) {
            const myArray = router.asPath.split('=');
            setValue(myArray[1]);
        }
    }, [router]);

    return (
        <div className="min-h-screen">
            <Head>
                <title>LooBr | Search</title>

                {/* genral */}
                <meta property="og:url" content={'https://loobr.com/search'} key="ogurl" />
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
                <meta property="og:image" content="/loobr-landing-view.png" key={'image'} />
                <meta
                    name="description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/search'} key="ogurl" />
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
                <meta name="twitter:image" content={'/loobr-landing-view.png'} key={'twitterImage'} />

                <link rel="icon" href="/favicon.ico" />
            </Head>
            {value && <SocialfeedModule tag={value} allowPost={false} />}
        </div>
    );
};

export default SearchPage;
