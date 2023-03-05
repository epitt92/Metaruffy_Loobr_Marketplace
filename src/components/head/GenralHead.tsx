import React from 'react'

export default function GenralHead({ title, description, image = '/loobr-landing-view.png', url = 'https://loobr.com/' }: any) {
    return (
        <>
            {/* {title && <title>{title || "LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs"}</title>} */}
            <meta property="og:url" content={url} key="ogurl" />
            <meta property="og:title" content={title || "LooBr - #1Social NFT Marketplace buy, sell, like, comment NFTs."} key={'title'} />
            <meta name="og:description" content={description || "LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs."} key={'OGdescription'} />
            <meta property="og:image" content={image || '/loobr-landing-view.png'} key={'image'} />
            <meta name="description" content={description || "LooBr is a web3 crosschain socialnetwork NFT marketplace. Create, trade, connect, with LooBr and buy or sell ingame assets NFTs like and comment NFTs."} key={'description'} />
        </>
    )
}
