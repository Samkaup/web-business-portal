import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Database } from '@/lib/database.types';
import { useSessionStorage } from 'usehooks-ts';
import { useCompanies } from '@/utils/react_query_hooks/company';

export type TCompany = Database['public']['Tables']['company']['Row'];

const useCompany = () => {
  const queryClient = useQueryClient();
  const [company, setCompany] = useSessionStorage<TCompany | null>(
    'selected-company',
    null
  );

  const { data, isLoading, error, isSuccess } = useCompanies();
  const companies = data?.companies || [];

  const setSelectedCompany = (company: TCompany | undefined) => {
    setCompany(company); // Update session storage
    queryClient.setQueryData(['selectedCompany'], company); // Update query client
    queryClient.invalidateQueries(['selectedDepartmentsTransaction']);
  };

  useEffect(() => {
    if (isSuccess && companies.length > 0) {
      if (
        !company ||
        !companies.find(
          (c: TCompany) =>
            c.external_identifier === company?.external_identifier
        )
      ) {
        setSelectedCompany(companies[0]);
      }
    }
  }, [company, companies, isSuccess]);

  return {
    company,
    setSelectedCompany,
    companies,
    isLoading,
    isSuccess,
    error
  };
};

export { useCompany };
