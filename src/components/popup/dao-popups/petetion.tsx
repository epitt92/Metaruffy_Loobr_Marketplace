import React, { useEffect, useState } from 'react';
import { Step1, Step2, Step3 } from '../../DAO';
import { validate } from 'validate.js';
import { creatPetitionSchema } from '../../../validations';
import { create } from 'ipfs-http-client';

const Petetion = ({ setstate }: any) => {
    const [error, setError] = useState(false);
    const [touched, setTouched] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [steps, setSteps] = useState(1);
    const [values, setValues] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [cover, setCover] = useState<any>();
    const [file, setFile] = useState<any>();

    const auth =
        'Basic ' +
        Buffer.from(
            process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_ID +
                ':' +
                process.env.NEXT_PUBLIC_REACT_APP_IPFS_PROJECT_SECRET
        ).toString('base64');

    const client: any = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        apiPath: '/api/v0',
        headers: {
            authorization: auth
        }
    });

    useEffect(() => {
        const errors = validate({ ...values, image: cover }, creatPetitionSchema);
        setErrors({ ...(errors || {}) });
    }, [values, cover]);

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleFileSelect = async (e: any) => {
        setLoading(true);
        setFile(e.target.files[0]);
        try {
            const added = await client.add(e.target.files[0]);
            setCover(`https://loobr.infura-ipfs.io/ipfs/${added.path}`);
            setLoading(false);
        } catch (error) {
            console.log('Error uploading file: ', error);
            setLoading(false);
        }
    };

    const handleNext = () => {
        setSteps(steps + 1);
    };

    const handleBack = () => {
        setSteps(steps - 1);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        error && setError(false);
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const hasError = (field: string) => (touched[field] && errors[field] ? true : false);

    return (
        <div className=" md:w-[694px]  sm:w-[48.125rem] w-[40rem] xs:w-[26rem] m-auto rounded-2xl">
            {steps == 1 && (
                <Step1
                    handleNext={handleNext}
                    handleChange={handleChange}
                    title={values.title}
                    onBlur={handleBlur}
                    errors={errors}
                    hasError={hasError}
                    setTouched={setTouched}
                    touched={touched}
                />
            )}
            {steps == 2 && (
                <Step2
                    description={values.description}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    hasError={hasError}
                    setTouched={setTouched}
                    touched={touched}
                />
            )}
            {steps == 3 && (
                <Step3
                    handleBack={handleBack}
                    onFileSelect={handleFileSelect}
                    cover={cover}
                    title={values.title}
                    description={values.description}
                    setState={setstate}
                    onBlur={handleBlur}
                    errors={errors}
                    hasError={hasError}
                    setTouched={setTouched}
                    touched={touched}
                    loading={loading}
                />
            )}
            {/* {state > 0 && (
                <Popups
                    show={popup}
                    hide={setPopup}
                    state={state}
                    setstate={setState}
                    data={data}
                    type={type}
                    setImage={callS3}
                />
            )} */}
        </div>
    );
};

export default Petetion;
