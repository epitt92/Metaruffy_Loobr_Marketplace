import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import { createFeed } from '../../redux/user/actions';
import { generateFileUrl, uploadFile } from '../../services/upload.service';
import { fetchImage } from '../../utils/functions';
import Button from '../Button/Button';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
import ImageComponent from '../Image/ImageComponent';
import MentionedInput from '../mentionedInput/mentionedInput';
import Uploadvideo from '../popup/Uploadvideo';
import Newpost from './Newpost';

interface IProps {
    user: any;
    nft: any;
    setNft: Function;
    setPopup: Function;
    setState: Function;

    values: any;
    setValues: Function;
    file: any;
    setFile: Function;
    setData: Function;
    data: any;
    feedFile: any;
    setfeedFile: Function;
    userName: any;
    collectionId?: any;
}
export const FeedPost = ({
    user,
    nft,
    setNft,
    setPopup,
    setState,

    values,
    setValues,
    setFile,
    file,
    setData,
    data,
    feedFile,
    setfeedFile,
    userName,
    collectionId
}: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [mentionedUsers, setMentionedUsers] = useState<any>([]);
    const [type, setType] = useState<string>('');
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');
    const [length, setLength] = useState<number>(0);
    const [emoji, setEmoji] = useState<any>(null);
    const loadingCreateFeed = useSelector((state: any) => state.user.loadingcreatefeed);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [date, setDate] = useState<any>(null);
    console.log(collectionId);

    useEffect(() => {
        if (confirm) {
            setConfirm(false);
            setNft(null);
            setFile(null);
            setValues({ text: '', user: user?.userId });
            if (date) {
                router.push(`/profile/${user?.userName}/?schedule=${true}`);
                setDate(null);
            }
        }
    }, [confirm]);
    // this is for posting any feed
    const UploadImage = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        // if (more300) return;
        if (values.text.replace(/\r?\n/g, '').length < 1 && !nft && !file) {
            return;
        }
        if (date && date < new Date()) {
            toast.error('Please select a suitable time');
            return;
        }
        const data = new FormData();
        const meentioned: Array<string> = [];
        let newText: any = values.text;
        newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
        newText = newText.split('###__').join('<a target="_blank" href=/profile/');
        newText = newText.split('^^__').join('>');
        newText = newText.split('###^^^').join(' </a>');
        let regix = /#(\S*)/g;
        let alltags: any = [];
        let text = newText;
        if (!userName) {
            text = newText.replace(regix, function (url: any) {
                let newurl = url.split('#');
                if (!alltags?.includes(newurl[1])) {
                    alltags.push(newurl[1]);
                }
                return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
            });
        }
        text = text.replace(/\r?\n/g, '<br/>');
        text = text.trim();
        if (userName) {
            data.append('userName', userName);
        }
        if (!file && text == '' && !nft) {
            toast.error('No image or text added');
        } else if (file) {
            // console.log('Inside file');
            data.append('text', text);
            data.append('file', file);
            data.append('type', type);
            collectionId && data.append('collections', collectionId);
            for (var i = 0; i < mentionedUsers.length; i++) {
                data.append('mentioned', mentionedUsers[i]);
            }
            for (var i = 0; i < alltags.length; i++) {
                data.append('tags', alltags[i]);
            }
            date && data.append('schduleTime', new Date(date).toUTCString());
            //@ts-ignore
            dispatch(createFeed(data, () => {}, setConfirm));
        } else if (nft) {
            data.append('nft', nft._id);
            data.append('type', 'nft');
            collectionId && data.append('collections', collectionId);
            date && data.append('schduleTime', new Date(date).toUTCString());
            //@ts-ignore
            dispatch(createFeed(data, () => {}, setConfirm));
        } else {
            data.append('text', text);
            data.append('type', 'text');
            collectionId && data.append('collections', collectionId);
            date && data.append('schduleTime', new Date(date).toUTCString());
            for (var i = 0; i < mentionedUsers.length; i++) {
                data.append('mentioned', mentionedUsers[i]);
            }
            for (var i = 0; i < alltags.length; i++) {
                data.append('tags', alltags[i]);
            }

            //@ts-ignore
            dispatch(createFeed(data, () => {}, setConfirm));
        }
    };
    // const setEmoji = (e: any) => {
    //     let a = values.text.concat(e);
    //     setValues({ ...values, text: a });
    // };
    useEffect(() => {
        if (emoji) {
            let a = values.text.concat(emoji);
            setEmoji(null);
            setValues({ ...values, text: a });
        }
    }, [emoji]);
    // const checkLength = () => {
    //     let text = values.text;
    //     text = text
    //         .replace(/(?:\_\_)(.{26})(?:\_\_)/gm, '')
    //         .replaceAll('@@@', '')
    //         .replaceAll('^^^', '');
    //     return text.length;
    // };
    useEffect(() => {
        if (feedFile) {
            callS3(feedFile);
            setfeedFile(null);
        }
    }, [feedFile]);
    const callS3 = async (file: any) => {
        setState(-1);
        setPopup(false);
        const image = dataURLtoFile(file, fileName);

        setLoadingUpload(true);
        let name = `${new Date().valueOf()}.${image.name.split('.')[1]}`;
        try {
            let type = image.type;
            // let url = await generateFileUrl({ name, mime: type });
            let newUrl = await uploadFile(image);
            setFile(newUrl);
            setType('image');
            setLoadingUpload(false);
        } catch (err) {}
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
    const emojo = useMemo(() => <EmojiPicker setEmoji={setEmoji} className={'!bottom-auto'} />, []);
    return (
        <div
            className={`w-full border-2   border-[#2B2B35]  rounded-3xl px-3  relative sm:sticky z-30  bg-darkgray top-0 sm:top-[92.8px] pt-3 pb-5 flex flex-col justify-between mb-6`}>
            <form onSubmit={UploadImage} key="posting">
                <div className="flex items-start mb-4 ">
                    <figure className="flex items-center justify-center flex-shrink-0 mr-4 rounded-full w-14 h-14 UerProfileImage">
                        {user?.avatar ? (
                            <ImageComponent
                                width={56}
                                height={56}
                                className="rounded-full"
                                src={user?.avatar}
                                alt=""
                                transformation={TRANSFORMATION_NAMES.fit_50x50}
                            />
                        ) : (
                            <p className="flex items-center justify-center w-full h-full text-2xl rounded-full bg-themecolor text-black1">
                                {user?.firstName?.charAt(0).toUpperCase()}
                            </p>
                        )}
                    </figure>
                    <div className="relative z-20 flex flex-col items-end w-full gap-10 mt-2">
                        <MentionedInput
                            setLength={setLength}
                            autoFocuss={router.query.bottom ? false : true}
                            // emoji={emoji}
                            // setMore300={setMore300}
                            disabled={loadingCreateFeed}
                            styles={'w-full  braek break-words'}
                            singleLine={false}
                            placeHolder={`${nft?.nft ? '' : 'Write Something...'}`}
                            value={nft && nft?.nft ? (nft?.nft?.description ? nft?.nft?.description : '') : values.text}
                            nftDisabled={nft?.nft ? true : false}
                            setMentionedUsers={setMentionedUsers}
                            setValues={(value: any) =>
                                setValues({
                                    ...values,
                                    text: value
                                })
                            }
                            textsize={nft && 'textsize'}
                        />
                        {!nft?.nft && (
                            <p className="mt-16 ml-auto text-sm ">
                                {length}
                                /300 characters
                            </p>
                        )}
                    </div>
                </div>
                {loadingUpload && (
                    <div className="relative mb-4 overflow-hidden ChooseFullImage rounded-xl">
                        <div className="text-center ">
                            <figure className="mt-0 mb-8">
                                <div className="loadingio-spinner-rolling-jz7efhw30v">
                                    <div className="ldio-fcd0x3izul5">
                                        <div></div>
                                    </div>
                                </div>
                            </figure>
                        </div>
                    </div>
                )}
                {file && (
                    <>
                        {type == 'image' ? (
                            <div className="ChooseFullImage relative rounded-xl   bg-[#2B2B35] overflow-hidden mb-4 ">
                                <div
                                    className="absolute top-0 right-[0px] cursor-pointer z-10"
                                    onClick={() => {
                                        setFile(null);
                                        setType('');
                                    }}>
                                    <svg
                                        width="46"
                                        height="46"
                                        viewBox="0 0 46 46"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="23" cy="23" r="23" transform="rotate(-180 23 23)" fill="#363642" />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M30.5023 15.4966C30.8013 15.7956 30.9692 16.2011 30.9692 16.6239C30.9692 17.0467 30.8013 17.4522 30.5023 17.7513L25.2496 23.0006L30.5023 28.2498C30.8018 28.5493 30.97 28.9554 30.97 29.3788C30.97 29.8022 30.8018 30.2083 30.5023 30.5077C30.2029 30.8072 29.7968 30.9754 29.3733 30.9754C28.9499 30.9754 28.5438 30.8072 28.2443 30.5077L22.9948 25.2553L17.7452 30.5077C17.5969 30.656 17.4209 30.7736 17.2272 30.8538C17.0335 30.9341 16.8259 30.9754 16.6162 30.9754C16.4065 30.9754 16.1989 30.9341 16.0052 30.8538C15.8115 30.7736 15.6354 30.656 15.4872 30.5077C15.3389 30.3595 15.2213 30.1835 15.1411 29.9898C15.0608 29.7961 15.0195 29.5885 15.0195 29.3788C15.0195 29.1691 15.0608 28.9615 15.1411 28.7678C15.2213 28.5741 15.3389 28.3981 15.4872 28.2498L20.7399 23.0006L15.4872 17.7513C15.1878 17.4518 15.0195 17.0458 15.0195 16.6223C15.0195 16.1989 15.1878 15.7928 15.4872 15.4934C15.7866 15.1939 16.1927 15.0257 16.6162 15.0257C17.0396 15.0257 17.4458 15.1939 17.7452 15.4934L22.9948 20.7458L28.2443 15.4934C28.3925 15.3449 28.5684 15.2271 28.7622 15.1467C28.9559 15.0663 29.1636 15.0249 29.3733 15.0249C29.5831 15.0249 29.7908 15.0663 29.9845 15.1467C30.1782 15.2271 30.3542 15.3449 30.5023 15.4934V15.4966Z"
                                            fill="#777E91"
                                        />
                                    </svg>
                                </div>
                                {/* <div className="NormalImage">
                                    <Image width={200} height={200} src={URL.createObjectURL(file)} />
                                </div>
                                <div className="BluredImage">
                                    <Image width={200} height={200} src={URL.createObjectURL(file)} />
                                </div> */}
                                <div className="relative NormalImage bg-[#2B2B35]">
                                    <Image width={200} height={200} src={file} />
                                </div>
                                <div className="BluredImage">
                                    <Image width={200} height={200} src={file} />
                                </div>
                            </div>
                        ) : (
                            <div className="ChooseFullImage   flex justify-center relative rounded-xl bg-[#2B2B35] overflow-hidden mb-4 ">
                                <div
                                    className="absolute top-0 right-[0px] cursor-pointer z-10"
                                    onClick={() => {
                                        setFile(null);
                                        setType('');
                                    }}>
                                    <svg
                                        width="46"
                                        height="46"
                                        viewBox="0 0 46 46"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="23" cy="23" r="23" transform="rotate(-180 23 23)" fill="#363642" />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M30.5023 15.4966C30.8013 15.7956 30.9692 16.2011 30.9692 16.6239C30.9692 17.0467 30.8013 17.4522 30.5023 17.7513L25.2496 23.0006L30.5023 28.2498C30.8018 28.5493 30.97 28.9554 30.97 29.3788C30.97 29.8022 30.8018 30.2083 30.5023 30.5077C30.2029 30.8072 29.7968 30.9754 29.3733 30.9754C28.9499 30.9754 28.5438 30.8072 28.2443 30.5077L22.9948 25.2553L17.7452 30.5077C17.5969 30.656 17.4209 30.7736 17.2272 30.8538C17.0335 30.9341 16.8259 30.9754 16.6162 30.9754C16.4065 30.9754 16.1989 30.9341 16.0052 30.8538C15.8115 30.7736 15.6354 30.656 15.4872 30.5077C15.3389 30.3595 15.2213 30.1835 15.1411 29.9898C15.0608 29.7961 15.0195 29.5885 15.0195 29.3788C15.0195 29.1691 15.0608 28.9615 15.1411 28.7678C15.2213 28.5741 15.3389 28.3981 15.4872 28.2498L20.7399 23.0006L15.4872 17.7513C15.1878 17.4518 15.0195 17.0458 15.0195 16.6223C15.0195 16.1989 15.1878 15.7928 15.4872 15.4934C15.7866 15.1939 16.1927 15.0257 16.6162 15.0257C17.0396 15.0257 17.4458 15.1939 17.7452 15.4934L22.9948 20.7458L28.2443 15.4934C28.3925 15.3449 28.5684 15.2271 28.7622 15.1467C28.9559 15.0663 29.1636 15.0249 29.3733 15.0249C29.5831 15.0249 29.7908 15.0663 29.9845 15.1467C30.1782 15.2271 30.3542 15.3449 30.5023 15.4934V15.4966Z"
                                            fill="#777E91"
                                        />
                                    </svg>
                                </div>
                                <video
                                    id="video-summary"
                                    // autoPlay
                                    width={800}
                                    height={200}
                                    controls
                                    controlsList="nodownload"
                                    className="h-60"
                                    src={file}
                                />
                            </div>
                        )}
                    </>
                )}
                {nft && (
                    <>
                        <div className="ChooseFullImage       relative rounded-xl  bg-[#2B2B35] overflow-hidden mb-4">
                            <div
                                className="absolute top-0 right-[0px] !cursor-pointer z-[60]"
                                onClick={() => {
                                    setNft(null);
                                    setType('');
                                }}>
                                <svg
                                    className="relative z-40 "
                                    width="46"
                                    height="46"
                                    viewBox="0 0 46 46"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="23" cy="23" r="23" transform="rotate(-180 23 23)" fill="#363642" />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M30.5023 15.4966C30.8013 15.7956 30.9692 16.2011 30.9692 16.6239C30.9692 17.0467 30.8013 17.4522 30.5023 17.7513L25.2496 23.0006L30.5023 28.2498C30.8018 28.5493 30.97 28.9554 30.97 29.3788C30.97 29.8022 30.8018 30.2083 30.5023 30.5077C30.2029 30.8072 29.7968 30.9754 29.3733 30.9754C28.9499 30.9754 28.5438 30.8072 28.2443 30.5077L22.9948 25.2553L17.7452 30.5077C17.5969 30.656 17.4209 30.7736 17.2272 30.8538C17.0335 30.9341 16.8259 30.9754 16.6162 30.9754C16.4065 30.9754 16.1989 30.9341 16.0052 30.8538C15.8115 30.7736 15.6354 30.656 15.4872 30.5077C15.3389 30.3595 15.2213 30.1835 15.1411 29.9898C15.0608 29.7961 15.0195 29.5885 15.0195 29.3788C15.0195 29.1691 15.0608 28.9615 15.1411 28.7678C15.2213 28.5741 15.3389 28.3981 15.4872 28.2498L20.7399 23.0006L15.4872 17.7513C15.1878 17.4518 15.0195 17.0458 15.0195 16.6223C15.0195 16.1989 15.1878 15.7928 15.4872 15.4934C15.7866 15.1939 16.1927 15.0257 16.6162 15.0257C17.0396 15.0257 17.4458 15.1939 17.7452 15.4934L22.9948 20.7458L28.2443 15.4934C28.3925 15.3449 28.5684 15.2271 28.7622 15.1467C28.9559 15.0663 29.1636 15.0249 29.3733 15.0249C29.5831 15.0249 29.7908 15.0663 29.9845 15.1467C30.1782 15.2271 30.3542 15.3449 30.5023 15.4934V15.4966Z"
                                        fill="#777E91"
                                    />
                                </svg>
                            </div>
                            <div className="NormalImage relative  !z-50">
                                <ImageComponent
                                    width={200}
                                    height={200}
                                    src={nft?.nft?.fileType == 'glb' ? nft?.nft?.preview : nft?.nft?.image}
                                    quality={50}
                                />
                            </div>
                            <div className="BluredImage -z-20">
                                <ImageComponent width={200} height={200} src={nft?.nft?.image} quality={50} />
                            </div>
                        </div>
                    </>
                )}
                {/* </figure> */}

                {/* <Newpost /> */}
                {date && (
                    <p className="flex items-center justify-start pb-2">
                        <svg
                            className="pr-2"
                            width="30"
                            height="30"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M31.2993 4C32.1484 3.99801 32.8198 4.65768 32.8218 5.53724L32.8238 7.03649C38.333 7.46827 41.9723 11.2224 41.9783 16.9795L42 33.8311C42.0079 40.1079 38.0645 43.97 31.7436 43.98L16.3038 44C10.0224 44.008 6.02965 40.054 6.02175 33.7591L6.00001 17.1054C5.99213 11.3103 9.50307 7.56622 15.0124 7.06048L15.0104 5.56123C15.0084 4.68167 15.66 4.02 16.5289 4.02C17.3977 4.018 18.0494 4.67767 18.0514 5.55723L18.0533 6.95653L29.7828 6.94054L29.7808 5.54124C29.7788 4.66168 30.4305 4.00201 31.2993 4ZM32.105 32.3838H32.0852C31.1769 32.4058 30.4482 33.1674 30.468 34.0869C30.47 35.0065 31.2026 35.7641 32.1109 35.7841C33.037 35.7821 33.7874 35.0205 33.7854 34.0809C33.7854 33.1414 33.0331 32.3838 32.105 32.3838ZM15.8338 32.3858C14.9255 32.4258 14.2146 33.1874 14.2166 34.1069C14.258 35.0265 15.0084 35.7461 15.9167 35.7041C16.8073 35.6642 17.5162 34.9025 17.4748 33.983C17.455 33.0834 16.7224 32.3838 15.8338 32.3858ZM23.9694 32.3758C23.0611 32.4178 22.3522 33.1774 22.3522 34.0969C22.3936 35.0165 23.144 35.7341 24.0523 35.6941C24.9409 35.6522 25.6518 34.8925 25.6103 33.971C25.5906 33.0734 24.858 32.3738 23.9694 32.3758ZM15.8239 25.1894C14.9156 25.2294 14.2067 25.991 14.2087 26.9105C14.2482 27.8301 15.0005 28.5497 15.9088 28.5077C16.7974 28.4678 17.5063 27.7061 17.4649 26.7866C17.4451 25.887 16.7145 25.1874 15.8239 25.1894ZM23.9615 25.1194C23.0532 25.1594 22.3423 25.921 22.3442 26.8406C22.3837 27.7601 23.1361 28.4777 24.0444 28.4378C24.933 28.3958 25.6419 27.6362 25.6024 26.7166C25.5807 25.8171 24.8501 25.1174 23.9615 25.1194ZM32.0971 25.1294C31.1887 25.1494 30.4779 25.889 30.4798 26.8086V26.8306C30.4996 27.7501 31.25 28.4478 32.1603 28.4278C33.0489 28.4058 33.7578 27.6442 33.738 26.7246C33.6965 25.8451 32.9837 25.1274 32.0971 25.1294ZM29.7867 10.019L18.0573 10.035L18.0592 11.6522C18.0592 12.5137 17.4096 13.1934 16.5407 13.1934C15.6719 13.1954 15.0183 12.5177 15.0183 11.6562L15.0163 10.1169C11.1657 10.5028 9.03507 12.7656 9.04098 17.1014L9.04297 17.7231L38.9393 17.6832V16.9835C38.8543 12.6857 36.698 10.4308 32.8277 10.095L32.8297 11.6342C32.8297 12.4938 32.1603 13.1754 31.3112 13.1754C30.4423 13.1774 29.7887 12.4978 29.7887 11.6382L29.7867 10.019Z"
                                fill="#89898F"
                            />
                        </svg>
                        Will schedule post on {date.toString()}{' '}
                        <svg
                            onClick={() => {
                                setDate(null);
                            }}
                            className="pl-2 cursor-pointer"
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M29.3327 16.0013C29.3327 19.5375 27.9279 22.9289 25.4274 25.4294C22.927 27.9299 19.5356 29.3346 15.9993 29.3346C12.4631 29.3346 9.07174 27.9299 6.57126 25.4294C4.07077 22.9289 2.66602 19.5375 2.66602 16.0013C2.66602 12.4651 4.07077 9.0737 6.57126 6.57321C9.07174 4.07273 12.4631 2.66797 15.9993 2.66797C19.5356 2.66797 22.927 4.07273 25.4274 6.57321C27.9279 9.0737 29.3327 12.4651 29.3327 16.0013ZM15.9993 18.0961L19.3949 21.4946C19.5326 21.6324 19.6962 21.7416 19.8761 21.8162C20.0561 21.8907 20.249 21.9291 20.4438 21.9291C20.6386 21.9291 20.8315 21.8907 21.0114 21.8162C21.1914 21.7416 21.3549 21.6324 21.4927 21.4946C21.6304 21.3569 21.7397 21.1934 21.8142 21.0134C21.8888 20.8334 21.9271 20.6405 21.9271 20.4457C21.9271 20.2509 21.8888 20.0581 21.8142 19.8781C21.7397 19.6981 21.6304 19.5346 21.4927 19.3969L18.0942 16.0013L21.4927 12.6057C21.7709 12.3276 21.9271 11.9503 21.9271 11.5569C21.9271 11.1634 21.7709 10.7862 21.4927 10.508C21.2145 10.2298 20.8372 10.0735 20.4438 10.0735C20.0504 10.0735 19.6731 10.2298 19.3949 10.508L15.9993 13.9065L12.6038 10.508C12.3256 10.2298 11.9483 10.0735 11.5549 10.0735C11.1615 10.0735 10.7842 10.2298 10.506 10.508C10.2278 10.7862 10.0716 11.1634 10.0716 11.5569C10.0716 11.9503 10.2278 12.3276 10.506 12.6057L13.9045 16.0013L10.506 19.3969C10.3683 19.5346 10.259 19.6981 10.1845 19.8781C10.1099 20.0581 10.0716 20.2509 10.0716 20.4457C10.0716 20.6405 10.1099 20.8334 10.1845 21.0134C10.259 21.1934 10.3683 21.3569 10.506 21.4946C10.6438 21.6324 10.8073 21.7416 10.9872 21.8162C11.1672 21.8907 11.3601 21.9291 11.5549 21.9291C11.7497 21.9291 11.9426 21.8907 12.1226 21.8162C12.3025 21.7416 12.4661 21.6324 12.6038 21.4946L15.9993 18.0961Z"
                                fill="#89898F"
                            />
                        </svg>
                    </p>
                )}
                <div className="flex justify-between w-full xs:block">
                    <div className="flex flex-wrap items-center gap-3 ">
                        <label className="relative">
                            <input
                                disabled={file || nft || loadingCreateFeed || loadingUpload}
                                type="file"
                                // value={''}
                                onClick={(event: any) => {
                                    event.target.value = null;
                                }}
                                accept="image/* video/*"
                                className="absolute w-0 "
                                onChange={async (e: any) => {
                                    e.preventDefault();
                                    console.log(e?.target?.files[0]);
                                    if (e?.target?.files[0]?.type?.includes('video')) {
                                        try {
                                            setLoadingUpload(true);
                                            let newUrl = await uploadFile(e.target.files[0]);
                                            setFile(newUrl);
                                            setType('video');
                                            setLoadingUpload(false);
                                        } catch (err) {
                                            // setLoadingUpload(false);
                                            // console.log(err);
                                        }
                                    } else {
                                        try {
                                            setFileName(e.target.files[0].name);
                                            setState(52);
                                            setPopup(true);
                                            setData({ url: URL.createObjectURL(e.target.files[0]) });
                                        } catch (err) {
                                            setLoadingUpload(false);
                                            // console.log(err);
                                        }
                                    }
                                }}
                            />
                            <p className="cursor-pointer hover:bg-[#1c1c27] h-[40px] w-[98px] rounded-full xs:w-full text-base !text-white px-5 bg-white bg-opacity-10 justify-center items-center flex gap-2.5">
                                {' '}
                                <svg
                                    className="flex-shrink-0"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M26 10H6C5.46973 10.0005 4.96133 10.2114 4.58637 10.5864C4.21141 10.9613 4.00053 11.4697 4 12V26C4.00053 26.5303 4.21141 27.0387 4.58637 27.4136C4.96133 27.7886 5.46973 27.9995 6 28H26C26.5303 27.9995 27.0387 27.7886 27.4136 27.4136C27.7886 27.0387 27.9995 26.5303 28 26V12C27.9995 11.4697 27.7886 10.9613 27.4136 10.5864C27.0387 10.2114 26.5303 10.0005 26 10V10ZM13 23V15L20 19L13 23ZM6 6H26V8H6V6ZM8 2H24V4H8V2Z"
                                        fill="#fff"
                                    />
                                </svg>
                                <span>Media</span>
                            </p>
                        </label>
                        <button
                            type="button"
                            className="cursor-pointer "
                            onClick={() => {
                                if (!file && !nft && !loadingCreateFeed && !loadingUpload) {
                                    setPopup(true);
                                    setState(40);
                                }
                            }}>
                            <p className="cursor-pointer h-[40px] w-[98px] hover:bg-[#1c1c27] rounded-full xs:w-full text-base !text-white px-5 bg-white bg-opacity-10 justify-center items-center flex gap-2.5">
                                {' '}
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="flex-shrink-0"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.3085 22H3.37708C3.33515 21.9862 3.29321 21.97 3.2519 21.9593C2.99717 21.9031 2.75969 21.7865 2.55948 21.6193C2.35926 21.4521 2.20217 21.2392 2.10145 20.9985C2.05002 20.8654 2.00572 20.7296 1.96875 20.5917V3.37872C2.00005 3.12835 2.14213 2.88862 2.27608 2.67205C2.52645 2.26895 2.90764 2.03298 3.37708 1.97038H16.0521C16.0152 1.96162 16.0884 1.9829 16.0521 1.97038C16.817 2.14439 17.456 2.82164 17.4579 3.60718C17.4633 5.90224 17.4633 8.19731 17.4579 10.4924C17.4579 10.7202 17.3809 10.769 17.1568 10.8135C16.8871 10.8679 16.601 10.9218 16.365 11.0538C15.1889 11.7117 14.0278 12.3964 12.8599 13.0687C12.2709 13.4086 11.9798 13.9149 11.9836 14.5941C11.9836 15.9294 11.9836 17.2647 11.9836 18.6C11.9836 19.2885 12.2759 19.7986 12.8718 20.1404C13.6567 20.5915 14.4397 21.0444 15.2209 21.4993C15.4888 21.6551 15.5094 21.7747 15.3085 22ZM11.5135 14.9583C11.5135 14.8482 11.5135 14.7706 11.5135 14.6923C11.4872 13.7472 11.8966 13.0649 12.7228 12.6017C13.5759 12.1267 14.4128 11.6253 15.2628 11.1427C15.3174 11.118 15.363 11.0769 15.3931 11.025C15.4231 10.9732 15.4362 10.9132 15.4305 10.8535C15.4262 9.16853 15.4262 7.47853 15.4262 5.78853C15.4262 5.46994 15.3686 5.41298 15.0506 5.41298H4.37731C4.06059 5.41298 4.00176 5.47056 4.00176 5.78853V14.5865C4.00176 14.8995 4.05997 14.9583 4.37731 14.9583H11.5129H11.5135ZM11.5135 18.8704H3.85467C3.80271 18.8704 3.73324 18.8579 3.70319 18.8854C3.63684 18.948 3.5536 19.025 3.54671 19.1032C3.54045 19.1696 3.61681 19.2628 3.68191 19.3117C3.73073 19.348 3.81836 19.338 3.88909 19.3386H11.4159C11.4784 19.3386 11.541 19.3336 11.6068 19.3298C11.573 19.1715 11.5454 19.0319 11.5104 18.8704H11.5135ZM11.5135 16.9926H3.8772C3.83151 16.9926 3.77016 16.9763 3.74325 16.9995C3.66751 17.0658 3.55547 17.1478 3.55547 17.2248C3.55547 17.3018 3.66376 17.3907 3.74325 17.4533C3.77955 17.4821 3.85654 17.4621 3.91538 17.4621H11.5085L11.5135 16.9926ZM5.57346 4.00464H7.2741C7.4963 4.00464 7.60897 3.92077 7.60521 3.76429C7.60146 3.60781 7.48942 3.5352 7.27723 3.5352C6.70388 3.5352 6.13053 3.5352 5.55719 3.5352C4.98384 3.5352 4.41049 3.5352 3.83714 3.5352C3.63872 3.5352 3.51917 3.63347 3.53732 3.78557C3.55735 3.95394 3.6719 4.00652 3.82838 4.0059C4.40986 4.00339 4.98822 4.00464 5.56845 4.00464H5.57346Z"
                                        fill="#fff"
                                    />
                                    <path
                                        d="M22.0003 14.2936V18.8704C21.8908 19.3373 21.5766 19.6177 21.171 19.8456C20.0806 20.4577 19.0003 21.0874 17.9206 21.719C17.4536 21.9925 17.0042 21.9919 16.5373 21.719C15.4068 21.0588 14.2731 20.4045 13.136 19.7561C12.6722 19.4913 12.4475 19.1101 12.4512 18.575C12.4591 17.2643 12.4591 15.9538 12.4512 14.6435C12.4475 14.1002 12.6709 13.714 13.1397 13.4455C14.2664 12.8045 15.3885 12.1563 16.506 11.5007C16.9936 11.2134 17.453 11.2091 17.9412 11.497C18.9903 12.1154 20.0454 12.7238 21.1065 13.3222C21.5196 13.55 21.8651 13.8204 22.0003 14.2936ZM15.3499 16.853L15.3142 16.8668C15.0175 16.3723 14.7189 15.8785 14.4235 15.3827C14.3522 15.2632 14.272 15.1605 14.1156 15.2043C13.9591 15.2482 13.9397 15.3733 13.9403 15.5173C13.9403 16.1432 13.9403 16.7692 13.9403 17.3951C13.9403 17.5203 13.9403 17.6455 13.9403 17.7663C13.9453 17.9108 14.021 18.006 14.1669 18.0091C14.3234 18.0122 14.401 17.914 14.4072 17.7587C14.4072 17.6962 14.4072 17.6286 14.4072 17.5635V16.2872C14.4698 16.3905 14.5068 16.4431 14.5393 16.4969C14.8078 16.9432 15.077 17.3888 15.343 17.8364C15.4118 17.9515 15.4957 18.0392 15.6409 17.9985C15.7862 17.9578 15.8168 17.8445 15.8168 17.7074C15.8143 16.9713 15.8143 16.2352 15.8168 15.4992C15.8168 15.3358 15.7693 15.2125 15.5884 15.1968C15.4369 15.1837 15.348 15.3014 15.3474 15.5048C15.3486 15.9542 15.3499 16.4036 15.3499 16.853ZM16.7657 15.6638C17.1519 15.6638 17.5168 15.6638 17.8805 15.6638C18.0395 15.6638 18.1572 15.6012 18.1609 15.4341C18.1647 15.2669 18.0539 15.1943 17.893 15.1937C17.4499 15.1937 17.0067 15.1937 16.5636 15.1937C16.3758 15.1937 16.2906 15.2795 16.29 15.4716C16.29 16.2271 16.29 16.9832 16.29 17.7387C16.2897 17.7766 16.297 17.8142 16.3114 17.8492C16.3258 17.8842 16.347 17.916 16.3739 17.9428C16.4315 17.9853 16.5535 18.0141 16.5999 17.9816C16.6795 17.9233 16.733 17.8361 16.7488 17.7387C16.7676 17.4689 16.7557 17.1967 16.7557 16.9137H17.0555C17.2965 16.9137 17.5381 16.9188 17.7791 16.9137C17.8105 16.9155 17.8419 16.9103 17.8711 16.8987C17.9004 16.8871 17.9267 16.8693 17.9484 16.8465C17.97 16.8237 17.9865 16.7965 17.9966 16.7667C18.0067 16.7369 18.0102 16.7053 18.0069 16.674C18.0032 16.5382 17.9168 16.4618 17.7816 16.4499C17.719 16.4437 17.6514 16.4499 17.5863 16.4499H16.767L16.7657 15.6638ZM19.8096 15.6638C19.9648 15.6638 20.0938 15.6638 20.2233 15.6638C20.4111 15.66 20.5238 15.5668 20.51 15.4209C20.4944 15.2532 20.3848 15.1937 20.2258 15.1943C19.7877 15.1943 19.3533 15.1943 18.917 15.1943C18.7574 15.1943 18.6423 15.2569 18.6416 15.4272C18.641 15.5974 18.7543 15.6638 18.9139 15.6638H19.3402V17.0608C19.3402 17.2824 19.3402 17.504 19.3402 17.7249C19.3402 17.8839 19.4028 17.9935 19.5693 18.0072C19.7151 18.0198 19.8052 17.9058 19.8102 17.7181C19.8102 17.6599 19.8102 17.601 19.8102 17.5422L19.8096 15.6638Z"
                                        fill="#fff"
                                    />
                                    <path
                                        d="M17.9301 7.54489V4.43529C17.9301 4.0879 18.0653 4.0034 18.3833 4.15112C19.2271 4.54379 20.0706 4.93687 20.9139 5.33037C21.8484 5.76851 22.1858 6.69426 21.7508 7.6319C21.1295 8.97221 20.5052 10.3113 19.878 11.6491C19.756 11.9114 19.6521 11.9452 19.4061 11.8037C18.9823 11.5602 18.5623 11.3117 18.1354 11.0739C18.0681 11.0421 18.0121 10.9906 17.9749 10.9262C17.9376 10.8618 17.9209 10.7875 17.927 10.7133C17.9333 9.65739 17.9301 8.60083 17.9301 7.54489Z"
                                        fill="#fff"
                                    />
                                    <path
                                        d="M11.9526 9.87655C11.9426 10.1976 11.8437 10.4073 11.6253 10.5357C11.1032 10.8424 10.5775 11.1426 10.0479 11.4364C9.94269 11.4964 9.8232 11.527 9.70203 11.525C9.58087 11.5229 9.4625 11.4881 9.3594 11.4245C8.85428 11.1397 8.34979 10.8542 7.84904 10.5619C7.48789 10.351 7.37647 9.9479 7.58491 9.58299C8.08565 8.70669 8.59035 7.83248 9.09902 6.96036C9.39508 6.45962 10.0473 6.45962 10.344 6.9685C10.8514 7.83353 11.3521 8.70231 11.8462 9.57485C11.892 9.67146 11.9277 9.77257 11.9526 9.87655Z"
                                        fill="#fff"
                                    />
                                    <path
                                        d="M9.71606 13.8261C9.61121 13.8267 9.50755 13.8037 9.41283 13.7587C9.31811 13.7138 9.23476 13.648 9.169 13.5663C8.6449 12.935 8.12329 12.3022 7.60419 11.6679C7.45334 11.4839 7.44958 11.2923 7.57978 11.1352C7.70997 10.9781 7.91841 10.9518 8.12559 11.0808C8.58439 11.3656 9.04382 11.6504 9.49636 11.9452C9.56009 11.9952 9.63878 12.0224 9.71982 12.0224C9.80085 12.0224 9.87954 11.9952 9.94327 11.9452C10.3852 11.6572 10.8333 11.3818 11.2796 11.0995C11.505 10.9587 11.7053 10.9681 11.8467 11.1215C11.9882 11.2748 11.9838 11.4876 11.8079 11.7011C11.3034 12.3145 10.7977 12.9272 10.2907 13.5394C10.2233 13.628 10.1364 13.7 10.0368 13.7497C9.93714 13.7994 9.82741 13.8255 9.71606 13.8261V13.8261Z"
                                        fill="#fff"
                                    />
                                </svg>
                                <span>NFT</span>
                            </p>
                        </button>
                        {router?.pathname?.includes('feeds') && (
                            <button
                                type="button"
                                className="cursor-pointer "
                                onClick={() => {
                                    setState(92);
                                    setPopup(true);
                                }}>
                                <p className="cursor-pointer h-[40px] w-[98px] hover:bg-[#1c1c27] rounded-full xs:w-full text-base !text-white px-5 bg-white bg-opacity-10 justify-center items-center flex gap-2.5">
                                    {' '}
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M19 2H5C3.9 2 3 3 3 4.22222V19.7778C3 21 3.9 22 5 22H19C20.1 22 21 21 21 19.7778V4.22222C21 3 20.1 2 19 2ZM8 17.5556C7.45 17.5556 7 17.0556 7 16.4444V10.8889C7 10.2778 7.45 9.77778 8 9.77778C8.55 9.77778 9 10.2778 9 10.8889V16.4444C9 17.0556 8.55 17.5556 8 17.5556ZM12 17.5556C11.45 17.5556 11 17.0556 11 16.4444V7.55556C11 6.94444 11.45 6.44444 12 6.44444C12.55 6.44444 13 6.94444 13 7.55556V16.4444C13 17.0556 12.55 17.5556 12 17.5556ZM16 17.5556C15.45 17.5556 15 17.0556 15 16.4444V14.2222C15 13.6111 15.45 13.1111 16 13.1111C16.55 13.1111 17 13.6111 17 14.2222V16.4444C17 17.0556 16.55 17.5556 16 17.5556Z"
                                            fill="white"
                                        />
                                    </svg>
                                    <span>Poll</span>
                                </p>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-0 xs:mt-4">
                        <div className="relative Atemojiholder">{emojo}</div>
                        <div
                            className="  inline-flex font-Proxima-Bold items-center  justify-center cursor-pointer bg-themecolor relative text-black2 rounded-full h-[2.938rem] w-[2.938rem] gold"
                            onClick={() => {
                                setState(91);
                                setPopup(true);
                                setData({ setDate: setDate });
                            }}>
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="23.5" cy="23.5" r="23.5" fill="#EFC74D" />
                                <g clip-path="url(#clip0_5678_21062)">
                                    <path
                                        d="M34.4744 12.9867C33.7269 12.2478 32.7442 11.7942 31.6969 11.7047C30.6497 11.6151 29.6042 11.8954 28.7422 12.4967C31.5132 13.6504 33.7769 15.7623 35.12 18.4467C35.6384 17.5955 35.8565 16.595 35.7395 15.6053C35.6224 14.6155 35.177 13.6935 34.4744 12.9867Z"
                                        fill="#14141F"
                                    />
                                    <path
                                        d="M18.8834 12.6678C18.0249 11.9859 16.9465 11.6419 15.8518 11.7007C14.7571 11.7594 13.7217 12.2169 12.9411 12.9867C12.167 13.7659 11.7085 14.804 11.6539 15.9011C11.5994 16.9982 11.9526 18.0766 12.6456 18.9289C13.8935 16.1522 16.1114 13.9261 18.8834 12.6678Z"
                                        fill="#14141F"
                                    />
                                    <path
                                        d="M23.9992 13.1111C21.8493 13.1156 19.7489 13.7563 17.9626 14.9526C16.1763 16.1489 14.7841 17.8472 13.9615 19.8335C13.1389 21.8198 12.9226 24.0051 13.34 26.1141C13.7574 28.2231 14.7898 30.1613 16.307 31.6844L14.3237 33.6678C14.2516 33.7413 14.1948 33.8283 14.1564 33.9238C14.1181 34.0193 14.0989 34.1214 14.0999 34.2244C14.101 34.3273 14.1224 34.429 14.1628 34.5236C14.2031 34.6183 14.2618 34.7041 14.3353 34.7761C14.4089 34.8481 14.4959 34.9049 14.5914 34.9433C14.6869 34.9817 14.789 35.0009 14.8919 34.9998C14.9948 34.9987 15.0965 34.9774 15.1912 34.937C15.2859 34.8966 15.3716 34.838 15.4437 34.7644L17.5125 32.6956C19.4045 34.1273 21.7149 34.8968 24.0875 34.8856C26.4601 34.8743 28.7631 34.0829 30.6414 32.6333L32.7725 34.7644C32.9213 34.8919 33.1127 34.9585 33.3085 34.9509C33.5042 34.9433 33.6899 34.8622 33.8284 34.7237C33.9669 34.5851 34.0481 34.3995 34.0557 34.2037C34.0632 34.008 33.9966 33.8166 33.8692 33.6678L31.777 31.6067C33.2729 30.0745 34.2838 28.1352 34.6833 26.0315C35.0828 23.9277 34.8531 21.7529 34.0231 19.779C33.193 17.8051 31.7993 16.1198 30.0164 14.9338C28.2335 13.7478 26.1405 13.1138 23.9992 13.1111ZM29.8092 26.6678C29.7201 26.8531 29.5613 26.9955 29.3674 27.064C29.1736 27.1325 28.9605 27.1215 28.7748 27.0333L23.2214 24.3422V17.5367C23.2214 17.3304 23.3034 17.1326 23.4492 16.9867C23.5951 16.8408 23.7929 16.7589 23.9992 16.7589C24.2055 16.7589 24.4033 16.8408 24.5492 16.9867C24.695 17.1326 24.777 17.3304 24.777 17.5367V23.37L29.4437 25.6333C29.5368 25.6761 29.6205 25.7367 29.6901 25.8119C29.7597 25.8871 29.8137 25.9753 29.8491 26.0714C29.8845 26.1675 29.9006 26.2697 29.8964 26.372C29.8923 26.4744 29.8679 26.5749 29.8248 26.6678H29.8092Z"
                                        fill="#14141F"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_5678_21062">
                                        <rect width="28" height="28" fill="white" transform="translate(10 10)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <Button
                            className="relative inline-flex items-center justify-center px-12 py-2 rounded-full font-Proxima-Bold bg-themecolor text-black2 gold"
                            isLoading={loadingCreateFeed}
                            disabled={loadingCreateFeed || loadingUpload}
                            onClick={UploadImage}
                            type="submit">
                            {date ? 'Schedule' : 'Post'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
