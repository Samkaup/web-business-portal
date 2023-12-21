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
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useCompany } from '@/hooks/useCompany';

export const useTransactions = () => {
  return useQuery<TableRow<'transaction'>[]>(['transactions'], async () => {
    return getTransactions(supabaseClient);
  });
};

export const useRecentTransactions = (limit?: number) => {
  const { company } = useCompany();

  return useQuery<TableRow<'transaction'>[]>(
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
  pagination?: PaginationState;
  sorting?: SortingState;
  searchValue?: string | string[];
  dateRange?: Date[];
  filters?: string[];
};

export const useTransactionsTable = ({
  pagination,
  sorting,
  searchValue,
  dateRange,
  filters
}: Payload) => {
  const { company } = useCompany();

  return useQuery<QueryDataAndCount<FilteredTransaction>>(
    [
      'transactionsTable',
      {
        pagination,
        sorting,
        searchValue,
        dateRange,
        filters,
        company
      }
    ],
    async () => {
      if (!company) return { rowCount: 0, data: [] };

      // Construct range
      const rangeFrom = pagination.pageIndex * pagination.pageSize;
      const rangeTo = (pagination.pageIndex + 1) * pagination.pageSize - 1;

      // Extract transactions
      return await getTransactionsTable({
        supabaseClient,
        range: {
          from: rangeFrom,
          to: rangeTo
        },
        sorting:
          sorting.length > 0
            ? {
                column: sorting[0].id,
                options: {
                  ascending: !sorting[0].desc
                }
              }
            : undefined,
        searchValue,
        dateRange,
        filters: filters,
        companyId: company.external_identifier
      });
    },
    { keepPreviousData: true }
  );
};
