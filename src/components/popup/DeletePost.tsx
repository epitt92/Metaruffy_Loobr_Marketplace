import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../../redux/user/actions';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
const DeletePost = ({ data, setstate, singlefeed, page, setConfirmed }: any) => {
    const loading = useSelector((state: any) => state.user.postdelteloading);
    const dispatch = useDispatch();
    const router = useRouter();

    const deletethepost = () => {
        const fileters = {
            pageSizeOther: page * 15,
            pageSize: 15,
            page: page,
            id: data
        };

        dispatch(deletePost(data, setstate, setConfirmed, gotoSocialfeed));
    };
    const gotoSocialfeed = () => {
        if (singlefeed) {
            router.push('/feeds');
        }
    };
    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">Delete Post</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want <span className="block">to delete this post?</span>
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
                    className="w-full rounded-lg !bg-red-500"
                    onClick={() => {
                        deletethepost();
                    }}
                    isLoading={loading}
                    disabled={loading}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default DeletePost;
