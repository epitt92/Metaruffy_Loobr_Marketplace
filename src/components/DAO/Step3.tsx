import { Signer } from 'ethers';
import { create } from 'ipfs-http-client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../hooks/useMetaMask';
import { createPetition, createPetitionLoading } from '../../redux/dao/actions';
import Button from '../Button/Button';

type Props = {
    cover: string;
    onFileSelect: React.ChangeEventHandler<HTMLInputElement>;
    handleBack: React.FormEventHandler<HTMLFormElement>;
    onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: any;
    errors: any;
    touched: Object;
    setTouched: Function;
    setState: Function;
    loading: boolean;
    title: string;
    description: string;
};

const Step3 = ({
    cover,
    onFileSelect,
    handleBack,
    touched,
    hasError,
    setTouched,
    loading,
    title,
    description,
    setState
}: Props) => {
    const { library }: any = useMetaMask();
    const createLoading = useSelector((state: any) => state.dao.createPetitionLaoding);

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
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setTouched({ ...touched, image: true });
            if (hasError('image')) {
                return;
            }
            const result = await client.add(
                JSON.stringify({
                    image: cover,
                    title: title,
                    description: description
                })
            );

            const uri = `https://loobr.infura-ipfs.io/ipfs/${result.path}`;
            const signer: Signer = library?.getSigner();
            // @ts-ignore
            dispatch(createPetition(signer, uri, setState));
        } catch (error) {
            dispatch(createPetitionLoading(false));
            console.log(error);
        }
    };

    return (
        <div>
            <h3 className="border-b border-[rgba(255,255,255,0.10)] py-6 px-8 text-white text-center">Upload Cover</h3>
            <form onSubmit={handleSubmit}>
                <div className="p-5">
                    <div className="relative overflow-hidden">
                        <label className="w-full text-white text-base mb-[10px] font-Proxima-Regular float-left">
                            Upload your cover
                        </label>
                        {cover ? (
                            <img src={cover} alt="cover" />
                        ) : (
                            <div className="Atuploadcover">
                                <input
                                    hidden
                                    type="file"
                                    name="upload-cover"
                                    id="AtuploadCover"
                                    accept="image/*"
                                    className="w-0 absolute  "
                                    onChange={onFileSelect}
                                />
                                <label htmlFor="AtuploadCover">
                                    <svg
                                        width="46"
                                        height="36"
                                        viewBox="0 0 46 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M22.9996 2C18.0176 2 13.8148 5.34717 12.5222 9.91732C12.4005 10.3479 12.0075 10.6452 11.56 10.6452H11.1125C6.2934 10.6452 2.38672 14.5518 2.38672 19.371C2.38672 24.1901 6.2934 28.0968 11.1125 28.0968H14.3545C14.9067 28.0968 15.3545 28.5445 15.3545 29.0968C15.3545 29.6491 14.9067 30.0968 14.3545 30.0968H11.1125C5.18883 30.0968 0.386719 25.2947 0.386719 19.371C0.386719 13.5431 5.03472 8.80082 10.8259 8.64892C12.5787 3.61428 17.3659 0 22.9996 0C28.6334 0 33.4206 3.61428 35.1733 8.64892C40.9645 8.80082 45.6125 13.5431 45.6125 19.371C45.6125 25.2947 40.8104 30.0968 34.8867 30.0968H31.6448C31.0925 30.0968 30.6448 29.6491 30.6448 29.0968C30.6448 28.5445 31.0925 28.0968 31.6448 28.0968H34.8867C39.7058 28.0968 43.6125 24.1901 43.6125 19.371C43.6125 14.5518 39.7058 10.6452 34.8867 10.6452H34.4393C33.9918 10.6452 33.5988 10.3479 33.477 9.91732C32.1844 5.34717 27.9816 2 22.9996 2Z"
                                            fill="#EFC74D"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M22.293 12.1796C22.6835 11.7891 23.3166 11.7891 23.7072 12.1796L31.2717 19.7441C31.6622 20.1347 31.6622 20.7678 31.2717 21.1583C30.8812 21.5489 30.248 21.5489 29.8575 21.1583L24.0001 15.3009V34.4996C24.0001 35.0519 23.5523 35.4996 23.0001 35.4996C22.4478 35.4996 22.0001 35.0519 22.0001 34.4996V15.3009L16.1427 21.1583C15.7521 21.5489 15.119 21.5489 14.7284 21.1583C14.3379 20.7678 14.3379 20.1347 14.7284 19.7441L22.293 12.1796Z"
                                            fill="#EFC74D"
                                        />
                                    </svg>
                                    <span>Upload Photo</span>
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="mt-[30px] flex items-center border-gray5 gap-5 justify-evenly clear-both">
                        <Button
                            onClick={handleBack}
                            type="button"
                            className="w-full rounded-full  inline-flex font-Proxima-Bold items-center justify-center relative !text-white bg-transparent border border-[#5A5A62]"
                            // isLoading={loading || createLoading}
                            disabled={loading || createLoading}>
                            Back
                        </Button>
                        <Button
                            type="button"
                            className="w-full rounded-full"
                            onClick={handleSubmit}
                            isLoading={loading || createLoading}
                            disabled={loading || createLoading}>
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Step3;
