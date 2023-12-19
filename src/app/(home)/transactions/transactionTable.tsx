'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { DocumentIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { is } from 'date-fns/locale';
import supabaseClient from '@/utils/supabase-browser';
import { useTransactionsTable } from '@/utils/react_query_hooks/transaction';
import QueryTable from '@/components/QueryTable/QueryTable';
import { getAllTransactions } from '@/utils/supabase_queries/transaction';
import { downloadCSV, objectToCsv } from '@/utils/csv';
import { useCompany } from '@/hooks/useCompany';

type Props = {
  searchValue: string;
  dates: Date[];
  departmentIds: string[];
};

export default function TransactionTable({
  searchValue,
  dates,
  departmentIds
}: Props) {
  const { company } = useCompany();
  const defaultSort = {
    id: 'date',
    desc: true
  };

  const [sorting, setSorting] = useState<SortingState>([defaultSort]);
  const basePageSize = 15;
  const pageSizes = [basePageSize, 30, 50, 100];
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: basePageSize
  });

  const query = useTransactionsTable({
    pagination,
    sorting,
    searchValue,
    dateRange: dates,
    filters: departmentIds.map((id: string) => `account_number.eq.${id}`)
  });

  const handleDownloadData = async () => {
    setIsDownloading(true);
    const transactions = await getAllTransactions({
      supabaseClient,
      sorting: {
        column: sorting[0].id,
        options: {
          ascending: !sorting[0].desc
        }
      },
      searchValue,
      dateRange: dates,
      filters: departmentIds.map((id: string) => `account_number.eq.${id}`),
      companyId: company.external_identifier
    });

    downloadCSV(objectToCsv(transactions), 'hreyfingar');
    setIsDownloading(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'date', // Name of attribute to access its data
        id: 'date', // Name of column for sorting
        header: () => <span>Dagsetning</span>,
        cell: (props: any) => {
          return (
            <span>
              {format(new Date(props.getValue()), 'dd. MMM yyyy', {
                locale: is
              })}
            </span>
          );
        }
      },
      {
        accessorKey: 'store_number',
        id: 'store_number',
        header: () => <span>Verslun</span>
      },
      {
        accessorKey: 'department_name', // Name of attribute to access its data
        id: 'department(name)', // Name of foriegn table and column for sorting
        header: () => <span>Deild</span>
      },
      {
        accessorKey: 'description',
        id: 'description',
        header: () => <span>Skýring</span>
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
        }
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: null,
        cell: (_: any) => {
          return (
            <Link href="#" className="hover:text-company-700 inline-flex">
              <DocumentIcon className="h-4 w-4 mr-2"></DocumentIcon>Reikningur
            </Link>
          );
        }
      }
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
      onDownload={handleDownloadData}
      isDownloading={isDownloading}
    />
  );
}
