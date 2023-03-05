import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import BlurImage from '../../components/blurimage/BlurImage';
import MainCard from '../../components/maincard/MainCard';
import Select from '../../components/select/Select';
import ExternalCollectionDetailTable from './ExternalCollectionDetailTable';
import ExternalCollectionFilter from './ExternalCollectionFilter';
import ExternalCollectionTable from './ExternalCollectionTable';
import ExternalCollectionValue from './ExternalCollectionValue';

const sortdata = [
    { id: 0, name: 'Sort by' },
    { id: 1, name: 'Price: Low to High', value: 'price', order: 1 },
    { id: 2, name: 'Price: High to Low', value: 'price', order: -1 },
    { id: 1, name: 'Likes: Low to High', value: 'likes', order: 1 },
    { id: 2, name: 'Likes: High to Low', value: 'likes', order: -1 },
    { id: 1, name: 'Comments: Low to High', value: 'comments', order: 1 },
    { id: 2, name: 'Comments: High to Low', value: 'comments', order: -1 },
    { id: 3, name: 'Newest To Oldest', value: 'createdAt', order: -1 },
    { id: 4, name: 'Oldest To Newest', value: 'createdAt', order: 1 }
];

const ExternalCollectionsDetailModule = () => {
    const [selected, setSelected] = useState(sortdata[0]);
    const [view, setView] = useState('gridView');
    const [page, setPage] = useState(1);
    const [show, setshow] = useState(false);
    const handleSelectSort = (values: any) => {
        page != 1 && setPage(1);
        setSelected(values);
    };
    const togglebar = () => {
        setshow(!show);
    };
    return (
        <div className="container pt-12  pb-[98px]">
            <div className="lg:flex  gap-8 sm:pt-[80px]  relative">
                <div className="lg:w-[20%] w-full lg:px-4">
                    <div className="flex items-center gap-3">
                        <BlurImage
                            src={'/assets/images/placeholder2.png'}
                            figClassName="flex-shrink-0 relative overflow-hidden h-[5.5rem] w-[5.5rem]"
                            className="rounded-lg"
                            layout="fill"
                            objectFit="cover"
                        />
                        <div className="w-full">
                            <h6 className="text-2xl text-white truncate font-Proxima-Bold">
                                <span className="truncate">Otherdeed</span>
                            </h6>
                            <CopyToClipboard
                                text={'sdsdsdsdsdsdsd'}
                                onCopy={() => toast.success('Address successfully copied')}>
                                <button
                                    className="flex items-center text-base font-Proxima-Regular text-gray7"
                                    type="button">
                                    <span className="pr-[8px]">sdsdsdsdsdsdsd</span>
                                    <i className="icon-copy"></i>
                                </button>
                            </CopyToClipboard>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-[#2B2B35] rounded-md flex items-center justify-center">
                                    <i className="text-lg icon-twitter text-themecolor"></i>
                                </div>
                                <i className="text-2xl icon-discord text-themecolor"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full  lg:w-[80%] mt-8 lg:mt-0">
                    <span className="inline-flex flex-wrap w-full shadow-sm rounded-xl md:flex-nowrap">
                        <ExternalCollectionValue
                            className="rounded-l-xl xs2:w-[50%] w-[40%]  md:w-[22%]"
                            value="113212 ETH"
                            dec="Volume Traded"
                        />
                        <ExternalCollectionValue
                            className="xs2:w-[50%] w-[30%] md:w-[17%]"
                            value="111911"
                            dec="Total Supply"
                        />
                        <ExternalCollectionValue
                            className="xs2:w-[50%] w-[30%] md:w-[12%]"
                            value="42221"
                            dec="Total Sales"
                        />
                        <ExternalCollectionValue
                            className="xs2:w-[50%] w-[25%] md:w-[12%]"
                            value="67.2 ETH"
                            dec="Floor Price"
                        />
                        <ExternalCollectionValue className="xs2:w-[50%] w-[25%] md:w-[12%]" value="18" dec="Holders" />
                        <ExternalCollectionValue className="xs2:w-[50%] w-[25%] md:w-[12%]" value="146" dec="Likes" />
                        <ExternalCollectionValue
                            className="xs2:w-full w-[25%] md:w-[13%] rounded-r-xl"
                            value="220"
                            dec="Comments"
                        />
                    </span>
                </div>
            </div>

            <div className="relative gap-8 md:flex">
                <div
                    className={`xl:w-[20%]  lg:w-[30%]  sm:w-[40%] w-full h-full px-4  xl:block  xl:bg-transparent xl:rounded-none rounded-lg flex-shrink-0 bg-[#22222f] xl:shadow-none shadow-lg hidden fixed top-0  left-0 xl:relative xl:z-[30] z-[99]  overflow-y-auto  ${
                        show === false ? 'hidden' : '!block'
                    }`}>
                    <ExternalCollectionFilter AtClose={togglebar} />
                </div>
                <div className="w-full xl:w-[80%] mt-8">
                    <div className="flex justify-end gap-10 mb-10">
                        <Select
                            className="rounded-[50px]  cursor-pointer  "
                            style="!w-[220px] xs:!w-full !m-0 cursor-pointer"
                            data={sortdata}
                            selected={selected}
                            onSelect={handleSelectSort}
                        />
                        <div className="flex items-center gap-6">
                            <i
                                className={`text-2xl icon-listView ${
                                    view === 'listed' && 'text-themecolor'
                                } cursor-pointer`}
                                onClick={() => setView('listed')}></i>
                            <i
                                className={`text-2xl icon-menuebar2 ${
                                    view === 'gridView' && 'text-themecolor'
                                } cursor-pointer`}
                                onClick={() => setView('gridView')}></i>
                            <i className="text-2xl icon-filter xl:hidden " onClick={togglebar}></i>
                        </div>
                    </div>
                    {view === 'listed' && (
                        <div className="mb-10 lg:gap-10">
                            <ExternalCollectionDetailTable />
                        </div>
                    )}

                    {view === 'gridView' && (
                        <div className={`  grid lg:grid-cols-3 sm:grid-cols-2 mb-10 gap-7 lg:gap-10`}>
                            <MainCard />
                            <MainCard />
                            <MainCard />
                            <MainCard />
                            <MainCard />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExternalCollectionsDetailModule;
