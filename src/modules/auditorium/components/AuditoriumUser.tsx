import React from 'react'
import { Participant } from 'twilio-video'
import ParticipantVideoView from './ParticipantVideoView'

export default function AuditoriumUser({ room, roomData, participants, isOwnerView, ownerId }: any) {



    // main return
    return (
        <div className='AtTwilioMain'>
            {(roomData?.localParticipant && !isOwnerView) && < ParticipantVideoView isLocalParticipant participant={roomData?.localParticipant} key={roomData?.localParticipant?.identity} />}
            {participants.map((participant: Participant) => {
                // don't retrun a remote participant if its a owner
                if (JSON.parse(participant.identity).id == ownerId) return null
                return <ParticipantVideoView key={participant.identity} participant={participant} />
            })}
        </div>
    )
}
