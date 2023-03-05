import React from 'react'
import ImageComponent from '../../../../components/Image/ImageComponent';
import VideoComponent from '../../../../components/video/videoComponent';
import { TRANSFORMATION_NAMES } from '../../../../constants/enums';
import { NftContentType } from '../../../../utils/functions';

export default function SmallContentView({ nft, dimentions }: any) {
    return (
        <div>{renderContentView(nft, dimentions)}</div>
    )
}


// ui views
const renderContentView = (nft: any, dimentions?: any) => {
    switch (NftContentType(nft?.image, nft)) {
        case 'mp4':
            return (
                <VideoComponent src={nft?.animation_url ? nft?.animation_url : nft?.image} className='object-cover' figClassName='!h-[5.125rem]' />
            );
        case 'gif':
            return (
                <VideoComponent src={nft?.image} fileType={'gif'} className='object-cover' figClassName='!h-[5.125rem] w-full' />
            );
        case 'glb':
            return (
                <ImageComponent
                    src={nft?.preview}
                    className="rounded-md bg-[#c9cdd3] "
                    defaultPlaceholder={'/assets/images/placeholder1.png'}
                    // width={dimentions?.w || 82}
                    // height={dimentions?.h || 82}
                    objectFit='cover'
                    layout={'fill'}
                    figClassName={`h-[80px] w-[80px] relative `}

                    // figClassName={`h-[${dimentions?.h || 82}px] w-[${dimentions?.w || 82}]px  relative`}
                    transformation={dimentions ? TRANSFORMATION_NAMES.fit_50x50 : TRANSFORMATION_NAMES.fit_80x80}
                />
            );
        default:
            return (
                <ImageComponent
                    src={nft?.image}
                    fileType={nft?.fileType}
                    className="rounded-md bg-[#c9cdd3] "
                    defaultPlaceholder={'/assets/images/placeholder1.png'}
                    // width={dimentions?.w || 82}
                    // height={dimentions?.h || 82}
                    objectFit='cover'
                    layout={'fill'}
                    figClassName={`h-[80px] w-[80px] relative `}

                    transformation={dimentions ? TRANSFORMATION_NAMES.fit_50x50 : TRANSFORMATION_NAMES.fit_80x80}
                />
            );
    }
};