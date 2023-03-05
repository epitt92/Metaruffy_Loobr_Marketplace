import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AdvancedImage, lazyload, placeholder, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { cloudinaryService } from '../../services/cloudinary.service';
import VideoComponent from '../video/videoComponent';
interface IProps {
    src: string;
    width?: number;
    height?: number;
    className?: string;
    figClassName?: string;
    alt?: string;
    blurEffect?: boolean;
    layout?: any;
    objectFit?: any;
    defaultPlaceholder?: any;
    quality?: any;
    transformation?: any;
    fileType?: string;
    isUserProfile?: any;
    user?: any;
    size?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    nftData?: any;
}

function compareProps(prevProps: any, nextProps: any) {
    return prevProps != nextProps;
}

const ImageFunction = ({
    src: sourceImage,
    width,
    height,
    className,
    figClassName,
    alt,
    layout,
    objectFit,
    blurEffect = false,
    defaultPlaceholder = '/assets/images/default.png',
    quality,
    transformation,
    fileType,
    size = 6,
    ...rest
}: IProps) => {
    const [error, setError] = useState(0);
    const [isVideo, setIsVideo] = useState(false);
    const shimmer = (w: any, h: any) => `
            <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
                <linearGradient id="g">
                <stop stop-color="#efefef" offset="20%" />
                <stop stop-color="#b1b1b163" offset="50%" />
                <stop stop-color="#efefef" offset="70%" />
                </linearGradient>
            </defs>
            <rect width="${w}" height="${h}" fill="#efefef" />
            <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
            <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
            </svg>`;

    const toBase64 = (str: any) =>
        typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
    const loadingUrl = `data:image/svg+xml;base64,${toBase64(shimmer(width || 300, height || 300))}`;
    // sourceImage = sourceImage;
    sourceImage = sourceImage?.replace('ipfs://', 'https://loobr.infura-ipfs.io/ipfs/');
    sourceImage = sourceImage?.replace('https://ipfs.infura.io', 'https://loobr.infura-ipfs.io');
    const src = sourceImage
        ? sourceImage.includes('res.cloudinary.com') || sourceImage?.includes('/assets/')
            ? sourceImage
            : cloudinaryService.optimizeImageURL({
                  src: sourceImage,
                  width,
                  height,
                  quality,
                  transformation,
                  fileType,
                  objectFit
              })
        : defaultPlaceholder;

    const imageSrc = error === 1 ? sourceImage : error === 2 ? defaultPlaceholder : src;
    // const imageSrc = error === 1 ? sourceImage : error === 2 ? defaultPlaceholder : src;

    const onError = useCallback(() => {
        setError((prev) => prev + 1);
    }, []);

    useEffect(() => {
        if (error === 2) {
            fetch(sourceImage, { method: 'HEAD' })
                .then((res: any) => {
                    if (res.headers.get('Content-Type').startsWith('video')) {
                        setIsVideo(true);
                    }
                })
                .catch(console.log);
        }
        return () => {};
    }, [error]);

    const ImageView = useCallback(() => {
        return (
            <>
                <Image
                    src={imageSrc}
                    width={width}
                    height={height}
                    placeholder={!blurEffect ? 'empty' : 'blur'}
                    // blurDataURL={`/_next/image?url=${src}&w=16&q=1`}
                    blurDataURL={loadingUrl}
                    alt={alt ? alt : 'Image'}
                    layout={layout}
                    objectFit={objectFit}
                    {...rest}
                    className={`${className} `}
                    onError={onError}
                />
            </>
        );
    }, [alt, blurEffect, className, height, imageSrc, layout, loadingUrl, objectFit, onError, rest, width]);

    return (
        <>
            {isVideo && (
                <video
                    playsInline={true}
                    className={`'h-[23.438rem] ${className} `}
                    width="100%"
                    height="100%"
                    loop={true}
                    autoPlay={true}
                    muted={true}
                    controls={false}>
                    <source
                        src={
                            fileType === 'gif'
                                ? cloudinaryService.optimizeVideoURL({ src, fileType, width })
                                : rest?.nftData?.animation_url
                                ? rest?.nftData?.animation_url
                                : sourceImage
                        }
                    />
                </video>
            )}

            {(rest?.isUserProfile && error > 1) ||
                isVideo ||
                (figClassName ? (
                    <figure className={`${figClassName}`}>
                        <ImageView />
                    </figure>
                ) : (
                    <ImageView />
                ))}

            {rest?.isUserProfile && error > 1 && (
                <p
                    className={`w-full h-full bg-themecolor text-${size}xl contain flex items-center justify-center rounded-full text-black1`}>
                    {rest?.user?.firstName?.charAt(0)?.toUpperCase()}
                </p>
            )}
        </>
    );
};

const ImageComponent = React.memo(ImageFunction, compareProps);

export default ImageComponent;
