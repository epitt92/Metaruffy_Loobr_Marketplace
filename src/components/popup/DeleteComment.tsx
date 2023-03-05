import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, deletePost } from '../../redux/user/actions';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
const DeleteComment = ({ data, setstate, setConfirmed }: any) => {
    const loading = useSelector((state: any) => state.user.commentdelteloading);
    const dispatch = useDispatch();
    const router = useRouter();
    const deletethepost = () => {
        dispatch(deleteComment(data, setstate, setConfirmed));
    };

    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">Delete Comment</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want <span className="block">to delete this comment?</span>
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
                    className="w-full text-white rounded-lg gold bg-red-600"
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

export default DeleteComment;
