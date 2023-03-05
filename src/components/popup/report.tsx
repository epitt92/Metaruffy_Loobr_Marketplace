import React, { useState } from "react";
import { toast } from "react-toastify";
import getStoredState from "redux-persist/es/getStoredState";
import { loading } from "../../redux/nft/actions";
import { homeService } from "../../services/home.service";
import { userService } from "../../services/user.service";
import Button from "../Button/Button";

const Report = ({ feed, setState }: any) => {
  const [text, setText] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const reportFeed = async () => {
    setLoading(true);
    try {
      const report = await homeService.reportAfeed({
        text: text,
        feed: feed,
        type: "feed",
      });
      toast.success("Reported successfully");
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
    setState();
    setLoading(false);
  };
  return (
    <div className="sm:w-[37.5rem] xs:w-full rounded-2xl">
      <h3 className="border-b border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">
        Report post
      </h3>
      <div className="p-5">
        <p className="text-white text-[1.5rem] mb-[5px] leading-4 font-Proxima-SemiBold">
          Please describe the issue.
        </p>
        <p className="text-gray4 text-base mb-5 font-Proxima-Regular">
          If something is wrong please notify us. Your feedback is really
          important to us.
        </p>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e: any) => {
              setText(e.target.value);
            }}
            placeholder="Write here..."
            className="bg-transparent braek border border-[#29303a] text-white rounded-[8px] w-full resize-none h-[155px] p-4 focus:outline-none"
          ></textarea>
        </div>
        <div className="mt-[30px] border-gray5">
          <Button
            type="button"
            className="w-full rounded-full"
            onClick={reportFeed}
            isLoading={loading}
            disabled={loading}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
