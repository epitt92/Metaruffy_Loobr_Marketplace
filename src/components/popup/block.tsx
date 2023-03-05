import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getTopUsers } from '../../redux/user/actions';

import { userService } from '../../services/user.service';
import Button from '../Button/Button';

const Block = ({ data, setState, setConfirmed }: any) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const BlockUser = async () => {
        setLoading(true);
        try {
            await userService.blockUser(data);
            console.log('Cjhwehhkchk');
            if (router.asPath == '/feeds') {
                const fileters = {
                    pageSize: 5
                };
                dispatch(getTopUsers(fileters, false));
            }
            toast.success('Blocked successfully');
            setConfirmed(true);
        } catch (err: any) {
            // console.log(err);
        }

        setState();
        setLoading(false);
    };
    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">Block User</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want <span className="block">to block this user?</span>
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                    disabled={loading}
                    onClick={() => {
                        setState();
                    }}
                    className="w-full rounded-lg text-[#727279] !bg-[#2b2b35]">
                    Cancel
                </Button>
                <Button
                    className="w-full rounded-lg gold text-white !bg-[#ff2323]"
                    onClick={() => {
                        BlockUser();
                    }}
                    isLoading={loading}
                    disabled={loading}>
                    Block
                </Button>
            </div>
        </div>
    );
};

export default Block;
