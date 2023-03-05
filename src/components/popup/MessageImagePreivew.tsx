import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createFeed } from "../../redux/user/actions";
import Button from "../Button/Button";
interface IProps {
  setstate?: any;
  setPopup?: any;
  data: string;
}
const MessageImagePreivew = ({ setstate, setPopup, data }: IProps) => {
  async function downloadImage(imageSrc: string) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    // link.download = "image file name here";
    link.download = `meta-ruffy ${Math.floor(Math.random() * (100 - 0) + 0)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div className="w-full md:w-[52.5rem] sm:w-[42.5rem] p-10">
      <div className="mb-10 text-center">
        <figure className="mx-auto w-full  pt-[100%] Atchatimgpreview">
          {/* <img className="" src={data} /> */}
          <Image src={data} objectFit="cover" layout="fill" />
        </figure>
      </div>

      <div className="mt-[15px] border-t-2 border-gray5 p-5">
        {/* <a href={data} download>
          Download image
        </a> */}
        <Button
          onClick={() => {
            downloadImage(data);
          }}
          className="cursor-pointer"
        >
          Download image
        </Button>
      </div>
    </div>
  );
};

export default MessageImagePreivew;
