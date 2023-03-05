import React, { useRef, useEffect, useState } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (ref: any) => {
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            clicked && setClicked(false);
        }, 500);
        () => {
            clearTimeout(timeoutId);
        };
    }, [clicked]);

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                setClicked(true);
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
    return [clicked];
};
export default useOutsideAlerter;

/**
 * Component that alerts if you click outside of it
 */
// export default function OutsideAlerter(props: any) {
//     const wrapperRef = useRef(null);
//     useOutsideAlerter(wrapperRef);

//     return <div ref={wrapperRef}>{props.children}</div>;
// }
