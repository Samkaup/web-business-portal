import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getLastStatement } from '../supabase_queries/statement';

type Props = {
  date: string;
  accountNumber: string;
};
export const useLastStatement = ({ date, accountNumber }: Props) => {
  const enabled = date ? true : false;
  return useQuery<TableRow<'statement'>>({
    queryKey: ['statements', accountNumber],
    queryFn: async () => {
      if (date) {
        return getLastStatement({
          supabase: supabaseClient,
          date: new Date(date),
          accountNumber
        });
      }
    },
    enabled
  });
};
