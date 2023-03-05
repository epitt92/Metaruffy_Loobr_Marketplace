import { userInfo } from 'os';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ImageComponent from '../../components/Image/ImageComponent';
import Input from '../../components/input/Input';
import Select from '../../components/select/Select';
import { referralService } from '../../services/referral.serveice';
import BaarChart from './Graph';
import ReferralLevel from './ReferralLevel';
import ReferralReward from './ReferralReward';
import withAuth from '../../components/Hoc/withAuth';
import Poups from '../../components/popup/poups';
import ReferralsSlider from './ReferralsSlider';
import { useRouter } from 'next/router';

const ReferralModule = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [selected, setSelected] = useState({ id: 2, name: 'Current', value: 'year' });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const sortdata = [
        { id: 2, name: 'Current', value: 'year' },
        { id: 0, name: 'Last Week', value: 'week' },
        { id: 1, name: 'Last Month', value: 'month' }
    ];
    const router = useRouter();
    useEffect(() => {
        if (!user?.referral) {
            router.push('/');
        } else if (user && user.userId) {
            getReferralData();
        }
    }, [user, selected]);
    const getReferralData = async () => {
        setLoading(true);
        try {
            let res = await referralService.getRefferalData(selected.value);
            setData(res?.data?.data);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };
    const handleSelectSort = (values: any) => {
        setSelected(values);
    };

    const getValueInMR = (value: any) => {
        return `(${value ? Number(Number(value / 0.00000824).toFixed()).toLocaleString() : 0} $MR)`;
    };
    const formateNumber = (value: any) => {
        return value ? Number(value).toFixed(2) : 0;
    };
    const onClickRedeem = () => {
        setState(90);
        setPopup(true);
    };

    return (
        <div className="container mb-28 min-h-[40rem] mt-16">
            <div className="flex flex-col lg:flex-row gap-20 justify-between items-start">
                <div className="sm:w-[40rem]">
                    <div className="flex items-center gap-10 ">
                        <ImageComponent width={150} height={150} alt="" src="/assets/images/referral.png" />
                        <h1 className="text-5xl 2xl:text-[4rem] text-white">
                            Refer Friends,
                            <span className="block">Earn Rebates!</span>
                        </h1>
                    </div>
                    <p className="mt-10 text-2xl text-gray6">
                        Share your referral link with your friends, if they buy or sell an NFT, then your invitation
                        will be activated. You will win rewards against each transaction. Start referring today!
                    </p>
                    {/* <p className="text-themecolor text-xl mt-5 cursor-pointer">View referral rules &gt;</p> */}
                </div>
                <div className="border border-gray5 w-full lg:w-[41.12rem] rounded-3xl px-6 py-10">
                    <div className="grid xs4:grid-cols-1  xs:grid-cols-2 grid-cols-3 gap-4">
                        <ReferralLevel title="Referral Level" head={data?.level || 0} />
                        <ReferralLevel
                            title="Referrals needed for next level"
                            head={data?.level * 100 - data?.count || 0}
                        />
                        <ReferralLevel title="Total Referrals" head={data?.count || 0} />
                    </div>
                    <p className="text-gray6 text-lg mt-6 mb-4">Referral Link</p>
                    <div className="relative flex items-center  ">
                        <span className="text-[#FFFFFF]  !w-full !h-10 text-sm border-2 border-[#2B2B35] px-6 py-[6px] rounded-lg">
                            {(user && `${process.env.NEXT_PUBLIC_URL}/?referral=${user?.userName}`) || ''}
                        </span>
                        <CopyToClipboard
                            text={`${process.env.NEXT_PUBLIC_URL}/?referral=${user?.userName}`}
                            onCopy={() => toast.success('Address successfully copied')}>
                            <i className="icon-copy text-xl absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer "></i>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
            <div className="mt-[3.75rem] flex justify-between gap-6 flex-wrap">
                <h3 className="text-2xl xl:text-[2rem] text-white ">Reward Details</h3>
                <Select
                    className="rounded-lg  cursor-pointer border-2 border-[#2B2B35] px-5 !text-base"
                    parentstyle="!rounded-lg  border-2 border-[#2B2B35] px-5 !min-w-full"
                    style="!w-[220px] xs:!w-full !m-0 cursor-pointer "
                    placeholder="Last week"
                    data={sortdata}
                    selected={selected}
                    onSelect={handleSelectSort}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
                <ReferralReward
                    title="Total Rewards"
                    price={formateNumber(data?.currentPrice)}
                    subPrice={getValueInMR(data?.currentPrice)}
                    btn={true}
                    onClickRedeem={onClickRedeem}
                    disabled={data?.currentPrice < 100}
                />
                <ReferralReward
                    title="Referrals Volume Traded"
                    price={formateNumber(data?.referralVolumeTraded)}
                    subPrice={getValueInMR(data?.referralVolumeTraded)}
                />
                <ReferralReward
                    title="Available to Redeem"
                    price={formateNumber(data?.currentPrice > 100 ? data?.currentPrice : 0)}
                    subPrice={getValueInMR(data?.currentPrice > 100 ? data?.currentPrice : 0)}
                />
                <ReferralReward
                    title="Total Redeemed"
                    price={formateNumber(data?.totalRedeemed)}
                    subPrice={getValueInMR(data?.totalRedeemed)}
                />
            </div>
            <div className="flex gap-1.5 items-center mt-2.5">
                <div className="h-[1.125rem] w-[1.125rem] rounded-full bg-[#F2873A] text-black1 flex justify-center items-center">
                    !
                </div>
                <p>You can Redeem minimum $100</p>
            </div>
            <div className="h-[50vh] my-24">{loading || <BaarChart stats={data?.stats} />}</div>
            <ReferralsSlider />
            {state && <Poups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};

export default withAuth(ReferralModule);
