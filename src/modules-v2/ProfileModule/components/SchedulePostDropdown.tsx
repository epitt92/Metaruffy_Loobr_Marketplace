import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Popups from '../../../components/popup/poups';
import { useDispatch, useSelector } from 'react-redux';

import { deletePost } from '../../../redux/user/actions';
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function ScheduleDrodpdown({ id, setConfirmed, setId }: any) {
    const [popup, setPopup] = useState(false);
    const [close, setClose] = useState('');
    const [state, setState] = useState(-1);
    const [data, setData] = useState<string>(id);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const loading = useSelector((state: any) => state.user.postdelteloading);
    const checkblocked = (user: any, id: any) => {
        return user?.blockedBy?.includes(id) || user?.blockedUser?.includes(id);
    };
    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button>
                        <button
                            type="button"
                            className="pl-4 md:mt-2"
                            onClick={(e: any) => {
                                // e.stopPropagation();
                                if (!user) {
                                    setPopup(true);
                                    setState(1);
                                }
                            }}>
                            <div className="border border-[#43434C] hover:bg-[#252532] dropdown-bg-parent rounded-full p-1">
                                <svg
                                    className=" dropdown-bg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14C6.10457 14 7 13.1046 7 12Z"
                                        fill="#43434C"
                                    />
                                    <path
                                        d="M14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12Z"
                                        fill="#43434C"
                                    />
                                    <path
                                        d="M21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12Z"
                                        fill="#43434C"
                                    />
                                </svg>
                            </div>
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
                    <Menu.Items className="origin-top-right absolute right-0 pt-[5px]  z-10 pb-[5px]  w-56 rounded-md shadow-lg bg-[#1f1f2d] ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {/* <Link legacyBehavior href={`/feed/${id}`}> */}
                                <div className="cursor-pointer">
                                    <a
                                        className="flex items-center text-white pl-[15px] pr-[15px] pt-[7px] pb-[7px] text-base"
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            if (!loading) {
                                                setId(id);
                                                setPopup(true);
                                                setState(42);
                                                setData(id);
                                            }
                                        }}>
                                        <svg
                                            width="18"
                                            height="19"
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9.00156 0.375C9.75631 0.374894 10.4838 0.656935 11.0413 1.16575C11.5987 1.67456 11.9458 2.37338 12.0145 3.125H16.7016C16.9106 3.12506 17.1118 3.20447 17.2645 3.34717C17.4173 3.48987 17.5101 3.68523 17.5244 3.89377C17.5386 4.10231 17.4732 4.30848 17.3413 4.47063C17.2094 4.63278 17.0208 4.73881 16.8138 4.7673L16.7016 4.775H16.0603L14.6666 16.853C14.6045 17.3891 14.3475 17.8838 13.9445 18.2427C13.5415 18.6017 13.0206 18.8001 12.4809 18.8H5.52226C4.98254 18.8001 4.46163 18.6017 4.05862 18.2427C3.65561 17.8838 3.39863 17.3891 3.33656 16.853L1.94176 4.775H1.30156C1.1022 4.77499 0.909586 4.70279 0.759339 4.57176C0.609091 4.44072 0.511376 4.25971 0.484262 4.0622L0.476562 3.95C0.476571 3.75064 0.548769 3.55802 0.679806 3.40778C0.810843 3.25753 0.991853 3.15981 1.18936 3.1327L1.30156 3.125H5.98866C6.05728 2.37338 6.40439 1.67456 6.96184 1.16575C7.51929 0.656935 8.24682 0.374894 9.00156 0.375ZM7.35156 7.25C7.08206 7.25 6.85656 7.4205 6.81036 7.6449L6.80156 7.7318V14.4693L6.81036 14.5551C6.85656 14.7795 7.08206 14.95 7.35156 14.95C7.62106 14.95 7.84656 14.7795 7.89276 14.5551L7.90156 14.4682V7.7329L7.89276 7.6449C7.84656 7.4216 7.62106 7.25 7.35156 7.25ZM10.6516 7.25C10.3821 7.25 10.1566 7.4205 10.1104 7.6449L10.1016 7.7318V14.4693L10.1104 14.5551C10.1566 14.7795 10.3821 14.95 10.6516 14.95C10.9211 14.95 11.1466 14.7795 11.1928 14.5551L11.2016 14.4682V7.7329L11.1928 7.6449C11.1466 7.4216 10.9211 7.2511 10.6516 7.2511V7.25ZM9.00156 2.025C8.33606 2.025 7.78056 2.498 7.65406 3.125H10.3491C10.2215 2.498 9.66706 2.025 9.00156 2.025Z"
                                                fill="white"
                                            />
                                        </svg>

                                        <span className="pl-[14px] text-[16px] font-Proxima-SemiBold">Delete post</span>
                                    </a>
                                </div>
                                {/* </Link> */}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            {state && (
                <Popups
                    setConfirmed={setConfirmed}
                    show={popup}
                    hide={setPopup}
                    setPopup={setPopup}
                    state={state}
                    close={close}
                    singlefeed={false}
                    setstate={setState}
                    data={state == 42 || state == 33 || 46 ? data : undefined}
                />
            )}
        </div>
    );
}
