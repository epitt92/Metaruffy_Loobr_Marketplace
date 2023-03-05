let mrtokens: any[];

if (process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET') {
    mrtokens = [
        {
            name: 'Metaruffy Land',
            contractAddress: '0x0544F76D0402d563dCb07dB158739B78dDcff1D6',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'BSC',
            unit: 'WBNB',
            price: 0.02,
            pcs: '0/0',
            quantity: 10000
        },

        {
            name: 'Metaruffy Land',
            contractAddress: '0xF41e7F59f0Bf8ADAee42A9B5e4a275E4B2Bee6ce',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'Ethereum',
            unit: 'ETH',
            price: 0.2,
            pcs: '0/50,000 ',
            quantity: 50000
        },
        {
            name: 'Metaruffy Land',
            contractAddress: '0x0544F76D0402d563dCb07dB158739B78dDcff1D6',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'Polygon',
            unit: 'WMATIC',
            price: 0.02,
            pcs: '0/15,000',
            quantity: 15000
        },
        {
            name: 'Metaruffy Land',
            contractAddress: '0x8B9B2734D29a0513e47E4aF1E9B329671E3852d6',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'Avalanche',
            unit: 'AVAX',
            price: 1,
            pcs: '0/15,000 ',
            quantity: 15000
        }
    ];
} else {
    mrtokens = [
        {
            name: 'Metaruffy Land',
            network: 'Ethereum',
            contractAddress: '0x81FEa6a299FbA9742ebcd6AD4dE7361f92391aBb',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'ETH',
            chain_id: 1,
            unit: 'ETH',
            price: 0.2,
            pcs: '0 / 50,000 ',
            quantity: 50000
        },
        {
            name: 'Metaruffy Land',
            network: 'BSC',
            contractAddress: '0xf97199f79cA6677C3bAa20a48320029bA9264b08',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'BSC',
            chain_id: 56,
            unit: 'ETH',
            price: 0.2,
            pcs: '10,227 / 15,000',
            quantity: 15000
        },
        {
            name: 'Metaruffy Land',
            network: 'Avalanche',
            contractAddress: '0xC4ee3ff221ad2566f30F75087FB519fA740cE7Fe',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'AVAX',
            chain_id: 43114,
            unit: 'ETH',
            price: 0.2,
            pcs: '0 / 15,000 ',
            quantity: 15000
        },
        {
            name: 'Metaruffy Land',
            network: 'Polygon',
            contractAddress: '0x9AEfe5cD9Aaf86E6E04CB7607D795b292bc59ce3',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'MATIC',
            chain_id: 137,
            unit: 'ETH',
            price: 0.2,
            pcs: '0 / 15,000',
            quantity: 15000
        }
    ];
}

export default mrtokens;
