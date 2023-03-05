import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Popups from '../popup/poups';

interface Iprops {
    isLoggedIn?: boolean;
}

const withAuth = (Component: any) => {
    const Auth = (props: Iprops) => {
        // Login data added to props via redux-store (or use react context for example)
        const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
        const user = useSelector((state: any) => state.auth.user);
        const [popup, setPopup] = useState(false);
        const [state, setState] = useState(-1);

        useEffect(() => {
            if (!isAuthenticated) {
                setPopup(true);
                setState(1);
            } else if (user && !user?.isEmailVerified) {
                setPopup(true);
                setState(36);
            }
        }, [isAuthenticated, user]);

        // If user is not logged in, return login component
        // if (!isAuthenticated) {
        //     return (
        //         <Popups
        //             show={popup}
        //             hide={setPopup}
        //             state={state}
        //             setstate={setState}
        //             data="data"
        //         />
        //     );

        //     // return (
        //     //   <Login />
        //     // );
        // }

        // If user is logged in, return original component
        return (
            <>
                <Component {...props} />
                {state && (
                    <Popups
                        show={popup}
                        hide={setPopup}
                        state={state}
                        setstate={setState}
                        data={{ email: user?.email }}
                    />
                )}
            </>
        );
    };

    // Copy getInitial props so it will run as well
    if (Component.getInitialProps) {
        Auth.getInitialProps = Component.getInitialProps;
    }

    return Auth;
};

export default withAuth;
