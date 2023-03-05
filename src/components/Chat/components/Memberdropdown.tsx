import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useSelector, useDispatch } from 'react-redux';
import { connectRoom, removeRoom } from '../../../redux/messages/actions';
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function Memberdropdown({ otherUser, roomId, setData, data, id }: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const loadingRemoving = useSelector((state: any) => state.chat.removeUserLoading);
    const conectRoom = () => {
        if (user && user.userId) {
            dispatch(
                connectRoom({
                    recievedBy: otherUser,
                    type: 'PRIVATE'
                })
            );
        }
    };
    const removeuser = () => {
        if (user && user.userId) {
            dispatch(
                removeRoom(
                    {
                        otherUser: otherUser,
                        roomId: roomId
                    },
                    setData
                )
            );
        }
    };
    return (
        <>
            <Menu as="div" className="  left-0 top-0 inline-block text-left md:w-auto mr-2">
                <Menu.Button className="rounded-lg flex items-center justify-between h-12 p-4 text-base gap-2 rotate-90">
                    <svg width="6" height="24" viewBox="0 0 6 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5.25 21C5.25 21.445 5.11804 21.88 4.87081 22.25C4.62357 22.62 4.27217 22.9084 3.86104 23.0787C3.44991 23.249 2.99751 23.2936 2.56105 23.2068C2.12459 23.12 1.72368 22.9057 1.40901 22.591C1.09434 22.2763 0.880051 21.8754 0.793234 21.439C0.706417 21.0025 0.750975 20.5501 0.921272 20.139C1.09157 19.7278 1.37996 19.3764 1.74997 19.1292C2.11998 18.882 2.55499 18.75 3 18.75C3.59674 18.75 4.16903 18.9871 4.59099 19.409C5.01295 19.831 5.25 20.4033 5.25 21ZM3 5.25C3.44501 5.25 3.88002 5.11804 4.25004 4.87081C4.62005 4.62357 4.90843 4.27217 5.07873 3.86104C5.24903 3.4499 5.29359 2.99751 5.20677 2.56105C5.11995 2.12459 4.90566 1.72368 4.59099 1.40901C4.27632 1.09434 3.87541 0.880051 3.43895 0.793234C3.0025 0.706417 2.5501 0.750975 2.13896 0.921272C1.72783 1.09157 1.37643 1.37996 1.12919 1.74997C0.881962 2.11998 0.750001 2.55499 0.750001 3C0.750001 3.59674 0.987055 4.16903 1.40901 4.59099C1.83097 5.01295 2.40326 5.25 3 5.25ZM3 9.75C2.55499 9.75 2.11998 9.88196 1.74997 10.1292C1.37996 10.3764 1.09157 10.7278 0.921272 11.139C0.750975 11.5501 0.706417 12.0025 0.793234 12.439C0.880051 12.8754 1.09434 13.2763 1.40901 13.591C1.72368 13.9057 2.12459 14.12 2.56105 14.2068C2.99751 14.2936 3.44991 14.249 3.86104 14.0787C4.27217 13.9084 4.62357 13.62 4.87081 13.25C5.11804 12.88 5.25 12.445 5.25 12C5.25 11.4033 5.01295 10.831 4.59099 10.409C4.16903 9.98705 3.59674 9.75 3 9.75Z"
                            fill="white"
                        />
                    </svg>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                        className={`${
                            data.length - 1 == id ? '-top-20' : 'top-7'
                        } w-[172px] z-20 p-4 xs:p-3 xs:w-[120px] right-0   bg-[#1F1F2D] rounded-lg absolute  mt-1`}>
                        <div className="space-y-2  ">
                            <Menu.Item>
                                {({ active }: any) => (
                                    <a
                                        className={classNames(
                                            active ? ' flex' : 'flex gap-3',
                                            `${
                                                !loadingRemoving
                                                    ? 'block text-base '
                                                    : ' cursor-default block text-base '
                                            }`
                                        )}>
                                        <p
                                            className="text-white font-Proxima-SemiBold xs:hidden block  text-base"
                                            onClick={() => {
                                                !loadingRemoving && conectRoom();
                                            }}>
                                            Message
                                        </p>
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }: any) => (
                                    <a
                                        className={classNames(
                                            active ? ' flex' : 'flex gap-3',
                                            `${
                                                !loadingRemoving
                                                    ? 'block text-base '
                                                    : ' cursor-default block text-base '
                                            }`
                                        )}>
                                        <p
                                            className="text-white font-Proxima-SemiBold text-base"
                                            onClick={() => {
                                                !loadingRemoving && removeuser();
                                            }}>
                                            Remove Member
                                        </p>
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}
