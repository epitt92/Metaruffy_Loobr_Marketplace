import React from 'react';

const EthIcon = ({className}:any) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" className={`${className?className:""}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                fill="#627EEA"
            />
            <path d="M12.374 3V9.65234L17.9966 12.1649L12.374 3Z" fill="white" fillOpacity="0.6" />
            <path d="M12.3736 3L6.75 12.1649L12.3736 9.65234V3Z" fill="white" />
            <path d="M12.374 16.4758V20.9961L18.0002 13.2119L12.374 16.4758Z" fill="white" fillOpacity="0.6" />
            <path d="M12.3736 20.9961V16.4751L6.75 13.2119L12.3736 20.9961Z" fill="white" />
            <path d="M12.374 15.4301L17.9966 12.1652L12.374 9.6543V15.4301Z" fill="white" fillOpacity="0.2" />
            <path d="M6.75 12.1652L12.3736 15.4301V9.6543L6.75 12.1652Z" fill="white" fillOpacity="0.6" />
        </svg>
    );
};

export default EthIcon;
