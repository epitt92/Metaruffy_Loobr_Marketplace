import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import Input from "../input/Input";

export const AppPassword = ({ setstate, hide }: any) => {
  const [values, setValues] = useState({
    password: "",
  });
  const [error, setError] = useState(false);

  const loading = useSelector((state: any) => state.auth.forgotPasswordLoading);

  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.password === process.env.NEXT_PUBLIC_PASSWORD) {
      hide(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full md:w-[400px] sm:w-[594px]  m-auto rounded-lg ">
      {/* <div className=" border-b border-[#2B2B35] py-6 text-center">
        <h2 className="text-xl text-white">App Password</h2>
      </div> */}
      <div className="pt-6 px-8 pb-8">
        <form onSubmit={handleSubmit}>
          <h3 className="text-2rem text-white mb-2">App Password</h3>
          <p className="text-[#89898F] text-base mb-6">
            Enter app password to to use this platform.
          </p>
          <div className="grid grid-cols-1">
            <div className="">
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onchange={handleChange}
                error={error}
                helperText={"Incorrect password"}
              />
            </div>
          </div>
          <Link legacyBehavior href="#">
            <a>
              <Button
                className="w-full mt-[2.75rem] mb-[16px] gold rounded-[1.875rem]"
                onClick={handleSubmit}
                isLoading={loading}
                disabled={loading}
                type="submit"
              >
                Submit
              </Button>
            </a>
          </Link>
        </form>
      </div>
    </div>
  );
};
