import { message } from 'antd';
import { Row, Col, Select } from 'antd';
import { useEffect } from 'react';
import { Tooltip } from 'antd';
import { useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { SwiperSlide } from 'swiper/react';
import { ImageLoading } from '../../../components/ImageLoading.comonent';
import Loader from '../../../components/Loader';
import Slider from '../../../components/slider/slider';
import { EQueryKey } from '../../../enums';
import { EAudiroeiumType } from '../../../enums/Agora.enum';
import { ICollection, ICollectionItem } from '../../../interfaces';
import { IAuditorium } from '../../../interfaces/services.interface';
import { collectionService } from '../../../services/collection.service';
import { convertDataIntoRows, getImageURL } from '../../../shared';
import infoTooltipData from './ArtInfoTooltip';

import { AlphaPicker, HuePicker } from 'react-color';

interface IProps {
    showFullScreen: boolean;
    handleFullScreen: Function;
    auditorium: IAuditorium;
}

interface IOptions {
    value: string;
    label: string;
}
const { Option } = Select;

function AuditoriumGallery({ showFullScreen, handleFullScreen, auditorium }: IProps) {
    const ColorPicker = (
        <>
            <HuePicker />
            <AlphaPicker />
        </>
    );

    const [collectionId, setCollectionId] = useState('');
    const [collectionTitle, setCollectionTitle] = useState('');
    const [galleryArt, setGalleryArt] = useState<ICollectionItem | any>({});
    const [next, setNext] = useState(false);
    const limit = 12;

    // ---------- ALL COLLECTIONS
    const queryKey = ['userCollections', auditorium?.user?._id, { all: true }];
    const { data: allCollectionsData, isLoading: allCollectionLoading } = useQuery(
        queryKey,
        collectionService.userCollections,
        {
            enabled: Boolean(auditorium?.user?._id)
        }
    );

    useEffect(() => {
        setCollectionId(allCollectionsData?.data?.data?.collections[0]?.id);
        setCollectionTitle(allCollectionsData?.data?.data?.collections[0]?.title);
    }, [allCollectionLoading]);
    const allCollections = allCollectionsData?.data?.data?.collections;

    const getCollelectionOptions = allCollections
        ? allCollections.reduce((acc: Array<ICollection>, curr: ICollection): any => {
              return [...acc, { value: curr.id, label: curr.title }];
          }, [])
        : [];

    // --------- SINGLE COLLECTION DETAIL

    const queryKeyForSingleC = [EQueryKey.GET_COLLECTION, collectionId, limit];
    const {
        data: collectionData,
        fetchNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery(queryKeyForSingleC, collectionService.show, {
        getNextPageParam: (lastPage, pages) => {
            const Limit = lastPage.data?.data?.limit;
            const Data = lastPage.data?.data?.items;
            const isNext = Limit === Data.length;
            if (isNext !== next) {
                setNext(isNext);
            }
            // if (collectionUserData == null) {
            //     setCollectionData(lastPage?.data?.data?.collectionData[0]);
            //     setCollectionCount(lastPage?.data?.data?.count);
            // }
            return lastPage.data?.data?.page + 1;
        },
        onSettled: () => {
            message.destroy();
        },
        enabled: Boolean(collectionId)
    });

    useEffect(() => {
        setGalleryArt(collectionData?.pages[0]?.data?.data?.items[0]);
    }, [isLoading]);
    console.log({ galleryArt });

    return (
        <div className={`${showFullScreen ? 'AtAuditGalleryFScreen' : ''} AtAuditoriumGallery`}>
            <div className="AtAuditGalleryImage AtLeading0">
                {galleryArt?.url && (
                    <ImageLoading src={getImageURL(galleryArt.url)} blurEffect layout="fill" objectFit="contain" />
                )}

                <ul className="AtAuditGalleryControls">
                    <li>
                        <div className="AtBtnPaint AtBtnGrey AtBtnSquareSmall">
                            <Tooltip title={ColorPicker} overlayClassName="AtArtInfo">
                                <i className="icon-paint"></i>
                            </Tooltip>
                        </div>
                    </li>
                    <li>
                        <div className="AtActive AtBtnGrey AtBtnSquareSmall">
                            <Tooltip title={infoTooltipData(galleryArt)} overlayClassName="AtArtInfo">
                                <i className="icon-info"></i>
                            </Tooltip>
                        </div>
                    </li>
                    <li>
                        <div className="AtActive AtBtnGrey AtBtnSquareSmall" onClick={(e) => handleFullScreen(e)}>
                            <i className="icon-maximize"></i>
                        </div>
                    </li>
                </ul>
            </div>

            <Row className="AtMt10" gutter={[{ sm: 10, md: 15, xl: 20, xxl: 30 }, 0]}>
                <Col span={24} xs={24} lg={8}>
                    <div className="AtFormGroup AtMt0">
                        <label>Collections</label>
                        <Select
                            className="AtSelect AtFormSelect AtCollectionSelect"
                            value={collectionTitle || 'Select Collection'}
                            name="collection"
                            suffixIcon={<i className="icon-arrow-down"></i>}
                            onSelect={(e: any) => {
                                const selectedAud = getCollelectionOptions.filter((x: any) => {
                                    return x.value == e;
                                });
                                setCollectionId(selectedAud[0].value);
                                setCollectionTitle(selectedAud[0].label);
                            }}>
                            {getCollelectionOptions.length > 0 &&
                                getCollelectionOptions.map((item: IOptions): any => {
                                    return (
                                        <Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </div>
                </Col>
                <Col span={24} xs={24} lg={16}>
                    <div className="AtArtDetailSlides">
                        {isLoading ? (
                            <Loader height={'5rem'} />
                        ) : (
                            <Slider
                                showsPagination={false}
                                spaceBetween={8}
                                slidesPerView={7}
                                loop={false}
                                onReachEnd={() => {
                                    next && fetchNextPage();
                                }}
                                breakpoint={{
                                    0: {
                                        slidesPerView: 3
                                    },
                                    420: {
                                        slidesPerView: 5
                                    },
                                    991: {
                                        slidesPerView: 6
                                    },
                                    1199: {
                                        slidesPerView: 7
                                    }
                                }}>
                                {isLoading ||
                                    collectionData?.pages.map((group) => {
                                        const EventsData = group?.data?.data?.items;
                                        const rowsData = convertDataIntoRows(EventsData, 4);
                                        return rowsData.map((row: any, i: any) => {
                                            return (
                                                <Row
                                                    gutter={[{ sm: 10, md: 15, xxl: 30 }, 30]}
                                                    className="AtMb8"
                                                    key={i}>
                                                    {row.map((item: any, i: number) => {
                                                        return (
                                                            <SwiperSlide
                                                                className={
                                                                    galleryArt?.url == item?.url
                                                                        ? 'AtArtDetailSelected'
                                                                        : ''
                                                                }
                                                                onClick={() => setGalleryArt(item)}
                                                                key={i}>
                                                                <div className="AtImgHolder AtPointer">
                                                                    <ImageLoading
                                                                        src={getImageURL(item?.url, 30)}
                                                                        width={108}
                                                                        height={125}
                                                                        objectFit="cover"
                                                                        blurEffect
                                                                    />
                                                                </div>
                                                            </SwiperSlide>
                                                        );
                                                    })}
                                                </Row>
                                            );
                                        });
                                    })}
                            </Slider>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default AuditoriumGallery;
