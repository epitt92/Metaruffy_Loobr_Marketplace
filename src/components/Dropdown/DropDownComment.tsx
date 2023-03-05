import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import Popups from '../popup/poups';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../../redux/user/actions';
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function Drodpdown({ comment, setConfirmed }: any) {
    const [popup, setPopup] = useState(false);
    const [close, setClose] = useState('');
    const [state, setState] = useState(-1);
    const [data, setData] = useState<string>(comment?._id);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const loading = useSelector((state: any) => state.user.postdelteloading);
    const checkblocked = (otherUser: any) => {
        return otherUser?.blockedBy?.includes(user?.userId) || otherUser?.blockedUser?.includes(user?.userId);
    };
    return (
        <>
            <Menu as="div" className="relative  inline-block text-left">
                <div>
                    {!checkblocked(comment?.user) && (
                        <Menu.Button>
                            <button className="pl-4 " type="button">
                              <div className='border border-[#43434C] hover:bg-[#252532] dropdown-bg-parent rounded-full p-1'>
                                <svg
                                 className=' dropdown-bg'
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
                    )}
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="origin-top-right absolute right-0 pt-[5px]   z-10 pb-[5px] w-56 rounded-md shadow-lg bg-[#1f1f2d] ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {user && user.userId && user?.userId === comment?.user?._id && (
                                <Menu.Item>
                                    {/* <Link legacyBehavior href={`/feed/${id}`}> */}
                                    <div className="cursor-pointer">
                                        <a
                                            className="flex items-center text-white pl-[15px] pr-[15px] pt-[7px] pb-[7px] text-base"
                                            onClick={() => {
                                                if (!loading) {
                                                    setPopup(true);
                                                    setState(48);
                                                    setData(comment?._id);
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

                                            <span className="pl-[14px] text-[16px] font-Proxima-SemiBold">Delete</span>
                                        </a>
                                    </div>
                                    {/* </Link> */}
                                </Menu.Item>
                            )}
                            {user && user.userId && user.userId !== comment?.user?._id && (
                                <Menu.Item>
                                    <button
                                        type="button"
                                        className="flex items-center pl-[15px] pr-[15px] text-[#ff2323] pt-[7px] pb-[7px] text-base"
                                        onClick={() => {
                                            if (user && user.userId) {
                                                setPopup(true);
                                                setState(49);
                                                setData(comment?._id);
                                            } else {
                                                setPopup(true);
                                                setState(1);
                                            }
                                        }}>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 16 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.7268 0.10625C15.8107 0.163297 15.8796 0.240462 15.9272 0.330933C15.9749 0.421403 15.9999 0.522398 16 0.625V10C16 10.1248 15.9631 10.2468 15.8943 10.3501C15.8254 10.4535 15.7276 10.5336 15.6135 10.58L15.3846 10L15.6135 10.58L15.6098 10.5813L15.6025 10.585L15.5742 10.5963C15.4123 10.6616 15.2494 10.7241 15.0855 10.7837C14.7606 10.9025 14.3089 11.0625 13.7969 11.2213C12.7926 11.5363 11.4843 11.875 10.4615 11.875C9.41908 11.875 8.55631 11.525 7.80554 11.2188L7.77108 11.2063C6.99077 10.8875 6.32615 10.625 5.53846 10.625C4.67692 10.625 3.52246 10.9125 2.53908 11.2213C2.09878 11.3606 1.66249 11.5128 1.23077 11.6775V19.375C1.23077 19.5408 1.16593 19.6997 1.05053 19.8169C0.93512 19.9342 0.778595 20 0.615385 20C0.452174 20 0.295649 19.9342 0.180242 19.8169C0.0648351 19.6997 0 19.5408 0 19.375V0.625C0 0.45924 0.0648351 0.300269 0.180242 0.183058C0.295649 0.065848 0.452174 0 0.615385 0C0.778595 0 0.93512 0.065848 1.05053 0.183058C1.16593 0.300269 1.23077 0.45924 1.23077 0.625V0.9775C1.50892 0.87875 1.84123 0.765 2.20308 0.6525C3.20738 0.34 4.51692 0 5.53846 0C6.57231 0 7.41415 0.34625 8.14892 0.64875L8.20185 0.67125C8.96738 0.985 9.63446 1.25 10.4615 1.25C11.3231 1.25 12.4775 0.9625 13.4609 0.65375C14.0213 0.476015 14.5751 0.27755 15.1212 0.05875L15.1446 0.05L15.1495 0.0475H15.1508"
                                                fill="#FF2323"
                                            />
                                        </svg>

                                        <span className="pl-[14px] text-[16px] font-Proxima-SemiBold">Report</span>
                                    </button>
                                </Menu.Item>
                            )}
                            {user && user.userId && user.userId !== comment?.user?._id && (
                                <Menu.Item>
                                    <button
                                        type="button"
                                        className="flex items-center pl-[15px] pr-[15px] text-[#ff2323] pt-[7px] pb-[7px] text-base"
                                        onClick={() => {
                                            if (user && user.userId) {
                                                setData(comment?.user?._id);
                                                setPopup(true);
                                                setState(46);
                                            } else {
                                                setPopup(true);
                                                setState(1);
                                            }
                                        }}>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                stroke="white"
                                                strokeWidth="2"
                                            />
                                            <path d="M5 19L19 5" stroke="white" strokeWidth="2" />
                                        </svg>

                                        <span className="pl-[14px] text-[16px] text-white font-Proxima-SemiBold">
                                            Block User
                                        </span>
                                    </button>
                                </Menu.Item>
                            )}
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
                    setstate={setState}
                    data={data}
                />
            )}
        </>
    );
}
