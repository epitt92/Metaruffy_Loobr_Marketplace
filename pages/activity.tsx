import type { NextPage } from "next";
import Head from "next/head";
import Activitymodule from "../src/modules/activitymodule/activitymodule";

const Activity = () => {
    return (
        <div>
            <Head>
                <title>LooBr | Activity</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Activitymodule />
        </div>
    );
};

export default Activity;
