import React, { useState } from 'react';
import Button from '../../Button/Button';
import Popups from '../../../components/popup/poups';

const TellStory = ({ data }: any) => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [error, setError] = useState(false);
    const [values, setValues] = useState({
        description: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        error && setError(false);
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!values.description) {
            setError(true);
            return;
        }
        setPopup(true);
        setState(68);
    };
    return (
        <div className="md:w-[694px] sm:w-[48.125rem] w-full m-auto rounded-2xl">
            <h3 className="border-b border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">
                Tell your story
            </h3>
            <form>
                <div className="p-5">
                    <div className="relative">
                        <label className="w-full text-white text-base mb-[10px] font-Proxima-SemiBold float-left">
                            Description
                        </label>
                        <textarea
                            name="description"
                            onChange={handleChange}
                            placeholder="Write here..."
                            className="bg-transparent braek border border-[#29303a] text-white rounded-[8px] w-full resize-none h-[330px] p-4 focus:outline-none"
                        />
                        {error && <span className="text-rose-600">Description should not be empty.</span>}
                    </div>
                    <div className="mt-[30px] flex items-center border-gray5 gap-5 justify-evenly">
                        <Button
                            onClick={() => {
                                setPopup(true);
                                setState(66);
                            }}
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
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={data} />}
        </div>
    );
};

export default TellStory;
