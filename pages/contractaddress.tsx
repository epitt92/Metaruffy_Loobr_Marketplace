import React from 'react';
import Head from 'next/head';

import ContractAddress from '../src/modules/ContractAddress/ContractAddress';

const ContractAddressPage = () => {
    return (
        <div>
            <Head>
                <title>LooBr | contract address</title>
                <meta
                    name={'description'}
                    content="contract address What is the address of your ERC721 contract on the mainnet Network?"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ContractAddress />
        </div>
    );
};

export default ContractAddressPage;
