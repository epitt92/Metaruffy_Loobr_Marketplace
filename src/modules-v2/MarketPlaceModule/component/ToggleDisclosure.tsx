import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";

interface Iprops {
  children: any;
  heading: string;
  charityDetail?: any;
  btnStyle?: any;
  iconStyle?: any;
  propertyicon?: any;
  historyicon?: any;
  bidsicon?: any;
  close?: boolean;
}

const ToggleDisclosure = ({
  children,
  heading,
  charityDetail,
  btnStyle,
  iconStyle,
  propertyicon,
  historyicon,
  bidsicon,
  close
}: Iprops) => {
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <Disclosure
        as="div"
        key=""
        className={`${charityDetail}  rounded-lg`}
        defaultOpen={!close}
        
      >
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`${btnStyle} w-full flex justify-between  items-center`}
            >
              {
                propertyicon ? <div className="flex gap-3 items-center">
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0976 8.83441L17.0945 14.8344C16.9579 15.0399 16.7725 15.2082 16.5549 15.3244C16.3373 15.4406 16.0943 15.5009 15.8476 15.5H1.25071C1.11563 15.5014 0.982799 15.4654 0.866961 15.3959C0.751123 15.3264 0.656801 15.2261 0.594459 15.1063C0.529296 14.9876 0.497503 14.8534 0.502455 14.718C0.507407 14.5827 0.548919 14.4512 0.622584 14.3375L4.85071 8.00004L0.622584 1.66254C0.548919 1.54888 0.507407 1.4174 0.502455 1.28204C0.497503 1.14669 0.529296 1.01253 0.594459 0.893789C0.656801 0.773944 0.751123 0.673711 0.866961 0.604208C0.982799 0.534705 1.11563 0.498649 1.25071 0.500039H15.8476C16.0943 0.499151 16.3373 0.559499 16.5549 0.67567C16.7725 0.791842 16.9579 0.960205 17.0945 1.16566L21.0976 7.16566C21.2628 7.41255 21.3511 7.70295 21.3511 8.00004C21.3511 8.29713 21.2628 8.58753 21.0976 8.83441Z" fill="#7D7D8E" />
                  </svg>
                  <h3 className=" text-[#7D7D8E] text-base"> {heading}</h3>
                </div> : bidsicon ? <div className="flex gap-3 items-center">
                  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.20421 6.27144L6.4235 0.117188L14.4038 4.63608L10.3934 8.24195L19.7375 13.5467L18.9054 15.0318L9.5613 9.72127L8.52114 15.0146L0.529297 10.4841L5.20421 6.27144ZM0.580643 16.7654H9.9478V18.4701H0.580643V16.7654Z" fill="#7D7D8E" />
                  </svg>
                  <h3 className=" text-[#7D7D8E] text-base"> {heading}</h3>
                </div> : historyicon ? <div className="flex gap-3 items-center">
                  <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9999 9.52195L17.648 3.0157C17.5655 3.00695 17.5099 2.99508 17.4537 2.99508C16.9774 2.99508 16.5005 2.99508 16.0243 2.99508C15.4499 2.98945 15.0168 2.57758 14.9943 2.02445C14.9893 1.89285 15.0106 1.76158 15.0571 1.63836C15.1036 1.51514 15.1742 1.40246 15.2649 1.30695C15.3556 1.21144 15.4645 1.13503 15.5851 1.08223C15.7057 1.02942 15.8357 1.00127 15.9674 0.999453C17.3187 0.981953 18.6701 0.981953 20.0218 0.999453C20.5905 1.00695 20.9868 1.43195 20.9899 1.99945C20.9974 3.3357 20.9974 4.67195 20.9899 6.0082C20.9838 6.26722 20.8768 6.51361 20.6916 6.69479C20.5064 6.87598 20.2577 6.97762 19.9986 6.97803C19.7395 6.97843 19.4906 6.87758 19.3048 6.69697C19.119 6.51637 19.0112 6.27032 19.0043 6.01133C18.993 5.54258 18.9962 5.07383 18.9924 4.60508C18.9924 4.60133 18.9799 4.59758 18.9487 4.5782C18.878 4.6582 18.8018 4.74195 18.7274 4.8282C16.7628 7.07029 14.7976 9.31487 12.8318 11.562C12.3318 12.1357 11.713 12.1488 11.1693 11.612C10.4524 10.9045 9.72804 10.2051 8.98617 9.48195C8.92367 9.5532 8.83054 9.65383 8.74054 9.75633C6.74262 12.0434 4.74575 14.3328 2.74992 16.6245C2.45429 16.9645 2.09741 17.1076 1.66304 16.9876C0.945539 16.7888 0.708664 15.9251 1.20929 15.3495C1.92616 14.5232 2.64679 13.7026 3.36929 12.8795C4.95929 11.0624 6.54825 9.24508 8.13617 7.42758C8.42679 7.09445 8.77054 6.90383 9.20929 7.0332C9.40831 7.09766 9.59001 7.20667 9.74054 7.35195C10.4418 8.00945 11.1274 8.68258 11.8187 9.35195C11.8749 9.40445 11.9305 9.45508 11.9999 9.52195Z" fill="#7D7D8E" />
                  </svg>
                  <h3 className=" text-[#7D7D8E] text-base"> {heading}</h3>
                </div> : <h3 className=" text-white text-base"> {heading}</h3>}
              <i
                className={classNames(
                  open
                    ? `rotate-0 ${iconStyle} `
                    : "'${iconStyle} -rotate-180 '",
                  "transform text-sm text-[#727279] transition duration-400 borders rounded-md  p-1.5 "
                )}
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 7L7 1.24225L13 7"
                    stroke="#727279"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
            </Disclosure.Button>
            <Disclosure.Panel as="dd" className="mt-4">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default ToggleDisclosure;
