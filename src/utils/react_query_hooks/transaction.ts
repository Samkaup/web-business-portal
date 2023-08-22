import { TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import {
  getTransactions,
  getTransactionsTable,
} from '../supabase_queries/transaction';
import { QueryDataAndCount } from '../utilTypes';
import { PaginationState, SortingState } from '@tanstack/react-table';

export const useTransactions = () => {
  return useQuery<TableRow<'transaction'>[]>(['transactions'], async () => {
    return getTransactions(supabaseClient);
  });
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
  filters,
}: Payload) => {
  return useQuery<QueryDataAndCount<TableRow<'transaction'>>>(
    [
      'transactionsTable',
      {
        pagination,
        sorting,
        searchValue,
        dateRange,
        filters,
      },
    ],
    async () => {
      const rangeFrom = pagination.pageIndex * pagination.pageSize;
      const rangeTo = (pagination.pageIndex + 1) * pagination.pageSize - 1;

      return getTransactionsTable({
        supabaseClient,
        range: {
          from: rangeFrom,
          to: rangeTo,
        },
        sorting: {
          column: sorting[0].id,
          options: {
            ascending: !sorting[0].desc,
          },
        },
        searchValue,
        dateRange,
        filters,
      });
    },
    { keepPreviousData: true }
  );
};
