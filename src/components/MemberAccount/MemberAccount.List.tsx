'use client';
import MemberContact from '@/components/MemberContact/MemberContact.Item';
import {
  InformationCircleIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import DropdownMinimal from '@/components/ui/Dropdown/DropdownMinimal';
import ModalSimpleWithDismiss from '@/components/ui/ModalSimpleWithDismiss/ModalSimpleWithDismiss';
import { useState } from 'react';
import { DepartmentWithContacts } from '@/utils/supabase_queries/contact';
type Props = {
  departments: DepartmentWithContacts[];
};
export default function MemberAccountListWithContacts({ departments }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [loading] = useState(false);
  const [errorDeletingText] = useState('');

  const departmentActions = [
    {
      name: 'Stofna nýjan úttektaraðila',
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => console.log('Stofna úttektaraðila'),
    },
    {
      name: 'Eyða deild',
      icon: <TrashIcon className="w-4 h-4 text-red-600" />,
      onClick: () => setShowModal(true),
    },
  ];
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
          <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
          >
            <li
              key={department.external_identifier}
              className="relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50  sm:px-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="font-semibold inline-flex">
                    {department.name}{' '}
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
                <DropdownMinimal items={departmentActions}></DropdownMinimal>
              </div>
            </li>
            <ul
              role="list"
              className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
            >
              {department.contact.map((c) => (
                <MemberContact
                  key={c.external_identifier}
                  contact={c}
                ></MemberContact>
              ))}
            </ul>
          </ul>
        );
      })}
    </div>
  );
}
