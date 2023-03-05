import React from 'react';
import Head from 'next/head';

import CollectionModule from '../../src/modules/CollectionModules/CollectionModule';

import { useDispatch, useSelector } from 'react-redux';

type Props = {
    collection: any;
};

const Collections = (props: Props) => {
    const collection = props?.collection;

    return (
        <div>
            <Head>
                <title>LooBr | Collection Detail</title>
                <link rel="icon" href="/favicon.ico" />
                {/* <!-- Primary Meta Tags --> */}
                <meta name="title" content={collection?.name} />
                <meta
                    name="description"
                    content={
                        collection?.headline ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://loobr.com/collections/${collection?._id}`} />
                <meta property="og:title" content={collection?.name} />
                <meta
                    property="og:description"
                    content={
                        collection?.headline ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                />
                <meta
                    property="og:image"
                    content={collection?.ogImage || 'https://loobr.com/assets/images/collectionimages/logo-image.jpg'}
                />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`https://loobr.com/collections/${collection?._id}`} />
                <meta property="twitter:title" content={collection?.name} />
                <meta
                    property="twitter:description"
                    content={
                        collection?.headline ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    }
                />
                <meta
                    property="twitter:image"
                    content={
                        collection?.ogImage || 'https://loobr.com/assets/images/collectionimages/logo-image.jpg'
                    }></meta>
            </Head>
            <CollectionModule collection={collection} />
        </div>
    );
};

export async function getServerSideProps(context: any) {
    try {
        const id = context.params.id;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${id}`, {
            credentials: 'same-origin',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });

        const data = await res.json();

        // Pass data to the page via props
        return { props: { collection: data?.data } };
    } catch (error) {}
    // Rest of `getServerSideProps` code
}

export default Collections;
