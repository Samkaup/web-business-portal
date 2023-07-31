'use client';

import { Table } from '@/types';
import { useMemo, useState } from 'react';
import ReactTable from '@/components/ReactTable/ReactTable';
import { format } from 'date-fns';

type Props = {
  initialData: Table<'transaction'>[];
};

export default function ({ initialData }: Props) {
  const [searchValue, _] = useState('');

  const defaultSort = {
    id: 'created_at',
    desc: true,
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: () => <span>ID</span>,
      },
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
      },
      {
        accessorKey: 'contact_id',
        id: 'contact_id',
        header: () => <span>Contact</span>,
      },
    ],
    []
  );

  return (
    <ReactTable<'transaction'>
      columns={columns}
      tableName={'transaction'}
      selectQuery={'*'}
      searchColumns={['id', 'contact_id']}
      searchValue={searchValue}
      defaultSort={defaultSort}
      initialData={initialData}
    />
  );
}
