import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Image from 'next/image';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}
interface Iprops {
    data?: any;
    parentstyle?: string;
    className?: string;
    style?: string;
    onSelect?: Function | any;
    selected?: any;
    placeholder?: string;
    view?: boolean;
    sortByIcon?: boolean;
}
export default function Select({
    data,
    style,
    className,
    parentstyle,
    onSelect,
    selected,
    placeholder,
    view,
    sortByIcon = false
}: Iprops) {
    return (
        <>
            <Listbox value={selected} onChange={onSelect}>
                {({ open }) => (
                    <>
                        <div className={` w-[155px] mt-1 relative `}>
                            <Listbox.Button
                                className={`${className}  w-full flex items-center justify-between relative text-[12px] -mt-1  border  border-borderColor rounded-md shadow-sm px-2  py-1 cursor-pointer focus:outline-none`}>
                                <div className="flex items-center gap-2">
                                    {selected?.src && (
                                        <Image
                                            src={selected?.src}
                                            width={25}
                                            height={25}
                                            alt="logo"
                                            // transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        />
                                    )}

                                    {sortByIcon && (
                                        <svg
                                            width="16"
                                            height="15"
                                            viewBox="0 0 16 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M14.4688 6.42774H8.0411C7.44975 6.42774 6.96981 6.90768 6.96981 7.49904C6.96981 8.09039 7.44975 8.57033 8.0411 8.57033H14.4688C15.0602 8.57033 15.5401 8.09039 15.5401 7.49904C15.5401 6.90768 15.0602 6.42774 14.4688 6.42774ZM14.4688 3.21387H8.0411C7.44975 3.21387 6.96981 3.69381 6.96981 4.28516C6.96981 4.87652 7.44975 5.35645 8.0411 5.35645H14.4688C15.0602 5.35645 15.5401 4.87652 15.5401 4.28516C15.5401 3.69381 15.0602 3.21387 14.4688 3.21387ZM14.4688 9.64162H11.255C10.6636 9.64162 10.1837 10.1216 10.1837 10.7129C10.1837 11.3043 10.6636 11.7842 11.255 11.7842H14.4688C15.0602 11.7842 15.5401 11.3043 15.5401 10.7129C15.5401 10.1216 15.0602 9.64162 14.4688 9.64162ZM8.4091 9.80392C8.19912 9.59287 8.0411 9.64162 8.0411 9.64162H4.82723V0H3.75594V9.64162H0.542066C0.542066 9.64162 0.367453 9.59287 0.15748 9.80392C-0.0524932 10.015 -0.0524932 10.3567 0.15748 10.5678L3.87592 14.8465C3.98841 14.959 4.13679 15.0072 4.28302 14.9991C4.42979 15.0072 4.57815 14.959 4.69064 14.8465L8.4091 10.5678C8.61907 10.3567 8.61907 10.015 8.4091 9.80392ZM14.4688 12.8555H8.0411C7.44975 12.8555 6.96981 13.3354 6.96981 13.9268C6.96981 14.5181 7.44975 14.9981 8.0411 14.9981H14.4688C15.0602 14.9981 15.5401 14.5181 15.5401 13.9268C15.5401 13.3354 15.0602 12.8555 14.4688 12.8555ZM8.0411 2.14258H14.4688C15.0602 2.14258 15.5401 1.66264 15.5401 1.07129C15.5401 0.479938 15.0602 0 14.4688 0H8.0411C7.44975 0 6.96981 0.479938 6.96981 1.07129C6.96981 1.66264 7.44975 2.14258 8.0411 2.14258Z"
                                                fill="#5C5C63"
                                            />
                                        </svg>
                                    )}

                                    <span
                                        className={`${
                                            view ? 'view ' : ' truncate text-secondary '
                                        } block  text-secondary`}>
                                        {selected?.name || placeholder}
                                    </span>
                                </div>
                                <span className="inset-y-0 right-0 flex items-center pointer-events-none ">
                                    <i className="text-sm icon-arrow-down "></i>
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0">
                                <Listbox.Options
                                    className={`absolute ${parentstyle}  z-10 mt-2 w-full sm:min-w-[155px]  border border-borderColor shadow-lg p-2 rounded-md text-[12px] bg-[#14141F]`}>
                                    {data.map((person: any) => (
                                        <Listbox.Option
                                            key={person?.name}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'text-[#8b8b90]' : 'text-secondary',
                                                    'cursor-pointer select-none relative '
                                                )
                                            }
                                            value={person}>
                                            {({ selected, active }) => (
                                                <div className="flex items-center gap-2">
                                                    {person?.src && (
                                                        <Image
                                                            src={person?.src}
                                                            width={25}
                                                            height={25}
                                                            alt="logo"
                                                            // transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                        />
                                                    )}

                                                    <span
                                                        className={classNames(
                                                            selected ? '' : 'font-normal  ',
                                                            'block truncate'
                                                        )}>
                                                        {person.name}
                                                    </span>
                                                </div>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </>
    );
}
