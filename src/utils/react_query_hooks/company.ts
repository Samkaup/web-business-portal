import { TableRow } from '@/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import supabaseClient from '@/utils/supabase-browser';
import { getCompany } from '@/utils/supabase_queries/company';
import { PaginationProps } from '../utilTypes';

export const useCompanies = (search?: string) => {
  return useQuery<TableRow<'company'>[]>(['company'], async () => {
    return getCompany(supabaseClient, {}, search);
  });
};

export const useCompaniesPagination = (
  pagination: PaginationProps,
  search?: string
) => {
  return useQuery<TableRow<'company'>[]>(
    ['company-pagination', { pagination, search }],
    async () => {
      return getCompany(supabaseClient, pagination, search);
    }
  );
};

export const useInfiniteCompanies = (
  pagination: PaginationProps,
  search?: string
) => {
  return useInfiniteQuery<TableRow<'company'>[]>(
    ['company-infinite', { pagination, search }],
    async ({ pageParam = 1 }) => {
      return getCompany(
        supabaseClient,
        { ...pagination, page: pageParam },
        search
      );
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < pagination.pageSize) {
          return undefined;
        }
        return allPages.length + 1;
      }
    }
  );
};
