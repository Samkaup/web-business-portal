'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactTable from '@/components/ReactTable/ReactTable';
import { format } from 'date-fns';
import TextInput from '@/components/Input/textInput';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { DatePickerProvider } from '@rehookify/datepicker';

export default function () {
  const [searchValue, setSearchValue] = useState('');
  const [selectedDates, onDatesChange] = useState<Date[]>([]);

  const defaultSort = {
    id: 'created_at',
    desc: true,
  };

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
        accessorKey: 'contact',
        id: 'department',
        header: () => <span>Deild</span>,
        cell: (contact: any) => {
          return <span>{contact.getValue().department.name}</span>;
        },
      },
      {
        accessorKey: 'contact',
        id: 'contact',
        header: () => <span>Contact</span>,
        cell: (contact: any) => {
          return <span>{contact.getValue().full_name}</span>;
        },
      },
    ],
    []
  );

  useEffect(() => console.log(selectedDates), [selectedDates]);
  return (
    <DatePickerProvider
      config={{
        selectedDates,
        onDatesChange,
        dates: { mode: 'range' },
      }}
    >
      <DateRangePicker />
      <TextInput
        value={searchValue}
        onChange={setSearchValue}
        name="search"
        placeholder="Leita í Lista"
      />
      <ReactTable<'transaction'>
        columns={columns}
        tableName={'transaction'}
        selectQuery={'*, contact!inner(full_name, department!inner (name))'}
        searchValue={searchValue}
        defaultSort={defaultSort}
      />
    </DatePickerProvider>
  );
}
