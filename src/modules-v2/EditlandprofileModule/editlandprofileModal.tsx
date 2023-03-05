import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import TextArea from '../../components/textArea/textArea';
import Loader from '../../components/loader/Loader';

const uploadURI = '/assets/images/landmap/upload.png';
const LandURI = '/assets/images/landmap/Land_placeholder.gif';
const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

export const EditLandprofileModal = ({ data, setstate, state }: any) => {
    const dispatch = useDispatch();
    const inputFileRef = useRef();
    const [landData, setLandData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<any>();

    const [name, setName] = useState<string>(data.name);
    const [description, setDescription] = useState<string>(data.description);
    const [applyAll, setApplyAll] = useState(false);

    const handleUpdateLand = async () => {
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
            id: data.id,
            logo: url,
            name: name,
            description: description,
            applyAll: applyAll,
            owner: data.owner
        };

        const res = await axios.post(`${BACKEND_URL}/api/nfts/update`, obj);
        setLoading(false);
        setstate(-1);
    };
    return (
        <>
            {data.isOwner ? (
                <div className="lg:w-[694px] m-auto rounded-[1.5rem] pt-10">
                    <div className=" flex-col items-center flex justify-center relative">
                        <h3 className="text-white font-Proxima-Regular mb-3">Land Edit</h3>
                        <div className="z-[5]">
                            <figure className="w-[15rem] h-[15rem] relative border-[.6rem] border-[#2b2b35] bg-[#2b2b35]">
                                <Image
                                    alt="land-logo"
                                    src={landData.url || (data.logo ? data.logo : LandURI)}
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
                        <div
                            className={'font-normal block truncate Atcheckbox items-center '}
                            onClick={() => {
                                setApplyAll(!applyAll);
                            }}>
                            <input
                                id=""
                                checked={applyAll}
                                type="checkbox"
                                readOnly
                                className={` `}
                                name="Background"
                            />
                            Apply to all lands
                            <span className="ml-4 float-right"></span>
                        </div>
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
                                    setLandData({
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
                                    labelname="Land Name"
                                    placeholder="Land Name"
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
                            <div className="">
                                <TextArea
                                    maxLength={200}
                                    placeholder="Description"
                                    value={description}
                                    name={'Land Description'}
                                    onchange={(e: any) => {
                                        setDescription(e.target.value);
                                    }}
                                    className="w-full resize-none braek h-[140px] border border-[#29303A] focus:outline-none px-4 py-4 rounded-xl bg-transparent text-white"
                                />
                                <p className="mt-0 text-right text-sm ">
                                    {description ? description.length : 0}
                                    /200 characters
                                </p>
                            </div>
                        </div>
                        <Button
                            className="w-[40%] mx-[30%] mb-6 rounded-[3.125rem] py-4 gold"
                            onClick={() => {
                                handleUpdateLand();
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
