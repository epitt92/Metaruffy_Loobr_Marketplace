import clsx from "clsx";
import React from "react";

interface Iprops {
  label: string;
  className?: any;
  type?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
}

const FormCheck = ({ label, className, type, disabled, id, name }: Iprops) => {
  return (
    <div className={clsx(className, "form-check")}>
      <input
        type={type ? type : "checkbox"}
        className={clsx(type == "radio" && "rounded-full", "form-check-input")}
        name={name}
        id={`default-${id}`}
        disabled={disabled}
      />
      <label htmlFor={`default-${id}`} className="form-check-label">
        {label}
      </label>
    </div>
  );
};

export default FormCheck;
