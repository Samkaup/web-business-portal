'use client';
import { Suspense } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header/Header';
import Button from '@/components/ui/Button/Button';
import { SlideOver } from '@/components/ui/SlideOver/SlideOver';
import MemberAccountListWithContacts from '@/components/MemberAccount/MemberAccount.List';
import { useDepartmentsWithContacts } from '@/utils/react_query_hooks/department';
import EmptyStateSimple from '@/components/ui/EmptyState/EmptyStateSimple';
import LoadingSkeleton from '@/components/LoadingSkeleton/LoadingSkeleton';
import DepartmentCreate from '@/components/DepartmentForm/Create';
import useSlideOver from '@/hooks/useSlideOver';
import { useCompany } from '@/hooks/useCompany';

export default function Contacts() {
  const { isOpen, setIsOpen } = useSlideOver();
  const { company } = useCompany();
  const { data: departments, isSuccess } = useDepartmentsWithContacts();

  return (
    <>
      <Header title={`Deildir & úttektaraðilar: ${company?.name ?? ''}`}>
        <div className="flex justify-center mt-4">
          <Button size="lg" onClick={() => setIsOpen(true)}>
            Stofna deild
            <PlusIcon className="-mr-0.5 h-5 w-5 text-white" />
          </Button>
        </div>
      </Header>
      <Suspense fallback={<LoadingSkeleton />}>
        <SlideOver
          isOpen={isOpen}
          title="Ný deild"
          description="Deildir aðgreina úttektaraðila og veita aukið upplýsingaflæði um úttekt."
          toggleOpen={() => setIsOpen(true)}
          onCancel={() => setIsOpen(false)}
        >
          <DepartmentCreate
            onSave={() => setIsOpen(false)}
            onCancel={() => setIsOpen(false)}
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
                  actionBtnClick={() => setIsOpen(true)}
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
