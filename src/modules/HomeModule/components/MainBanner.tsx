import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../../components/Button/Button';
import Popups from '../../../components/popup/poups';
import useMetaMask from '../../../hooks/useMetaMask';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation, Autoplay } from 'swiper';
import Image from 'next/image';

const MainBanner = () => {
    const { isInstalled, isActive }: any = useMetaMask();

    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const images = useSelector((state: any) => state.admin.bannerImages);

    const router = useRouter();

    const handleCreate = () => {
        if (!isAuthenticated) {
            setPopup(true);
            setState(1);
        } else if (!isInstalled) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
        } else if (!isActive) {
            setPopup(true);
            setState(7);
        } else if (isActive) {
            router.push('/choosenft');
        }
    };
    const row1 = [
        '/assets/images/animate/1.jpg',
        '/assets/images/animate/2.png',
        '/assets/images/animate/3.png',
        '/assets/images/animate/new/1.png',
        '/assets/images/animate/new/2.jpg',
        '/assets/images/animate/new/3.png',
        '/assets/images/animate/4.png',
        '/assets/images/animate/7.png',
        '/assets/images/animate/9.png',
        '/assets/images/animate/10.png'
    ];
    const row2 = [
        '/assets/images/animate/11.png',
        '/assets/images/animate/12.png',
        '/assets/images/animate/13.png',
        '/assets/images/animate/new/4.png',
        '/assets/images/animate/new/5.jpg',
        '/assets/images/animate/new/6.png',
        '/assets/images/animate/17.png',
        '/assets/images/animate/18.png',
        '/assets/images/animate/19.png',
        '/assets/images/animate/20.png'
    ];
    const row3 = [
        '/assets/images/animate/21.png',
        '/assets/images/animate/22.png',
        '/assets/images/animate/23.png',
        '/assets/images/animate/26.png',
        '/assets/images/animate/new/7.gif',
        '/assets/images/animate/new/8.png',
        '/assets/images/animate/1.jpg',
        '/assets/images/animate/2.png',
        '/assets/images/animate/3.png',
        '/assets/images/animate/4.png'
    ];

    const slidesImgUrl = 'https://ipfs.infura.io/ipfs/QmZKvP1J1BwebW7P1k4XjjKFhLBXcJmjvkFxeodFto2cYE';

    return (
        <div className="relative">
            <div className="mySwiper Atcollectionslider min-h-[40rem] xl:min-h-[50.25rem] ">
                <Swiper
                    navigation={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    autoplay={{
                        delay: 8000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false
                    }}
                    // onSwiper={(swiper) => console.log(swiper)}
                    // onSlideChange={() => console.log('slide change')}
                    spaceBetween={0}
                    slidesPerView={1}
                    style={{ position: 'unset' }}

                    // loop={true}
                    // breakpoints={{
                    //   320: {
                    //     slidesPerView: 1,
                    //   },
                    //   640: {
                    //     slidesPerView: 1,
                    //   },
                    //   768: {
                    //     slidesPerView: 2,
                    //   },
                    //   1280: {
                    //     slidesPerView: 3,
                    //     spaceBetween: 20,
                    //   },

                    //   1536: {
                    //     slidesPerView: 5,
                    //     spaceBetween: 20,
                    //   },
                    // }}
                >
                    {/* {images &&
                        images.length > 0 &&
                        images.map((i: any, index: number) => { */}
                    {/* return ( */}
                    <SwiperSlide className="">
                        <div className="relative Atroyaitybox ">
                            <div className="leading-none w-full  min-h-[40rem] xl:min-h-[50.25rem] bg-[#14141F]">
                                {/* <Image
                                                className=""
                                                src={i}
                                                alt=""
                                                objectFit="cover"
                                                layout="fill"
                                                quality={20}
                                            /> */}
                            </div>
                            {/* {index == 0 && ( */}
                            <div className="absolute w-[150%]  h-[150%] top-[10%] left-[18%] z-30 transform rotate-[50deg] hidden sm:block ">
                                <div className="h-[280px] w-full  mt-5 flex gap-5">
                                    {row1.map((item, i) => (
                                        <div className="w-[300px] h-full relative move1" key={i}>
                                            <Image src={item} objectFit="cover" layout="fill" quality={20} />
                                        </div>
                                    ))}
                                </div>

                                <div className="h-[280px]  w-full mt-5 flex gap-5 move2">
                                    {row3.map((item, i) => (
                                        <div className="w-[300px] h-full relative " key={i}>
                                            <Image src={item} objectFit="cover" layout="fill" quality={20} />
                                        </div>
                                    ))}
                                </div>

                                <div className="h-[280px] w-full    mt-5 flex gap-5 move1">
                                    {row2.map((item, i) => (
                                        <div className="w-[300px] h-full relative " key={i}>
                                            <Image src={item} objectFit="cover" layout="fill" quality={20} />
                                        </div>
                                    ))}
                                </div>
                                <div className="h-[270px] w-full   mt-5 flex gap-5 move2">
                                    {row1.map((item, i) => (
                                        <div className="w-[300px] h-full relative " key={i}>
                                            <Image src={item} objectFit="cover" layout="fill" quality={20} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* )} */}
                        </div>
                    </SwiperSlide>
                    {/* );
                        })} */}
                    {/* <SwiperSlide className="">
            <div
              className="Atroyaitybox"
            >
              <figure className="leading-none w-full min-h-[35rem] sm:min-h-[40rem] xl:min-h-[50.25rem]">
                <Image
                  className=""
                  src="/assets/images/banner-bg.jpg"
                  alt=""
                  objectFit="cover"
                  layout="fill"
                />
              </figure>
            </div>
          </SwiperSlide>
          <SwiperSlide className="">
            <div
              className="Atroyaitybox"
            >

              <figure className="leading-none w-full min-h-[35rem] sm:min-h-[40rem] xl:min-h-[50.25rem]">
                <Image
                  className=""
                  src={item.logoPicture}
                  src="/assets/images/banner-img-2.png"
                  alt=""
                  objectFit="cover"
                  layout="fill"
                />
              </figure>

            </div>
          </SwiperSlide> */}
                </Swiper>
            </div>
            <div className="absolute top-0 h-full left-0 w-full  z-[2] flex items-center ">
                <div className="container">
                    <div className="items-center space-x-4 lg:flex">
                        <div className="w-full text-center sm:text-left ">
                            <h1 className="text-white text-[2.5rem] leading-[3.5rem] sm:text-[3.5rem] xl:text-[5rem] font-Proxima-Bold sm:leading-[5rem]">
                                CREATE
                                <br /> TRADE
                                <br /> CONNECT
                                {/* Explore, Create &amp; <br className="block" />
                                <span className="text-themecolor">Sell NFTs</span> you want */}
                            </h1>
                            <h2 className="mt-4 text-white">NFT Trading Platform</h2>
                            <p className="text-2xl py-10 text-[#E7E7E9]">
                                Design, Buy and Sell digital art and more. Use our interactive
                                <span className="block xs:inline">
                                    social features and release your limitless imagination.
                                </span>
                                <span className="block xs:inline">Welcome to the start of something great!</span>
                            </p>
                            <div className="flex items-center justify-center gap-6 xs:block sm:justify-start">
                                <Link legacyBehavior href="https://www.certik.com/projects/metaruffy">
                                    <a target="_blanck">
                                        <Button
                                            className={`${
                                                !isAuthenticated && ''
                                            } rounded-full  bg-themecolor !text-[20px]  !text-darkgray whitespace-nowrap gold  xs:mt-4 xs:w-full !h-[56.75px] !px-6  flex items-center gap-4`}>
                                            <figure className="p-1 bg-white rounded-full">
                                                {' '}
                                                <Image
                                                    src="/assets/images/banr2.svg"
                                                    height={25}
                                                    width={25}
                                                    quality={50}
                                                />
                                            </figure>
                                            Certik Audit
                                        </Button>
                                    </a>
                                </Link>
                                {/* <Link legacyBehavior href="https://www.pinksale.finance/launchpad/0x9080892d77c0013FCd435cdd5b90C275d9b55998?chain=ETH">
                                    <a target="_blanck">
                                        <Button
                                            className={`${
                                                !isAuthenticated && ''
                                            } rounded-full  bg-themecolor !text-[20px]  !text-darkgray xs:mt-4 xs:w-full !h-[56.75px] !px-6   flex items-center gap-4`}>
                                            <Image src="/assets/images/banr1.svg" height={35} width={35} />
                                            Presale
                                        </Button>
                                    </a>
                                </Link> */}

                                <Link
                                    legacyBehavior
                                    href="https://metaruffy.io/wp-content/uploads/2022/09/MetaRuffy_Whitepaper_ETH_FINAL-1.pdf">
                                    <a target="_blanck" download={true}>
                                        <Button
                                            className={`${
                                                !isAuthenticated && ''
                                            } rounded-full  bg-themecolor !text-[20px] gold !text-darkgray  xs:mt-4 xs:w-full !h-[56.75px] !px-5  flex items-center gap-4`}>
                                            <Image src="/assets/images/logos/mr-logo.png" height={35} width={35} />
                                            Whitepaper
                                        </Button>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={undefined} />}
        </div>
    );
};

export default MainBanner;
