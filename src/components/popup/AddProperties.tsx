import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import Input from '../input/Input';

const Acceptoffer = ({ setstate, nftPropertiesHandler, setAttributes, attributes }: any) => {
    const focusInput: any = useRef();
    const [arr, setArr] = useState<any>([{ trait_type: '', value: '' }]);

    const handler = () => {
        let a = arr.filter((el: any) => el.trait_type !== '' && el.value !== '' && el);
        nftPropertiesHandler && nftPropertiesHandler(a);
        if (focusInput.current) focusInput.current.focus();
    };
    useEffect(() => {
        if (document.getElementById('TYPE_')) document.getElementById('TYPE_')?.focus();
    }, []);
    return (
        <div className="lg:w-[645px] m-auto rounded-lg px-8 xs:px-4 ">
            <div className=" py-6 text-center">
                <h2 className=" xl:text-2rem xs:text-3xl text-white text-center">Add Properties</h2>
                <p className="text-lightgray mt-4 whitespace-nowrap">
                    Properties show up underneath your item are clickable{' '}
                    <span className="block ">and can be filtered in your collection&apos;s sidebar.</span>
                </p>
            </div>
            {attributes?.map((el: any, i: number) => {
                return (
                    <div className="Addpropertiescontent relative  flex   gap-4 pr-[60px] " key={i}>
                        <div className="block w-1/2">
                            <label className="text-white text-base block mb-[10px]">Type</label>
                            <Input
                                value={el.trait_type}
                                placeholder="Character"
                                type="text"
                                name="text"
                                styles="!p-2.5 !px-4"
                                onchange={(e: any) => {
                                    let array = attributes;
                                    let index = attributes.indexOf(el);
                                    if (index > -1) {
                                        array[index] = { value: el.value, trait_type: e.target.value };
                                        setAttributes([...array]);
                                    }
                                }}
                            />
                        </div>
                        <div className="block w-1/2">
                            <label className="text-white text-base block mb-[10px]">Name</label>
                            <Input
                                value={el.value}
                                placeholder="Male"
                                type="text"
                                name="text"
                                styles="!p-2.5 !px-4"
                                onchange={(e: any) => {
                                    let array = attributes;
                                    let index = attributes.indexOf(el);
                                    if (index > -1) {
                                        array[index] = { trait_type: el.type, value: e.target.value };
                                        setAttributes([...array]);
                                    }
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            className="bg-[#2B2B35] w-[45px] h-[45px] flex rounded-xl items-center justify-center absolute right-0 bottom-0"
                            onClick={() => {
                                let a = attributes;
                                a.splice(i, 1);
                                setAttributes([...a]);
                            }}>
                            <img src="/assets/images/icons/delete-icon.png" className="w-[18px] h-[20px]" alt="" />
                        </button>
                    </div>
                );
            })}
            {arr?.map((el: any, i: number) => {
                return (
                    <div className="Addpropertiescontent relative flex gap-4 pr-[60px] mb-[12px] xs:block" key={i}>
                        <div className="block w-1/2 xs:w-full">
                            <label className="text-white text-base block mb-[10px]">Type</label>
                            <Input
                                autoFocus
                                value={el.trait_type}
                                placeholder="Type"
                                type="text"
                                name="text"
                                id="TYPE_"
                                ref={focusInput}
                                // className=""
                                onchange={(e: any) => {
                                    let a = arr;
                                    a[i] = { trait_type: e.target.value, value: el.value };
                                    setArr([...a]);
                                }}
                            />
                        </div>
                        <div className="block w-1/2 xs:w-full xs:mt-3">
                            <label className="text-white text-base block mb-[10px]">Name</label>
                            <Input
                                value={el.value}
                                placeholder="Name"
                                type="text"
                                name="text"
                                // className=""
                                onchange={(e: any) => {
                                    let a = arr;
                                    a[i] = { trait_type: el.trait_type, value: e.target.value };
                                    setArr([...a]);
                                }}
                            />
                        </div>
                        {arr?.length > 1 && (
                            <button
                                type="button"
                                className="bg-[#2B2B35] w-[45px] h-[45px] flex rounded-xl items-center justify-center absolute right-0 bottom-0"
                                onClick={() => {
                                    let a = arr;
                                    a.splice(i, 1);
                                    setArr([...a]);
                                }}>
                                <img src="/assets/images/icons/delete-icon.png" className="w-[18px] h-[20px]" />
                            </button>
                        )}
                    </div>
                );
            })}
            <button
                className="w-[110px] h-[40px] rounded-xl bg-[#2B2B35] text-gray6"
                type="button"
                onClick={() => {
                    let a = [...arr];
                    a.push({ trait_type: '', value: '' });
                    setArr(a);
                }}>
                Add more
            </button>
            <div className="py-6  ">
                <Button
                    onClick={() => {
                        handler();
                        setstate();
                    }}
                    className={`m-auto rounded-[3.125rem] gold !block mt-[1.75rem] min-w-[245px] 
                `}>
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default Acceptoffer;
