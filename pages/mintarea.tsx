import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import GenralHead from '../src/components/head/GenralHead';
import TwitterHead from '../src/components/head/TwitterHead';
import MysteryCard from '../src/components/maincard/mystrycard';
import tokens from '../src/contractsData/tokens';
import mrtokens from '../src/contractsData/MRLAND';
import NFTAbis from '../src/contractsData/Mystery.json';
import axios from 'axios';
const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

const MystryBox = () => {
    const [supply, setSupply] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios.get(`${BACKEND_URL}/getSupply`).then((res) => {
            setSupply(res.data);
            setLoading(false);
        });
    }, []);
    return (
        <div className="container !min-h-0 pt-6 pb-28">
            <Head>
                <title>LooBr | Mint Area</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                    key={'description'}
                />

                {/* genral */}
                <meta property="og:url" content={'https://loobr.com/mintarea'} key="ogurl" />
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
                <meta property="og:image" content="/meta-mystery.png" key={'image'} />
                <meta
                    name="description"
                    content={
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/mintarea'} key="ogurl" />
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
                <meta name="twitter:image" content={'/meta-mystery.png'} key={'twitterImage'} />

                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <h2 className=" text-white mt-5 ">MetaRuffy Landsale</h2>
                <h6 className=" sm:text-xl font-Proxima-SemiBold mt-4 text-[#B8B8BC]">
                    We will use 50% of collected ETH to buyback & burn our own utility token $MR.
                </h6>
            </div>
            <div className="container grid 2xl:grid-cols-4 xl:grid-cols-4 sm:grid-cols-4 my-10  lg:grid-cols-4 gap-7 lg:gap-10">
                {mrtokens.map((item: any, i) => (
                    <MysteryCard
                        listing={null}
                        contractInfo={supply ? supply[item['network']] : null}
                        where={'nft'}
                        nft={item}
                        ABI={NFTAbis[i]}
                        key={i}
                    />
                ))}{' '}
            </div>
            <div className="container">
                <h2 className=" text-white mt-5 ">MetaRuffy Collections</h2>
                <h6 className=" sm:text-xl font-Proxima-SemiBold mt-4 text-[#B8B8BC]">
                    We will use 50% of collected ETH to buyback & burn our own utility token $MR.
                </h6>
            </div>
            <div className=" container grid 2xl:grid-cols-3 xl:grid-cols-3 sm:grid-cols-2 my-10  lg:grid-cols-3 gap-7 lg:gap-10">
                {tokens.map(
                    (item, i) =>
                        i !== 1 && (
                            <MysteryCard
                                listing={null}
                                contractInfo={{ price: 0.2, supply: 0 }}
                                where={'nft'}
                                nft={item}
                                key={i}
                            />
                        )
                )}{' '}
            </div>
        </div>
    );
};

export default MystryBox;
