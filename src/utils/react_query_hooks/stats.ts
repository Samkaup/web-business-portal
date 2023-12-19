import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';

import { getTransactionSumByDate } from '../supabase_queries/transaction';
import { useCompany } from '@/hooks/useCompany';

type Props = {
  dateFrom: Date;
  dateTo: Date;
};

export const useTransactionSumByDate = ({ dateFrom, dateTo }: Props) => {
  const { company } = useCompany();
  return useQuery<{
    amount: number;
    count: number;
    average: number;
    min: number;
    max: number;
  }>({
    queryKey: ['transaction_sum_by_date', company, dateFrom, dateTo],
    queryFn: async () => {
      return await getTransactionSumByDate({
        supabase: supabaseClient,
        companyId: company?.external_identifier,
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    },
    refetchOnWindowFocus: true
  });
};
