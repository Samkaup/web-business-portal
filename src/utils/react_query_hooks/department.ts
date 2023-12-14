import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import {
  DepartmentWithContacts,
  getDepartmentsByCompany,
  getDepartmentsWithContacts,
  getRecentDepartmentsByCompany
} from '../supabase_queries/department';

import { useContext } from 'react';
import { Context } from '@/utils/context-store';

export const useDepartments = () => {
  const { company } = useContext(Context);

  return useQuery<TableRow<'department'>[]>(
    ['department', company],
    async () => {
      return getDepartmentsByCompany(
        supabaseClient,
        company.external_identifier
      );
    },
    { keepPreviousData: true }
  );
};

export const useRecentDepartments = () => {
  const { company } = useContext(Context);

  return useQuery<TableRow<'department'>[]>(
    ['recentDepartment', company],
    async () => {
      return getRecentDepartmentsByCompany(
        supabaseClient,
        company.external_identifier
      );
    },
    { keepPreviousData: true }
  );
};

export const useDepartmentsWithContacts = () => {
  const { company } = useContext(Context);
  return useQuery<DepartmentWithContacts[]>({
    queryKey: ['department_with_contacts', company?.external_identifier],
    queryFn: async () => {
      return await getDepartmentsWithContacts({
        supabase: supabaseClient,
        company_id: company?.external_identifier
      });
    },
    refetchOnWindowFocus: true
  });
};
