import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Input from '../../input/Input';
import Button from '../../Button/Button';
import { createNftLoading } from '../../../redux/nft/actions';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import useMetaMask from '../../../hooks/useMetaMask';
import ERC20ABI from '../../../contractsData/ERC20.json';
import { BigNumber, Contract, ethers } from 'ethers';
import useAudio from '../../../hooks/useAudio';
import { useRouter } from 'next/router';
import { getMYOwnNft } from '../../../redux/user/actions';
import ImageComponent from '../../Image/ImageComponent';
import { TRANSFORMATION_NAMES } from '../../../constants/enums';
import { getLands } from '../../../redux/landmap/actions';

const Mysterymodal = ({ data, setstate }: any) => {
    const user = useSelector((state: any) => state.auth.user);
    const { library, isInstalled, isActive, account }: any = useMetaMask();
    const [playing, play] = useAudio('/LOOBR_PURCHASE_NFT_SUCCESSFUL.mp3');
    const router = useRouter();
    const loading = useSelector((state: any) => state.nft.createNftLoading);

    const [values, setValues] = useState<any>(0);
    const [supply, setSupply] = useState(0);
    const [total, setTotal] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        library && handleGetInfo();
    }, [library]);

    const handleGetInfo = async () => {
        try {
            const signer = library?.getSigner();
            const contract = new Contract(data?.contractAddress, data?.ABI, signer);
            const maxSupply = await contract.MAX_SUPPLY();
            const totalSupply = await contract.totalSupply();
            setSupply(Number(maxSupply));
            setTotal(Number(totalSupply));
        } catch (error) {
            console.log(error);
        }
    };

    const addInrement = () => {
        setValues(values + 1);
    };

    const addDecrement = () => {
        setValues(values - 1);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value > -1) {
            setValues(event.target.value);
        }
    };

    const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (Number(values) < 1) {
            return;
        }
        handleMint();
    };

    const handleMint = async () => {
        try {
            dispatch(createNftLoading(true));
            const signer = library?.getSigner();
            const contract = new Contract(data?.contractAddress, data?.ABI, signer);
            console.log('my', typeof data?.ABI);
            if (data?.chain_id === 1) {
                // Ethereum
                if (data?.isWrap === 1) {
                    // Pay with ETH
                    const mintedPrice = await contract.getMintPrice();
                    const price = Number(Number(mintedPrice) * Number(values)).toFixed();
                    console.log('Price:', price);
                    const token = await contract.mint(Number(values), account, { value: price });
                    let tx = await token.wait();
                } else {
                    // Pay with MR
                    const mintedPrice = await contract.mrMintPrice();
                    const wrapToken = await contract.mrToken();
                    const wrapContract = new Contract(wrapToken, ERC20ABI, signer);
                    // const price = Number(Number(mintedPrice) * Number(values) / ).toFixed();
                    const nftPrice = BigNumber.from(mintedPrice).mul(BigNumber.from(values));
                    const approveTx = await wrapContract.approve(data?.contractAddress, nftPrice);
                    await approveTx.wait();
                    const token = await contract.mintWithMR(Number(values), account);
                    let tx = await token.wait();
                }
            } else if (data?.chain_id === 56) {
                // Binance
                const mintedPrice = await contract.PRICE();
                const wrapToken = await contract.token();
                const wrapContract = new Contract(wrapToken, ERC20ABI, signer);
                const price = Number(Number(mintedPrice) * Number(values)).toFixed();
                const approveTx = await wrapContract.approve(data?.contractAddress, price);
                await approveTx.wait();

                // const nftPrice = ethers.utils.parseEther(price.toString(), 'ether');
                console.log(price, 'nftPrice');

                const token = await contract.mint(Number(values), { value: 0 });
                let tx = await token.wait();
            } else {
                // Polygon and Avalanche
                // @ts-ignore
                const mintedPrice = await contract.getMintPrice();
                const wrapToken = await contract.wrapToken();
                const wrapContract = new Contract(wrapToken, ERC20ABI, signer);
                const price = Number(Number(mintedPrice) * Number(values)).toFixed();
                const approveTx = await wrapContract.approve(data?.contractAddress, price);
                await approveTx.wait();

                // const nftPrice = ethers.utils.parseEther(price.toString(), 'ether');
                console.log(price, 'nftPrice');

                const token = await contract.mint(Number(values), account, { value: 0 });
                let tx = await token.wait();

                let event = tx.events[0];
                let value = event.args[2];
                let tokenId = value.toNumber();
                let hash = tx.events[0].transactionHash;
            }

            // setTxHash(hash);
            play();
            dispatch(createNftLoading(false));
            const filters = { filter: 'CREATOR' };

            // Get updated Lands from Backend API.
            setTimeout(() => dispatch(getLands()), 3000);

            dispatch(getMYOwnNft(filters, account));

            router.push(`/profile/${user?.userName}`);
            setstate();
        } catch (error: any) {
            console.log(error);

            dispatch(createNftLoading(false));
            toast.error(error?.reason || error?.data?.message || error?.message);
        }
    };

    return (
        <div className="sm:w-[50rem] md:w-[50rem] w-[40rem] xs:!w-[33rem] xs3:!w-[28rem] xs4:!w-[24rem]    py-10">
            <div className="flex flex-col  relative items-center rounded-[40px]">
                <figure className="h-[20rem] w-[20rem] relative">
                    <ImageComponent
                        src={data?.image}
                        objectFit="contain"
                        layout="fill"
                        transformation={TRANSFORMATION_NAMES.fit_50x50}
                    />
                </figure>
                <h2 className="text-white xl:text-[40px] mt-6">{data?.name}</h2>

                <p className="hidden sm:text-lg text-[#B8B8BC] mt-3">
                    Sold Out: {total}/{supply}pcs
                </p>
                <div className="">
                    <div className="mt-9 flex  items-center gap-6 justify-center ">
                        <div
                            onClick={addDecrement}
                            className="sm:h-[69px] sm:w-[69px] p-1 w-[45px] h-[45px]  xs3:w-[40px] xs3:h-[40px]  border border-[#727279] rounded-[12px] flex justify-center items-center cursor-pointer">
                            <svg
                                className=" w-8 h-8 xs:h-5 xs:w-5"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M26.6673 16H5.33398" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <Input
                            placeholder="00"
                            value={values}
                            onchange={handleChange}
                            name="values"
                            className="h-[70px] sm:w-[28.563rem] w-[24rem] xs:w-[18rem] xs3:w-[15rem] xs4:w-[12rem] xs:h-[45px]  text-white text-center rounded-[12px] placeholder:text-center  text-2xl"
                        />

                        <div
                            onClick={addInrement}
                            className="sm:h-[69px] sm:w-[69px] p-2 w-[45px] h-[45px] xs3:w-[35px] xs3:h-[40px] border border-[#727279] rounded-[12px] flex justify-center items-center cursor-pointer">
                            <svg
                                className=" w-8 h-8 xs:h-5 xs:w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.0007 22.6654V11.9987M12.0007 11.9987V1.33203M12.0007 11.9987H22.6673M12.0007 11.9987H1.33398"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex gap-4  mt-7  justify-start xs:flex-wrap ">
                        <div
                            className="cursor-pointer h-[44px] w-[94px]  xs:w-full flex justify-center items-center font-Proxima-Regular border border-[#E7E7E9] text-lg  text-white rounded-[8px]"
                            onClick={() => {
                                setValues(5);
                            }}>
                            {' '}
                            Mint 5
                        </div>
                        <div
                            className="cursor-pointer h-[44px] w-[94px] xs:w-full flex justify-center items-center font-Proxima-Regular border border-[#E7E7E9]  text-lg text-white rounded-[8px]"
                            onClick={() => {
                                setValues(10);
                            }}>
                            {' '}
                            Mint 10
                        </div>
                        <div
                            className="cursor-pointer h-[44px] w-[94px] xs:w-full flex justify-center items-center font-Proxima-Regular border border-[#E7E7E9]  text-lg text-white rounded-[8px]"
                            onClick={() => {
                                setValues(20);
                            }}>
                            {' '}
                            Mint 20
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-16 ">
                <Button
                    className="sm:px-[15.563rem] px-[15rem] xs:px-[10rem] xs2:text-base !white-space-nowrap text-xl py-4 rounded-[50px]"
                    onClick={handleSubmit}
                    disabled={loading}
                    isLoading={loading}>
                    Reveal Now
                </Button>
            </div>
        </div>
    );
};

export default Mysterymodal;
