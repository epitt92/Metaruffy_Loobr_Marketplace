import Input from '../input/Input';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useState } from 'react';
interface Iprops {
    setstate: Function;
    hide: any;
}
const Converter = ({ setstate }: Iprops) => {
    const [price, setPrice] = useState('');
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);

    return (
        <div className="w-full sm:w-[45rem]  rounded-2xl  py-3">
            <h3 className=" border px-6  border-transparent text-center  text-white  py-3 ">Converter</h3>
            <div className="px-6 mt-9 pb-10 flex items-center gap-4 ">
                <div className="w-[45%] relative">
                    <Input
                        placeholder="0"
                        type="number"
                        onchange={(e: any) => {
                            setPrice(e.target.value);
                        }}
                    />
                    <figure className="text-white absolute right-4 top-1/2 -translate-y-1/2">
                        <Image src="/assets/images/loobricon.svg" height={30} width={30} />
                    </figure>
                </div>
                <span>
                    <svg width="25" height="13" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.5667 0.379883L11.5994 1.36988L14.5433 4.31238H0.75V5.68738H14.5433L11.5994 8.62988L12.5667 9.61988L16.6917 5.49488L17.1868 4.99988L16.6917 4.50488L12.5667 0.379883Z"
                            fill="#89898F"
                        />
                    </svg>
                </span>
                <div className=" w-[45%] relative">
                    <Input placeholder="0" type="number" disabled={'disabled'} value={Number(price) * Number(loobrPrice)} />
                    <p className="text-white absolute right-4 top-1/2 -translate-y-1/2">USD</p>
                </div>
            </div>
        </div>
    );
};

export default Converter;
