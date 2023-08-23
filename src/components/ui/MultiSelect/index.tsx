import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from '@/utils/style/classNames';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type Option = {
  id: any;
  label: string;
  selected: boolean;
};

type Props = {
  options: Option[];
  onSelect: (options: Option[]) => void;
  lable: string;
};

const MultiSelect = ({ options, onSelect, lable }: Props) => {
  const toggleOption = (id: any) =>
    onSelect(
      options.map((o: Option) => {
        if (o.id === id) return { ...o, selected: !o.selected };
        return o;
      })
    );

  const deselectAll = () =>
    onSelect(options.map((o: Option) => ({ ...o, selected: false })));

  const DisplayState = () => {
    // const selected = options.filter((o: Option) => o.selected);

    const className = 'w-fit truncate ...';

    // if (selected.length === 1)
    //   return <div className={className}>{selected.at(0).label}</div>;
    // else if (selected.length === 1)
    //   return <div className={className}>{selected.at(0).label}</div>;
    // else if (selected.length > 1)
    //   return (
    //     <>
    //       <div className={className}>{selected.at(0).label}</div>
    //       <div>{selected.length - 1}</div>
    //     </>
    //   );

    return <div className={className}>{lable}</div>;
  };

  return (
    <Popover className="relative flex flex-col w-full">
      {({ open }) => (
        <>
          <div className="w-48 flex flex-col mx-auto h-full justify-center ">
            <div className="flex flex-col relative w-full h-full">
              <Popover.Button className="h-full flex justify-start items-center rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-company-600 sm:text-sm sm:leading-6 hover:ring-company-600">
                <div className="flex-1 flex justify-start px-2">
                  <DisplayState />
                </div>

                {options.filter((o: Option) => o.selected).length > 0 && (
                  <div
                    onClick={deselectAll}
                    className="text-gray-500 hover:text-gray-800 mr-1 cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
                <div className="text-gray-800 w-8 justify-center border-l flex items-center border-gray-300">
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                </div>
              </Popover.Button>
            </div>
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute max-h-64 overflow-auto top-2 z-10 bg-white flex flex-col w-64 rounded-lg border-2">
              {options.map((o: Option) => {
                return (
                  <div
                    key={o.id}
                    className={classNames(
                      'cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-company-100',
                      o.selected && 'font-semibold'
                    )}
                    onClick={() => toggleOption(o.id)}
                  >
                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                      <div className="w-full items-center flex">
                        <div className="mx-2 leading-6 truncate ...">
                          {o.label}
                        </div>
                        <span>
                          {o.selected && (
                            <CheckIcon
                              className="h-5 w-5 text-company-green-500"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default MultiSelect;
