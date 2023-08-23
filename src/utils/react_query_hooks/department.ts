import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getDepartments } from '../supabase_queries/department';

export const useDepartments = () => {
  return useQuery<TableRow<'department'>[]>(
    ['department'],
    async () => {
      return getDepartments(supabaseClient);
    },
    { keepPreviousData: true }
  );
};
