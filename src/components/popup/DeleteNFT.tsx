import React from 'react';
import Button from '../Button/Button';

type IProps = {
    data: {
        loading: boolean;
        onDelete: Function;
        deleteIndex: number;
        heading: string;
    };
    setstate: Function;
};

const DeleteNFT = ({ data, setstate }: IProps) => {
    console.log(data,"data");
    
    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">{data.heading}</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want <span className="block"> to delete nfts?</span>
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                    disabled={data.loading}
                    onClick={() => {
                        setstate();
                    }}
                    className="w-full rounded-lg text-[#727279] !bg-[#2b2b35]">
                    Cancel
                </Button>
                <Button
                    className="w-full rounded-lg bg-red-500"
                    onClick={() => data.onDelete(data.deleteIndex)}
                    isLoading={data.loading}
                    disabled={data.loading}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default DeleteNFT;
