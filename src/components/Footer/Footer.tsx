import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Input from '../input/Input';
import Button from '../Button/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { homeService } from '../../services/home.service';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Poups from '../popup/poups';

const Footer = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [values, setValues] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const router = useRouter();

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.preventDefault();
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create-newsletter`, values);
            toast.success('You have subscribed to the newsletter.');
            setLoading(false);
        } catch (error) {
            toast.error('Something went wronge.');
            setLoading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const stageRedirect = async () => {
        if (!isAuthenticated) return;
        const res = await homeService.stageLogin();
        const data = res.data.data;
        router.push(
            `${process.env.NEXT_PUBLIC_STAGE_FRONTEND}/?accessToken=${data?.accessToken}&refreshToken=${data?.refreshToken}`
        );
    };

    // main return
    const checkAffiliation = () => {
        if (user && !user?.referral) {
            setState(94);
            setPopup(true);
        }
        if (!user) {
            setState(1);
            setPopup(true);
        }
    };
    return (
        <footer className="bg-[#14141F] pb border border-b-0 border-r-0 border-t-gray5 border-l-0">
            <div className="lg:flex container pt-20 gap-[135px] !min-h-0">
                <div className="flex flex-col items-start lg:w-2/5">
                    <Link legacyBehavior href="/">
                        <a className="w-[124px] h-[50px] block mb-7">
                            <figure>
                                <Image src="/assets/images/loobr.svg" height={90} width={150} alt="" />
                            </figure>
                        </a>
                    </Link>
                    <p className=" mt-1 text-base w-[] text-[#818182] font-normal mb-8">
                        The next generation `all-in-one` cross-chain marketplace for players, creators and traders, with
                        state-of-the-art and custom-designed social media features for all users.
                    </p>
                    <ul className="flex gap-5 mt-8">
                        <li>
                            <Link legacyBehavior href={`https://discord.gg/metaruffy`}>
                                <a target={'_blank'} className="FooterIcon">
                                    <svg
                                        width="16"
                                        height="18"
                                        viewBox="0 0 16 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14.0749 0H2.01492C0.997922 0 0.169922 0.828 0.169922 1.854V14.022C0.169922 15.048 0.997922 15.876 2.01492 15.876H12.2209L11.7439 14.211L12.8959 15.282L13.9849 16.29L15.9199 18V1.854C15.9199 0.828 15.0919 0 14.0749 0ZM10.6009 11.754C10.6009 11.754 10.2769 11.367 10.0069 11.025C11.1859 10.692 11.6359 9.954 11.6359 9.954C11.2669 10.197 10.9159 10.368 10.6009 10.485C10.1509 10.674 9.71892 10.8 9.29592 10.872C8.43192 11.034 7.63992 10.989 6.96492 10.863C6.45192 10.764 6.01092 10.62 5.64192 10.476C5.43492 10.395 5.20992 10.296 4.98492 10.17C4.95792 10.152 4.93092 10.143 4.90392 10.125C4.88592 10.116 4.87692 10.107 4.86792 10.098C4.70592 10.008 4.61592 9.945 4.61592 9.945C4.61592 9.945 5.04792 10.665 6.19092 11.007C5.92092 11.349 5.58792 11.754 5.58792 11.754C3.59892 11.691 2.84292 10.386 2.84292 10.386C2.84292 7.488 4.13892 5.139 4.13892 5.139C5.43492 4.167 6.66792 4.194 6.66792 4.194L6.75792 4.302C5.13792 4.77 4.39092 5.481 4.39092 5.481C4.39092 5.481 4.58892 5.373 4.92192 5.22C5.88492 4.797 6.64992 4.68 6.96492 4.653C7.01892 4.644 7.06392 4.635 7.11792 4.635C7.66692 4.563 8.28792 4.545 8.93592 4.617C9.79092 4.716 10.7089 4.968 11.6449 5.481C11.6449 5.481 10.9339 4.806 9.40392 4.338L9.52992 4.194C9.52992 4.194 10.7629 4.167 12.0589 5.139C12.0589 5.139 13.3549 7.488 13.3549 10.386C13.3549 10.386 12.5899 11.691 10.6009 11.754Z"
                                            fill="#818182"
                                        />
                                    </svg>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link legacyBehavior href="https://twitter.com/loobr_com">
                                <a target={'_blank'} className="FooterIcon">
                                    <svg
                                        width="21"
                                        height="17"
                                        viewBox="0 0 21 17"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20.3594 1.9506C19.6077 2.2767 18.8128 2.49226 17.9994 2.5906C18.8575 2.07792 19.5006 1.27138 19.8094 0.3206C19.0029 0.800664 18.1201 1.1389 17.1994 1.3206C16.5839 0.653172 15.7643 0.208897 14.8692 0.0574517C13.974 -0.0939932 13.0539 0.0559587 12.2532 0.48379C11.4524 0.911621 10.8163 1.59313 10.4446 2.42144C10.0729 3.24974 9.98667 4.17799 10.1994 5.0606C8.5688 4.97813 6.97382 4.55355 5.51803 3.81446C4.06224 3.07537 2.77822 2.03829 1.74938 0.7706C1.38851 1.40077 1.19889 2.11442 1.19937 2.8406C1.1981 3.51498 1.36359 4.17922 1.68113 4.77417C1.99867 5.36911 2.45839 5.87631 3.01937 6.2506C2.36735 6.23286 1.72926 6.0579 1.15937 5.7406V5.7906C1.16426 6.73549 1.49537 7.64969 2.09669 8.37857C2.69801 9.10744 3.53263 9.60624 4.45937 9.7906C4.10263 9.89917 3.73225 9.95641 3.35938 9.9606C3.10127 9.95759 2.8438 9.93418 2.58938 9.8906C2.85328 10.7034 3.364 11.4137 4.05045 11.9228C4.7369 12.4318 5.56495 12.7142 6.41938 12.7306C4.97658 13.8659 3.19526 14.4855 1.35938 14.4906C1.02511 14.4917 0.691111 14.4717 0.359375 14.4306C2.2338 15.6409 4.41819 16.2833 6.64937 16.2806C8.18907 16.2966 9.71651 16.0056 11.1425 15.4247C12.5685 14.8437 13.8644 13.9845 14.9546 12.8971C16.0448 11.8097 16.9073 10.516 17.4919 9.09151C18.0765 7.66702 18.3714 6.14033 18.3594 4.6006C18.3594 4.4306 18.3594 4.2506 18.3594 4.0706C19.1441 3.48541 19.8209 2.76803 20.3594 1.9506Z"
                                            fill="#818182"
                                        />
                                    </svg>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link legacyBehavior href={`https://www.instagram.com/loobr_com`}>
                                <a target={'_blank'} className="FooterIcon AtCircleSvg">
                                    <svg
                                        width="25"
                                        height="19"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="16" r="16" fill="#737373"></circle>
                                        <path
                                            className="AtInstaIcon"
                                            d="M16 7C13.5576 7 13.2505 7.01125 12.2909 7.054C11.3313 7.099 10.6776 7.24975 10.105 7.4725C9.50436 7.69842 8.9603 8.0528 8.51088 8.51088C8.05309 8.96053 7.69875 9.50452 7.4725 10.105C7.24975 10.6765 7.09788 11.3312 7.054 12.2875C7.01125 13.2494 7 13.5554 7 16.0011C7 18.4446 7.01125 18.7506 7.054 19.7103C7.099 20.6688 7.24975 21.3224 7.4725 21.895C7.70312 22.4867 8.01025 22.9885 8.51088 23.4891C9.01038 23.9897 9.51213 24.298 10.1039 24.5275C10.6776 24.7502 11.3301 24.9021 12.2886 24.946C13.2494 24.9887 13.5554 25 16 25C18.4446 25 18.7495 24.9887 19.7103 24.946C20.6676 24.901 21.3235 24.7502 21.8961 24.5275C22.4964 24.3015 23.04 23.9471 23.4891 23.4891C23.9897 22.9885 24.2969 22.4867 24.5275 21.895C24.7491 21.3224 24.901 20.6688 24.946 19.7103C24.9887 18.7506 25 18.4446 25 16C25 13.5554 24.9887 13.2494 24.946 12.2886C24.901 11.3313 24.7491 10.6765 24.5275 10.105C24.3013 9.5045 23.9469 8.96051 23.4891 8.51088C23.0398 8.05264 22.4957 7.69823 21.895 7.4725C21.3212 7.24975 20.6665 7.09788 19.7091 7.054C18.7484 7.01125 18.4435 7 15.9978 7H16.0011H16ZM15.1934 8.62225H16.0011C18.4041 8.62225 18.6887 8.63013 19.6371 8.674C20.5146 8.71338 20.9916 8.86075 21.3089 8.98338C21.7285 9.1465 22.0289 9.34225 22.3439 9.65725C22.6589 9.97225 22.8535 10.2715 23.0166 10.6923C23.1404 11.0084 23.2866 11.4854 23.326 12.3629C23.3699 13.3113 23.3789 13.5959 23.3789 15.9978C23.3789 18.3996 23.3699 18.6854 23.326 19.6337C23.2866 20.5112 23.1393 20.9871 23.0166 21.3044C22.8723 21.6952 22.642 22.0485 22.3427 22.3382C22.0277 22.6532 21.7285 22.8479 21.3078 23.011C20.9928 23.1348 20.5157 23.281 19.6371 23.3215C18.6887 23.3643 18.4041 23.3744 16.0011 23.3744C13.5981 23.3744 13.3124 23.3643 12.364 23.3215C11.4865 23.281 11.0106 23.1348 10.6934 23.011C10.3024 22.8669 9.94877 22.637 9.65837 22.3382C9.35884 22.048 9.12819 21.6944 8.98338 21.3032C8.86075 20.9871 8.71338 20.5101 8.674 19.6326C8.63125 18.6843 8.62225 18.3996 8.62225 15.9955C8.62225 13.5925 8.63125 13.309 8.674 12.3606C8.7145 11.4831 8.86075 11.0061 8.9845 10.6889C9.14763 10.2693 9.34337 9.96887 9.65837 9.65387C9.97337 9.33887 10.2726 9.14425 10.6934 8.98113C11.0106 8.85738 11.4865 8.71113 12.364 8.67063C13.1943 8.63238 13.516 8.62113 15.1934 8.62V8.62225V8.62225ZM20.8049 10.1162C20.663 10.1162 20.5226 10.1442 20.3916 10.1985C20.2605 10.2527 20.1415 10.3323 20.0412 10.4326C19.9409 10.5329 19.8614 10.6519 19.8071 10.783C19.7528 10.914 19.7249 11.0544 19.7249 11.1963C19.7249 11.3381 19.7528 11.4785 19.8071 11.6095C19.8614 11.7406 19.9409 11.8596 20.0412 11.9599C20.1415 12.0602 20.2605 12.1398 20.3916 12.194C20.5226 12.2483 20.663 12.2763 20.8049 12.2763C21.0913 12.2763 21.366 12.1625 21.5686 11.9599C21.7711 11.7574 21.8849 11.4827 21.8849 11.1963C21.8849 10.9098 21.7711 10.6351 21.5686 10.4326C21.366 10.23 21.0913 10.1162 20.8049 10.1162V10.1162ZM16.0011 11.3785C15.3881 11.3689 14.7793 11.4814 14.2101 11.7094C13.6409 11.9374 13.1228 12.2763 12.6859 12.7065C12.249 13.1366 11.902 13.6494 11.6652 14.2149C11.4284 14.7804 11.3064 15.3874 11.3064 16.0006C11.3064 16.6137 11.4284 17.2207 11.6652 17.7862C11.902 18.3517 12.249 18.8645 12.6859 19.2946C13.1228 19.7248 13.6409 20.0637 14.2101 20.2917C14.7793 20.5197 15.3881 20.6322 16.0011 20.6226C17.2145 20.6037 18.3717 20.1084 19.2231 19.2437C20.0745 18.3789 20.5516 17.2141 20.5516 16.0006C20.5516 14.7871 20.0745 13.6222 19.2231 12.7575C18.3717 11.8927 17.2145 11.3974 16.0011 11.3785V11.3785ZM16.0011 12.9996C16.7969 12.9996 17.56 13.3157 18.1227 13.8784C18.6854 14.4411 19.0015 15.2043 19.0015 16C19.0015 16.7957 18.6854 17.5589 18.1227 18.1216C17.56 18.6843 16.7969 19.0004 16.0011 19.0004C15.2054 19.0004 14.4422 18.6843 13.8795 18.1216C13.3169 17.5589 13.0008 16.7957 13.0008 16C13.0008 15.2043 13.3169 14.4411 13.8795 13.8784C14.4422 13.3157 15.2054 12.9996 16.0011 12.9996V12.9996Z"
                                            fill="#14141F"></path>
                                    </svg>
                                </a>
                            </Link>
                        </li>
                        <li>
                            {/* telegram.com/loobr_com */}
                            <Link legacyBehavior href={`https://t.me/loobr_com`}>
                                <a target={'_blank'} className="FooterIcon">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z"
                                            fill="#818182"
                                        />
                                        <path
                                            className="AtTelegramIcon"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M4.07377 8.90496C6.69745 7.76187 8.44698 7.00827 9.32237 6.64417C11.8218 5.60458 12.3411 5.424 12.6796 5.41803C12.7541 5.41672 12.9205 5.43517 13.0284 5.52267C13.1194 5.59655 13.1445 5.69635 13.1565 5.7664C13.1685 5.83645 13.1834 5.99602 13.1715 6.1207C13.0361 7.54381 12.45 10.9973 12.1519 12.5912C12.0257 13.2657 11.7773 13.4918 11.5368 13.5139C11.0141 13.562 10.6173 13.1685 10.1111 12.8367C9.31894 12.3175 8.87144 11.9942 8.10256 11.4876C7.21398 10.902 7.79001 10.5802 8.29641 10.0542C8.42893 9.91655 10.7317 7.82198 10.7763 7.63197C10.7819 7.60821 10.787 7.51963 10.7344 7.47285C10.6818 7.42608 10.6041 7.44207 10.5481 7.4548C10.4686 7.47283 9.20322 8.30922 6.75183 9.96397C6.39264 10.2106 6.06731 10.3308 5.77581 10.3245C5.45447 10.3176 4.83633 10.1428 4.3768 9.99343C3.81317 9.81021 3.36522 9.71335 3.40422 9.4022C3.42454 9.24013 3.64772 9.07439 4.07377 8.90496Z"
                                            fill="#14141F"
                                        />
                                    </svg>
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-wrap justify-between w-full mt-10 lg:mt-0">
                    <div className="sm:!w-auto  ">
                        <h3 className="text-white font-Circular-Medium mb-11"> Quick Links</h3>
                        <ul className="mt-4 text-base text-gray6 font-Circular-Book">
                            <li>
                                <Link legacyBehavior href="https://metaruffy.io">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        MetaRuffy
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://ruffyworld.com/">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        RuffyWorld
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://metaruffy.io/press/">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Press
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link
                                    legacyBehavior
                                    href="https://metaruffy.io/wp-content/uploads/2022/09/MetaRuffy_Whitepaper_ETH_FINAL-1.pdf">
                                    <a
                                        target="_blank"
                                        className="!text-gray6 text-base hover:!text-themecolor"
                                        download={true}>
                                        {' '}
                                        Whitepaper
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://docs.metaruffy.io/metaruffy-and-loobr-docs">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        {' '}
                                        Docs
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link
                                    legacyBehavior
                                    href="https://docs.metaruffy.io/metaruffy-and-loobr-docs/loobr/faq-loobr">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        FAQs
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="sm:!w-auto  ">
                        <h3 className="text-white font-Circular-Medium mb-11">Others</h3>
                        <ul className="py-1 mt-4 text-base text-gray6 font-Circular-Book">
                            <li>
                                <Link legacyBehavior href="https://metaruffy.io/nft-services/">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        NFT-Service
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link
                                    legacyBehavior
                                    href="https://docs.metaruffy.io/metaruffy-and-loobr-docs/loobr/loobr.com-how-to-videos">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        How to Video&apos;s
                                    </a>
                                </Link>
                            </li>

                            <li className="mt-4">
                                <Link legacyBehavior href="/getlisted">
                                    <a className="!text-gray6 text-base hover:!text-themecolor">Get Listed</a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="/dao">
                                    <a className="!text-gray6 text-base hover:!text-themecolor">DAO</a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href={`${user?.referral ? '/affiliate' : ''}`}>
                                    <button
                                        onClick={() => {
                                            checkAffiliation();
                                        }}>
                                        <p className="!text-gray6 text-base hover:!text-themecolor cursor-pointer font-Proxima-Bold">
                                            Affiliate
                                        </p>
                                    </button>
                                </Link>
                            </li>
                            {isAuthenticated && (
                                <li onClick={stageRedirect} className="mt-4 cursor-pointer">
                                    <a className="!text-gray6 text-base hover:!text-themecolor">Stage</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="sm:!w-auto ">
                        <h3 className="text-white font-Circular-Medium mb-11">About Us</h3>
                        <ul className="py-1 mt-4 text-base text-gray6 font-Circular-Book">
                            <li>
                                <Link legacyBehavior href="https://metaruffy.io/termsandconditions">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Terms & Conditions
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://metaruffy.io/disclaimer">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Disclaimer
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://metaruffy.io/dataprotection">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Data Protection
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://metaruffy.io/investor_relations">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Investor Relation
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://metaruffy.io/imprint">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Imprint
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://blog.loobr.com/">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Blog
                                    </a>
                                </Link>
                            </li>
                            <li className="mt-4">
                                <Link legacyBehavior href="https://metaruffy.io/contact_us">
                                    <a target="_blank" className="!text-gray6 text-base hover:!text-themecolor">
                                        Contact Us
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="sm:!w-auto xs:w-full xs:mb-10">
                        <h3 className="text-white font-Circular-Medium mb-11"> Newsletter</h3>
                        <p className="text-gray6 font-normal mb-[30px]">
                            Please enter your email to get latest news and updates
                        </p>
                        <form onSubmit={handleSubmit}>
                            <fieldset className="relative p-0 border-0">
                                <Input
                                    placeholder="Your Email"
                                    className="!bg-[#2B2B35] !py-6 border-0 !rounded-full !pr-[130px]"
                                    name="email"
                                    onchange={handleChange}
                                />
                                <Button
                                    className="bg-[#F1C94A] gold !py-2.5 !px-8 text-[#14141F] rounded-[6rem] text-sm !absolute right-2.5 !top-[0.688rem]"
                                    onClick={handleSubmit}
                                    isLoading={loading}
                                    disabled={loading}>
                                    Submit
                                </Button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container !min-h-0">
                <div className="flex justify-between items-center pt-7 pb-7  mt-8 border-t border-[#2B2B35]">
                    <p className="!text-[#818182] font-normal">
                        2022 © LooBr.com is a product of MetaRuffy international FZCO based in Dubai - All rights
                        reserved.
                    </p>
                </div>
            </div>
            {state && <Poups show={popup} hide={setPopup} state={state} setstate={setState} setPopup={setPopup} />}
        </footer>
    );
};

export default Footer;
