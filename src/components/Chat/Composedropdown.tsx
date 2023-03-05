import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
interface IProps {
    responsive?: boolean;
    setGroup: Function;
}
const ComposeDropdown = ({ responsive, setGroup }: IProps) => {
    return (
        <div
            onClick={(e: any) => {
                e.stopPropagation();
            }}
            className="absolute top-5 right-5">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button>
                        <button
                            className={`bg-themecolor text-[#20242a] ${
                                responsive ? 'bottom-44 right-12' : 'bottom-[36px] right-6'
                            } fixed rounded-full  h-[3.75rem] w-[3.75rem] flex items-center justify-center text-[14px] font-Proxima-SemiBold shadow-[0_0_30px_0_rgba(241,207,74,0.5)`}
                            type="button">
                            <div className="border border-black rounded-full p-2">
                                <svg
                                    className=" "
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 20V12M12 12V4M12 12H20M12 12H4"
                                        stroke="#14141F"
                                        stroke-width="2"
                                        stroke-linecap="round"
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
                    <Menu.Items
                        className={`origin-top-right fixed  ${
                            responsive ? 'bottom-[200px]' : 'bottom-[105px]'
                        }   right-8 pt-[5px]  z-10  focus:outline-none`}>
                        <div className="">
                            <Menu.Item>
                                <div
                                    className={`
                       
                     flex gap-4  flex-col `}>
                                    <div
                                        className="h-[41px] w-[140px] bg-themecolor cursor-pointer rounded-[24px] flex gap-2  justify-center items-center "
                                        onClick={() => {
                                            setGroup(2);
                                        }}>
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 32 32"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M22.5 22.5L28.5 28.5"
                                                stroke="#14141F"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M15 24.5C20.2467 24.5 24.5 20.2467 24.5 15C24.5 9.75329 20.2467 5.5 15 5.5C9.75329 5.5 5.5 9.75329 5.5 15C5.5 20.2467 9.75329 24.5 15 24.5Z"
                                                stroke="#14141F"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <p className="text-[#14141F] font-Proxima-SemiBold text-base">Search User</p>
                                    </div>

                                    <div
                                        className="h-[41px] w-[140px] cursor-pointer   bg-themecolor rounded-[24px] flex gap-2  items-center justify-center "
                                        onClick={() => {
                                            setGroup(3);
                                        }}>
                                        <svg
                                            width="19"
                                            height="19"
                                            viewBox="0 0 19 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M18.2083 8.70833C17.7713 8.70833 17.4167 9.063 17.4167 9.5C17.4167 13.8653 13.8653 17.4167 9.5 17.4167C5.13475 17.4167 1.58333 13.8653 1.58333 9.5C1.58333 5.13475 5.13475 1.58333 9.5 1.58333C11.6252 1.58333 13.6202 2.41379 15.1181 3.92192C15.4256 4.23225 15.9271 4.23423 16.2375 3.92588C16.5478 3.61792 16.5494 3.11679 16.2414 2.80646C14.4444 0.996708 12.05 0 9.5 0C4.26154 0 0 4.26154 0 9.5C0 14.7385 4.26154 19 9.5 19C14.7385 19 19 14.7385 19 9.5C19 9.063 18.6453 8.70833 18.2083 8.70833Z"
                                                fill="#20242A"
                                            />
                                            <path
                                                d="M12.668 8.70866H10.293V6.33366C10.293 5.89666 9.9383 5.54199 9.5013 5.54199C9.0643 5.54199 8.70964 5.89666 8.70964 6.33366V8.70866H6.33464C5.89764 8.70866 5.54297 9.06333 5.54297 9.50033C5.54297 9.93733 5.89764 10.292 6.33464 10.292H8.70964V12.667C8.70964 13.104 9.0643 13.4587 9.5013 13.4587C9.9383 13.4587 10.293 13.104 10.293 12.667V10.292H12.668C13.105 10.292 13.4596 9.93733 13.4596 9.50033C13.4596 9.06333 13.105 8.70866 12.668 8.70866Z"
                                                fill="#20242A"
                                            />
                                        </svg>{' '}
                                        <p
                                            className="text-[#14141F] font-Proxima-SemiBold text-base" /*  onClick={handleCreate} */
                                        >
                                            New Group
                                        </p>
                                    </div>
                                </div>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
};

export default ComposeDropdown;
