import React from 'react';

type Props = {
    data?: any;
    onSelect?: Function | any;
    selected?: any;
};

const SelectBlockchain = ({ selected, data, onSelect }: Props) => {
    return (
        <div className="flex flex-shrink-0 gap-2 ">
            <div
                className={`w-[42px] cursor-pointer  h-[42px] border border-transparent flex items-center justify-center rounded-lg relative sm:hover:border-themecolor ${
                    selected === 0 ? 'border-themecolor' : ''
                } `}
                // ${!(i == 0 || i == 1) ? 'pointer-events-none' : ''}
                // disabled={!(i == 0 || i == 1)}
                onClick={() => onSelect(0)}>
                <span className="Atpricehover  font-Proxima-Regular whitespace-nowrap"></span>
                <i>ALL</i>
            </div>
            {data?.map((item: any, i: number) => (
                <div
                    className={`w-[42px] cursor-pointer  h-[42px] border border-transparent flex items-center justify-center rounded-lg relative sm:hover:border-themecolor ${
                        item.name === selected?.name ? 'border-themecolor' : ''
                    }${i == 4 || i == 5 ? 'pointer-events-none' : ''}  `}
                    // ${!(i == 0 || i == 1) ? 'pointer-events-none' : ''}
                    // disabled={!(i == 0 || i == 1)}
                    onClick={() => onSelect(item)}
                    key={i}>
                    <span className="Atpricehover  font-Proxima-Regular whitespace-nowrap">{item?.name}</span>
                    <i>{item?.tagname}</i>
                </div>
            ))}
        </div>
    );
};

export default SelectBlockchain;
