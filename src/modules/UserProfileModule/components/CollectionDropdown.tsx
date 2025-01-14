import { Fragment } from "react";
import { Menu, Switch, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Popups from "../../../components/popup/poups";
// import Button from "../Button/Button";



function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Profiledropdown() {
  const [popup, setPopup] = useState(false);
  const [state, setState] = useState(-1);
  const [btns, showbtn] = useState(false);

  return (
    <div className="absolute top-6 right-6">
      <Menu as="div" className="relative inline-block text-left   ">
        <div>
          <Menu.Button className=" border-gray-600">
            <div className="rounded-full w-[54px] h-[55px] leading-[48px] bg-[#2B2B35] flex justify-center items-center">
             
              <svg width="20" height="7" viewBox="0 0 20 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 0.75C1.48579 0.75 0.25 1.98579 0.25 3.5H1.75C1.75 2.81421 2.31421 2.25 3 2.25V0.75ZM0.25 3.5C0.25 5.01421 1.48579 6.25 3 6.25V4.75C2.31421 4.75 1.75 4.18579 1.75 3.5H0.25ZM3 6.25C4.51421 6.25 5.75 5.01421 5.75 3.5H4.25C4.25 4.18579 3.68579 4.75 3 4.75V6.25ZM5.75 3.5C5.75 1.98579 4.51421 0.75 3 0.75V2.25C3.68579 2.25 4.25 2.81421 4.25 3.5H5.75ZM17 0.75C15.4858 0.75 14.25 1.98579 14.25 3.5H15.75C15.75 2.81421 16.3142 2.25 17 2.25V0.75ZM14.25 3.5C14.25 5.01421 15.4858 6.25 17 6.25V4.75C16.3142 4.75 15.75 4.18579 15.75 3.5H14.25ZM17 6.25C18.5142 6.25 19.75 5.01421 19.75 3.5H18.25C18.25 4.18579 17.6858 4.75 17 4.75V6.25ZM19.75 3.5C19.75 1.98579 18.5142 0.75 17 0.75V2.25C17.6858 2.25 18.25 2.81421 18.25 3.5H19.75ZM10 0.75C8.48579 0.75 7.25 1.98579 7.25 3.5H8.75C8.75 2.81421 9.31421 2.25 10 2.25V0.75ZM7.25 3.5C7.25 5.01421 8.48579 6.25 10 6.25V4.75C9.31421 4.75 8.75 4.18579 8.75 3.5H7.25ZM10 6.25C11.5142 6.25 12.75 5.01421 12.75 3.5H11.25C11.25 4.18579 10.6858 4.75 10 4.75V6.25ZM12.75 3.5C12.75 1.98579 11.5142 0.75 10 0.75V2.25C10.6858 2.25 11.25 2.81421 11.25 3.5H12.75Z" fill="#A1A1A5"/>
</svg>

             
            </div>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-50 mt-2  absolute right-0 w-[15.25rem] rounded-lg shadow-[0px 0px 50px rgba(0, 0, 0, 0.15)] px-4 py-5 bg-[#2B2B35]  divide-y divide-gray-100 focus:outline-none">
            <div className="!border-0">
              <Menu.Item>
                {({ active }) => (
                  <Link legacyBehavior href="/">
                    <a
                      className={classNames(
                        active ? " !text-themecolor" : "!text-[#FFFFFF]",
                        " text-sm flex w-full items-center mb-3"
                      )}
                    >
                     
                      <h6 className="ml-3 text-basic font-Circular-Book">
                        Edit
                      </h6>
                    </a>
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link legacyBehavior href="/accountsettings">
                    <a
                      className={classNames(
                        active ? " !text-themecolor" : "!text-[#FFFFFF]",
                        "text-sm  flex w-full items-center"
                      )}
                    >
                      
                      <h6 className="ml-3 text-basic font-Circular-Book">
                       Delete
                      </h6>
                    </a>
                  </Link>
                )}
              </Menu.Item>
            
              
             

             
            </div>
           
          </Menu.Items>
        </Transition>
      </Menu>
      {state && (
        <Popups
          show={popup}
          hide={setPopup}
          state={state}
          setstate={setState}
        />
      )}
    </div>
  );
}
