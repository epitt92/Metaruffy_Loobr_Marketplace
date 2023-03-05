import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, deletePost } from '../../redux/user/actions';
import Button from '../Button/Button';
import { toast } from 'react-toastify';
import { marketPlaceService } from '../../services/marketplace.service';
import { referralService } from '../../services/referral.serveice';
const RedeemConfirm = ({ data, setstate }: any) => {
    const [loading, setLoading] = useState<boolean>(false);

    const redeemAmount = async () => {
        try {
            await referralService.redeemRequest()
            toast.success('Yes Redeemed');
            setstate();
        } catch (error) {
            console.log(error)
        }

    };

    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">Redeem </h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want <span className="block">to redeem.</span>
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                    disabled={loading}
                    onClick={() => {
                        setstate();
                    }}
                    className="w-full rounded-lg text-[#727279] !bg-[#2b2b35]">
                    Cancel
                </Button>
                <Button
                    className="w-full text-white rounded-lg gold bg-themecolor"
                    onClick={() => {
                        redeemAmount();
                    }}
                    isLoading={loading}
                    disabled={loading}>
                    Redeem
                </Button>
            </div>
        </div>
    );
};

export default RedeemConfirm;
