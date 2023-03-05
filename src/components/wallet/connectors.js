import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

export const supportedChainIds = [1, 3, 42, 61, 56, 38, 89, 97, 137, 1337, 43113, 43114, 80001];

export const injected = new InjectedConnector({
    supportedChainIds: supportedChainIds
});

export const walletconnect = new WalletConnectConnector({
    infuraId: undefined,
    supportedChainIds: supportedChainIds,
    rpc: {
        1: `https://api.securerpc.com/v1`,
        // 3: `https://ropsten.infura.io`,
        97: 'https://data-seed-prebsc-2-s3.binance.org:8545',
        56: 'https://bsc-dataseed.binance.org',
        137: 'https://rpc-mainnet.maticvigil.com',
        43114: 'https://api.avax.network/ext/bc/C/rpc',
        43113: 'https://api.avax-test.network/ext/bc/C/rpc',
        80001: 'https://rpc-mainnet.maticvigil.com'
    },
    // rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    // rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    // bridge: "https://bridge.walletconnect.org",
    // rpc: { [chainId]: 'https://bsc-dataseed.binance.org', },
    bridge: 'https://uniswap.bridge.walletconnect.org',
    // chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID_DECIMAL),
    qrcode: true,
    pollingInterval: 15000
});

export const walletlink = new WalletLinkConnector({
    // url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
    url: `${process.env.NEXT_PUBLIC_RPC_URL}`,
    appName: 'Loobr'
});

export const connectors = {
    injected: injected,
    walletConnect: walletconnect,
    coinbaseWallet: walletlink
};
