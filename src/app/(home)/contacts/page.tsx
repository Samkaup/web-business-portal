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

export default function Contacts() {
  const { company, slideOver } = useContext(Context);

  const { data: departments, isSuccess } = useDepartmentsWithContacts(
    company?.external_identifier
  );

  return (
    <>
      <Header title={`Deildir & úttektaraðilar: ${company?.name ?? ''}`}>
        <div className="flex justify-center mt-4">
          <Button size="lg" onClick={() => slideOver.toggle(true)}>
            Stofna deild
            <PlusIcon className="-mr-0.5 h-5 w-5 text-white"></PlusIcon>
          </Button>
        </div>
      </Header>
      <Suspense fallback={<LoadingSkeleton />}>
        <SlideOver
          isOpen={slideOver.isOpen}
          title="Ný deild"
          description="Deildir aðgreina úttektaraðila og veita aukið upplýsingaflæði um úttekt."
          toggleOpen={slideOver.toggle}
          onCancel={() => slideOver.toggle(false)}
        >
          Here be form, beware
        </SlideOver>
        {isSuccess && (
          <div>
            {departments.length > 0 ? (
              <MemberAccountListWithContacts
                departments={departments}
              ></MemberAccountListWithContacts>
            ) : (
              <span className="mt-6">
                <EmptyStateSimple
                  title="Engar deildir"
                  subtitle="Deildir eru notaða til að aðgreina úttektaraðila, þú færð einnig þær upplýsingar á rafrænum reikningi."
                  actionBtnClick={() => {
                    false;
                  }}
                  actionBtnText="Stofna deild"
                />
              </span>
            )}
          </div>
        )}
      </Suspense>
    </>
  );
}
