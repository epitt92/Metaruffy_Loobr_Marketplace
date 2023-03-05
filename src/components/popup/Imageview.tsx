import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createFeed } from '../../redux/user/actions';
import Button from '../Button/Button';
interface IProps {
    setstate?: any;
    setPopup?: any;
    data: string;
}
const ImageView = ({ data }: IProps) => {
    //   async function downloadImage(imageSrc: string) {
    //     const image = await fetch(imageSrc);
    //     const imageBlog = await image.blob();
    //     const imageURL = URL.createObjectURL(imageBlog);

    //     const link = document.createElement("a");
    //     link.href = imageURL;
    //     // link.download = "image file name here";
    //     link.download = `meta-ruffy ${Math.floor(Math.random() * (100 - 0) + 0)}`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   }
    return (
        <div className="w-fu sm:w-[60.5rem]  w-[35rem] xs2:w-[30rem] xs4:w-[23rem] p-10">
            <div className=" text-center">
                <figure className="mx-auto w-full  pt-[100%] Atchatimgpreview">
                    <Image src={data || '/assets/images/5.png'} objectFit="cover" layout="fill" />
                </figure>
            </div>
        </div>
    );
};

export default ImageView;
