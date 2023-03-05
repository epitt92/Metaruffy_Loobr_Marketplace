import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reportNft } from "../../redux/nft/actions";
import Button from "../Button/Button";

const Reportnft = ({ setstate, data }: any) => {
    const [values, setValues] = useState({
        text: "",
    });

    const loading = useSelector((state: any) => state.nft.createReportLoading);
    const user = useSelector((state: any) => state.auth.user);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data1 = {
            text: values.text,
            // listingId: listing?.listingId,
            listing: data?._id,
            reportedBy: user?.userId,
            type: "nft"
        };
        // console.log(data)
        dispatch(reportNft(data1, setstate));
    };

    return (
        <div className="sm:w-[37.5rem] xs:w-full   rounded-2xl">
            <h3 className="border-b border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">
                Report NFTs
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="pt-[20px] pr-[20px] pb-[20px] pl-[20px] ">
                    <p className="text-white text-[1.5rem] mb-[5px] leading-4 font-Proxima-SemiBold">
                        Please describe the issue.
                    </p>
                    <p className="text-gray4 text-base mb-[20px] font-Proxima-Regular">
                        If something is wrong please notify us. Your feedback is
                        really important to us.
                    </p>
                    <div className="relative">
                        <textarea
                            placeholder="Write here..."
                            className="bg-transparent text-white border-[1px] braek border-[#29303a] rounded-[8px] w-full resize-none h-[155px] p-[15px] focus:outline-none"
                            onChange={handleChange}
                            name="text"
                            value={values.text}
                        ></textarea>
                    </div>
                    <div className="mt-[30px] border-gray5">
                        <Button
                            type="button"
                            className="w-full gold rounded-full"
                            onClick={handleSubmit}
                            isLoading={loading}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Reportnft;
