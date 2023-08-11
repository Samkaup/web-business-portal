import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getContacts } from '../supabase_queries/contact';

export const useGetContacts = () => {
  return useQuery<TableRow<'contact'>[]>(['contact'], async () => {
    return getContacts(supabaseClient);
  });
};
