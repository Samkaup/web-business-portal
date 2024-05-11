/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { format } from 'date-fns';
import { is } from 'date-fns/locale';
import { useTransactionsTable } from '@/utils/react_query_hooks/transaction';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/utils/currency/currency';
import { DataTable } from '@/components/DataTable/DataTable';
import { FilteredTransaction } from '@/types';

type Props = {
  searchValue: string;
  dates: Date[];
};

export default function TransactionTable({ searchValue, dates }: Props) {
  const query = useTransactionsTable({
    searchValue,
    dateRange: dates
  });

  const columns: ColumnDef<FilteredTransaction>[] = [
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
      accessorKey: 'voucher', // Name of attribute to access its data
      id: 'voucher', // Name of foriegn table and column for sorting
      header: () => <span>Fylgiskjals. Nr.</span>
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
      accessorKey: 'statement_number',
      id: 'statement_number',
      header: () => <span>Reikning. Nr</span>,
      cell: (props) => {
        return (
          <span>
            {props.row.original.description.startsWith('Reikn.') && (
              <>{props.row.original.voucher}</>
            )}
          </span>
        );
      }
    },
    {
      accessorKey: 'amount_debit',
      id: 'amount_debit',
      header: () => <span>Upphæð</span>,
      cell: (props: any) => {
        return <span>{formatCurrency(props.getValue())}</span>;
      }
    },
    {
      accessorKey: 'statement_saldo',
      id: 'statement_saldo',
      header: () => <span>Staða</span>,
      cell: (props: any) => {
        return <span>{formatCurrency(props.getValue())}</span>;
      }
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={query.data ? query.data.data : []}
      isLoading={query.isLoading}
    />
  );
}
