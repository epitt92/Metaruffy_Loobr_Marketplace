import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Button from '../Button/Button';
import Popups from '../popup/poups';
import useMetaMask from '../../hooks/useMetaMask';
import { useSelector } from 'react-redux';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function CollectionEdit({ collection }: any) {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(0);
    const { account }: any = useMetaMask();
    const user = useSelector((state: any) => state.auth.user);
    console.log(collection, 'edit');

    return (
        <>
            {(account === collection?.owner || collection?.user == user?.userId) && (
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="   cursor-pointer   ">
                            <div className="bg-[#2B2B35] h-[2.5rem] w-[2.5rem] p-2 flex justify-center items-center rounded-lg cursor-pointer">
                                <i className=" icon-more text-3xl text-themecolor"></i>
                            </div>
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
                        <Menu.Items className="absolute right-0 z-10 mt-8 w-[15rem] px-2 py-2 origin-top-right divide-y rounded-md drop-shadow  bg-[#14141F] border border-[#313146] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            // href="#"
                                            className={classNames(
                                                active ? ' text-[#818182]' : 'text-[#818182]',
                                                'group flex items-center  cursor-pointer  text-sm py-2'
                                            )}
                                            onClick={() => {
                                                setPopup(true);
                                                setState(43);
                                            }}>
                                            <svg
                                                className="mr-2"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.90979 0.400269C9.78477 0.275288 9.61523 0.205078 9.43846 0.205078C9.26168 0.205078 9.09214 0.275288 8.96712 0.400269L8.02446 1.3436L10.8525 4.1716L11.7951 3.22894C11.9201 3.10392 11.9903 2.93438 11.9903 2.7576C11.9903 2.58083 11.9201 2.41129 11.7951 2.28627L9.90979 0.400269ZM9.90979 5.11494L7.08112 2.28627L1.14779 8.2196C1.02317 8.34454 0.953162 8.5138 0.953125 8.69027V10.5763C0.953125 10.7531 1.02336 10.9226 1.14839 11.0477C1.27341 11.1727 1.44298 11.2429 1.61979 11.2429H3.50512C3.68192 11.2429 3.85146 11.1726 3.97646 11.0476L9.90979 5.11427V5.11494Z"
                                                    fill="#818182"
                                                />
                                            </svg>
                                            Edit
                                        </a>
                                    )}
                                </Menu.Item>
                                {/* <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'text-[#818182]' : 'text-[#818182]',
                                            'grou text-left text-sm      '
                                        )}>
                                        <Button className="!px-2 w-full !text-[#818182] mt-2 !bg-[#2B2B35]  !justify-start gap-2  ">
                                            {' '}
                                            <svg
                                                width="11"
                                                height="12"
                                                viewBox="0 0 11 12"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M6.6026 2.00033L6.4426 1.20033C6.3826 0.893659 6.10927 0.666992 5.78927 0.666992H1.0026C0.635938 0.666992 0.335938 0.966992 0.335938 1.33366V11.3337C0.335938 11.7003 0.635938 12.0003 1.0026 12.0003C1.36927 12.0003 1.66927 11.7003 1.66927 11.3337V7.33366H5.4026L5.5626 8.13366C5.6226 8.44699 5.89594 8.66699 6.21594 8.66699H9.66927C10.0359 8.66699 10.3359 8.36699 10.3359 8.00033V2.66699C10.3359 2.30033 10.0359 2.00033 9.66927 2.00033H6.6026Z"
                                                    fill="#818182"
                                                />
                                            </svg>
                                            Report
                                        </Button>
                                    </a>
                                )}
                            </Menu.Item> */}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            )}
            <Popups
                show={popup}
                hide={setPopup}
                state={state}
                setstate={setState}
                data={{ collection, collectionId: collection?._id }}
            />
        </>
    );
}
