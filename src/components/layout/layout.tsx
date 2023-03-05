import React from 'react';
import Footer from '../Footer/Footer';
import { useRouter } from 'next/router';
import Header from '../../components-v2/header/Header';

const Layout = ({ children }: any) => {
    const router = useRouter();

    return (
        <div className={`relative bg-[#14141F] ${router.pathname === '/landmap' ? '' : 'zoomfull'}`}>
            <Header/>
            {children}
            {router.pathname === '/messagechatview' ||
            router.pathname === '/mobileviewchat' ||
            router.pathname === '/landmap' ? (
                ''
            ) : (
                <Footer />
            )}
        </div>
    );
};

export default Layout;
