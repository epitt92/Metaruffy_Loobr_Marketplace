import React from 'react';

type Props = {
    stats: any;
};

const IntStats = ({ stats }: Props) => {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="mt-8 flex   lg:flex-nowrap flex-wrap   ">
            <div className="mt-8 flex  justify-center lg:flex-nowrap flex-wrap  ">
                <div className="h-[6.813rem] w-[11.75rem] lg:rounded-l-[16px] flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg   text-themecolor font-Proxima-SemiBold">
                        {stats?.firstMintDate
                            ? months[new Date(stats?.firstMintDate).getMonth()] +
                              ' ' +
                              new Date(stats?.firstMintDate).getFullYear()
                            : '--'}
                    </h3>
                    <p className="sm:text-lg mt-4 text-white">First mint date</p>
                </div>

                <div className="h-[6.813rem]   w-[11.75rem]  flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg  text-themecolor font-Proxima-SemiBold">
                        {stats?.lastMintDate
                            ? months[new Date(stats?.lastMintDate).getMonth()] +
                              ' ' +
                              new Date(stats?.lastMintDate).getFullYear()
                            : '--'}
                    </h3>
                    <p className="sm:text-lg mt-4 text-white">Last mint date</p>
                </div>
                <div className="h-[6.813rem] w-[11.75rem]  flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg   text-themecolor font-Proxima-SemiBold">
                        {stats?.items || 0}/{stats?.size || 0}
                    </h3>
                    <p className="sm:text-lg mt-5 text-white">Collection Size</p>
                </div>
                <div className="h-[6.813rem] w-[11.75rem]  flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg   text-themecolor font-Proxima-SemiBold">
                        {stats?.floorPrice || 0}
                    </h3>
                    <p className="sm:text-lg mt-4 text-white">Floor Price</p>
                </div>
                <div className="h-[6.813rem] w-[11.75rem]  flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg   text-themecolor font-Proxima-SemiBold">
                        {stats?.holders || 0}
                    </h3>
                    <p className="sm:text-lg mt-4 text-white">Holders</p>
                </div>
                <div className="h-[6.813rem] w-[11.75rem]  flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg  text-themecolor font-Proxima-SemiBold">
                        {stats?.likes || 0}
                    </h3>
                    <p className="sm:text-lg mt-4 text-white">Likes</p>
                </div>
                <div className="h-[6.813rem] w-[11.75rem] lg:rounded-r-[18px]  xs1:w-[calc(598px-148px)] xs2:w-[calc(429px-128px)]  flex flex-col justify-center items-center border border-[#313146]">
                    <h3 className="lg:text-[28px] sm:text-[22px] text-lg  text-themecolor font-Proxima-SemiBold">
                        {stats?.comments || 0}
                    </h3>
                    <p className="sm:text-lg mt-4 text-white">Comments </p>
                </div>
            </div>
        </div>
    );
};

export default IntStats;
