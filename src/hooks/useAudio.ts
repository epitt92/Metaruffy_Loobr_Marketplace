import React, { useState, useEffect } from 'react';

const useAudio = (url: string, repeat?: boolean) => {
    const [audio, setAudio] = useState<any>(null);
    const [playing, setPlaying] = useState(false);

    const toggle: any = () => setPlaying(!playing);

    useEffect(() => {
        setAudio(new Audio(url));
        // only run once on the first render on the client
    }, []);

    useEffect(() => {
        playing ? audio?.play() : audio?.pause();
    }, [playing]);

    useEffect(() => {
        if (audio) {
            audio?.addEventListener('ended', () => {
                if (repeat) {
                    audio?.play();
                    return;
                }
                setPlaying(false);
            });
            return () => {
                audio?.removeEventListener('ended', () => setPlaying(false));
            };
        }
    }, [audio]);

    return [playing, toggle, audio];
};

export default useAudio;
