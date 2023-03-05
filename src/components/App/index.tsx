import type { AppProps } from 'next/app';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Layout from '../../components/layout/layout';
import { useEffect, useMemo, useState } from 'react';
import useMetaMask from '../../hooks/useMetaMask';
import { _io } from '../../services/socket.service';
import { getUser, onlineUsersAction } from '../../redux/auth/actions';
import SEO from '../../../next-seo.config';

// import { createWallet } from "../redux/user/actions";
import jwt from 'jsonwebtoken';
import {
    getBNBPrice,
    getLoobrPrice,
    getUSDTPrice,
    getETHPrice,
    getCurrencyRate,
    getMaticPrice,
    getAvaxPrice
} from '../../redux/nft/actions';
import DirectChat from '../../components/Chat/DirectChat';
import Popups from '../../components/popup/poups';
import { CHANGE_AUTH_STATUS } from '../../redux/auth/actionTypes';
import { createWallet } from '../../redux/user/actions';
import 'react-image-crop/dist/ReactCrop.css';
import { CALLING, REJECTCALL } from '../../constants/socketEvents';
import { getMarketDetailsByChainId } from '../../utils/functions';
import { useWeb3React } from '@web3-react/core';
import { Cookies } from 'react-cookie-consent';
import { DefaultSeo } from 'next-seo';
import {
    getIslandOwners,
    getIslands,
    getLands,
    getMylands,
    getNftListing,
    getTopIslandowners,
    getTopLandowners,
    getTopOneIslandowners
} from '../../redux/landmap/actions';

function App({ Component, pageProps }: AppProps) {
    const [showChild, setShowChild] = useState(false);
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [data, setData] = useState<any>();
    const { account }: any = useMetaMask();
    const { chainId } = useWeb3React();

    const dispatch = useDispatch();

    let auth = useSelector((state: any) => state.auth.user);
    let isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const chain = useMemo(() => getMarketDetailsByChainId(chainId), [chainId]);

    // const [play] = useSound("/static/rising-pops.mp3");
    const listOnlineUsers = () => {
        //@ts-ignore
        _io.on('USER_ONLINE', ({ onlineUsers }: any) => {
            dispatch(onlineUsersAction(onlineUsers));
            // console.log("onlineusers:-=-=", onlineUsers);
        });
    };

    useEffect(() => {
        if (auth && auth.userId) {
            listenSocket && listenSocket();
            //@ts-ignore
            _io.emit('USER_ONLINE', { user: auth.userId });
            listOnlineUsers();
        }
        return () => {
            _io.off(`${auth?.userId}:${CALLING}`);
            _io.off(`${auth?.userId}:${REJECTCALL}`);
        };
    }, [auth]);

    useEffect(() => {
        return () => {
            _io.off(`${auth?.userId}:${CALLING}`);
            _io.off(`${auth?.userId}:${REJECTCALL}`);
        };
    }, []);

    useEffect(() => {
        if (new Date().valueOf() < 1656964740000) {
            if (!localStorage?.token) {
                setPopup(true);
                setState(47);
            }
        }
    }, []);

    useEffect(() => {
        if (chain) {
            dispatch(getUSDTPrice());
            dispatch(getBNBPrice());
            dispatch(getETHPrice());
            dispatch(getLoobrPrice());
            dispatch(getMaticPrice());
            dispatch(getAvaxPrice());
            dispatch(getCurrencyRate(chain?.nativeCurrency));
        }
    }, [chain]);

    useEffect(() => {
        const data = {
            address: account
        };
        account && isAuthenticated && dispatch(createWallet(data));
    }, [account, dispatch, isAuthenticated]);

    const listenSocket = () => {
        _io.off(`${auth?.userId}:${CALLING}`);
        _io.on(`${auth?.userId}:${CALLING}`, (newdata: any) => {
            if (newdata?.type == 'INCOMING' && newdata.from != auth?.userId) {
                // setData(newdata);
                // setPopup(true);
                setData(newdata);

                setPopup(true);
                setState(72);
                // callPerson(newdata.roomId, false);
            }
        });

        _io.off(`${auth?.userId}:${REJECTCALL}`);
        _io.on(`${auth?.userId}:${REJECTCALL}`, (newdata: any) => {
            if (newdata.from != auth?.userId) {
                setState(-1);
                setPopup(false);
            }
        });
    };

    useEffect(() => {
        console.log('initialized');
        dispatch(getNftListing());
        dispatch(getIslandOwners());
        dispatch(getLands());
        dispatch(getTopOneIslandowners());
        dispatch(getTopLandowners());
        dispatch(getTopIslandowners());
        dispatch(getIslands());

        dispatch(getUSDTPrice());
        dispatch(getBNBPrice());
        dispatch(getETHPrice());
        dispatch(getLoobrPrice());
        dispatch(getMaticPrice());

        if (typeof window !== 'undefined' && localStorage?.token) {
            const token: any = localStorage.getItem('token');
            const decoded: any = jwt.decode(token);
            if (!decoded?.temp) {
                dispatch(getUser());
                dispatch({
                    type: CHANGE_AUTH_STATUS,
                    payload: true
                });
            }
        }
        setShowChild(true);
    }, []);

    useEffect(() => {
        account && dispatch(getMylands(account));
    }, [account]);
    // if (!showChild) {
    //     return null;
    // }

    // useEffect(() => {
    //     if (auth && auth.userId) {
    //         listenSocket();
    //     }
    // }, [auth]);

    return (
        <>
            <Layout>
                <DefaultSeo {...SEO} />
                <Component {...pageProps} />
                {auth && auth?.userId && <DirectChat />}
                <Cookies />
                <Popups show={popup} hide={setPopup} state={state} setstate={setState} data={data} setData={setData} />
            </Layout>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                draggable={false}
                closeOnClick
                pauseOnHover
            />
        </>
    );
}

export default App;
