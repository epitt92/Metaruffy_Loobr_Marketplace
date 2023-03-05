import type { NextPage } from 'next';
import Head from 'next/head';
import { ExploreModule } from '../src/modules/ExploreModule/ExploreModule';

const Explore = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Explore</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ExploreModule />
        </div>
    );
};

export default Explore;
