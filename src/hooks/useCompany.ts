import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStorage } from 'usehooks-ts';
import { useCompanies } from '@/utils/react_query_hooks/company';
import { TableRow } from '@/types';

export type TCompany = TableRow<'company'>;
const useCompany = (search?: string) => {
  const queryClient = useQueryClient();
  const [company, setCompany] = useSessionStorage<TCompany | null>(
    'selected-company',
    null
  );
  const { data, isLoading, error, isSuccess } = useCompanies(search);
  const setSelectedCompany = (company: TCompany | undefined) => {
    setCompany(company); // Update session storage
    queryClient.setQueryData(['selectedCompany'], company); // Update query client
    queryClient.invalidateQueries(['selectedDepartmentsTransaction']);
  };

  useEffect(() => {
    if (isSuccess && data.length > 0) {
      if (
        !company ||
        !data.find(
          (c: TCompany) =>
            c.external_identifier === company?.external_identifier
        )
      ) {
        if (!company) {
          setSelectedCompany(data[0]);
        }
      }
    }
  }, [company, data, isSuccess]);

  return {
    company,
    setSelectedCompany,
    companies: data,
    isLoading,
    isSuccess,
    error
  };
};

export { useCompany };
