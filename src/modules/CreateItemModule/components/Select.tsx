import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
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
}
export default function Select({ data, style, className, parentstyle, onSelect, selected }: Iprops) {
    return (
        <>
            <Listbox value={selected} onChange={onSelect}>
                {({ open }) => (
                    <>
                        <div className={` ${style} mt-1 relative w-full`}>
                            <Listbox.Button
                                className={`${className}  w-full bg-graydull flex items-center gap-3 relative text-base font-SofiaPro -mt-1  border  !border-[#29303A] min-h-[50px] rounded-xl shadow-sm px-4  py-4 cursor-pointer focus:outline-none`}>
                                <i>{selected?.tagname}</i>
                                <span className="block truncate text-secondary">{selected?.name}</span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0">
                                <Listbox.Options
                                    className={`absolute ${parentstyle} z-10 mt-2 w-full sm:min-w-[250px] AtOptioncolor shadow-lg p-5 rounded-2xl text-lg bg-[#14141F]`}>
                                    {data?.map((person: any, i: number) => (
                                        <Listbox.Option
                                            disabled={!(i == 0 || i == 1)}
                                            key={person.id}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'text-secondary bg-graydull ' : 'text-white',
                                                    'cursor-pointer select-none relative py-[8px] flex items-center gap-3'
                                                )
                                            }
                                            value={person}>
                                            {({ selected, active }) => (
                                                <>
                                                    <i>{person.tagname}</i>
                                                    <span
                                                        className={classNames(
                                                            selected ? '' : 'font-normal  ',
                                                            'block truncate'
                                                        )}>
                                                        {person.name}
                                                    </span>
                                                </>
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
