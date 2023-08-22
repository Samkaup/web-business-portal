import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getTransactions } from '../supabase_queries/transaction';

export const useTransactions = () => {
  return useQuery<TableRow<'transaction'>[]>(['transaction'], async () => {
    return getTransactions(supabaseClient);
  });
};
