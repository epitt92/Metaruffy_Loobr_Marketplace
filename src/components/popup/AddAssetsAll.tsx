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
const AddAssetsAll = ({ setstate, data, type, setVideo }: Iprops) => {
    return (
        <div className='w-[40.25rem] xs:w-[35rem] xs2:w-[30rem] xs3:w-[25rem] h-[47rem] '>
            <iframe
             scrolling="no"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="clipboard-read ; clipboard-write ; web-share ; accelerometer ; autoplay ; camera ; gyroscope ; payment ; geolocation *"
                src="https://flooz.trade/embed/on-ramp?padding=20&roundedCorners=10&backgroundColor=transparent&primaryColor=%23f1c84a&enabledProviders=MOONPAY%2CTRANSAK&tokenAddress=eth&network=eth&lightMode=false"></iframe>
        </div>
    );
};

export default AddAssetsAll;
