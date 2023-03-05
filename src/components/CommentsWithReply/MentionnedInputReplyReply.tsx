import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import MentionedInput from '../mentionedInput/mentionedInput';
interface IProps {
    reply1: any;
    setReply1: any;
    setMentionedUsers: any;
    replyofreplyshow: any;
}

export const MentionReplyReply = ({ setReply1, setMentionedUsers, reply1, replyofreplyshow }: IProps) => {
    let focusInput: any = useRef();
    useEffect(() => {
        if (replyofreplyshow) {
            setTimeout(() => {
                if (focusInput.current) focusInput.current.focus();
            }, 500);
        }
    }, [replyofreplyshow]);

    useLayoutEffect(() => {
        focusInput.current?.focus();
    }, []);
    return (
        <MentionedInput
            autoFocuss={true}
            // styles={""}
            styles="!rounded-full py-3 pl-[20px]    pr-[100px] border border-[#43434C] text-base Atmentioninput"
            singleLine={true}
            placeHolder={'Add reply'}
            value={reply1}
            setMentionedUsers={setMentionedUsers}
            setValues={(value: any) => setReply1(value)}
            aboveref={focusInput}
        />
    );
};
