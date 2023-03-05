import BscIcon from '../components/icons/BscIcon';
import EthIcon from '../components/icons/EthIcon';
import Avalanche from '../components/icons/AvalancheIcon';
import PolygonIcon from '../components/icons/PolygonIcon';
import SolanaIcon from '../components/icons/SolanaIcon';
import CardanoIcon from '../components/icons/CardanoIcon';
import { ReactElement } from 'react';
import BscIconDisable from '../components/icons/BscIconDisable';
import EthIconDisable from '../components/icons/EthIconDisable';
import AvalancheDisable from '../components/icons/AvalancheIconDisable';
import PolygonIconDisable from '../components/icons/PolygonIconDisable';
import SolanaIconDisable from '../components/icons/SolanaIconDisable';
import CardanoIconDisable from '../components/icons/CardanoIconDisable';

type Chain = {
    name: string;
    symbol: string;
    chainId: number;
    tagname: ReactElement;
    disabled: ReactElement;
    value: string;
};
let blockchains: Chain[];

if (process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET') {
    blockchains = [
        {
            name: 'Ropsten Test Network',
            symbol: 'ETH',
            chainId: 3,
            tagname: <EthIcon />,
            disabled: <EthIconDisable />,
            value: 'ethereum'
        },
        {
            name: 'BSC Testnet',
            symbol: 'BNB',
            chainId: 97,
            tagname: <BscIcon />,
            disabled: <BscIconDisable />,
            value: 'bsc'
        },
        {
            name: 'Avalanche',
            symbol: 'AVAX',
            chainId: 43113,
            tagname: <Avalanche />,
            disabled: <AvalancheDisable />,
            value: 'avalanche'
        },
        {
            name: 'Polygon',
            symbol: 'MATIC',
            chainId: 80001,
            tagname: <PolygonIcon />,
            disabled: <PolygonIconDisable />,
            value: 'matic'
        },

        {
            name: 'Solana',
            symbol: 'SOL',
            chainId: 43114,
            tagname: <SolanaIcon />,
            disabled: <SolanaIconDisable />,
            value: 'solana'
        },
        {
            name: 'Cardano',
            symbol: 'CARDANO',
            chainId: 43114,
            tagname: <CardanoIcon />,
            disabled: <CardanoIconDisable />,
            value: 'cardano'
        }
    ];
} else {
    blockchains = [
        {
            name: 'ETH',
            symbol: 'ETH',
            chainId: 1,
            tagname: <EthIcon />,
            disabled: <EthIconDisable />,
            value: 'ethereum'
        },
        {
            name: 'BSC',
            symbol: 'BNB',
            chainId: 56,
            tagname: <BscIcon />,
            disabled: <BscIconDisable />,
            value: 'bsc'
        },
        {
            name: 'AVAX',
            symbol: 'AVAX',
            chainId: 43114,
            tagname: <Avalanche />,
            disabled: <AvalancheDisable />,
            value: 'avalanche'
        },
        {
            name: 'MATIC',
            symbol: 'MATIC',
            chainId: 137,
            tagname: <PolygonIcon />,
            disabled: <PolygonIconDisable />,
            value: 'matic'
        },
        {
            name: 'Solana',
            symbol: 'SOLANA',
            chainId: 43114,
            tagname: <SolanaIcon />,
            disabled: <SolanaIconDisable />,
            value: 'solana'
        },
        {
            name: 'Cardano',
            symbol: 'CARDANO',
            chainId: 43114,
            tagname: <CardanoIcon />,
            disabled: <CardanoIconDisable />,
            value: 'cardano'
        }
    ];
}

export default blockchains;
