import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
type isOpen = boolean;
type title = string;
type description = string;
type children = React.ReactNode;
type onCancel = (event: React.MouseEvent<HTMLButtonElement>) => void;

export type Props = {
  isOpen: isOpen;
  title?: title;
  description?: description;
  children?: children;
  toggleOpen: (boolean: isOpen) => void;
  onCancel: onCancel;
};
export const SlideOver = ({
  isOpen = false,
  title = 'Title',
  description = 'Description',
  children,
  toggleOpen,
  onCancel,
}: Props) => {
  const toggleOpenState = () => {
    toggleOpen(!isOpen);
  };
  const clickOutside = () => {
    return;
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={clickOutside}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-company text-white px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <Dialog.Title className="text-lg font-medium text-white">
                              {title}
                            </Dialog.Title>
                            <p className="text-sm text-white/75">
                              {description}
                            </p>
                          </div>
                          <div className="flex h-7 items-center">
                            <button
                              type="button"
                              className="text-white hover:text-white"
                              onClick={(e) => {
                                toggleOpenState();
                                onCancel(e);
                              }}
                            >
                              <span className="sr-only">Loka</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Divider container */}
                      <div className="space-y-6 py-6 px-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                        {children}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
