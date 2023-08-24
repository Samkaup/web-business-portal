'use client';
import MemberContact from '@/components/MemberContact/MemberContact.Item';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import DropdownMinimal from '@/components/ui/Dropdown/DropdownMinimal';
import ModalSimpleWithDismiss from '@/components/ui/ModalSimpleWithDismiss/ModalSimpleWithDismiss';
import { useState } from 'react';
import { DepartmentWithContacts } from '@/utils/supabase_queries/department';
import AlertWithDescription from '@/components/ui/Alert/AlertWithDescription';
type Props = {
  departments: DepartmentWithContacts[];
};
export default function MemberAccountListWithContacts({ departments }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading] = useState(false);
  const [errorDeletingText] = useState('');

  const departmentActions = [
    {
      name: 'Stofna úttektaraðila á deild',
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => console.log('Stofna úttektaraðila'),
    },
    {
      name: 'Eyða deild',
      icon: <TrashIcon className="w-4 h-4 text-red-600" />,
      onClick: () => setShowModal(true),
    },
  ];
  const sort = (obj, key) => {
    return obj.sort(function (a, b) {
      if (a[key] < b[key]) {
        return -1;
      }
      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    });
  };
  return (
    <div>
      <ModalSimpleWithDismiss
        open={showModal}
        onAction={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        isLoading={loading}
        description={'Ertu viss um að þú viljir eyða þessari deild?'}
        errorText={errorDeletingText}
      ></ModalSimpleWithDismiss>
      {departments.map((department) => {
        return (
          <Disclosure
            as="div"
            key={department.external_identifier}
            className="pt-1 z-5"
          >
            {({ open }) => (
              <ul
                role="list"
                className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 z-5"
              >
                <li
                  key={department.external_identifier}
                  className="relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50  sm:px-6 z-5"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="font-semibold inline-flex">
                        {department.name} ({department.external_identifier})
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-x-4">
                    <InformationCircleIcon
                      className="h-6 w-6 text-company ml-2"
                      title={`Deild stofnuð: ${format(
                        new Date(department.created_at),
                        'dd. MMM HH:mm'
                      )}`}
                    ></InformationCircleIcon>

                    <Disclosure.Button className="text-gray-900">
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <ChevronDownIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronUpIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </Disclosure.Button>
                  </div>
                </li>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel as="dd" className="">
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
                    >
                      <li
                        className={`relative flex justify-between gap-x-6 px-4 py-5 sm:px-6 ${
                          department.contact.length > 0 ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            {department.contact.length == 0 ? (
                              <AlertWithDescription
                                title="Engin skráður úttektaraðili"
                                description="Ekki er hægt að nota þennan reikning ef enginn úttektaraðili er skráður"
                              />
                            ) : (
                              <p className="text-lg leading-6 text-gray-900">
                                <span className="absolute inset-x-0 -top-px bottom-0" />
                                Úttektaraðilar deildar:
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-x-4">
                          Aðgerðir:
                          <DropdownMinimal
                            items={departmentActions}
                          ></DropdownMinimal>
                        </div>
                      </li>

                      {sort(department.contact, 'full_name').map((c) => (
                        <MemberContact
                          key={c.external_identifier}
                          contact={c}
                        ></MemberContact>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </Transition>
              </ul>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}
