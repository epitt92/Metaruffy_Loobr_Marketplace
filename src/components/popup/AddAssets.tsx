import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import Cropper from 'react-easy-crop';
import 'cropperjs/dist/cropper.css';
interface Iprops {
    setstate?: Function;
    setVideo?: Function;
    hide?: any;
    data?: any;
    type?: any;
}
const AddAssets = ({ setstate, data, type, setVideo }: Iprops) => {
    return (
        <div className='w-[40.25rem] xs:w-[35rem] xs2:w-[30rem] xs3:w-[25rem] h-[52rem]  py-8  '>
            <iframe
             className=''
             scrolling="no"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="clipboard-read ; clipboard-write ; web-share ; accelerometer ; autoplay ; camera ; gyroscope ; payment ; geolocation *"
                src="https://flooz.trade/embed/swap/0xa4Cb3ef5f41a4D89D6FCed22ea8a1C57957629Aa?padding=20&roundedCorners=10&backgroundColor=transparent&primaryColor=%23f1c84a&network=eth&refId=TfV5Vs"></iframe>
        </div>
    );
};

export default AddAssets;
