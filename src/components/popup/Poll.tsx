import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import Input from '../input/Input';
import Select from '../select/Select';
import { useSelector, useDispatch } from 'react-redux';
import { createFeed } from '../../redux/user/actions';
const Poll = ({ setConfirmed, setstate }: any) => {
    const [question, setQuestion] = useState<string>('');
    const [options, setOptions] = useState<Array<any>>(['', '']);
    const loadingCreateFeed = useSelector((state: any) => state.user.loadingcreatefeed);
    const dispatch = useDispatch();
    const sortdata = [
        { id: 0, name: '1 Day' },
        { id: 1, name: '5 Day' },
        { id: 2, name: '1 Week' },
        { id: 3, name: '2 Week' }
    ];
    const [selected, setSelected] = useState(sortdata[0]);
    const [error, setError] = useState<any>({ question: false, options: false });
    const handleSelectSort = (values: any) => {
        console.log('testintgnfndgnf', values);
        toast.success(values);
        setSelected(values);
    };
    const setValue = (value: any, index: number) => {
        setError({ ...error, option: false });
        let array = options;
        if (index > -1) {
            array[index] = value.target.value;
            setOptions([...array]);
        }
    };
    const createPoll = async (e: any) => {
        e.preventDefault();
        if (question.replace(/\r?\n/g, '').length < 1) {
            setError({ ...error, question: true });
            return;
        }
        let d: any = new Date();
        let g: any;
        switch (selected.id) {
            case 0:
                g = d.setDate(new Date().getDate() + 1);
                break;
            case 1:
                g = d.setDate(new Date().getDate() + 5);

                break;
            case 2:
                g = d.setDate(new Date().getDate() + 7);

                break;
            case 3:
                g = d.setDate(new Date().getDate() + 14);

                break;
            default:
        }

        g = new Date(g);
        let data = new FormData();
        data.append('type', 'poll');
        data.append('question', question);
        data.append('expirayDate', g);
        for (var i = 0; i < options.length; i++) {
            if (options[i].replace(/\r?\n/g, '').length < 1) {
                setError({ ...error, option: true });
                return;
            } else {
                data.append('option', options[i]);
            }
        }
        // @ts-ignore
        dispatch(createFeed(data, setstate, setConfirmed));
    };
    // };
    return (
        <div className="  w-[39rem] xs:w-[26rem]  pt-5 pb-8  ">
            <div className="px-5">
                <h5 className="text-white font-Proxima-Bold text-lg">Create a poll</h5>
            </div>
            <hr className="h-[1px] border-none bg-[#43434C] opacity-[0.5] mt-5" />
            <div className="px-5 mt-8">
                <label className="text-[#9EA1A3] text-base block mb-3 ">Your question</label>
                <Input
                    maxLength={300}
                    placeholder="Write the question"
                    type="text"
                    name="text"
                    styles=" "
                    className="text-white placeholder:text-white !font-Proxima-Regular !placeholder:font-Proxima-Regular "
                    onchange={(e: any) => {
                        setError({ ...error, question: false });
                        setQuestion(e?.target?.value);
                    }}
                />
                {error.question && (
                    <span className="text-red-500  mt-3 text-[16px] block">Qestion can not be empty</span>
                )}
                {options?.map((option: any, index: number) => {
                    return (
                        <>
                            <label className="text-[#9EA1A3] text-base block mb-3 mt-6 ">Option {index + 1}</label>
                            <Input
                                maxLength={40}
                                value={option}
                                placeholder=""
                                type="text"
                                name="text"
                                styles=" "
                                onchange={(e: any) => {
                                    setValue(e, index);
                                }}
                                className="text-white placeholder:text-white !font-Proxima-Regular placeholder:!font-Proxima-Regular "
                            />
                        </>
                    );
                })}
                {error.option && <span className="text-red-500  mt-3 text-[16px] block">Options can not be empty</span>}
                {/* <label className="text-[#9EA1A3] text-base block mb-3 mt-6 ">Option 2</label>
                <Input
                    placeholder="Just a trend"
                    type="text"
                    name="text"
                    styles=" "
                    className="text-white placeholder:text-white !font-Proxima-Regular placeholder:!font-Proxima-Regular "
                /> */}
            </div>
            <div
                className="flex items-center gap-2 mt-6 px-5"
                onClick={() => {
                    if (options.length < 5) {
                        setOptions([...options, '']);
                    } else {
                        toast.error('You have reach maximum options');
                    }
                }}>
                <svg
                    className="cursor-pointer"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.06107 18.0451L3.50191 17.4383L3.06107 18.0451ZM1.95491 16.9389L2.56168 16.4981L1.95491 16.9389ZM18.0451 16.9389L17.4383 16.4981L18.0451 16.9389ZM16.9389 18.0451L16.4981 17.4383L16.9389 18.0451ZM16.9389 1.95491L16.4981 2.56168L16.9389 1.95491ZM18.0451 3.06107L17.4383 3.50191L18.0451 3.06107ZM3.06107 1.95491L3.50191 2.56168L3.06107 1.95491ZM1.95491 3.06107L2.56168 3.50191L1.95491 3.06107ZM7 9.25C6.58579 9.25 6.25 9.58579 6.25 10C6.25 10.4142 6.58579 10.75 7 10.75V9.25ZM13 10.75C13.4142 10.75 13.75 10.4142 13.75 10C13.75 9.58579 13.4142 9.25 13 9.25V10.75ZM9.25 13C9.25 13.4142 9.58579 13.75 10 13.75C10.4142 13.75 10.75 13.4142 10.75 13H9.25ZM10.75 7C10.75 6.58579 10.4142 6.25 10 6.25C9.58579 6.25 9.25 6.58579 9.25 7H10.75ZM10 18.25C8.10843 18.25 6.74999 18.249 5.69804 18.135C4.66013 18.0225 4.00992 17.8074 3.50191 17.4383L2.62023 18.6518C3.42656 19.2377 4.37094 19.5 5.53648 19.6263C6.68798 19.751 8.14184 19.75 10 19.75V18.25ZM0.25 10C0.25 11.8582 0.248971 13.312 0.373728 14.4635C0.500006 15.6291 0.762324 16.5734 1.34815 17.3798L2.56168 16.4981C2.19259 15.9901 1.97745 15.3399 1.865 14.302C1.75103 13.25 1.75 11.8916 1.75 10H0.25ZM3.50191 17.4383C3.14111 17.1762 2.82382 16.8589 2.56168 16.4981L1.34815 17.3798C1.70281 17.8679 2.13209 18.2972 2.62023 18.6518L3.50191 17.4383ZM18.25 10C18.25 11.8916 18.249 13.25 18.135 14.302C18.0225 15.3399 17.8074 15.9901 17.4383 16.4981L18.6518 17.3798C19.2377 16.5734 19.5 15.6291 19.6263 14.4635C19.751 13.312 19.75 11.8582 19.75 10H18.25ZM10 19.75C11.8582 19.75 13.312 19.751 14.4635 19.6263C15.6291 19.5 16.5734 19.2377 17.3798 18.6518L16.4981 17.4383C15.9901 17.8074 15.3399 18.0225 14.302 18.135C13.25 18.249 11.8916 18.25 10 18.25V19.75ZM17.4383 16.4981C17.1762 16.8589 16.8589 17.1762 16.4981 17.4383L17.3798 18.6518C17.8679 18.2972 18.2972 17.8679 18.6518 17.3798L17.4383 16.4981ZM10 1.75C11.8916 1.75 13.25 1.75103 14.302 1.865C15.3399 1.97745 15.9901 2.19259 16.4981 2.56168L17.3798 1.34815C16.5734 0.762324 15.6291 0.500006 14.4635 0.373728C13.312 0.248971 11.8582 0.25 10 0.25V1.75ZM19.75 10C19.75 8.14184 19.751 6.68798 19.6263 5.53648C19.5 4.37094 19.2377 3.42656 18.6518 2.62023L17.4383 3.50191C17.8074 4.00992 18.0225 4.66013 18.135 5.69804C18.249 6.74999 18.25 8.10843 18.25 10H19.75ZM16.4981 2.56168C16.8589 2.82382 17.1762 3.14111 17.4383 3.50191L18.6518 2.62023C18.2972 2.13209 17.8679 1.70281 17.3798 1.34815L16.4981 2.56168ZM10 0.25C8.14184 0.25 6.68798 0.248971 5.53648 0.373728C4.37094 0.500006 3.42656 0.762324 2.62023 1.34815L3.50191 2.56168C4.00992 2.19259 4.66013 1.97745 5.69804 1.865C6.74999 1.75103 8.10843 1.75 10 1.75V0.25ZM1.75 10C1.75 8.10843 1.75103 6.74999 1.865 5.69804C1.97745 4.66013 2.19259 4.00992 2.56168 3.50191L1.34815 2.62023C0.762324 3.42656 0.500006 4.37094 0.373728 5.53648C0.248971 6.68798 0.25 8.14184 0.25 10H1.75ZM2.62023 1.34815C2.13209 1.70281 1.70281 2.13209 1.34815 2.62023L2.56168 3.50191C2.82382 3.14111 3.14111 2.82382 3.50191 2.56168L2.62023 1.34815ZM7 10.75H13V9.25H7V10.75ZM10.75 13V7H9.25V13H10.75Z"
                        fill="#A1A1A5"
                    />
                </svg>
                <p className="text-[#9EA1A3] text-base   ">Add an option </p>
            </div>
            <div className="px-5 mt-8">
                <label className="text-[#9EA1A3] text-base block mb-3  ">Poll Duration</label>
                <Select
                    placeholder=""
                    className="  cursor-pointer  placeholder:[#B0B0B0] px-4 py-4 border border-[#29303A] bg-transparent focus:border-[#F1C94A] text-base font-Circular-Book w-full outline-none rounded-xl text-white leading-[0]  "
                    style=" cursor-pointer text-white"
                    view={true}
                    data={sortdata}
                    selected={selected}
                    onSelect={handleSelectSort}
                />
                <div className="flex justify-end mt-8">
                    <Button
                        className=" rounded-[6.25rem]"
                        onClick={createPoll}
                        isLoading={loadingCreateFeed}
                        disabled={loadingCreateFeed}>
                        Create Poll
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Poll;
