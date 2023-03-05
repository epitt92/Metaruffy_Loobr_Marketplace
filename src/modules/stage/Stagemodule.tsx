import React from 'react';
import Button from '../../components/Button/Button';
import Image from 'next/image';
import { Stagedata } from './stageData';
import Stage from '../../pages/stage';
import StagTabs from './Tabs';

const Stagemodule = () => {
    return (
        <div className=" xl:!px-52 container min-h-[800px]  ">
            <h2 className="text-white 5xl ">Stage</h2>
             <StagTabs/>
               
            
          
        </div>
    );
};

export default Stagemodule;
