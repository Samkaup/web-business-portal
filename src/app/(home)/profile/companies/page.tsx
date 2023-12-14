'use client';

import { Separator } from '@/components/Shadcn/ui/separator';
import { Context } from '@/utils/context-store';
import { useCompanies } from '@/utils/react_query_hooks/company';
import { useContext } from 'react';

export default async function Companies() {
  const { company, setCompany } = useContext(Context);
  const { data, isSuccess } = useCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tilkynningar</h3>
        <p className="text-sm text-muted-foreground">
          Hér getur þú sillt tilkynningar sem verða sentar á netfangið þitt.
        </p>
      </div>
      <Separator />
    </div>
  );
}
