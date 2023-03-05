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
                className="top-[50%] -left-16 absolute rounded-lg text-3xl z-5 border-0 h-[43px] w-[43px] carousel-button prev-button"
                onClick={handlePrevClick}>
                {'<'}
            </button>
            <div className={`grid lg:grid-cols-4 sm:grid-cols-3  mb-10     gap-5 lg:gap-7 `}>
                {children.map(
                    (child: any, idx: number) => idx >= currentIndex && idx < currentIndex + count && children[idx]
                )}
            </div>
            <button
                className="top-[50%] -right-16 text-3xl absolute rounded-lg z-5 border-0 h-[43px] w-[43px] carousel-button prev-button"
                disabled={currentIndex >= children.length - count}
                onClick={handleNextClick}>
                {'>'}
            </button>
        </div>
    );
};
export default Carousel;
