import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../Button/Button';
import Input from '../input/Input';
import { GoogleLogin } from '@react-oauth/google';

// import FacebookLogin from "react-facebook-login";

import { useDispatch, useSelector } from 'react-redux';
import { loginUser, loginByGoogle } from '../../redux/auth/actions';
import GoogleLoginButton from '../googleLogin/googleLoginButton';

export const LoginModule = ({ setstate, state }: any) => {
    const [show, setShow] = useState(false);
    const [showGoogleButton, setShowGoogleButton] = useState(false);
    const [referral, setReferral] = useState<string>('');
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const loading = useSelector((state: any) => state.auth.loginLoading);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleLoginByGoogle = async (googleData: any) => {
        const data = {
            referral: referral,
            token: googleData?.code
        };
        dispatch(loginByGoogle(data, setstate));
    };

    const handleLogin = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = {
            email: values.email,
            password: values.password
        };
        dispatch(loginUser(data, setstate));
    };
    useEffect(() => {
        let id: any = localStorage.getItem('refferal');
        if (id) {
            setReferral(JSON.parse(id));
        }
    }, []);
    return (
        <div className=" md:w-[694px] sm:w-[48.125rem] w-[40rem] xs:w-[26rem]   m-auto rounded-lg   ">
            <div className="border-b border-[#2B2B35] py-6 text-center">
                <h2 className="text-xl text-white">Login</h2>
            </div>
            <div className="pt-8 px-8 pb-8">
                <form onSubmit={handleLogin}>
                    <h3 className="text-2rem text-white mb-6">Welcome!</h3>
                    <div className="mb-6 grid grid-cols-1">
                        <div className="">
                            <Input
                                placeholder="Email Address or Username"
                                styles=""
                                name="email"
                                value={values.email}
                                onchange={handleChange}
                                error={true}
                            />
                        </div>
                    </div>
                    <div className="mb-1 grid grid-cols-1">
                        <div className="">
                            <Input
                                placeholder="Password"
                                type={show ? 'text' : 'password'}
                                name="password"
                                className="pr-16"
                                value={values.password}
                                onchange={handleChange}
                                svgicon="right-5 top-[50%] translate-y-[-50%] cursor-pointer"
                                svgIconName={
                                    !show ? (
                                        <svg
                                            width="20"
                                            height="17"
                                            viewBox="0 0 20 17"
                                            fill="none"
                                            className="cursor-pointer"
                                            xmlns="http://www.w3.org/2000/svg"
                                            onClick={() => {
                                                setShow(!show);
                                            }}>
                                            <path
                                                d="M10.003 0.000488281C14.139 0.00348828 17.853 2.90249 19.939 7.75649C20.021 7.94549 20.021 8.15949 19.939 8.34849C17.854 13.2035 14.139 16.1025 10.003 16.1055H9.99699C5.86099 16.1025 2.14699 13.2035 0.0609941 8.34849C-0.0200059 8.15949 -0.0200059 7.94549 0.0609941 7.75649C2.14699 2.90249 5.86199 0.00348828 9.99699 0.000488281H10.003ZM9.99999 1.50049C6.56399 1.50149 3.42999 3.94449 1.56999 8.05249C3.42999 12.1615 6.56299 14.6045 9.99999 14.6055C13.437 14.6045 16.57 12.1615 18.43 8.05249C16.57 3.94449 13.437 1.50149 9.99999 1.50049ZM9.99969 4.14129C12.1567 4.14129 13.9117 5.89629 13.9117 8.05329C13.9117 10.2093 12.1567 11.9633 9.99969 11.9633C7.84269 11.9633 6.08869 10.2093 6.08869 8.05329C6.08869 5.89629 7.84269 4.14129 9.99969 4.14129ZM9.99969 5.64129C8.66969 5.64129 7.58869 6.72329 7.58869 8.05329C7.58869 9.38229 8.66969 10.4633 9.99969 10.4633C11.3297 10.4633 12.4117 9.38229 12.4117 8.05329C12.4117 6.72329 11.3297 5.64129 9.99969 5.64129Z"
                                                fill="#F1C94A"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="17"
                                            viewBox="0 0 22 22"
                                            fill="none"
                                            className="cursor-pointer"
                                            xmlns="http://www.w3.org/2000/svg"
                                            onClick={() => {
                                                setShow(!show);
                                            }}>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M21.2804 0.469672C21.5733 0.762567 21.5733 1.23744 21.2804 1.53033L1.28033 21.5304C0.98744 21.8233 0.512567 21.8233 0.219672 21.5304C-0.0732223 21.2375 -0.0732243 20.7626 0.219668 20.4697L3.59007 17.0993C2.63583 16.2323 1.76266 15.1886 1.00731 14.003C0.462133 13.1486 0.214844 12.054 0.214844 11.005C0.214844 9.95594 0.462142 8.86136 1.00734 8.00695C3.39826 4.24858 6.90186 1.97998 10.7498 1.97998C12.8835 1.97998 14.9329 2.68491 16.7307 3.95861L20.2197 0.469668C20.5126 0.176776 20.9875 0.176778 21.2804 0.469672ZM15.6525 5.03686C14.1376 4.01888 12.4627 3.47998 10.7498 3.47998C7.53799 3.47998 4.46174 5.37118 2.27266 8.81252L2.27204 8.81351C1.91745 9.36902 1.71484 10.1642 1.71484 11.005C1.71484 11.8457 1.91745 12.6409 2.27204 13.1965C2.97564 14.3008 3.7833 15.2574 4.6521 16.0372L7.20494 13.4844C6.71039 12.7816 6.41992 11.9266 6.41992 11C6.41992 8.60583 8.35571 6.67004 10.7499 6.67004C11.6765 6.67004 12.5315 6.96051 13.2342 7.45506L15.6525 5.03686ZM12.149 8.54033C11.7364 8.30397 11.2603 8.17004 10.7499 8.17004C9.18414 8.17004 7.91992 9.43426 7.91992 11C7.91992 11.5104 8.05385 11.9865 8.29021 12.3991L12.149 8.54033ZM18.3299 6.34564C18.6526 6.08603 19.1247 6.13722 19.3843 6.45998C19.7682 6.93725 20.1453 7.45011 20.4932 7.99819C21.0378 8.85243 21.2849 9.94649 21.2849 10.9951C21.2849 12.0439 21.0377 13.1383 20.4927 13.9926C18.1018 17.7513 14.5981 20.0201 10.7499 20.0201C9.41339 20.0201 8.10475 19.7374 6.87888 19.2213C6.49713 19.0605 6.31796 18.6208 6.4787 18.239C6.63943 17.8573 7.07921 17.6781 7.46096 17.8388C8.5151 18.2827 9.62646 18.5201 10.7499 18.5201C13.9618 18.5201 17.038 16.6289 19.2271 13.1875L19.2277 13.1865C19.5823 12.631 19.7849 11.8358 19.7849 10.9951C19.7849 10.1543 19.5823 9.3591 19.2277 8.80358L19.2267 8.80192C18.9145 8.31 18.5716 7.84285 18.2155 7.40012C17.9559 7.07736 18.0071 6.60526 18.3299 6.34564ZM14.3959 10.9624C14.8033 11.0375 15.0726 11.4286 14.9975 11.836C14.6811 13.5518 13.2918 14.9411 11.5759 15.2575C11.1686 15.3326 10.7775 15.0633 10.7024 14.656C10.6273 14.2486 10.8966 13.8575 11.3039 13.7824C12.4081 13.5788 13.3188 12.6681 13.5224 11.5639C13.5975 11.1566 13.9886 10.8873 14.3959 10.9624Z"
                                                fill="#F1C94A"
                                            />
                                        </svg>
                                    )
                                }
                            />
                        </div>
                    </div>
                    {/* <Link legacyBehavior href="#"> */}
                    <a
                        className=" text-base float-right !text-[#F1C94A] cursor-pointer mt-3"
                        onClick={() => {
                            setstate(2);
                        }}>
                        Forgot password?
                    </a>
                    {/* </Link> */}
                    <Link legacyBehavior href="/">
                        <a>
                            <Button
                                className="w-full rounded-[1.875rem] mt-[2.75rem] gold mb-6"
                                onClick={handleLogin}
                                isLoading={loading}
                                disabled={loading}
                                type="submit">
                                Login
                            </Button>
                        </a>
                    </Link>
                </form>
                <div className="w-full h-[18px] py-[9px] mb-6 relative flex">
                    <div className="w-[43%] border-t border-[#2B2B35]"></div>
                    <span className=" w-[13%] flex items-center justify-center text-lightgray text-[14px]  ">or</span>
                    <div className="w-[43%] border-t border-[#2B2B35]"></div>
                </div>

                <GoogleLoginButton onSuccess={handleLoginByGoogle} />

                {/* <FacebookLogin
                    appId="324203373152858"
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={handleLoginByGoogle}
                    render={(renderProps) => (
                       
                    )}
                /> */}

                {/* <Button className="w-full bg-transparent !rounded-[1.875rem] mb-[2.313rem] border border-lightgray relative">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[1.5rem] h-[1.5rem] absolute left-[44px] top-[50%] translate-y-[-50%]"
                    >
                        <path
                            d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                            fill="#1877F2"
                        />
                        <path
                            d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z"
                            fill="white"
                        />
                    </svg>
                    <span>Continue with Facebook</span>
                </Button> */}

                <p className="text-base text-[#B8B8BC] text-center 2xl:mt-30 xl:mt-20 lg:mt-10 md:mt-5 sm:mt-5 xs:mt-5 ">
                    Don’t have an account?
                    {/* <Link legacyBehavior href=""> */}
                    <a
                        className="!text-[#F1C94A] ml-2 cursor-pointer"
                        onClick={() => {
                            setstate(6);
                        }}>
                        Create Account
                    </a>
                    {/* </Link> */}
                </p>
            </div>
        </div>
    );
};
