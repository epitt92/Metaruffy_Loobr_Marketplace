import { daoAbi } from './abis';

type contract = {
    nftAddress: string;
    marketAddress: string;
    tokenAddress: string;
    offerAddress: string;
    wethAddress: string;
    sellCurrency: string;
    sellSymbol: string;
    native: boolean;
    tokenSymbol: string;
    nativeCurrency: string;
    tokenPath: string;
    nativePath: string;
    chainId: number;
    chainName: string;
    chain: string;
    blockExplorer: string;
    daoAddress: string;
    daoAbi?: any;
};
let contracts: contract[];
if (process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET') {
    contracts = [
        {
            nftAddress: '0x1b85983E57705e561055d4e2090bC14d29477D8A',
            marketAddress: '0x59F27168FC49D0ecc835c9F92fB47F6763fbC630',
            tokenAddress: '0x92cC5Beb263A6c26EA559B2461a9046EE5f77979',
            offerAddress: '',
            sellCurrency: 'ETH',
            sellSymbol: '/assets/images/logos/eth.png',
            native: true,
            tokenSymbol: 'USDT',
            nativeCurrency: 'ETH',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/eth.png',
            chainId: 3,
            chainName: 'ethereum',
            chain: 'ETH',
            blockExplorer: 'https://ropsten.etherscan.io',
            daoAddress: '0x92cC5Beb263A6c26EA559B2461a9046EE5f77979',
            daoAbi: daoAbi
        },
        {
            nftAddress: '0x1b85983E57705e561055d4e2090bC14d29477D8A',
            marketAddress: '0x31Ea69f029dC10F183d8594dB9c6C37dA20918Fb',
            tokenAddress: '0x92cC5Beb263A6c26EA559B2461a9046EE5f77979',
            offerAddress: '',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'ETH',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/eth.png',
            chainId: 3,
            chainName: 'ethereum',
            chain: 'ETH',
            blockExplorer: 'https://ropsten.etherscan.io'
        },
        {
            nftAddress: '0x1b85983E57705e561055d4e2090bC14d29477D8A',
            marketAddress: '0x31Ea69f029dC10F183d8594dB9c6C37dA20918Fb',
            tokenAddress: '0x92cC5Beb263A6c26EA559B2461a9046EE5f77979',
            offerAddress: '',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'ETH',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/eth.png',
            chainId: 5,
            chainName: 'ethereum',
            chain: 'ETH',
            blockExplorer: 'https://ropsten.etherscan.io'
        },
        {
            nftAddress: '0xADcEE6d895064ab6F542C2703BB54aec12c5704f',
            marketAddress: '0xfc4461078eE96C8345C49CfeA268D23e1718D813',
            tokenAddress: '0xFA547dA3605cEba8F5CDCd4527f04aDb0dae026F',
            offerAddress: '0x3C87297B1EA2dB38351170aaB4f07590C866E2D2',
            sellCurrency: 'BNB',
            sellSymbol: '/assets/images/logos/bnb.png',
            native: true,
            tokenSymbol: 'LOOBR',
            nativeCurrency: 'BNB',
            tokenPath: '/assets/images/logos/loobr.png',
            nativePath: '/assets/images/logos/bnb.png',
            chainId: 97,
            chainName: 'bsc',
            chain: 'BSC',
            blockExplorer: 'https://testnet.bscscan.com',
            daoAddress: '0x92cC5Beb263A6c26EA559B2461a9046EE5f77979',
            daoAbi: daoAbi
        },
        {
            nftAddress: '0xADcEE6d895064ab6F542C2703BB54aec12c5704f',
            marketAddress: '0x6Feda9B3470703AA4677b91EC932fb1C4a5acD70',
            tokenAddress: '0xA4d542480e4FF07c7031C029A6A0B5FC04E696aB',
            offerAddress: '0x3C87297B1EA2dB38351170aaB4f07590C866E2D2',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'BNB',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/bnb.png',
            chainId: 97,
            chainName: 'bsc',
            chain: 'BSC',
            blockExplorer: 'https://testnet.bscscan.com'
        },
        {
            nftAddress: '0x0A515FDe396B3114f722029D9e2CC56d48940CA8',
            marketAddress: '0x8522E2AAb10b2dF09c9522be00Bad3c64a4C7154',
            tokenAddress: '0x9edfe12943178c98711ee92f6aF34FE64FAD60a1',
            offerAddress: '0xB4D6635140C4a46015C49275bc70Fe139C0479e2',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'MATIC',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/blockchainlogos/polygon.svg',
            chainId: 80001,
            chainName: 'polygon',
            chain: 'MATIC',
            blockExplorer: 'https://mumbai.polygonscan.com'
        },
        {
            nftAddress: '0x0A515FDe396B3114f722029D9e2CC56d48940CA8',
            marketAddress: '0x8522E2AAb10b2dF09c9522be00Bad3c64a4C7154',
            tokenAddress: '0x9edfe12943178c98711ee92f6aF34FE64FAD60a1',
            offerAddress: '0xB4D6635140C4a46015C49275bc70Fe139C0479e2',
            daoAddress: '',
            sellCurrency: 'MATIC',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: true,
            tokenSymbol: 'USDT',
            nativeCurrency: 'MATIC',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/blockchainlogos/polygon.svg',
            chainId: 80001,
            chainName: 'polygon',
            chain: 'MATIC',
            blockExplorer: 'https://mumbai.polygonscan.com'
        },
        {
            nftAddress: '0x35F6F6364BF820393D6b12a24BC06258C21B2536',
            marketAddress: '0x71003D0443a5c939478B417794067310Cb51630c',
            tokenAddress: '0x71003D0443a5c939478B417794067310Cb51630c',
            offerAddress: '0x69e5B1cA576B3c599be6B6BED3FB35Cc61c42c65',
            wethAddress: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
            daoAddress: '',
            sellCurrency: 'AVAX',
            sellSymbol: '/assets/images/blockchainlogos/avalanche.svg',
            native: true,
            tokenSymbol: 'AVAX',
            nativeCurrency: 'AVAX',
            tokenPath: '/assets/images/blockchainlogos/avalanche.svg',
            nativePath: '/assets/images/blockchainlogos/avalanche.svg',
            chainId: 43113,
            chainName: 'avalanche',
            chain: 'AVAX',
            blockExplorer: 'https://testnet.snowtrace.io'
        }
    ];
} else {
    contracts = [
        {
            nftAddress: '0xde1DF189259Dd9Ea1686ed939bdfC03A97621423',
            marketAddress: '0x7c51DD0fe21E3b6800522c2E5c660D872402Bc19',
            tokenAddress: '0x92cC5Beb263A6c26EA559B2461a9046EE5f77979',
            offerAddress: '0x10e81558f39Ae9A2329A68B2c68083d1a348816E',
            wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            daoAddress: '',
            sellCurrency: 'ETH',
            sellSymbol: '/assets/images/logos/eth.png',
            native: true,
            tokenSymbol: 'USDT',
            nativeCurrency: 'ETH',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/eth.png',
            chainId: 1,
            chainName: 'ethereum',
            chain: 'ETH',
            blockExplorer: 'https://etherscan.io'
        },
        {
            nftAddress: '0xde1DF189259Dd9Ea1686ed939bdfC03A97621423',
            marketAddress: '0x389DEf2A2c0792dBd54fcdB4004e6CBfBdb7FabB',
            tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            offerAddress: '0x10e81558f39Ae9A2329A68B2c68083d1a348816E',
            wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'ETH',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/eth.png',
            chainId: 1,
            chainName: 'ethereum',
            chain: 'ETH',
            blockExplorer: 'https://etherscan.io'
        },
        {
            nftAddress: '0xde1DF189259Dd9Ea1686ed939bdfC03A97621423',
            marketAddress: '0x389DEf2A2c0792dBd54fcdB4004e6CBfBdb7FabB',
            tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            offerAddress: '0x10e81558f39Ae9A2329A68B2c68083d1a348816E',
            wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'ETH',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/eth.png',
            chainId: 5,
            chainName: 'ethereum',
            chain: 'ETH',
            blockExplorer: 'https://etherscan.io'
        },
        {
            nftAddress: '0x35F6F6364BF820393D6b12a24BC06258C21B2536',
            marketAddress: '0x3803EE8fe4B0E096B73CA40796a79b88113C80c4',
            tokenAddress: '0x2d537cc7a9aA092ca3dD1Ee542c0B73560cB14f0',
            offerAddress: '0xCAc0508702410b9fA7E054c3f37840b69676c215',
            wethAddress: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            daoAddress: '0xbe827C16EA99710d3B193A79E7C17360A90DBE05',
            sellCurrency: 'BNB',
            sellSymbol: '/assets/images/logos/bnb.png',
            native: true,
            tokenSymbol: 'LOOBR',
            nativeCurrency: 'BNB',
            tokenPath: '/assets/images/logos/loobr.png',
            nativePath: '/assets/images/logos/bnb.png',
            chainId: 56,
            chainName: 'bsc',
            chain: 'BSC',
            blockExplorer: 'https://bscscan.com'
        },
        // {
        //     nftAddress: '0x35F6F6364BF820393D6b12a24BC06258C21B2536',
        //     marketAddress: '0x9F4717E0D8eE53774579905d77843A6cA556Ca71',
        //     tokenAddress: '0x2d537cc7a9aA092ca3dD1Ee542c0B73560cB14f0',
        //     sellCurrency: 'LOOBR',
        //     sellSymbol: '/assets/images/logos/loobr.png',
        //     native: false,
        //     tokenSymbol: 'LOOBR',
        //     nativeCurrency: 'BNB',
        //     tokenPath: '/assets/images/logos/loobr.png',
        //     nativePath: '/assets/images/logos/bnb.png',
        //     chainId: 56,
        //     blockExplorer: 'https://bscscan.com',
        // }
        {
            nftAddress: '0x35F6F6364BF820393D6b12a24BC06258C21B2536',
            marketAddress: '0x71003D0443a5c939478B417794067310Cb51630c',
            tokenAddress: '0x55d398326f99059fF775485246999027B3197955',
            offerAddress: '0xbe827C16EA99710d3B193A79E7C17360A90DBE05',
            wethAddress: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'BNB',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/logos/bnb.png',
            chainId: 56,
            chainName: 'bsc',
            chain: 'BSC',
            blockExplorer: 'https://bscscan.com'
        },
        {
            nftAddress: '0xde1DF189259Dd9Ea1686ed939bdfC03A97621423',
            marketAddress: '0x7c51DD0fe21E3b6800522c2E5c660D872402Bc19',
            tokenAddress: '0x7c51DD0fe21E3b6800522c2E5c660D872402Bc19',
            offerAddress: '0x69e5B1cA576B3c599be6B6BED3FB35Cc61c42c65',
            wethAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            daoAddress: '',
            sellCurrency: 'MATIC',
            sellSymbol: '/assets/images/blockchainlogos/polygon.svg',
            native: true,
            tokenSymbol: 'MATIC',
            nativeCurrency: 'MATIC',
            tokenPath: '/assets/images/blockchainlogos/polygon.svg',
            nativePath: '/assets/images/blockchainlogos/polygon.svg',
            chainId: 137,
            chainName: 'matic',
            chain: 'MATIC',
            blockExplorer: 'https://polygonscan.com'
        },
        {
            nftAddress: '0xde1DF189259Dd9Ea1686ed939bdfC03A97621423',
            marketAddress: '0xa94c3453001A0CE7C9d38323556d9D243C41a28E',
            tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
            offerAddress: '0x69e5B1cA576B3c599be6B6BED3FB35Cc61c42c65',
            wethAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'MATIC',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/blockchainlogos/polygon.svg',
            chainId: 137,
            chainName: 'matic',
            chain: 'MATIC',
            blockExplorer: 'https://polygonscan.com'
        },
        {
            nftAddress: '0x35F6F6364BF820393D6b12a24BC06258C21B2536',
            marketAddress: '0x71003D0443a5c939478B417794067310Cb51630c',
            tokenAddress: '0x71003D0443a5c939478B417794067310Cb51630c',
            offerAddress: '0x69e5B1cA576B3c599be6B6BED3FB35Cc61c42c65',
            wethAddress: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
            daoAddress: '',
            sellCurrency: 'AVAX',
            sellSymbol: '/assets/images/blockchainlogos/avalanche.svg',
            native: true,
            tokenSymbol: 'AVAX',
            nativeCurrency: 'AVAX',
            tokenPath: '/assets/images/blockchainlogos/avalanche.svg',
            nativePath: '/assets/images/blockchainlogos/avalanche.svg',
            chainId: 43114,
            chainName: 'avalanche',
            chain: 'AVAX',
            blockExplorer: 'https://snowtrace.io'
        },
        {
            nftAddress: '0xde1DF189259Dd9Ea1686ed939bdfC03A97621423',
            marketAddress: '0xa94c3453001A0CE7C9d38323556d9D243C41a28E',
            tokenAddress: '0xc7198437980c041c805a1edcba50c1ce5db95118',
            offerAddress: '0x69e5B1cA576B3c599be6B6BED3FB35Cc61c42c65',
            wethAddress: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
            daoAddress: '',
            sellCurrency: 'USDT',
            sellSymbol: '/assets/images/logos/usdt.png',
            native: false,
            tokenSymbol: 'USDT',
            nativeCurrency: 'AVAX',
            tokenPath: '/assets/images/logos/usdt.png',
            nativePath: '/assets/images/blockchainlogos/avalanche.svg',
            chainId: 43114,
            chainName: 'avalanche',
            chain: 'AVAX',
            blockExplorer: 'https://snowtrace.io'
        }
    ];
}

export default contracts;
