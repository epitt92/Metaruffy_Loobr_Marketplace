import Image from 'next/image';

const Newpost = () => {
    return (
        <div className="mb-4">
            <div className="ChooseFullImage relative rounded-xl bg-[#2B2B35] overflow-hidden ">
                <div
                    className="absolute top-0 right-[0px] cursor-pointer z-10"
                    onClick={() => {
                        // setNft(null);
                        // setType('');
                    }}>
                    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="23" cy="23" r="23" transform="rotate(-180 23 23)" fill="#363642" />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30.5023 15.4966C30.8013 15.7956 30.9692 16.2011 30.9692 16.6239C30.9692 17.0467 30.8013 17.4522 30.5023 17.7513L25.2496 23.0006L30.5023 28.2498C30.8018 28.5493 30.97 28.9554 30.97 29.3788C30.97 29.8022 30.8018 30.2083 30.5023 30.5077C30.2029 30.8072 29.7968 30.9754 29.3733 30.9754C28.9499 30.9754 28.5438 30.8072 28.2443 30.5077L22.9948 25.2553L17.7452 30.5077C17.5969 30.656 17.4209 30.7736 17.2272 30.8538C17.0335 30.9341 16.8259 30.9754 16.6162 30.9754C16.4065 30.9754 16.1989 30.9341 16.0052 30.8538C15.8115 30.7736 15.6354 30.656 15.4872 30.5077C15.3389 30.3595 15.2213 30.1835 15.1411 29.9898C15.0608 29.7961 15.0195 29.5885 15.0195 29.3788C15.0195 29.1691 15.0608 28.9615 15.1411 28.7678C15.2213 28.5741 15.3389 28.3981 15.4872 28.2498L20.7399 23.0006L15.4872 17.7513C15.1878 17.4518 15.0195 17.0458 15.0195 16.6223C15.0195 16.1989 15.1878 15.7928 15.4872 15.4934C15.7866 15.1939 16.1927 15.0257 16.6162 15.0257C17.0396 15.0257 17.4458 15.1939 17.7452 15.4934L22.9948 20.7458L28.2443 15.4934C28.3925 15.3449 28.5684 15.2271 28.7622 15.1467C28.9559 15.0663 29.1636 15.0249 29.3733 15.0249C29.5831 15.0249 29.7908 15.0663 29.9845 15.1467C30.1782 15.2271 30.3542 15.3449 30.5023 15.4934V15.4966Z"
                            fill="#777E91"
                        />
                    </svg>
                </div>
                <div className="relative NormalImage ">
                    <Image width={200} height={400} src="/assets/images/feature-nft/5.jpg" />
                </div>
                {/* <div className="BluredImage">
            <Image width={200} height={200} src="/assets/images/4.png" />
        </div> */}
            </div>
            <p className="mt-3 text-lg">Loobr.com</p>
            <h5 className="mt-2 text-2xl text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro itaque voluptate repellat?
            </h5>
        </div>
    );
};

export default Newpost;
