'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { DocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { is } from 'date-fns/locale';
import { useTransactionsTable } from '@/utils/react_query_hooks/transaction';
import QueryTable from '@/components/QueryTable/QueryTable';

type Props = {
  searchValue: string;
  dates: Date[];
  departmentIds: string[];
};

export default function TransactionTable({
  searchValue,
  dates,
  departmentIds,
}: Props) {
  const defaultSort = {
    id: 'date',
    desc: true,
  };

  const [sorting, setSorting] = useState<SortingState>([defaultSort]);
  const basePageSize = 15;
  const pageSizes = [basePageSize, 30, 50, 100];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: basePageSize,
  });

  const query = useTransactionsTable({
    pagination,
    sorting,
    searchValue,
    dateRange: dates,
    filters: departmentIds.map((id: string) => `account_number.eq.${id}`),
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date',
        id: 'date',
        header: () => <span>Dagsetning</span>,
        cell: (props: any) => {
          return (
            <span>
              {format(new Date(props.getValue()), 'dd. MMM yyyy', {
                locale: is,
              })}
            </span>
          );
        },
      },
      {
        accessorKey: 'store_number',
        id: 'store_number',
        header: () => <span>Verslun</span>,
      },
      {
        accessorKey: 'account_number',
        id: 'accessor_number',
        header: () => <span>Deild</span>,
        cell: async (dep: any) => <span>{dep.getValue()}</span>,
      },
      {
        accessorKey: 'description',
        id: 'description',
        header: () => <span>Skýring</span>,
      },
      {
        accessorKey: 'amount_debit',
        id: 'amount_debit',
        header: () => <span>Upphæð (Deb)</span>,
        cell: (props: any) => {
          return (
            <span>
              {props
                .getValue()
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
              kr.
            </span>
          );
        },
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => <span></span>,
        cell: (_: any) => {
          return (
            <Link href="#" className="hover:text-company-700 inline-flex">
              <DocumentIcon className="h-4 w-4 mr-2"></DocumentIcon>Reikningur
            </Link>
          );
        },
      },
    ],
    []
  );

  return (
    <QueryTable
      query={query}
      columns={columns}
      sortingState={sorting}
      setSortingState={setSorting}
      paginationState={pagination}
      setPaginationState={setPagination}
      pageSizes={pageSizes}
    />
  );
}
