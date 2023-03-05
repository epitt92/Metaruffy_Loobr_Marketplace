import React from "react";
import { SearchIcon } from "@heroicons/react/solid";

interface Iprops {
  placeholder: string;
  className?: string;
  resposiveClass?: string;
  hide?: any;
  onChange?: any;
  value?: any;
}

const Search = ({
  placeholder,
  className,
  resposiveClass,
  hide,
  onChange,
  value,
}: Iprops) => {
  return (
    <div className={resposiveClass}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          {/* <SearchIcon
            className={`${hide && "hidden"} h-5 w-5  text-gray-400`}
            aria-hidden="true"
          /> */}
          <div className=" cursor-pointer">
            
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L17 17M20 10.5C20 15.7467 15.7467 20 10.5 20C5.25329 20 1 15.7467 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </div>
        </div>
        <input
          value={value}
          onChange={onChange}
          autoComplete="off"
          id="search"
          name="search"
          className={`block  text-white focus:border-themecolor  pl-10  pr-3 py-3 font-archivo-medium  rounded-md  placeholder-[#A1A1A5] focus:outline-none focus:placeholder-gray-400  sm:text-base border border-[#383957] ${className}`}
          placeholder={placeholder}
          type="search"
        />
      </div>
    </div>
  );
};

export default Search;
