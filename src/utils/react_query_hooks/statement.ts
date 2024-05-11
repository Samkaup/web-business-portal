import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getLastStatement } from '../supabase_queries/statement';

type Props = {
  date: Date;
  accountNumber: string;
};
export const useLastStatement = ({ date, accountNumber }: Props) => {
  const enabled = date ? true : false;
  return useQuery<TableRow<'statement'>>({
    queryKey: ['statements', accountNumber, date],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (date) {
        return getLastStatement({
          supabase: supabaseClient,
          date: date,
          accountNumber
        });
      }
    },
    enabled
  });
};

export const useCurrentStatement = ({ date, accountNumber }: Props) => {
  const enabled = date ? true : false;
  return useQuery<TableRow<'statement'>>({
    queryKey: ['current-statements', accountNumber],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (date) {
        return getLastStatement({
          supabase: supabaseClient,
          date: date,
          accountNumber
        });
      }
    },
    enabled
  });
};
