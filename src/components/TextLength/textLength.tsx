import React, { useState, useEffect, useLayoutEffect } from 'react';
import Poups from '../popup/poups';
// import dompurify from 'dompurify';
import DOMPurify from 'isomorphic-dompurify';
interface Iprops {
    item?: any;
    val?: any;
    setIndexes?: any;
    indexes?: any;
}

const TextLength = ({ item, indexes, val, setIndexes }: Iprops) => {
    const [state, setState] = useState<number>(-1);
    const [popup, setPopup] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    const [tagless, setTagless] = useState<string>('');
    useEffect(() => {
        let a = item?.text?.replace(new RegExp('<[^>]*>', 'g'), '');
        setTagless(a);
    }, []);
    function urlify(text: string) {
        var urlRegex = /(https?:\/\/[^\s^\<]+)/g;

        return text?.replace(urlRegex, function (url) {
            return `<a target="_blank"  href=${url} id=${url}>  ${url} </a>`;
        });
    }
    //   function urlify(text: string) {
    //     var urlRegex = /(https?:\/\/[^\s^\<]+)/g;

    //     return text?.replace(urlRegex, function (url) {
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
        <>
            <div className="flex flex-col max-w-full sm:max-w-[75%]   braek ">
                <p
                    className="inline text-white  dangrous-html "
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(urlify(item?.text))
                    }}></p>
            </div>
            {/* this is commented because in future if want to add read more and less functionality */}
            {/* {item?.text?.replace(new RegExp("<[^>]*>", "g"), "")?.length > 250 ? (
        <>
          {indexes.includes(val) ? (
            <>
              <div className="flex flex-col  max-w-full sm:max-w-[75%]">
                <p
                  className="inline text-white   braek"
                  dangerouslySetInnerHTML={{
                    __html: item?.text,
                  }}
                ></p>
                <span
                  className="text-[#f1c94a] cursor-pointer capitalize braek"
                  onClick={() => {
                    // setCommentIndex(i);
                    setIndexes(val);
                  }}
                >
                  {" "}
                  read less
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex  flex-col max-w-full sm:max-w-[75%]">
                <p
                  className="inline text-white break"
                  dangerouslySetInnerHTML={{
                    __html: item?.text?.slice(0, 250),
                  }}
                />
                <span
                  className="text-[#f1c94a] cursor-pointer capitalize  braek"
                  onClick={() => {
                    setIndexes(val);
                  }}
                >
                  {" "}
                  read more ...
                </span>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col max-w-full sm:max-w-[75%]">
          <p
            className="inline text-white braek"
            dangerouslySetInnerHTML={{
              __html: item?.text,
            }}
          />
        </div>
      )} */}
            {state && (
                <Poups show={popup} hide={setPopup} setPopup={setPopup} state={state} setstate={setState} data={data} />
            )}
        </>
    );
};

export default TextLength;
