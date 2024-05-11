'use client';
import Header from '@/components/Header/Header';
import { DateRangePreset } from '@/components/ui/DateRangePicker/index.types';
import { useState } from 'react';
import TransactionTable from './transactionTable';
import { useDepartments as useDepartmentsHook } from '@/utils/react_query_hooks/department';
import { Row } from '@/types';
import { DebouncedInput } from '@/components/ui/Input/debouncedInput';
import { CalendarDateRangePicker } from '@/components/DateRangePicker/DateRangePicker';
import { useDateRange } from '@/hooks/useDateRange';
import {
  type MultipleSelectOption,
  SelectMultiple
} from '@/components/ui/SelectMultiple';
import { useDepartments as useSelectedDepartments } from '@/hooks/useDepartments';
import { useCompany } from '@/hooks/useCompany';
import { formatCurrency } from '@/utils/currency/currency';
import { useLastStatement } from '@/utils/react_query_hooks/statement';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

export default function Transactions() {
  const [searchValue, setSearchValue] = useState<string>('');
  const dateRangeQueryKey = 'transactionDateRange';
  const { data: dateRange } = useDateRange({ queryKey: dateRangeQueryKey });

  const departments = useDepartmentsHook();
  const selectedDepartmentsQueryKey = 'selectedDepartmentsTransaction';
  const { data: selectedDepartments } = useSelectedDepartments({
    queryKey: selectedDepartmentsQueryKey
  }) as { data: MultipleSelectOption[] | undefined };

  const { company } = useCompany();
  const { data: statement, isFetching: isLoadingLastStatement } =
    useLastStatement({
      date: dateRange?.from.toISOString(),
      accountNumber: company?.external_identifier
    });

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
      label: 'Núverandi mánuður',
      dates: [startOfMonth(new Date()), endOfMonth(new Date())]
    },
    {
      label: 'Síðasti mánuður',
      dates: [
        startOfMonth(subMonths(new Date(), 1)),
        endOfMonth(subMonths(new Date(), 1))
      ]
    }
  ];

  return (
    <div>
      <Header title="Hreyfingarlisti">
        <p className="text-company-950 font-semibold">
          Staða í byrjun tímabils:
          {isLoadingLastStatement ? (
            <Spinner />
          ) : (
            <>
              {statement && (
                <span className="ml-1">
                  {formatCurrency(statement.end_saldo)}
                </span>
              )}
            </>
          )}
        </p>
        <p className="text-company-950 font-semibold">
          Staða í lok tímabils:
          {isLoadingLastStatement ? (
            <Spinner />
          ) : (
            <>
              {statement && (
                <span className="ml-1">
                  {formatCurrency(statement.original_saldo)}
                </span>
              )}
            </>
          )}
        </p>
      </Header>
      <div className="flex flex-col md:flex-row gap-4 lg:py-6 items-start md:items-center">
        <div className="flex-none">
          <CalendarDateRangePicker
            queryKey={dateRangeQueryKey}
            defaultPreset="Núverandi mánuður"
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
        departmentIds={
          selectedDepartments?.map((o: MultipleSelectOption) => {
            return o?.value;
          }) ?? []
        }
      />
    </div>
  );
}
