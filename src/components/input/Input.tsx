import { useEffect } from 'react';

interface Iprops {
    placeholder: string;
    className?: string;
    id?: string;
    type?: string;
    icon?: string;
    plusIcon?: any;
    styles?: string;
    onchange?: Function | any;
    onKeyDown?: Function | any;
    onBlur?: Function | any;
    onIconClick?: Function;
    value?: string | number;
    name?: string;
    svgicon?: any;
    svgIconName?: any;
    error?: boolean;
    helperText?: String;
    view?: boolean;
    floatingLabel?: any;
    labelname?: string;
    readonly?: any;
    disabled?: any;
    ref?: any;
    inputRef?: any;
    autoFocus?: boolean;
    onFocus?: any;
    pattern?: any;
    maxLength?: number;
}

const Input = ({
    placeholder,
    className,
    type,
    id,
    plusIcon,
    onchange,
    onBlur,
    name,
    icon,
    svgicon,
    styles,
    svgIconName,
    onIconClick,
    floatingLabel,
    labelname,
    value,
    error,
    helperText,
    readonly,
    disabled,
    ref,
    inputRef,
    autoFocus,
    onFocus,
    pattern,
    maxLength,
    onKeyDown,
    ...rest
}: Iprops) => {
    return (
        <>
            <div className={`${styles} relative`}>
                {icon ? (
                    <i onClick={() => onIconClick && onIconClick()} className={`${icon} absolute opacity-75`}></i>
                ) : (
                    ''
                )}
                {plusIcon ? (
                    <span
                        onClick={() => onIconClick && onIconClick()}
                        className={`flex justify-center items-center h-10 w-10 rounded-full bg-[#28282E] text-white absolute top-2 cursor-pointer opacity-75 right-3 text-2xl`}>
                        {plusIcon}
                    </span>
                ) : (
                    ''
                )}
                {svgicon ? (
                    <i onClick={() => onIconClick && onIconClick()} className={`${svgicon} absolute opacity-75`}>
                        {svgIconName}
                    </i>
                ) : (
                    ''
                )}
                <input
                    {...rest}
                    autoFocus={autoFocus}
                    autoComplete="off"
                    value={value}
                    placeholder={placeholder}
                    onChange={onchange}
                    onBlur={onBlur}
                    name={name}
                    readOnly={readonly}
                    type={type ? type : 'text'}
                    className={`input-text ${className}  placeholder:[#B0B0B0] px-4 py-4 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Circular-Book w-full outline-none rounded-xl text-white leading-[0]`}
                    // required
                    disabled={disabled}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    id={id}
                    ref={ref || inputRef}
                    pattern={pattern}
                    maxLength={maxLength}
                />
                {floatingLabel ? (
                    <label className={`${floatingLabel} absolute text-base t    text-secondary`}>{labelname}</label>
                ) : (
                    ''
                )}
            </div>
            {error && <p className="text-red-500 py-2 leading-4">{helperText}</p>}
        </>
    );
};

export default Input;
