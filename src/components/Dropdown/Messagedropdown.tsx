import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { deletePost } from '../../redux/user/actions';
import Popups from '../popup/poups';
import { DoDecrypt, DoEncrypt } from '../../services/aes.service';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}
interface IProps {
    data: any;

    setMessage: Function;
    setWholeMessage: Function;
}
export default function Messagedrodpdown({ data, setMessage, setWholeMessage }: IProps) {
    const [popup, setPopup] = useState(false);
    const [close, setClose] = useState('');
    const [state, setState] = useState(-1);
    // const [data, setData] = useState<any>(message);
    // useEffect(() => {
    //     if (data) {
    //         setData(message);
    //     }
    // }, [message]);
    return (
        <div>
            <Menu as="div" className="static inline-block text-left ">
                <div>
                    <Menu.Button>
                        <div className="mt-1 mr-2 AtReplyMoreIcon">
                            <svg
                                width="4"
                                height="16"
                                viewBox="0 0 4 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle
                                    cx="1.99971"
                                    cy="1.9998"
                                    r="1.99971"
                                    transform="rotate(-90 1.99971 1.9998)"
                                    fill="#89898F"
                                    className=""
                                />
                                <circle
                                    cx="1.99971"
                                    cy="7.99931"
                                    r="1.99971"
                                    transform="rotate(-90 1.99971 7.99931)"
                                    fill="#89898F"
                                />
                                <circle
                                    cx="1.99971"
                                    cy="13.9988"
                                    r="1.99971"
                                    transform="rotate(-90 1.99971 13.9988)"
                                    fill="#89898F"
                                />
                            </svg>
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
                    <Menu.Items className="  allafter absolute triangle-down         pt-[5px]  -top-[90px] right-[calc(100%-50%)] !z-[2]     pb-[5px]  w-40 rounded-md shadow-lg bg-[#1f1f2d] ring-1 ring-black ring-opacity-5 focus:outline-none ">
                        <div className="py-1">
                            {data?.type == 'text' && (
                                <Menu.Item>
                                    {/* <Link legacyBehavior href={`/feed/${id}`}> */}
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setMessage(DoDecrypt(data?.body));
                                            setWholeMessage(data);
                                        }}>
                                        <a className="flex items-center text-white pl-[15px] pr-[15px] pt-[7px] pb-[7px] hover:bg-[#363640] text-base">
                                            <svg
                                                width="20"
                                                height="19"
                                                viewBox="0 0 20 19"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M18.7505 17.4395C19.1645 17.4395 19.5005 17.7755 19.5005 18.1895C19.5005 18.6035 19.1645 18.9395 18.7505 18.9395H11.4975C11.0835 18.9395 10.7475 18.6035 10.7475 18.1895C10.7475 17.7755 11.0835 17.4395 11.4975 17.4395H18.7505ZM14.1163 0.653643C14.1663 0.692643 15.8393 1.99264 15.8393 1.99264C16.4473 2.35464 16.9223 3.00164 17.1023 3.76764C17.2813 4.52564 17.1513 5.30764 16.7343 5.96864C16.7315 5.97305 16.7287 5.97741 16.7191 5.99037L16.7115 6.00038C16.6439 6.08958 16.3496 6.46164 14.8646 8.32223C14.8508 8.34661 14.8351 8.36945 14.8181 8.39164C14.793 8.42435 14.7658 8.45442 14.7367 8.4818C14.6354 8.60934 14.5284 8.74335 14.4159 8.88424L14.188 9.1697C13.7177 9.75868 13.1599 10.4571 12.4981 11.2855L12.1584 11.7106C10.8807 13.3097 9.24443 15.3572 7.14827 17.9796C6.68927 18.5516 6.00127 18.8846 5.26227 18.8936L1.62327 18.9396H1.61327C1.26627 18.9396 0.964274 18.7016 0.883274 18.3626L0.0642743 14.8916C-0.104726 14.1726 0.0632743 13.4306 0.524274 12.8546L9.94427 1.07264C9.94827 1.06864 9.95127 1.06364 9.95527 1.05964C10.9883 -0.175357 12.8563 -0.357357 14.1163 0.653643ZM8.894 4.787L1.69527 13.7916C1.52427 14.0056 1.46127 14.2816 1.52427 14.5466L2.20527 17.4316L5.24427 17.3936C5.53327 17.3906 5.80027 17.2616 5.97727 17.0416C6.88876 15.9012 8.03433 14.4679 9.21213 12.994L9.62883 12.4726L10.0462 11.9502C11.1508 10.5679 12.2421 9.20207 13.1551 8.05886L8.894 4.787ZM11.1103 2.01664L9.831 3.615L14.0918 6.88593C14.9119 5.8587 15.4514 5.18214 15.5013 5.11764C15.6653 4.85164 15.7293 4.47564 15.6433 4.11364C15.5553 3.74264 15.3243 3.42764 14.9913 3.22664C14.9203 3.17764 13.2353 1.86964 13.1833 1.82864C12.5493 1.32064 11.6243 1.40864 11.1103 2.01664Z"
                                                    fill="white"
                                                />
                                            </svg>

                                            <span className="pl-[14px] text-[16px]  font-Proxima-SemiBold">Edit</span>
                                        </a>
                                    </div>
                                    {/* </Link> */}
                                </Menu.Item>
                            )}

                            <Menu.Item>
                                <button
                                    type="button"
                                    className="flex items-center pl-[15px] pr-[15px] hover:bg-[#363640] w-full  pt-[7px] pb-[7px] text-base"
                                    onClick={() => {
                                        setPopup(true);
                                        setState(57);
                                    }}>
                                    <svg
                                        width="19"
                                        height="20"
                                        viewBox="0 0 19 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.3846 6.71994C16.7976 6.75394 17.1056 7.11494 17.0726 7.52794C17.0666 7.59594 16.5246 14.3069 16.2126 17.1219C16.0186 18.8689 14.8646 19.9319 13.1226 19.9639C11.7896 19.9869 10.5036 19.9999 9.2466 19.9999C7.8916 19.9999 6.5706 19.9849 5.2636 19.9579C3.5916 19.9249 2.4346 18.8409 2.2456 17.1289C1.9306 14.2889 1.3916 7.59494 1.3866 7.52794C1.3526 7.11494 1.6606 6.75294 2.0736 6.71994C2.4806 6.70894 2.8486 6.99494 2.8816 7.40694C2.88479 7.45035 3.10514 10.184 3.34526 12.8887L3.39349 13.4284C3.51443 14.7728 3.63703 16.0646 3.7366 16.9639C3.8436 17.9369 4.3686 18.4389 5.2946 18.4579C7.7946 18.5109 10.3456 18.5139 13.0956 18.4639C14.0796 18.4449 14.6116 17.9529 14.7216 16.9569C15.0316 14.1629 15.5716 7.47494 15.5776 7.40694C15.6106 6.99494 15.9756 6.70694 16.3846 6.71994ZM11.3454 0.000244141C12.2634 0.000244141 13.0704 0.619244 13.3074 1.50624L13.5614 2.76724C13.6435 3.18062 14.0062 3.4825 14.4263 3.48913L17.708 3.48924C18.122 3.48924 18.458 3.82524 18.458 4.23924C18.458 4.65324 18.122 4.98924 17.708 4.98924L14.4556 4.98909C14.4505 4.98919 14.4455 4.98924 14.4404 4.98924L14.416 4.98824L4.04162 4.98912C4.03355 4.9892 4.02548 4.98924 4.0174 4.98924L4.002 4.98824L0.75 4.98924C0.336 4.98924 0 4.65324 0 4.23924C0 3.82524 0.336 3.48924 0.75 3.48924L4.031 3.48824L4.13202 3.48185C4.50831 3.43303 4.82104 3.14724 4.8974 2.76724L5.1404 1.55124C5.3874 0.619244 6.1944 0.000244141 7.1124 0.000244141H11.3454ZM11.3454 1.50024H7.1124C6.8724 1.50024 6.6614 1.66124 6.6004 1.89224L6.3674 3.06224C6.33779 3.21044 6.29467 3.35326 6.23948 3.48951H12.2186C12.1634 3.35326 12.1201 3.21044 12.0904 3.06224L11.8474 1.84624C11.7964 1.66124 11.5854 1.50024 11.3454 1.50024Z"
                                            fill="white"
                                        />
                                    </svg>

                                    <span className="pl-[14px] text-[16px] text-white font-Proxima-SemiBold">
                                        Remove
                                    </span>
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={data} />}
        </div>
    );
}
