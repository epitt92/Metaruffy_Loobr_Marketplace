import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import MentionedInput from '../mentionedInput/mentionedInput';
interface IProps {
    reply: any;
    setReply: any;
    setMentionedUsers: any;

    replyshow: any;
}

export const MentionReply = ({ setReply, setMentionedUsers, reply, replyshow }: IProps) => {
    let focusInput: any = useRef();
    useEffect(() => {
        if (replyshow) {
            setTimeout(() => {
                if (focusInput.current) focusInput.current.focus();
            }, 500);
        }
    }, [replyshow]);

    useLayoutEffect(() => {
        focusInput.current?.focus();
    }, []);
    return (
        <MentionedInput
            aboveref={focusInput}
            autoFocuss={true}
            styles="!rounded-full  py-3 pl-[20px]  pr-[100px]   border border-[#43434C] text-base Atmentioninput"
            singleLine={true}
            placeHolder={'Add reply'}
            value={reply}
            setMentionedUsers={setMentionedUsers}
            setValues={(value: any) => setReply(value)}
        />
    );
};
