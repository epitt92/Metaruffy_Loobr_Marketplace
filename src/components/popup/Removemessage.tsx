import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, deletePost } from '../../redux/user/actions';
import Button from '../Button/Button';
import { useRouter } from 'next/router';
import { deleteMessage } from '../../redux/messages/actions';
const Removemessage = ({ data, setstate }: any) => {
    const [confirm, setConfirm] = useState<boolean>(false);
    const [popup, setPopup] = useState<boolean>(false);
    const dispatch = useDispatch();
    const deletetheMessage = () => {
        setConfirm(true);
        dispatch(deleteMessage({ messageId: data?._id }, setConfirm, setPopup));
    };
    useEffect(() => {
        if (popup) {
            setPopup(false);
            setstate();
        }
    }, [popup]);

    return (
        <div className="w-full md:w-[380px] sm:w-[350px] m-auto rounded-lg p-9">
            <div className="text-center mb-5">
                <h2 className="text-3xl text-white font-Proxima-Bold">Remove Message</h2>
            </div>
            <div className="text-center">
                <p className="text-[#89898f] text-lg font-Proxima-Regular">
                    Are you sure you want to remove
                    <br /> your message?
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                    disabled={confirm}
                    onClick={() => {
                        setstate();
                    }}
                    className="w-full rounded-lg text-[#727279] !bg-[#2b2b35]">
                    Cancel
                </Button>
                <Button
                    className="w-full rounded-lg !text-white bg-[#FF0000]"
                    onClick={deletetheMessage}
                    isLoading={confirm}
                    disabled={confirm}>
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default Removemessage;
