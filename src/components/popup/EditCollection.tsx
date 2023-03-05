import Poups from './poups';
import Image from 'next/image';
import Input from '../input/Input';
import Button from '../Button/Button';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { generateFileUrl, uploadFile } from '../../services/upload.service';
import { createCollection, editCollection } from '../../redux/collections/actions';
import ImageComponent from '../Image/ImageComponent';

export const EditCollection = ({ setstate, hide, data }: any) => {
    const { collection } = data;
    const [values, setValues] = useState({
        name: '',
        headline: '',
        videoUrl: '',
        numberOfNfts: '',
        website: '',
        twitter: '',
        instagram: '',
        facebook: ''
    });

    const [coverImage, setCoverImage] = useState<any>();
    const [logoImage, setLogoImage] = useState<any>();
    const [coverPreview, setCoverPreview] = useState<any>();
    const [logoPreview, setLogoPreview] = useState<any>();
    const [loadingUploadCover, setLoadingUploadCover] = useState<boolean>(false);
    const [loadingUploadLogo, setLoadingUploadLogo] = useState<boolean>(false);

    const loading = useSelector((state: any) => state.collections.editCollectionsLoading);
    // const collection = useSelector((state: any) => state.collections.collection);
    const collectionLoading = useSelector((state: any) => state.collections.collectionLoading);
    const [fileName, setFileName] = useState<any>('');
    const [type, setType] = useState<any>('');
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [data1, setData] = useState<any>(null);
    const [videoLoading, setLoadingVideo] = useState<boolean>(false);

    useEffect(() => {
        if (collection) {
            setValues({
                ...values,
                name: collection.name,
                headline: collection.headline,
                videoUrl: collection.videoUrl,
                numberOfNfts: collection.numberOfNfts,
                website: collection.website,
                twitter: collection.twitter,
                instagram: collection.instagram,
                facebook: collection.facebook
            });
            setCoverPreview(collection.coverPicture);
            setLogoPreview(collection.logoPicture);
        }
    }, [collection]);
    const callS3 = (file: any) => {
        setState(-1);
        setPopup(false);
        const image = dataURLtoFile(file, fileName);
        if (type == 1920 / 350) {
            selectCover(image);
        } else {
            selectLogo(image);
        }
    };
    function dataURLtoFile(dataurl: string, filename: string) {
        var arr: any = dataurl.split(','),
            mime = arr[0]?.match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }
    const selectCover = async (image: any) => {
        try {
            setLoadingUploadCover(true);
            let name = `${new Date().valueOf()}.${image.name.split('.')[1]}`;
            let type = image.type;
            // let url = await generateFileUrl({ name, mime: type });
            let newUrl = await uploadFile(image);

            setCoverImage(newUrl);
            setCoverPreview(newUrl);
            setLoadingUploadCover(false);
        } catch (err) {
            // console.log(err);
        }
    };

    const selectLogo = useCallback(async (image: any) => {
        try {
            setLoadingUploadLogo(true);
            let name = `${new Date().valueOf()}.${image.name.split('.')[1]}`;
            let type = image.type;
            // let url = await generateFileUrl({ name, mime: type });
            let newUrl = await uploadFile(image);
            setLoadingUploadLogo(false);
            setLogoImage(newUrl);
            setLogoPreview(newUrl);
        } catch (err) {
            // console.log(err);
        }
    }, []);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^(. *[^0-9]|)(10000|[1-9]\d{0,3})([^0-9].*|)$/;

        if (event.target.name === 'numberOfNfts' && !regex.test(event.target.value) && event.target.value !== '') {
            return;
        }
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleCloseModal = () => {
        hide(false);
        setstate();
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const data = new FormData();
        // data.append('name', values.name);
        // data.append('headline', values.headline);
        // coverImage && data.append('coverPicture', coverImage);
        // logoImage && data.append('logoPicture', logoImage);
        if (values.numberOfNfts < collection.numberOfNfts) {
            toast.error('Collection size must be greater than the current size.');
            return;
        }
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        if (values.videoUrl && !urlRegex.test(values.videoUrl)) {
            toast.error('Please add a valid URL');
        } else {
            const data = {
                name: values.name,
                headline: values.headline,
                coverPicture: coverImage,
                logoPicture: logoImage,
                videoUrl: values.videoUrl,
                numberOfNfts: values.numberOfNfts,
                website: values.website,
                twitter: values.twitter,
                instagram: values.instagram,
                facebook: values.facebook
            };
            dispatch(editCollection(collection._id, data, handleCloseModal));
        }
    };
    const uploadtoS3 = async (inputFile: any) => {
        try {
            try {
                let name = `${new Date().valueOf()}.${inputFile.name.split('.')[1]}`;
                let type = inputFile.type;
                // let url = await generateFileUrl({ name, mime: type });
                let newUrl = await uploadFile(inputFile);
                newUrl && setValues({ ...values, videoUrl: newUrl });
                setLoadingVideo(false);
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            // setLoadingUpload(false);
            // console.log(err);
        }
    };
    return (
        <div className=" sm:w-auto w-[450px] xs:w-full m-auto rounded-lg px-8 py-6">
            <form onSubmit={handleSubmit}>
                <h3 className="xl:text-2rem text-white">Edit Collection</h3>
                <div className="mb-14 flex flex-col justify-center mt-10  lg:flex-row">
                    <div className="lg:mr-4">
                        <label className="relative cursor-pointer block border-2 sm:w-auto   lg:w-[200px] h-[200px] rounded-2xl  border-dashed border-[#2B2B35] ">
                            {loadingUploadLogo ? (
                                <div className="ChooseFullImage relative rounded-xl  overflow-hidden mb-4">
                                    <div className=" text-center ">
                                        <figure className="mt-12">
                                            <div className="loadingio-spinner-rolling-jz7efhw30v">
                                                <div className="ldio-fcd0x3izul5">
                                                    <div></div>
                                                </div>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-0 absolute  "
                                        onChange={(e: any) => {
                                            setFileName(e.target.files[0].name);
                                            setType(1);
                                            setState(52);
                                            setPopup(true);
                                            setData({ url: URL.createObjectURL(e.target.files[0]) });
                                        }}
                                    />
                                    {logoPreview ? (
                                        <figure className="m-auto xl:m-0 w-full relative lg:w-[200px]  h-[200px] Atcreatecollectionimg">
                                            <ImageComponent
                                                objectFit="contain"
                                                layout="fill"
                                                className="relative cursor-pointer block border-2 sm:w-auto   lg:w-[200px] h-[200px] rounded-2xl  border-dashed border-[#2B2B35] "
                                                src={logoPreview}
                                                alt=""
                                            />
                                        </figure>
                                    ) : (
                                        <div className="flex  flex-col justify-center items-center w-[100%] h-[100%]">
                                            <svg
                                                width="38"
                                                height="38"
                                                viewBox="0 0 38 38"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.89588 30.8753C7.36096 30.8753 5.1063 29.2523 4.28771 26.8362L4.2323 26.6541C4.03913 26.0144 3.95838 25.4761 3.95838 24.9377V14.1426L0.117211 26.9644C-0.376789 28.8502 0.748961 30.8056 2.63788 31.3265L27.121 37.8831C27.4265 37.9623 27.7321 38.0003 28.033 38.0003C29.61 38.0003 31.0508 36.9537 31.4545 35.4115L32.8811 30.8753H9.89588Z"
                                                    fill="#E0E0E0"
                                                />
                                                <path
                                                    d="M14.2502 14.2493C15.9966 14.2493 17.4168 12.8291 17.4168 11.0827C17.4168 9.33627 15.9966 7.91602 14.2502 7.91602C12.5037 7.91602 11.0835 9.33627 11.0835 11.0827C11.0835 12.8291 12.5037 14.2493 14.2502 14.2493Z"
                                                    fill="#E0E0E0"
                                                />
                                                <path
                                                    d="M34.0413 3.16602H10.2913C8.10951 3.16602 6.33301 4.94252 6.33301 7.12435V24.541C6.33301 26.7229 8.10951 28.4994 10.2913 28.4994H34.0413C36.2232 28.4994 37.9997 26.7229 37.9997 24.541V7.12435C37.9997 4.94252 36.2232 3.16602 34.0413 3.16602ZM10.2913 6.33268H34.0413C34.4783 6.33268 34.833 6.68735 34.833 7.12435V18.3644L29.8313 12.5283C29.3008 11.906 28.5329 11.5735 27.708 11.5545C26.8878 11.5593 26.1183 11.9234 25.5927 12.5536L19.7122 19.6121L17.7963 17.701C16.7133 16.618 14.9511 16.618 13.8697 17.701L9.49967 22.0694V7.12435C9.49967 6.68735 9.85434 6.33268 10.2913 6.33268Z"
                                                    fill="#E0E0E0"
                                                />
                                            </svg>

                                            <p className=" !text-[0.75rem]  !text-lightgray mt-4 text-center font-Circular-Medium">
                                                Click to upload logo <br />{' '}
                                                <span className="text-[#8D8C8C]"> (350 x 350 Recommended)</span>
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </label>
                    </div>
                    <div className="">
                        <label className="relative cursor-pointer block border-2 lg:mt-0 mt-6  w:[100%] sm:w-[505px] h-[200px] rounded-2xl  border-dashed border-[#2B2B35]">
                            {loadingUploadCover ? (
                                <div className="ChooseFullImage relative rounded-xl  overflow-hidden mb-4">
                                    <div className=" text-center">
                                        <figure className="mt-12">
                                            <div className="loadingio-spinner-rolling-jz7efhw30v">
                                                <div className="ldio-fcd0x3izul5">
                                                    <div></div>
                                                </div>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-0 absolute"
                                        onChange={(e: any) => {
                                            setFileName(e.target.files[0].name);
                                            setState(52);
                                            setPopup(true);
                                            setData({ url: URL.createObjectURL(e.target.files[0]) });
                                            setType(1920 / 350);
                                        }}
                                    />
                                    {coverPreview ? (
                                        <figure className="w-full xl:w-[505px] h-[200px] Atcreatecollectionimg">
                                            <ImageComponent
                                                className="relative cursor-pointer block border-2 lg:mt-0 mt-6   w:[100%] sm:w-[505px] h-[200px] rounded-2xl  border-dashed border-[#2B2B35]"
                                                objectFit="contain"
                                                layout="fill"
                                                src={coverPreview}
                                                alt=""
                                            />
                                        </figure>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center w-[100%] h-[100%]">
                                            <svg
                                                width="38"
                                                height="38"
                                                viewBox="0 0 38 38"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.89588 30.8753C7.36096 30.8753 5.1063 29.2523 4.28771 26.8362L4.2323 26.6541C4.03913 26.0144 3.95838 25.4761 3.95838 24.9377V14.1426L0.117211 26.9644C-0.376789 28.8502 0.748961 30.8056 2.63788 31.3265L27.121 37.8831C27.4265 37.9623 27.7321 38.0003 28.033 38.0003C29.61 38.0003 31.0508 36.9537 31.4545 35.4115L32.8811 30.8753H9.89588Z"
                                                    fill="#E0E0E0"
                                                />
                                                <path
                                                    d="M14.2502 14.2493C15.9966 14.2493 17.4168 12.8291 17.4168 11.0827C17.4168 9.33627 15.9966 7.91602 14.2502 7.91602C12.5037 7.91602 11.0835 9.33627 11.0835 11.0827C11.0835 12.8291 12.5037 14.2493 14.2502 14.2493Z"
                                                    fill="#E0E0E0"
                                                />
                                                <path
                                                    d="M34.0413 3.16602H10.2913C8.10951 3.16602 6.33301 4.94252 6.33301 7.12435V24.541C6.33301 26.7229 8.10951 28.4994 10.2913 28.4994H34.0413C36.2232 28.4994 37.9997 26.7229 37.9997 24.541V7.12435C37.9997 4.94252 36.2232 3.16602 34.0413 3.16602ZM10.2913 6.33268H34.0413C34.4783 6.33268 34.833 6.68735 34.833 7.12435V18.3644L29.8313 12.5283C29.3008 11.906 28.5329 11.5735 27.708 11.5545C26.8878 11.5593 26.1183 11.9234 25.5927 12.5536L19.7122 19.6121L17.7963 17.701C16.7133 16.618 14.9511 16.618 13.8697 17.701L9.49967 22.0694V7.12435C9.49967 6.68735 9.85434 6.33268 10.2913 6.33268Z"
                                                    fill="#E0E0E0"
                                                />
                                            </svg>
                                            <p className=" !text-[0.75rem]  !text-lightgray mt-4 text-center font-Circular-Medium">
                                                Click to upload Cover
                                            </p>
                                            <p className=" !text-[0.75rem]  !text-[#8D8C8C;]  text-center font-Circular-Medium">
                                                File size must not exceed 2MB.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </label>
                    </div>
                </div>
                <p className="text-white xl:text-lg mt-10 mb-3">Collection Name*</p>
                <Input
                    className=" placeholder:!text-[#A1A1A5] "
                    placeholder="Melinine Veroks"
                    name="name"
                    value={values.name}
                    onchange={handleChange}
                />
                <p className="xl:text-lg mt-5">
                    <span className="text-white">Headline</span> (Optional)
                </p>
                <p className="text-xs mt-1 mb-3">
                    This healdline will be included on collection detail page. It gives an idea of your collection.
                </p>
                <Input
                    className=" placeholder:!text-[#A1A1A5]"
                    placeholder="Melinine Veroks"
                    name="headline"
                    value={values.headline}
                    maxLength={100}
                    onchange={handleChange}
                />
                <p className="text-white xl:text-lg mt-5 mb-3">Maximum number of NFTs*</p>
                <Input
                    className=" placeholder:!text-[#A1A1A5] "
                    placeholder="12"
                    name="numberOfNfts"
                    value={values.numberOfNfts}
                    onchange={handleChange}
                    type="number"
                />
                <p className="text-white xl:text-lg mt-3 mb-3">Website</p>
                <Input
                    className=" placeholder:!text-[#A1A1A5] "
                    placeholder="Melinine Veroks"
                    name="website"
                    value={values.website}
                    onchange={handleChange}
                />
                <p className="text-white xl:text-lg mt-3 mb-3">Twitter</p>
                <Input
                    className=" placeholder:!text-[#A1A1A5] "
                    placeholder="Melinine Veroks"
                    name="twitter"
                    value={values.twitter}
                    onchange={handleChange}
                />
                <p className="text-white xl:text-lg mt-3 mb-3">Instagram</p>
                <Input
                    className=" placeholder:!text-[#A1A1A5] "
                    placeholder="Melinine Veroks"
                    name="instagram"
                    value={values.instagram}
                    onchange={handleChange}
                />
                <p className="text-white xl:text-lg mt-3 mb-3">Facebook</p>
                <Input
                    className=" placeholder:!text-[#A1A1A5] "
                    placeholder="Melinine Veroks"
                    name="facebook"
                    value={values.facebook}
                    onchange={handleChange}
                />
                <p className=" xl:text-lg mt-5 mb-3">
                    <span className="text-white">Collection Video</span> (Optional)
                </p>
                <div className="relative">
                    <Input
                        className=" placeholder:!text-[#A1A1A5] pr-[60px] h-[40px]"
                        placeholder={'Tap to Upload Video'}
                        name="videoUrl"
                        // value={values.videoUrl}
                        disabled={true}
                    />
                    <label className="cursor-pointer block absolute h-full right-0 top-0">
                        <>
                            <input
                                disabled={videoLoading}
                                type="file"
                                accept="video/*"
                                className="w-0 absolute  "
                                onClick={(event: any) => {
                                    event.target.value = null;
                                }}
                                onChange={(e: any) => {
                                    e.preventDefault();
                                    setLoadingVideo(true);
                                    uploadtoS3(e.target.files[0]);
                                }}
                            />
                            <div className="h-full w-[40px] font-Proxima-Bold text-2xl text-black rounded-xl bg-themecolor flex justify-center items-center">
                                <svg
                                    width="25"
                                    height="15"
                                    viewBox="0 0 62 49"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M43 40H47.5C54.9558 40 61 33.9558 61 26.5C61 19.0442 54.9558 13 47.5 13H46.8789C44.9201 6.07449 38.5527 1 31 1C23.4473 1 17.0799 6.07449 15.1211 13H14.5C7.04416 13 1 19.0442 1 26.5C1 33.9558 7.04416 40 14.5 40H19"
                                        stroke="#000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M31 47.5V17.5M31 17.5L20.5 28M31 17.5L41.5 28"
                                        stroke="#000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </>
                    </label>
                </div>
                <Button
                    className="w-full mt-14 rounded-[3.125rem] lg:text-xl gold text-black2"
                    type="submit"
                    isLoading={loading || loadingUploadCover || loadingUploadLogo || videoLoading}
                    disabled={loading || loadingUploadCover || loadingUploadLogo || videoLoading}>
                    Submit
                </Button>
            </form>
            {state && (
                <Poups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={data1}
                    setPopup={undefined}
                    type={type}
                    setImage={callS3}
                />
            )}
        </div>
    );
};
