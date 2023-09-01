'use client';
import { Suspense, useContext } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header/Header';
import Button from '@/components/ui/Button/Button';
import { SlideOver } from '@/components/ui/SlideOver/SlideOver';
import MemberAccountListWithContacts from '@/components/MemberAccount/MemberAccount.List';
import { Context } from '@/utils/context-store';
import { useDepartmentsWithContacts } from '@/utils/react_query_hooks/department';
import EmptyStateSimple from '@/components/ui/EmptyState/EmptyStateSimple';
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';
import DepartmentCreate from '@/components/DepartmentForm/Create';

export default function Contacts() {
  const { company, slideOver } = useContext(Context);
  const { data: departments, isSuccess } = useDepartmentsWithContacts(
    company?.external_identifier
  );

  return (
    <>
      <Header title={`Deildir & úttektaraðilar: ${company?.name ?? ''}`}>
        <div className="flex justify-center mt-4">
          <Button size="lg" onClick={() => slideOver.setIsOpen(true)}>
            Stofna deild
            <PlusIcon className="-mr-0.5 h-5 w-5 text-white" />
          </Button>
        </div>
      </Header>
      <Suspense fallback={<LoadingSkeleton />}>
        <SlideOver
          isOpen={slideOver.isOpen}
          title="Ný deild"
          description="Deildir aðgreina úttektaraðila og veita aukið upplýsingaflæði um úttekt."
          toggleOpen={() => slideOver.setIsOpen(true)}
          onCancel={() => slideOver.setIsOpen(false)}
        >
          <DepartmentCreate
            onSave={() => slideOver.setIsOpen(false)}
            onCancel={() => slideOver.setIsOpen(false)}
          />
        </SlideOver>
        {isSuccess && (
          <div>
            {departments.length > 0 ? (
              <MemberAccountListWithContacts
                departments={departments}
              ></MemberAccountListWithContacts>
            ) : (
              <div className="pt-10">
                <EmptyStateSimple
                  title={`Engar deildir skráðar fyrir ${company?.name}`}
                  subtitle="Deildir eru til að aðgreina úttektaraðila milli viðskiptaeininga, þær upplýsingar berast svo með rafrænum reikningi."
                  actionBtnClick={() => slideOver.setIsOpen(true)}
                  actionBtnText="Stofna deild"
                />
              </div>
            )}
          </div>
        )}
      </Suspense>
    </>
  );
}
