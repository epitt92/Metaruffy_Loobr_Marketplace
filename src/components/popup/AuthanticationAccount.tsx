import axios from 'axios';
import React, { ClipboardEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { twoFALogin } from '../../redux/auth/actions';
import { change2FARequest, change2FAStatus } from '../../redux/user/actions';
import Button from '../Button/Button';

export const AuthanticationAccount = ({ setstate, state }: any) => {
    const [code, setCode] = useState(new Array(6).fill(''));

    const user = useSelector((state: any) => state.auth.user);
    const loading = useSelector((state: any) => state.auth.loginLoading);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
        console.log(event.target.value, 'called');
        // const arr = [...code];
        // arr[i] = event.target.value;
        // setCode([...arr]);
    };

    const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (new RegExp(/^\d+$/).test(event.key)) {
            // @ts-ignore
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            const arr = [...code];
            arr[index] = event.key;
            setCode([...arr]);
            form && form.elements[index + 1]?.focus();
            event.preventDefault();
        }
        if (event.key.toLowerCase() === 'backspace') {
            // @ts-ignore
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            const arr = [...code];
            arr[index] = '';
            setCode([...arr]);
            form && form.elements[index - 1]?.focus();
            event.preventDefault();
        }
        if (event.key.toLowerCase() === 'enter') {
            // @ts-ignore
            const form = event.target.form;
            const index = [...form].indexOf(event.target);
            form && form.elements[index + 1]?.focus();
            event.preventDefault();
        }
    };

    const handlePaste = (event: ClipboardEventHandler<HTMLInputElement>) => {
        // @ts-ignore
        let text: string = event.clipboardData.getData('text');

        if (text) {
            text = text.replace(/\s/g, '');
            setCode(text.split('').slice(0, 6));
        }
    };

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (code.includes('')) {
            return;
        }
        const data = {
            code: code.join('')
        };

        dispatch(twoFALogin(data, setstate));
    };

    const handleResendCode = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(change2FARequest());
    };

    return (
        <div className="w-full md:w-[615px] sm:w-[515px] m-auto rounded-lg">
            <div className="py-6 text-center">{/* <h2 className="text-xl text-white">Login</h2> */}</div>
            <div className="pt-8 px-8 pb-8">
                <div className="flex justify-center mb-[3.125rem]">
                    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M76.875 38.2125H66.0375C57.15 38.2125 49.9125 30.975 49.9125 22.0875V11.25C49.9125 9.1875 48.225 7.5 46.1625 7.5H30.2625C18.7125 7.5 9.375 15 9.375 28.3875V61.6125C9.375 75 18.7125 82.5 30.2625 82.5H59.7375C71.2875 82.5 80.625 75 80.625 61.6125V41.9625C80.625 39.9 78.9375 38.2125 76.875 38.2125ZM46.5 58.425L39.525 65.4C38.6625 66.2625 37.4625 66.75 36.1875 66.75C34.9125 66.75 33.75 66.2625 32.85 65.4L25.875 58.425C24.3375 56.8875 24.075 54.3 25.3125 52.5L28.5 47.7C29.2875 46.4625 30.9375 45.6 32.4 45.6H39.9375C41.4 45.6 43.0125 46.4625 43.8375 47.7L47.0625 52.5C48.225 54.3 48 56.8875 46.5 58.425Z"
                            fill="#EFC74D"
                        />
                        <path
                            d="M65.3633 33.0375C68.9258 33.075 73.8758 33.075 78.1133 33.075C80.2508 33.075 81.3758 30.5625 79.8758 29.0625C74.4758 23.625 64.8008 13.8375 59.2508 8.2875C57.7133 6.75 55.0508 7.8 55.0508 9.9375V23.025C55.0508 28.5 59.7008 33.0375 65.3633 33.0375Z"
                            fill="#EFC74D"
                        />
                    </svg>
                </div>
                <div>
                    <h3 className="text-2rem text-white font-Proxima-Bold text-center mb-3">
                        Authenticate Your Account
                    </h3>
                    <p className="text-center text-[#D0D0D2] text-[1rem] mb-[4.375rem]">
                        Please confirm your account by entering the{' '}
                        <span className="block">authentication code sent to your email account.</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6 grid grid-cols-6 gap-3 max-w-[346px] m-auto">
                        {new Array(6).fill('').map((item, i) => (
                            <input
                                key={i}
                                className="bg-transparent border-b-[2px] p-0 pb-6 text-[2.188rem] placeholder-shown:text-white font-Proxima-Bold text-white text-center focus:outline-none border-white"
                                type="number"
                                name={`ch${i}`}
                                value={code[i]}
                                placeholder=""
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={handleEnter}
                                // @ts-ignore
                                onPaste={handlePaste}
                            />
                        ))}
                    </div>
                </form>
                <div className="flex items-center justify-between mt-10">
                    <p className="text-[#818182]">
                        It may take a minute to receive your code.{' '}
                        <span className="block">
                            Haven’t recieved it?{' '}
                            <button className="text-white" type="button" onClick={handleResendCode}>
                                Resend new code.
                            </button>
                        </span>
                    </p>
                    {/* <Link legacyBehavior href="#">
                        <a className="!text-[#F1C94A] ml-2">
                            Create Account
                        </a>
                    </Link> */}
                    <Button
                        className=" inline-flex font-Proxima-Bold items-center justify-center px-11 py-3 rounded-lg bg-themecolor relative text-black2  , undefined, p-8 pb-2 xl:pt-3.5 xl:pb-3.5 px-7 rounded-full md:px-11 gold"
                        isLoading={loading}
                        disabled={loading}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};
