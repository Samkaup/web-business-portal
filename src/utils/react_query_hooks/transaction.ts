import { Row, TableRow } from '@/types';
import { useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import {
  getTransactions,
  getTransactionsTable,
} from '../supabase_queries/transaction';
import { QueryDataAndCount } from '../utilTypes';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { getDepartmentsByCompany } from '../supabase_queries/department';
import { useContext } from 'react';
import { Context } from '../context-store';

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
}: Payload) => {
  const { company } = useContext(Context);

  return useQuery<QueryDataAndCount<TableRow<'transaction'>>>(
    [
      'transactionsTable',
      {
        pagination,
        sorting,
        searchValue,
        dateRange,
        filters,
        company,
      },
    ],
    async () => {
      if (!company) return { rowCount: 0, data: [] };

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
          filters: filters,
          companyId: company.external_identifier,
        }),
        // Extract departments
        getDepartmentsByCompany(supabaseClient, company.external_identifier),
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
      return {
        rowCount: transactions.rowCount,
        data: transactions.data.map((t: Row<'transaction'>) => ({
          ...t,
          account_number: departmentsMap[t.account_number],
        })),
      };
    },
    { keepPreviousData: true }
  );
};
