import { message } from 'antd';
import { Col, Row } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Loader from '../../components/Loader';
import NoDataScreen from '../../components/NoDataScreen';

import { IAuditorium } from '../../interfaces/services.interface';
// import { auditoriumService } from "../../services";
import AuditoriumGallery from './components/AuditoriumGallery';
import AuditoriumVideo from './components/AuditoriumVideo';

function AuditoriumPage() {
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleFullScreen = async () => {
        setShowFullScreen((prev) => !prev);
    };

    const router = useRouter();
    const room = router.query.id;

    // const { data: auditoriumData, isLoading } = useQuery(["GET_AUDITORIUM", room], auditoriumService.getAu, {
    //     onSuccess: ({ data }) => {
    //         console.log({ data })
    //         if (!data.success) return [message.error(data?.message), setIsError(true)]
    //     },
    //     staleTime: 1000000,
    //     enabled: (Boolean(room))
    // })

    useEffect(() => {});

    // const auditorium: IAuditorium = auditoriumData?.data?.data

    if (isLoading) return <Loader height={'80rem'} />;
    if (isError) return <NoDataScreen heading={'Auditorium not found or expired'} />;
    if (!auditorium) return <div></div>;
    return (
        <div className="AtContent">
            <Head>
                <title>Auditorium</title>
            </Head>
            <section className="AtSectionT4 AtAuditoriumPage">
                <div className="AtContainerLg">
                    <Row gutter={[{ sm: 10, md: 15, xl: 20, xxl: 30 }, 0]}>
                        <Col span={24} xs={24} lg={18} className={showFullScreen ? 'AtAntW100Imp' : ''}>
                            <AuditoriumGallery
                                handleFullScreen={handleFullScreen}
                                showFullScreen={showFullScreen}
                                auditorium={auditorium}
                            />
                        </Col>
                        <Col span={24} xs={24} lg={6} className={showFullScreen ? 'AtPosAbsolute' : ''}>
                            <AuditoriumVideo room={room} auditorium={auditorium} />
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    );
}

export default AuditoriumPage;
