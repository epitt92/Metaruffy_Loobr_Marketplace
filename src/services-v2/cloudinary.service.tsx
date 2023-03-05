
import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality as qualityFn } from "@cloudinary/url-gen/actions/delivery";
import { name } from "@cloudinary/url-gen/actions/namedTransformation";
import { fill, scale } from "@cloudinary/url-gen/actions/resize";
import { gif, videoMp4 } from "@cloudinary/url-gen/qualifiers/format";

interface IOptmizeProps {
    src: string,
    width?: string | number,
    height?: string | number,
    resize?: boolean,
    quality?: string | number,
    transformation?: string,
    fileType?: string
    objectFit?: string
}
class CloudinaryService {

    public cld

    constructor() {

        // Create and configure your Cloudinary instance.
        this.cld = new Cloudinary({
            cloud: {
                cloudName: process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME
            }
        });
    }

    // get image by public id
    public getImageByPublicId(src: string) {
        return this.cld.image(src);
    }

    // optimize image
    optimizeImageURL({ src, width, height, resize = false, quality = 'auto', transformation, fileType, objectFit }: IOptmizeProps) {
        // if (src?.includes('/assets') || src?.includes('infura')) {
        //     return src
        // }
        if (!src) return src
        if (fileType && fileType == 'gif') {
            return this.cld.image(src).delivery(format(gif()).lossy())
                .delivery(qualityFn(30)).setDeliveryType("fetch").setAssetType("image").toURL();
        }
        if (transformation) {
            return this.cld.image(src).setDeliveryType("fetch").namedTransformation(name(transformation)).toURL()
        }
        if (resize && width && height && objectFit !== 'contain') {
            return this.cld.image(src).setDeliveryType("fetch").resize(fill().width(width).height(height)).delivery(qualityFn(quality)).toURL()
        } else {
            return this.cld.image(src).setDeliveryType("fetch").delivery(qualityFn(quality)).toURL()
        }
    }

    // optimize image
    optimizeVideoURL({ src, width, resize = true, fileType }: IOptmizeProps) {
        // if (src?.includes('/assets') || src?.includes('infura')) {
        //     return src
        // }
        if (fileType && fileType == 'gif') {
            return this.cld.video(src).delivery(format(videoMp4()))
                .setDeliveryType("fetch")
                .setAssetType("image").toURL();
        }
        else if (resize && width) {
            return this.cld.video(src).resize(scale().width(width)).setDeliveryType('fetch')
        } else {
            return this.cld.video(src)
        }
    }


}

export const cloudinaryService = new CloudinaryService()