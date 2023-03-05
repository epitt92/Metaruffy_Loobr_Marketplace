import { MentionsInput, Mention } from 'react-mentions';
import React, { useState, useEffect, HtmlHTMLAttributes } from 'react';
import { userService } from '../../services/user.service';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { _io } from '../../services/socket.service';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
interface Iprops {
    message: string;
    loadinUpload: boolean;
    setMessage: Function;
    trigger: boolean;
    setTrigger: Function;
    userMentions: any;
    data1: any;
    user: any;
    isDragActive: any;
    aboveref?: any;
    height?: boolean;
}

const MentionedMessage = ({
    aboveref,
    message,
    loadinUpload,
    setMessage,
    trigger,
    setTrigger,
    userMentions,
    data1,
    user,
    isDragActive,
    height
}: Iprops) => {
    const defaultStyle = {
        control: {
            width: '100%',
            border: '0px',
            // height: height ? '45px' : '2.625rem'
        },
        suggestions: {
            bottom: '40px',
            top: 'auto',
            marginTop: '30px',

            list: {
                backgroundColor: '#14141f',
                // border: '1px solid #2b2b3a',
                borderRadius: '10px'
            },
            // '&singleLine': {
            //     display: 'inline-block',
            //     width: 180,

            //     highlighter: {
            //         padding: 1,
            //         border: '2px inset transparent'
            //     },
            //     input: {
            //         focus: 'outline-none',
            //         padding: 1
            //     }
            // },
            item: {
                padding: '5px 15px',
                // borderBottom: '1px solid #2b2b3a',

                '&focused': {
                    backgroundColor: '#2a2a3a'
                }
            }
        }
    };
    var urlRegex = /<\/?[a-z][\s\S]*>/g;
    return (
        <div
            className={`relative !rounded-full w-full     border border-[#43434C]  focus:border-themecolor AtmentioninputMessage`}>
            <div className="AtMention braek">
                <MentionsInput
                    inputRef={aboveref}
                    autoFocus={true}
                    autoComplete="off"
                    id="test"
                    maxLength={300}
                    disabled={loadinUpload}
                    value={message}
                    style={defaultStyle}
                    onChange={(event, newValue, newPlainTextValue, mentions): any => {
                        if (event.target.value != ' ') {
                            if (trigger) {
                                setTrigger(false);
                                // const resp = fetch('/api/typing', {
                                //     method: 'POST',
                                //     headers: {
                                //         'Content-Type': 'application/json'
                                //     },
                                //     body: JSON.stringify({ room: data1?._id, user: user?.userName })
                                // });
                                _io.emit('TYPING_FRONTEND', {
                                    room: data1?._id,
                                    user: user?.userName
                                });

                                setTimeout(() => {
                                    setTrigger(true);
                                }, 3000);
                            }
                            if (urlRegex.test(newPlainTextValue)) {
                                toast.error('Invalid text');
                            } else {
                                !urlRegex.test(newPlainTextValue) && setMessage(event.target.value);
                            }
                        } else {
                            if (message.length > 0) {
                                if (trigger) {
                                    setTrigger(false);
                                    // const resp = fetch('/api/typing', {
                                    //     method: 'POST',
                                    //     headers: {
                                    //         'Content-Type': 'application/json'
                                    //     },
                                    //     body: JSON.stringify({ room: data1?._id, user: user?.userName })
                                    // });
                                    _io.emit('TYPING_FRONTEND', {
                                        room: data1?._id,
                                        user: user?.userName
                                    });

                                    setTimeout(() => {
                                        setTrigger(true);
                                    }, 3000);
                                }

                                if (urlRegex.test(newPlainTextValue)) {
                                    toast.error('Invalid text');
                                } else {
                                    !urlRegex.test(newPlainTextValue) && setMessage(event.target.value);
                                }
                            }
                        }
                        // if (event.target.value === ' ') {
                        // } else {
                        //     let newText: any = event.target.value;
                        //     newText = newText.replace(/(?:\#\#\#\#\#)(.{24})(?:\+)/gm, '');
                        //     newText = newText.split('###__').join('<a href=/profile/');
                        //     newText = newText.split('^^__').join('>');
                        //     newText = newText.split('###^^^').join(' </a>');
                        //     setMessage(newText);
                        // }
                    }}
                    // style={defaultStyle}
                    singleLine={false}
                    className=" !outline-transparent !focus:border:red-500     !border-none  w-full resize-none  !text-2xl !font-[400] !font-Proxima-Regular !focus:outline-none !text-white"
                    placeholder={isDragActive ? 'Drop the files here ...' : 'Type your message'}>
                    <Mention
                        trigger="@"
                        onAdd={(e) => {}}
                        data={userMentions}
                        markup="###__#####__id__^^____display__###^^^"
                        renderSuggestion={(entry: any, search, highlightedDisplay, index, focused) => {
                            return (
                                <span className="color-[#fff]  !bottom-[0px] !top-auto">
                                    <div className="flex items-center   ">
                                        <figure className="w-[20px] h-[20px] relative !rounded-full flex items-center justify-center mr-[5px] UerProfileImage !overflow-hidden">
                                            {entry?.avatar ? (
                                                <ImageComponent
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                    src={entry?.avatar}
                                                    transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                    alt=""
                                                />
                                            ) : (
                                                <p className="w-full h-full  !bg-themecolor  flex items-center justify-center rounded-full text-black1 text-lg">
                                                    {entry?.firstName.charAt(0).toUpperCase()}
                                                </p>
                                            )}{' '}
                                        </figure>
                                        <div className="ml-2">
                                            <h3 className="text-white text-base">
                                                {entry?.firstName} {entry?.lastName}
                                            </h3>
                                            {/* <p className="text-[#f1c94a] text-xl">{entry.display}</p> */}
                                        </div>
                                    </div>
                                </span>
                            );
                        }}
                    />
                </MentionsInput>
            </div>
        </div>
    );
};

export default MentionedMessage;
