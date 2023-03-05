/* eslint-disable react/no-unescaped-entities */
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/map.css';
import '../styles/globals.css';
import '../public/assets/css/icomoon.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { setAuthToken } from '../src/utils';
import jwt from 'jsonwebtoken';
import { store } from '../src/redux/store';
import { Web3ReactProvider } from '@web3-react/core';
import { MetaMaskProvider } from '../src/hooks/useMetaMask';
import { Web3Provider } from '@ethersproject/providers';
import { _io } from '../src/services/socket.service';
import App from '../src/components/App';
import { Router, useRouter } from 'next/router';
import NProgress from 'nprogress';
import { logout } from '../src/redux/auth/actions';
import { toast } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

function getLibrary(provider: any, connector: any) {
    return new Web3Provider(provider, 'any');
}
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        Router.events.on('routeChangeStart', (url) => {
            NProgress.start();
        });
        Router.events.on('routeChangeComplete', (url) => {
            NProgress.done();
        });
        Router.events.on('routeChangeError', (url) => {
            NProgress.done();
        });
        return () => {};
    }, []);

    const { query, replace } = useRouter();

    useEffect(() => {
        if (localStorage?.token) {
            const token: any = localStorage.getItem('token');
            setAuthToken(token);
            const decoded: any = jwt.decode(token);
            const currentTime = Date.now() / 1000;

            if (decoded?.exp < currentTime) {
                localStorage?.clear();
            }
        }
    }, []);

    useEffect(() => {
        if (query?.stageLogoutRedirect) {
            store.dispatch(logout());
            replace('/');
        } else if (query?.stageRedirectError) {
            toast.error(`Oops , can't authenticate you on Loobr Stage`);
            replace('/');
        }
    }, [query]);

    useEffect(() => {
        setShowChild(true);

        return () => {
            _io.removeAllListeners();
        };
    }, []);

    return (
        <>
            <Head>
                <meta name="google-site-verification" content="7-usXfEdbRbN1Qqas5xpqhBbeq68Ak1FusSYHTcEWLs" />
                {/* <!-- Smartsupp Live Chat script --> */}
                <script async src="https://cdn.veriff.me/sdk/js/1.1/veriff.min.js"></script>
                {/* <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.Userback = window.Userback || {};
              Userback.access_token = '34205|68981|feFBHSwBx7PTI5EUihPEBFcWu';
              (function(d) {
                  var s = d.createElement('script');s.async = true;
                  s.src = 'https://static.userback.io/widget/v1.js';
                  (d.head || d.body).appendChild(s);
              })(document);`
                    }}
                /> */}

                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-232339487-1" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-232339487-1', { page_path: window.location.pathname });
            `
                    }}
                />

                {/* <!-- Google Tag Manager --> */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],

              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=

              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);

              })(window,document,'script','dataLayer','GTM-P2PSW2T');
            `
                    }}
                />
                {/* <!-- End Google Tag Manager --> */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                    integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </Head>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {/* <PersistGate loading={null} persistor={persistor}> */}
                    <Web3ReactProvider getLibrary={getLibrary}>
                        <MetaMaskProvider>
                            {/*
                            // @ts-ignore */}
                            <App pageProps={pageProps} Component={Component} />
                        </MetaMaskProvider>
                    </Web3ReactProvider>
                    {/* </PersistGate> */}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </Provider>
        </>
    );
}

export default MyApp;
