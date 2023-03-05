import Head from 'next/head';
import React from 'react';
// import Messagechatmodule from '../src/modules/messagechatmodule/Messagechatmodule';

function Messagechatview() {
    return (
        <>
            <Head>
                <title>LooBr | Message </title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <Messagechatmodule data1={null} setClose={() => {}} />;{' '} */}
        </>
    );
}

export default Messagechatview;
