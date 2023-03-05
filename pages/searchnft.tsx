import Head from 'next/head';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SearchReasultModule from '../src/modules/SearchReasultModule/SearchReasultModule';

const SearchPage = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Search results</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SearchReasultModule />
        </div>
    );
};

export default SearchPage;
