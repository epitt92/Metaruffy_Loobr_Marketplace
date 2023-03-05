import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Stage, Layer, Star, Text, Image as KonvaImage, Rect, Line } from 'react-konva';
import axios from 'axios';

import useMetaMask from '../../hooks/useMetaMask';
import { useDispatch, useSelector } from 'react-redux';

const backgroundURI = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/upload/f_auto/v1675975106/bb5a359qars2gagly4jd.jpg`;
const treesURI = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_YOUR_CLOUD_NAME}/image/upload/f_auto/v1675975353/osba4oz82vpwvjkgeac2.png`;
const mylandsURI = '/images/mylands-pin.svg';
const listingsURI = '/images/listings-pin.svg';
const selectedURI = '/images/selected-pin.svg';
const BACKEND_URL = process.env.NEXT_PUBLIC_MAP_API_URL;

interface Iprops {
    selBlock: any;
    setSelBlock: Function;
    initX: number;
    initY: number;
    showMyland: boolean;
    showMinted: boolean;
    showListed: boolean;
    searchQry: number;
}

let lastCenter: any = null;
let lastDist = 0;

const MapComponent = ({
    selBlock,
    setSelBlock,
    initX,
    initY,
    showMinted,
    showMyland,
    showListed,
    searchQry
}: Iprops) => {
    const stageRef = useRef(null);
    const mapRef = useRef(null);

    // Blockchain
    const { account }: any = useMetaMask();
    const plots = useSelector((state: any) => state.landmap.lands);
    const islands = useSelector((state: any) => state.landmap.islands);
    const listings = useSelector((state: any) => state.landmap.listings);

    const dispatch = useDispatch();
    // Layers
    const [isTreeVis, setTreeVisible] = useState(true);

    // Get NFT data from database
    const [myPlots, setMyPlots] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [scaleBy, setScaleBy] = useState(1);
    const [mapScale, setMapScale] = useState(20);
    const [stroke, setStroke] = useState(0.05);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const [mapWidth, setMapWidth] = useState(1000);
    const [mapHeight, setMapHeight] = useState(675);
    const [stageWidth, setStageWidth] = useState(1000);
    const [stageHeight, setStageHeight] = useState(675);
    const [blockSnapSize, setBlockSnapSize] = useState(1);

    // Combining estate
    const [selCombinePlots, setSelCombinePlots] = useState([]);
    const [isCombinePlots, setCombinePlots] = useState(false);

    //Grid List
    let [gridList, setGridList] = useState<JSX.Element[]>();

    //  height, setDragging
    const [isDraggable, setDragging] = useState(true);
    const [isClicked, setIsClicked] = useState(false);

    const zoomIn = () => {
        zoomHandler(1);
    };

    const zoomOut = () => {
        zoomHandler(-1);
    };

    useEffect(() => {
        if (!searchQry) return;
        setMapScale(10);
        let lsearchX = 0;
        let lsearchY = 0;
        plots &&
            Object.keys(plots).map((key, index) => {
                if (plots[key]['landID'] === searchQry) {
                    lsearchX = plots[key]['posX'];
                    lsearchY = plots[key]['posY'];
                    setSelBlock(plots[key]);
                }
            });

        let newOffsetX = -1 * lsearchX * blockSnapSize * mapScale + mapWidth / 2;
        let newOffsetY = -1 * lsearchY * blockSnapSize * mapScale + mapHeight / 2;

        newOffsetX = Math.min(0, newOffsetX);
        newOffsetY = Math.min(0, newOffsetY);

        newOffsetX = Math.max(newOffsetX, mapWidth - stageWidth * mapScale);
        newOffsetY = Math.max(newOffsetY, mapHeight - stageHeight * mapScale);

        setOffsetX(Math.floor(newOffsetX));
        setOffsetY(Math.floor(newOffsetY));
    }, [searchQry]);

    useEffect(() => {
        setOffsetX(Math.floor(initX));
        setOffsetY(Math.floor(initY));
    }, [initX, initY]);

    const mouseWheelZoom = (e: any) => {
        e.evt.preventDefault();

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? -1 : 1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }
        zoomHandler(direction);
    };

    const zoomHandler = (direction: number) => {
        let stage = stageRef.current as any;
        let oldScale = stage.scaleX();
        let pointer = stage.getPointerPosition();
        let mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale
        };
        let newScale2 = direction > 0 ? oldScale + scaleBy : oldScale - scaleBy;
        let posX = pointer.x - mousePointTo.x * newScale2;
        let posY = pointer.y - mousePointTo.y * newScale2;
        if (!(stageHeight * newScale2 > mapHeight && stageWidth * newScale2 > mapWidth)) {
            newScale2 = Math.max(mapWidth / stageWidth, mapHeight / stageHeight);
        }
        stage.scale({ x: newScale2, y: newScale2 });

        if (posY > 0) {
            posY = 0;
        }
        if (posX > 0) {
            posX = 0;
        }

        if (posY < mapHeight - stageHeight * newScale2) {
            posY = mapHeight - stageHeight * newScale2;
        }

        if (posX < mapWidth - stageWidth * newScale2) {
            posX = mapWidth - stageWidth * newScale2;
        }

        let position = {
            x: posX,
            y: posY
        };
        stage.position(position);
        setMapScale(newScale2);
        setOffsetX(Math.floor(posX));
        setOffsetY(Math.floor(posY));
    };

    function getDistance(p1: any, p2: any) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    function getCenter(p1: any, p2: any) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
    }

    const onLandClickHandler = async (stage: any) => {
        let relativePosition = stage?.getRelativePointerPosition();
        let parcelPosition = {
            parcelX: Math.floor((relativePosition?.x as number) / blockSnapSize),
            parcelY: Math.floor((relativePosition?.y as number) / blockSnapSize)
        };
        let tx = parcelPosition.parcelX;
        let ty = parcelPosition.parcelY;
        if (plots) {
            setSelBlock(plots[`${tx}_${ty}`]);
            // let selPos = Object.keys(plots).filter(
            //     (val, idx) =>
            //         plots[val]['posX'] <= tx &&
            //         plots[val]['posY'] <= ty &&
            //         plots[val]['posX'] + plots[val]['width'] > tx &&
            //         plots[val]['posY'] + plots[val]['height'] > ty
            // );
            // if (selPos.length !== 0) {
            //     let mPlot = plots[selPos[0]];
            //     if (isCombinePlots === true) {
            //         if (mPlot['owner'] === account.toUpperCase()) {
            //             let mCombinePlots = selCombinePlots;
            //             // if (!mCombinePlots.includes(mPlot)) {
            //             //     //checking weather array contain the id
            //             //     mCombinePlots.push(mPlot); //adding to array because value doesnt exists
            //             // } else {
            //             //     mCombinePlots.splice(mCombinePlots.indexOf(mPlot), 1); //deleting
            //             // }
            //             setSelCombinePlots([...mCombinePlots]);
            //         }
            //     } else {
            //         setSelBlock(mPlot);
            //     }
            // } else {
            //     setSelBlock(null);
            // }
        }
    };
    function handleTouchStart(e: any) {
        if (e.evt.touches.length === 1) {
            setIsClicked(true);
        } else {
            setIsClicked(false);
        }
    }
    function handleTouch(e: any) {
        e.evt.preventDefault();
        var touch1 = e.evt.touches[0];
        var touch2 = e.evt.touches[1];
        const stage = stageRef.current as any;
        setIsClicked(false);
        if (stage !== null) {
            if (touch1 && touch2) {
                setDragging(false);
                stage?.stopDrag();
                if (stage?.isDragging()) {
                    stage?.stopDrag();
                }

                var p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY
                };
                var p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY
                };

                if (!lastCenter) {
                    lastCenter = getCenter(p1, p2);
                    return;
                }
                var newCenter = getCenter(p1, p2);

                var dist = getDistance(p1, p2);

                let direction = 0;
                if (!lastDist) {
                    if (lastDist > dist) {
                        direction = -1;
                    } else if (lastDist > dist) {
                        direction = 1;
                    } else {
                        direction = 0;
                    }
                    lastDist = dist;
                }

                // local coordinates of center point
                var pointTo = {
                    x: (newCenter.x - stage.x()) / stage.scaleX(),
                    y: (newCenter.y - stage.y()) / stage.scaleX()
                };

                var scale = stage.scaleX() * (dist / lastDist);

                // calculate new position of the stage
                var dx = newCenter.x - lastCenter.x;
                var dy = newCenter.y - lastCenter.y;

                let posX = newCenter.x - pointTo.x * scale + dx;
                let posY = newCenter.y - pointTo.y * scale + dy;

                if (!(stageHeight * scale > mapHeight && stageWidth * scale > mapWidth)) {
                    scale = mapWidth / stageWidth;
                }
                stage.scale({ x: scale, y: scale });

                if (posY > 0) {
                    posY = 0;
                }
                if (posX > 0) {
                    posX = 0;
                }

                if (posY < mapHeight - stageHeight * scale) {
                    posY = mapHeight - stageHeight * scale;
                }

                if (posX < mapWidth - stageWidth * scale) {
                    posX = mapWidth - stageWidth * scale;
                }

                let position = {
                    x: posX,
                    y: posY
                };
                stage.position(position);
                setMapScale(scale);
                setOffsetX(Math.floor(posX));
                setOffsetY(Math.floor(posY));
                lastDist = dist;
                lastCenter = newCenter;
            }
        }
    }

    function handleTouchEnd(e: any) {
        e.evt.preventDefault();
        lastDist = 0;
        lastCenter = null;
        isClicked && onLandClickHandler(e.target.getStage());
        setIsClicked(false);
        setDragging(true);
    }
    const dragBound = (
        pos: any,
        mapWidth: any,
        mapHeight: any,
        stageWidth: any,
        stageHeight: any,
        originScale: any,
        setDragging: any
    ) => {
        setDragging(true);
        if (pos.y > 0) {
            pos.y = 0;
        }
        if (pos.x > 0) {
            pos.x = 0;
        }

        if (pos.y < mapHeight - stageHeight * originScale) {
            pos.y = mapHeight - stageHeight * originScale;
        }

        if (pos.x < mapWidth - stageWidth * originScale) {
            pos.x = mapWidth - stageWidth * originScale;
        }

        setOffsetX(Math.floor(pos.x));
        setOffsetY(Math.floor(pos.y));
        return pos;
    };

    const generateImage = (url: string, flag?: boolean) => {
        const temp = url.split('upload');
        const optUrl = temp.join(`upload${flag ? '/w_1000' : `/w_50`}`);
        //res.cloudinary.com/demo/image/upload/turtles.jpg
        const imageNft = new window.Image();
        imageNft.src = optUrl;
        return imageNft;
    };

    // Combine plots to estate
    const combinePlots = () => {
        if (isCombinePlots === false) {
            setCombinePlots(true);
            setSelBlock(null);
        } else {
            let minX = Math.min(...selCombinePlots.map((item) => item['posX']));
            let minY = Math.min(...selCombinePlots.map((item) => item['posY']));
            let maxX = Math.max(...selCombinePlots.map((item) => item['posX']));
            let maxY = Math.max(...selCombinePlots.map((item) => item['posY']));
            let width = maxX - minX + 1;
            let height = maxY - minY + 1;
            if (width * height === selCombinePlots.length) {
                let data = {
                    posX: minX,
                    posY: minY,
                    width,
                    height,
                    status: selCombinePlots[0]['status'],
                    island: selCombinePlots[0]['island'],
                    owner: account
                };
                axios.post(`${BACKEND_URL}/api/nfts`, data).then((response) => {
                    // setImgNFTs(null)
                });
            } else {
            }
            setSelCombinePlots([]);
            setCombinePlots(false);
        }
    };

    const spliteEstate = () => {
        axios.post(`${BACKEND_URL}/api/nfts/splite`, selBlock).then((response) => {});
    };

    useEffect(() => {
        islands &&
            selBlock &&
            Object.keys(islands).map((key, index) => {
                islands[key]['id'] === selBlock['id'] && setSelBlock(islands[key]);
            });
    }, [islands]);

    const initialize = async () => {
        setMapWidth((mapRef.current as any).offsetWidth);
        setMapHeight(
            window.innerWidth > 500
                ? Math.floor(((mapRef.current as any).offsetWidth * 675) / 1000)
                : window.innerHeight - 220
        );
    };
    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        account && axios.get(`${BACKEND_URL}/api/nfts/${account.toUpperCase()}`).then((res) => setMyPlots(res.data));
    }, [account]);

    useEffect(() => {
        if (stageWidth > 0 && stageHeight > 0) {
            let padding = 0;

            let tmpGridList = [];
            for (let i = 0; i < stageWidth / blockSnapSize; i++) {
                tmpGridList.push(
                    <Line
                        key={'row' + i}
                        points={[Math.round(i * blockSnapSize), 0, Math.round(i * blockSnapSize), stageHeight]}
                        stroke={'#ddd'}
                        strokeWidth={stroke}
                    />
                );
            }
            for (let j = 0; j < stageHeight / blockSnapSize; j++) {
                tmpGridList.push(
                    <Line
                        key={'column' + j}
                        points={[0, Math.round(j * blockSnapSize), stageWidth, Math.round(j * blockSnapSize)]}
                        stroke={'#ddd'}
                        strokeWidth={stroke}
                    />
                );
            }

            setGridList(tmpGridList);
        } else {
            setGridList([<></>]);
        }
    }, [stageWidth, stageHeight]);

    const omitAddress = (addr: string) => {
        return addr.substring(0, 4) + '...' + addr.substr(-4);
    };
    return (
        <div className="mappage border-0">
            <div className="main-content">
                {isLoading === false ? (
                    <div className="map border-0 sm:border-4 rounded-none sm:rounded-lg" ref={mapRef}>
                        <div className={`${window.innerWidth < 500 ? 'hidden' : 'hidden'} btnWrap`}>
                            <button className="btnZoom" onClick={zoomIn}>
                                +
                            </button>
                            <button className="btnZoom" onClick={zoomOut}>
                                -
                            </button>
                        </div>

                        <Stage
                            ref={stageRef}
                            width={mapWidth}
                            height={mapHeight}
                            scaleX={mapScale}
                            scaleY={mapScale}
                            x={offsetX}
                            y={offsetY}
                            draggable={isDraggable}
                            style={{ touchAction: 'pan-x pan-y' }}
                            pinchToZoomEnabled={true}
                            onMouseUp={(e) => {
                                e.evt.preventDefault();
                            }}
                            onMouseOver={(e) => {
                                e.evt.preventDefault();
                            }}
                            onMouseMove={(e) => {
                                e.evt.preventDefault();
                            }}
                            onWheel={(e) => {
                                mouseWheelZoom(e);
                            }}
                            dragBoundFunc={(position) => {
                                return dragBound(
                                    position,
                                    mapWidth,
                                    mapHeight,
                                    stageWidth,
                                    stageHeight,
                                    mapScale,
                                    setDragging
                                );
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouch}
                            onTouchEnd={handleTouchEnd}
                            perfectDrawEnabled={false}
                            onClick={(e) => onLandClickHandler(e.target.getStage())}>
                            <Layer>
                                {/* <KonvaImage
                                    perfectDrawEnabled={false}
                                    image={generateImage(backgroundURI, true)}
                                    x={0}
                                    y={0}
                                    // x={Math.floor((-1 * offsetX) / mapScale)}
                                    // y={Math.floor((-1 * offsetY) / mapScale)}
                                    // crop={{
                                    //     x: Math.floor((-1 * offsetX) / mapScale),
                                    //     y: Math.floor((-1 * offsetY) / mapScale),
                                    //     width: Math.floor((mapWidth * blockSnapSize) / mapScale),
                                    //     height: Math.floor((mapHeight * blockSnapSize) / mapScale)
                                    // }}
                                /> */}
                                <KonvaImage
                                    perfectDrawEnabled={false}
                                    image={generateImage(backgroundURI, true)}
                                    x={0}
                                    y={0}
                                    visible={isTreeVis}
                                />
                                <KonvaImage
                                    perfectDrawEnabled={false}
                                    image={generateImage(treesURI, true)}
                                    x={0}
                                    y={0}
                                    visible={isTreeVis}
                                />
                                {gridList}
                                {showMinted && plots !== null ? (
                                    Object.keys(plots).map((key, index) => {
                                        if (
                                            plots[key]['posX'] * mapScale * blockSnapSize > offsetX * -1 &&
                                            plots[key]['posY'] * mapScale * blockSnapSize > offsetY * -1 &&
                                            plots[key]['posX'] * mapScale * blockSnapSize < offsetX * -1 + mapWidth &&
                                            plots[key]['posY'] * mapScale * blockSnapSize < offsetY * -1 + mapHeight
                                        ) {
                                            return plots[key]?.logo ? (
                                                <KonvaImage
                                                    perfectDrawEnabled={false}
                                                    image={generateImage(plots[key]?.logo)}
                                                    key={index}
                                                    x={plots[key]['posX'] * blockSnapSize}
                                                    y={plots[key]['posY'] * blockSnapSize}
                                                    width={blockSnapSize}
                                                    height={blockSnapSize}
                                                />
                                            ) : (
                                                <Rect
                                                    perfectDrawEnabled={false}
                                                    key={index}
                                                    x={plots[key]['posX'] * blockSnapSize}
                                                    y={plots[key]['posY'] * blockSnapSize}
                                                    width={blockSnapSize}
                                                    height={blockSnapSize}
                                                    fill="grey"
                                                    stroke="black"
                                                    strokeWidth={stroke}
                                                />
                                            );
                                        }
                                    })
                                ) : (
                                    <></>
                                )}
                                {showMyland && myPlots !== null ? (
                                    Object.keys(myPlots).map((key, index) => {
                                        if (
                                            myPlots[key]['posX'] * mapScale * blockSnapSize > offsetX * -1 &&
                                            myPlots[key]['posY'] * mapScale * blockSnapSize > offsetY * -1 &&
                                            myPlots[key]['posX'] * mapScale * blockSnapSize < offsetX * -1 + mapWidth &&
                                            myPlots[key]['posY'] * mapScale * blockSnapSize < offsetY * -1 + mapHeight
                                        ) {
                                            return (
                                                <>
                                                    <KonvaImage
                                                        perfectDrawEnabled={false}
                                                        image={generateImage(mylandsURI)}
                                                        key={index + 'location'}
                                                        x={myPlots[key]['posX'] * blockSnapSize - blockSnapSize * 1.5}
                                                        y={myPlots[key]['posY'] * blockSnapSize - blockSnapSize * 5}
                                                        width={blockSnapSize * 4}
                                                        height={blockSnapSize * 5}
                                                    />
                                                    <Rect
                                                        perfectDrawEnabled={false}
                                                        key={index}
                                                        x={myPlots[key]['posX'] * blockSnapSize}
                                                        y={myPlots[key]['posY'] * blockSnapSize}
                                                        width={blockSnapSize}
                                                        height={blockSnapSize}
                                                        fill="red"
                                                        stroke="black"
                                                        strokeWidth={stroke}
                                                    />
                                                </>
                                            );
                                        }
                                    })
                                ) : (
                                    <></>
                                )}

                                {showListed && listings !== null ? (
                                    Object.keys(listings).map((key, index) => {
                                        if (
                                            listings[key]['posX'] * mapScale * blockSnapSize > offsetX * -1 &&
                                            listings[key]['posY'] * mapScale * blockSnapSize > offsetY * -1 &&
                                            listings[key]['posX'] * mapScale * blockSnapSize <
                                                offsetX * -1 + mapWidth &&
                                            listings[key]['posY'] * mapScale * blockSnapSize < offsetY * -1 + mapHeight
                                        ) {
                                            return (
                                                <>
                                                    <KonvaImage
                                                        perfectDrawEnabled={false}
                                                        image={generateImage(listingsURI)}
                                                        key={index + 'listings'}
                                                        x={listings[key]['posX'] * blockSnapSize - blockSnapSize * 1.5}
                                                        y={listings[key]['posY'] * blockSnapSize - blockSnapSize * 5}
                                                        width={blockSnapSize * 4}
                                                        height={blockSnapSize * 5}
                                                    />
                                                    <Rect
                                                        perfectDrawEnabled={false}
                                                        key={index}
                                                        x={listings[key]['posX'] * blockSnapSize}
                                                        y={listings[key]['posY'] * blockSnapSize}
                                                        width={blockSnapSize}
                                                        height={blockSnapSize}
                                                        fill="blue"
                                                        stroke="black"
                                                        strokeWidth={stroke}
                                                    />
                                                </>
                                            );
                                        }
                                    })
                                ) : (
                                    <></>
                                )}
                                {selBlock ? (
                                    <>
                                        <KonvaImage
                                            perfectDrawEnabled={false}
                                            image={generateImage(selectedURI)}
                                            x={selBlock['posX'] * blockSnapSize - blockSnapSize * 1.5}
                                            y={selBlock['posY'] * blockSnapSize - blockSnapSize * 5}
                                            width={blockSnapSize * 4}
                                            height={blockSnapSize * 5}
                                        />
                                        <Rect
                                            x={blockSnapSize * selBlock['posX']}
                                            y={blockSnapSize * selBlock['posY']}
                                            width={blockSnapSize * selBlock['width']}
                                            height={blockSnapSize * selBlock['height']}
                                            stroke="yellow"
                                            strokeWidth={stroke}
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                                {selCombinePlots ? (
                                    selCombinePlots.map((item, idx) => (
                                        <Rect
                                            key={idx}
                                            x={item['posX'] * blockSnapSize}
                                            y={item['posY'] * blockSnapSize}
                                            width={blockSnapSize * item['width']}
                                            height={blockSnapSize * item['height']}
                                            fill="blue"
                                            stroke="black"
                                            strokeWidth={1}
                                        />
                                    ))
                                ) : (
                                    <></>
                                )}
                            </Layer>
                        </Stage>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default memo(MapComponent);
