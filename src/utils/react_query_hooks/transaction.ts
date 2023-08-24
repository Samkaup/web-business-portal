import { Row, TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import {
  getTransactions,
  getTransactionsTable,
} from '../supabase_queries/transaction';
import { QueryDataAndCount } from '../utilTypes';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { getDepartments } from '../supabase_queries/department';

export const useTransactions = () => {
  return useQuery<TableRow<'transaction'>[]>(['transactions'], async () => {
    return getTransactions(supabaseClient);
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
  filters,
}: Payload) =>
  useQuery<QueryDataAndCount<TableRow<'transaction'>>>(
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
      // Construct range
      const rangeFrom = pagination.pageIndex * pagination.pageSize;
      const rangeTo = (pagination.pageIndex + 1) * pagination.pageSize - 1;

      const [transactions, departments] = await Promise.all([
        // Extract transactions
        getTransactionsTable({
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
        }),
        // Extract departments
        getDepartments(supabaseClient),
      ]);

      // Create a departments hashmap for quicker lookup
      const departmentsMap = departments.reduce(function (
        map: DepartmentsMap,
        dep: Row<'department'>
      ) {
        map[dep.external_identifier] = dep.name;
        return map;
      },
      {});

      // Construct response
      const output = {
        rowCount: transactions.rowCount,
        data: transactions.data.map((t: Row<'transaction'>) => ({
          ...t,
          account_number: departmentsMap[t.account_number],
        })),
      };

      return output;
    },
    { keepPreviousData: true }
  );
