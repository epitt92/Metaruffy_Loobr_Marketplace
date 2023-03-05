import React from 'react';
import Button from '../../components/Button/Button';
import CountUp from 'react-countup';

interface IProps {
    title?: string;
    price?: any;
    subPrice?: string;
    btn?: boolean;
    onClickRedeem?: Function;
    disabled?: boolean
}

const ReferralReward = ({ title, price, subPrice, btn, onClickRedeem, disabled }: IProps) => {
    return (
        <div className="bg-[#2B2B35] text-xl  p-6  rounded-xl flex flex-col justify-between ">
            <div className="flex justify-between items-center">
                <p className="font-Proxima-SemiBold text-gray6 text-2xl leading-[1.5rem] ">{title}</p>
                {btn && (
                    <Button className="!px-4 !py-2.5 rounded-full text-sm" onClick={onClickRedeem} disabled={disabled}>
                        Redeem Now
                    </Button>
                )}
            </div>
            <h4 className="text-4xl xl:text-4xl mt-4 text-themecolor ">
                <CountUp useEasing duration={1} prefix="$" decimals={2} end={price} /> <sub className="text-base text-[#727279]"> {subPrice}</sub>
            </h4>
        </div>
    );
};

export default ReferralReward;
