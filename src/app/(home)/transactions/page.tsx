'use client';
import Header from '@/components/Header/Header';
import TextInput from '@/components/ui/Input/textInput';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { DateRangePreset } from '@/components/ui/DateRangePicker/index.types';
import {
  getDateDaysAgo,
  getDateMonthsAgo,
  getDateNow,
} from '@/utils/dateUtils';
import { DatePickerProvider } from '@rehookify/datepicker';
import { useState } from 'react';
import TransactionTable from './transactionTable';
import Select from '@/components/ui/Select';
import { Row } from '@/types';
import { useGetContacts } from '@/utils/react_query_hooks/contact';

export default function Transactions() {
  const dateToday = getDateNow();

  const [searchValue, setSearchValue] = useState('');
  const [selectedDates, onDatesChange] = useState<Date[]>([
    getDateDaysAgo(14),
    dateToday,
  ]);
  const [selectedContact, setSelectedContact] = useState<Row<'contact'> | null>(
    null
  );
  const contacts = useGetContacts();

  const updateContact = (id: string) => {
    const selectedCompany = contacts.data.find(
      (c) => c.external_identifier.toString() === id
    );
    setSelectedContact(selectedCompany);
  };

  const dateRangePresets: DateRangePreset[] = [
    {
      lable: 'Síðustu 5 dagar',
      dates: [getDateDaysAgo(4), dateToday],
    },
    {
      lable: 'Síðustu 14 dagar',
      dates: [getDateDaysAgo(13), dateToday],
    },
    {
      lable: 'Síðustu 30 dagar',
      dates: [getDateDaysAgo(29), dateToday],
    },
    {
      lable: 'Síðustu 3 mánuðir',
      dates: [getDateMonthsAgo(3), dateToday],
    },
    {
      lable: 'Síðustu 6 mánuðir',
      dates: [getDateMonthsAgo(6), dateToday],
    },
  ];
  return (
    <>
      <Header title="Reikningar og hreyfingar" />

      <DatePickerProvider
        config={{
          selectedDates,
          onDatesChange,
          dates: { mode: 'range', maxDate: new Date() },
        }}
      >
        <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-4">
              <DateRangePicker
                selectedDates={selectedDates}
                setSelectedDates={onDatesChange}
                presets={dateRangePresets}
              />
              <Select
                options={
                  contacts.isSuccess
                    ? [
                        { id: null, label: 'Allir úttektaraðilar' },
                        ...contacts.data.map((c) => ({
                          id: c.external_identifier,
                          label: c.full_name,
                          key: c.external_identifier,
                        })),
                      ]
                    : [{ id: '', label: '' }]
                }
                onChange={(e) => updateContact(e.target.value)}
                className="h-full"
              />
            </div>

            <TextInput
              value={searchValue}
              onChange={setSearchValue}
              name="search"
              placeholder="Leita í Lista"
              className="w-80"
            />
          </div>
          <TransactionTable
            searchValue={searchValue}
            dates={selectedDates}
            contact={selectedContact}
          />
        </div>
      </DatePickerProvider>
    </>
  );
}
