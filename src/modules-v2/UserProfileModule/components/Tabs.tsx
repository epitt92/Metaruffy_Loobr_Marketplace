import React from "react";

type Tab = {
    name: string;
};

type Props = {
    tabs: Tab[];
    activeTabIndex: number;
    onActiveTab: Function;
};

const Tabs = ({ tabs, activeTabIndex, onActiveTab }: Props) => {
    return (
        <div
            className=" flex flex-wrap items-center  gap-3 mb-10"
            aria-label="Tabs"
        >
            {tabs.map((tab, i) => (
                <a
                    key={i}
                    className={`
                ${
                    i === activeTabIndex &&
                    "!bg-[#F1C94A] !text-sm gold !text-[#2B2B35]"
                }
                 px-6 !py-2 cursor-pointer text-sm rounded-full borders font-montserrat-regular focus:outline-none hover:bg-[#25252c] bg-[#2B2B35] !text-white`}
                    onClick={() => onActiveTab(i)}
                >
                    {tab.name}
                </a>
            ))}
        </div>
    );
};

export default Tabs;
