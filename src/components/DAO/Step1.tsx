import React from 'react';
import Button from '../Button/Button';
import Input from '../input/Input';

type Props = {
    handleNext: Function;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title: string;
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: any;
    errors: any;
    touched: Object;
    setTouched: Function;
};

const Step1 = ({ handleNext, handleChange, title, onBlur, hasError, errors, setTouched, touched }: Props) => {
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTouched({ ...touched, title: true });
        if (hasError('title') || !title) {
            return;
        }
        handleNext();
    };

    return (
        <div>
            <h3 className="border-b  border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">
                Create your Petition
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="p-5">
                    <div className="relative">
                        <label className="w-full text-white text-base mb-[10px] font-Proxima-SemiBold float-left">
                            Petition title
                        </label>
                        <Input
                            type="text"
                            className=""
                            name="title"
                            placeholder="Free Peter"
                            value={title}
                            onchange={handleChange}
                            onBlur={onBlur}
                            error={hasError('title')}
                            helperText={hasError('title') ? errors['title'] : null}
                            autoFocus={true}
                        />
                    </div>
                    <div className="mt-[30px] border-gray5">
                        <Button
                            type="submit"
                            // disabled
                            className="w-full rounded-full"
                            onClick={handleSubmit}>
                            Continue
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Step1;
