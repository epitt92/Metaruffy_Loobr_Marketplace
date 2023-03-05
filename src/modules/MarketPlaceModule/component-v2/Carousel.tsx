import { sliderClasses } from '@mui/material';
import React, { useEffect, useState } from 'react';
interface Props {
    children: React.ReactNode[];
    count: number;
}
const Carousel: React.FC<Props> = ({ children, count }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handlePrevClick = () => {
        if (currentIndex !== 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const handleNextClick = () => {
        if (currentIndex < children.length - count) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    return (
        <div className="carousel-container relative">
            <button
                className="top-[50%] -left-16 absolute rounded-md  border border-[#4C4C53]  z-5  h-[20px] w-[20px] carousel-button prev-button"
                onClick={handlePrevClick}>
                <i className='icon-arrowleft text-xs'></i>
            </button>
            <div className={`grid lg:grid-cols-4 sm:grid-cols-3  mb-10     gap-5 lg:gap-7 `}>
                {children.map(
                    (child: any, idx: number) => idx >= currentIndex && idx < currentIndex + count && children[idx]
                )}
            </div>
            <button
                className="top-[50%] -right-16  absolute rounded-md  border border-[#4C4C53] h-[20px] w-[20px] carousel-button prev-button"
                disabled={currentIndex >= children.length - count}
                onClick={handleNextClick}>
               <i className='icon-arrowleft text-xs block rotate-180'></i>
            </button>
        </div>
    );
};
export default Carousel;
