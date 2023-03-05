import React from 'react';
import ImageComponent from '../../components/Image/ImageComponent';
import VideoComponent from '../../components/video/videoComponent';
import Webgl from '../../components/Webgl';
import { NftContentType } from '../../utils/functions';

export default function detailContentView(nft: any, props?: any) {
    return <>{renderContentView(nft, props)}</>;
}

// ui views
const renderContentView = (nft: any, props?: any) => {
    switch (NftContentType(nft?.image, nft)) {
        case 'mp4':
            return (
                <VideoComponent
                    src={nft?.animation_url ? nft?.animation_url : nft.image}
                    ChildClass={props?.feed && 'h-[23.438rem]'}
                    ParentClass={props?.feed && 'true '}
                    figClassName="!bg-[#22222b]"
                    controls={props?.feed && 'controls'}
                />
            );
        case 'gif':
            return (
                <VideoComponent
                    src={nft.image}
                    fileType="gif"
                    ChildClass={props?.feed && 'h-[23.438rem]'}
                    ParentClass={props?.feed && 'true '}
                    figClassName="!bg-[#22222b]"
                    controls={props?.feed && 'controls'}
                />
            );
        case 'glb':
            return (
                <div className="bg-[#22222b]">
                    <div
                        className={`${
                            props?.feed ? 'h-[23.438rem] w-[23.438rem]' : 'h-[48.438rem] w-full'
                        }    gradient-weblg  mx-auto   !-z-50  `}>
                        <Webgl src={nft?.image} preview={nft?.preview} />
                    </div>
                </div>
            );
        default:
            return (
                <div className="!flex-shrink-0 bg-[#22222b]  flex justify-center">
                    <ImageComponent
                        className=""
                        src={nft?.image}
                        defaultPlaceholder={'/assets/images/default.png'}
                        {...(props?.layout !== 'fill' && { height: props?.height || 909, width: props?.width || 940 })}
                        objectFit={props?.objectFit || 'cover'}
                        layout={props?.layout}
                        alt=""
                        fileType={nft?.fileType}
                        quality={60}
                        figClassName={props?.figClassName}
                        blurEffect
                        nftData={nft}
                    />
                </div>
            );
    }
};
