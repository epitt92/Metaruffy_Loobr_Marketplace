import React from 'react';

interface Iprops {
    className: string;
    value: string;
    dec: string;
}

const ExternalCollectionValue = ({ className, value, dec }: Iprops) => {
    return (
        <div
            className={`inline-flex items-center justify-center flex-col px-4 py-5 border border-[#313146]  ${className}`}>
            <h6 className="text-lg text-themecolor">{value}</h6>
            <p className="text-sm">{dec}</p>
        </div>
    );
};

export default ExternalCollectionValue;
