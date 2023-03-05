import React, { useState, useRef, useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
const Video = ({ src }: any) => {
    const videoRef: any = useRef(null);

    let handleEnterViewport = function () {
        videoRef?.current?.play();
    };
    let handleExitViewport = function () {
        videoRef?.current?.pause();
    };
    return (
        <>
            <Waypoint onEnter={handleEnterViewport} onLeave={handleExitViewport}>
                <video
                    playsInline={true}
                    className="w-full  h-[375px] bg-[#22222b] "
                    controlsList="nodownload"
                    loop
                    muted
                    src={src}
                    controls
                    ref={videoRef}
                />
            </Waypoint>
        </>
    );
};

export default Video;
