import React, { useState } from 'react';
import Image from 'next/image';
import { fetchImage } from '../../utils/functions';
interface IProps {
    src: any;
    width?: number;
    height?: number;
    className?: string;
    figClassName?: string;
    alt?: string;
    blurEffect?: boolean;
    layout?: any;
    objectFit?: any;
}
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const BlurImage = ({
    src,
    width,
    height,
    className,
    figClassName,
    alt,
    layout,
    objectFit,
    blurEffect,
    ...rest
}: IProps) => {
    const [isLoading, setLoading] = useState(true);    
    return (
        <>
            <figure className={`relative overflow-hidden flex justify-center items-center ${figClassName}`}>
                <Image
                    src={fetchImage(src)}
                    width={width}
                    height={height}
                    placeholder={!blurEffect ? 'empty' : 'blur'}
                    blurDataURL={`/_next/image?url=${src}&w=16&q=1`}
                    alt={alt ? alt : 'Image'}
                    layout={layout}
                    objectFit={objectFit}
                    {...rest}
                    className={cn(
                        `duration-700 ease-in-out ${className} `,
                        isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-110'
                    )}
                    onLoadingComplete={() => setLoading(false)}
                />
            </figure>
        </>
    );
};

export default BlurImage;
