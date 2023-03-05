import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";

export const EmailSendModule = ({ setstate, state }: any) => {
  return (
    <div className="lg:w-[694px] m-auto rounded-lg ">
      <div className="border-b border-[#2B2B35]  py-6 text-center">
        <h2 className="text-2xl text-white">Email Sent</h2>
      </div>
      <div className="pt-6 px-8 pb-8">
        <h3 className="text-2rem text-white mb-2">Email has been sent!</h3>
        <p className="text-lightgray text-base mb-6">
          Check your inbox and click on the received link to reset password.
        </p>
        <figure className="text-center">
          <Image
            src="/assets/images/sendemail-img.png"
            width={196}
            height={170}
            alt=""
          />
        </figure>
        <Link legacyBehavior href="#">
          <a>
            <Button
              className="w-full mt-[2.75rem] gold !rounded-[1.875rem]"
              onClick={() => {
                setstate(4);
              }}
            >
              Continue
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};
