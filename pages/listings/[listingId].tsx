import Head from 'next/head';
import NftDetailModule from '../../src/modules/NftListingDetailModule/NftDetailModule';

const NftListingDetail = (props: any) => {
    const { listing } = props;

    // const listing = useSelector((state: any) => state.nft.listing);
    return (
        <div>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{listing?.nft?.name}</title>
                <meta
                    name="description"
                    content={`${
                        `${listing?.nft?.description}` ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    } Creator=${listing?.creator?.firstName} ${listing?.creator?.lastName}, Owner=${
                        listing?.owner?.firstName
                    } ${listing?.owner?.lastName}, Likes=${listing?.nft?.like?.length || 0}, Comments=${
                        listing?.nft?.comments?.length || 0
                    }`}
                    // content={`${`${listing?.nft?.description}`|| ``}Creator=${listing?.creator?.firstName} ${listing?.creator?.lastName}, Owner=${listing?.owner?.firstName} ${listing?.owner?.lastName}, Likes=${listing?.nft?.like.length}, Comments=${listing?.nft?.comments.length}`}
                />
                <meta name="title" content={listing?.nft?.name} />

                {/* <meta name="keywords" content="keyword" /> */}
                <meta name="robots" content="index, follow" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="English" />
                <meta name="author" content="Loobr" />

                {/* <!-- Facebook Meta Tags --/> */}
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}/listings/${listing?.listingId}`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={listing?.nft?.name} />
                <meta
                    property="og:description"
                    content={`${
                        `${listing?.nft?.description}` ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    } Creator=${listing?.creator?.firstName} ${listing?.creator?.lastName}, Owner=${
                        listing?.owner?.firstName
                    } ${listing?.owner?.lastName}, Likes=${listing?.nft?.like?.length}, Comments=${
                        listing?.nft?.comments?.length
                    }`}
                />
                {/* <meta
                    property="og:creator"
                    content={`Creator=${listing?.creator?.firstName} ${listing?.creator?.lastName}`}
                />
                <meta property="og:owner" content={`Owner=${listing?.owner?.firstName} ${listing?.owner?.lastName}`} />
                <meta property="og:like" content={`Likes=${listing?.nft?.like.length}`} />
                <meta property="og:comment" content={`Comments=${listing?.nft?.comments.length}`} /> */}
                <meta property="og:image" content={listing?.nft?.image} />

                {/* <!-- Twitter Meta Tags --/> */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content={process.env.NEXT_PUBLIC_URL} />
                <meta
                    property="twitter:url"
                    content={`${process.env.NEXT_PUBLIC_URL}/listings/${listing?.listingId}`}
                />
                <meta name="twitter:title" content={listing?.nft?.name} />
                <meta
                    name="twitter:description"
                    content={`${
                        `${listing?.nft?.description}` ||
                        'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                    } Creator=${listing?.creator?.firstName} ${listing?.creator?.lastName}, Owner=${
                        listing?.owner?.firstName
                    } ${listing?.owner?.lastName}, Likes=${listing?.nft?.like?.length}, Comments=${
                        listing?.nft?.comments?.length
                    }`}
                />

                {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}

                {/* <link rel="icon" href="/favicon.ico" /> */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org/',
                            '@type': 'Product',
                            name: listing?.nft?.name,
                            image: [listing?.nft?.image],
                            description:
                                listing?.nft?.description ||
                                'LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs.'
                        })
                    }}
                />
            </Head>
            <NftDetailModule listing={listing} />
        </div>
    );
};

export async function getServerSideProps(context: any) {
    try {
        const listingId = context.params.listingId;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/marketplace/listings/${listingId}`, {
            credentials: 'same-origin',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });

        const data = await res.json();

        // Pass data to the page via props
        return { props: data };
    } catch (error) {}
    // Rest of `getServerSideProps` code
}

export default NftListingDetail;
