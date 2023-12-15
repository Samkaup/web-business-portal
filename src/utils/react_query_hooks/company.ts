import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getCompany } from '@/utils/supabase_queries/company';
import { PaginationProps } from '../utilTypes';

export const useCompanies = () => {
  return useQuery<TableRow<'company'>[]>(['company'], async () => {
    return getCompany(supabaseClient, {});
  });
};

export const useCompaniesPagination = (pagination: PaginationProps) => {
  return useQuery<TableRow<'company'>[]>(
    ['company-pagination', { pagination }],
    async () => {
      return getCompany(supabaseClient, pagination);
    }
  );
};
