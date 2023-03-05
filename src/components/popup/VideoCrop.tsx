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
const CropVideo = ({ setstate, data, type, setVideo }: Iprops) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const onCropComplete = (val: any) => {
        console.log(val);
    };
    return (
        <div className="w-full sm:w-[50rem] md:w-[68.188rem] rounded-2xl p-6">
            <h3 className=" border border-b-[#2B2B35] border-transparent  text-white  py-6 ">Edit Media</h3>
            <div className=" w-full">
                <Cropper
                    video="https://vid.ly/5u4h3e?content=video"
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="controls" />
        </div>
    );
};

export default CropVideo;
