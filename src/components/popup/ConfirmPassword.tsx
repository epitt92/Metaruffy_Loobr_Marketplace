import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change2FAStatus } from '../../redux/user/actions';
import Button from '../Button/Button';
import Input from '../input/Input';

export const ConfirmPassword = ({ setstate, state }: any) => {
    const [values, setValues] = useState({
        password: ''
    });

    const loading = useSelector((state: any) => state.user.twoFaStatusLoading);
    const user = useSelector((state: any) => state.auth.user);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = {
            password: values.password
        };

        dispatch(change2FAStatus(data, setstate));
    };

    return (
        <div className="w-full md:w-[530px] sm:w-[400px]  m-auto rounded-lg ">
            <div className="pt-6 text-center">
                <h2 className="text-3xl text-white font-Proxima-Bold">Enter Password</h2>
            </div>
            <div className="pt-6 px-8 pb-8">
                <form>
                    <p className="text-white font-Proxima-SemiBold text-base mb-6">
                        Please enter your password to {user?.settings?.twoFa ? 'deactivate' : 'activate'} two-factor{' '}
                        <span className="block">authentication</span>
                    </p>
                    <div className="grid grid-cols-1">
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onchange={handleChange}
                            value={values.password}
                        />
                    </div>
                    <Link legacyBehavior href="">
                        <a>
                            <Button
                                className="w-full mt-[1.75rem] gold rounded-[1.875rem]"
                                type="button"
                                onClick={handleSubmit}
                                isLoading={loading}
                                disabled={loading}>
                                {user?.settings?.twoFa ? 'Deactivate' : 'Activate'}
                            </Button>
                        </a>
                    </Link>
                </form>
            </div>
        </div>
    );
};
