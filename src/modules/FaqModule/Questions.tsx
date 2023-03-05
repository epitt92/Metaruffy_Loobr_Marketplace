import { Disclosure } from '@headlessui/react';
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
const Questions = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setDate] = useState<Array<any>>([]);
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        let res = await userService.getContent();
        setLoading(false);
        if (res?.data?.data?.faq && res?.data?.data?.faq.length > 0) {
            setDate(res?.data?.data?.faq);
        }
    };
    const x = [
        {
            heading: '1. Do I have to create an account and Log-In to buy and sell NFTs?',
            ans: 'To list your own NFTs or buy NFTs on the marketplace, simply connect your wallet with LooBr. If you want to participate in the social feed, you need to create an account, log-in and connect your wallet.'
        },
        {
            heading: '2. What is $MR and how do i get it?',
            ans: '$MR is the native token within the MetaRuffy ecosystem that fuels LooBr. Every buy and sell is priced and executed with the $MR token.'
        },
        {
            heading: '3. How can I verify myself?',
            ans: 'You can verify yourself in your profile settings and be visible throughout the social feed with your KYC badge.'
        },
        {
            heading: '4. How can i connect my social media accounts with LooBr?',
            ans: 'Go to your profile settings and link your social media accounts.'
        },
        {
            heading: '5. Where can I find my purchased NFTs?',
            ans: 'The NFTs purchased you can find under ______ (while your wallet is connected)'
        },
        {
            heading: '6. What are the fees (gas, mint, buy, sell) for LooBr?',
            ans: 'The NFTs purchased you can find under ______ (while your wallet is connected)'
        },

        {
            heading: '7. How can I upload and create an NFT on LooBr?',
            ans: 'Connect your wallet. On the top right you will see create, where you can upload your NFT and create it within LooBr.',
            ans2: 'First you need to mint your NFT, Later you can choose to upload on the Marketplace'
        },
        {
            heading: '8. How can i contact LooBr support?',
            ans: 'You can contact LooBr support via support@metaruffy.io',
            link: 'support@metaruffy.io'
        },
        {
            heading: '9. NFT collection You can create a collection page by clicking _____',
            ans: 'collection page by clicking'
        },
        {
            heading: '10. Auction',
            ans: 'You are able to create an NFT auction, where you define the terms and the timeline for the auction. '
        },
        { heading: '11. LooBr Fees?', ans: 'Marketplace 1% - List 1% - Sell 8%' },
        {
            heading: '12. How to stake you MR tokens?',
            ans: 'Visit our dApp and click on Stake, you can choose between a 30, 90 or 180 day lock with up to 20% APY'
        },
        { heading: '13. Buy land or assets?', ans: 'You can buy land or assets within our Loobr.com marketplace.' },
        {
            heading: '14. What is LooBr Score?',
            ans: 'To understand the LooBr score system visit:',
            link: ' LooBr score'
        },
        { heading: '15. Royalities?', ans: 'Royalities 0%-10%' },
        {
            heading: '16. How do royalties work?',
            ans: 'Royalties can be defined between 0-10%. Every trade of your NFT collection on the secondary market '
        },
        { heading: '17. How to become a featured artist on the LooBr Marketplace?', ans: 'TBD' },
        { heading: '18. What files can I upload?', ans: 'PNG, GIFs, WEBP up to 20 MB per file can be uploaded. ' },
        { heading: '19. Can I enlist my NFTS?', ans: 'If it is not an auction you are able to enlist your NFT.' },
        {
            heading: '20. Can I change price for my NFTs afterwards?',
            ans: 'Once published you have to wait until the time you set is over, then you can re-place the NFT on LooBr and adjust the price.'
        },
        {
            heading: '21. Can I showcase my NFTs on LooBr also on other NFT marketplace at the same time?',
            ans: 'The exact same NFT can not be published on another marketplace at the same time. However, as soon as you own the NFT you can also sell it on other marketplaces if you did not list it on LooBr. '
        },
        {
            heading: '22. What is rarity score?',
            ans: 'Rarity Score give results that give enough emphasis to single rare traits and also includes overall trait rarities in its calculation. '
        },
        {
            heading: '23. NFT History?',
            ans: 'The NFT history and previous owner can either be seen on the respective Chain-Scanner or within the NFTs history on LooBr itself. '
        },
        {
            heading: '24. What is proof of authenticity?',
            ans: 'A checkmark badge on an account means that account has been verified for authenticity by LooBr. '
        },
        {
            heading: '25. What is IPFS? ',
            ans: 'The InterPlanetary File System (IPFS) is a protocol and peer-to-peer network for storing and sharing data in a distributed file system. '
        },
        {
            heading: '26. Can I get banned? Black listed?',
            ans: 'If you are conducting shady business according to our Terms & Conditions, you might receive either a soft ban or a complete ban from LooBr.'
        },
        {
            heading: '27. What kind of kind of content is not allowed? ',
            ans: 'Any kind of pornographic, racist, offensive to any culture, race or religion is not tolerated and will be banned. '
        },
        {
            heading: '28. What are the popular NFT sizes that are generally used in the NFT industry? ',
            ans: 'CryptoPunks: 336 px square  ',
            b: 'Bored Ape Yacht Club: 631px square ',
            c: 'VeeFriends: 640px x 860px  ',
            d: 'World of Women: 800px square  ',
            e: 'Cool Cats: 1080px square  '
        }
    ];
    return (
        <div className="mt-8">
            {loading ? (
                <div className=" text-center   ">
                    <figure className="mt-12">
                        <div className="loadingio-spinner-rolling-jz7efhw30v">
                            <div className="ldio-fcd0x3izul5">
                                <div></div>
                            </div>
                        </div>
                    </figure>
                </div>
            ) : (
                <>
                    {data?.map((item, i) => (
                        <Disclosure
                            as="div"
                            key={i}
                            className={` bg-[#2B2B35] mt-2 `}
                            // defaultOpen={!close}
                        >
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className={` w-full flex justify-between  items-center`}>
                                        <div className="flex gap-3 items-center  w-full justify-between bg-[#2B2B35] py-5 px-10">
                                            <h3 className=" text-white text-base text-left sm:text-[18px] text-[16px]">
                                                {item?.question}
                                            </h3>
                                            <i className={`${open ? 'rotate-0' : '-rotate-180 '}`}>
                                                <svg
                                                    width="14"
                                                    height="8"
                                                    viewBox="0 0 14 8"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M1 7L7 1.24225L13 7"
                                                        stroke="#EFC74D"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </i>
                                        </div>
                                    </Disclosure.Button>
                                    <Disclosure.Panel as="dd" className="mt-2 pl-10 pr-20 pb-10 ">
                                        <p
                                            className="AtContentText !text-white sm:text-[16px] text-[14px]"
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(item?.answer)
                                            }}></p>
                                        {item?.link && (
                                            <a href={i == 7 ? 'mailto:support@metaruffy.io' : 'javascript:void(0)'}>
                                                {item?.link}
                                            </a>
                                        )}
                                        {/* {item.ans2 && (
                                            <p className="!text-white sm:text-[16px] text-[14px]">{item.ans2}</p>
                                        )} */}
                                        {/* {i == 27 && (
                                            <p className="!text-white sm:text-[16px] text-[14px]">
                                                <span className="block">{item.b}</span>
                                                <span className="block">{item.c}</span>
                                                <span className="block">{item.d}</span>
                                                <span className="block">{item.e}</span>
                                            </p>
                                        )} */}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    ))}
                </>
            )}
        </div>
    );
};

export default Questions;
