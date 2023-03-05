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
    landNums: any;
}
export default function FilterComponent({
    data,
    style,
    className,
    parentstyle,
    onSelect,
    selected,
    placeholder,
    view,
    sortByIcon = false,
    landNums
}: Iprops) {
    const isInFilters = (item: any) => {
        return selected.filter((ele: any) => ele.id === item.id).length;
    };
    const [filterShow, setFilterShow] = useState(view);
    return (
        <>
            <Listbox value={selected} onChange={onSelect}>
                {({ open }) => (
                    <>
                        <div className={` ${style} mt-1 relative w-full`}>
                            <Listbox.Button
                                onClick={() => setFilterShow(filterShow ? false : true)}
                                className={`${className}  w-full bg-graydull flex items-center justify-between relative text-base font-SofiaPro -mt-1  border  !border-[#29303A rounded-md shadow-sm px-4  py-4 cursor-pointer focus:outline-none`}>
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
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3 9L7 5L11 9M7 5V19M21 15L17 19L13 15M17 19V5"
                                                stroke="#B0B0B0"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}

                                    <span
                                        className={`${
                                            view ? 'view ' : ' truncate text-secondary '
                                        } block  text-secondary`}>
                                        {selected?.name || 'Select Island'}
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
                                    className={`absolute ${parentstyle} z-10 mt-2 w-full sm:min-w-[250px] AtOptioncolor shadow-lg p-5 rounded-2xl text-lg bg-[#14141F]`}>
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

                                                    <div
                                                        className={classNames(
                                                            isInFilters(person) ? '' : 'font-normal  ',
                                                            'w-full block truncate Atcheckbox '
                                                        )}>
                                                        <input
                                                            id=""
                                                            checked={isInFilters(person)}
                                                            type="checkbox"
                                                            readOnly
                                                            className={` `}
                                                            name="Background"
                                                        />
                                                        {person.name} {`: (${landNums[idx]}) `}
                                                        <span className="float-right"></span>
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
