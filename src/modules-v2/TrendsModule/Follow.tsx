import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';
import { SET_FOLLOWING } from '../../redux/auth/actionTypes';
import { userService } from '../../services/user.service';

interface IProps {
    otherUser: any;
    userModule?: boolean;
    loading?: boolean;
    setLoading: Function;
    className?: string;
}
export const Follow = ({ otherUser, userModule, loading, setLoading, className }: IProps) => {
    const [loadingLocal, setLoadingLocal] = useState<boolean>(false);

    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const followUser = async () => {
        if (user && user?.userId) {
            setLoadingLocal(true);
            setLoading(true);
            try {
                let res = await userService.followuser(otherUser);
                dispatch({ type: SET_FOLLOWING, payload: res?.data?.data?.following });
                console.log(res);
            } catch (err: any) {
                // console.log(err);
                toast.error(err?.response?.data?.message);
            }
            setLoadingLocal(false);
            setLoading(false);
        }
    };

    return (
        <div>
            {user && user?.userId && user?.userId != otherUser && (
                <>
                    <Button
                        className={`${
                            className ? className : ''
                        }  text-sm gold  pt-[0.25rem] pb-[0.25rem] !min-w-[50px] !max-w-[50px] !px-6 !rounded-full ${
                            userModule ? '' : ''
                        }`}
                        isLoading={loadingLocal}
                        disabled={loading}
                        onClick={followUser}>
                        Follow
                    </Button>
                </>
            )}
        </div>
    );
};
