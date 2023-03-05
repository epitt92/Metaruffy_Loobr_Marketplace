import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const GetListed = () => {
    return (
        <>
            <Head>
                <title>LooBr | Choose NFT</title>
                <meta
                    name="description"
                    content="Design, Buy and Sell digital art and more. Use our interactive
social features and release your limitless imagination.
Welcome to the start of something great!"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container text-center">
                <h2 className="font-Proxima-Bold text-white mt-24 text-[2.5rem]">Get listed on LooBr</h2>
                <p className="text-lg mt-1">
                    Is your NFT not visible in your LooBr profile?{' '}
                    <span className="block">Get listed on LooBr.com and apply now!</span>
                </p>
                <div className=" my-28 sm:my-[13.75rem]  flex flex-col items-center sm:flex-row  justify-center gap-8 md:gap-12">
                    <div className="border border-[#3C3C52] rounded-2xl  flex flex-col justify-center px-8 lg:px-16 h-[12.5rem] w-full sm:w-[30.68rem]">
                        <Link legacyBehavior href={'/listed/mainnet'}>
                            <a>
                                <h3 className="text-[2rem] font-Proxima-Bold text-white">Live on a mainnet</h3>
                                <p className="text-xl leading-none mt-2">
                                    We have something and it&apos;s ready to roll
                                </p>
                            </a>
                        </Link>
                    </div>

                    {/* <div className="border border-[#3C3C52] rounded-2xl flex flex-col justify-center px-8 lg:px-16 h-[12.5rem] w-full sm:w-[30.68rem]">
                        <Link legacyBehavior href={'/listed/testnet'}>
                            <a>
                                <h3 className="text-[2rem] font-Proxima-Bold text-white">Live on a testnet</h3>
                                <p className="text-xl leading-none mt-2">
                                    It&apos;s on a testnet and ready to migrate over to a mainnet
                                </p>
                            </a>
                        </Link>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default GetListed;
