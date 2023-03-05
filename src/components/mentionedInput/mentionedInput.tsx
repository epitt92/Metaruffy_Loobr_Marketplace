import { MentionsInput, Mention } from 'react-mentions';
import React, { useState, useEffect, HtmlHTMLAttributes } from 'react';
import { userService } from '../../services/user.service';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ImageComponent from '../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
interface Iprops {
    styles?: string;
    value?: string;
    setMentionedUsers: Function;
    setValues: Function;
    setLength?: Function;
    allData?: any;
    placeHolder?: string;
    singleLine?: boolean;
    disabled?: boolean;
    nftDisabled?: boolean;
    autoFocuss?: boolean;
    aboveref?: any;
    textsize?:any

    // emoji?: any;

    // setMore300?: Function;
}

const MentionedInput = ({
    value,
    styles,
    setValues,
    setMentionedUsers,
    allData,
    placeHolder,
    singleLine,
    disabled,
    nftDisabled,
    autoFocuss,
    aboveref,
    setLength,
    textsize
}: // emoji,
// setMore300,
Iprops) => {
    const getAllusers = async (search: string, callBack: any) => {
        await userService
            .getFeedUser(search)
            .then((res) =>
                res.data.data.map((user: any) => ({
                    id: user._id + '+' + user.userName,
                    display: '@'.concat(user.userName),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    userName: user.userName
                }))
            )
            .then(callBack);
    };

    const defaultStyle = {
        control: {
            width: '100%',
            border: '0px'
        },

        suggestions: {
            marginTop: '30px',
            marginLeft: '10px',

            list: {
                backgroundColor: '#14141f',
                border: '1px solid #2b2b3a',
                borderRadius: '10px'
            },
            '&singleLine': {
                display: 'inline-block',
                width: 180,

                highlighter: {
                    padding: 1,
                    border: '2px inset transparent'
                },
                input: {
                    focus: 'outline-none',
                    padding: 1,
                    border: '2px inset'
                }
            },
            '&multiLine': {
                control: {
                    fontFamily: 'monospace',
                    minHeight: 63
                },
                highlighter: {
                    padding: 9,
                    border: '1px solid transparent'
                },
                input: {
                    focus: 'outline-none',
                    padding: 9,
                    border: '1px solid silver'
                }
            },

            item: {
                padding: '5px 15px',
                borderBottom: '1px solid #2b2b3a',

                '&focused': {
                    backgroundColor: '#2a2a3a'
                }
            }
        }
    };
    var urlRegex = /<\/?[a-z][\s\S]*>/g;
    return (
        <div className={`${styles} relative`}>
            <div className={`${textsize? textsize :'AtMention'}  braek`}>
                <MentionsInput
                    inputRef={aboveref}
                    autoFocus={autoFocuss}
                    autoComplete="off"
                    id="test"
                    maxLength={300}
                    disabled={disabled || nftDisabled}
                    value={value}
                    onChange={(event, newValue, newPlainTextValue, mentions): any => {
                        let a: Array<any> = [];
                        mentions.map((mentioned) => {
                            a.push(mentioned.id.split('+')[0]);

                            // console.log(mentioned.id.split('+')[0]);
                            // console.log(mentioned);
                        });
                        setMentionedUsers([...a]);
                        let text = event.target.value;
                        // set();
                        // console.log(text);
                        // text = text
                        //   .replace(new RegExp("(?<=__)(.*)(?=__)", "g"), "")
                        //   .replace("@@@____", "")
                        //   .replace("@@@^^^", "");
                        // if (text.length > 300) {
                        //   setValues(event.target.value.slice(0, 300));
                        // } else {
                        //   setValues(event.target.value);
                        // }
                        if (newPlainTextValue.length > 300) {
                            toast.error('Max length limit is crossing');
                        } else {
                            if (urlRegex.test(newPlainTextValue)) {
                                toast.error('Invalid text');
                            } else {
                                setLength && setLength(newPlainTextValue.length);

                                setValues(event.target.value);
                            }
                        }
                    }}
                    style={defaultStyle}
                    singleLine={singleLine}
                    className=" !outline-transparent braek  !focus:border:transparent    !border-none   w-full resize-none  !text-2xl !font-[300] !font-Proxima-Regular !focus:outline-none !text-white"
                    placeholder={placeHolder}>
                    <Mention
                        trigger="@"
                        onAdd={(e) => {}}
                        data={getAllusers}
                        markup="###__#####__id__^^____display__###^^^"
                        renderSuggestion={(entry: any, search, highlightedDisplay, index, focused) => {
                            return (
                                <span className="color-[#fff]">
                                    <div className="flex items-center ">
                                        <figure className="w-[40px] h-[40px] relative  !rounded-full flex items-center justify-center mr-[5px] UerProfileImage !overflow-hidden">
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
                                                <p className="w-full h-full bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                    {entry?.firstName.charAt(0).toUpperCase()}
                                                </p>
                                            )}{' '}
                                        </figure>
                                        <div className="ml-4">
                                            <h3 className="text-white">
                                                {entry?.firstName} {entry?.lastName}
                                            </h3>
                                            <p className="text-[#f1c94a] text-xl">{entry.display}</p>
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

export default MentionedInput;
