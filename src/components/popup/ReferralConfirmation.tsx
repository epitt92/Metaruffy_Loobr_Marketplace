import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { affiliateUser } from '../../redux/auth/actions';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import ImageComponent from '../Image/ImageComponent';
const ReferralConfirmation = ({ setstate }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const affiliateyourself = () => {
        setLoading(true);
        dispatch(affiliateUser(setConfirmed));
    };
    useEffect(() => {
        if (confirmed) {
            setLoading(false);
            setConfirmed(false);
            setstate();
            router.push('referral');
        }
    }, [confirmed]);

    return (
        <div className=" sm:w-[43.125rem] w-[40rem] xs:w-[33rem] xs2:w-[30rem] xs4:w-[26rem] py-12  rounded-2xl">
            <div className="flex justify-center items-center flex-col">
                <ImageComponent
                    className="rounded-full "
                    src="/assets/images/lock.gif"
                    alt=""
                    objectFit="cover"
                    layout="fill"
                    figClassName="h-[23.125rem] w-[23.125rem] relative"
                />
                <h2 className="text-white mt-6 sm:text-[text-[2.5rem] text-3xl"> Unlock your affiliate account</h2>
                <p className="mt-4 text-lg font-Proxima-SemiBold text-center">
                    {' '}
                    Unlock your affiliate account to refer people <br /> and get amazing rewards
                </p>
            </div>
            <div className="px-24 ">
                <Button
                    className="w-full !rounded-[3.125rem] !text-xl mt-28"
                    onClick={() => {
                        affiliateyourself();
                    }}
                    isLoading={loading}
                    disabled={loading}>
                    Unlock Now!
                </Button>
            </div>
        </div>
    );
};

export default ReferralConfirmation;
