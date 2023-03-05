import React, { useEffect, useRef, useState } from 'react';

type Props = {};

const Timer = (props: Props) => {
    const [duration, setDuration] = useState(0);
    const durationRef = useRef(duration);

    useEffect(() => {
        const timer = setInterval(() => {
            durationRef.current = durationRef.current + 1;
            setDuration(durationRef.current + 1);
        }, 1000);

        return () => {
            console.log('called');

            clearInterval(timer);
            setDuration(0);
        };
    }, []);
    return (
        <div>
            {Math.floor(Number(duration / 60))}:{duration % 60}
        </div>
    );
};

export default Timer;
