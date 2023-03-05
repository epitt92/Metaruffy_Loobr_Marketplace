import { clsx } from "clsx";
import InputError from "./InputError";

interface SsProps {
  sm: string;
  lg: string;
  md: string;
}

interface Iprops {
  placeholder: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: string;
  spanClass?: string;
  name?: string;
  rest?: any;
  register?: any;
  value?: any;
  onChange?: Function;
  max?: any;
  min?: any;
  step?: any;
  prefix?: any;
  pattern?: any;
  title?: string;
  disabled?: boolean;
  error?: any;
  autoFocus?: boolean;
}

const sizeStyles: SsProps = {
  sm: "form-control-sm",
  md: "form-control-md",
  lg: "form-control-lg",
};

const Input = ({
  placeholder,
  size = "md",
  className,
  value,
  onChange,
  type,
  register,
  max,
  min,
  step,
  pattern,
  title,
  disabled,
  error,
  autoFocus,
  ...rest
}: Iprops) => {
  return (
    <>
      <input
        type={type ? type : "text"}
        className={clsx(className, sizeStyles[size], "form-control")}
        pattern={pattern}
        max={max}
        step={step && step}
        title={title}
        min={min}
        value={value}
        onChange={onChange}
        {...(register !== undefined && { ...register(rest.name) })}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
      {error && <InputError error={error} />}
    </>
  );
};

export default Input;
