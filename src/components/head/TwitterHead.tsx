import React from 'react'

export default function TwitterHead({ card, site, title, description, image, url }: any) {
    return (
        <>          {/* twitter tags */}
            <meta name="twitter:card" content={card || "summary_large_image"} key={'twitterCard'} />
            <meta property="og:url" content={url || 'https://loobr.com/'} key="ogurl" />
            <meta name="twitter:site" content={site || '@loobr_com'} key={'twitterSite'} />
            <meta name="twitter:creator" content="@loobr_com" key={'twitterCreater'} />
            <meta name="twitter:title" content={title || "LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs."} key={'twitterTitle'} />
            <meta name="twitter:description" content={description || "LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs."} key={'twitterDescription'} />
            <meta name="twitter:image" content={image || '/loobr-landing-view.png'} key={'twitterImage'} />
        </>
    )
}
