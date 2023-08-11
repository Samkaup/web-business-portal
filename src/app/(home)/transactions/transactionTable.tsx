'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import QueryTable from '@/components/ReactTable/QueryTable';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { getDetailedTransactions } from '@/utils/supabase_queries/detailed_transaction';
import { useQuery } from '@tanstack/react-query';
import supabaseBrowser from '@/utils/supabase-browser';
import { Row } from '@/types';

type Props = {
  searchValue: string;
  dates: Date[];
  contact: Row<'contact'>;
};

export default function TransactionTable({
  searchValue,
  dates,
  contact,
}: Props) {
  const defaultSort = {
    id: 'created_at',
    desc: true,
  };
  const [sorting, setSorting] = useState<SortingState>([defaultSort]);
  const basePageSize = 20;
  const pageSizes = [basePageSize, 50, 100];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: basePageSize,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'created_at',
        id: 'created_at',
        header: () => <span>Stofnað</span>,
        cell: (props: any) => {
          return (
            <span>{format(new Date(props.getValue()), 'dd. MMM HH:mm')}</span>
          );
        },
      },
      {
        accessorKey: 'amount',
        id: 'amount',
        header: () => <span>Amount</span>,
        cell: (props: any) => `${props.getValue()} kr`,
      },
      {
        accessorKey: 'department_name',
        id: 'department_name',
        header: () => <span>Deild</span>,
        cell: (contact: any) => {
          return <span>{contact.getValue()}</span>;
        },
      },
      {
        accessorKey: 'contact_name',
        id: 'contact_name',
        header: () => <span>Úttektaraðili</span>,
        cell: (contact: any) => {
          return <span>{contact.getValue()}</span>;
        },
      },
    ],
    []
  );

  const fetchData = async () => {
    const rangeFrom = pagination.pageIndex * pagination.pageSize;
    const rangeTo = (pagination.pageIndex + 1) * pagination.pageSize - 1;

    // Filters
    const filters: string[] = [];
    if (contact) filters.push(`contact_id.eq.${contact.id}`);

    const { data, count } = await getDetailedTransactions({
      supabaseClient: supabaseBrowser,
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
      searchValue: searchValue,
      dateRange: dates,
      filters,
    });

    return { data, rowCount: count };
  };

  const query = useQuery(
    [
      'detailed_transaction',
      { pagination, sorting, searchValue, dates, contact },
    ],
    async () => fetchData(),
    { keepPreviousData: true }
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
