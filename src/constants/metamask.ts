export const networks = {
    97: {
        chainId: '0x61',
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        chainName: 'Smart Chain - Testnet',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        blockExplorerUrls: ['https://testnet.bscscan.com']
    },
    56: {
        chainId: '0x38',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        chainName: 'Smart Chain',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        blockExplorerUrls: ['https://bscscan.com']
    },
    1: {
        chainId: '0x1',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        chainName: process.env.NEXT_ETH_NETWORK_NAME,
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: ['https://etherscan.io']
    },
    5: {
        chainId: '0x1',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        chainName: process.env.NEXT_ETH_NETWORK_NAME,
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrls: ['https://etherscan.io']
    },
    3: {
        chainId: '0x3',
        rpcUrls: ['https://ropsten.infura.io/v3/'],
        chainName: 'Ropsten Test Network',
        nativeCurrency: {
            name: 'RopstenETH',
            symbol: 'RopstenETH',
            decimals: 18
        },
        blockExplorerUrls: ['https://ropsten.etherscan.io']
    },
    137: {
        chainId: '0x89',
        rpcUrls: ['https://polygon-rpc.com/'],
        chainName: 'Polygon',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        blockExplorerUrls: ['https://polygonscan.com/']
    },
    80001: {
        chainId: '0x13881',
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com/'],
        chainName: 'Mumbai Testnet',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    },
    43114: {
        chainId: '0xa86a',
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc/'],
        chainName: 'Avalanche Network',
        nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
        },
        blockExplorerUrls: ['https://snowtrace.io/']
    },
    43113: {
        chainId: '0xA869',
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc/'],
        chainName: 'Avalanche Fuji Testnet',
        nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX',
            decimals: 18
        },
        blockExplorerUrls: ['https://testnet.snowtrace.io/']
    }
    // TODO:Other newtorks will be places here
};

export const testnestChains = [3, 5, 97, 80001, 43113];
export const mainnetChains = [56, 1, 5, 137, 43114];
