import Link from "next/link";
import { Row, Col, Select } from "antd";
import { Divider } from "antd";
import { ImageLoading } from "../../../components/ImageLoading.comonent";
import { ICollectionItem } from "../../../interfaces";
import { getImageURL, numberFormater } from "../../../shared";
import { authSelector } from "../../../store/selectors";
import { useSelector } from "react-redux";
import { IinitFormatState } from "../../../constants/art.constants";

const infoTooltipData = (artDetail: ICollectionItem) => {

    const { user, isAuth } = useSelector(authSelector);

    if (!artDetail) return
    return (
        <div className=" AtArtDetail">
            <Row gutter={[{ xs: 6, sm: 10 }, 0]} align="middle" className="AtFormatRow AtLeft">
                <Col span={24}>
                    <div className="AtArtHeading">
                        <div className="AtArtPriceHolder">
                            <h2>{artDetail.name}</h2>
                            <h3 className="AtArtPrice">
                                {artDetail?.sold || artDetail?.reserved ? (
                                    artDetail?.sold ? (
                                        "Sold"
                                    ) : artDetail?.reserved ? (
                                        "Reserved "
                                    ) : null
                                ) : (
                                    <>$ {numberFormater(artDetail?.price)}</>
                                )}
                            </h3>
                        </div>
                        {
                            isAuth &&
                            artDetail?.userId !== user._id && (
                                <div className="AtArtsIcons">
                                    {/* <Link legacyBehavior href="#">
                                        <a> */}
                                            <div className="AtArtFav ">
                                                <i className="icon-heart AtColorPrimary"></i>
                                            </div>
                                        {/* </a>
                                    </Link> */}
                                </div>
                            )
                        }
                    </div>
                    <h6>{artDetail?.description}</h6>
                    <div className="AtParas">
                        {artDetail?.width && (
                            <p>
                                {artDetail?.height}" X {artDetail?.width}" X {artDetail?.depth}"
                            </p>
                        )}
                        <p>{artDetail?.artTechnique}</p>
                    </div>
                </Col>
                <Divider className="AtMt3 AtMb6 AtAntDivider" />
                {
                    artDetail?.formates?.length != 0
                    &&
                    <>
                        <Col lg={16} md={11} xs={9} className="AtMb3">
                            <p>Other Formats</p>
                        </Col>
                        <Col lg={8} md={7} xs={8}>
                            <p>Price</p>
                        </Col>
                    </>
                }
                {
                    artDetail?.formates?.length > 0 && artDetail?.formates?.map((formate: IinitFormatState | any) => (
                        <>
                            <Col lg={16} md={11} xs={9}>

                                <div className="AtMediaBox">
                                    <ImageLoading src={getImageURL(artDetail?.url, 20, [200, 200])} height={60} width={60} figClassName="AtFigBorder" NoBlurEffect={true} />
                                    <div className="AtMediaContent">
                                        <h6>{formate.title ? formate.title : formate.size}</h6>
                                        <p>{formate.printType === "FRAMED" ? "Framed" : "Unframed"}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={8} md={7} xs={8}>
                                <h6 className="AtFs14px AtTextOverflowHover">${numberFormater(Number(formate.price) + Number(formate.shipping))}</h6>
                            </Col>
                            <Divider className="AtM3 AtAntDivider" />
                        </>
                    ))
                }
            </Row>
        </div>
    )
}

export default infoTooltipData;
