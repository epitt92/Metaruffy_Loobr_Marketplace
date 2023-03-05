import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import Input from "../input/Input";
import { handleForgotPassword } from "../../redux/auth/actions";

export const ForgotPasswordModule = ({ setstate, state }: any) => {
    const [values, setValues] = useState({
        email: "",
    });

    const loading = useSelector(
        (state: any) => state.auth.forgotPasswordLoading
    );

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            email: values.email,
        };
        dispatch(handleForgotPassword(data, setstate));
    };

    return (
        <div className="w-full md:w-[694px] sm:w-[594px]  m-auto rounded-lg ">
            <div className=" border-b border-[#2B2B35] py-6 text-center">
                <h2 className="text-xl text-white">Register</h2>
            </div>
            <div className="pt-6 px-8 pb-8">
                <form onSubmit={handleSubmit}>
                    <h3 className="text-2rem text-white mb-2">
                        Forgot Your Password?
                    </h3>
                    <p className="text-[#89898F] text-base mb-6">
                        Enter your registered email to receive password reset
                        instructions.
                    </p>
                    <div className="grid grid-cols-1">
                        <div className="">
                            <Input
                                placeholder="Email"
                                name="email"
                                value={values.email}
                                onchange={handleChange}
                            />
                        </div>
                    </div>
                    <Link legacyBehavior href="">
                        <a>
                            <Button
                                className="w-full mt-[2.75rem] mb-[16px] gold rounded-[1.875rem]"
                                onClick={handleSubmit}
                                isLoading={loading}
                                disabled={loading}
                                type="submit"
                            >
                                Submit
                            </Button>
                        </a>
                    </Link>
                    <p className="text-base text-[#777E91] text-center">
                        Remember Password? &nbsp;
                        <Link legacyBehavior href="">
                            <a
                                className="text-themecolor"
                                onClick={() => {
                                    setstate(1);
                                }}
                            >
                                Login
                            </a>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
