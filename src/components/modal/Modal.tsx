import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface Iprops {
    className?: string;
    children: any;
    show: any;
    hide: Function;
    state: number;
    setPopup?: any;
    close?: string;
}
export default function Modal({ show, hide, close, children, className, setPopup, state }: Iprops) {
    const openStates: number[] = [/* 1,  */ 47, 72, 73];
    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-50  inset-0 overflow-auto at-sidebarwrapper scrollbarHide"
                onClose={() => {
                    hide(openStates.includes(state));
                }}
                // open={true}
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="false" />

                <div className=" flex items-center justify-center scrollbarHide at-sidebarwrapper  min-h-screen pt-4   px-4 pb-10  text-center sm:block sm:p-0 box-decoration-slice">
                    <Transition.Child>
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 0transition-opacity  " />
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen " aria-hidden="true">
                        &#8203;
                    </span>
                    <div
                        className={`${className} inline-block align-top sm:w-auto bg-[#14141F] mx-5 text-left  rounded-xl   shadow-xl transform transition-all sm:align-middle`}>
                        <div
                            className={`${
                                close == 'close' ? 'hidden' : ''
                            } absolute top-4  right-4 h-9 w-9  flex justify-center items-center  rounded-full`}>
                            <button
                                type="button"
                                className={`text-2xl hover:text-gray-500 focus:outline-none ${
                                    openStates.includes(state) && 'hidden'
                                }`}
                                onClick={() => {
                                    hide(false);
                                }}>
                                <span className="sr-only">Close</span>

                                <AiOutlineCloseCircle />
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
