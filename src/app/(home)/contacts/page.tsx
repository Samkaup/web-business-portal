'use client';
import Header from '@/components/Header/Header';
import Button from '@/components/ui/Button/Button';
import MemberAccountListWithContacts from '@/components/MemberAccount/MemberAccount.List';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Context } from '@/utils/context-store';
import { useContext } from 'react';
import { useDepartmentsWithContacts } from '@/utils/react_query_hooks/department';

export default async function Contacts() {
  const { company } = useContext(Context);
  const { data: departments, isSuccess } = useDepartmentsWithContacts(
    company.external_identifier
  );

  return (
    <>
      <Header title={`Deildir & úttektaraðilar: ${company.name}`}>
        <div className="flex justify-center mt-4">
          <Button size="lg">
            Stofna deild
            <PlusIcon className="-mr-0.5 h-5 w-5 text-white"></PlusIcon>
          </Button>
        </div>
      </Header>
      {isSuccess && (
        <MemberAccountListWithContacts
          departments={departments}
        ></MemberAccountListWithContacts>
      )}
    </>
  );
}
