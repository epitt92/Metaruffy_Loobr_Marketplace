import React, { useEffect, useMemo, useRef, useState } from 'react';

import Head from 'next/head';
import axios from 'axios';
import router, { useRouter } from 'next/router';

import SingleFeed from '../../src/modules/singlefeed/feed';

const Feed = (props: any) => {
    const feed = props?.feed;

    return (
        <div>
            <Head>
                <title>LooBr | Feed Detail</title>
                <link rel="icon" href="/favicon.ico" />
                {/* <!-- Primary Meta Tags --> */}
                <meta name="title" content={feed?.text} />
                <meta
                    name="description"
                    content={
                        feed?.text ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://loobr.com/feed/${feed?._id}`} />
                {/* <meta property="og:title" content={collection?.name} /> */}
                <meta
                    property="og:description"
                    content={
                        feed?.text ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                />
                <meta
                    property="og:image"
                    content={feed?.image || 'https://loobr.com/assets/images/collectionimages/logo-image.jpg'}
                />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`https://loobr.com/feed/${feed?._id}`} />
                {/* <meta property="twitter:title" content={collection?.name} /> */}
                <meta
                    property="twitter:description"
                    content={
                        feed?.text ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                />
                <meta
                    property="twitter:image"
                    content={feed?.image || 'https://loobr.com/assets/images/collectionimages/logo-image.jpg'}></meta>
            </Head>
            <SingleFeed feedpost={feed} />
        </div>
    );
};
export async function getServerSideProps(context: any) {
    try {
        const id = context.params.id;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed/getfeed?id=${id}`, {
            credentials: 'same-origin',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });

        const data = await res.json();

        // Pass data to the page via props
        return { props: { feed: data?.data } };
    } catch (error) {
        console.log(error);
    }
    // Rest of `getServerSideProps` code
}

export default Feed;
