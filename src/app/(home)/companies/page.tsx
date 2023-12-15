'use client';

import Header from '@/components/Header/Header';
import { Button } from '@/components/Shadcn/ui/button';
import { Card } from '@/components/Shadcn/ui/card';
import { Separator } from '@/components/Shadcn/ui/separator';
import ModalSimpleWithDismiss from '@/components/ui/ModalSimpleWithDismiss/ModalSimpleWithDismiss';
import { TableRow } from '@/types';
import { Context } from '@/utils/context-store';
import { useCompaniesPagination } from '@/utils/react_query_hooks/company';
import { useGetProfile } from '@/utils/react_query_hooks/profile';
import supabaseBrowser from '@/utils/supabase-browser';
import { useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';

export default async function Companies() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { company, setCompany } = useContext(Context);
  const [companyToDelete, setCompanyToDelete] =
    useState<TableRow<'company'> | null>(null);
  const { data: userProfile } = useGetProfile();
  const queryClient = useQueryClient();
  const { data: companies, isSuccess } = useCompaniesPagination({
    page: 1,
    pageSize: 10
  });

  const deleteCompanyProfile = async (companyId: string) => {
    const { error } = await supabaseBrowser
      .from('company_profile')
      .delete()
      .eq('company_id', companyId)
      .eq('profile_id', userProfile.profile.id);

    if (error) {
      toast.error('Ekki var hægt að uppfæra netfangið');
      console.error(error);
      return;
    }

    // Change company context if the company being deleted is the same as the one in context
    if (company?.external_identifier === companyId) {
      setCompany(companies.at(1));
    }

    setShowModal(false);
    queryClient.invalidateQueries();
  };

  return (
    <div className="space-y-6">
      <ModalSimpleWithDismiss
        title=""
        open={showModal}
        onAction={() =>
          deleteCompanyProfile(companyToDelete?.external_identifier)
        }
        onCancel={() => setShowModal(false)}
        description={'Ertu viss um að þú viljir eyða þessu fyrirtæki?'}
      />
      <Header title="Fyrirtæki" />
      <p className="text-sm text-muted-foreground">
        Hér getur þú skoðað og breytt fyrirtækjum sem þú hefur aðgang að.
      </p>
      <Separator />

      {isSuccess &&
        companies.map((company: TableRow<'company'>, idx: number) => (
          <Card key={idx} className="p-3  flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{company.name}</h3>
              <h4 className="text-sm text-muted-foreground">
                {company.external_identifier}
              </h4>
            </div>

            <Button
              variant="destructive"
              onClick={() => {
                setShowModal(true);
                setCompanyToDelete(company);
              }}
            >
              Eyða
            </Button>
          </Card>
        ))}
    </div>
  );
}
