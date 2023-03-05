import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../Button/Button';
import Input from '../input/Input';
import S3 from 'react-aws-s3';
import { useDispatch, useSelector } from 'react-redux';
import { createFeed } from '../../redux/user/actions';
import { toast } from 'react-toastify';
import { uploadFile } from '../../services/upload.service';
const Uploadvideo = ({ setstate, setPopup }) => {
    const user = useSelector((state: any) => state.auth.user);
    const [values, setValues] = useState({
        text: '',
        user: user.userId
    });
    const [loadinglocal, setLoading] = useState(false);
    const loading = useSelector((state: any) => state.user.loading);
    const dispatch = useDispatch();
    const config = {
        bucketName: process.env.NEXT_PUBLIC_REACT_APP_S3_BUCKET,
        region: process.env.NEXT_PUBLIC_REACT_APP_REGION,
        accessKeyId: process.env.NEXT_PUBLIC_REACT_APP_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_REACT_APP_SECRET_ACCESS_KEY
    };
    // const S3Client = new S3(config);

    const UploadVideo = async (e: any) => {
        try {
            setLoading(true);
            let file = e.target.files[0];
            const url = await uploadFile(file);
            dispatch(createFeed({ ...values, video: url }));
            setLoading(false);
            setPopup(false);
            setstate(-1);
        } catch (err) {
            setLoading(false);
            setstate(-1);
            setPopup(false);
            toast.error(err.response.data.message);
        }

        // S3Client.uploadFile(file, file.name)
        //   .then(data => {
        //     // setValues({ ...values, video: data.location })
        //     dispatch(createFeed({ ...values, video: data.location }))
        //     setLoading(false)
        //     setPopup(false)
        //     setstate(-1)
        //   })
        //   .catch(err => {
        //     setLoading(false)
        //     setstate(-1)
        //     setPopup(false)
        //     toast.error(err.response.data.message);
        //     // console.log(err)
        //   })
    };
    return (
        <div className=" w-[52.5rem]  ">
            <div className="p-6 flex items-center">
                <figure>
                    <Image
                        width={56}
                        height={56}
                        className="rounded-full"
                        src="/assets/images/avatar/avatar.jpg"
                        alt=""
                    />
                </figure>

                <Input
                    className=""
                    placeholder="Write Something..."
                    styles=" border !border-none  !text-[#89898F] !text-2xl !font-[400] !font-Proxima-Regular ml-4"
                    onchange={(e: any) => {
                        setValues({ ...values, text: e.target.value });
                    }}
                />
            </div>
            <div className="mb-10 pl-6 pr-6">
                <label className="relative cursor-pointer block border  p-8  w:[100%]  rounded-[1.625rem]  border-dashed border-[#43434C]">
                    <input type="file" className="w-0 absolute" onChange={UploadVideo} />
                    {/* <img src="" alt="" /> */}
                    <div className="flex flex-col justify-center items-center w-[100%] h-[100%]">
                        <svg width="62" height="49" viewBox="0 0 62 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M43 40H47.5C54.9558 40 61 33.9558 61 26.5C61 19.0442 54.9558 13 47.5 13H46.8789C44.9201 6.07449 38.5527 1 31 1C23.4473 1 17.0799 6.07449 15.1211 13H14.5C7.04416 13 1 19.0442 1 26.5C1 33.9558 7.04416 40 14.5 40H19"
                                stroke="#F1C94A"
                            />
                            <path d="M31 47.5V17.5M31 17.5L20.5 28M31 17.5L41.5 28" stroke="#F1C94A" />
                        </svg>
                        <p className=" !text-[0.75rem]  !text-lightgray mt-4 text-center font-Circular-Medium">
                            MP4, AVI, MOV etc. Max 100mb
                        </p>
                        <Button className=" !px-6 !py-2.5 mt-4  !text-themecolor bg-[#2A2623] "> Choose Files</Button>
                    </div>
                </label>
            </div>
            <ul className="flex pl-[1.5rem] pr-[1.5rem]">
                <li className="flex items-center">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20.7004 15.9599L17.5704 8.64988C16.5104 6.16988 14.5604 6.06988 13.2504 8.42988L11.3604 11.8399C10.4004 13.5699 8.61043 13.7199 7.37043 12.1699L7.15043 11.8899C5.86043 10.2699 4.04043 10.4699 3.11043 12.3199L1.39043 15.7699C0.180434 18.1699 1.93043 20.9999 4.61043 20.9999H17.3704C19.9704 20.9999 21.7204 18.3499 20.7004 15.9599Z"
                            stroke="#727279"
                        />
                        <path
                            d="M5.99048 7C7.64733 7 8.99048 5.65685 8.99048 4C8.99048 2.34315 7.64733 1 5.99048 1C4.33362 1 2.99048 2.34315 2.99048 4C2.99048 5.65685 4.33362 7 5.99048 7Z"
                            stroke="#727279"
                        />
                    </svg>
                    <span className="text-white text-sm font-bold pl-2.5">Image</span>
                </li>
                <li className="flex pl-6 items-center">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.52002 6.11011H20.48M7.52002 1.11011V5.97011M14.48 1.11011V5.52011M21 14V8C21 3 19 1 14 1H8C3 1 1 3 1 8V14C1 19 3 21 8 21H14C19 21 21 19 21 14ZM8.75 12.2501C8.75 10.7101 9.84 10.0801 11.17 10.8501L13.25 12.0501C14.58 12.8201 14.58 14.0801 13.25 14.8501L11.17 16.0501C9.84 16.8201 8.75 16.1901 8.75 14.6501V12.2501Z"
                            stroke="#727279"
                        />
                    </svg>
                    <span className="text-white text-sm font-bold pl-2.5">Video</span>
                </li>
            </ul>
            <div className="mt-[15px] border-t-2 border-gray5 p-5">
                <Button type="button" className="w-full rounded-full">
                    post
                </Button>
            </div>
            {loading || loadinglocal ? (
                <div className=" text-center ">
                    <figure className="mt-12">
                        {/* <Image src="/assets/images/loader.png" height={48} width={48} alt="" /> */}
                        <div className="loadingio-spinner-rolling-jz7efhw30v">
                            <div className="ldio-fcd0x3izul5">
                                <div></div>
                            </div>
                        </div>
                    </figure>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default Uploadvideo;
