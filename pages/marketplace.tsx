import Head from 'next/head';
import { MarketPlaceModule } from '../src/modules/MarketPlaceModule/MarketPlaceModule';

const Explore = () => {
    return (
        <div>
            <Head>
                <title>Digital NFT Marketplace | NFT Artwork Collection for Sale | LooBr</title>

                <link rel="icon" href="/favicon.ico" />

                {/* genral */}
                <meta property="og:url" content={'https://loobr.com/marketplace'} key="ogurl" />
                <meta
                    property="og:title"
                    content={'LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs'}
                    key={'title'}
                />
                <meta
                    name="og:description"
                    content={
                        'LooBr is a digital NFT marketplace with trending, cute NFTs Collectibles, or 2D and 3D artwork collections online. Visit us today and choose your favorite NFT collection.'
                    }
                    key={'OGdescription'}
                />
                <meta property="og:image" content="/meta-marketplace.png" key={'image'} />
                <meta
                    name="description"
                    content={
                        'LooBr is a digital NFT marketplace with trending, cute NFTs Collectibles, or 2D and 3D artwork collections online. Visit us today and choose your favorite NFT collection.'
                    }
                    key={'description'}
                />
                {/* twitter */}
                <meta name="twitter:card" content={'summary_large_image'} key={'twitterCard'} />
                <meta property="og:url" content={'https://loobr.com/marketplace'} key="ogurl" />
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
                        'LooBr is a digital NFT marketplace with trending, cute NFTs Collectibles, or 2D and 3D artwork collections online. Visit us today and choose your favorite NFT collection.'
                    }
                    key={'twitterDescription'}
                />
                <meta name="twitter:image" content={'/meta-marketplace.png'} key={'twitterImage'} />

                <link rel="canonical" href="https://loobr.com/marketplace" />
                <meta
                    name="keywords"
                    content="2D Artwork NFT Collection,2D NFT art collection,3D Artwork NFT Collection,3D NFT art collection,3d nft collection Services To Buy Online,3d nfts for sale,art Nft marketplace,bored cat nft,Buy Trending NFT Collectibles,digital nft marketplace,free nft marketplace,Integrated NFT Marketplace,marketplace for nfts,Nft art marketplace USA,NFT collection art,NFT Collection dashboard,nft collection Services,NFT Crypto Pencil,nft marketplace for sale,NFT Marketplace In USA,Social NFT marketplace,Virtual Land NFT marketplace,"></meta>
            </Head>
            <MarketPlaceModule />
        </div>
    );
};

export default Explore;
