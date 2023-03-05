import React from 'react';
import Search from '../../components-v2/forms/Search';
import Avalanche from '../../components/icons/AvalancheIcon';
import BscIcon from '../../components/icons/BscIcon';
import EthIcon from '../../components/icons/EthIcon';
import PolygonIcon from '../../components/icons/PolygonIcon';
import Table from './component-v2/Table';

const Prov2 = () => {
    return (
        <div className="container my-16 min-h-[30rem]">
            <div className="mb-4 md:flex items-center gap-8">
                <Search className="w-[20rem]" />
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <p className="text-[12px] font-Proxima-Bold">ALL</p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <EthIcon className="h-6 w-6 flex-shrink-0" />
                            <p className="text-[12px] font-Proxima-Bold">Ethereum</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <BscIcon className="h-6 w-6 flex-shrink-0" />
                            <p className="text-[12px] font-Proxima-Bold">BNB Chain</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <PolygonIcon className="h-6 w-6 flex-shrink-0" />
                            <p className="text-[12px] font-Proxima-Bold">Polygon</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Avalanche className="h-6 w-6 flex-shrink-0" />
                            <p className="text-[12px] font-Proxima-Bold">Avalanche</p>
                        </div>
                    </div>
                </div>
            </div>
            <Table />
        </div>
    );
};

export default Prov2;
