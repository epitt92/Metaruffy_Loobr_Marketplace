import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import Image from 'next/image';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

interface Iprops {
    data?: any;
    parentstyle?: string;
    className?: string;
    style?: string;
    onSelect?: Function | any;
    selected?: Array<boolean>;
    placeholder?: string;
    view?: boolean;
    sortByIcon?: boolean;
}
export default function MapFilter({
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
    const [filterShow, setFilterShow] = useState(view);
    return (
        <>
            <Listbox value={selected} onChange={onSelect}>
                {({ open }) => (
                    <>
                        <div className={` ${style} mt-1 relative`}>
                            <Listbox.Button
                                onClick={() => setFilterShow(filterShow ? false : true)}
                                className={`${className} bg-[#303035] h-full w-full bg-graydull flex items-center justify-between relative text-base font-SofiaPro -mt-1 rounded-md shadow-sm px-4  py-3 cursor-pointer focus:outline-none`}>
                                <div className="flex items-center gap-2">
                                    {/* {selected?.src && (
                                        <Image
                                            src={selected?.src}
                                            width={25}
                                            height={25}
                                            alt="logo"
                                            // transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        />
                                    )} */}

                                    <span
                                        className={`${
                                            view ? 'view ' : ' truncate text-secondary '
                                        } block  text-secondary`}>
                                        {'Filters'}
                                    </span>
                                </div>
                                <span className="inset-y-0 right-0 flex items-center pointer-events-none ">
                                    <i className="text-sm icon-arrow-down "></i>
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={filterShow}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0">
                                <Listbox.Options
                                    className={`absolute ${parentstyle} z-10 mt-2 w-full sm:min-w-[250px] AtOptioncolor shadow-lg p-2 rounded-2xl text-lg bg-[#14141F]`}>
                                    {data.map((person: any, idx: number) => (
                                        <Listbox.Option
                                            key={person?.name}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'text-secondary bg-graydull ' : 'text-white',
                                                    'cursor-pointer select-none relative py-1'
                                                )
                                            }
                                            value={person}>
                                            {({ active }) => (
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

                                                    <div
                                                        className={classNames(
                                                            selected && selected[person['value']]
                                                                ? ''
                                                                : 'font-normal  ',
                                                            'block truncate Atcheckbox w-full '
                                                        )}>
                                                        <input
                                                            id=""
                                                            checked={selected && selected[person['value']]}
                                                            type="checkbox"
                                                            readOnly
                                                            className={` `}
                                                            name="Background"
                                                        />
                                                        {person.name}
                                                        <span className="xs:!w-[16px] xs:!h-[16px] float-right"></span>
                                                    </div>
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
