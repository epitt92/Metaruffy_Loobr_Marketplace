// import React, { useState, useEffect } from 'react';
// import Participants from './Participant';
// import { useRouter } from 'next/router';
// import Video, { Participant, Room } from 'twilio-video';
// import Button from '../Button/Button';
// import { useSelector } from 'react-redux';

// import { _io } from '../../services/socket.service';
// import { userService } from '../../services/user.service';
// import { toast } from 'react-toastify';
// import { AxiosError } from 'axios';
// const Rooms = ({}: any) => {
//     const router = useRouter();
//     const [token, setToken] = useState<any>('');
//     const [name, setName] = useState<any>('');

//     const [room, setRoom] = useState<any>(null);
//     const [participants, setParticipants] = useState<any>([]);
//     const user = useSelector((state: any) => state.auth.user);

//     useEffect(() => {
//         if (user && router?.query?.id) {
//             // rejectedCall();
//             // NotPickingCall();
//             setName(router?.query?.id);
//             callPerson(router?.query?.id, true);
//         }
//         if (user && router?.query?.token) {
//             setName(router?.query?.token);
//             callPerson(router.query.token, false);
//         }
//         if (router && router?.query && user & user?.userId) {
//             // callEnded();
//         }
//     }, [router, user]);

//     const callPerson = async (value: any, callOther: boolean) => {
//         let data = await userService.getCallToken(value, callOther);
//         console.log('data', data);

//         try {
//             setToken(data.data);
//         } catch (err: any) {
//             console.log(err);

//             toast.error(err?.response?.data?.message);
//         }
//     };

//     useEffect(() => {
//         if (!token || !user) return;
//         else {
//             const participantConnected = (participant: any) => {
//                 console.log(participant, 'person added');
//                 // if (participants.length < 1) {
//                 setParticipants((prevParticipants: any) => [...prevParticipants, participant]);
//                 // }
//             };

//             const participantDisconnected = (participant: any) => {
//                 // console.log(participant);
//                 room?.disconnect();
//                 router.push('/');
//                 toast.error(JSON.parse(participant?.identity)?.name + 'lefted');
//                 setParticipants((prevParticipants: any) => prevParticipants.filter((p: any) => p !== participant));
//             };

//             Video.connect(token, {
//                 name: name
//             }).then((room: any) => {
//                 console.log(room, 'grow');
//                 setRoom(room);
//                 room.on('participantConnected', participantConnected);
//                 room.on('participantDisconnected', participantDisconnected);
//                 room.participants.forEach(participantConnected);
//             });

//             return () => {
//                 // room?.off('participantConnected', participantConnected);
//                 // room?.off('participantDisconnected', participantDisconnected);
//                 // room?.removeAllListeners();
//                 // room?.disconnect();
//                 // setRoom(null);
//                 // setParticipants([]);
//                 // roomData?.disconnect(); room?.disconnect();
//                 // room?.disconnect();
//                 // room?.disconnect();
//                 // router.push('/');
//                 console.log('tootootoototootootooto');
//                 // setRoom((currentRoom: any) => {
//                 //     console.log('tootootoototootootooto');
//                 //     // if (currentRoom && currentRoom.localParticipant.state === 'connected') {
//                 //     //     currentRoom.localParticipant.tracks.forEach(function (trackPublication: any) {
//                 //     //         trackPublication.track.stop();
//                 //     //     });
//                 //     //     currentRoom.disconnect();
//                 //     //     return null;
//                 //     // } else {
//                 //     currentRoom.disconnect();
//                 //     return null;
//                 //     // }
//                 // });
//                 // room.disconnect();
//             };
//         }
//     }, [token, user]);
//     useEffect(() => {
//         if (room) {
//             return () => {
//                 // router.push('/');
//                 // callDisconnect();
//                 console.log('tootootoototootootooto');
//                 room?.disconnect();
//             };
//         }
//     }, [room]);
//     const remoteParticipants = participants.map((participant: any) => (
//         <Participants key={participant.sid} participant={participant} isLocalParticipant={false} />
//     ));
//     const handleLeaveAuditorium = async () => {
//         room?.disconnect();
//         router.push('/');
//     };
//     // const callDisconnect = async () => {
//     //     await userService.endCall(name);
//     // };
//     return (
//         <div>
//             <Button
//                 onClick={() => {
//                     handleLeaveAuditorium();
//                 }}>
//                 Leave
//             </Button>
//             <div className="flex ">
//                 {room && <Participants participant={room.localParticipant} isLocalParticipant={true} />}
//                 {room && remoteParticipants}
//             </div>
//         </div>
//     );
// };

// export default Rooms;
