import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import blockchains from '../../contractsData/blockchains';
import useMetaMask from '../../hooks/useMetaMask';
import { sendGift } from '../../redux/nft/actions';

import Button from '../Button/Button';

const BurnNft = ({ setstate, data }: any) => {
    const { library, account, switchNetwork }: any = useMetaMask();
    const [address, setAddress] = useState('');

    const loading = useSelector((state: any) => state.nft.giftLoading);

    const dispatch = useDispatch();

    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const chain = blockchains.find((item) => item?.symbol == data?.chain);
        const status = await switchNetwork(chain?.chainId);
        if (!status) {
            return;
        }
        const signer = library?.getSigner();
        dispatch(
            // @ts-ignore
            sendGift(
                signer,
                data?.tokenId,
                account,
                '0x000000000000000000000000000000000000dead',
                setstate,
                data?.contractAddress
            )
        );
    };
    return (
        <div className="w-full  sm:w-[451px]  m-auto rounded-![16px]  bg-![#14141F]">
            <div className="pt-8 text-center pb-[22px] ">
                <h2 className="text-2xl xl:text[32px] text-white  font-Proxima-Bold">Burn NFT</h2>
                <div className="flex justify-center items-center mt-4">
                    <p className="text-[#89898F] font-Proxima-Regular text-base sm:w-[362px] text-center">
                        Burning NFT means deleting. We’ll transfer your NFT to a zero wallet. This action can’t be
                        reversed.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-5 mt-10 px-12 mb-2">
                    <Button
                        className="xs:w-full rounded-lg !px-14 !py-3 text-[#727279] !bg-[#2b2b35]"
                        disabled={loading}
                        onClick={() => {
                            setstate();
                        }}>
                        Cancel
                    </Button>
                    <Button
                        className="xs:w-full text-white !px-14  !py-3 rounded-lg gold bg-[#F30404] "
                        isLoading={loading}
                        disabled={loading}
                        onClick={handleSubmit}>
                        Burn
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BurnNft;
