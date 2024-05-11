/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { format } from 'date-fns';
import { is } from 'date-fns/locale';
import { useTransactionsTable } from '@/utils/react_query_hooks/transaction';
import { ColumnDef } from '@tanstack/react-table';
import InvoiceDownloadButton from '@/components/InvoiceDownloader';
import { formatCurrency } from '@/utils/currency/currency';
import { DataTable } from '@/components/DataTable/DataTable';
import { FilteredTransaction } from '@/types';

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
  // const { company } = useCompany();

  // const [csvDownloading, setCsvDownloading] = useState<boolean>(false);

  const query = useTransactionsTable({
    searchValue,
    dateRange: dates,
    filters: departmentIds.map((id: string) => `account_number.eq.${id}`)
  });

  // const handleDownloadData = async () => {
  //   setCsvDownloading(true);
  //   const transactions = await getAllTransactions({
  //     supabaseClient,
  //     dateRange: dates,
  //     companyId: company.external_identifier
  //   });
  //   const renamed = transactions.map((t) => {
  //     return {
  //       Dagsetning: t.date,
  //       Deild: t.department_name,
  //       Lýsing: t.description,
  //       Upphæð: t.amount_debit,
  //       Staða: t.statement_saldo
  //     };
  //   });
  //   downloadCSV(
  //     objectToCsv(renamed),
  //     `hreyfingar_${format(dates[0], 'ddMMyyyy')}_${format(
  //       dates[1],
  //       'ddMMyyyy'
  //     )}`
  //   );
  //   setCsvDownloading(false);
  // };

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
    },
    {
      accessorKey: 'transaction_id',
      id: 'transaction_id',
      header: null,
      cell: (props: any) => {
        if (props.getValue() !== '') {
          return <InvoiceDownloadButton transactionID={props.getValue()} />;
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
