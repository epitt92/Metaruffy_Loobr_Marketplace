import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Input from '../input/Input';
import Button from '../Button/Button';
// import Select from "../select/Select";
import GoogleLogin from 'react-google-login';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginByGoogle } from '../../redux/auth/actions';

// import { CountryCodes } from "../../data/CountryCodes";
import { isEmpty, validate } from 'validate.js';
import { registerSchema } from '../../validations';
import { toast } from 'react-toastify';
import GoogleLoginButton from '../googleLogin/googleLoginButton';

export const SignupModal = ({ setstate, state, setPopup }: any) => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        // phoneNumber: "",
        password: '',
        terms: false
    });
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [show, setShow] = useState(false);
    const [referral, setReferral] = useState<string>('');
    const isUpper = (string: any) => /[A-Z]+/g.test(string);
    const isNumber = (string: any) => {
        return /\d/.test(string);
    };

    const loading = useSelector((state: any) => state.auth.signupLoading);

    const dispatch = useDispatch();

    useEffect(() => {
        const errors = validate(values, registerSchema);
        setErrors({ ...(errors || {}) });
    }, [values]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.name == "userName"){
        setValues({ ...values, [event.target.name]: event.target.value.toLowerCase() });
        }
        else{
        setValues({ ...values, [event.target.name]: event.target.value});
        }
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleLoginByGoogle = async (googleData: any) => {
        const data = {
            referral: referral,
            token: googleData?.code
        };
        dispatch(loginByGoogle(data, setstate));
    };

    const handleSignUp = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        enabledTouchedValues();
        if (!isEmpty(errors)) {
            return;
        }
        if (values.password.length < 8 || !isUpper(values.password) || !isNumber(values.password)) {
            toast.error('Please refer to password guidelines');
        } else {
            let data = {
                referral: referral,
                ...values
            };
            dispatch(registerUser(data, setstate));
        }
    };

    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);

    const enabledTouchedValues = () => {
        const newState: any = {};
        Object.keys(errors).forEach((item) => {
            newState[item] = true;
        });
        setTouched(newState);
    };

    //  [
    //     {
    //         id: 1,
    //         name: "+1",
    //     },
    //     {
    //         id: 2,
    //         name: "+44",
    //     },
    // ];
    useEffect(() => {
        let id: any = localStorage.getItem('refferal');
        if (id) {
            setReferral(JSON.parse(id));
        }
    }, []);
    return (
        <div className="w-full md:w-[694px] sm:w-[594px] m-auto rounded-lg">
            <div className="border-b border-[#2B2B35] py-6 text-center">
                <h2 className="text-xl text-white ">Register</h2>
            </div>
            <div className="pt-6 px-8 pb-8">
                <form onSubmit={handleSignUp}>
                    <h3 className="text-2rem text-white mb-2">Welcome!</h3>
                    <p className="text-lightgray text-base mb-6">Register for free to Buy, Sell &amp; Create NFTs</p>
                    <div className="mb-6 grid xs:grid-cols-1 grid-cols-2 gap-x-4 xs:gap-y-6">
                        <div className="">
                            <Input
                                placeholder="First Name"
                                name="firstName"
                                value={values.firstName}
                                onchange={handleChange}
                                onBlur={handleBlur}
                                error={hasError('firstName')}
                                helperText={hasError('firstName') ? errors.firstName[0] : null}
                            />
                        </div>
                        <div className="">
                            <Input
                                placeholder="Last Name"
                                name="lastName"
                                value={values.lastName}
                                onchange={handleChange}
                                onBlur={handleBlur}
                                error={hasError('lastName')}
                                helperText={hasError('lastName') ? errors.lastName[0] : null}
                            />
                        </div>
                    </div>
                    <div className="mb-6 grid grid-cols-1">
                        <div className="">
                            <Input
                                placeholder="Username"
                                name="userName"
                                value={values.userName}
                                onchange={handleChange}
                                onBlur={handleBlur}
                                error={hasError('userName')}
                                helperText={hasError('userName') ? errors.userName[0] : null}
                            />
                        </div>
                    </div>
                    <div className="mb-6 grid grid-cols-1">
                        <div className="">
                            <Input
                                placeholder="Email Address"
                                name="email"
                                value={values.email}
                                onchange={handleChange}
                                onBlur={handleBlur}
                                error={hasError('email')}
                                helperText={hasError('email') ? errors.email[0] : null}
                            />
                        </div>
                    </div>
                    {/* <div className="mb-6 grid grid-cols-1">
                    <div className="  ">
                        <PhoneInput
                            country={"us"}
                            placeholder="Enter phone number"
                            value={values.phoneNumber}
                            onChange={(value: any) =>
                                setValues({ ...values, phoneNumber: value })
                            }
                            onBlur={handleBlur}
                        />
                        <p className="pt-2 text-red-500">
                            {hasError("phoneNumber")
                                ? errors.phoneNumber[0]
                                : null}
                        </p>
                    </div>
                </div> */}
                    <div className="mb-6 grid grid-cols-1">
                        <div className="">
                            <Input
                                placeholder="Password"
                                type={show ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                className="pr-16"
                                onchange={handleChange}
                                svgicon="right-5 top-[50%] translate-y-[-50%]"
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
                                onBlur={handleBlur}
                                error={hasError('password')}
                                helperText={hasError('password') ? 'Password too weak' : null}
                            />
                        </div>
                        <ul className="list-none mt-[20px] mb-[15px] gap-y-2.5 flex flex-col">
                            <li className="flex items-center">
                                {values.password == '' ? (
                                    <Image src="/assets/images/icons/gray-tick.png" alt="" width={16} height={16} />
                                ) : (
                                    <>
                                        {values.password.length < 8 ? (
                                            <Image
                                                src="/assets/images/icons/cross-icon.png"
                                                alt=""
                                                width={16}
                                                height={16}
                                            />
                                        ) : (
                                            <Image
                                                src="/assets/images/icons/green-tick.png"
                                                alt=""
                                                width={16}
                                                height={16}
                                            />
                                        )}
                                    </>
                                )}
                                <p className="text-sm ml-[5px]">At least 8 characters</p>
                            </li>
                            <li className="flex items-center">
                                {values.password == '' ? (
                                    <Image src="/assets/images/icons/gray-tick.png" alt="" width={16} height={16} />
                                ) : (
                                    <>
                                        {isUpper(values.password) ? (
                                            <Image
                                                src="/assets/images/icons/green-tick.png"
                                                alt=""
                                                width={16}
                                                height={16}
                                            />
                                        ) : (
                                            <Image
                                                src="/assets/images/icons/cross-icon.png"
                                                alt=""
                                                width={16}
                                                height={16}
                                            />
                                        )}
                                    </>
                                )}
                                <p className="text-sm ml-[5px]">At least one capital letter</p>
                            </li>
                            <li className="flex items-center">
                                {values.password == '' ? (
                                    <Image src="/assets/images/icons/gray-tick.png" alt="" width={16} height={16} />
                                ) : (
                                    <>
                                        {isNumber(values.password) ? (
                                            <Image
                                                src="/assets/images/icons/green-tick.png"
                                                alt=""
                                                width={16}
                                                height={16}
                                            />
                                        ) : (
                                            <Image
                                                src="/assets/images/icons/cross-icon.png"
                                                alt=""
                                                width={16}
                                                height={16}
                                            />
                                        )}
                                    </>
                                )}
                                <p className="text-sm ml-[5px]">Contains a number </p>
                            </li>
                            
                        </ul>
                        <div className="termsConditionCheck flex items-center">
                            <div className="labelInputholder relative z-10 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="termscondition"
                                    name="terms"
                                    onBlur={handleBlur}
                                    className="cursor-pointer "
                                    onChange={(e) => {
                                        setValues({
                                            ...values,
                                            terms: e.target.checked
                                        });
                                    }}
                                    checked={values.terms}
                                />
                                <label htmlFor="termscondition" className="cursor-pointer"></label>
                            </div>
                            <p className="text-white text-[0.875rem]  leading-5 inline-block font-Proxima-Regular mt-[-1px]">
                                I agree to{' '}
                                <a
                                    target="_blank"
                                    href="/termandcondition"
                                    className=" text-base !text-themecolor"
                                    onClick={() => {
                                        // setPopup(false);
                                    }}>
                                    Terms & Conditions
                                </a>
                                <br></br>
                                <p className="text-red-500">
                                    {hasError('terms') ? 'Select terms and conditions' : null}
                                </p>
                            </p>

                            <div>
                                {/* <p>
                                {hasError("terms")
                                    ? "Select terms and conditions"
                                    : null}
                            </p> */}
                            </div>
                        </div>
                    </div>
                    {/* <p className="text-[#A1A1A5] text-base">
                    We&apos;ll confirm your identity via email or phone. Please
                    verify your account
                </p> */}
                    <Link legacyBehavior href="">
                        <a>
                            <Button
                                className="w-full mb-6 gold rounded-[1.875rem]"
                                onClick={handleSignUp}
                                isLoading={loading}
                                disabled={loading}
                                type="submit">
                                Create an Account
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
                {/* <GoogleLogin
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                    buttonText="Log in with Google"
                    render={(renderProps) => (
                        <Button
                            className="w-full bg-transparent !rounded-[1.875rem] mb-6 border border-lightgray relative"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-[44px] top-[50%] translate-y-[-50%] w-[1.5rem] h-[1.5rem]">
                                <g clipPath="url(#clip0_186_47)">
                                    <path
                                        d="M23.766 12.2765C23.766 11.4608 23.6999 10.6406 23.5588 9.83813H12.24V14.4591H18.7217C18.4528 15.9495 17.5885 17.2679 16.323 18.1056V21.104H20.19C22.4608 19.014 23.766 15.9274 23.766 12.2765Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.51648V17.3912C3.55359 21.4434 7.70278 24.0008 12.24 24.0008Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.50253 14.3002C4.99987 12.8099 4.99987 11.196 5.50253 9.70569V6.61475H1.51649C-0.18551 10.0055 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3002Z"
                                        fill="#FBBC04"
                                    />
                                    <path
                                        d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207 -0.034466 12.24 0.000808666C7.70277 0.000808666 3.55359 2.55822 1.51648 6.61481L5.50252 9.70575C6.45052 6.86173 9.10935 4.74966 12.24 4.74966Z"
                                        fill="#EA4335"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_186_47">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-white xs:ml-12 font-Proxima-SemiBold">Continue with Google</span>
                        </Button>
                    )}
                    onSuccess={handleLoginByGoogle}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                    cookiePolicy={'single_host_origin'}
                /> */}
                {/* <Button className="w-full  bg-transparent mb-[2.313rem] border !rounded-xl border-lightgray relative">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-[44px] top-[50%] translate-y-[-50%] w-[1.5rem] h-[1.5rem]"
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
                    <span className="text-white font-Proxima-SemiBold">
                        Continue with Facebook
                    </span>
                </Button> */}
                <p className="text-base text-[#777E91] text-center">
                    Already have an account?&nbsp;
                    {/* <Link legacyBehavior href=""> */}
                        <span
                            className="text-themecolor cursor-pointer"
                            onClick={() => {
                                setstate(1);
                            }}>
                            Login
                        </span>
                    {/* </Link> */}
                </p>
            </div>
        </div>
    );
};
