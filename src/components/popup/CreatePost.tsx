import React, { useState, useEffect, useMemo } from 'react';
import Button from '../Button/Button';
import Input from '../input/Input';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { createFeed } from '../../redux/user/actions';
import MentionedInput from '../mentionedInput/mentionedInput';
import { toast } from 'react-toastify';
import { EmojiPicker } from '../EmojiPicker/EmojiPicker';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
import { fetchImage } from '../../utils/functions';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
import Video from '../../modules/SocialFeedsOnlyModule/video';
const CreatePost = ({ data, setstate, setPopup, setConfirmed }: any) => {
    const [length, setLength] = useState<number>(0);
    const loadingCreateFeed = useSelector((state: any) => state.user.loadingcreatefeed);
    const [mentionedUsers, setMentionedUsers] = useState<any>([]);
    const [emoji, setEmoji] = useState<any>(null);
    const user = useSelector((state: any) => state.auth.user);
    const [values, setValues] = useState({
        text: '',
        user: user.userId
    });
    // const [confirmed, setConfirmed] = useState<boolean>(false);
    const [loadinglocal, setLoading] = useState(false);
    const loading = useSelector((state: any) => state.user.loadingcreatefeed);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!loading && loadinglocal) {
            setPopup(false);
            setstate(-1);
            setLoading(false);
        }
    }, [loading]);
    const Upload = async (event: any) => {
        event.preventDefault();
        if (values.text == '') {
            toast.error('Please add the text');
        } else {
            setLoading(true);

            // if (more300) return;
            if (values.text.replace(/\r?\n/g, '').length < 1) {
                return;
            }
            const formData = new FormData();
            const meentioned: Array<string> = [];
            let newText: any = values.text;
            newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
            newText = newText.split('###__').join('<a target="_blank" href=/profile/');
            newText = newText.split('^^__').join('>');
            newText = newText.split('###^^^').join(' </a>');
            let regix = /#(\S*)/g;
            let alltags: any = [];
            let text = newText.replace(regix, function (url: any) {
                let newurl = url.split('#');
                if (!alltags.includes(newurl[1])) {
                    alltags.push(newurl[1]);
                }
                return `<a href=${`/search?id=${newurl[1]}`}>   ${url} </a>`;
            });
            text = text.replace(/\r?\n/g, '<br/>');
            text = text.trim();

            if (text == '') {
                toast.error('No text added');
            }
            // console.log('Inside text');
            else formData.append('text', text);
            formData.append('type', 'text');
            formData.append('feed', data?._id);
            for (var i = 0; i < mentionedUsers.length; i++) {
                formData.append('mentioned', mentionedUsers[i]);
            }
            for (var i = 0; i < alltags.length; i++) {
                formData.append('tags', alltags[i]);
            }
            //@ts-ignore
            dispatch(createFeed(formData, () => {}, setConfirmed));
        }
        //@ts-ignore
        // dispatch(createFeed({ ...values }));
    };

    function urlify(text: string) {
        var urlRegex = /(https?:\/\/[^\s^\<]+)/g;

        return text.replace(urlRegex, function (url) {
            return `<a target="_blank" href=${url}>  ${url} </a>`;
        });
    }
    useEffect(() => {
        if (emoji) {
            let a = values.text.concat(emoji);
            setEmoji(null);
            setValues({ ...values, text: a });
        }
    }, [emoji]);
    const emojo = useMemo(() => <EmojiPicker setEmoji={setEmoji} className={'!bottom-auto'} />, []);
    const calculatepercentage1 = (option: any, poll: any) => {
        let t: Number = 0;
        for (const q of poll?.options) {
            t = t + q?.vote?.length;
        }
        return (option?.vote?.length / Number(t)) * 100 ? ((option?.vote?.length / Number(t)) * 100).toFixed(1) : 0;
    };
    const totalvotes = (poll: any) => {
        let t: Number = 0;
        for (const q of poll?.options) {
            t = t + q?.vote?.length;
        }
        return t;
    };
    return (
        <div className="sm:w-[50rem] w-[40rem] xs:w-[25rem] rounded-[12px] ">
            <div
                className={`w-full border-b-2 border-[#2B2B35] bg-darkgray p-6 flex flex-col justify-between mb-6 pt-[48px]`}>
                <form key="posting">
                    <div className="flex  items-start mb-4 ">
                        <figure className="w-14 h-14 rounded-full UerProfileImage flex items-center justify-center flex-shrink-0 mr-4">
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
                                <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                    {user?.firstName?.charAt(0).toUpperCase()}
                                </p>
                            )}
                        </figure>
                        <div className="flex flex-col gap-10 items-end  mt-2  w-full relative z-20">
                            <MentionedInput
                                setLength={setLength}
                                autoFocuss={true}
                                // emoji={emoji}
                                // setMore300={setMore300}
                                disabled={loadingCreateFeed}
                                styles={'w-full  braek break-words'}
                                singleLine={false}
                                placeHolder={`${'Write Something...'}`}
                                value={values.text}
                                setMentionedUsers={setMentionedUsers}
                                setValues={(value: any) =>
                                    setValues({
                                        ...values,
                                        text: value
                                    })
                                }
                            />

                            <p className="ml-auto mt-16 text-sm ">
                                {length}
                                /300 characters
                            </p>
                        </div>
                    </div>
                    {/* <Newpost /> */}

                    <div className="w-full sm:flex justify-end">
                        <div className="flex justify-end mt-4 sm:mt-0 items-center gap-2">
                            <div className="relative Atemojiholder z-10">{emojo}</div>
                            <Button
                                className=" inline-flex font-Proxima-Bold items-center  justify-center bg-themecolor relative text-black2 rounded-full py-2 px-12 gold"
                                // isLoading={loadingCreateFeed}
                                // disabled={loadingCreateFeed || loadingUpload}
                                // onClick={UploadImage}
                                type="submit"
                                onClick={Upload}
                                disabled={loading}
                                isLoading={loading}>
                                Repost
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="p-6">
                <div className="w-full h-auto  border-[#2B2B35] rounded-3xl border-2 overflow-hidden">
                    <div className="w-full flex flex-row justify-between  items-center p-5">
                        <div>
                            <div className="flex  gap-5 items-center">
                                <figure className="w-14 h-14 rounded-full UerProfileImage  flex items-center justify-center ">
                                    {data?.user?.avatar ? (
                                        <ImageComponent
                                            className="rounded-full "
                                            src={data?.user?.avatar}
                                            alt=""
                                            height={56}
                                            width={56}
                                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                                        />
                                    ) : (
                                        <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                            {data?.user?.firstName?.charAt(0).toUpperCase()}
                                        </p>
                                    )}
                                </figure>
                                <div className="flex ">
                                    <div className="flex flex-col">
                                        <div className="flex items-center  ">
                                            <h2 className="text-white text-[16px] leading-none lg:max-w-full max-w-[170px]   hover:border-b border-white   truncate mr-2">
                                                {data?.user?.firstName} {data?.user?.lastName}
                                            </h2>
                                            {data?.user?.isVerfied && (
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 38 38"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.8779 34.3936C11.4304 31.9477 9.03069 30.2142 6.25391 29.6083V29.6083C5.85807 29.5292 5.54141 29.3244 5.30391 28.994C5.06641 28.6647 4.97405 28.3021 5.02682 27.9062V27.9062C5.30473 25.0514 4.37877 22.191 2.49349 20.0292V20.0292C2.2296 19.7389 2.09766 19.3958 2.09766 19C2.09766 18.6042 2.2296 18.2611 2.49349 17.9708V17.9708C4.37877 15.809 5.30473 12.9486 5.02682 10.0938V10.0938C4.97405 9.69792 5.06641 9.33533 5.30391 9.006C5.54141 8.67561 5.85807 8.47083 6.25391 8.39167V8.39167C9.03069 7.78582 11.4304 6.05228 12.8779 3.60642L12.9039 3.5625C13.115 3.21945 13.4053 2.99514 13.7747 2.88958C14.1442 2.78403 14.5136 2.79722 14.8831 2.92917V2.92917C17.5146 4.04251 20.4849 4.04251 23.1164 2.92917V2.92917C23.4859 2.79722 23.8553 2.78403 24.2247 2.88958C24.5942 2.99514 24.8845 3.21945 25.0956 3.5625L25.1216 3.60642C26.5691 6.05228 28.9688 7.78582 31.7456 8.39167V8.39167C32.1414 8.47083 32.4581 8.67561 32.6956 9.006C32.9331 9.33533 33.0254 9.69792 32.9727 10.0938V10.0938C32.6947 12.9486 33.6207 15.809 35.506 17.9708V17.9708C35.7699 18.2611 35.9018 18.6042 35.9018 19C35.9018 19.3958 35.7699 19.7389 35.506 20.0292V20.0292C33.6207 22.191 32.6947 25.0514 32.9727 27.9062V27.9062C33.0254 28.3021 32.9331 28.6647 32.6956 28.994C32.4581 29.3244 32.1414 29.5292 31.7456 29.6083V29.6083C28.9688 30.2142 26.5691 31.9477 25.1216 34.3936L25.0956 34.4375C24.8845 34.7806 24.5942 35.0049 24.2247 35.1104C23.8553 35.216 23.4859 35.2028 23.1164 35.0708V35.0708C20.4849 33.9575 17.5146 33.9575 14.8831 35.0708V35.0708C14.5136 35.2028 14.1442 35.216 13.7747 35.1104C13.4053 35.0049 13.115 34.7806 12.9039 34.4375L12.8779 34.3936Z"
                                                        fill="#64C3FD"
                                                    />
                                                    <path
                                                        d="M24.6684 14.3826C24.9276 14.1345 25.2725 13.9973 25.6304 14C25.9883 14.0028 26.3311 14.1452 26.5865 14.3972C26.842 14.6492 26.9901 14.9911 26.9995 15.3508C27.009 15.7105 26.8791 16.0598 26.6372 16.3251L19.2954 25.5565C19.1691 25.6933 19.0167 25.803 18.8474 25.8791C18.678 25.9553 18.4951 25.9963 18.3095 25.9998C18.124 26.0032 17.9397 25.969 17.7676 25.8992C17.5956 25.8294 17.4393 25.7255 17.3081 25.5935L12.4392 20.6985C12.3037 20.5714 12.1949 20.4183 12.1195 20.2481C12.044 20.0779 12.0035 19.8941 12.0002 19.7078C11.9969 19.5215 12.031 19.3365 12.1004 19.1637C12.1699 18.9909 12.2732 18.834 12.4042 18.7022C12.5353 18.5705 12.6914 18.4666 12.8632 18.3968C13.035 18.3271 13.2191 18.2928 13.4044 18.2961C13.5897 18.2994 13.7724 18.3401 13.9417 18.416C14.111 18.4918 14.2634 18.6011 14.3897 18.7375L18.2428 22.6095L24.6334 14.4233C24.6449 14.409 24.6572 14.3955 24.6702 14.3826H24.6684Z"
                                                        fill="#14141F"
                                                    />
                                                    <defs>
                                                        <linearGradient
                                                            id="paint0_linear_1971_6534"
                                                            x1="2.09766"
                                                            y1="2.81921"
                                                            x2="38.6017"
                                                            y2="6.22261"
                                                            gradientUnits="userSpaceOnUse">
                                                            <stop stopColor="#AA601B" />
                                                            <stop offset="0.484375" stopColor="#ECDB88" />
                                                            <stop offset="0.994792" stopColor="#AA601B" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            )}
                                        </div>
                                        <p className="text-[14px]   max-w-[170px] lg:max-w-auto truncate">
                                            @{data?.user?.userName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data?.text && (
                        <div className="w-full text-white p-5 pt-0">
                            {/* <p className="text-white">{data?.text}</p> */}
                            <p
                                className="inline text-white text-[16px] braek  break-words"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(urlify(data?.text))
                                }}
                            />
                        </div>
                    )}
                    {data?.nft && (
                        <div className="w-full text-white p-5 pt-0">
                            <p className="text-white">{data?.nft?.nft?.description}</p>
                        </div>
                    )}
                    {data?.type == 'image' || data?.type == 'nft' ? (
                        <figure className=" !flex-shrink-0 bg-[#22222b] flex justify-center   ">
                            <ImageComponent
                                src={
                                    data?.type == 'image'
                                        ? data?.image
                                        : data.nft?.nft?.fileType == 'glb'
                                        ? data?.nft?.nft?.preview
                                        : data?.nft?.nft?.image
                                }
                                width={375}
                                height={375}
                                objectFit="cover"
                                className=""
                                alt=""
                                quality={60}
                            />
                        </figure>
                    ) : (
                        <></>
                    )}
                    {data?.type == 'poll' && (
                        <div className="w-full p-5 pt-0 text-white">
                            <div
                                className=" rounded-[12px] p-6 "
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     router.push(`/feed/${feed?.feed?._id}`);
                                // }}
                            >
                                <h4 className="text-lg text-white cursor-pointer">{data?.poll?.question}</h4>
                                {data?.poll?.options?.map((option: any, index: number) => {
                                    return (
                                        <div key={index} className={`mt-6 relative z-2`}>
                                            <div
                                                // value={option?.option}
                                                // disabled={true}
                                                // placeholder="It will evolve more"
                                                // type="text"
                                                // name="text"
                                                // styles=" "
                                                className={` !font-Proxima-Regular  px-4 py-6 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Circular-Book w-full outline-none rounded-xl text-white leading-[0] ${
                                                    option?.vote?.includes(user?.userId) ? '!border-themecolor' : ''
                                                }`}>
                                                {option?.option}
                                            </div>
                                            <span className="absolute text-base text-white -translate-y-1/2 right-3 top-1/2">
                                                {calculatepercentage1(option, data?.poll)} %
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <span>
                                {totalvotes(data?.poll)} {totalvotes(data?.poll) > 1 ? 'votes' : 'vote'}
                            </span>
                        </div>
                    )}
                    {data?.type == 'video' && (
                        // <figure className=" !flex-shrink-0 bg-[#22222b] flex justify-center AtfeedImage ">
                        //     <video
                        //         // className="w-full "
                        //         controls
                        //         controlsList="nodownload"
                        //         width={375}
                        //         height={375}

                        //         muted
                        //         src={data?.video}
                        //     />
                        // </figure>
                        <figure className=" !flex-shrink-0 bg-[#22222b] AtfeedImage">
                            <Video src={data?.video} />
                        </figure>
                    )}
                </div>
            </div>
            {/* <div className="border-t-2 border-gray5 p-5">
        <Button
          type="button"
          className="w-full rounded-full"
          onClick={Upload}
          isLoading={loading}
        >
          Post
        </Button>
      </div> */}
        </div>
    );
};

export default CreatePost;
