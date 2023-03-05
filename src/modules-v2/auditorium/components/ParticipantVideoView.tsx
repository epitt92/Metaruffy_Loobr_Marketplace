import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Track, Participant, VideoTrackPublication } from 'twilio-video'
import Button from '../../../components/button/button'
import { ImageLoading } from '../../../components/ImageLoading.comonent'
import { getImageURL } from '../../../shared'

interface IParticipantComponent {
    isLocalParticipant?: boolean,
    participant: Participant | any,
    isOwnerView?: boolean,
    owner?: any
}

export default function ParticipantVideoView({ isLocalParticipant = false, participant, isOwnerView, owner }: IParticipantComponent) {

    interface IParticipantState {
        video: Array<Track>,
        audio: Array<Track>,
        isVideoDisable: boolean,
        isAudioDisable: boolean
    }
    interface IParticipantAction {
        type: 'video' | 'audio' | 'videoAdd' | 'audioAdd' | 'videoRemove' | 'audioRemove' | 'resetTracks' | 'toggleVideo' | 'toggleAudio' | 'setVideo' | 'setAudio',
        payload?: any
    }
    const initTracks = {
        video: [],
        audio: [],
        isVideoDisable: false,
        isAudioDisable: false
    }
    // state reducer
    const stateReducer = (state: IParticipantState, action: IParticipantAction) => {
        switch (action.type) {
            case 'video':
                return { ...state, video: action.payload }
            case 'audio':
                return { ...state, audio: action.payload }
            case 'videoAdd':
                return { ...state, video: [...state.video, action.payload] }
            case 'audioAdd':
                return { ...state, audio: [...state.video, action.payload] }
            case 'videoRemove':
                return { ...state, video: state.video.filter((track: Track) => track !== action.payload) }
            case 'audioRemove':
                return { ...state, video: state.audio.filter((track: Track) => track !== action.payload) }
            case 'resetTracks':
                return { ...state, video: [], audio: [] }
            case 'toggleVideo':
                return { ...state, isVideoDisable: !state.isVideoDisable }
            case 'toggleAudio':
                return { ...state, isAudioDisable: !state.isAudioDisable }
            case 'setVideo':
                return { ...state, isVideoDisable: action.payload }
            case 'setAudio':
                return { ...state, isAudioDisable: action.payload }
            default:
                return state
        }
    }
    // state
    const [state, dispatch] = useReducer(stateReducer, initTracks);
    const videoRef = useRef<any>(null);
    const audioRef = useRef<any>(null);
    const identity = participant?.identity ? JSON.parse(participant?.identity) : {}

    // filter tracks for publication on join
    const trackpubsToTracks = (trackMap: any) =>
        Array.from(trackMap.values())
            .map((publication: any) => publication.track)
            .filter((track) => track !== null);

    // track Subscribed
    const trackSubscribed = (track: any) => {
        console.log('track sub', { track })
        track.attach(videoRef.current);
        dispatch({
            type: track.kind == 'video' ? 'videoAdd' : 'audioAdd',
            payload: track
        })
        handleTrackEvents(track)

    };
    // track unSubscribed
    const trackUnsubscribed = (track: any) => {
        console.log('track un sub', { track })
        track.detach(videoRef.current);
        dispatch({
            type: track.kind == 'video' ? 'videoRemove' : 'audioRemove',
            payload: track
        })
    };
    // handle init track 
    const handleTrackEvents = (track: any) => {

        // attaching video track events for remote users 
        if (track.kind === 'video') {
            track.on("disabled", () => {
                console.log('disble work video')
                dispatch({ type: "setVideo", payload: true })
            });
            track.on("enabled", () => {
                console.log('enable work video')
                dispatch({ type: "setVideo", payload: false })
                track.attach(videoRef.current);
            });
        }
        // attaching audio track events for remote users
        else if (track.kind === 'audio') {
            track.on("disabled", () => {
                console.log('disble work audio')
                track.detach();
                dispatch({ type: "setAudio", payload: true })
            });
            track.on("enabled", () => {
                console.log('enable work audio')
                dispatch({ type: "setAudio", payload: false })
                track.attach(audioRef.current);
            });
        }
    }

    // attach video and audio refs with tracks for first time
    const handleTrackstoRefs = (track: any) => {
        if (track.kind === 'video') {
            track.attach(videoRef.current)
        }
        else if (track.kind === 'audio') {
            track.attach(audioRef.current)
        }

    }



    // mute local user video
    const muteVideoLocalUser = () => {
        if (!isLocalParticipant) return
        state.video.forEach((track: any) => {
            track?.disable();
            track?.detach()
            console.log('disable', { track })
        });
        dispatch({ type: "setVideo", payload: true })
    }
    // mute audio of local user
    const muteAudioLocalUser = () => {
        if (!isLocalParticipant) return
        state.audio.forEach((track: any) => {
            track?.disable();
        });
        dispatch({ type: "setAudio", payload: true })
    }
    // enable local user video
    const enableVideoLocalUser = () => {
        if (!isLocalParticipant) return
        dispatch({ type: "setVideo", payload: false })
        state.video.forEach((track: any) => {
            track?.enable();
            setTimeout(() => {
                track?.attach(videoRef.current)
            }, 100);
            console.log('enable', { track })
        });
    }
    // enable audio of local user
    const enableAudioLocalUser = () => {
        if (!isLocalParticipant) return
        state.video.forEach((track: any) => {
            track?.enable();
        });
        dispatch({ type: "setAudio", payload: false })
    }



    // participant audio video track init
    useEffect(() => {
        if (!participant) return
        const videoTracks = trackpubsToTracks(participant.videoTracks)
        const AudioTracks = trackpubsToTracks(participant.audioTracks)
        videoTracks.map((track: any) => {
            if (!isLocalParticipant) {
                handleTrackEvents(track)
            }
            handleTrackstoRefs(track)

        })
        AudioTracks.map((track: any) => {
            if (!isLocalParticipant) {
                handleTrackEvents(track)
            }
            handleTrackstoRefs(track)
        })
        dispatch({ type: 'video', payload: videoTracks })
        dispatch({ type: 'audio', payload: AudioTracks })
        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        return () => {
            dispatch({ type: 'resetTracks' })
            participant.removeAllListeners();
        };
    }, [participant]);



    // main return
    return (
        <>
            {/* view for auditorium owner */}
            {(isOwnerView) &&
                <div className='AtTwilioOwner'>
                    {(!state.isVideoDisable && participant !== null) ? (
                        <>
                            <video className='AtTwilVideo' ref={videoRef} autoPlay={true} />
                        </>
                    ) : (
                        <ImageLoading src={getImageURL(owner.profile, 40)} alt='profile' width="410" height="242" objectFit="cover" blurEffect />
                    )}
                    <span className='AtTOwnerName'>{owner.firstName} {owner.lastName}</span>
                    {/* show controls if its a localparticipants */}
                    {isLocalParticipant &&
                        <div className="AtControlsBottom">
                            <ul className="AtControlsUl">
                                <li>
                                    <div className="AtControlsIcon">
                                        <i className={`icon-video ${true ? 'AtActive' : ''}`} onClick={() => state.isVideoDisable ? enableVideoLocalUser() : muteVideoLocalUser()}></i>
                                    </div>
                                </li>
                                <li>
                                    <div className="AtControlsIcon">
                                        <i className={`icon-audio ${false ? 'AtActive' : ''}`} onClick={() => state.isAudioDisable ? enableAudioLocalUser() : muteAudioLocalUser()}></i>
                                    </div>
                                </li>
                            </ul>
                            {/* <Button onClick={() => state.isVideoDisable ? enableVideoLocalUser() : muteVideoLocalUser()}>camera</Button>
                            <Button onClick={() => state.isAudioDisable ? enableAudioLocalUser() : muteAudioLocalUser()} >mic</Button> */}
                        </div>
                    }

                    <audio ref={audioRef} autoPlay={true} muted={state.isAudioDisable} />
                </div>
                // .AtTwilioOwner 
            }
            {/* view for local participant that is not owner */}
            <div className='AtTwilioLocal'>
                {(isLocalParticipant && !isOwnerView) &&
                    <div className='AtLocalWrap'>
                        {!state.isVideoDisable ? (
                            <>
                                <video ref={videoRef} autoPlay={true} className="AtTwilSmallVideo" />
                            </>
                        ) : (
                            <ImageLoading src={getImageURL(identity.profile, 40)} alt='profile' objectFit="cover" width='196' height='112' blurEffect />
                        )}
                        <span className='AtTOwnerName'>{identity.name}</span>
                        <div className="AtControlsBottom">
                            <ul className="AtControlsUl">
                                <li>
                                    <div className="AtControlsIcon">
                                        <i className={`icon-video ${true ? 'AtActive' : ''}`} onClick={() => state.isVideoDisable ? enableVideoLocalUser() : muteVideoLocalUser()}></i>
                                    </div>
                                </li>
                                <li>
                                    <div className="AtControlsIcon">
                                        <i className={`icon-audio ${false ? 'AtActive' : ''}`} onClick={() => state.isAudioDisable ? enableAudioLocalUser() : muteAudioLocalUser()}></i>
                                    </div>
                                </li>
                            </ul>
                            {/* <Button onClick={() => state.isVideoDisable ? enableVideoLocalUser() : muteVideoLocalUser()}>camera</Button>
                        <Button onClick={() => state.isAudioDisable ? enableAudioLocalUser() : muteAudioLocalUser()} >mic</Button> */}
                        </div>
                        <audio ref={audioRef} autoPlay={true} muted={state.isAudioDisable} />
                    </div>
                }
                {/* view for remote participant  */}
                {(!isLocalParticipant && !isOwnerView) && (
                    <div className='AtLocalWrap'>
                        {state.isVideoDisable ? (
                            <ImageLoading src={getImageURL(identity.profile, 40)} alt='profile' objectFit="cover" width='196' height='112' blurEffect />
                        ) : (
                            <>
                                <video ref={videoRef} autoPlay={true} className="AtTwilSmallVideo" />
                            </>
                        )}
                        <span className='AtTOwnerName'>{identity.name}</span>
                        <audio ref={audioRef} autoPlay={true} muted={false} />
                    </div>
                )}
            </div>
        </>
    )
}
