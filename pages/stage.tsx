import Head from 'next/head';
import React from 'react';
import Stagemodule from '../src/modules/stage/Stagemodule';

const Stage = () => {
    return (
        <div className=" container !min-h-0 pt-[5.688rem] pb-28  ">
            <Head>
                <title>LooBr | Stage </title>

                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                    key={'description'}
                />

                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Stagemodule />
        </div>
    );
};

export default Stage;
