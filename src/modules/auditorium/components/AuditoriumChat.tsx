import React, { useEffect, useRef, useState } from 'react'
import Avatar from "../../../components/avatar/avatar";
import Button from "../../../components/button/button";
import { auditoriumService } from '../../../services';
import { v4 as uuidv4 } from 'uuid'
import { useSelector } from 'react-redux';
import { authSelector } from '../../../store/selectors';
import NoDataScreen from '../../../components/NoDataScreen';
import { getImageURL } from '../../../shared';
export default function AuditoriumChat({ room, comments, setComments }: any) {

    const [messageInput, setMessageInput] = useState('')
    const { user } = useSelector(authSelector)
    const messageListRef = useRef<any>(null)

    // scroll to bottom on new message
    useEffect(() => {
        if (comments.length > 0) {
            scrollToBottom()
        }
        return () => { }
    }, [comments])

    // scroll to bottom
    const scrollToBottom = () => {
        const scrollHeight = messageListRef.current.scrollHeight;
        const maxScrollTop = scrollHeight;
        messageListRef.current.scrollTop = maxScrollTop;
    }

    // on comment send
    const onSend = async (e: any) => {
        e.preventDefault()
        if (!messageInput) return
        const data = {
            message: messageInput,
            roomId: room,
            id: uuidv4(),
            firstName: user.firstName,
            lastName: user.lastName,
            profile: user.profile,
            userId: user._id
        }
        setComments((prev: any) => [...prev, data])
        setMessageInput('')
        await auditoriumService.postComment(data)

    }

    // main return
    return (
        <div>
            <div className="AtAuditComments ">
                <div ref={messageListRef} className="AtCommentsInner AtScrollNone handle">
                    {comments.length > 0 && comments.map((comment: any) => {
                        return <div key={comment?.id} className="AtAuditaMsg"> <Avatar classNameHolder="AtAvatarAgoraMsg" src={comment.profile} className='AtMessageUserAvatar' size={40} />
                            <div className="AtMsgBox">
                                <h6>{comment.firstName} {comment.lastName}</h6>
                                <p>{comment.message}</p>
                            </div></div>
                    })}
                    {comments.length < 1 && <NoDataScreen className='AtChatNoData AtPt4Imp' heading='No Comments' NoDataText='Be the first to start comment' hideImage />}

                    {/* AtAuditaMsg ends */}
                </div>
                {/* AtCommentsInner ends */}
                <div className="AtFormGroup AtCommentsInput">
                    <form className="AtInputWithBtn" onSubmit={onSend}>
                        <input
                            onChange={(e) => setMessageInput(e.target.value)} value={messageInput}
                            type="text" className="AtFormControl AtBgBlack3" placeholder="Type your message" />
                        <Button className="AtOfferBtn AtBtnPrimary" type='submit'
                            disabled={messageInput == ''}
                        >
                            <i className="icon-send"></i>
                        </Button>
                    </form>
                </div>
            </div></div>
    )
}
