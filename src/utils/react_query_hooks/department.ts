import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import {
  DepartmentWithContacts,
  getDepartments,
  getDepartmentsWithContacts,
} from '../supabase_queries/department';

export const useDepartments = () => {
  return useQuery<TableRow<'department'>[]>(
    ['department'],
    async () => {
      return getDepartments(supabaseClient);
    },
    { keepPreviousData: true }
  );
};

export const useDepartmentsWithContacts = (company_id: string) => {
  return useQuery<DepartmentWithContacts[]>({
    queryKey: ['department_with_contacts', company_id],
    queryFn: async () => {
      return await getDepartmentsWithContacts({
        supabase: supabaseClient,
        company_id: company_id,
      });
    },
    refetchOnWindowFocus: false,
  });
};
