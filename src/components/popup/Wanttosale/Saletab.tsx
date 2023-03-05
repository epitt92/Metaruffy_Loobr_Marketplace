import React, { useState } from "react";
import Input from "../../input/Input";


const tabs = [
  { name: "Fixed price", current: true },
  { name: "Timed auction", current: true },
  { name: "Accept Offers", current: true },
];
const Saletab = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  return (
    <>
      <div className="" aria-label="Tabs">
        <div className="border border-t-[#43434C] mt-6  border-transparent  flex flex-wrap items-center gap-8  ">
          {tabs.map((tab, i) => (
            <a
              key={i}
              className={`  py-2 ml-6 cursor-pointer  font-Proxima-SemiBold  !text-sm whitespace-nowrap text-[#A1A1A5]
                ${
                  i === selectedTabIdx &&
                  " border-t-[4px]   border-themecolor !text-white "
                }
                `}
              onClick={() => setSelectedTabIdx(i)}
            >
              {tab.name}
            </a>
          ))}
        </div>
      </div>
      {selectedTabIdx === 0 && (
        <div className="mt-8 mb-6 px-6">
          <p>If you want to sell this NFT please set the price below</p>
          <Input
            placeholder="Enter Price"
            className=" placeholder:text-[#A1A1A5] text-base font-Proxima-Light"
            styles="rounded-[6.25rem] !px-6 !py-4 mt-8 border border-[#2B2B35]"
          />
        </div>
      )}
      {selectedTabIdx === 1 && (
        <div className="mt-8 mb-6 px-6 !text-left">
          <label className="!text-left text-white font-Proxima-Light">
            Set Minimum Bid
          </label>
          <Input
            placeholder="Enter Price"
            className=" placeholder:text-[#A1A1A5] text-base font-Proxima-Light"
            styles="rounded-[6.25rem] !px-6 !py-4 mt-3 border border-[#2B2B35]"
          />
          <div className=" xs:block flex gap-6  mt-8">
            <div>
            <label className="!text-left text-white font-Proxima-Light">
            Start Date
          </label>
          <Input
            placeholder="Date"
            className=" placeholder:text-[#A1A1A5] text-base font-Proxima-Light"
            styles="rounded-[6.25rem] !px-6 !py-4 mt-3 border border-[#2B2B35]"
          />
            </div>
            <div className="mt-0 xs:mt-4">
            <label className="!text-left text-white font-Proxima-Light">
            Expire Date
          </label>
          <Input
            placeholder="Date"
            className=" placeholder:text-[#A1A1A5] text-base font-Proxima-Light"
            styles="rounded-[6.25rem] !px-6 !py-4 mt-3 border border-[#2B2B35]"
          />
            </div>

          </div>
        </div>
      )}
        {selectedTabIdx === 2 && (
        <div className="mt-8 mb-6  flex justify-center">
          <p className="w-[17.25rem] text-center">Are you sure you want to accept offer against this NFT?!</p>
         
        </div>
      )}
    </>
  );
};
export default Saletab;
