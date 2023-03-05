import Web3 from 'web3';
import ContractData from '../contractsData/contracts-details';

export const weiToEth = (n: any) => {
    return Web3.utils.fromWei(n, 'ether');
};

export const isJsonString = (str: any) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const toHex = (num: number) => {
    const val = Number(num);
    return '0x' + val.toString(16);
};

export const getMarketDetailsByAddress = (marketAddress?: string) => {
    if (!marketAddress) {
        return null;
    }

    const chain = ContractData.find((item: any) => item.marketAddress == marketAddress);
    return chain;
};

export const getMarketDetailsByAddressAndCurrency = (marketAddress: string, currency: string) => {
    if (!marketAddress || !currency) {
        return null;
    }

    const chain = ContractData.find(
        (item: any) => item.marketAddress == marketAddress && item.sellCurrency == currency
    );
    return chain;
};

export const getMarketDetailsByChain = (chainName?: string) => {
    if (!chainName) {
        return null;
    }

    const chain = ContractData.find((item: any) => item.nativeCurrency == chainName);
    return chain;
};

export const getMarketDetailsByChainId = (chainId?: number | any) => {
    if (!chainId) {
        return null;
    }

    const chain = ContractData.find((item) => item.chainId == chainId);
    return chain;
};

export const getAllMarketDetailsByChainId = (chainId?: number) => {
    if (!chainId) {
        return null;
    }

    const chain = ContractData.filter((item: any) => item.chainId == chainId);
    return chain;
};

export const getMarketDetailsByNFTAddress = (nftAddress?: string) => {
    if (!nftAddress) {
        return null;
    }

    const chain = ContractData.find((item) => item.nftAddress == nftAddress);
    return chain;
};

export const getChain = (nftAddress?: string) => {
    if (!nftAddress) {
        return null;
    }

    const chain = ContractData.find((item) => item.nftAddress == nftAddress);
    return chain;
};

export const fetchImage = (url?: string) => {
    try {
        return url?.includes('/assets') || url?.includes('infura')
            ? url
            : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/fetch/` + url;
        // const image = new CloudinaryImage(url).setDeliveryType('fetch');
        // console.log(image, 'CloudinaryImage');
    } catch (error) {
        return '';
        console.log(error);
    }
};

export const isVideoMp4 = (url: string) => {
    const urlArr = url?.split('.');
    return urlArr[urlArr.length - 1] == 'mp4' || urlArr[urlArr.length - 1] == 'MP4';
};

export const NftContentType = (url: string, nft?: any) => {
    if (!url && !nft?.animation_url) {
        return '';
    }

    if (nft?.fileType == 'glb') {
        return 'glb';
    } else if (nft?.fileType == 'gif') {
        return 'gif';
    }
    const urlArr = nft?.animation_url ? nft?.animation_url.split('.') : url?.split('.');

    switch (urlArr[urlArr.length - 1]) {
        case 'mp4':
        case 'MP4':
            return 'mp4';
        case 'glb':
        case 'gltf':
        case 'GLTF':
        case 'GLB':
        case 'glTF':
            return 'glb';
        default:
            return urlArr[urlArr.length - 1] || '';
    }
};

export const tokenName = (name: string, tokenId: string) => {
    if (name.includes(tokenId)) {
        return name;
    } else {
        return name + ' #' + tokenId;
    }
};

export const slicedAddress = (address: string) => {
    if (!address) {
        return '';
    }
    return address?.slice(0, 8) + '...' + address?.slice(address?.length - 4, address?.length);
};

export const toPascalCase = (string: string) => {
    if (!string) {
        return '';
    }
    string = string.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
        return g1.toUpperCase() + g2.toLowerCase();
    });
    return string;
};

export const formatNumber = (value: number, decimals: number) =>
    Number(Number(value).toFixed(decimals)).toLocaleString();
