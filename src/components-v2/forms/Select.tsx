import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

interface Iprops {
  selected: any;
  setSelected: any;
  Data?: any;
  iconClass?: string;
  placeholder?: any;
}

export default function SelectComponent({
  Data,
  iconClass,
  placeholder,
  selected,
  setSelected,
}: Iprops) {
  return (
    <Listbox as="div" value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button
          className="relative flex w-full items-center justify-between rounded-[4.5px] border border-[#C1C9D0] bg-white py-4 
          pl-6 pr-14 text-left text-xl focus:outline-none"
        >
          <span
            className={`block truncate text-secondary`}
            title={selected?.name || placeholder}
          >
            {selected?.name || placeholder}
          </span>
          <span className="absolute flex items-center pointer-events-none inset-y-1/2 right-5 ">
            <i
              className={`${iconClass ? iconClass : ""} text-2xl text-primary`}
              aria-hidden="true"
            >
              <IoIosArrowDown />
            </i>
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`absolute z-10 mt-1 max-h-[20.5rem] w-full overflow-auto  
               rounded-[4.5px] border border-[#C1C9D0] bg-white text-xl focus:outline-none`}
          >
            {Data.map((item: any, Idx: any) => {
              return (
                <>
                  <Listbox.Option
                    key={Idx}
                    className={({ active }: any) =>
                      `relative cursor-pointer select-none py-4 px-6 ${
                        active ? "bg-[#F5F8FA]" : ""
                      }`
                    }
                    value={item}
                  >
                    <div className="truncate text-secondary">{item.name}</div>
                  </Listbox.Option>
                </>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
