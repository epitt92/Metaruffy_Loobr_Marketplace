import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { deleteRoom } from '../redux/messages/actions';
import { useSelector, useDispatch } from 'react-redux';
import Popups from './popup/poups';
import { setEnvironmentData } from 'worker_threads';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

export default function Deletedropdown({ roomId, setConfirmed, group, data1, setData, closep, setClosep }: any) {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.auth.user);
    const [state, setstate] = useState(-1);
    const [data, setData1] = useState(data1);
    const [popup, setPopup] = useState(false);
    const deleteroom = () => {
        if (user && user.userId) {
            dispatch(deleteRoom({ roomId: roomId, userId: user?.userId }, setConfirmed));
        }
    };

    useEffect(() => {
        if (closep) {
            setstate(-1);
            setPopup(false);
            setClosep(false);
        }
    }, [closep]);

    return (
        <>
            <Menu as="div" className="top-0 left-0 inline-block mr-2 text-left md:w-auto">
                <Menu.Button className="flex items-center justify-between h-12 gap-2 p-4 text-base rotate-90 rounded-lg AtChatMoreIcon">
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
                    <Menu.Items className="w-[23rem]  z-20 p-4    -right-[3.25rem]   top-[3.8125rem] bg-black2 absolute  ">
                        <div className="pt-2 space-y-3 ">
                            {group && (
                                <Menu.Item>
                                    {({ active }: any) => (
                                        <a
                                            // href="#"
                                            className={classNames(active ? ' flex' : 'flex gap-3', 'block text-base ')}>
                                            <div
                                                className="flex gap-3"
                                                onClick={() => {
                                                    setPopup(true);
                                                    setstate(50);
                                                    setData1(data1);
                                                }}>
                                                <svg
                                                    width="22"
                                                    height="18"
                                                    viewBox="0 0 22 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M9.625 17.25C9.625 17.25 8.25 17.25 8.25 15.875C8.25 14.5 9.625 10.375 15.125 10.375C20.625 10.375 22 14.5 22 15.875C22 17.25 20.625 17.25 20.625 17.25H9.625ZM15.125 9C16.219 9 17.2682 8.5654 18.0418 7.79182C18.8154 7.01823 19.25 5.96902 19.25 4.875C19.25 3.78098 18.8154 2.73177 18.0418 1.95818C17.2682 1.1846 16.219 0.75 15.125 0.75C14.031 0.75 12.9818 1.1846 12.2082 1.95818C11.4346 2.73177 11 3.78098 11 4.875C11 5.96902 11.4346 7.01823 12.2082 7.79182C12.9818 8.5654 14.031 9 15.125 9Z"
                                                        fill="white"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.172 17.2496C6.96816 16.8204 6.86651 16.3497 6.875 15.8746C6.875 14.0115 7.81 12.0934 9.537 10.7596C8.675 10.494 7.77693 10.3641 6.875 10.3746C1.375 10.3746 0 14.4996 0 15.8746C0 17.2496 1.375 17.2496 1.375 17.2496H7.172Z"
                                                        fill="white"
                                                    />
                                                    <path
                                                        d="M6.1875 9C7.09918 9 7.97352 8.63784 8.61818 7.99318C9.26284 7.34852 9.625 6.47418 9.625 5.5625C9.625 4.65082 9.26284 3.77648 8.61818 3.13182C7.97352 2.48716 7.09918 2.125 6.1875 2.125C5.27582 2.125 4.40148 2.48716 3.75682 3.13182C3.11216 3.77648 2.75 4.65082 2.75 5.5625C2.75 6.47418 3.11216 7.34852 3.75682 7.99318C4.40148 8.63784 5.27582 9 6.1875 9Z"
                                                        fill="white"
                                                    />
                                                </svg>

                                                <p className="text-base text-white font-Proxima-SemiBold">
                                                    View Members
                                                </p>
                                            </div>
                                        </a>
                                    )}
                                </Menu.Item>
                            )}
                            <Menu.Item>
                                {({ active }: any) => (
                                    <a
                                        // href="#"
                                        className={classNames(active ? ' flex' : 'flex gap-3', 'block text-base ')}>
                                        <div className="flex gap-3" onClick={deleteroom}>
                                            <svg
                                                width="22"
                                                height="22"
                                                viewBox="0 0 22 22"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M11.0016 1.375C11.7563 1.37489 12.4838 1.65694 13.0413 2.16575C13.5987 2.67456 13.9458 3.37338 14.0145 4.125H18.7016C18.9106 4.12506 19.1118 4.20447 19.2645 4.34717C19.4173 4.48987 19.5101 4.68523 19.5244 4.89377C19.5386 5.10231 19.4732 5.30848 19.3413 5.47063C19.2094 5.63278 19.0208 5.73881 18.8138 5.7673L18.7016 5.775H18.0603L16.6666 17.853C16.6045 18.3891 16.3475 18.8838 15.9445 19.2427C15.5415 19.6017 15.0206 19.8001 14.4809 19.8H7.52226C6.98254 19.8001 6.46163 19.6017 6.05862 19.2427C5.65561 18.8838 5.39863 18.3891 5.33656 17.853L3.94176 5.775H3.30156C3.1022 5.77499 2.90959 5.70279 2.75934 5.57176C2.60909 5.44072 2.51138 5.25971 2.48426 5.0622L2.47656 4.95C2.47657 4.75064 2.54877 4.55802 2.67981 4.40778C2.81084 4.25753 2.99185 4.15981 3.18936 4.1327L3.30156 4.125H7.98866C8.05728 3.37338 8.40439 2.67456 8.96184 2.16575C9.51929 1.65694 10.2468 1.37489 11.0016 1.375ZM9.35156 8.25C9.08206 8.25 8.85656 8.4205 8.81036 8.6449L8.80156 8.7318V15.4693L8.81036 15.5551C8.85656 15.7795 9.08206 15.95 9.35156 15.95C9.62106 15.95 9.84656 15.7795 9.89276 15.5551L9.90156 15.4682V8.7329L9.89276 8.6449C9.84656 8.4216 9.62106 8.25 9.35156 8.25ZM12.6516 8.25C12.3821 8.25 12.1566 8.4205 12.1104 8.6449L12.1016 8.7318V15.4693L12.1104 15.5551C12.1566 15.7795 12.3821 15.95 12.6516 15.95C12.9211 15.95 13.1466 15.7795 13.1928 15.5551L13.2016 15.4682V8.7329L13.1928 8.6449C13.1466 8.4216 12.9211 8.2511 12.6516 8.2511V8.25ZM11.0016 3.025C10.3361 3.025 9.78056 3.498 9.65406 4.125H12.3491C12.2215 3.498 11.6671 3.025 11.0016 3.025Z"
                                                    fill="#FF2323"
                                                />
                                            </svg>
                                            <p className="text-[#ff3e3e] font-Proxima-SemiBold text-base">
                                                {group
                                                    ? data1?.createdBy == user.userId
                                                        ? 'Delete'
                                                        : 'Leave Group'
                                                    : 'Delete'}
                                            </p>
                                        </div>
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <Popups show={popup} hide={setPopup} state={state} setstate={setstate} data={data} setData={setData} />
        </>
    );
}
