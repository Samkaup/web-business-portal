'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../Shadcn/ui/popover';
import { Calendar } from '../Shadcn/ui/calendar';
import { is } from 'date-fns/locale';
import { useDateRange, useUpdateDateRange } from '@/hooks/useDateRange';
import { DateRange } from 'react-day-picker';
import { Button } from '../Shadcn/ui/button';

type CalendarDateRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  queryKey: string;
};

export function CalendarDateRangePicker({
  className,
  queryKey
}: CalendarDateRangePickerProps) {
  const { data: dateRange } = useDateRange({ queryKey });
  const { mutate: updateDateRange } = useUpdateDateRange(queryKey);
  const setDate = (newDateRange: DateRange) => {
    if (newDateRange) {
      updateDateRange(newDateRange);
    }
  };
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`daterange-picker-${queryKey}`}
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd. LLL y', { locale: is })} -{' '}
                  {format(dateRange.to, 'dd. LLL y', { locale: is })}
                </>
              ) : (
                format(dateRange.from, 'dd. LLL y', { locale: is })
              )
            ) : (
              <span>Veldu dagsetningu</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
