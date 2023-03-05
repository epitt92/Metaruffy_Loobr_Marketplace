import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/user.service';
import Image from 'next/image';
import useAudio from '../../hooks/useAudio';
import { _io } from '../../services/socket.service';
import { useSelector } from 'react-redux';
import { CALLING, REJECTCALL } from '../../constants/socketEvents';
import { ECallStatus } from '../../enums/call.enum';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
// import Popups from '../../components/popup/poups';

const Calling = ({ data, setstate, setData }: any) => {
    const [time, setTime] = useState<boolean>(false);
    // const [check, setCheck] = useState(true);
    const [token, setToken] = useState('');
    const [allow, setAllow] = useState<boolean>(false);
    const [go, setGo] = useState<boolean>(true);
    const [called, setCalled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    // const [state, setState] = useState(-1);
    // const [data1, setData] = useState<any>(data);
    const [playing, play, audio] = useAudio('/incoming.mp3', true);
    const user = useSelector((state: any) => state.auth.user);
    const deadline = useRef(new Date().getTime() + 135000);
    const getTime = () => {
        const time = (deadline.current - Date.now()) / 1000;
        if (time < 1) {
            toast.error('Call Missed');
            setstate();
        }
    };

    const updateStatusToRinging = async () => {
        await userService.updateCallStatus(data?.roomId, ECallStatus.RINGING);
    };
    useEffect(() => {
        updateStatusToRinging();
        const interval = setInterval(() => getTime(), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const answer = async () => {
        setLoading(true);
        setCalled(false);
        console.log('answered1');
        setTimeout(() => {
            setTime(true);
        }, 2000);
    };

    useEffect(() => {
        if (typeof navigator !== 'undefined') {
            navigator.mediaDevices
                ?.getUserMedia({ audio: true })
                .then(function (stream: any) {
                    // console.log(stream.getAudioTracks());
                    if (stream.getAudioTracks().length > 0) {
                        // let a: any = stream.getVideoTracks();
                        // stream.getVideoTracks()[0].stop();
                        stream.getAudioTracks()[0].stop();
                        setAllow(true);
                    } else {
                        toast.success('Please Allow the  mic access');
                    }
                })
                .catch(function (error) {
                    toast.success('Please Allow mic access');
                });
        }
    }, []);

    useEffect(() => {
        if (time) {
            console.log('answered');
            if (data?.roomId && go) {
                call();
            }
        }
    }, [time]);

    const call = async () => {
        try {
            const token = await generateToken(data?.roomId, false);
            console.log(token, 'token');
            const data1 = {
                caller: data?.user,
                roomId: data?._id,
                users: [data?.from, data?.to],
                ...token,
                ...data,
                calling: false,
                receving: true
            };

            setLoading(false);
            setData(data1);
            setstate(73);
        } catch (error) {
            console.log({ error });
        }
    };
    const reject = async () => {
        await userService.updateCallStatus(data?._id, ECallStatus.DECLINE);
        setstate();
    };

    const generateToken = async (value: any, callOther: boolean) => {
        try {
            let res = await userService.getCallToken(value, callOther, data?._id);
            const token = res.data?.data;
            return token;
        } catch (err: any) {
            toast.error(err?.response?.data?.message);
            return null;
        }
    };

    useEffect(() => {
        if (user && user.userId) {
            _io.on(`${user?.userId}:${CALLING}`, initCallSockets);
            return () => {
                playing && audio && audio?.pause();
                _io.off(`${user?.userId}:${CALLING}`, initCallSockets);
            };
        }
    }, [user]);
    useEffect(() => {
        if (audio) {
            play();

            return () => {
                audio?.pause();
                if (audio) {
                    // audio?.pause();
                    playing && play();
                }
            };
        }
    }, [audio]);
    const initCallSockets = (payload: any) => {
        console.log({ payload }, 'calling');
        switch (payload.status) {
            case ECallStatus.DECLINE:
                toast.error(`Call Ended by ${payload?.from?.firstName} ${payload?.from?.lastName}`);
                setstate();
                break;
            case ECallStatus.ENDED:
                toast.error(`Call Ended by ${payload?.from?.firstName} ${payload?.from?.lastName}`);
                setstate();
                break;
            case ECallStatus.MISSED:
                toast.error(`Call Ended by ${payload?.from?.firstName} ${payload?.from?.lastName}`);
                setstate();
                break;
            default:
                break;
        }
    };

    return (
        // <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
        //     <div className="text-center mb-5">
        //         <h2 className="text-3xl text-white font-Proxima-Bold">{data?.user} is calling </h2>
        //     </div>
        //     <div className="text-center">
        //         <p className="text-[#89898f] text-lg font-Proxima-Regular"></p>
        //     </div>
        //     <div className="flex items-center justify-center gap-2 mt-10">
        //         <Button className="w-full rounded-lg " onClick={() => answer()}>
        //             Answer
        //         </Button>
        //         <Button className="w-full rounded-lg " onClick={() => reject()}>
        //             Reject
        //         </Button>
        //     </div>
        // </div>
        <div className="  w-[490px] xs:w-[26rem]   m-auto rounded-[12px] border border-[#2B2B35] pt-8 pb-9">
            <div className=" flex justify-center flex-col items-center">
                <figure className="mt-5 AtchatUserprofile w-[75px] h-[75px] relative border-[10px] border-[#2B2B35] rounded-full">
                    {data?.user?.avatar ? (
                        <ImageComponent
                            className="rounded-full"
                            src={data?.from?.avatar}
                            height={75}
                            width={75}
                            transformation={TRANSFORMATION_NAMES.fit_50x50}
                        />
                    ) : (
                        <p className="w-full h-full bg-themecolor font-Proxima-Bold text-3xl contain flex items-center justify-center rounded-full text-black1">
                            {data?.from?.firstName?.charAt(0).toUpperCase()}
                        </p>
                    )}
                </figure>
                <h5 className="text-white mt-4">{data?.from?.firstName + ' ' + data?.from?.lastName}</h5>
                <p className=" text-[#B8B8BC;]">Calling</p>

                <div className="mt-10 flex gap-8 items-center ">
                    {loading ? (
                        <>loading..</>
                    ) : (
                        <>
                            <div>
                                <svg
                                    className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                                    viewBox="0 0 60 60"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => {
                                        allow && called && answer();
                                    }}>
                                    <circle cx="30" cy="30" r="30" transform="rotate(-180 30 30)" fill="#4CC900" />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M29.8406 30.7086C35.8242 36.6905 37.1816 29.7701 40.9914 33.5772C44.6644 37.2491 46.7754 37.9848 42.1218 42.6371C41.5389 43.1055 37.8354 48.7414 24.8199 35.7295C11.8028 22.716 17.4353 19.0087 17.9039 18.4259C22.5688 13.7608 23.2918 15.8841 26.9647 19.556C30.7745 23.3647 23.857 24.7266 29.8406 30.7086Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>

                            <div>
                                <svg
                                    viewBox="0 0 60 60"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                                    onClick={() => {
                                        reject();
                                    }}>
                                    <circle cx="30" cy="30" r="30" transform="rotate(-180 30 30)" fill="#EA4335" />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M30.5384 29.0023C22.0774 29.0035 26.0111 34.8568 20.6251 34.8587C15.4315 34.8594 13.4186 35.832 13.4195 29.2517C13.5004 28.5083 12.1341 21.9044 30.5382 21.9018C48.9447 21.8992 47.5833 28.5036 47.664 29.247C47.6643 35.8443 45.6516 34.8541 40.458 34.8548C35.0709 34.8556 38.9993 29.0011 30.5384 29.0023Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* <Popups show={popup} hide={setPopup} state={state} setstate={setstate} data={data} setData={setData} /> */}
        </div>
    );
};

export default Calling;
