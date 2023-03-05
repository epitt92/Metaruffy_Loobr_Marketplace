import React, { useState } from 'react';
// import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
interface IProps {
    data: { setDate: Function };
    setstate: Function;
}
const Schedulepost = ({ data, setstate }: IProps) => {
    const [value, onChange] = useState<Date>(new Date());
    const d = new Date();
    let month = d.getMonth() + 1;
    let maxDate: Date = new Date(new Date().setMonth(month));
    return (
        <div className=" sm:w-[48.125rem] w-[40rem] xs:w-[26rem] p-8">
            <div className="flex  items-center gap-2">
                <img src="/assets/images/calendar.png" />
                <h5 className="text-white  font-Proxima-SemiBold">Schedule post</h5>
            </div>
            <div className="mt-6">
                <span className="text-white block ">Date</span>
                <div className="date-picker mt-2 relative z-20 !cursor-pointer">
                    <DatePicker
                        minDate={new Date()}
                        maxDate={maxDate}
                        showTimeSelect
                        className="form-control"
                        // minTime={new Date().getTime()}

                        dateFormat="yyyy-MM-dd : h:mm aa"
                        selected={value}
                        onChange={(date: Date) => {
                            // if (new Date() > date) {
                            //     toast.error('Please select a suitable time');
                            // } else {
                            onChange(date);
                            // }
                        }}
                    />
                    <svg
                        className="absolute right-4  -z-10  top-1/2 -translate-y-1/2 cursor-pointer"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.6456 14.6C11.1896 14.6 10.7337 14.4241 10.3885 14.0789L6.14167 9.8321C5.95278 9.64321 5.95278 9.33056 6.14167 9.14167C6.33056 8.95278 6.64321 8.95278 6.8321 9.14167L11.0789 13.3885C11.3916 13.7011 11.8996 13.7011 12.2123 13.3885L16.4591 9.14167C16.648 8.95278 16.9606 8.95278 17.1495 9.14167C17.3384 9.33056 17.3384 9.64321 17.1495 9.8321L12.9027 14.0789C12.5575 14.4241 12.1015 14.6 11.6456 14.6Z"
                            fill="#A1A1A5"
                        />
                    </svg>
                </div>
            </div>
            <Button
                className="mt-12 !w-full rounded-[30px]"
                onClick={() => {
                    if (new Date() > value) {
                        toast.error('Please select a suitable time');
                    } else {
                        setstate();
                        data.setDate(value);
                    }
                }}>
                Schedule Post
            </Button>
        </div>
    );
};

export default Schedulepost;
