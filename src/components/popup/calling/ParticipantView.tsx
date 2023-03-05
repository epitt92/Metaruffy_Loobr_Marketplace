import Image from 'next/image';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
    Track,
    Participant,
    createLocalAudioTrack,
    createLocalVideoTrack,
    VideoTrackPublication,
    TrackPublication
} from 'twilio-video';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import ImageComponent from '../../Image/ImageComponent';
import Timer from './components/Timer';

interface IParticipantComponent {
    isLocalParticipant?: boolean;
    participant: Participant | any;
    data?: any;
    handleLeave?: Function;
    user?: any;
}

export default function ParticipantVideoView({
    isLocalParticipant = false,
    participant,
    data,
    handleLeave,
    user
}: IParticipantComponent) {
    console.log({ participant });
    interface IParticipantState {
        video: Array<Track>;
        audio: Array<Track>;
        videoPub: Array<VideoTrackPublication>;
        isVideoDisable: boolean;
        isAudioDisable: boolean;
    }
    interface IParticipantAction {
        type:
            | 'video'
            | 'audio'
            | 'videoAdd'
            | 'audioAdd'
            | 'videoRemove'
            | 'audioRemove'
            | 'resetTracks'
            | 'toggleVideo'
            | 'toggleAudio'
            | 'setVideo'
            | 'setAudio'
            | 'videoPubAdd'
            | 'videoPubRemove';
        payload?: any;
    }
    const initTracks = {
        video: [],
        audio: [],
        videoPub: [],
        isVideoDisable: true,
        isAudioDisable: false
    };
    // state reducer
    const stateReducer = (state: IParticipantState, action: IParticipantAction) => {
        switch (action.type) {
            case 'video':
                return { ...state, video: action.payload };
            case 'audio':
                return { ...state, audio: action.payload };
            case 'videoAdd':
                return { ...state, video: [...state.video, action.payload], isVideoDisable: false };
            case 'audioAdd':
                return { ...state, audio: [...state.video, action.payload] };
            case 'videoRemove':
                return {
                    ...state,
                    video: state.video.filter((track: Track) => track !== action.payload),
                    isVideoDisable: true
                };
            case 'audioRemove':
                return {
                    ...state,
                    video: state.audio.filter((track: Track) => track !== action.payload)
                };
            case 'resetTracks':
                return { ...state, video: [], audio: [] };
            case 'toggleVideo':
                return { ...state, isVideoDisable: !state.isVideoDisable };
            case 'toggleAudio':
                return { ...state, isAudioDisable: !state.isAudioDisable };
            case 'setVideo':
                return { ...state, isVideoDisable: action.payload };
            case 'setAudio':
                return { ...state, isAudioDisable: action.payload };
            case 'videoPubAdd':
                return { ...state, videoPub: [...state.videoPub, action.payload] };
            case 'videoPubRemove':
                return {
                    ...state,
                    video: state.videoPub.filter((trackPub: TrackPublication) => trackPub !== action.payload)
                };
            default:
                return state;
        }
    };
    // state
    const [state, dispatch] = useReducer(stateReducer, initTracks);
    const videoRef = useRef<any>(null);
    const audioRef = useRef<any>(null);
    const identity = participant?.identity ? JSON.parse(participant?.identity) : {};

    // filter tracks for publication on join
    const trackpubsToTracks = (trackMap: any) => {
        return Array.from(trackMap.values())
            .map((publication: any) => publication.track)
            .filter((track) => track !== null);
    };
    // track Subscribed
    const trackSubscribed = (track: any) => {
        console.log('track sub', { track });
        setTimeout(() => {
            track.attach(videoRef.current);
        }, 200);
        dispatch({
            type: track.kind == 'video' ? 'videoAdd' : 'audioAdd',
            payload: track
        });
        if (track.kind == 'video') {
            dispatch({ type: 'videoPubAdd', payload: track });
        }

        handleTrackEvents(track);
    };

    // track unSubscribed
    const trackUnsubscribed = (track: any) => {
        console.log('track un sub', { track });
        if (track.kind == 'video') {
            track.detach(videoRef.current);
        }
        dispatch({
            type: track.kind == 'video' ? 'videoRemove' : 'audioRemove',
            payload: track
        });
    };
    // handle init track
    const handleTrackEvents = (track: any) => {
        // attaching video track events for remote users
        if (track.kind === 'video') {
            track.on('disabled', () => {
                console.log('disble work video');
                track?.detach();
                dispatch({ type: 'setVideo', payload: true });
            });
            track.on('enabled', () => {
                console.log('enable work video');
                dispatch({ type: 'setVideo', payload: false });
                track.attach(videoRef.current);
            });
        }
        // attaching audio track events for remote users
        else if (track.kind === 'audio') {
            track.on('disabled', () => {
                console.log('disble work audio');
                track.detach();
                dispatch({ type: 'setAudio', payload: true });
            });
            track.on('enabled', () => {
                console.log('enable work audio');
                dispatch({ type: 'setAudio', payload: false });
                track.attach(audioRef.current);
            });
        }
    };

    // attach video and audio refs with tracks for first time
    const handleTrackstoRefs = (track: any) => {
        if (track.kind === 'video') {
            track.attach(videoRef.current);
        } else if (track.kind === 'audio') {
            track.attach(audioRef.current);
        }
    };

    // mute local user video
    const muteVideoLocalUser = () => {
        if (!isLocalParticipant) return;
        // state.video.forEach((track: any) => {
        //     track?.disable();
        //     track?.detach();
        //     console.log("disable", { track });
        // });
        participant.videoTracks.forEach((publication: any) => {
            publication.track?.stop();
            publication.track?.detach();
            publication.unpublish();
        });
        dispatch({ type: 'setVideo', payload: true });
    };
    // mute audio of local user
    const muteAudioLocalUser = () => {
        if (!isLocalParticipant) return;
        state.audio.forEach((track: any) => {
            track?.disable();
        });
        dispatch({ type: 'setAudio', payload: true });
    };
    // enable local user video
    const enableVideoLocalUser = () => {
        if (!isLocalParticipant) return;
        dispatch({ type: 'setVideo', payload: false });

        createLocalVideoTrack()
            .then((localVideoTrack: any) => {
                setTimeout(() => {
                    localVideoTrack.attach(videoRef.current);
                }, 100);
                return participant.publishTrack(localVideoTrack);
            })
            .then((publication) => {
                setTimeout(() => {
                    // publication?.attach(videoRef.current);
                }, 100);
                console.log('Successfully unmuted your video:', publication);
            });

        // state.video.forEach((track: any) => {
        //     track?.enable();
        //     setTimeout(() => {
        //         track?.attach(videoRef.current);
        //     }, 100);
        //     console.log("enable", { track });
        // });
    };
    // enable audio of local user
    const enableAudioLocalUser = () => {
        if (!isLocalParticipant) return;
        state.video.forEach((track: any) => {
            track?.enable();
        });
        dispatch({ type: 'setAudio', payload: false });
    };

    // on unSubscribe a track
    const onUnsubscribe = (props: any) => {
        console.log(props);
    };
    // participant audio video track init
    useEffect(() => {
        if (!participant) return;
        const videoTracks = trackpubsToTracks(participant.videoTracks);
        const AudioTracks = trackpubsToTracks(participant.audioTracks);

        videoTracks.map((track: any) => {
            if (!isLocalParticipant) {
                handleTrackEvents(track);
            }
            handleTrackstoRefs(track);
        });
        AudioTracks.map((track: any) => {
            if (!isLocalParticipant) {
                handleTrackEvents(track);
            }
            handleTrackstoRefs(track);
        });
        dispatch({ type: 'video', payload: videoTracks });
        dispatch({ type: 'videoPubAdd', payload: participant.videoTracks });

        dispatch({ type: 'audio', payload: AudioTracks });
        participant.on('trackSubscribed', trackSubscribed);
        participant.on('trackUnsubscribed', trackUnsubscribed);
        participant.on('unsubscribed', onUnsubscribe);

        return () => {
            dispatch({ type: 'resetTracks' });
            participant.removeAllListeners();
        };
    }, [participant]);

    useEffect(() => {
        if (videoRef && videoRef.current) {
            videoRef.current.style.transform = 'scale(-1, 1)';
        }
    }, [videoRef]);

    // const [isFirstRender, setIsFirstRender] = useState(false);

    // useEffect(() => {
    //     if (!isFirstRender && participant?.videoTracks) {
    //         participant?.videoTracks?.forEach((track: any) => {
    //             if (track?.isTrackEnabled == false) {
    //                 dispatch({ type: "setVideo", payload: true });
    //                 return;
    //             }
    //         });

    //         setIsFirstRender(true);
    //     }
    // }, [participant]);

    // ui views

    const renderAudioButton = () => {
        return !state.isAudioDisable ? (
            <div>
                <svg
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                    onClick={() => {
                        muteAudioLocalUser();
                    }}>
                    <circle cx="30" cy="30" r="30" transform="rotate(-180 30 30)" fill="#363642" />
                    <path
                        d="M29.9987 34.2497C31.5016 34.2497 32.9429 33.6527 34.0056 32.5899C35.0683 31.5272 35.6654 30.0859 35.6654 28.583V21.4997C35.6654 19.9968 35.0683 18.5554 34.0056 17.4927C32.9429 16.43 31.5016 15.833 29.9987 15.833C28.4958 15.833 27.0545 16.43 25.9918 17.4927C24.9291 18.5554 24.332 19.9968 24.332 21.4997V28.583C24.332 30.0859 24.9291 31.5272 25.9918 32.5899C27.0545 33.6527 28.4958 34.2497 29.9987 34.2497Z"
                        fill="#B8B8BC"
                    />
                    <path
                        d="M39.9154 28.5837C39.9154 28.2079 39.7661 27.8476 39.5004 27.5819C39.2348 27.3162 38.8744 27.167 38.4987 27.167C38.123 27.167 37.7626 27.3162 37.497 27.5819C37.2313 27.8476 37.082 28.2079 37.082 28.5837C37.082 30.4623 36.3358 32.2639 35.0074 33.5923C33.679 34.9207 31.8773 35.667 29.9987 35.667C28.1201 35.667 26.3184 34.9207 24.99 33.5923C23.6616 32.2639 22.9154 30.4623 22.9154 28.5837C22.9154 28.2079 22.7661 27.8476 22.5004 27.5819C22.2348 27.3162 21.8744 27.167 21.4987 27.167C21.123 27.167 20.7626 27.3162 20.497 27.5819C20.2313 27.8476 20.082 28.2079 20.082 28.5837C20.0848 30.9663 20.9454 33.2682 22.5062 35.0684C24.067 36.8686 26.2239 38.0466 28.582 38.387V41.3337H25.5929C25.2585 41.3337 24.9378 41.4665 24.7013 41.7029C24.4649 41.9394 24.332 42.2601 24.332 42.5945V42.9062C24.332 43.2406 24.4649 43.5612 24.7013 43.7977C24.9378 44.0342 25.2585 44.167 25.5929 44.167H34.4045C34.7389 44.167 35.0596 44.0342 35.2961 43.7977C35.5325 43.5612 35.6654 43.2406 35.6654 42.9062V42.5945C35.6654 42.2601 35.5325 41.9394 35.2961 41.7029C35.0596 41.4665 34.7389 41.3337 34.4045 41.3337H31.4154V38.387C33.7735 38.0466 35.9303 36.8686 37.4912 35.0684C39.052 33.2682 39.9126 30.9663 39.9154 28.5837Z"
                        fill="#B8B8BC"
                    />
                </svg>
            </div>
        ) : (
            <div>
                <svg
                    // width="60"
                    // height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                    onClick={() => {
                        enableAudioLocalUser();
                    }}>
                    <circle cx="30" cy="30" r="30" transform="rotate(-180 30 30)" fill="#363642" />
                    <path
                        d="M35.0736 31.0623C35.4576 30.2918 35.6611 29.4439 35.6686 28.5831V21.4998C35.6529 20.1004 35.12 18.7563 34.1724 17.7264C33.2249 16.6965 31.9297 16.0537 30.5365 15.9217C29.1432 15.7898 27.7504 16.1781 26.6264 17.0118C25.5024 17.8455 24.7266 19.0657 24.4486 20.4373M39.9186 28.5831C39.9186 28.2074 39.7693 27.847 39.5036 27.5814C39.2379 27.3157 38.8776 27.1664 38.5019 27.1664C38.1262 27.1664 37.7658 27.3157 37.5002 27.5814C37.2345 27.847 37.0852 28.2074 37.0852 28.5831C37.0811 29.8208 36.7434 31.0345 36.1077 32.0964L38.1902 34.2498C39.3303 32.5811 39.9333 30.604 39.9186 28.5831ZM30.0019 34.2498H30.2286L24.3352 28.3423V28.5831C24.3352 30.086 24.9322 31.5273 25.995 32.59C27.0577 33.6527 28.499 34.2498 30.0019 34.2498ZM42.3411 40.3273L19.6744 17.6606C19.5423 17.5285 19.3855 17.4237 19.2129 17.3522C19.0403 17.2808 18.8554 17.244 18.6686 17.244C18.4818 17.244 18.2968 17.2808 18.1242 17.3522C17.9516 17.4237 17.7948 17.5285 17.6627 17.6606C17.396 17.9274 17.2461 18.2892 17.2461 18.6664C17.2461 19.0437 17.396 19.4055 17.6627 19.6723L40.3294 42.3389C40.4611 42.4717 40.6178 42.5771 40.7904 42.649C40.963 42.7209 41.1482 42.758 41.3352 42.758C41.5222 42.758 41.7074 42.7209 41.88 42.649C42.0527 42.5771 42.2094 42.4717 42.3411 42.3389C42.4738 42.2072 42.5792 42.0505 42.6512 41.8779C42.7231 41.7053 42.7601 41.5201 42.7601 41.3331C42.7601 41.1461 42.7231 40.9609 42.6512 40.7883C42.5792 40.6156 42.4738 40.459 42.3411 40.3273Z"
                        fill="#B8B8BC"
                    />
                    <path
                        d="M34.2487 41.3337H31.4154V38.387C32.217 38.2754 33.0021 38.0661 33.7529 37.7637L31.4862 35.497C30.9986 35.611 30.4994 35.668 29.9987 35.667C28.1201 35.667 26.3184 34.9207 24.99 33.5923C23.6616 32.2639 22.9154 30.4623 22.9154 28.5837C22.9154 28.2079 22.7661 27.8476 22.5004 27.5819C22.2348 27.3162 21.8744 27.167 21.4987 27.167C21.123 27.167 20.7626 27.3162 20.497 27.5819C20.2313 27.8476 20.082 28.2079 20.082 28.5837C20.0848 30.9663 20.9454 33.2682 22.5062 35.0684C24.067 36.8686 26.2239 38.0466 28.582 38.387V41.3337H25.7487C25.373 41.3337 25.0126 41.4829 24.747 41.7486C24.4813 42.0143 24.332 42.3746 24.332 42.7503C24.332 43.126 24.4813 43.4864 24.747 43.7521C25.0126 44.0177 25.373 44.167 25.7487 44.167H34.2487C34.6244 44.167 34.9848 44.0177 35.2504 43.7521C35.5161 43.4864 35.6654 43.126 35.6654 42.7503C35.6654 42.3746 35.5161 42.0143 35.2504 41.7486C34.9848 41.4829 34.6244 41.3337 34.2487 41.3337Z"
                        fill="#B8B8BC"
                    />
                </svg>
            </div>
        );
    };

    const renderVideoButton = () => {
        return state.isVideoDisable ? (
            <div>
                <svg
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                    onClick={() => {
                        enableVideoLocalUser();
                    }}>
                    <circle cx="30" cy="30" r="30" transform="rotate(-180 30 30)" fill="#363642" />
                    <path
                        opacity="0.4"
                        d="M38.6088 23.3555C38.6238 23.4605 38.6238 23.5805 38.6088 23.6855C38.6088 23.5805 38.5938 23.4755 38.5938 23.3705L38.6088 23.3555Z"
                        fill="#B8B8BC"
                    />
                    <path
                        d="M37.9203 21.84L17.7453 42.015C15.6453 40.68 14.8203 38.295 14.8203 36V24C14.8203 18.87 16.8153 16.875 21.9453 16.875H30.9453C35.2803 16.875 37.3653 18.3 37.9203 21.84Z"
                        fill="#B8B8BC"
                    />
                    <path
                        d="M44.1 17.3102C43.65 16.8602 42.915 16.8602 42.465 17.3102L14.775 45.0002C14.325 45.4502 14.325 46.1852 14.775 46.6352C15 46.8452 15.3 46.9652 15.585 46.9652C15.885 46.9652 16.17 46.8452 16.395 46.6202L44.1 18.9302C44.55 18.4802 44.55 17.7602 44.1 17.3102Z"
                        fill="#B8B8BC"
                    />
                    <path
                        d="M45.5683 24.5697V35.4297C45.5683 37.5747 44.5183 38.4297 43.9183 38.7447C43.6333 38.8947 43.1833 39.0597 42.6283 39.0597C41.9833 39.0597 41.1883 38.8497 40.2583 38.1897L38.0383 36.6297C37.9333 39.9447 36.8833 41.8347 34.4983 42.6297C33.5383 42.9747 32.3533 43.1247 30.9283 43.1247H21.9283C21.5683 43.1247 21.2233 43.1097 20.8633 43.0647L34.4983 29.4447L42.9733 20.9697C43.3633 20.9997 43.6783 21.1197 43.9183 21.2547C44.5183 21.5697 45.5683 22.4247 45.5683 24.5697Z"
                        fill="#B8B8BC"
                    />
                </svg>
            </div>
        ) : (
            <div>
                <svg
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                    onClick={() => {
                        muteVideoLocalUser();
                    }}>
                    <circle cx="30" cy="30" r="30" transform="rotate(-180 30 30)" fill="#363642" />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 23.625C13 22.4978 13.4478 21.4168 14.2448 20.6198C15.0418 19.8228 16.1228 19.375 17.25 19.375H33.1875C34.2183 19.3749 35.2141 19.7494 35.9893 20.4288C36.7645 21.1083 37.2663 22.0463 37.4014 23.0682L44.0101 20.1315C44.3336 19.9874 44.688 19.9264 45.041 19.954C45.3941 19.9817 45.7346 20.0972 46.0317 20.2899C46.3288 20.4827 46.573 20.7467 46.7421 21.0578C46.9112 21.369 46.9998 21.7175 47 22.0716V37.9284C46.9997 38.2822 46.911 38.6304 46.742 38.9413C46.573 39.2522 46.3291 39.516 46.0323 39.7087C45.7355 39.9015 45.3953 40.017 45.0425 40.0449C44.6898 40.0728 44.3356 40.0122 44.0122 39.8685L37.4014 36.9317C37.2663 37.9537 36.7645 38.8917 35.9893 39.5712C35.2141 40.2506 34.2183 40.6251 33.1875 40.625H17.25C16.1228 40.625 15.0418 40.1772 14.2448 39.3802C13.4478 38.5832 13 37.5022 13 36.375V23.625Z"
                        fill="#B8B8BC"
                    />
                </svg>
            </div>
        );
    };

    // main return

    return (
        <>
            {/* view for local participant */}

            {isLocalParticipant && (
                <>
                    {data?.connected && (
                        <div className=" absolute right-4  top-4 sm:w-[13.188rem]  h-[6rem] w-[10rem] xs3:h-[5rem] xs3:w-[7rem]  sm:h-[8.813rem]">
                            {!state.isVideoDisable && (
                                <video
                                    className="   rounded-[12px] "
                                    width="100%"
                                    height="100%"
                                    id="one"
                                    ref={videoRef}
                                    autoPlay={true}></video>
                            )}
                            <p className=" absolute right-4 mt-2 xs:mt-1 text-[#2B2B35;] text-xs bg-[#FFFFFF] h-[24px] flex  items-center justify-center gap-1 w-[48px] rounded-[4px]">
                                <div className="h-[6px] w-[6px] bg-[#FB0242] rounded-full "></div>
                                <Timer />
                            </p>
                        </div>
                    )}

                    <div className="mt-10 flex gap-4">
                        <div>{renderAudioButton()}</div>

                        <div className="">
                            <svg
                                viewBox="0 0 60 60"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="cursor-pointer h-[3.75rem] w-[3.75rem]"
                                onClick={() => {
                                    handleLeave?.();
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

                        {data?.connected && renderVideoButton()}
                    </div>
                </>
            )}

            {/* view for remote participant  */}
            {!isLocalParticipant && (
                <>
                    {!state.isVideoDisable ? (
                        <video
                            ref={videoRef}
                            autoPlay={true}
                            className="relative  rounded-[14px]"
                            width="100%"
                            height="100%"
                            id="one"
                        />
                    ) : (
                        <>
                            <figure className="mt-5 AtchatUserprofile w-[75px] h-[75px] relative border-[10px] border-[#2B2B35] rounded-full">
                                {user?.avatar ? (
                                    <ImageComponent
                                        className="rounded-full"
                                        src={user?.avatar}
                                        height={75}
                                        width={75}
                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                    />
                                ) : (
                                    <p className="w-full h-full bg-themecolor text-6xl contain flex items-center justify-center rounded-full text-black1">
                                        {identity?.name?.charAt(0).toUpperCase()}
                                    </p>
                                )}
                            </figure>
                            <h5 className="text-white mt-4">{identity?.name}</h5>
                        </>
                    )}
                </>
            )}
        </>
    );
}
