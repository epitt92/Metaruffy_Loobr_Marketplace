import { Tab } from "@headlessui/react";
import Link from "next/link";
import React, { useEffect } from "react";
import Tabs from "./Tabs";

const ExploreMarketplace = () => {
    return (
        <div className="container pb-24">
            <div className=" flex justify-between xs:block  ">
                <h2 className=" text-white xs:text-3xl ">
                    Explore Marketplace
                </h2>
                <div className=" flex items-center gap-2.5 mt-0  xs:mt-4">
                    <Link legacyBehavior href="/marketplace">
                        <a className="xs:w-full mt-0 border xs:!text-center px-11 py-3 !text-white border-[#5A5A62] hover:bg-[#43434a] bg-transparent rounded-full">
                            Explore All
                        </a>
                    </Link>
                </div>
            </div>
            <div>
                <Tabs />
            </div>
        </div>
    );
};

export default ExploreMarketplace;
