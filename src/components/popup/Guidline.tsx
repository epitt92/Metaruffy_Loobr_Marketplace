import Input from '../input/Input';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Button from '../Button/Button';
interface Iprops {
    setstate: Function;
    hide: any;
}
const Guidline = ({ setstate }: Iprops) => {
    const [price, setPrice] = useState('');
    const loobrPrice = useSelector((state: any) => state.nft.loobrPrice);

    return (
        <div className="w-full sm:w-[49.563rem]  rounded-2xl  py-3 relative">
            <div className="absolute bg-[#14141F] h-20 w-20 right-0 top-0"></div>
            <span className=" w-full  flex justify-center mt-8">
                <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M89.9998 45.8873C89.7607 57.8089 84.8021 69.1489 76.212 77.4189C67.6219 85.6888 56.1019 90.2134 44.1798 89.9998C19.4023 89.6473 -0.412699 69.1698 0.0373007 44.0648C0.482301 19.1723 21.0373 -0.522684 46.0548 0.0248156C70.7273 0.557316 90.4498 20.9798 89.9998 45.8873ZM45.1273 14.9998C38.3273 14.9998 33.1923 21.3898 34.7898 28.0173C37.1848 37.9573 39.6773 47.8748 42.1398 57.7998C42.5373 59.4098 43.6398 60.3323 45.0648 60.3548C46.4898 60.3773 47.6723 59.4348 48.0648 57.7873C50.5198 47.8298 53.0098 37.8798 55.3848 27.9023C56.9573 21.3548 51.8323 14.9998 45.1273 14.9998ZM45.0348 66.9148C43.4435 66.8989 41.911 67.5158 40.7746 68.6297C39.6381 69.7437 38.9907 71.2635 38.9748 72.8548C38.9589 74.4461 39.5758 75.9786 40.6897 77.115C41.8037 78.2515 43.3235 78.8989 44.9148 78.9148C46.5101 78.9262 48.0452 78.3062 49.1851 77.1902C50.3251 76.0741 50.9774 74.5525 50.9998 72.9573C51.0084 72.1679 50.8605 71.3847 50.5648 70.6528C50.269 69.9208 49.8312 69.2547 49.2766 68.6929C48.722 68.1311 48.0616 67.6848 47.3336 67.3796C46.6055 67.0744 45.8242 66.9164 45.0348 66.9148Z"
                        fill="#FF0000"
                    />
                </svg>
            </span>
            <h3 className=" border px-14 sm:px-28  text-[2rem]  border-transparent text-center  text-white  leading-normal py-3 ">
                Your Post Goes Against Our Community Guidelines.
            </h3>
            <div className="sm:px-14 px-7 mt-4  text-2xl pb-10  gap-4 ">
                <p className="text-white text-center">
                    We removed your post because it goes against our guidelines on hate speech & offensive languages. If
                    you post something that goes against our guidelines again, your account may be deleted including all
                    your feeds, comments, likes and NFTs. Moreover, your IP address will be blacklisted.
                </p>
                <div className="flex justify-center mt-9">
                    <Button className="bg-transparent border-2 border-[#FF0000] text-[#FF0000]">I Understand</Button>
                </div>
            </div>
        </div>
    );
};

export default Guidline;
