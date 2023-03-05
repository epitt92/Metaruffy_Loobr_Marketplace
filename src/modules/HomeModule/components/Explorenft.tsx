import Link from 'next/link';
import React, { useState } from 'react';
import Button from '../../../components/Button/Button';

const ExploreNft = () => {
    const [readmore, setReadmore] = useState<boolean>(false);

    return (
        <div className="container relative bg-[#14141F] mb-[6rem]">
            <div className=" bg-explore  sm:bg-[url('/assets/images/newexplore.png')] bg-[url('/assets/images/exlpore2.png')] sm:min-h-[33.688rem]  py-[6.875rem] flex justify-center items-center  xs:rounded-[32px] xs:border xs:border-[#6D6D6D]   ">
                <div className="flex flex-col items-center justify-center  mt-6 ">
                    <h2 className="text-white  md:text-[4.875rem] sm:text-[4rem] xs:text-[2rem] xs4:text-2xl font-Proxima-SemiBold whitespace-nowrap">
                        A new <span className="text-[#920069] bg-themecolor rounded-2xl px-5"> way</span> to{' '}
                        <span className="text-[#00326D] bg-[#51F9D1] rounded-2xl px-5"> Explore</span>{' '}
                    </h2>
                    <p className="text-lg text-[#D0D0D2] mt-12  md:w-[56.563rem] md:px-0 px-16 ">
                        Interoperability has always been difficult in blockchain ecosystems, but in NFT marketplaces, it
                        is certainly a problem. Cross-chain technology is a developing technology that permits the
                        transfer of money and information between several blockchain networks.
                        <span className={` ${readmore ? 'visible' : 'hidden'}`}>
                            <span className="text-lg">
                                You may build an enterprise-grade{' '}
                                <span className="text-white font-Proxima-SemiBold ">
                                    {' '}
                                    Cross-Chain Marketplace for Traders{' '}
                                </span>{' '}
                                with help from LooBr, enabling users to trade NFTs that are present on many blockchains
                                with the highest level of security and transparency. Since buyers and sellers are
                                continually active on all blockchains at any given time, the existence of numerous
                                blockchains encourages liquidity. The number of traders will rise as soon as an{' '}
                                <span className="text-white font-Proxima-SemiBold "> NFT Trading Platform </span> that
                                supports liquidity and quick transactions are discovered. In order to increase the
                                productivity of your platform, we also incorporate cross-chain architecture.
                            </span>{' '}
                        </span>
                        <span
                            className="text-themecolor  inline-block text-lg font-Proxima-SemiBold cursor-pointer ml-2"
                            onClick={() => setReadmore(!readmore)}>
                            {readmore ? 'Read Less' : 'Read More'}
                        </span>
                    </p>
                    <div className="mt-9 flex justify-center items-center">
                        <Link legacyBehavior href="/marketplace">
                            <a>
                                <Button className="px-10 py-4 rounded-[6.25rem]"> Explore Now</Button>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreNft;
