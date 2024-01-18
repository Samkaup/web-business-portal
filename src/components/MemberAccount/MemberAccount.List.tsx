'use client';
import MemberContact from '@/components/MemberContact/MemberContact.Item';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  TrashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Disclosure, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import ModalSimpleWithDismiss from '@/components/ui/ModalSimpleWithDismiss/ModalSimpleWithDismiss';
import { useState } from 'react';
import { DepartmentWithContacts } from '@/utils/supabase_queries/department';
import AlertWithDescription from '@/components/ui/Alert/AlertWithDescription';
import Button from '../ui/Button/Button';
import MemberContactNew from '../MemberContact/MemberContact.New';
import { TableRow } from '@/types';
type Props = {
  departments: DepartmentWithContacts[];
};
export default function MemberAccountListWithContacts({ departments }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading] = useState(false);
  const [errorDeletingText] = useState('');
  const [showContactCreate, setShowContact] = useState(false);
  const departmentActions = [
    {
      name: 'Stofna úttektaraðila',
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => setShowContact(!showContactCreate)
    },
    {
      name: 'Eyða deild',
      icon: <TrashIcon className="w-4 h-4 text-red-600" />,
      onClick: () => setShowModal(true)
    }
  ];
  const sort = (obj: { [key: string]: any }[], key: string) => {
    return obj.sort(function (
      a: { [key: string]: any },
      b: { [key: string]: any }
    ) {
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
        isLoading={isLoading}
        description={'Ertu viss um að þú viljir eyða þessari deild?'}
        errorText={errorDeletingText}
      />
      {departments.map((department) => {
        return (
          <div key={department.external_identifier}>
            <Disclosure as="div" className="pt-1 z-5">
              {({ open }) => (
                <ul
                  role="list"
                  className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 z-5"
                >
                  <li
                    key={`dep-${department.external_identifier}`}
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
                      />

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
                    <Disclosure.Panel as="dd">
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
                      >
                        <li
                          key={`dep-actions-${department.external_identifier}`}
                          className={`sm:flex sm:justify-between gap-x-6 px-4 py-5 sm:px-6 ${
                            department.contact.length > 0 ? 'bg-gray-50' : ''
                          }`}
                        >
                          <div className="flex min-w-0 gap-x-4 items-center">
                            <div className="min-w-0 flex-auto">
                              <p className="text-lg leading-6 text-gray-900 pb-2">
                                Úttektaraðilar deildar
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-x-4">
                            {departmentActions.map((action, idx) => (
                              <Button
                                secondary
                                key={idx}
                                onClick={action.onClick}
                              >
                                <span className="mr-2">{action.name}</span>
                                {action.icon}
                              </Button>
                            ))}
                          </div>
                        </li>
                        {showContactCreate && (
                          <li
                            key={`create-new-contact-${department.external_identifier}`}
                            className="flex justify-between gap-x-6 px-4 py-5 sm:px-6"
                          >
                            <MemberContactNew
                              departmentId={department.external_identifier}
                            />
                          </li>
                        )}
                        {department.contact.length == 0 && (
                          <li
                            key={`issues-new-contact-${department.external_identifier}`}
                            className={`w-100 ${
                              department.contact.length > 0 ? 'bg-gray-50' : ''
                            }`}
                          >
                            <AlertWithDescription
                              type="info"
                              title="Engin skráður úttektaraðili"
                              description="Ekki er hægt að nota þennan reikning ef enginn úttektaraðili er skráður"
                            />
                          </li>
                        )}

                        {sort(department.contact, 'full_name').map(
                          (c: TableRow<'contact'>) => (
                            <div key={c.external_identifier}>
                              <MemberContact
                                key={c.external_identifier}
                                contact={c}
                              />
                            </div>
                          )
                        )}
                      </ul>
                    </Disclosure.Panel>
                  </Transition>
                </ul>
              )}
            </Disclosure>
          </div>
        );
      })}
    </div>
  );
}
