import React, { useEffect } from "react";

const Passwordchangedone = ({ setstate }: any) => {
  useEffect(() => {
    setTimeout(() => {
      setstate();
    }, 2000);
  }, []);

  return (
    <div className="pt-14 pb-8 px-20 flex justify-center flex-col items-center sm:w-[450px] w-full ">
      <div className=" bg-themecolor  flex justify-center items-center h-[100px] w-[100px] rounded-full">
        <svg
          width="78"
          height="78"
          viewBox="0 0 78 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M78 39C78 60.5391 60.5391 78 39 78C17.4609 78 0 60.5391 0 39C0 17.4609 17.4609 0 39 0C60.5391 0 78 17.4609 78 39Z"
            fill="#F1C94A"
          />
          <path
            d="M35.9998 43.6714L48.9989 31L51 32.949L35.9998 47.5695L27 38.7975L28.9996 36.8484L35.9998 43.6714Z"
            fill="#14141F"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-base  font-Proxima-Regular text-white">
        Password Changed
      </h2>
      <h5 className="  font-Proxima-Regular mt-2 text-[#A1A1A5]">
        Password successfully reset
      </h5>
    </div>
  );
};

export default Passwordchangedone;
