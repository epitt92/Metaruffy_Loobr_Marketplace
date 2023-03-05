import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

type Props = {
    tokenId: string;
    setState: Function;
    setPopup: Function;
};

const NftDropdown = ({ tokenId, setState, setPopup }: Props) => {
    return (
        <div onClick={(e: any) => { e.stopPropagation() }} className="absolute top-5 right-5">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button>
                        <button type="button" className="pl-4 md:mt-2">
                            <svg
                                width="38"
                                height="38"
                                viewBox="0 0 38 38"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="19" cy="19" r="19" fill="black" fillOpacity="0.6" />
                                <path
                                    d="M19 17C17.9 17 17 17.9 17 19C17 20.1 17.9 21 19 21C20.1 21 21 20.1 21 19C21 17.9 20.1 17 19 17ZM19 11C17.9 11 17 11.9 17 13C17 14.1 17.9 15 19 15C20.1 15 21 14.1 21 13C21 11.9 20.1 11 19 11ZM19 23C17.9 23 17 23.9 17 25C17 26.1 17.9 27 19 27C20.1 27 21 26.1 21 25C21 23.9 20.1 23 19 23Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="origin-top-right absolute right-0 pt-[5px]  z-10   w-[160px] rounded-[15px] shadow-lg bg-[#1f1f2d] ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="">
                            <Menu.Item>
                                {/* <Link legacyBehavior href={`/feed/${id}`}> */}
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setPopup(true);
                                        setState(61);
                                    }}>
                                    <a className="flex items-center text-white pl-[15px] pr-[15px] pt-[7px] pb-[7px] text-base">
                                        Transfer NFT
                                    </a>
                                </div>
                                {/* </Link> */}
                            </Menu.Item>
                            <Menu.Item>
                                <button
                                    onClick={() => {
                                        setPopup(true);
                                        setState(63);
                                    }}
                                    type="button"
                                    className="flex items-center pl-[15px] font-Proxima-SemiBold pr-[15px] text-[#ff2323] mb-3 text-lg">
                                    Burn NFT
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default NftDropdown;
