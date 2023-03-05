import axios from 'axios';

export const generateFileUrl = async (body: any) => {
    try {
        let url = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/get-asset-url`, body);
        return url.data.data;
    } catch (error) {
        // console.log('Erroror=-=-=-', error);
        return '';
    }
};
export const uploadFile = async (file: any) => {
    try {
        var formdata = new FormData();
        formdata.append('file', file);
        formdata.append('upload_preset', process.env.NEXT_PUBLIC_YOUR_UNSIGNED_UPLOAD_PRESET);

        const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
            method: 'POST',
            body: formdata
        });
        const data: any = await res?.json();
        const url = data?.secure_url;
        return url;
    } catch (error) {
        // console.log('Erroror=-=-=-', error);
        return '';
    }
};
