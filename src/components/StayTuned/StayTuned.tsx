import React from 'react';
import Button from '../Button/Button';

type Props = {
    setstate: Function;
    hide: Function;
};

const StayTuned = ({ setstate, hide }: Props) => {
    return (
        <div className="p-8 xs:w-full  w-[42.5rem] py-9 text-center  bg-[#14141F] rounded-[24px]">
            <h1 className="xl:text-[70px] text-[#EFC74D] font-Proxima-Bold">Stay Tuned!</h1>
            <p className="text-[22px] font-Proxima-SemiBold  text-white lg-w-[24.625rem] mt-1">
                Get ready for the biggest trading event! <br /> Trading will start soon.
            </p>
            <Button
                className="px-[9.5625rem]  text-xl font-Proxima-Bold py-5 rounded-[50px] mt-12"
                onClick={() => setstate()}>
                Close
            </Button>
        </div>
    );
};

export default StayTuned;
