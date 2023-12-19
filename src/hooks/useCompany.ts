import { useQueryClient } from '@tanstack/react-query';
import { Database } from '@/lib/database.types';
import { useSessionStorage } from 'usehooks-ts';
import { useCompanies } from '@/utils/react_query_hooks/company';

export type TCompany = Database['public']['Tables']['company']['Row'];

const useCompany = () => {
  const queryClient = useQueryClient();
  const [company, setCompany] = useSessionStorage<TCompany>(
    'selected-company',
    {
      name: '',
      external_identifier: '',
      created_at: '',
      credit_limit_amount: 0,
      updated_at: ''
    }
  );

  // Fetch loyalty clubs
  const { data: companies, isLoading, error, isSuccess } = useCompanies();

  // Update the selected loyalty club both in session storage and query client
  const setSelectedCompany = (company: TCompany | undefined) => {
    setCompany(company); // Update session storage
    queryClient.setQueryData(['selectedCompany'], company); // Update query client
  };

  // Initialize the selected loyalty club from session storage or the first club
  if (!company && companies) {
    setSelectedCompany(companies[0]);
  }

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
