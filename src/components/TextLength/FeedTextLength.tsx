import React, { useState, useEffect, useLayoutEffect } from 'react';
import Popups from '../popup/poups';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
interface Iprops {
    item?: any;
    val?: any;
    setIndexes?: any;
    indexes?: any;
}

const FeedTextLength = ({ item, indexes, val, setIndexes }: Iprops) => {
    const [state, setState] = useState<number>(-1);
    const [popup, setPopup] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    function urlify(text: string) {
        var urlRegex = /(https?:\/\/[^\s^\<]+)/g;

        return text?.replace(urlRegex, function (url) {
            return `<a  target="_blank" href=${url} id=${url}>  ${url} </a>`;
        });
    }
    // function urlify(text: string) {
    //     var urlRegex = /(https?:\/\/[^\s^\<]+)/g;

    //     return text.replace(urlRegex, function (url) {
    //         return `<p target="_blank" class="text-[#f1c94a] cursor-pointer" href=${url} id=${url}>  ${url} </p>`;
    //     });
    // }
    // var urlRegex = /(https?:\/\/[^\s^\<]+)/g;
    // useLayoutEffect(() => {
    //     if (item?.text) {
    //         let links = item?.text.match(urlRegex);
    //         console.log(links, 'slow');
    //         if (links) {
    //             links.map((link: string) => {
    //                 document.getElementById(link)?.setAttribute('color', 'green');
    //                 document.getElementById(link)?.addEventListener('click', function (e: any) {
    //                     openLink(e, link);
    //                 });
    //             });
    //         }
    //     }
    // }, [item.text]);
    // const openLink: any = (e: any, val: any) => {
    //     if (!e) e = window.event;
    //     e.stopPropagation();
    //     setData({ link: val });
    //     setPopup(true);
    //     setState(71);
    // };
    return (
        <span className=" ">
            <p
                className="inline text-white dangrous-html text-[16px] braek  break-words"
                dangerouslySetInnerHTML={{
                    __html: item?.text && DOMPurify?.sanitize(urlify(item?.text))
                }}
            />
            {/* {item?.text?.replace(new RegExp('<[^>]*>', 'g'), '')?.length > 250 ? (
                <>
                    {indexes.includes(val) ? (
                        <>
                            <p
                                className="inline text-white text-[16px] braek"
                                dangerouslySetInnerHTML={{
                                    __html: urlify(item?.text)
                                }}></p>
                            <span
                                className="text-[#f1c94a] cursor-pointer capitalize braek"
                                onClick={(e: any) => {
                                    // setCommentIndex(i);
                                    setIndexes(e);
                                }}>
                                {' '}
                                read less
                            </span>
                        </>
                    ) : (
                        <>
                            <p
                                className="inline text-white text-[16px] braek"
                                dangerouslySetInnerHTML={{
                                    __html: urlify(item?.text?.slice(0, 250))
                                }}
                            />
                            <span
                                className="text-[#f1c94a] cursor-pointer capitalize  braek"
                                onClick={(e) => {
                                    setIndexes(e);
                                }}>
                                {' '}
                                read more ...
                            </span>
                        </>
                    )}
                </>
            ) : (
                <p
                    className="inline text-white text-[16px] braek"
                    dangerouslySetInnerHTML={{
                        __html: urlify(item?.text)
                    }}
                />
            )} */}

            {state && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    setPopup={setPopup}
                    state={state}
                    setstate={setState}
                    data={data}
                />
            )}
        </span>
    );
};

export default FeedTextLength;
