'use client';
import Header from '@/components/Header/Header';
import { DateRangePreset } from '@/components/ui/DateRangePicker/index.types';
import { useState } from 'react';
import TransactionTable from './transactionTable';
import { DebouncedInput } from '@/components/ui/Input/debouncedInput';
import { CalendarDateRangePicker } from '@/components/DateRangePicker/DateRangePicker';
import { useDateRange } from '@/hooks/useDateRange';
import { useCompany } from '@/hooks/useCompany';
import { formatCurrency } from '@/utils/currency/currency';
import {
  useCurrentStatement,
  useLastStatement
} from '@/utils/react_query_hooks/statement';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { is } from 'date-fns/locale';

export default function Transactions() {
  const [searchValue, setSearchValue] = useState<string>('');
  const dateRangeQueryKey = 'transactionDateRange';
  const { data: dateRange } = useDateRange({
    queryKey: dateRangeQueryKey
  });

  const { company } = useCompany();
  const { data: statement, isFetching: isLoadingLastStatement } =
    useLastStatement({
      date: dateRange?.to,
      accountNumber: company?.external_identifier
    });

  const { data: currentStatement, isFetching: isLoadingCurrentStatement } =
    useCurrentStatement({
      date: new Date(),
      accountNumber: company?.external_identifier
    });

  const getDateRangePresets = () => {
    const dateRangePresets: DateRangePreset[] = Array.from({ length: 7 }).map(
      (_, i) => {
        return {
          label: format(startOfMonth(subMonths(new Date(), i)), 'MMMM yyyy', {
            locale: is
          }),
          dates: [
            startOfMonth(subMonths(new Date(), i)),
            endOfMonth(subMonths(new Date(), i))
          ]
        };
      }
    );
    return dateRangePresets;
  };
  const dateRangePresets = getDateRangePresets();

  return (
    <div>
      <Header title="Hreyfingarlisti">
        <p className="text-company-950 font-medium text-right">
          Upphafsstaða tímabils:
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
        <p className="text-company-950 font-medium text-right">
          Lokastaða tímabils:
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
        <p className="text-company-950 font-medium text-right">
          Lokastaða í dag:
          {isLoadingCurrentStatement ? (
            <Spinner />
          ) : (
            <>
              {statement && (
                <span className="ml-1">
                  {formatCurrency(currentStatement.end_saldo)}
                </span>
              )}
            </>
          )}
        </p>
      </Header>
      <div className="flex flex-col md:flex-row gap-4 lg:py-6 items-start md:items-center justify-between">
        <CalendarDateRangePicker
          queryKey={dateRangeQueryKey}
          defaultPreset={format(
            startOfMonth(subMonths(new Date(), 0)),
            'MMMM yyyy',
            {
              locale: is
            }
          )}
          presets={dateRangePresets}
        />
        <DebouncedInput
          value={searchValue}
          onChange={(value) => setSearchValue(value as string)}
          name="search"
          placeholder="Leita í lista"
          className="w-96"
        />
      </div>

      <TransactionTable
        searchValue={searchValue}
        dates={[dateRange?.from, dateRange?.to]}
      />
    </div>
  );
}
