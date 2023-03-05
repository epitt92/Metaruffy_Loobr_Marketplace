import React from 'react';
import Head from 'next/head';
import ExternalCollectionsModule from '../src/modules/ExternalCollectionsModule/ExternalCollectionsModule';

const Collection = () => {
    return (
        <div>
            <Head>
                <title>LooBr | External-Collection</title>
                <meta name={'description'} content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExternalCollectionsModule />
        </div>
    );
};

export default Collection;
