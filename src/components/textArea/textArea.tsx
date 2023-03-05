import { useEffect, useLayoutEffect } from 'react';

interface Iprops {
    placeholder: string;
    className?: string;
    id?: string;
    type?: string;
    icon?: string;
    plusIcon?: any;
    styles?: string;
    onchange?: Function | any;
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

const TextArea = ({
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
    ...rest
}: Iprops) => {
    const tx = document.getElementsByTagName('textarea');
    for (let i = 0; i < tx.length; i++) {
        if (tx[i].id == 'TYPE__') {
            let height = 48;

            if (tx[i].scrollHeight > 150) {
                height = 134;
            } else {
                height = tx[i].scrollHeight;
            }
            tx[i].setAttribute('style', 'height:' + height + 'px;overflow-y:auto;');
            tx[i].addEventListener('input', OnInput, false);
        }
    }

    function OnInput() {
        this.style.height = 0;
        this.style.height = this.scrollHeight + 'px';
    }
    useEffect(() => {
        if (value == '') {
            const tx = document.getElementsByTagName('textarea');
            for (let i = 0; i < tx.length; i++) {
                if (tx[i].id == 'TYPE__') {
                    tx[i].setAttribute('style', 'height:' + 48 + 'px;overflow-y:auto;scrol');
                }
            }
        }
    }, [value]);
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
                <textarea
                    {...rest}
                    autoFocus={autoFocus}
                    autoComplete="off"
                    value={value}
                    placeholder={placeholder}
                    onChange={onchange}
                    onBlur={onBlur}
                    name={name}
                    readOnly={readonly}
                    // type={type ? type : 'text'}
                    className={`input-text ${className}  placeholder:[#B0B0B0] px-4 py-4 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Circular-Book w-full outline-none rounded-xl text-white h-[48px] containertextarea`}
                    // required
                    disabled={disabled}
                    onFocus={onFocus}
                    id={id}
                    ref={ref || inputRef}
                    // pattern={pattern}
                    maxLength={maxLength}
                />
                {floatingLabel ? (
                    <label className={`${floatingLabel} absolute text-base text-secondary`}>{labelname}</label>
                ) : (
                    ''
                )}
            </div>
            {error && <p className="py-2 leading-4 text-red-500">{helperText}</p>}
        </>
    );
};

export default TextArea;
