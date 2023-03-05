import React, { useState } from 'react';
import Button from '../Button/Button';
import Input from '../input/Input';
import Link from 'next/link';
import Image from 'next/image';

function Makeanoffer({ setstate }: any) {
    const [show, setShow] = useState(false);
    let changebtn = () => {
        setShow(!show);
    };
    let changetext = () => {
        setShow(!show);
    };

    return (
        <div className="p-8 xs:w-full  w-[34.125rem]">
            <h4 className="text-2rem  text-white ">Make an Offer</h4>
            <p className="text-lg  text-[#D0D0D2] mt-2">
                You are about to place a bid for <span className=" font-Proxima-Bold "> #002 DeadFellaz</span> from{' '}
                <span className=" font-Proxima-Bold"> Herri Susanto.</span>
            </p>
            <p className="text-[#E7E7E9] mt-8">Place a bid</p>
            <div className="mt-2 relative " onClick={changebtn}>
                <Input
                    styles="border border-secondary"
                    className=" placeholder:!text-sm text-[#B0B0B0]"
                    placeholder="Enter Bid "
                />
                <div className=" absolute top-6 right-3">Loobr</div>
            </div>
            <div className="mt-10 flex justify-between">
                <p className="text-white">Your Balance</p>
                <p className="text-white">
                    3{' '}
                    <i className="inline-block align-top ml-2 ">
                        <Image src={'/assets/images/loobricon.svg'} width={25} height={25} alt="logo" />
                    </i>
                </p>
            </div>
            <div className="mt-3 flex justify-between">
                <p className="text-white">Service fee</p>
                <p className="text-white">
                    0.008{' '}
                    <i className="inline-block align-top ml-2 ">
                        <Image src={'/assets/images/loobricon.svg'} width={25} height={25} alt="logo" />
                    </i>
                </p>
            </div>

            <div className="border-b border-[#43434C] mt-5  text-center"></div>

            <div className=" flex justify-between mt-5">
                <p className="text-white text-lg">You will pay</p>
                <p className="text-[#D0D0D2] text-lg ">
                    0{' '}
                    <i className="inline-block align-top ml-2 ">
                        <Image src={'/assets/images/loobricon.svg'} width={25} height={25} alt="logo" />
                    </i>
                </p>
            </div>

            {show === false ? (
                <>
                    <Button
                        className="   text-xl  rounded-[3.125rem] text-white w-full mt-16 "
                        onClick={() => {
                            setstate(17);
                        }}>
                        Place a Bid
                    </Button>{' '}
                    <p></p>{' '}
                </>
            ) : (
                <>
                    {' '}
                    <Button
                        className="  rounded-[3.125rem]  text-base !bg-transparent sm:text-xl border border-[#43434C] text-white w-full mt-16 "
                        onClick={changetext}>
                        Add funds on
                        <span className="flex gap-2 ml-2">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 46 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M42.5686 37.5986L39.8902 38.2532L39.3359 38.6739L15.7072 35.4966H1.72949L6.7205 23.1431L14.8345 23.1916L16.7995 26.7574L23.2814 33.4862L22.4417 29.2964L28.2269 30.3249L39.3359 38.6739L30.5557 30.3249L29.114 26.3367L24.0425 13.9849C24.0425 13.9849 20.1457 7.08528 20.0652 7.00795C20.175 7.02234 29.114 6.97559 29.114 6.97559L30.746 13.6109L34.3449 26.3367L35.3272 29.7802L38.8125 33.8134L35.9768 29.4835L37.83 28.7049L38.7174 32.6304L38.7979 33.8134L42.5686 37.5986Z"
                                    fill="#F58C25"
                                />
                                <path
                                    d="M14.8344 23.1903L6.72042 23.1437L4.78658 21.1028L6.0069 20.2935L3.82058 19.1247L5.69038 18.6266L3.12354 17.0388L4.66035 16.3843L5.0409 14.016L9.30374 6.19755L15.0723 1.22559L20.0486 7.00493L24.0424 13.9675L14.8344 23.1887V23.1903Z"
                                    fill="#81491F"
                                />
                                <path
                                    d="M1.72949 35.4971H15.7219L19.542 40.5121C19.542 40.5121 10.0338 43.3317 5.26234 44.7648C4.04204 41.5714 2.88393 38.5341 1.72949 35.4971Z"
                                    fill="#E48027"
                                />
                                <path
                                    d="M39.3523 14.3272L40.4774 15.6039L39.6542 16.5714L40.794 17.3805L39.9706 18.4559L40.1608 20.1533L38.7503 21.804L30.7461 13.6116L43.5036 3.22168L39.3523 14.3272Z"
                                    fill="#81491F"
                                />
                                <path
                                    d="M39.3376 38.6738L39.385 41.7738L34.8369 44.0324L19.5271 40.526C19.5271 40.526 19.4155 40.605 19.5271 40.526C25.9453 39.92 39.3376 38.6738 39.3376 38.6738Z"
                                    fill="#D9C6B7"
                                />
                                <path
                                    d="M43.5035 3.22168L30.7462 13.6116L29.1143 6.97628L43.5035 3.22168Z"
                                    fill="#E48027"
                                />
                                <path
                                    d="M30.7461 13.6113L38.7338 21.8039L38.4009 26.0566L34.3448 26.337L30.7461 13.6113Z"
                                    fill="#E57F24"
                                />
                                <path
                                    d="M19.5273 40.5098L34.8351 44.0162L39.3834 41.7559L42.5064 41.4917L40.128 44.545L33.6788 45.1204L19.5273 40.5098Z"
                                    fill="#C7B7AB"
                                />
                                <path
                                    d="M19.5253 40.5118L15.7217 35.4949L23.2813 33.4863L19.5253 40.5118Z"
                                    fill="#D76F21"
                                />
                                <path
                                    d="M42.5061 41.4917C41.4596 41.5852 40.4296 41.6786 39.3831 41.7579L39.3354 38.6577L39.89 38.237L42.5684 37.5986C42.5684 37.5986 43.4721 38.2207 44.2478 38.6577C43.6312 39.654 43.0587 40.5727 42.5061 41.4917Z"
                                    fill="#2A2626"
                                />
                                <path
                                    d="M34.3428 26.3372L38.4008 26.0566L37.8463 28.7054L36.3095 26.8982L35.9766 29.4841L38.8123 33.8141L35.3272 29.7645L34.3447 26.3372H34.3428Z"
                                    fill="#D66F21"
                                />
                                <path
                                    d="M14.8345 23.1898L24.0426 13.9688L29.1141 26.3366L16.8012 26.7575L14.8345 23.1898Z"
                                    fill="#E47E25"
                                />
                                <path
                                    d="M19.5273 40.5118L23.2834 33.4863L39.3376 38.6741L19.5273 40.5118Z"
                                    fill="#E47F26"
                                />
                                <path
                                    d="M16.8013 26.7576L29.114 26.3369L28.2268 30.3253L26.152 27.1785L22.4436 29.2968L16.8013 26.7576Z"
                                    fill="#D66F21"
                                />
                                <path
                                    d="M28.2271 30.3253L29.1142 26.3369L30.5559 30.3253L39.3377 38.6743C39.3377 38.6743 30.7627 32.2404 28.2271 30.3253Z"
                                    fill="#E47F25"
                                />
                                <path
                                    d="M28.2273 30.3255L22.4424 29.297L26.1508 27.1787L28.2273 30.3255Z"
                                    fill="#32404E"
                                />
                                <path
                                    d="M22.4436 29.2961L23.2833 33.4859L16.8013 26.7588L22.4436 29.298V29.2961Z"
                                    fill="#E57F25"
                                />
                                <path
                                    d="M35.9771 29.4843L36.3099 26.8984L37.8467 28.7039L35.9771 29.4843Z"
                                    fill="#38424D"
                                />
                                <path
                                    d="M37.8467 28.7054L38.401 26.0566L38.9864 28.8762L38.7341 32.6309L37.8467 28.7054Z"
                                    fill="#E57F24"
                                />
                            </svg>

                            <p className=" font-Circular-Medium text-white">Metamask</p>
                        </span>
                    </Button>
                    <p className="text-center mt-8">Not enough funds</p>
                </>
            )}
        </div>
    );
}

export default Makeanoffer;
