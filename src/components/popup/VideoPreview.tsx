import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';

const VideoPreview = ({ data }: any) => {
    const [playing, setPlaying] = useState(false);

    const collection = data?.collection;
    // const collection = useSelector((state: any) => state.collections.collection);
    useEffect(() => {
        setPlaying(true);
    }, []);

    return (
        <div className="w-full sm:w-[50rem] md:w-[68.188rem] m-auto rounded-lg px-10 py-8">
            <div className="flex justify-center flex-col items-center  xs:w-full w-full rounded-[20px] overflow-hidden">
                <div className="relative flex-shrink-0  w-full">
                    <ReactPlayer
                        playing={playing}
                        className=" rounded-[20px] z-[-1] !h-[30rem] !sm:h-[50rem] "
                        url={collection?.videoUrl || 'https://www.youtube.com/watch?v=Em9mlK45rP0'}
                        width="100%"
                        height="500px"
                        // height={800}
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoPreview;
