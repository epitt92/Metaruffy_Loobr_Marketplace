import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'validate.js';
import Button from '../../../components/Button/Button';
import ImageComponent from '../../../components/Image/ImageComponent';
import Loader from '../../../components/loader/Loader';
import Notfounditem from '../../../components/notfounditems/notfounditem';
import Popups from '../../../components/popup/poups';
import Verified from '../../../components/verified';
import { deleteCollection, getAllCollections } from '../../../redux/collections/actions';

const Collection = () => {
    const [popup, setPopup] = useState(false);
    const [state, setState] = useState(-1);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(false);
    const [collections, setCollections] = useState<any>([]);

    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const user = useSelector((state: any) => state.auth.user);
    const otherUser = useSelector((state: any) => state.user.user);
    const collectionss = useSelector((state: any) => state.collections.collections);

    const loading = useSelector((state: any) => state.collections.collectionsLoading);
    const deleteLoading = useSelector((state: any) => state.collections.deleteLoading);

    useEffect(() => {
        if (loadMore) {
            setCollections([...collections, ...collectionss?.collections]);
            setLoadMore(false);
        } else {
            setCollections(collectionss?.collections);
        }
    }, [collectionss]);

    useEffect(() => {
        const filters = { userId: id ? id : otherUser._id, pageSize: 12, page };
        dispatch(getAllCollections(filters));
    }, [id, page]);

    const handleDelete = (id: string) => {
        dispatch(deleteCollection(id));
    };

    const handleLoadMore = () => {
        setLoadMore(true);
        setPage(page + 1);
    };

    return (
        <>
            {/* <div className="w-full mb-7 text-right">
                <Button
                    className="gold rounded-full"
                    onClick={() => {
                        setPopup(true);
                        setState(21);
                    }}
                >
                    Create New Collection
                </Button>
            </div> */}
            <div className=" ">
                {loading ? (
                    <Loader />
                ) : isEmpty(collections) ? (
                    <div className="col-span-3 w-full">
                        <Notfounditem />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2  xs2:grid-cols-1 gap-6 sm:gap-10 ">
                        {collections.map((item: any, i: number) => (
                            <Link legacyBehavior href={`/collections/${item._id}`} key={i}>
                                <a>
                                    <div className="relative    w-full ">
                                        {item?.coverPicture && (
                                            <ImageComponent
                                                src={item.logoPicture}
                                                alt=""
                                                height={480}
                                                width={500}
                                                className="rounded-xl "
                                                quality={40}
                                                blurEffect
                                                // objectFit="cover"
                                                // layout="fill"
                                                // figClassName=" relative rounded-xl h-[25rem] w-full "
                                            />
                                        )}
                                        <div className="  absolute inset-0 bg-[#00000066] rounded-xl leading-none px-8 pb-8  !h-full !w-full flex flex-col justify-end ">
                                            <div className='flex justify-center items-center'>
                                            <h3 className="xl:text-[32px] max-w-3/4  leading-[35px] truncate   text-white flex items-center gap-2">
                                                {item.name} 
                                            </h3>
                                            {item?.isVerfied && <Verified />}
                                            </div>
                                            {/* <CollectionDropdown
                                            onDelete={handleDelete}
                                            id={item._id}
                                        /> */}
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>
                )}

                {/* <CollectionCard src={""} name={""} width={""} /> */}
            </div>
            {!loading && collectionss?.totalPages > page && (
                <div className="flex items-center">
                    <Button
                        disabled={loading}
                        isLoading={loading}
                        className="m-auto font-Circular-Book text-xl text-black2 mt-[4.688rem]"
                        onClick={handleLoadMore}>
                        Load More
                    </Button>
                </div>
            )}
            {state && <Popups show={popup} hide={setPopup} state={state} setstate={setState} />}
        </>
    );
};

export default Collection;
