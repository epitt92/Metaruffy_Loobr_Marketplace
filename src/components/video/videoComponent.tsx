import React, { useState } from 'react';
import Image from 'next/image';
import { fetchImage } from '../../utils/functions';
import { AdvancedVideo, lazyload, placeholder, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { cloudinaryService } from '../../services/cloudinary.service';
import { videoCodec } from '@cloudinary/url-gen/actions/transcode';
import { auto, vp9 } from '@cloudinary/url-gen/qualifiers/videoCodec';

interface IProps {
    src: any;
    width?: number;
    height?: number;
    ParentClass?: string;
    ChildClass?: string;
    className?: string;
    figClassName?: string;
    controls?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    bgremove?:boolean;
    fileType?: string;
}
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const VideoComponent = ({
    src,
    width,
    height,
    ParentClass,
    ChildClass,
    className,
    figClassName,
    bgremove,
    controls,
    autoPlay = true,
    loop = true,
    muted = true,
    fileType,
    ...rest
}: IProps) => {
    const sources = [
        {
            type: 'mp4',
            codecs: ['avc1.4d002a'],
            transcode: videoCodec(auto())
        },
        {
            type: 'webm',
            codecs: ['vp8', 'vorbis'],
            transcode: videoCodec(vp9())
        }
    ];

    return (
        <>
            <div className={`${ParentClass ? ParentClass : 'vimeo-video-container'} ${bgremove ? "bg-transparent":"bg-black"}    ${figClassName}`}>
                <video
                    playsInline={true}
                    className={`${ChildClass ? ChildClass : 'vimeo-video'} ${className} `}
                    width="100%"
                    height="100%"
                    loop={loop}
                    autoPlay={autoPlay}
                    muted={muted}
                    controls={controls}>
                    <source
                        src={fileType === 'gif' ? cloudinaryService.optimizeVideoURL({ src, fileType, width }) : src}
                    />
                </video>
            </div>
        </>
    );
};

export default VideoComponent;
