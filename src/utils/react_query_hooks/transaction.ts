import { FilteredTransaction, Row, TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import {
  getRecentCompanyTransactions,
  getTransactions,
  getTransactionsAndSumByMonth,
  getTransactionsTable
} from '../supabase_queries/transaction';
import { QueryDataAndCount } from '../utilTypes';
import { useCompany } from '@/hooks/useCompany';

export const useTransactions = () => {
  return useQuery<TableRow<'transaction'>[]>(['transactions'], async () => {
    return getTransactions(supabaseClient);
  });
};
type TStore = {
  name: string;
};
type TransactionWithStore = TableRow<'transaction'> & { store: TStore } & {
  department: TableRow<'department'>;
};

export const useRecentTransactions = (limit?: number) => {
  const { company } = useCompany();

  return useQuery<TransactionWithStore[]>(
    ['recentTransaction', { company, limit }],
    async () => {
      // Extract transactions
      return await getRecentCompanyTransactions({
        supabase: supabaseClient,
        companyId: company?.external_identifier,
        limit
      });
    }
  );
};

export const useTransactionsByMonth = (year: number) => {
  const { company } = useCompany();

  return useQuery(['transactionsByMonth', { company, year }], async () => {
    // Extract transactions
    return await getTransactionsAndSumByMonth({
      supabase: supabaseClient,
      companyId: company?.external_identifier,
      year: year
    });
  });
};

export type DepartmentsMap = {
  [key: Row<'department'>['external_identifier']]: Row<'department'>['name'];
};

type Payload = {
  searchValue?: string | string[];
  dateRange?: Date[];
  filters?: string[];
};

export const useTransactionsTable = ({
  searchValue,
  dateRange,
  filters
}: Payload) => {
  const { company } = useCompany();

  return useQuery<QueryDataAndCount<FilteredTransaction>>(
    [
      'transactionsTable',
      {
        searchValue,
        dateRange,
        filters,
        company
      }
    ],
    async () => {
      if (!company) {
        return { rowCount: 0, data: [] };
      }

      // Extract transactions
      return await getTransactionsTable({
        supabaseClient,
        dateRange,
        companyId: company.external_identifier
      });
    },
    { keepPreviousData: true }
  );
};
