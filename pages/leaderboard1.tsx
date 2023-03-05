import React from 'react';
import Head from 'next/head';

import LeaderboardModule from '../src/modules/LeaderboardModule/leaderboardModule';

const Leaderboard = () => {
    return (
        <div className="relative !min-h-0">
            <Head>
                <title>LooBr | Kingdomship Leaderboard</title>

                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LeaderboardModule/>
        </div>
    );
};

export default Leaderboard
