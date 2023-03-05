import type { NextPage } from 'next';
import Head from 'next/head';
import NftDetailModule from '../../src/modules/NftDetailModule/NftDetailModule';
import { useDispatch, useSelector } from 'react-redux';
const NftDetail = (props: any) => {
    const user = useSelector((state: any) => state.auth.user);
    const { nft } = props;
    return (
        <div>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>LooBr | NftDetail</title>
                {/* <title>{nft?.name}</title> */}
                <meta name="title" content={nft?.name} />
                <meta
                    name="description"
                    content={`${
                        `${nft?.description}` ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    } Creator=${nft?.creater}, Owner=${nft?.owner} , Likes=${nft?.like?.length}, Comments=${
                        nft?.comments?.length
                    }`}
                />

                {/* <meta name="keywords" content="keyword" /> */}
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="English" />
                <meta name="author" content="Loobr" />

                {/* <!-- Facebook Meta Tags --/> */}
                <meta
                    property="og:url"
                    content={`${process.env.NEXT_PUBLIC_URL}/nft/${nft?.tokenId}?contract=${nft?.contractAddress}&chain=${nft?.chain}`}
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={nft?.name} />
                <meta
                    property="og:description"
                    content={`${
                        `${nft?.description}` ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    } Creator=${nft?.creater}, Owner=${nft?.owner} , Likes=${nft?.like?.length}, Comments=${
                        nft?.comments?.length
                    }`}
                />

                <meta property="og:image" content={nft?.image} />

                {/* <!-- Twitter Meta Tags --/> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content={process.env.NEXT_PUBLIC_URL} />
                <meta
                    property="twitter:url"
                    content={`${process.env.NEXT_PUBLIC_URL}/nft/${nft?.tokenId}?contract=${nft?.contractAddress}&chain=${nft?.chain}`}
                />
                <meta name="twitter:title" content={nft?.name} />
                <meta
                    name="twitter:description"
                    content={`${
                        `${nft?.description}` ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    } Creator=${nft?.creater}, Owner=${nft?.owner} , Likes=${nft?.like?.length}, Comments=${
                        nft?.comments?.length
                    }`}
                />

                <meta name="twitter:image" content={nft?.image} />

                {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}

                {/* <link rel="icon" href="/favicon.ico" /> */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org/',
                            '@type': 'Product',
                            name: nft?.name,
                            image: [nft?.image],
                            description: `${
                                `${nft?.description}` ||
                                'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                            } Creator=${nft?.creater}, Owner=${nft?.owner} , Likes=${nft?.like?.length}, Comments=${
                                nft?.comments?.length
                            }`
                        })
                    }}
                />
            </Head>
            <NftDetailModule data={props} />
            {/* {user && user.userId && <DirectChat />} */}
        </div>
    );
};

export async function getServerSideProps(context: any) {
    try {
        const listingId = context.params.listingId;
        const tokenId = context.query.tokenId;
        const contract = context.query.contract;
        const chain = context.query.chain;
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/marketplace/nft/${tokenId}?contract=${contract}&chain=${chain}`,
            {
                credentials: 'same-origin',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );

        const data = await res.json();

        // Pass data to the page via props
        return { props: data.data };
    } catch (error) {
        console.log(error);
    }
    // Rest of `getServerSideProps` code
}

export default NftDetail;
