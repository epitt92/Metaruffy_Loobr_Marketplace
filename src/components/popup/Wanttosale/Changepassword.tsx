import React, { useState, useEffect } from 'react';
import Button from '../../Button/Button';
import Input from '../../input/Input';
import axios from 'axios';
import { isEmpty, validate } from 'validate.js';
import { changePassword } from '../../../validations';
import { toast } from 'react-toastify';
import { setAuthToken } from '../../../utils';
const Changepassword = ({ setstate }: any) => {
    const [password, setPassword] = useState();
    const [newPassword, setnewPassword] = useState();
    const [confirmPassword, setconfirmPassword] = useState();
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [values, setValues] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    useEffect(() => {
        const errors = validate(values, changePassword);
        setErrors({ ...(errors || {}) });
    }, [values]);
    const resetPassword = () => {
        // e.preventDefault();
        enabledTouchedValues();
        if (!isEmpty(errors)) {
            return;
        }
        const token: any = localStorage.getItem('token');
        let config = { headers: { Authorization: `Bearer ${token}` } };
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, values, config)
            .then((res) => {
                setAuthToken(res?.data?.data?.access_token);
                localStorage.setItem('token', res?.data?.data?.access_token);
                setstate(34);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };
    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);

    const enabledTouchedValues = () => {
        const newState: any = {};
        Object.keys(errors).forEach((item) => {
            newState[item] = true;
        });
        setTouched(newState);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTouched({ ...touched, [event.target.name]: true });
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };
    return (
        <div className="sm:w-[43.375rem]  w-[25rem]  rounded-2xl">
            <h3 className="border-b border-[rgba(255,255,255,0.10)]  py-6 px-8 text-white text-center">
                Change Password
            </h3>
            <div className=" ">
                <div className="pt-6 px-8 pb-8">
                    <div className="grid grid-cols-1 mb-6 relative">
                        <Input
                            placeholder="Current Password"
                            onchange={handleChange}
                            type="password"
                            name="password"
                            value={values.password}
                            // onBlur={handleBlur}
                            // error={hasError("password")}
                            // helperText={hasError("password") ? errors.password[0] : null}
                        />
                    </div>
                    <div className={`grid grid-cols-1 mb-6  relative ${hasError('newPassword') ? 'AThasError' : ''}`}>
                        <Input
                            placeholder="New Password"
                            onchange={handleChange}
                            name="newPassword"
                            value={values.newPassword}
                            onBlur={handleBlur}
                            type="password"
                            error={hasError('newPassword')}
                            helperText={hasError('newPassword') ? errors.newPassword[0] : null}
                        />
                        <span className="absolute  right-0 top-2 2xl:top-3  mr-3">
                            {!hasError('newPassword') ? (
                                <>
                                    {values.newPassword.length > 0 && (
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="13.9987" cy="13.9999" r="11.6667" fill="#00A789" />
                                            <path
                                                d="M18.6654 11.5L12.2487 17.3333L9.33203 14.6818"
                                                stroke="white"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 28 28"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14 1.75C17.2489 1.75 20.3647 3.04062 22.6621 5.33794C24.9594 7.63526 26.25 10.7511 26.25 14C26.25 17.2489 24.9594 20.3647 22.6621 22.6621C20.3647 24.9594 17.2489 26.25 14 26.25C10.7511 26.25 7.63526 24.9594 5.33794 22.6621C3.04062 20.3647 1.75 17.2489 1.75 14C1.75 10.7511 3.04062 7.63526 5.33794 5.33794C7.63526 3.04062 10.7511 1.75 14 1.75V1.75ZM14 7C13.7778 6.99981 13.558 7.04596 13.3547 7.1355C13.1514 7.22505 12.9689 7.35602 12.8191 7.52004C12.6692 7.68407 12.5552 7.87755 12.4843 8.08812C12.4135 8.2987 12.3873 8.52174 12.4075 8.743L13.0462 15.7535C13.071 15.9892 13.1822 16.2074 13.3583 16.366C13.5344 16.5245 13.763 16.6123 14 16.6123C14.237 16.6123 14.4656 16.5245 14.6417 16.366C14.8178 16.2074 14.929 15.9892 14.9538 15.7535L15.5908 8.743C15.6109 8.52189 15.5848 8.29899 15.5141 8.08854C15.4433 7.87808 15.3294 7.68469 15.1798 7.52069C15.0301 7.35669 14.8479 7.22569 14.6447 7.13603C14.4416 7.04638 14.222 7.00005 14 7V7ZM14 21C14.3713 21 14.7274 20.8525 14.9899 20.5899C15.2525 20.3274 15.4 19.9713 15.4 19.6C15.4 19.2287 15.2525 18.8726 14.9899 18.6101C14.7274 18.3475 14.3713 18.2 14 18.2C13.6287 18.2 13.2726 18.3475 13.0101 18.6101C12.7475 18.8726 12.6 19.2287 12.6 19.6C12.6 19.9713 12.7475 20.3274 13.0101 20.5899C13.2726 20.8525 13.6287 21 14 21V21Z"
                                            fill="#C70000"
                                        />
                                    </svg>
                                </>
                            )}
                        </span>
                    </div>
                    <div className={`grid grid-cols-1 relative ${hasError('confirmPassword') ? 'AThasError' : ''}`}>
                        <Input
                            placeholder="Confirm Password"
                            onchange={handleChange}
                            name="confirmPassword"
                            value={values.confirmPassword}
                            onBlur={handleBlur}
                            type="password"
                            error={hasError('confirmPassword')}
                            helperText={hasError('confirmPassword') ? errors.confirmPassword[0] : null}
                        />
                        <span className=" absolute right-0 top-2 2xl:top-3 mr-3">
                            {values.confirmPassword && !hasError('confirmPassword') ? (
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="13.9987" cy="13.9999" r="11.6667" fill="#00A789" />
                                    <path
                                        d="M18.6654 11.5L12.2487 17.3333L9.33203 14.6818"
                                        stroke="white"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            ) : (
                                <>
                                    {values.confirmPassword && (
                                        <svg
                                            width="28"
                                            height="28"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14 1.75C17.2489 1.75 20.3647 3.04062 22.6621 5.33794C24.9594 7.63526 26.25 10.7511 26.25 14C26.25 17.2489 24.9594 20.3647 22.6621 22.6621C20.3647 24.9594 17.2489 26.25 14 26.25C10.7511 26.25 7.63526 24.9594 5.33794 22.6621C3.04062 20.3647 1.75 17.2489 1.75 14C1.75 10.7511 3.04062 7.63526 5.33794 5.33794C7.63526 3.04062 10.7511 1.75 14 1.75V1.75ZM14 7C13.7778 6.99981 13.558 7.04596 13.3547 7.1355C13.1514 7.22505 12.9689 7.35602 12.8191 7.52004C12.6692 7.68407 12.5552 7.87755 12.4843 8.08812C12.4135 8.2987 12.3873 8.52174 12.4075 8.743L13.0462 15.7535C13.071 15.9892 13.1822 16.2074 13.3583 16.366C13.5344 16.5245 13.763 16.6123 14 16.6123C14.237 16.6123 14.4656 16.5245 14.6417 16.366C14.8178 16.2074 14.929 15.9892 14.9538 15.7535L15.5908 8.743C15.6109 8.52189 15.5848 8.29899 15.5141 8.08854C15.4433 7.87808 15.3294 7.68469 15.1798 7.52069C15.0301 7.35669 14.8479 7.22569 14.6447 7.13603C14.4416 7.04638 14.222 7.00005 14 7V7ZM14 21C14.3713 21 14.7274 20.8525 14.9899 20.5899C15.2525 20.3274 15.4 19.9713 15.4 19.6C15.4 19.2287 15.2525 18.8726 14.9899 18.6101C14.7274 18.3475 14.3713 18.2 14 18.2C13.6287 18.2 13.2726 18.3475 13.0101 18.6101C12.7475 18.8726 12.6 19.2287 12.6 19.6C12.6 19.9713 12.7475 20.3274 13.0101 20.5899C13.2726 20.8525 13.6287 21 14 21V21Z"
                                                fill="#C70000"
                                            />
                                        </svg>
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <div className=" p-5">
                    <Button
                        type="button"
                        className="w-full rounded-full gold"
                        onClick={() => resetPassword()}
                        // setstate(34)
                    >
                        Update Password
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Changepassword;
