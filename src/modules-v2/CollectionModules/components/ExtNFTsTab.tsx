import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import Loader from '../../../components/loader/Loader';
import MainCard from '../../../components/maincard/MainCard';
import Notfound from '../../../components/notfound/notfound';
import ExternalNFTsByCollectionAddress from './ExtNFTsByCollectionAddress';

type Props = {
    setImage: Function;
    collection: any;
};

const ExtNFTsTab = ({ setImage, collection }: Props) => {
    // const collection = useSelector((state: any) => state.collections.collection);

    const router = useRouter();
    const { address }: any = router.query;

    return (
        <div>
            <ExternalNFTsByCollectionAddress
                address={address}
                collection={collection}
                setImage={setImage}
                // setSearch={setSearch}
                // search={search}
            />
        </div>
    );
};

export default ExtNFTsTab;
