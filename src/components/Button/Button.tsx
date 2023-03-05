import React from "react";
import { ImSpinner9 } from "react-icons/im";

interface Iprops {
  className?: string;
  children: any;
  type?: any;
  onClick?: any;
  disabled?: boolean;
  isLoading?: boolean;
}
const Button = ({
  children,
  className,
  type,
  disabled,
  isLoading,
  ...rest
}: Iprops) => {
  return (
    <>
      <button
        className={` inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 rounded-lg bg-themecolor relative text-black2  , ${
          isLoading &&
          "relative !text-transparent hover:!text-transparent !cursor-wait !transition-none"
        }, ${className ? className : ""}`}
        type={type ? type : "button"}
        disabled={disabled ? true : false}
        {...rest}
      >
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
            <ImSpinner9 className="animate-spin text-2xl" />
          </div>
        )}
        {children}
      </button>
    </>
  );
};

export default Button;
