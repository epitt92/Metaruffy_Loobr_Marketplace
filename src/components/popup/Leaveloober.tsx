import React from 'react';
import Button from '../Button/Button';

const Leaveloober = ({ data, setstate }: any) => {
    const openLink = () => {
        if (data?.link) {
            window.open(data?.link);
            setstate();
        }
    };
    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">Leave Loober</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">Are you sure you want to leave loobr.com?</p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-10">
                <Button className="w-full rounded-lg " onClick={() => openLink()}>
                    Yes
                </Button>
                <Button className="w-full rounded-lg " onClick={() => setstate()}>
                    No
                </Button>
            </div>
        </div>
    );
};

export default Leaveloober;
