/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { format } from 'date-fns';
import { is } from 'date-fns/locale';
import { ColumnDef } from '@tanstack/react-table';
import InvoiceDownloadButton from '@/components/InvoiceDownloader';
import { formatCurrency } from '@/utils/currency/currency';
import { DataTable } from '@/components/DataTable/DataTable';
import { FilteredInvoices } from '@/types';
import { useInvoiceTable } from '@/utils/react_query_hooks/invoices';

type Props = {
  searchValue: string;
  dates: Date[];
  departmentIds: string[];
};

export default function InvoiceTable({
  searchValue,
  dates,
  departmentIds
}: Props) {
  const query = useInvoiceTable({
    searchValue,
    dateRange: dates,
    filters: departmentIds.map((id: string) => `account_number.eq.${id}`)
  });

  const columns: ColumnDef<FilteredInvoices>[] = [
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
      accessorKey: 'invoice_number', // Name of attribute to access its data
      id: 'invoice_number', // Name of foriegn table and column for sorting
      header: () => <span>Reiknings nr.</span>,
      cell: (props: any) => (
        <span className="font-semibold">{props.getValue()}</span>
      )
    },

    {
      accessorKey: 'store_name', // Name of attribute to access its data
      id: 'store(name)', // Name of foriegn table and column for sorting
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
      accessorKey: 'amount',
      id: 'amount',
      header: () => <span>Upphæð</span>,
      cell: (props: any) => {
        return (
          <span className="font-semibold">
            {formatCurrency(props.getValue())}
          </span>
        );
      }
    },
    {
      accessorKey: 'id',
      id: 'id',
      header: null,
      cell: (props: any) => {
        if (props.getValue() !== '') {
          return <InvoiceDownloadButton id={props.getValue()} />;
        } else {
          return <></>;
        }
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
