import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from '@/utils/style/classNames';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type Option = {
  id: string;
  label: string;
};

type Props = {
  options: Option[];
  selectedOptions: Option[];
  onSelect: (options: Option[]) => void;
  label: string;
};

const MultiSelect = ({ options, selectedOptions, onSelect, label }: Props) => {
  const isSelected = (option: Option) => {
    return selectedOptions.some(
      (selected: Option) => selected.id === option.id
    );
  };

  const toggleOption = (toggledOption: Option) => {
    const updatedSelection = isSelected(toggledOption)
      ? selectedOptions.filter((o: Option) => o.id !== toggledOption.id) // Remove Option
      : [...selectedOptions, toggledOption]; // Add Option

    onSelect(updatedSelection);
  };

  const disabled = () => options.length === 0;

  return (
    <Popover className="relative flex flex-col w-full">
      {({ open }) => (
        <>
          <div className="w-48 flex flex-col mx-auto h-full justify-center">
            <div className="flex flex-col relative w-full h-full">
              <Popover.Button
                className={classNames(
                  'h-full flex justify-start items-center rounded-md border-0 sm:text-sm sm:leading-6 ring-1 ring-inset ring-gray-300',
                  disabled()
                    ? 'text-gray-300 cursor-auto'
                    : 'text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-company-600 hover:ring-company-600'
                )}
                disabled={disabled()}
              >
                <div className="flex-1 flex justify-start px-2">{label}</div>

                {selectedOptions.length !== 0 && (
                  <div
                    onClick={() => onSelect([])}
                    className="text-gray-500 hover:text-gray-800 mr-1 cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                )}
                <div className="w-8 justify-center border-l flex items-center border-gray-300">
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
                      'cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-gray-100 text-sm text-gray-70',
                      isSelected(o) && 'font-semibold'
                    )}
                    onClick={() => toggleOption(o)}
                  >
                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative">
                      <div className="flex w-full justify-between items-center">
                        <div className="mx-2 leading-6 truncate ...">
                          {o.label}
                        </div>
                        <span>
                          {isSelected(o) && (
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
