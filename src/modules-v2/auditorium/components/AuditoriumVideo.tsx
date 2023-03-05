import Button from '../../../components/button/button';
import { ImageLoading } from '../../../components/ImageLoading.comonent';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import { auditoriumService, rtcService } from '../../../services';
import Video, { Participant, Room } from 'twilio-video';
import { useSelector } from 'react-redux';
import { authSelector, socketSelector } from '../../../store/selectors';
import AuditoriumChat from './AuditoriumChat';
import AuditoriumUser from './AuditoriumUser';
import { useSocketIO } from '../../../services/socket-auth.service';
import { AUDITORIUM } from '../../../constants';
import { el } from 'date-fns/locale';
import { identity } from 'lodash';
import ParticipantVideoView from './ParticipantVideoView';
import { IAuditorium } from '../../../interfaces/services.interface';
import EndedAuditoriumPopup from '../../../components/modals/EndedAuditoriumPopup';

interface IAuditoriumVideo {
    room: string | any;
    auditorium: IAuditorium;
}
interface IAuditoriumComments {
    userId: string | any;
    name: string;
    profile: string;
    message: string;
}

function AuditoriumVideo({ room, auditorium }: IAuditoriumVideo) {
    const router = useRouter();
    const { isAuth, user } = useSelector(authSelector);
    const socketNode = useSelector(socketSelector);
    // states
    const [roomData, setRoomData] = useState<Room | null>(null);
    const [participants, setParticipants] = useState<Array<Participant>>([]);
    const [comments, setComments] = useState<Array<IAuditoriumComments>>([]);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [view, setView] = useState<string>('user');
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const [removedSession, setRemovedSession] = useState<boolean>(false);

    const isOwnerView = auditorium.user?._id == user?._id;
    const ownerUser = auditorium?.user;

    useEffect(() => {
        if (!room || !isAuth) {
            return;
        }
        setConnecting(true);
        // get twilio access token
        const connectTwilioVideo = async () => {
            const res = await rtcService.getTwilioToken(room);
            let token = res;
            console.log({ room: token });
            // connecting twilio video
            Video.connect(token, { audio: false, video: { width: 300 }, name: room as string })
                .then((roomRes: Room) => {
                    console.log({ roomRes });
                    setRoomData(roomRes);
                    setConnecting(false);
                })
                .catch((err) => {
                    console.log({ room });
                    console.log({ err });
                    setConnecting(false);
                });
        };

        connectTwilioVideo();

        return () => {};
    }, [room]);

    useEffect(() => {
        if (roomData) {
            const participantConnected = (participants: Participant) => {
                setParticipants((prevParticipants: Array<Participant>) => {
                    if (
                        prevParticipants.filter(
                            (el: Participant) => JSON.parse(el.identity).id === JSON.parse(participants.identity).id
                        ).length > 0
                    )
                        return prevParticipants;
                    else return [...prevParticipants, participants];
                });
            };

            const participantDisconnected = (participants: Participant) => {
                setParticipants((prevParticipants: Array<Participant>) =>
                    prevParticipants.filter(
                        (p: Participant) => JSON.parse(p.identity).id !== JSON.parse(participants.identity).id
                    )
                );
            };

            roomData.on('participantConnected', participantConnected);
            roomData.on('participantDisconnected', participantDisconnected);
            roomData.participants.forEach(participantConnected);

            // auditorium socket init
            socketNode.on(`${AUDITORIUM}:${room}`, onAuditoriumEvent);
            return () => {
                (async () => {
                    if (isOwnerView) return await deleteAuditorium();
                })();

                roomData.off('participantConnected', participantConnected);
                roomData.off('participantDisconnected', participantDisconnected);
                roomData.removeAllListeners();
                roomData?.disconnect();
                socketNode.off(`${AUDITORIUM}:${room}`, onAuditoriumEvent);
            };
        }
    }, [roomData]);

    // on Auditorium Event
    const onAuditoriumEvent = (payload: any) => {
        console.log('Socket working', payload);
        switch (payload.type) {
            case 'COMMENTS':
                console.log('comments console');
                setComments((prev: any) => {
                    if (prev.filter((el: any) => el.id === payload.id).length > 0) return prev;
                    else return [...prev, payload];
                });
                break;
            case 'LEAVE':
                console.log('LEAVE console');
                setRemovedSession(true);

                break;

            default:
                break;
        }
    };
    // handle leave auditorium
    const handleLeaveAuditorium = async () => {
        roomData?.disconnect();
        router.back();
    };

    // handle delete auditorium

    const deleteAuditorium = async () => {
        setIsRemoving(true);
        await auditoriumService.deleteAu(auditorium._id);
        setIsRemoving(false);
    };

    // auditorium owner participant detail
    const getAuditoriumOwnerParticipant = () => {
        if (isOwnerView) {
            return roomData?.localParticipant;
        } else {
            const remoteOwner = participants.find((el: Participant) => JSON.parse(el.identity).id == ownerUser?._id);
            if (remoteOwner) {
                return remoteOwner;
            } else return null;
        }
    };
    // main return
    return (
        <>
            {!connecting && (
                <div>
                    <div id="atSapceOwnerProfile">
                        <ParticipantVideoView
                            participant={getAuditoriumOwnerParticipant()}
                            isOwnerView={true}
                            owner={ownerUser}
                            isLocalParticipant={isOwnerView}
                        />
                    </div>
                    <div className="AtDFlex AtMb4 AtMt4">
                        <Button
                            onClick={handleLeaveAuditorium}
                            isLoading={isRemoving}
                            className="AtBtnPrimary AtBtnBlack AtFullWidthBtn AtMr2">
                            Leave
                        </Button>
                        {/* <Button className={`AtBtnPrimary AtBtnSamllPadding AtMr2 AtFlexShrink0 ${view !== 'user' && 'AtBtnBlack'}`} onClick={() => setView('user')}>
                        <i className="icon-users AtFs24 AtMr5"></i> {(participants.length < 10) ? `0${participants.length + 1}` : participants.length + 1}
                    </Button> */}
                        {/* <Button className={`AtBtnPrimary AtBtnSquare AtFlexShrink0 ${view !== 'chat' && 'AtBtnBlack'}`} onClick={() => setView('chat')}>
                        <i className='icon-chat-outline AtFs24'></i>
                    </Button> */}
                    </div>

                    <AuditoriumUser
                        room={room}
                        roomData={roomData}
                        participants={participants}
                        isOwnerView={isOwnerView}
                        ownerId={ownerUser?._id}
                    />
                </div>
            )}
            {console.log({ removedSession })}
            {/* <EndedAuditoriumPopup popup={removedSession} /> */}
        </>
    );
}

export default AuditoriumVideo;
