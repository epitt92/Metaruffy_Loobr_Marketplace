import Image from 'next/image';
import { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import Edit from './Edit';
import { updateUser } from '../../redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, validate } from 'validate.js';
import { updateUsers } from '../../validations';
import Socialmedia from '../../components/socialmedia/socialmedia';
import ImageComponent from '../../components/Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../constants/enums';
export const EditprofileModal = ({ setstate, state }: any) => {
    const user = useSelector((state: any) => state.auth.user);
    const loading = useSelector((state: any) => state.auth.updateLoading);
    const [values, setValues] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        avatar: user?.avatar,
        coverImage: user?.coverImage,
        userName: user?.userName,
        facebook: user?.facebook ? user?.facebook : '',
        instagram: user?.instagram ? user?.instagram : '',
        reddit: user?.reddit ? user?.reddit : '',
        twitter: user?.twitter ? user?.twitter : '',
        discord: user?.discord ? user?.discord : '',
        youtube: user?.youtube ? user?.youtube : '',
        tiktok: user?.tiktok ? user?.tiktok : '',
        web: user?.web ? user?.web : '',
        bio: user?.bio ? user?.bio : ''
    });
    const dispatch = useDispatch();
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    useEffect(() => {
        const errors = validate(values, updateUsers);
        setErrors({ ...(errors || {}) });
    }, [values]);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };
    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);

    const enabledTouchedValues = () => {
        const newState: any = {};
        Object.keys(errors).forEach((item) => {
            newState[item] = true;
        });
        setTouched(newState);
    };

    const handleSignUp = () => {
        enabledTouchedValues();
        if (!isEmpty(errors)) {
            return;
        } else {
            dispatch(updateUser(values, setstate));
        }
    };
    return (
        <div className="lg:w-[694px] m-auto rounded-[1.5rem] pt-10">
            <div className=" flex-col items-center flex justify-center relative">
                <div className="z-[5]">
                    <figure className="w-[7.75rem] h-[7.75rem] relative border-[.6rem] border-[#2b2b35] bg-[#2b2b35] rounded-full">
                        {values.avatar ? (
                            <ImageComponent
                                src={values.avatar}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full w-[7.75rem] h-[7.75rem]"
                                transformation={TRANSFORMATION_NAMES.fit_150x150}
                            />
                        ) : (
                            <p className="w-full h-full bg-themecolor contain flex items-center justify-center rounded-full text-black1 text-2xl">
                                {values?.firstName.charAt(0).toUpperCase()}
                            </p>
                        )}
                    </figure>
                </div>
            </div>

            <h2 className="text-2xl text-white text-center mt-6">
                {user?.firstName} {user?.lastName}
            </h2>

            <div className="pt-6 px-8 pb-8">
                <div className="mb-6 grid xs:grid-cols-1 grid-cols-2 gap-x-4">
                    <div className="xs:mb-6">
                        <Input
                            floatingLabel="labelname "
                            styles="at-fieldholder"
                            className="pt-7 pb-2"
                            labelname="First Name"
                            placeholder="First Name"
                            name="firstName"
                            value={values?.firstName}
                            onchange={handleChange}
                            onBlur={handleBlur}
                            error={hasError('firstName')}
                            helperText={hasError('firstName') ? errors.firstName[0] : null}
                        />
                    </div>
                    <div className="">
                        <Input
                            floatingLabel="labelname"
                            styles="at-fieldholder"
                            className="pt-7 pb-2"
                            labelname="Last Name"
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
                            floatingLabel="labelname"
                            styles="at-fieldholder"
                            className="pt-7 pb-2"
                            labelname="Email Address"
                            placeholder="Email Address"
                            value={values.email}
                            disabled
                        />
                    </div>
                </div>
                <div className="mb-6 grid grid-cols-1">
                    <div className="">
                        <Input
                            floatingLabel="labelname"
                            styles="at-fieldholder"
                            className="pt-7 pb-2"
                            labelname="Username"
                            placeholder="Username"
                            value={values.userName}
                            disabled
                        />
                    </div>
                </div>
                <div className="mb-6 grid grid-cols-1">
                    <h3 className="text-white text-base font-Proxima-Regular mb-3">Bio</h3>
                    <div className="">
                        <textarea
                            maxLength={150}
                            value={values.bio}
                            name={'bio'}
                            onChange={(e: any) => {
                                setValues({ ...values, bio: e.target.value });
                            }}
                            placeholder=""
                            className="w-full resize-none braek h-[140px] border border-[#29303A] focus:outline-none px-4 py-4 rounded-xl bg-transparent text-white"></textarea>
                    </div>
                </div>
                <Socialmedia values={values} setValues={setValues} />
                <Button
                    className="w-full mb-6 rounded-[3.125rem] py-4 gold"
                    onClick={() => {
                        handleSignUp();
                    }}
                    isLoading={loading}
                    disabled={loading}>
                    Update Profile
                </Button>
            </div>
        </div>
    );
};
