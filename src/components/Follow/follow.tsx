import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { postLike } from '../../redux/user/actions';
import { homeService } from '../../services/home.service';
import { userService } from '../../services/user.service';
import Button from '../Button/Button';
import Popups from '../popup/poups';

interface IProps {
    otherUser?: any;
    setFollowers?: any;
    followers?: any;
    setChange?: Function;
    setConfirm?: Function;
    userModule?: boolean;
    customClass?: string;
}
export const Follow = ({
    otherUser,
    setFollowers,
    followers,
    setChange,
    setConfirm,
    userModule,
    customClass
}: IProps) => {
    const [follow, setFollowed] = useState<boolean>(false);
    const [popup, setPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(-1);
    const [count, setCount] = useState<number>();
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    useEffect(() => {
        if (user && user?.userId) {
            if (otherUser?.followers && otherUser?.followers?.includes(user?.userId)) {
                // setChange && setChange(true);
                setFollowed(true);
            } else {
                setFollowed(false);
            }
        }
    }, [user, otherUser]);

    const followUser = async (e: any) => {
        e.stopPropagation();
        if (user && user?.userId) {
            if (follow) {
                if (followers !== 0) {
                    setFollowers && setFollowers(followers - 1);
                }
            } else {
                setFollowers && setFollowers(followers + 1);
            }
            setFollowed(!follow);
            setLoading(true);
            try {
                await userService.followuser(otherUser?._id);
                setChange && setChange(true);
            } catch (err: any) {
                // console.log(err);
                toast.error(err?.response?.data?.message);
            }
            setLoading(false);

            setConfirm && setConfirm(true);
        } else {
            setPopup(true);
            setState(1);
        }
    };

    return (
        <div>
            {user && user?.userId && user?.userId != otherUser?._id && (
                <>
                    {!follow ? (
                        <>
                            <Button
                                className={`rounded-[8px] min-w-[90px] max-w-[90px]  text-sm gold px-8 pt-[0.25rem] pb-[0.25rem] ${
                                    userModule ? '!min-w-[100px] !max-w-[100px] !px-10 !py-2 !rounded-full' : ''
                                } ${customClass}`}
                                isLoading={loading}
                                disabled={loading}
                                onClick={followUser}>
                                Follow
                            </Button>
                        </>
                    ) : (
                        <Button
                            className={`rounded-[8px] min-w-[90px] max-w-[90px] text-sm px-8 pt-[0.25rem] pb-[0.25rem]   background-change   bg-transparent border text-themecolor border-themecolor ${
                                userModule ? '!min-w-[100px] !max-w-[100px] !px-10 !py-2 !rounded-full' : ''
                            } ${customClass}`}
                            isLoading={loading}
                            disabled={loading}
                            onClick={followUser}>
                            Following
                        </Button>
                    )}
                </>
            )}

            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </div>
    );
};
