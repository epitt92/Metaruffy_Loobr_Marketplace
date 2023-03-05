import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
const ChooseNftModule = () => {
    const [readmore, setReadmore] = useState<boolean>(false);

    return (
        <div className="my-20 container ">
            <h1 className="text-[3.4rem]">Create NFT on LooBr</h1>
            <p className="text-lg text-[#D0D0D2] mb-2">
                NFTs are a brand-new type of digital asset that is shocking to everyone. Learning how to market NFT art
                can be beneficial now that their notoriety has reached a wider audience{' '}
                <span className="text-white font-Proxima-SemiBold "> how to create NFT</span> So, get on LooBr, unlike
                cryptocurrencies, NFTs cannot engage in an exchange involving equal substitution.
                <span className={` ${readmore ? 'visible' : 'hidden'}`}>
                    <span className="text-lg">
                        If users choose to mint NFT for Free using the blockchain, they can do so for free. The ability
                        to mint 2-100 NFTs at once is available; the cost is merely one gas fee for the entire NFT
                        Collection. LooBr offers end-to-end encryption, a third-party KYC option, and user-friendly
                        cross-chain minting in addition to a fully created and smoothly integrated social media
                        platform. For the talks, LooBr provides the highest level of security and privacy.
                    </span>
                </span>
                <span
                    className="text-themecolor  inline-block text-lg font-Proxima-SemiBold cursor-pointer ml-1"
                    onClick={() => setReadmore(!readmore)}>
                    {readmore ? 'Read Less' : 'Read More'}
                </span>
            </p>

            <h2 className="text-white text-center mt-4">Choose Item Type</h2>
            <div className="grid mt-28 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:px-8 justify-center ">
                <div className="border border-slate1 rounded-[16px] hover:border-white text-center hover:bg-[#1c1c27] lg:pt-28 py-20 lg:py-0">
                    <Link legacyBehavior href="/create-item">
                        <a>
                            <figure className="flex justify-center items-center">
                                <Image src="/assets/images/choosenft/img1.png" height={168} width={117} alt="" />
                            </figure>
                            <h2 className="text-[2rem] text-white mt-10">Single NFT</h2>
                            <p className="mt-2">Choose this option to mint a single NFT</p>
                        </a>
                    </Link>
                </div>
                <div className=" text-center pt-28 px-10 border border-slate1 hover:border-white rounded-[16px] hover:bg-[#1c1c27] lg:pt-28 py-20 lg:py-0">
                    <Link legacyBehavior href="/create-multiplenft">
                        <a>
                            <figure className="flex justify-center items-center">
                                <Image src="/assets/images/choosenft/img2.png" height={184} width={117} alt="" />
                            </figure>
                            <h2 className="text-[2rem] text-white mt-10">Multiple NFTs</h2>
                            <p className="mt-2">
                                Choose this option to mint 2-100 NFTs in one go, you will just pay 1x gas fee for the
                                whole NFT Collection minted.
                            </p>
                        </a>
                    </Link>
                </div>
                <div className="border border-slate1 rounded-[16px] hover:border-white hover:bg-[#1c1c27] text-center pt-28 ">
                    <figure className="items-center flex justify-center">
                        <Image src="/assets/images/choosenft/img3.png" height={143} width={148} alt=" " />
                    </figure>
                    <h2 className="text-[2rem] text-white mt-12">Mystery Box</h2>
                    <h2 className="text-themecolor mt-16 font-Proxima-Regular text-[2rem] border-t border-slate1 py-2 pt-3">
                        COMING SOON
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default ChooseNftModule;
