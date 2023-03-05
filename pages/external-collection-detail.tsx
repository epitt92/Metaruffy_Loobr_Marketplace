import Head from 'next/head';
import React from 'react';
import ExternalCollectionsDetailModule from '../src/modules/ExternalCollectionsModule/ExternalCollectionsDetailModule';

const ExternalCollectionsDetail = () => {
    return (
        <div>
            <Head>
                <title>LooBr | External-Collections-Detail</title>
                <meta name={'description'} content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExternalCollectionsDetailModule />;
        </div>
    );
};

export default ExternalCollectionsDetail;
