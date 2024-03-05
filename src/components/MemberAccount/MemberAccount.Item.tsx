'use client';

import * as React from 'react';
import { ChevronsUpDown, Info, User, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/Shadcn/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/Shadcn/ui/collapsible';
import { format } from 'date-fns';
import { DepartmentWithContacts } from '@/utils/supabase_queries/department';
import MemberContactNew from '../MemberContact/MemberContact.New';
import AlertWithDescription from '../ui/Alert/AlertWithDescription';
import Link from 'next/link';
import { TableRow } from '@/types';
import MemberContact from '../MemberContact/MemberContact.Item';

type Props = {
  department: DepartmentWithContacts;
  startOpened?: boolean;
};
export function MemberAccountItem({ department, startOpened = false }: Props) {
  const [isOpen, setIsOpen] = React.useState(startOpened);
  const [showContactCreate, setShowContact] = useState(false);
  const departmentActions = [
    {
      name: showContactCreate ? 'Hætta við stofnun' : 'Stofna úttektaraðila',
      icon: showContactCreate ? (
        <X className="w-4 h-4"></X>
      ) : (
        <User className="w-4 h-4" />
      ),
      onClick: () => setShowContact(!showContactCreate)
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <Link href="#" scroll={false} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between space-x-4 px-4 py-3 shadow-md ring-1 ring-company-900/5 hover:bg-company-950/10  ">
          <div>
            <h2 className="text-lg font-semibold">
              {department.name}{' '}
              <small>({department.external_identifier})</small>
            </h2>
          </div>
          <div
            className="flex shrink-0 items-center gap-x-4"
            title={`Deild stofnuð: ${format(
              new Date(department.created_at),
              'dd. MMM HH:mm'
            )}`}
          >
            <Info className="h-6 w-6 text-company ml-2" />
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Opna/loka</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
      </Link>

      <CollapsibleContent className="shadow-sm ring-1 ring-gray-900/5">
        <ul
          role="list"
          className="divide-y divide-company-950/10 overflow-hidden"
        >
          <li
            key={`dep-actions-${department.external_identifier}`}
            className={`sm:flex sm:justify-between gap-x-6 px-4 py-5 sm:px-6 ${
              department.contact.length > 0 ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex min-w-0 gap-x-4 items-center">
              <div className="min-w-0 flex-auto">
                <p className="text-md text-gray-900 p-2">
                  Úttektaraðilar skráðir á deild:
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4 ">
              {departmentActions.map((action, idx) => (
                <Button key={idx} onClick={action.onClick}>
                  <span className="mr-2">{action.name}</span>
                  {action.icon}
                </Button>
              ))}
            </div>
          </li>
          {showContactCreate && (
            <li
              key={`create-new-contact-${department.external_identifier}`}
              className="gap-x-6 px-4 py-5 sm:px-6 bg-gray-50 divide-y divide-company-950/10"
            >
              <MemberContactNew
                departmentId={department.external_identifier}
                onSave={() => setShowContact(false)}
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
        </ul>
        {sort(department.contact, 'full_name').map((c: TableRow<'contact'>) => (
          <div key={c.external_identifier}>
            <MemberContact
              key={c.external_identifier}
              contact={c}
              department={department}
            />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
