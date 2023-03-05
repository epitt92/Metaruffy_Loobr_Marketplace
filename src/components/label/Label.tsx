
interface Iprops {
  className?: string;
  htmlFor?: string;
  children:any;
}

const Label = ({className, children, htmlFor}: Iprops) => {
    return (
        <label htmlFor={htmlFor ? htmlFor : ''} className={`${className ? className : ""} block text-white font-Proxima-Bold font-normal text-base`}>
            {children}
        </label>
    )
}

export default Label

