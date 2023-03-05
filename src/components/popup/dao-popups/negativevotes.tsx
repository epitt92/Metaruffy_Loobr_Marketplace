import axios from 'axios';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'validate.js';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import ImageComponent from '../../Image/ImageComponent';
import Loader from '../../loader/Loader';
import Notfound from '../../notfound/notfound';

const NegativePopup = ({ data, setstate }: any) => {
    const [votes, setVotes] = useState<any>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        data?.proposalId && fetchVotes();
    }, []);

    const fetchVotes = async () => {
        try {
            setLoading(true);
            const params = {
                uintVote: 2
            };
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dao/votes/${data?.proposalId}`, {
                params: params
            });
            setVotes(res?.data?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div className="sm:w-[44rem] xs:w-full rounded-2xl">
            <h3 className="border-b border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">
                Negative Votes
            </h3>
            {loading ? (
                <Loader />
            ) : isEmpty(votes?.votes) ? (
                <Notfound />
            ) : (
                <div className="min-h-[455px] max-h-[455px] overflow-auto scrollbarHide">
                    <div className="relative">
                        <ul>
                            {votes?.votes?.map((item: any, i: number) => (
                                <li className="w-full list-none" key={i}>
                                    <div className="flex flex-col rounded-3xl p-3 px-8 relative">
                                        <div className="w-full flex relative gap-[16px]">
                                            <figure className="w-[50px] h-[50px] rounded-full overflow-hidden shrink-0 relative">
                                                {item?.user?.avatar ? (
                                                    <ImageComponent
                                                        className="rounded-full"
                                                        src={item?.user?.avatar}
                                                        alt=""
                                                        height={40}
                                                        width={40}
                                                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                                                    />
                                                ) : (
                                                    <>
                                                        <p className="w-[40px] h-[40px] bg-themecolor flex items-center justify-center rounded-full text-black1 text-2xl">
                                                            {item?.user?.firstName?.charAt(0).toUpperCase()}
                                                        </p>
                                                    </>
                                                )}
                                            </figure>
                                            <div>
                                                <h3 className="text-white text-xl font-Proxima-Bold">
                                                    {item?.user?.firstName + ' ' + item?.user?.lastName}
                                                </h3>
                                                <span>{moment(item?.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                        <i className="absolute z-10 top-1/2 right-[2rem] -translate-y-1/2">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8.39001 18.49V8.32998C8.39001 7.92998 8.51001 7.53998 8.73001 7.20998L11.46 3.14998C11.89 2.49998 12.96 2.03998 13.87 2.37998C14.85 2.70998 15.5 3.80998 15.29 4.78998L14.77 8.05998C14.73 8.35998 14.81 8.62998 14.98 8.83998C15.15 9.02998 15.4 9.14998 15.67 9.14998H19.78C20.57 9.14998 21.25 9.46998 21.65 10.03C22.03 10.57 22.1 11.27 21.85 11.98L19.39 19.47C19.08 20.71 17.73 21.72 16.39 21.72H12.49C11.82 21.72 10.88 21.49 10.45 21.06L9.17001 20.07C8.68001 19.7 8.39001 19.11 8.39001 18.49Z"
                                                    fill="#fff"
                                                />
                                                <path
                                                    d="M5.21 6.38H4.18C2.63 6.38 2 6.98 2 8.46001V18.52C2 20 2.63 20.6 4.18 20.6H5.21C6.76 20.6 7.39 20 7.39 18.52V8.46001C7.39 6.98 6.76 6.38 5.21 6.38Z"
                                                    fill="#fff"
                                                />
                                            </svg>
                                        </i>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NegativePopup;
