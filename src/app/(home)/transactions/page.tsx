'use client';
import Header from '@/components/Header/Header';
import { DateRangePreset } from '@/components/ui/DateRangePicker/index.types';
import {
  getDateDaysAgo,
  getDateMonthsAgo,
  getDateNow,
  getStartOfYear,
  getEndOfYear
} from '@/utils/dateUtils';
import { useState } from 'react';
import TransactionTable from './transactionTable';
import { useDepartments as useDepartmentsHook } from '@/utils/react_query_hooks/department';
import { Row } from '@/types';
import { DebouncedInput } from '@/components/ui/Input/debouncedInput';
import { CalendarDateRangePicker } from '@/components/DateRangePicker/DateRangePicker';
import { useDateRange } from '@/hooks/useDateRange';
import { PaginationState } from '@tanstack/react-table';
import {
  type MultipleSelectOption,
  SelectMultiple
} from '@/components/ui/SelectMultiple';
import { useDepartments as useSelectedDepartments } from '@/hooks/useDepartments';

export default function Transactions() {
  const dateToday = getDateNow();

  const [searchValue, setSearchValue] = useState<string>('');
  const dateRangeQueryKey = 'transactionDateRange';
  const { data: dateRange } = useDateRange({ queryKey: dateRangeQueryKey });
  const basePageSize = 15;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: basePageSize
  });
  const departments = useDepartmentsHook();
  const selectedDepartmentsQueryKey = 'selectedDepartmentsTransaction';
  const { data: selectedDepartments } = useSelectedDepartments({
    queryKey: selectedDepartmentsQueryKey
  }) as { data: MultipleSelectOption[] | undefined };

  const departmentsOptions = (
    departments: Row<'department'>[] | undefined
  ): MultipleSelectOption[] => {
    if (departments && departments.length > 0) {
      return departments.map((d) => ({
        value: d.external_identifier,
        label: d.name
      }));
    }
    return [];
  };

  const dateRangePresets: DateRangePreset[] = [
    {
      label: 'Síðustu 5 dagar',
      dates: [getDateDaysAgo(4), dateToday]
    },
    {
      label: 'Síðustu 14 dagar',
      dates: [getDateDaysAgo(13), dateToday]
    },
    {
      label: 'Síðustu 30 dagar',
      dates: [getDateDaysAgo(29), dateToday]
    },
    {
      label: 'Síðustu 3 mánuðir',
      dates: [getDateMonthsAgo(3), dateToday]
    },
    {
      label: 'Síðustu 6 mánuðir',
      dates: [getDateMonthsAgo(6), dateToday]
    },
    {
      label: 'Síðustu 12 mánuðir',
      dates: [getDateMonthsAgo(12), dateToday]
    },
    {
      label: 'Fyrra ár',
      dates: [
        getStartOfYear(new Date(new Date().getFullYear() - 1, 1, 1, 0, 0, 0)),
        getEndOfYear(new Date(new Date().getFullYear() - 1, 1, 1, 0, 0, 0))
      ]
    },
    {
      label: 'Núverandi ár',
      dates: [
        getStartOfYear(new Date(new Date().getFullYear(), 1, 1, 1, 0, 0)),
        getEndOfYear(new Date(new Date().getFullYear(), 1, 1, 1, 0, 0))
      ]
    }
  ];

  return (
    <>
      <Header title="Reikningar og hreyfingar" />
      <div className="flex flex-col md:flex-row gap-4 lg:py-6 items-start md:items-center">
        <div className="flex-none">
          <CalendarDateRangePicker
            queryKey={dateRangeQueryKey}
            defaultPreset="Síðustu 30 dagar"
            presets={dateRangePresets}
          />
        </div>
        <div className="flex-auto mt-2">
          <SelectMultiple
            options={departmentsOptions(departments.data)}
            selectPlaceholder={
              selectedDepartments && selectedDepartments?.length > 0
                ? ''
                : 'Allar deildir'
            }
            queryKey={selectedDepartmentsQueryKey}
          ></SelectMultiple>
        </div>
        <div className="flex-none">
          <DebouncedInput
            value={searchValue}
            onChange={(value) => setSearchValue(value as string)}
            name="search"
            placeholder="Leita í lista"
            className="w-96"
          />
        </div>
      </div>

      <TransactionTable
        searchValue={searchValue}
        dates={[dateRange?.from, dateRange?.to]}
        pagination={pagination}
        setPagination={setPagination}
        departmentIds={
          selectedDepartments?.map((o: MultipleSelectOption) => {
            return o?.value;
          }) ?? []
        }
      />
    </>
  );
}
