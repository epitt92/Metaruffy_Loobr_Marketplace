import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
interface Iprops {
    setstate: Function;
    setImage?: Function;
    hide: any;
    data: any;
    type: any;
}
const CropImage = ({ setstate, data, type, setImage }: Iprops) => {
    const [result, setResult] = useState<any>(null);
    const cropperRef = useRef<HTMLImageElement>(null);
    const onCrop = () => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        setResult(cropper.getCroppedCanvas().toDataURL());
    };
    return (
        <div className="w-full sm:w-[50rem] md:w-[68.188rem] rounded-2xl p-6">
            <h3 className=" border border-b-[#2B2B35] border-transparent  text-white  py-6 ">Edit Media</h3>
            <div className=" w-full">
                <div>
                    <Cropper
                        src={data}
                        style={{ height: 500, width: '100%' }}
                        initialAspectRatio={type ? type : 1}
                        aspectRatio={type ? type : 1}
                        guides={true}
                        crop={onCrop}
                        ref={cropperRef}
                    />
                    {/* )} */}
                </div>
            </div>
            <Button
                className="mt-4"
                onClick={() => {
                    setImage && setImage(result);
                }}>
                Upload
            </Button>
        </div>
    );
};

export default CropImage;
