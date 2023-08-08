import { Table } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getCompany } from '@/utils/supabase_queries/company';

export const useGetCompany = () => {
  return useQuery<Table<'company'>[]>(['company'], async () => {
    return getCompany(supabaseClient);
  });
};
