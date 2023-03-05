import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { connectors, injected, walletconnect } from '../components/wallet/connectors';
import { useWeb3React } from '@web3-react/core';
import TokenAbi from '../contractsData/Token.json';
import { Contract, ethers } from 'ethers';
// import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from 'web3';
const web3 = new Web3(Web3.currentProvider);
import { mainnetChains, networks, testnestChains } from '../constants/metamask';
import { toHex } from '../utils/functions';
import ContractData from '../contractsData/contracts-details';
import { toast } from 'react-toastify';

export const MetaMaskContext = React.createContext(null);

export const MetaMaskProvider = ({ children }) => {
    const { active, error: networkError, activate, account, library, deactivate, chainId } = useWeb3React();
    const [isActive, setIsActive] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [USDTBalance, setUSDTBalance] = useState(0);
    const [LoobrBalance, setLoobrBalance] = useState(0);
    const [mrBalance, setMrBalance] = useState(0);
    // Init Loading
    useEffect(() => {
        // connect().then((val) => {
        //     // console.log("connected");
        //     setIsLoading(false);
        // });
    }, []);

    useEffect(() => {
        const providerName = window?.localStorage?.getItem('provider');
        if (providerName == 'injected') {
            connectAuto();
        } else if (providerName == 'walletConnect') {
            connectWalletConnect();
        } else {
            setIsLoading(false);
        }
    }, [activate, networkError]);

    const handleIsActive = useCallback(() => {
        setIsActive(active);
        const { ethereum } = window;
        if (ethereum && ethereum.on && !active && !networkError) {
            ethereum.on('chainChanged', handleChainChanged);
        }
        return () => {
            if (ethereum.removeListener) {
                ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [active]);

    useEffect(() => {
        account &&
            library?.getBalance(account).then((result) => {
                setBalance(result / 1e18);
            });
        account && getUSDTBalance();
        account && getLoobrBalance();
        account && getMrBalance();
    }, [isActive, account, library]);

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setIsInstalled(true);
        }
    }, []);

    useEffect(() => {
        handleIsActive();
    }, [handleIsActive]);

    // Connect to MetaMask wallet
    const connectAuto = async () => {
        try {
            injected
                .isAuthorized()
                .then(async (isAuthorized) => {
                    if (isAuthorized && !active && !networkError) {
                        const chainId = await getChainId();
                        const chains =
                            process.env.NEXT_PUBLIC_BLOCKCHAIN_ENV === 'TESTNET' ? testnestChains : mainnetChains;
                        if (!chains.includes(chainId)) {
                            await switchNetwork(process.env.NEXT_PUBLIC_CHAIN_ID_DECIMAL);
                        }
                        await activate(injected);
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.log('Error on connecting: ', error);
                    setIsLoading(false);
                });
        } catch (error) {
            console.log('Error on connecting: ', error);
            setIsLoading(false);
        }
    };

    const connectWalletConnect = async () => {
        try {
            if (await walletconnect?.walletConnectProvider?.enable()) {
                await activate(connectors.walletConnect);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Error on connecting: ', error);
            setIsLoading(false);
        }
    };

    // Connect to MetaMask wallet
    const connect = async () => {
        setIsLoading(true);
        try {
            const chainId = await getChainId();
            // if (ethers.utils.hexlify(chainId) != process.env.NEXT_PUBLIC_CHAIN_ID) {
            //     await switchNetwork();
            // }
            await activate(injected);
            setIsLoading(false);
        } catch (error) {
            // console.log("Error on connecting: ", error);
        }
    };

    // Disconnect from Metamask wallet
    const disconnect = async () => {
        // console.log("Deactivating...");
        try {
            await deactivate();
        } catch (error) {
            // console.log("Error on disconnecting: ", error);
        }
    };

    const getChainId = async () => {
        try {
            // const provider = await detectEthereumProvider();
            // const chainId = await provider.request({
            //     method: "eth_chainId",
            // });
            return parseInt(chainId, 16);
        } catch (error) {
            // console.log(error, "chain");
        }
    };

    const handleAddSignatures = async () => {
        try {
            const provider = await library?.provider;
            // const provider = await detectEthereumProvider();
            const sign = await provider.request({
                method: 'personal_sign',
                params: [
                    web3.utils.toHex(
                        `Welcome to LooBr! \n\nClick to sign in and accept the LooBr Terms of Service:\n﻿https://loobr.com/termsandconditions \n\nThis request will not trigger a blockchain transaction or cost you any gas fees. \n\nWallet address:\n${provider.selectedAddress}`
                    ),
                    provider.selectedAddress
                ]
            });
            // console.log(sign);
        } catch (error) {
            // console.log(error, "signature");
        }
    };

    const getUSDTBalance = async () => {
        try {
            const blockchain = ContractData.find((item) => item.chainId == chainId && item.sellCurrency == 'USDT');
            const signer = library?.getSigner();
            const contract = new Contract(
                // process.env.NEXT_PUBLIC_USDT_ADDRESS,
                blockchain.tokenAddress,
                TokenAbi.abi,
                signer
            );
            const decimals = await contract.decimals();
            const balance = await contract.balanceOf(account);
            // console.log(Number(balance) / 10 ** decimals);
            setUSDTBalance(Number(balance / 10 ** decimals).toFixed());
        } catch (error) {
            console.log('Loobr balance error');
        }
    };

    const getLoobrBalance = async () => {
        try {
            const signer = library?.getSigner();
            const contract = new Contract(process.env.NEXT_PUBLIC_TOKEN_ADDRESS, TokenAbi.abi, signer);
            const balance = await contract.balanceOf(account);
            setLoobrBalance(Number(balance / 1e18).toFixed());
        } catch (error) {
            // console.log("Loobr balance error");
        }
    };

    const getMrBalance = async () => {
        try {
            const signer = library?.getSigner();
            const contract = new Contract(process.env.NEXT_PUBLIC_MR_ADDRESS, TokenAbi.abi, signer);
            const balance = await contract.balanceOf(account);
            setMrBalance(Number(balance / 1e18).toFixed());
        } catch (error) {
            // console.log("Loobr balance error");
        }
    };

    const switchNetwork = async (network) => {
        return new Promise(async (resolve, reject) => {
            const provider = await library?.provider;

            if (provider?.signer?.connection?.wc?._peerMeta?.name == 'Trust Wallet Android') {
                return resolve(true);
            }

            // const provider = await detectEthereumProvider();
            try {
                // const providerName = window.localStorage.getItem('provider')
                // if (providerName === "walletConnect") {
                //     return resolve(true)
                // }
                await provider?.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: toHex(network)
                        }
                    ]
                });
                return resolve(true);
            } catch (switchError) {
                console.log(switchError);
                if (switchError.code === 4902 || switchError.code === -32000) {
                    try {
                        console.log(network, networks);
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [{ ...networks[network] }]
                        });
                        // await handleAddSignatures();
                        return resolve(true);
                    } catch (error) {
                        console.log(error, 'error.code');
                        if (switchError.code == 4001) {
                            return reject(false);
                        }

                        console.log(error, 'switch network');
                    }
                }
                console.log(switchError, 'switchError');

                if (provider?.signer?.connection?.wc?._peerMeta?.name == 'Trust Wallet Android') {
                    toast.error(
                        'You chose the wrong network. Please disconnect your Trust Wallet and choose the right network again to proceed.'
                    );
                }
                return resolve(false);
            }
        });
    };

    const handleChainChanged = async (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        console.log(injected, 'injected');
        await activate(injected);
    };

    const values = useMemo(
        () => ({
            isActive,
            account,
            isLoading,
            setIsLoading,
            connect,
            disconnect,
            library,
            balance,
            isInstalled,
            USDTBalance,
            LoobrBalance,
            mrBalance,
            switchNetwork
        }),
        [isActive, isLoading, balance, isInstalled, USDTBalance, LoobrBalance, mrBalance, setIsLoading]
    );

    return <MetaMaskContext.Provider value={values}>{children}</MetaMaskContext.Provider>;
};

export default function useMetaMask() {
    const context = React.useContext(MetaMaskContext);

    if (context === undefined) {
        throw new Error('useMetaMask hook must be used with a MetaMaskProvider component');
    }

    return context;
}
