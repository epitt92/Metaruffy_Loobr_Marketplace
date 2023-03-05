let tokens: any[];

if (process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV == 'TESTNET') {
    tokens = [
        {
            name: 'Mystery NFT 10K',
            contractAddress: '0x0544F76D0402d563dCb07dB158739B78dDcff1D6',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/mystery2.png',
            chain: 'ETH',
            price: 0.02,
            pcs: '0/10,000',
            quantity: 10000
        },

        {
            name: 'Mystery Land',
            contractAddress: '0x559949e5a4bdb9cfa44b3ee4e268f473e274f11f',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'ETH',
            price: 0.2,
            pcs: '0/150,000 ',
            quantity: 50000
        },
        {
            name: 'Mystery NFT 500',
            contractAddress: '0x8B9B2734D29a0513e47E4aF1E9B329671E3852d6',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/mystery3.png',
            chain: 'ETH',
            price: 1,
            pcs: '0/500 ',
            quantity: 500
        }
    ];
} else {
    tokens = [
        {
            name: 'Mystery NFT 10K',
            contractAddress: '0xBCA350958ac193068c51e1Adb09Ef82a2f8E073D',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/mystery2.png',
            chain: 'ETH',
            price: 0.02,
            pcs: '0/10,000',
            quantity: 10000
        },

        {
            name: 'Mystery Land',
            contractAddress: '0x0539Ac0866E7bDC9258aC5D102dD10A622819059',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/myster1.png',
            chain: 'ETH',
            price: 0.2,
            pcs: '0/50,000 ',
            quantity: 50000
        },
        {
            name: 'Mystery NFT 500',
            contractAddress: '0x6c62F993F78383e93d31e68D83379C4D9f74C8AB',
            uri: 'https://loobr.infura-ipfs.io/ipfs/QmdS13wFRoYyKRgP3s6AccVjDQQXP3buspHbbieQZNrz6z',
            image: '/assets/images/mystery3.png',
            chain: 'ETH',
            price: 1,
            pcs: '0/500 ',
            quantity: 500
        }
    ];
}

export default tokens;
