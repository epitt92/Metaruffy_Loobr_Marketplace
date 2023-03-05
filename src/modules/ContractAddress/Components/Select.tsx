import { Fragment, useState } from 'react';
import Image from 'next/image';

import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

const data = [
    {
        name: 'Binance',
        // src: "/assets/images/bsc.png",
        tagname: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                    fill="#F0B90B"></path>
                <path
                    d="M7.52616 12.0002L5.69016 13.849L3.84141 12.0002L5.69016 10.1515L7.52616 12.0002ZM12.0014 7.52498L15.1634 10.687L17.0122 8.83823L13.8502 5.68898L12.0014 3.84023L7.00341 8.83823L8.85216 10.687L12.0014 7.52498ZM18.3127 10.1515L16.4767 12.0002L18.3254 13.849L20.1614 12.0002L18.3127 10.1515ZM12.0014 16.4755L8.83941 13.3135L7.00341 15.1622L12.0014 20.1602L17.0122 15.1495L15.1634 13.3135L12.0014 16.4755ZM12.0014 13.849L13.8502 12.0002L12.0014 10.1515L10.1527 12.0002L12.0014 13.849Z"
                    fill="white"></path>
            </svg>
        )
    }
    // {
    //   name: "Polygon",
    //   src: "/assets/images/blockchainlogos/polygon.svg",
    // },
    // {
    //   name: "Solana",
    //   src: "/assets/images/blockchainlogos/solana.svg",
    // },
];

export default function SelectComponent() {
    const [selected, setSelected] = useState(data[0]);

    return (
        <div className="w-72">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative">
                    <Listbox.Button
                        className="relative w-full [14.12rem] h-[3.75rem] flex items-center text-white  rounded-lg bg-transparent border border-[#2B2B35] py-5 
                           px-4 text-left focus:outline-none text-base">
                        <span className=" truncate flex items-center gap-3 ">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                                    fill="#F0B90B"></path>
                                <path
                                    d="M7.52616 12.0002L5.69016 13.849L3.84141 12.0002L5.69016 10.1515L7.52616 12.0002ZM12.0014 7.52498L15.1634 10.687L17.0122 8.83823L13.8502 5.68898L12.0014 3.84023L7.00341 8.83823L8.85216 10.687L12.0014 7.52498ZM18.3127 10.1515L16.4767 12.0002L18.3254 13.849L20.1614 12.0002L18.3127 10.1515ZM12.0014 16.4755L8.83941 13.3135L7.00341 15.1622L12.0014 20.1602L17.0122 15.1495L15.1634 13.3135L12.0014 16.4755ZM12.0014 13.849L13.8502 12.0002L12.0014 10.1515L10.1527 12.0002L12.0014 13.849Z"
                                    fill="white"></path>
                            </svg>
                            {selected.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-1/2 right-0 flex items-center pr-3">
                            {/* <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" /> */}
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Listbox.Options
                            className="absolute ">
                            {data.map((item, Idx) => (
                                <Listbox.Option
                                    key={Idx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 px-4 ${
                                            active ? 'bg-transparent' : 'text-white'
                                        }`
                                    }
                                    value={item}>
                                    {({ selected }) => (
                                     ""
                                        // <div className="flex gap-2">
                                        //     {item.tagname}
                                        //     <span
                                        //         className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                                        //         {item.name}
                                        //     </span>
                                        // </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
