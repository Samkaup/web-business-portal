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
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/Shadcn/ui/alert';

export default function Contacts() {
  const { isOpen, setIsOpen } = useSlideOver();
  const { company } = useCompany();
  const { data: departments, isSuccess } = useDepartmentsWithContacts();

  return (
    <div>
      <Header title={`Deildir & úttektaraðilar`}>
        <div className="flex justify-between mt-4 items-center">
          <p className="mr-4 font-thin">Fyrirtæki: {company?.name ?? ''}</p>
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
            {departments.length === 1 && (
              <Alert className="my-4">
                <AlertTitle>Vissir þú?</AlertTitle>
                <AlertDescription>
                  Ef fyrirtækið þitt er með margar deildir eða viðskiptaeiningar
                  sem þú vilt stýra kostnað á. Þá er einfalt að setja upp deild
                  og úttektaraðila á deildina, við það færðu reikninginn með
                  þessum upplýsingum beint í fjárhagskerfið þitt. Einnig er hægt
                  að setja upp vöktun á úttektarheimild fyrir hverja deild, ef
                  notkun vex umfram heimild fá stjórnendur tilkynningu
                </AlertDescription>
              </Alert>
            )}
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
    </div>
  );
}
