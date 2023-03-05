import clsx from "clsx";
import React from "react";

interface IProps {
  className?: string;
}

const Search = ({ className }: IProps) => {
  return (
    <form>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className={clsx(className, "block w-full rounded-md border border-[#5C5C63] bg-[#2B2B35] px-4 py-2.5 pl-10 text-white  outline-none placeholder:text-[#7D7D8E] disabled:cursor-not-allowed disabled:bg-[#e9ecef")}
          placeholder="Search"
          required
        />
      </div>
    </form>
  );
};

export default Search;
