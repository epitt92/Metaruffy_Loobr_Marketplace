/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Sortdropdown() {
  return (
    <Menu
      as="div"
      className="relative sm:w-[13.75rem] h-[3.5rem] w-full inline-block"
    >
      <Menu.Button className="inline-flex px-5 py-4 items-center sm:justify-around justify-between  !w-full  sm:w-[13.75rem] h-[3.5rem] text-left rounded-full border-2 border-[#2B2B35] shadow-sm py-4 bg-transparent text-base text-[#A1A1A5] ">
          <span className="ml-3 text-base">Sort by</span>
          <ChevronDownIcon className="-mr-1  h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" absolute z-50 right-0 top-10 border-t-transparent border  border-lightgray !w-full sm:w-[14.375rem] rounded-b-lg shadow-lg bg-white ">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-black2" : "text-gray-700",
                    "block px-4 py-2 text-base !text-black2 font-Circular-Book "
                  )}
                >
                  Price: Low to High
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-base !text-black2 font-Circular-Book "
                  )}
                >
                  Price: High to Low
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-base !text-black2 font-Circular-Book "
                  )}
                >
                  Recently Added
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-base !text-black2 font-Circular-Book "
                  )}
                >
                  Auction Ending Soon
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
