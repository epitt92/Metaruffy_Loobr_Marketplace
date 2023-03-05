import React from 'react';
import Button from '../Button/Button';

type Props = {
    handleNext: Function;
    handleBack: React.FormEventHandler<HTMLFormElement>;
    handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    description: string;
    onBlur: React.ChangeEventHandler<HTMLTextAreaElement>;
    hasError: any;
    errors: any;
    touched: Object;
    setTouched: Function;
};

const Step2 = ({
    handleChange,
    handleNext,
    description,
    handleBack,
    hasError,
    errors,
    onBlur,
    setTouched,
    touched
}: Props) => {
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTouched({ ...touched, description: true });
        if (hasError('description') || !description) {
            return;
        }
        handleNext();
    };

    return (
        <div>
            <h3 className="border-b border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">
                Tell your story
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="p-5">
                    <div className="relative">
                        <label className="w-full text-white text-base mb-[10px] font-Proxima-SemiBold float-left">
                            Description
                        </label>
                        <textarea
                            name="description"
                            onChange={handleChange}
                            value={description}
                            placeholder="Write here..."
                            className="bg-transparent braek border border-[#29303a] text-white rounded-[8px] w-full resize-none h-[330px] p-4 focus:outline-none"
                            onBlur={onBlur}
                        />
                        {hasError('description') && <span className="text-rose-600">{errors['description']}</span>}
                    </div>
                    <div className="mt-[30px] flex items-center border-gray5 gap-5 justify-evenly">
                        <Button
                            onClick={handleBack}
                            type="button"
                            className="w-full rounded-full  inline-flex font-Proxima-Bold items-center justify-center relative !text-white bg-transparent border border-[#5A5A62]">
                            Back
                        </Button>
                        <Button type="submit" className="w-full rounded-full" onClick={handleSubmit}>
                            Continue
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Step2;
