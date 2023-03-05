import { Switch } from '@headlessui/react';
import { useId } from 'react';

interface Iprops {
    checked: boolean;
    onSelect: (checked: boolean) => void;
}

export default function SwitchComponent(props: Iprops) {
    const { checked, onSelect } = props;
    const switchId = useId();
    return (
        <Switch
            id={switchId}
            key={switchId}
            checked={checked}
            onChange={onSelect}
            className={`${checked ? ' bg-[#00AC1C]' : 'bg-gray-500'}
          relative inline-flex h-[2rem] w-[4rem] shrink-0 cursor-pointer rounded-full border-2
           border-transparent transition-colors duration-200 ease-in-out focus:outline-none `}>
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white 
            shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
        </Switch>
    );
}
