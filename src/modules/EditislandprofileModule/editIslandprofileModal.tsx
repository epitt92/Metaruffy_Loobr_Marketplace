import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const uploadURI = '/assets/images/landmap/upload.png';
const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;
const defaultLogo = '/assets/images/landmap/Kingdom_placeholder.gif';

export const EditIslandprofileModal = ({ data, setstate, state }: any) => {
    const dispatch = useDispatch();
    const inputFileRef = useRef();
    const [kingdomData, setKingdomData] = useState<any>({});
    const [filename, setFileName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<any>();

    const [name, setName] = useState<string>(data.name);
    const [description, setDescription] = useState<string>(data.description);

    const handleUpdateKingdom = async () => {
        setLoading(true);
        var formdata = new FormData();
        formdata.append('file', file);
        formdata.append('upload_preset', process.env.NEXT_PUBLIC_YOUR_UNSIGNED_UPLOAD_PRESET!);
        // formdata.append('format', 'webp');

        const result = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
            method: 'POST',
            body: formdata
        });
        const logoData: any = await result?.json();
        const url = logoData?.secure_url;
        let obj = {
            logo: url,
            id: data.id,
            name: name,
            description: description
        };
        const res = await axios.post(`${BACKEND_URL}/api/islands`, obj);
        setLoading(false);
        setstate(-1);
    };
    return (
        <>
            {data.isOwner ? (
                <div className="lg:w-[694px] m-auto rounded-[1.5rem] pt-10">
                    <div className=" flex-col items-center flex justify-center relative">
                        <h3 className="text-white font-Proxima-Regular mb-3">Kingdom Edit</h3>
                        <div className="z-[5]">
                            <figure className="w-[15rem] h-[15rem] relative border-[.6rem] border-[#2b2b35] bg-[#2b2b35]">
                                <Image
                                    alt="kingdom-logo"
                                    src={kingdomData.url || (data.logo ? data.logo : defaultLogo)}
                                    width={220}
                                    height={220}
                                    className="w-[14rem] h-[14rem] object-cover"
                                />
                            </figure>
                        </div>
                        <span className="px-8 text-center">
                            Max. file size 5MB, JPG, JPEG, PNG, GIFF (recommended size 512px x 512px)
                        </span>
                        <Button
                            className="mt-3 mb-6 rounded-[3.125rem] px-4 py-1 gold"
                            onClick={() => inputFileRef && inputFileRef.current && inputFileRef.current.click()}>
                            <Image alt="upload" src={uploadURI} width={30} height={30} className="mr-2 h-full" /> Upload
                        </Button>
                        <input
                            type="file"
                            ref={inputFileRef}
                            accept="image/png,image/jpeg"
                            onClick={(event: any) => {
                                event.target.value = null;
                            }}
                            className="w-0 absolute  "
                            onChange={(e: any) => {
                                try {
                                    e.preventDefault();
                                    setFile(e.target.files[0]);
                                    setKingdomData({
                                        url: URL.createObjectURL(e.target.files[0])
                                    });
                                } catch (err) {}
                            }}
                        />
                    </div>
                    <div className="pt-6 px-8 pb-8">
                        <div className="mb-6 grid grid-cols-1">
                            <div className="">
                                <Input
                                    floatingLabel="labelname"
                                    styles="at-fieldholder"
                                    className="pt-7 pb-2"
                                    labelname="Kingdom Name"
                                    placeholder="Kingdom Name"
                                    value={name}
                                    onchange={(e) => {
                                        if (e.target.value.length > 30) return;
                                        setName(e.target.value);
                                    }}
                                />
                                <p className="mt-0 text-right text-sm ">
                                    {name ? name.length : 0}
                                    /30 characters
                                </p>
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-1">
                            <h3 className="text-white text-base font-Proxima-Regular mb-3">Description</h3>
                            <div className="">
                                <textarea
                                    maxLength={300}
                                    value={description}
                                    name={'Kingdom Description'}
                                    onChange={(e: any) => {
                                        setDescription(e.target.value);
                                    }}
                                    placeholder="Provide an intriguing description of your metaverse story."
                                    className="w-full resize-none braek h-[160px] border border-[#29303A] focus:outline-none px-4 py-4 rounded-xl bg-transparent text-white"></textarea>

                                <p className="mt-0 text-right text-sm ">
                                    {description ? description.length : 0}
                                    /300 characters
                                </p>
                            </div>
                        </div>
                        <Button
                            className="w-[40%] mx-[30%] mb-6 rounded-[3.125rem] py-4 gold"
                            onClick={() => {
                                handleUpdateKingdom();
                            }}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="lg:w-[694px] m-auto rounded-[1.5rem] pt-10">
                    <div className=" flex-col items-center flex justify-center relative">
                        <h6 className="text-white font-Proxima-Regular mb-5 text-center">
                            It seems like you don't have control over this land or kingdom. <br />
                            Please double-check that you're connected to the right wallet. Thanks.
                        </h6>
                    </div>
                </div>
            )}
        </>
    );
};
