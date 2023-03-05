import React from 'react';
import Button from '../Button/Button';
import Input from '../input/Input';
import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Acceptoffer = ({ setstate, state }: any) => {
    let [plan, setPlan] = useState('startup');
    const [show, setshow] = useState(false);

    let togglebar = () => {
        setshow(!show);
    };

    return (
        <div className="lg:w-[540px] m-auto rounded-lg px-8 ">
            <div className=" py-6 text-center">
                <h2 className=" xl:text-2rem text-white text-left">List Your NFT</h2>
            </div>
            <div className="py-6  ">
                <RadioGroup value={plan} onChange={setPlan} className="grid sm:grid-cols-3 gap-x-4">
                    <RadioGroup.Option value="startup">
                        {({ checked }) => (
                            <div
                                // onClick={togglebar}
                                onClick={() => {
                                    setstate(24);
                                }}
                                className={`${
                                    checked ? ' border border-[#F1C94A]  ' : ' border   border-[#2B2B35;] '
                                } flex flex-col items-center justify-center rounded-[18px] h-[132px] border cursor-pointer`}>
                                <i
                                    className={`icon-eye-show text-4xl mb-[1.625rem] ${
                                        checked ? 'text-[#F1C94A]' : 'text-[#A1A1A5]'
                                    }`}></i>

                                <p className={`block text-lg mb-1 ${checked ? 'text-[#F1C94A]' : 'text-[#A1A1A5]'}`}>
                                    Fixed Price
                                </p>
                            </div>
                        )}
                    </RadioGroup.Option>
                    <RadioGroup.Option className="sm:mt-0 mt-6" value="business">
                        {({ checked }) => (
                            <div
                                onClick={() => {
                                    setstate(27);
                                }}
                                className={`${
                                    checked ? 'border-themecolor border' : ' border border-[#2B2B35;] '
                                } flex flex-col items-center justify-center rounded-[18px] h-[132px] border cursor-pointer`}>
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M16.0006 0.639648C11.9269 0.639648 8.02002 2.25793 5.13946 5.13849C2.25891 8.01905 0.640625 11.9259 0.640625 15.9996C0.64073 18.0168 1.03813 20.0141 1.81014 21.8776C2.58215 23.7411 3.71365 25.4343 5.14003 26.8606C6.56641 28.2868 8.25975 29.4181 10.1233 30.1899C11.9869 30.9618 13.9843 31.359 16.0014 31.3588C18.0185 31.3587 20.0159 30.9613 21.8794 30.1893C23.7429 29.4173 25.4361 28.2858 26.8624 26.8594C28.2886 25.4331 29.4199 23.7397 30.1917 21.8761C30.9635 20.0125 31.3607 18.0152 31.3606 15.998C31.3606 7.51645 24.4822 0.639648 16.0006 0.639648ZM16.0006 28.158C14.4038 28.158 12.8225 27.8435 11.3472 27.2324C9.87187 26.6213 8.53137 25.7256 7.40221 24.5965C6.27305 23.4673 5.37735 22.1268 4.76625 20.6515C4.15515 19.1762 3.84062 17.5949 3.84062 15.998C3.84062 14.4012 4.15515 12.8199 4.76625 11.3446C5.37735 9.8693 6.27305 8.52879 7.40221 7.39963C8.53137 6.27047 9.87187 5.37477 11.3472 4.76367C12.8225 4.15258 14.4038 3.83805 16.0006 3.83805V15.9996L26.8678 10.566C27.7174 12.2513 28.1602 14.1123 28.1606 15.9996C28.1602 19.2244 26.8789 22.3169 24.5985 24.597C22.3181 26.8771 19.2254 28.158 16.0006 28.158Z"
                                        fill="#A1A1A5"
                                    />
                                </svg>

                                <p className={`block text-lg mt-6 ${checked ? ' text-themecolor' : 'text-[#A1A1A5]'}`}>
                                    Timed Auction
                                </p>
                            </div>
                        )}
                    </RadioGroup.Option>
                    <RadioGroup.Option value="end">
                        {({ checked }) => (
                            <div
                                onClick={() => {
                                    setstate(28);
                                }}
                                // onClick={togglebar}
                                className={`${
                                    checked ? ' border border-[#F1C94A]  ' : ' border   border-[#2B2B35;] '
                                } flex flex-col items-center justify-center rounded-[18px] h-[132px] border cursor-pointer`}>
                                {/* <i
                  className={`icon-eye-show text-4xl mb-[1.625rem] ${
                    checked ? "text-[#F1C94A]" : "text-[#A1A1A5]"
                  }`}
                ></i> */}
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M28.656 21.616H21.408C20.9837 21.616 20.5767 21.7846 20.2766 22.0846C19.9766 22.3847 19.808 22.7917 19.808 23.216C19.808 23.6403 19.9766 24.0473 20.2766 24.3474C20.5767 24.6474 20.9837 24.816 21.408 24.816H25.248C23.4831 26.6604 21.207 27.9349 18.7123 28.4758C16.2175 29.0168 13.6179 28.7994 11.2476 27.8516C8.87735 26.9038 6.84459 25.269 5.41055 23.1571C3.9765 21.0452 3.20668 18.5527 3.2 16C3.2 15.5757 3.03143 15.1687 2.73137 14.8686C2.43131 14.5686 2.02435 14.4 1.6 14.4C1.17565 14.4 0.768687 14.5686 0.468629 14.8686C0.168571 15.1687 0 15.5757 0 16C0.00845865 19.1245 0.931553 22.1781 2.65537 24.784C4.37918 27.39 6.82827 29.4342 9.70039 30.6644C12.5725 31.8945 15.742 32.2569 18.8176 31.7066C21.8933 31.1564 24.7405 29.7177 27.008 27.568V30.4C27.008 30.8243 27.1766 31.2313 27.4766 31.5314C27.7767 31.8314 28.1837 32 28.608 32C29.0323 32 29.4393 31.8314 29.7394 31.5314C30.0394 31.2313 30.208 30.8243 30.208 30.4V23.2C30.2041 22.7866 30.0403 22.3908 29.7509 22.0955C29.4616 21.8002 29.0692 21.6284 28.656 21.616ZM16 0C11.8982 0.0116995 7.95758 1.59826 4.992 4.432V1.6C4.992 1.17565 4.82343 0.768687 4.52337 0.468629C4.22331 0.168571 3.81635 0 3.392 0C2.96765 0 2.56069 0.168571 2.26063 0.468629C1.96057 0.768687 1.792 1.17565 1.792 1.6V8.8C1.792 9.22435 1.96057 9.63131 2.26063 9.93137C2.56069 10.2314 2.96765 10.4 3.392 10.4H10.592C11.0163 10.4 11.4233 10.2314 11.7234 9.93137C12.0234 9.63131 12.192 9.22435 12.192 8.8C12.192 8.37565 12.0234 7.96869 11.7234 7.66863C11.4233 7.36857 11.0163 7.2 10.592 7.2H6.752C8.51595 5.35659 10.7905 4.0824 13.2838 3.54097C15.7771 2.99955 18.3753 3.21559 20.745 4.16138C23.1146 5.10717 25.1475 6.73954 26.5828 8.84897C28.018 10.9584 28.7901 13.4486 28.8 16C28.8 16.4243 28.9686 16.8313 29.2686 17.1314C29.5687 17.4314 29.9757 17.6 30.4 17.6C30.8243 17.6 31.2313 17.4314 31.5314 17.1314C31.8314 16.8313 32 16.4243 32 16C32 13.8989 31.5861 11.8183 30.7821 9.87706C29.978 7.93586 28.7994 6.17203 27.3137 4.68629C25.828 3.20055 24.0641 2.022 22.1229 1.21793C20.1817 0.413852 18.1012 0 16 0Z"
                                        fill="#A1A1A5"
                                    />
                                </svg>

                                <p className={`block text-lg  mt-4 ${checked ? 'text-[#F1C94A]' : 'text-[#A1A1A5]'}`}>
                                    Accept Offers
                                </p>
                            </div>
                        )}
                    </RadioGroup.Option>
                </RadioGroup>
                <div>
                    <p className=" font-Circular-Medium text-lg text-white mt-6">Set Price Minimum Offer*</p>
                    <div className="mt-2 relative ">
                        <Input
                            styles="border border-[#2B2B35;]"
                            className=" placeholder:!text-sm"
                            placeholder="0.00 "
                        />
                        <div className=" absolute top-2 right-2">
                            <div className="flex items-center mt-4 gap-2">
                                <Image src="/assets/images/mrlogo.png" height={26} width={26} alt="" />
                                <p className=" font-Proxima-Regular">Loobr</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Link legacyBehavior href="#">
                    <a>
                        <Button
                            className={`w-full rounded-[3.125rem] mt-[2.75rem] 
                `}>
                            List on Marketplace
                        </Button>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default Acceptoffer;
