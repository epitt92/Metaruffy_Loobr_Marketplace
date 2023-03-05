import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HomeModule } from '../src/modules/HomeModule/HomeModule';
import { verfyEmailAddress } from '../src/redux/auth/actions';
import { NextSeo } from 'next-seo';

const Home: NextPage = () => {
    const router = useRouter();
    const { userId, token, referral } = router.query;
    useEffect(() => {
        if (referral) {
            localStorage.setItem('refferal', JSON.stringify(referral));
        }
    }, [router.query]);
    const dispatch = useDispatch();

    useEffect(() => {
        userId && token && dispatch(verfyEmailAddress(userId, token));
    }, [userId]);

    return (
        <>
            <NextSeo
                title="NFT Collection Auction Trading and Promotion Platform | LooBr"
                description="LooBr is an online NFT collection, auction, trading, and promotion platform where you can design, buy and sell digital art. Use our interactive social features and release your limitless imagination."
                openGraph={{
                    url: 'https://loobr.com',
                    title: 'NFT Collection Auction Trading and Promotion Platform | LooBr',
                    description:
                        'LooBr is an online NFT collection, auction, trading, and promotion platform where you can design, buy and sell digital art. Use our interactive social features and release your limitless imagination.',
                    images: [
                        {
                            url: 'https://loobr.com/loobr-landing-view.png',
                            width: 800,
                            height: 600,
                            alt: 'Landing page',
                            type: 'image/jpeg'
                        }
                    ],
                    siteName: 'loobr_com'
                }}
                twitter={{
                    handle: '@loobr_com',
                    site: '@loobr_com',
                    cardType: 'summary_large_image'
                }}
            />
            <Head>
                <title>NFT Collection Auction Trading and Promotion Platform | LooBr</title>
                <meta property="og:title" content="LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs" />
                <meta
                    name="og:description"
                    content="LooBr is an online NFT collection, auction, trading, and promotion platform where you can design, buy and sell digital art. Use our interactive social features and release your limitless imagination.."
                />
                <meta property="og:image" content="https://loobr.com/loobr-landing-view.png" />
                <meta name="author" content="LooBr"></meta>
                <meta
                    name="description"
                    content="LooBr is an online NFT collection, auction, trading, and promotion platform where you can design, buy and sell digital art. Use our interactive social features and release your limitless imagination."
                />

                {/* twitter */}
                <meta property="twitter:card" content={'summary_large_image'} />
                <meta property="twitter:url" content="https://loobr.com/"></meta>
                <meta property="twitter:site" content={'@loobr_com'} />
                <meta property="twitter:creator" content="@loobr_com" />
                <meta
                    property="twitter:title"
                    content={'LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs'}
                />
                <meta
                    property="twitter:description"
                    content={
                        'LooBr is an online NFT collection, auction, trading, and promotion platform where you can design, buy and sell digital art. Use our interactive social features and release your limitless imagination.'
                    }
                />
                <meta property="twitter:image" content={'https://loobr.com/loobr-landing-view.png'} />
                <link rel="canonical" href="https://loobr.com" />
                <meta
                    name="keywords"
                    content="Cross-Chain Marketplace for Traders, Crypto NFT Platform, How to Buy NFT, How to Buy NFT In USA, Live NFT Auctions, NFT Collection Website, NFT Marketplace Website, NFT Promotion Services, NFT Trading Platform, Sell NFT For Auction"></meta>
            </Head>
            <HomeModule />
        </>
    );
};

export default Home;
