import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DISCONECTED, CALLING } from '../../../constants/socketEvents';
import { _io } from '../../../services/socket.service';
import { userService } from '../../../services/user.service';
import Usercalling from './Usercalling';
import Video, { Participant, Room } from 'twilio-video';
import Loader from '../../loader/Loader';
import { ECallStatus } from '../../../enums/call.enum';


const Callinguser = ({ data, setstate, setData, hide }: any) => {
    // const [first, setFirst] = useState(true);
    const [loading, setLoading] = useState<any>(false);
    const [callState, setCallState] = useState<any>(data);
    const [room, setRoom] = useState<any>(null);
    const [participants, setParticipants] = useState<any>([]);
    const user = useSelector((state: any) => state.auth.user);

    // auto close call if not attended
    const deadline = useRef(new Date().getTime() + 135000)
    const getTime = () => {
        const time = (deadline.current - Date.now()) / 1000;
        if (time < 1 && participants.length < 1) {
            callMissed()
            handleLeave(true)
            console.log('Missed By timer')
        }
    };

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);
        return () => {
            clearInterval(interval);
        }
    }, [hide, data, callState, participants]);

    // update call state
    const updateData = (updateState: any) => {
        setCallState((prev: any) => {
            return {
                ...prev, ...updateState
            }
        })
    }




    // initiate call
    useEffect(() => {
        handleStartCall()
        return () => {
        };
    }, []);

    const handleStartCall = async () => {
        try {
            setLoading(true);

            let token = null;
            let roomId: any = null;

            // if user is calling 
            if (callState?.calling) {
                let res: any = await userService.startCall(callState?.reciver);
                if (res.data?.success == false) {
                    console.log({ res })
                    toast.error(res?.data?.message)
                    setstate(-1);
                    setLoading(false);
                    return false
                }
                token = res.data?.data?.token;
                roomId = res?.data?.data?._id
                updateData({ ...res?.data?.data });

            }
            // recevinng the call
            else if (callState?.receving) {
                token = callState?.token
                roomId = callState?.roomId
            }

            // connecting the video
            Video?.connect(token, {
                name: roomId,
                video: false,
                audio: true
            })
                .then((room: any) => {
                    setRoom(room);
                    setLoading(false);
                })
                .catch(async (err) => {
                    console.log({ err })
                    toast.error(err.response?.data?.message)
                    callEnded()
                    setstate(-1);
                    setLoading(false);
                });
        } catch (err: any) {
            console.log({ err }, 'from try')
            toast.error(err?.response?.data?.message);
            setLoading(false);
            setstate();
        }
    };

    useEffect(() => {
        if (room) {
            const participantConnected = (participants: Participant) => {
                setCallState((prev: any) => { return { ...prev, connected: true, calling: false } });
                setParticipants((prevParticipants: Array<Participant>) => {
                    if (prevParticipants.filter((el: Participant) => JSON.parse(el.identity).id === JSON.parse(participants.identity).id).length > 0) return prevParticipants;
                    else return [...prevParticipants, participants]
                });
            };

            const participantDisconnected = (participants: Participant) => {
                callEnded()
                setstate();
                hide();
                toast.error(JSON.parse(participants?.identity)?.name + ' lefted');
                setParticipants((prevParticipants: Array<Participant>) =>
                    prevParticipants.filter((p: Participant) => JSON.parse(p.identity).id !== JSON.parse(participants.identity).id)
                );
            };

            const socketEventName = `${user?.userId}:${CALLING}`

            room.on("participantConnected", participantConnected);
            room.on("participantDisconnected", participantDisconnected);
            room.participants.forEach(participantConnected);
            console.log({ socketEventName })
            _io.on(socketEventName, initCallSockets)


            return () => {
                room.off("participantConnected", participantConnected);
                room.off("participantDisconnected", participantDisconnected);
                room.removeAllListeners()
                room?.disconnect();
                disconected()
                _io.off(socketEventName, initCallSockets)
                setParticipants([])
                setRoom(null)
            };
        }
    }, [room]);


    const initCallSockets = (payload: any) => {
        console.log({ payload })
        switch (payload.status) {
            case ECallStatus.DECLINE:
                toast.error(`Call Rejected by ${payload?.from?.firstName} ${payload?.from?.lastName}`);
                handleLeave()
                break;
            case ECallStatus.RINGING:
                updateData({ status: ECallStatus.RINGING })
                break;

            default:
                break;
        }

    }

    const disconected = () => {
        _io.off(`${user?.userId}:${DISCONECTED}`);
        _io.on(`${user?.userId}:${DISCONECTED}`, (newdata: any) => {
            if (newdata.from != user?.userId) {
                _io.off(`${user?.userId}:${DISCONECTED}`);
                room?.disconnect();
                setstate();
            }
        });
    };

    const callEnded = async () => {
        await userService.updateCallStatus(callState?._id, ECallStatus.ENDED)
        room?.disconnect();
    };
    const callMissed = async () => {
        toast.error("Call Missed")
        await userService.updateCallStatus(callState?._id, ECallStatus.MISSED)
        room?.disconnect();
    };

    const handleLeave = async (isMissed: boolean = false) => {
        room?.disconnect();
        isMissed ? callMissed : callEnded();
        setstate();
    };

    const otherUser = useMemo(() => data?.users?.find((item: any) => item?._id !== user?.userId), [data, user]);

    return (
        <div>
            {loading && (
                <div className="w-[490px] xs:w-[26rem]   m-auto rounded-[14px] border border-[#2B2B35] pt-8 pb-9">
                    <Loader />
                </div>
            )}
            {(room && !loading) &&
                <Usercalling
                    otherUser={otherUser}
                    users={data?.users}
                    room={room}
                    participants={participants}
                    handleLeave={handleLeave}
                    data={callState}
                    setCallState={setCallState}

                />
            }
        </div>
    );
};

export default Callinguser;
