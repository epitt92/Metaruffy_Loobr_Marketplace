import { useRouter } from 'next/router';
import React from 'react';
import Button from '../Button/Button';

interface Iprops {
    title?: any;
    desc?: string;
    buttonLink?: any;
    collection?: any;
}

const Notfounditem = ({ title, buttonLink, desc, buttonText, collection }: any) => {
    const router = useRouter();
    return (
        <div className="flex justify-center items-center h-[30vh]">
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-white">{title ? title : 'No Items found'}</h2>
                <p className=" mt-2 xl:text-xl font-Proxima-Regular">{desc}</p>
                {collection ? (
                    ''
                ) : (
                    <>
                        {' '}
                        {buttonText ? (
                            <Button
                                onClick={() => router.push(buttonLink)}
                                className="mt-8 !px-9 !py-4 rounded-[100px] gold">
                                {buttonText}
                            </Button>
                        ) : (
                            ''
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Notfounditem;
