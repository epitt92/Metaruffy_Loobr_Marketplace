import React from 'react';
import { Rings } from 'react-loader-spinner';
import Loader from '../loader/Loader';

const TableLoader = ({ width, height }: any) => {
    return (
        <tr>
            <td className=" text-center  " colSpan={8}>
                <div className=" justify-center  flex">
                    <Loader />
                </div>
            </td>
        </tr>
    );
};

export default TableLoader;
