import React, { useEffect, useReducer, useRef, useState } from 'react';
import useAudio from '../../../hooks/useAudio';
import { ECallStatus } from '../../../enums/call.enum';
import Timer from './components/Timer';
import ParticipantVideoView from './ParticipantView';
import Image from 'next/image';
import ImageComponent from '../../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
// import { initTracks, stateReducer } from './Videocalling';

const Usercalling = ({ room, participants, handleLeave, data, otherUser, users }: any) => {
    const [playing, play, audio] = useAudio('/outgoing.mp3', true);

    // calling audio
    useEffect(() => {
        if (audio) {
            if (data?.connected) {
                console.log({ data });
                playing && audio?.pause();
            } else {
                play();
                console.log({ data }, 'playing');
                return () => {
                    audio?.pause();
                    if (audio) {
                        console.log({ data }, '');
                        // audio?.pause();
                        playing && play();
                    }
                };
            }
        }
    }, [data?.connected, audio]);

    return (
        <div className="  w-[490px] xs:w-[26rem]     m-auto rounded-[14px] border border-[#2B2B35] pt-8 pb-9">
            <div className=" flex justify-center flex-col items-center">
                {participants?.length > 0 &&
                    participants.map((participant: any, i: any) => {
                        const participantId = JSON.parse(participant.identity).id;
                        return (
                            <ParticipantVideoView
                                key={i}
                                isLocalParticipant={false}
                                participant={participant}
                                user={users.find((el: any) => el._id == participantId)}
                            />
                        );
                    })}
                {!data.connected && data.calling && (
                    <>
                        <figure className="mt-5 AtchatUserprofile w-[75px] h-[75px] relative border-[10px] border-[#2B2B35] rounded-full">
                            {otherUser?.avatar ? (
                                <ImageComponent
                                    className="rounded-full"
                                    src={otherUser?.avatar}
                                    height={75}
                                    width={75}
                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                />
                            ) : (
                                <p className="w-full h-full bg-themecolor text-3xl font-Proxima-SemiBold contain flex items-center justify-center rounded-full text-black1">
                                    {otherUser?.firstName?.charAt(0).toUpperCase()}
                                </p>
                            )}
                        </figure>
                        <h5 className="text-white mt-4">{otherUser?.firstName + ' ' + otherUser?.lastName}</h5>
                    </>
                )}

                {data?.connected || (
                    <p className="mt-2 text-[#B8B8BC;]">{data.status == ECallStatus.RINGING ? 'Ringing' : 'Calling'}</p>
                )}

                <ParticipantVideoView
                    isLocalParticipant={true}
                    participant={room.localParticipant}
                    data={data}
                    handleLeave={handleLeave}
                />
            </div>
        </div>
    );
};

export default Usercalling;
