import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/input/Input';
import useMetaMask from '../../hooks/useMetaMask';
import SelectComponent from './Components/Select';
import NFTAbi from '../../contractsData/NFT.json';
// import NFTAddress from "../../contractsData/NFT-address.json";
import axios from 'axios';
import MainCard from '../../components/maincard/MainCard';
import { Contract, ethers, utils } from 'ethers';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { homeService } from '../../services/home.service';
import { useDispatch, useSelector } from 'react-redux';
import { getCollectionByAddress } from '../../redux/collections/actions';
import ExtNFTsTab from '../CollectionModules/components/ExtNFTsTab';
import ExternalNFTsByCollectionAddress from '../CollectionModules/components/ExtNFTsByCollectionAddress';
import Loader from '../../components/loader/Loader';
import { isEmpty } from 'lodash';

const ContractAddress = () => {
    const [values, setValues] = useState({
        address: ''
    });
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>('');

    // const collection = useSelector((state: any) => state.collections.collection);
    // const collectionLoading = useSelector((state: any) => state.collections.collectionLoading);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        try {
            setLoading(true);

            if (ethers.utils.isAddress(values?.address)) {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/collections/external/${values.address}`
                );
                setCollection(res.data?.data);
                setLoading(false);
                setError(false);
            } else {
                toast.error('You contract does not match the ERC721 standard.');
                setError(true);
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            toast.error('You contract does not match the ERC721 standard.');
        }
    };

    return (
        <div className="container min-h-screen py-32 ">
            <form onSubmit={handleSubmit}>
                <h2 className="font-Proxima-Bold text-white mt-24 text-[2.5rem]">Enter your contract address</h2>
                <p className="text-lg mt-1">What is the address of your ERC721 contract on the mainnet Network?</p>

                <p className="text-base font-Proxima-Bold mb-2.5 text-white text-left mt-12">Contract Address</p>
                <div className="flex sm:flex gap-8  mb-5 h-[6rem]">
                    <div className="w-full sm:mt-0">
                        <Input
                            name="address"
                            placeholder="0xASF123..."
                            id="id_title"
                            value={values.address}
                            onchange={handleChange}
                            className="h-[3.75rem]"
                            // onBlur={handleBlur}
                            error={error}
                            helperText={error ? 'Contract address in not correct.' : ''}
                        />
                    </div>
                    <Button className="!px-20 h-[3.5rem]" onClick={handleSubmit} disabled={loading} isLoading={loading}>
                        Submit
                    </Button>
                </div>
            </form>

            {loading ? (
                <Loader />
            ) : (
                <>
                    {!isEmpty(collection) && (
                        <ExternalNFTsByCollectionAddress address={values?.address} collection={collection} />
                    )}
                </>
            )}
        </div>
    );
};

export default ContractAddress;
